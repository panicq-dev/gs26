import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Talhao } from '../../types/agro';
import {
  Layers,
  Flame,
  Activity,
  Compass,
  Eye,
  Camera,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  MapPin,
  ShieldAlert,
} from 'lucide-react';

export type MapLayerMode = 'topography' | 'risk' | 'ndvi';
export type CameraPreset = 'perspective' | 'topdown' | 'grazing';

interface FieldTerrain3DProps {
  talhoes: Talhao[];
  selectedTalhaoId?: string | null;
  onSelectTalhao: (talhao: Talhao) => void;
  compact?: boolean;
}

export const FieldTerrain3D: React.FC<FieldTerrain3DProps> = ({
  talhoes,
  selectedTalhaoId,
  onSelectTalhao,
  compact = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState<MapLayerMode>('risk');
  const [activePreset, setActivePreset] = useState<CameraPreset>('perspective');
  const [isDroneFlying, setIsDroneFlying] = useState(false);
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [hoveredTalhao, setHoveredTalhao] = useState<Talhao | null>(null);

  // References across render loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const terrainMeshRef = useRef<THREE.Mesh | null>(null);
  const terrainMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const droneGroupRef = useRef<THREE.Group | null>(null);
  const droneRotorsRef = useRef<THREE.Mesh[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const targetCameraPos = useRef(new THREE.Vector3(0, 75, 95));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const droneProgress = useRef(0);
  const talhoesMeshesRef = useRef<Map<string, THREE.Object3D>>(new Map());

  // Procedural height generator for the terrain
  const getElevation = (x: number, z: number) => {
    // Gentle hills in northwest (x < 0, z < 0) and low valley in baixada (z > 0, x around 0)
    const hill1 = Math.sin(x * 0.035) * Math.cos(z * 0.04) * 5.2;
    const hill2 = Math.cos(x * 0.02 + 1.2) * Math.sin(z * 0.025) * 4.0;
    const baixada = (z * 0.04) * -2.5;
    return hill1 + hill2 + baixada;
  };

  // Generate dynamic canvas textures for the terrain
  const createTerrainTexture = (layer: MapLayerMode): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 768;
    const ctx = canvas.getContext('2d')!;

    // Background base soil / pasture
    ctx.fillStyle = '#121813';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw field parcels (talhões)
    talhoes.forEach((t) => {
      // Convert grid [-80..80, -60..60] to canvas coords [0..1024, 0..768]
      const cx = ((t.gridCoordinates[0] + 80) / 160) * canvas.width;
      const cy = ((t.gridCoordinates[1] + 60) / 120) * canvas.height;
      const w = (t.bounds.width / 160) * canvas.width;
      const h = (t.bounds.depth / 120) * canvas.height;
      const x0 = cx - w / 2;
      const y0 = cy - h / 2;

      ctx.save();
      let strokeColor = '#384d3e';

      if (layer === 'topography') {
        // Natural soil + crop furrows
        ctx.fillStyle = t.id === 't-08' || t.id === 't-09' ? '#222d24' : '#1c261e';
        ctx.fillRect(x0 + 4, y0 + 4, w - 8, h - 8);

        // Crop rows lines
        ctx.strokeStyle = '#2d3e31';
        ctx.lineWidth = 1.2;
        const step = 6;
        for (let lx = x0 + 8; lx < x0 + w - 8; lx += step) {
          ctx.beginPath();
          ctx.moveTo(lx, y0 + 6);
          ctx.lineTo(lx, y0 + h - 6);
          ctx.stroke();
        }
      } else if (layer === 'risk') {
        // Phytosanitary risk heatmap
        let fillColor = 'rgba(74, 128, 94, 0.55)'; // Low risk (green)
        strokeColor = '#3a6649';

        if (t.riskLevel === 'high') {
          // Heatmap gradient
          const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, Math.max(w, h) * 0.65);
          grad.addColorStop(0, 'rgba(235, 115, 81, 0.85)');
          grad.addColorStop(0.5, 'rgba(235, 115, 81, 0.45)');
          grad.addColorStop(1, 'rgba(180, 80, 50, 0.15)');
          fillColor = grad as any;
          strokeColor = '#eb7351';
        } else if (t.riskLevel === 'medium') {
          const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, Math.max(w, h) * 0.65);
          grad.addColorStop(0, 'rgba(209, 163, 66, 0.85)');
          grad.addColorStop(0.6, 'rgba(209, 163, 66, 0.4)');
          grad.addColorStop(1, 'rgba(160, 120, 40, 0.12)');
          fillColor = grad as any;
          strokeColor = '#d1a342';
        } else {
          fillColor = 'rgba(68, 110, 80, 0.35)';
          strokeColor = '#42684f';
        }

        ctx.fillStyle = fillColor;
        ctx.fillRect(x0 + 4, y0 + 4, w - 8, h - 8);
      } else if (layer === 'ndvi') {
        // NDVI Vegetation index: healthy high NDVI (emerald/chartreuse), low NDVI (amber/brown)
        const val = t.ndvi; // 0.69 - 0.85
        const norm = (val - 0.65) / 0.22; // 0..1
        const g = Math.floor(110 + norm * 120);
        const r = Math.floor(180 - norm * 110);
        ctx.fillStyle = `rgba(${r}, ${g}, 85, 0.65)`;
        ctx.fillRect(x0 + 4, y0 + 4, w - 8, h - 8);
        strokeColor = `rgb(${r}, ${g}, 85)`;
      }

      // Border contour of talhão
      ctx.strokeStyle = t.id === selectedTalhaoId ? '#ffffff' : (layer === 'risk' && t.riskLevel === 'high' ? '#eb7351' : '#384d3e');
      ctx.lineWidth = t.id === selectedTalhaoId ? 3.5 : 1.8;
      ctx.strokeRect(x0 + 4, y0 + 4, w - 8, h - 8);

      // Label on canvas
      ctx.fillStyle = t.id === selectedTalhaoId ? '#ffffff' : '#c6d4c5';
      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(t.code.toUpperCase(), cx, cy - 4);

      ctx.fillStyle = '#8ea290';
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillText(`${t.areaHa} ha`, cx, cy + 14);

      if (layer === 'risk' && t.riskLevel === 'high') {
        ctx.fillStyle = '#ff8f70';
        ctx.font = 'bold 13px "JetBrains Mono", monospace';
        ctx.fillText(`RISCO ${t.riskPct}%`, cx, cy + 30);
      }

      ctx.restore();
    });

    // Access roads / farm perimeter
    ctx.strokeStyle = '#273329';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  };

  // Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth;
    const height = container.clientHeight || (compact ? 360 : 640);

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090d0a');
    scene.fog = new THREE.FogExp2('#090d0a', 0.007);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1000);
    camera.position.set(0, 75, 95);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const hemiLight = new THREE.HemisphereLight('#bed6c5', '#121a14', 0.7);
    hemiLight.position.set(0, 100, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight('#fff5e4', 1.4);
    dirLight.position.set(60, 90, 40);
    dirLight.castShadow = !isSoftwareGl;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight('#799f84', 0.5);
    rimLight.position.set(-60, 40, -50);
    scene.add(rimLight);

    // Procedural Terrain Geometry with elevation
    const terrainGeo = new THREE.PlaneGeometry(160, 120, 80, 60);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);
      const vy = getElevation(vx, vz);
      pos.setY(i, vy);
    }
    terrainGeo.computeVertexNormals();

    const initialTexture = createTerrainTexture(activeLayer);
    const terrainMat = new THREE.MeshStandardMaterial({
      map: initialTexture,
      roughness: 0.85,
      metalness: 0.08,
      flatShading: false,
    });
    terrainMaterialRef.current = terrainMat;

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = !isSoftwareGl;
    scene.add(terrainMesh);
    terrainMeshRef.current = terrainMesh;

    // Add Talhões interactive markers / bounds
    const talhaoMap = new Map<string, THREE.Object3D>();
    talhoes.forEach((t) => {
      const [gx, gz] = t.gridCoordinates;
      const elevation = getElevation(gx, gz);

      // Group for each talhão
      const tGroup = new THREE.Group();
      tGroup.position.set(gx, elevation, gz);
      tGroup.userData = { talhao: t };

      // Talhão boundary wireframe box on ground
      const boxGeo = new THREE.BoxGeometry(t.bounds.width - 2, 0.4, t.bounds.depth - 2);
      const boxMat = new THREE.MeshBasicMaterial({
        color: t.riskLevel === 'high' ? 0xeb7351 : t.riskLevel === 'medium' ? 0xd1a342 : 0x5a8867,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      const boxMesh = new THREE.Mesh(boxGeo, boxMat);
      boxMesh.position.y = 0.2;
      tGroup.add(boxMesh);

      // Pin marker for high / medium risk
      if (t.riskLevel === 'high' || t.riskLevel === 'medium') {
        const pinHeight = t.riskLevel === 'high' ? 7.5 : 5.0;
        const stemGeo = new THREE.CylinderGeometry(0.18, 0.18, pinHeight, 8);
        const stemMat = new THREE.MeshStandardMaterial({
          color: t.riskLevel === 'high' ? 0xeb7351 : 0xd1a342,
          roughness: 0.3,
        });
        const stem = new THREE.Mesh(stemGeo, stemMat);
        stem.position.y = pinHeight / 2;
        tGroup.add(stem);

        const headGeo = new THREE.SphereGeometry(0.9, 16, 16);
        const headMat = new THREE.MeshStandardMaterial({
          color: t.riskLevel === 'high' ? 0xff5a36 : 0xf2be42,
          emissive: t.riskLevel === 'high' ? 0x661505 : 0x4a360a,
          roughness: 0.2,
        });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = pinHeight + 0.9;
        tGroup.add(head);
      }

      scene.add(tGroup);
      talhaoMap.set(t.id, tGroup);
    });
    talhoesMeshesRef.current = talhaoMap;

    // Procedural Autonomous Agricultural Drone (3-12 parts THREE.Group)
    const droneGroup = new THREE.Group();
    droneGroup.position.set(22, 28, -10); // hovering above Talhão 08
    droneGroupRef.current = droneGroup;

    // 1. Central Carbon-Fiber Fuselage
    const fuselageGeo = new THREE.CylinderGeometry(1.4, 1.2, 0.6, 8);
    const fuselageMat = new THREE.MeshStandardMaterial({ color: 0x1f2420, roughness: 0.3, metalness: 0.7 });
    const fuselage = new THREE.Mesh(fuselageGeo, fuselageMat);
    droneGroup.add(fuselage);

    // 2. Dome canopy
    const canopyGeo = new THREE.SphereGeometry(1.1, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0x86a88b, roughness: 0.2, metalness: 0.8 });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.y = 0.3;
    droneGroup.add(canopy);

    // 3. Multispectral Sensor Gimbal underneath
    const gimbalGeo = new THREE.SphereGeometry(0.55, 12, 12);
    const gimbalMat = new THREE.MeshStandardMaterial({ color: 0x050806, roughness: 0.1, metalness: 0.9 });
    const gimbal = new THREE.Mesh(gimbalGeo, gimbalMat);
    gimbal.position.y = -0.55;
    droneGroup.add(gimbal);

    // 4. Rotor arms and spinning blades (Quad-Rotor)
    const rotors: THREE.Mesh[] = [];
    const armAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
    armAngles.forEach((angle) => {
      const armGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.2, 6);
      armGeo.rotateZ(Math.PI / 2);
      const armMat = new THREE.MeshStandardMaterial({ color: 0x2b332c, metalness: 0.6 });
      const arm = new THREE.Mesh(armGeo, armMat);
      arm.position.set(Math.cos(angle) * 1.6, 0, Math.sin(angle) * 1.6);
      arm.rotation.y = -angle;
      droneGroup.add(arm);

      // Motor pod
      const podGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.4, 8);
      const podMat = new THREE.MeshStandardMaterial({ color: 0x111612, metalness: 0.8 });
      const pod = new THREE.Mesh(podGeo, podMat);
      pod.position.set(Math.cos(angle) * 3.2, 0.2, Math.sin(angle) * 3.2);
      droneGroup.add(pod);

      // Propeller blades
      const bladeGeo = new THREE.BoxGeometry(2.4, 0.04, 0.22);
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0xc89b53, roughness: 0.4 });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.set(Math.cos(angle) * 3.2, 0.45, Math.sin(angle) * 3.2);
      droneGroup.add(blade);
      rotors.push(blade);
    });
    droneRotorsRef.current = rotors;
    scene.add(droneGroup);

    // Raycasting for click interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(terrainMesh);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        // Find closest talhão by coordinates
        let closest: Talhao | null = null;
        let minDist = Infinity;

        talhoes.forEach((t) => {
          const [gx, gz] = t.gridCoordinates;
          const dist = Math.hypot(point.x - gx, point.z - gz);
          if (dist < Math.max(t.bounds.width, t.bounds.depth) * 0.7 && dist < minDist) {
            minDist = dist;
            closest = t;
          }
        });

        if (closest) {
          onSelectTalhao(closest);
        }
      }
    };

    const handlePointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(terrainMesh);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        let match: Talhao | null = null;
        for (const t of talhoes) {
          const [gx, gz] = t.gridCoordinates;
          const dist = Math.hypot(point.x - gx, point.z - gz);
          if (dist < Math.max(t.bounds.width, t.bounds.depth) * 0.6) {
            match = t;
            break;
          }
        }
        setHoveredTalhao(match);
      } else {
        setHoveredTalhao(null);
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', handlePointerDown);
    domElement.addEventListener('pointermove', handlePointerMove);

    // Drag to orbit camera around center
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let camSpherical = { radius: 120, theta: 0.1, phi: Math.PI / 4 };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      camSpherical.theta -= dx * 0.008;
      camSpherical.phi = Math.max(0.12, Math.min(Math.PI / 2.1, camSpherical.phi + dy * 0.008));

      targetCameraPos.current.x = targetLookAt.current.x + camSpherical.radius * Math.sin(camSpherical.phi) * Math.sin(camSpherical.theta);
      targetCameraPos.current.y = targetLookAt.current.y + camSpherical.radius * Math.cos(camSpherical.phi);
      targetCameraPos.current.z = targetLookAt.current.z + camSpherical.radius * Math.sin(camSpherical.phi) * Math.cos(camSpherical.theta);
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camSpherical.radius = Math.max(45, Math.min(220, camSpherical.radius + e.deltaY * 0.08));
      targetCameraPos.current.x = targetLookAt.current.x + camSpherical.radius * Math.sin(camSpherical.phi) * Math.sin(camSpherical.theta);
      targetCameraPos.current.y = targetLookAt.current.y + camSpherical.radius * Math.cos(camSpherical.phi);
      targetCameraPos.current.z = targetLookAt.current.z + camSpherical.radius * Math.sin(camSpherical.phi) * Math.cos(camSpherical.theta);
    };

    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // Waypoints for drone flight path
    const droneWaypoints = [
      new THREE.Vector3(22, 22, -10), // Talhão 08
      new THREE.Vector3(62, 24, -10), // Talhão 09
      new THREE.Vector3(22, 20, 28),  // Talhão 13
      new THREE.Vector3(-20, 21, 28), // Talhão 12
      new THREE.Vector3(-60, 26, -10),// Talhão 05
      new THREE.Vector3(-20, 25, -45),// Talhão 02
    ];

    // Smooth Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();

      // Spin drone blades
      droneRotorsRef.current.forEach((r) => {
        r.rotation.y += 32 * delta;
      });

      // Drone flight animation along route
      if (droneGroupRef.current) {
        if (isDroneFlying) {
          droneProgress.current = (droneProgress.current + delta * 0.12) % droneWaypoints.length;
          const idx = Math.floor(droneProgress.current);
          const nextIdx = (idx + 1) % droneWaypoints.length;
          const factor = droneProgress.current - idx;

          const p1 = droneWaypoints[idx];
          const p2 = droneWaypoints[nextIdx];
          const targetDronePos = new THREE.Vector3().lerpVectors(p1, p2, factor);
          targetDronePos.y += Math.sin(clock.getElapsedTime() * 3) * 0.6; // gentle hover bobbing

          droneGroupRef.current.position.lerp(targetDronePos, 0.08);

          // Tilt drone towards movement
          const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
          droneGroupRef.current.rotation.y = Math.atan2(dir.x, dir.z);
          droneGroupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 4) * 0.05;
        } else {
          // Stationary gentle hover over focus field
          droneGroupRef.current.position.y = 20 + Math.sin(clock.getElapsedTime() * 2) * 0.4;
        }
      }

      // Smooth Camera Damping towards target
      camera.position.lerp(targetCameraPos.current, 0.07);
      currentLookAt.current.lerp(targetLookAt.current, 0.07);
      camera.lookAt(currentLookAt.current);

      renderer.render(scene, camera);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    // Resize observer
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || (compact ? 360 : 640);
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('pointerdown', handlePointerDown);
      domElement.removeEventListener('pointermove', handlePointerMove);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);

      renderer.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, [compact, talhoes]);

  // Update texture when layer changes or selected talhão changes
  useEffect(() => {
    if (!terrainMaterialRef.current) return;
    const newTex = createTerrainTexture(activeLayer);
    if (terrainMaterialRef.current.map) {
      terrainMaterialRef.current.map.dispose();
    }
    terrainMaterialRef.current.map = newTex;
    terrainMaterialRef.current.needsUpdate = true;
  }, [activeLayer, selectedTalhaoId]);

  // Focus camera when selectedTalhaoId changes
  useEffect(() => {
    if (!selectedTalhaoId) return;
    const selected = talhoes.find((t) => t.id === selectedTalhaoId);
    if (!selected) return;

    const [gx, gz] = selected.gridCoordinates;
    const elevation = getElevation(gx, gz);

    targetLookAt.current.set(gx, elevation, gz);

    if (activePreset === 'perspective') {
      targetCameraPos.current.set(gx, elevation + 38, gz + 48);
    } else if (activePreset === 'topdown') {
      targetCameraPos.current.set(gx, elevation + 75, gz + 0.1);
    } else {
      targetCameraPos.current.set(gx - 40, elevation + 12, gz + 20);
    }
  }, [selectedTalhaoId, activePreset]);

  // Handle Preset Changes
  const setCameraPreset = (preset: CameraPreset) => {
    setActivePreset(preset);
    if (preset === 'topdown') {
      targetCameraPos.current.set(0, 140, 0.1);
      targetLookAt.current.set(0, 0, 0);
    } else if (preset === 'grazing') {
      targetCameraPos.current.set(-70, 22, 60);
      targetLookAt.current.set(10, 5, -10);
    } else {
      targetCameraPos.current.set(0, 75, 95);
      targetLookAt.current.set(0, 0, 0);
    }
  };

  const resetCamera = () => {
    setCameraPreset('perspective');
  };

  return (
    <div className={`relative w-full ${compact ? 'h-[360px]' : 'h-[580px] lg:h-[680px]'} overflow-hidden rounded-xl border border-[#232d26] bg-[#090d0a]`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Overlay Badge & Compass */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-[#27352b] bg-[#101712]/85 px-3 py-1.5 text-xs text-[#d6e2d4] backdrop-blur-md shadow-lg">
          <Compass className="h-3.5 w-3.5 text-[#70a37e]" />
          <span className="font-semibold tracking-wide">FAZENDA SANTA HELENA</span>
          <span className="text-[#6d8071]">· 21°10′ S 47°48′ O</span>
        </div>

        {isDroneFlying && (
          <div className="flex items-center gap-2 rounded-lg border border-[#70a37e]/40 bg-[#16291c]/90 px-3 py-1.5 text-xs text-[#a7d4b2] backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#70a37e]" />
            <span className="font-mono uppercase tracking-wider text-[11px]">Inspeção Drone Ativa</span>
          </div>
        )}
      </div>

      {/* Hovered / Active Talhão Micro-card */}
      {hoveredTalhao && (
        <div className="absolute top-4 right-4 z-10 w-64 rounded-xl border border-[#2d3d31] bg-[#121a14]/95 p-3.5 text-xs text-[#e0eae0] shadow-2xl backdrop-blur-md transition-all">
          <div className="flex items-center justify-between border-b border-[#233026] pb-2">
            <div>
              <span className="font-bold text-sm text-white">{hoveredTalhao.code}</span>
              <p className="text-[11px] text-[#8fa391]">{hoveredTalhao.name}</p>
            </div>
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                hoveredTalhao.riskLevel === 'high'
                  ? 'bg-[#eb7351]/20 text-[#ff8f70] border border-[#eb7351]/40'
                  : hoveredTalhao.riskLevel === 'medium'
                  ? 'bg-[#d1a342]/20 text-[#ebd173] border border-[#d1a342]/40'
                  : 'bg-[#639777]/20 text-[#8ec7a0] border border-[#639777]/30'
              }`}
            >
              Risco {hoveredTalhao.riskPct}%
            </span>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-[#728575]">Área</span>
              <p className="font-mono font-medium text-white">{hoveredTalhao.areaHa} ha</p>
            </div>
            <div>
              <span className="text-[#728575]">Cultura</span>
              <p className="truncate font-medium text-white">{hoveredTalhao.crop}</p>
            </div>
            <div>
              <span className="text-[#728575]">Vigor NDVI</span>
              <p className="font-mono font-semibold text-[#8ec7a0]">{hoveredTalhao.ndvi.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-[#728575]">Ameaça</span>
              <p className="truncate font-medium text-[#e8c07d]">{hoveredTalhao.primaryThreat}</p>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-[#718274] italic">Clique no talhão para inspecionar</p>
        </div>
      )}

      {/* Ergonomic Collapsible Bottom Control Dock (Zero Viewport Occlusion) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[95%] max-w-[840px]">
        {/* Toggle Collapse Edge Button */}
        <div className="flex justify-center -mb-px">
          <button
            type="button"
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="flex items-center gap-1.5 rounded-t-lg border-t border-x border-[#2b3a2f] bg-[#121914] px-3 py-1 text-[11px] font-medium text-[#93a796] hover:text-white transition-colors"
          >
            {isDockCollapsed ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            <span>{isDockCollapsed ? 'Exibir Controles 3D' : 'Recolher Dock'}</span>
          </button>
        </div>

        {!isDockCollapsed && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#28382c] bg-[#121914]/95 p-3 shadow-2xl backdrop-blur-md">
            {/* Layer Selector */}
            <div className="flex items-center gap-1 bg-[#19231c] p-1 rounded-lg border border-[#2b3b2f]">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#708574] px-2">Camadas:</span>
              <button
                type="button"
                onClick={() => setActiveLayer('topography')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeLayer === 'topography'
                    ? 'bg-[#293c2e] text-white shadow'
                    : 'text-[#8da090] hover:text-white'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Talhões</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveLayer('risk')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeLayer === 'risk'
                    ? 'bg-[#402b1f] text-[#ffb099] border border-[#eb7351]/40 shadow'
                    : 'text-[#8da090] hover:text-white'
                }`}
              >
                <Flame className="h-3.5 w-3.5 text-[#eb7351]" />
                <span>Calor de Risco</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveLayer('ndvi')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeLayer === 'ndvi'
                    ? 'bg-[#1e3b2b] text-[#9de8b2] border border-[#52a66e]/40 shadow'
                    : 'text-[#8da090] hover:text-white'
                }`}
              >
                <Activity className="h-3.5 w-3.5 text-[#70a37e]" />
                <span>Vigor NDVI</span>
              </button>
            </div>

            {/* Camera Presets & Drone Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[#19231c] p-1 rounded-lg border border-[#2b3b2f]">
                <button
                  type="button"
                  title="Vista Perspectiva 3D"
                  onClick={() => setCameraPreset('perspective')}
                  className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                    activePreset === 'perspective' ? 'bg-[#28382d] text-white' : 'text-[#7e9181] hover:text-white'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Vista Zenital Superior (Norte)"
                  onClick={() => setCameraPreset('topdown')}
                  className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                    activePreset === 'topdown' ? 'bg-[#28382d] text-white' : 'text-[#7e9181] hover:text-white'
                  }`}
                >
                  <Compass className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Vista Rasante"
                  onClick={() => setCameraPreset('grazing')}
                  className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                    activePreset === 'grazing' ? 'bg-[#28382d] text-white' : 'text-[#7e9181] hover:text-white'
                  }`}
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Redefinir Câmera"
                  onClick={resetCamera}
                  className="p-1.5 rounded-md text-[#7e9181] hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Drone Button */}
              <button
                type="button"
                onClick={() => setIsDroneFlying(!isDroneFlying)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  isDroneFlying
                    ? 'border-[#70a37e] bg-[#1a3322] text-[#b9e5c3]'
                    : 'border-[#2d3d30] bg-[#19231b] text-[#9bb09e] hover:bg-[#202d24] hover:text-white'
                }`}
              >
                {isDroneFlying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isDroneFlying ? 'Pausar Drone' : 'Voo Drone'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Subtle Bottom-Right Navigation Legend */}
      <div className="absolute bottom-4 right-4 hidden md:flex items-center gap-2 rounded-lg border border-[#243026] bg-[#0f1511]/80 px-2.5 py-1 text-[10px] text-[#788a7a]">
        <span>Arraste para girar</span>
        <span>·</span>
        <span>Scroll para zoom</span>
      </div>
    </div>
  );
};
