import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
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
  ChevronUp
} from "lucide-react";
const FieldTerrain3D = ({
  talhoes,
  selectedTalhaoId,
  onSelectTalhao,
  compact = false
}) => {
  const mountRef = useRef(null);
  const [activeLayer, setActiveLayer] = useState("risk");
  const [activePreset, setActivePreset] = useState("perspective");
  const [isDroneFlying, setIsDroneFlying] = useState(false);
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [hoveredTalhao, setHoveredTalhao] = useState(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const terrainMeshRef = useRef(null);
  const terrainMaterialRef = useRef(null);
  const droneGroupRef = useRef(null);
  const droneRotorsRef = useRef([]);
  const animationFrameId = useRef(null);
  const targetCameraPos = useRef(new THREE.Vector3(0, 75, 95));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const droneProgress = useRef(0);
  const isDroneFlyingRef = useRef(false);
  const talhoesMeshesRef = useRef(/* @__PURE__ */ new Map());
  const getElevation = (x, z) => {
    const hill1 = Math.sin(x * 0.035) * Math.cos(z * 0.04) * 5.2;
    const hill2 = Math.cos(x * 0.02 + 1.2) * Math.sin(z * 0.025) * 4;
    const baixada = z * 0.04 * -2.5;
    return hill1 + hill2 + baixada;
  };
  const createTerrainTexture = (layer) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 768;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#121813";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    talhoes.forEach((t) => {
      const cx = (t.gridCoordinates[0] + 80) / 160 * canvas.width;
      const cy = (t.gridCoordinates[1] + 60) / 120 * canvas.height;
      const w = t.bounds.width / 160 * canvas.width;
      const h = t.bounds.depth / 120 * canvas.height;
      const x0 = cx - w / 2;
      const y0 = cy - h / 2;
      ctx.save();
      let strokeColor = "#384d3e";
      if (layer === "topography") {
        ctx.fillStyle = t.id === "t-08" || t.id === "t-09" ? "#222d24" : "#1c261e";
        ctx.fillRect(x0 + 4, y0 + 4, w - 8, h - 8);
        ctx.strokeStyle = "#2d3e31";
        ctx.lineWidth = 1.2;
        const step = 6;
        for (let lx = x0 + 8; lx < x0 + w - 8; lx += step) {
          ctx.beginPath();
          ctx.moveTo(lx, y0 + 6);
          ctx.lineTo(lx, y0 + h - 6);
          ctx.stroke();
        }
      } else if (layer === "risk") {
        let fillColor = "rgba(74, 128, 94, 0.55)";
        strokeColor = "#3a6649";
        if (t.riskLevel === "high") {
          const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, Math.max(w, h) * 0.65);
          grad.addColorStop(0, "rgba(235, 115, 81, 0.85)");
          grad.addColorStop(0.5, "rgba(235, 115, 81, 0.45)");
          grad.addColorStop(1, "rgba(180, 80, 50, 0.15)");
          fillColor = grad;
          strokeColor = "#eb7351";
        } else if (t.riskLevel === "medium") {
          const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, Math.max(w, h) * 0.65);
          grad.addColorStop(0, "rgba(209, 163, 66, 0.85)");
          grad.addColorStop(0.6, "rgba(209, 163, 66, 0.4)");
          grad.addColorStop(1, "rgba(160, 120, 40, 0.12)");
          fillColor = grad;
          strokeColor = "#d1a342";
        } else {
          fillColor = "rgba(68, 110, 80, 0.35)";
          strokeColor = "#42684f";
        }
        ctx.fillStyle = fillColor;
        ctx.fillRect(x0 + 4, y0 + 4, w - 8, h - 8);
      } else if (layer === "ndvi") {
        const val = t.ndvi;
        const norm = (val - 0.65) / 0.22;
        const g = Math.floor(110 + norm * 120);
        const r = Math.floor(180 - norm * 110);
        ctx.fillStyle = `rgba(${r}, ${g}, 85, 0.65)`;
        ctx.fillRect(x0 + 4, y0 + 4, w - 8, h - 8);
        strokeColor = `rgb(${r}, ${g}, 85)`;
      }
      ctx.strokeStyle = t.id === selectedTalhaoId ? "#ffffff" : layer === "risk" && t.riskLevel === "high" ? "#eb7351" : "#384d3e";
      ctx.lineWidth = t.id === selectedTalhaoId ? 3.5 : 1.8;
      ctx.strokeRect(x0 + 4, y0 + 4, w - 8, h - 8);
      ctx.fillStyle = t.id === selectedTalhaoId ? "#ffffff" : "#c6d4c5";
      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = "center";
      ctx.fillText(t.code.toUpperCase(), cx, cy - 4);
      ctx.fillStyle = "#8ea290";
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillText(`${t.areaHa} ha`, cx, cy + 14);
      if (layer === "risk" && t.riskLevel === "high") {
        ctx.fillStyle = "#ff8f70";
        ctx.font = 'bold 13px "JetBrains Mono", monospace';
        ctx.fillText(`RISCO ${t.riskPct}%`, cx, cy + 30);
      }
      ctx.restore();
    });
    ctx.strokeStyle = "#273329";
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  };
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const isSoftwareGl = (() => {
      const gl = document.createElement("canvas").getContext("webgl2");
      if (!gl) return true;
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();
    const width = container.clientWidth;
    const height = container.clientHeight || (compact ? 360 : 640);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#090d0a");
    scene.fog = new THREE.FogExp2("#090d0a", 7e-3);
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1e3);
    camera.position.set(0, 75, 95);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: "high-performance",
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.domElement.setAttribute('aria-label', 'Visualização esquemática em 3D; use os botões de talhão para navegar pelos dados demonstrativos.');
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    const hemiLight = new THREE.HemisphereLight("#bed6c5", "#121a14", 0.7);
    hemiLight.position.set(0, 100, 0);
    scene.add(hemiLight);
    const dirLight = new THREE.DirectionalLight("#fff5e4", 1.4);
    dirLight.position.set(60, 90, 40);
    dirLight.castShadow = !isSoftwareGl;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -5e-4;
    scene.add(dirLight);
    const rimLight = new THREE.DirectionalLight("#799f84", 0.5);
    rimLight.position.set(-60, 40, -50);
    scene.add(rimLight);
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
      flatShading: false
    });
    terrainMaterialRef.current = terrainMat;
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = !isSoftwareGl;
    scene.add(terrainMesh);
    terrainMeshRef.current = terrainMesh;
    const talhaoMap = /* @__PURE__ */ new Map();
    talhoes.forEach((t) => {
      const [gx, gz] = t.gridCoordinates;
      const elevation = getElevation(gx, gz);
      const tGroup = new THREE.Group();
      tGroup.position.set(gx, elevation, gz);
      tGroup.userData = { talhao: t };
      const boxGeo = new THREE.BoxGeometry(t.bounds.width - 2, 0.4, t.bounds.depth - 2);
      const boxMat = new THREE.MeshBasicMaterial({
        color: t.riskLevel === "high" ? 15430481 : t.riskLevel === "medium" ? 13738818 : 5933159,
        wireframe: true,
        transparent: true,
        opacity: 0.35
      });
      const boxMesh = new THREE.Mesh(boxGeo, boxMat);
      boxMesh.position.y = 0.2;
      tGroup.add(boxMesh);
      if (t.riskLevel === "high" || t.riskLevel === "medium") {
        const pinHeight = t.riskLevel === "high" ? 7.5 : 5;
        const stemGeo = new THREE.CylinderGeometry(0.18, 0.18, pinHeight, 8);
        const stemMat = new THREE.MeshStandardMaterial({
          color: t.riskLevel === "high" ? 15430481 : 13738818,
          roughness: 0.3
        });
        const stem = new THREE.Mesh(stemGeo, stemMat);
        stem.position.y = pinHeight / 2;
        tGroup.add(stem);
        const headGeo = new THREE.SphereGeometry(0.9, 16, 16);
        const headMat = new THREE.MeshStandardMaterial({
          color: t.riskLevel === "high" ? 16734774 : 15908418,
          emissive: t.riskLevel === "high" ? 6690053 : 4863498,
          roughness: 0.2
        });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = pinHeight + 0.9;
        tGroup.add(head);
      }
      scene.add(tGroup);
      talhaoMap.set(t.id, tGroup);
    });
    talhoesMeshesRef.current = talhaoMap;
    const droneGroup = new THREE.Group();
    droneGroup.position.set(22, 28, -10);
    droneGroupRef.current = droneGroup;
    const fuselageGeo = new THREE.CylinderGeometry(1.4, 1.2, 0.6, 8);
    const fuselageMat = new THREE.MeshStandardMaterial({ color: 2040864, roughness: 0.3, metalness: 0.7 });
    const fuselage = new THREE.Mesh(fuselageGeo, fuselageMat);
    droneGroup.add(fuselage);
    const canopyGeo = new THREE.SphereGeometry(1.1, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const canopyMat = new THREE.MeshStandardMaterial({ color: 8824971, roughness: 0.2, metalness: 0.8 });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.y = 0.3;
    droneGroup.add(canopy);
    const gimbalGeo = new THREE.SphereGeometry(0.55, 12, 12);
    const gimbalMat = new THREE.MeshStandardMaterial({ color: 329734, roughness: 0.1, metalness: 0.9 });
    const gimbal = new THREE.Mesh(gimbalGeo, gimbalMat);
    gimbal.position.y = -0.55;
    droneGroup.add(gimbal);
    const rotors = [];
    const armAngles = [Math.PI / 4, 3 * Math.PI / 4, 5 * Math.PI / 4, 7 * Math.PI / 4];
    armAngles.forEach((angle) => {
      const armGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.2, 6);
      armGeo.rotateZ(Math.PI / 2);
      const armMat = new THREE.MeshStandardMaterial({ color: 2831148, metalness: 0.6 });
      const arm = new THREE.Mesh(armGeo, armMat);
      arm.position.set(Math.cos(angle) * 1.6, 0, Math.sin(angle) * 1.6);
      arm.rotation.y = -angle;
      droneGroup.add(arm);
      const podGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.4, 8);
      const podMat = new THREE.MeshStandardMaterial({ color: 1119762, metalness: 0.8 });
      const pod = new THREE.Mesh(podGeo, podMat);
      pod.position.set(Math.cos(angle) * 3.2, 0.2, Math.sin(angle) * 3.2);
      droneGroup.add(pod);
      const bladeGeo = new THREE.BoxGeometry(2.4, 0.04, 0.22);
      const bladeMat = new THREE.MeshStandardMaterial({ color: 13146963, roughness: 0.4 });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.set(Math.cos(angle) * 3.2, 0.45, Math.sin(angle) * 3.2);
      droneGroup.add(blade);
      rotors.push(blade);
    });
    droneRotorsRef.current = rotors;
    scene.add(droneGroup);
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const handlePointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(terrainMesh);
      if (intersects.length > 0) {
        const point = intersects[0].point;
        let closest = null;
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
    const handlePointerMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(terrainMesh);
      if (intersects.length > 0) {
        const point = intersects[0].point;
        let match = null;
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
    domElement.addEventListener("pointerdown", handlePointerDown);
    domElement.addEventListener("pointermove", handlePointerMove);
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let camSpherical = { radius: 120, theta: 0.1, phi: Math.PI / 4 };
    const onMouseDown = (e) => {
      if (e.button === 0) {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      camSpherical.theta -= dx * 8e-3;
      camSpherical.phi = Math.max(0.12, Math.min(Math.PI / 2.1, camSpherical.phi + dy * 8e-3));
      targetCameraPos.current.x = targetLookAt.current.x + camSpherical.radius * Math.sin(camSpherical.phi) * Math.sin(camSpherical.theta);
      targetCameraPos.current.y = targetLookAt.current.y + camSpherical.radius * Math.cos(camSpherical.phi);
      targetCameraPos.current.z = targetLookAt.current.z + camSpherical.radius * Math.sin(camSpherical.phi) * Math.cos(camSpherical.theta);
    };
    const onMouseUp = () => {
      isDragging = false;
    };
    const onWheel = (e) => {
      e.preventDefault();
      camSpherical.radius = Math.max(45, Math.min(220, camSpherical.radius + e.deltaY * 0.08));
      targetCameraPos.current.x = targetLookAt.current.x + camSpherical.radius * Math.sin(camSpherical.phi) * Math.sin(camSpherical.theta);
      targetCameraPos.current.y = targetLookAt.current.y + camSpherical.radius * Math.cos(camSpherical.phi);
      targetCameraPos.current.z = targetLookAt.current.z + camSpherical.radius * Math.sin(camSpherical.phi) * Math.cos(camSpherical.theta);
    };
    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    domElement.addEventListener("wheel", onWheel, { passive: false });
    const droneWaypoints = [
      new THREE.Vector3(22, 22, -10),
      // Talhão 08
      new THREE.Vector3(62, 24, -10),
      // Talhão 09
      new THREE.Vector3(22, 20, 28),
      // Talhão 13
      new THREE.Vector3(-20, 21, 28),
      // Talhão 12
      new THREE.Vector3(-60, 26, -10),
      // Talhão 05
      new THREE.Vector3(-20, 25, -45)
      // Talhão 02
    ];
    const timer = new THREE.Timer();
    timer.connect(document);
    const animate = () => {
      timer.update();
      const delta = timer.getDelta();
      droneRotorsRef.current.forEach((r) => {
        r.rotation.y += 32 * delta;
      });
      if (droneGroupRef.current) {
        if (isDroneFlyingRef.current) {
          droneProgress.current = (droneProgress.current + delta * 0.12) % droneWaypoints.length;
          const idx = Math.floor(droneProgress.current);
          const nextIdx = (idx + 1) % droneWaypoints.length;
          const factor = droneProgress.current - idx;
          const p1 = droneWaypoints[idx];
          const p2 = droneWaypoints[nextIdx];
          const targetDronePos = new THREE.Vector3().lerpVectors(p1, p2, factor);
          targetDronePos.y += Math.sin(timer.getElapsed() * 3) * 0.6;
          droneGroupRef.current.position.lerp(targetDronePos, 0.08);
          const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
          droneGroupRef.current.rotation.y = Math.atan2(dir.x, dir.z);
          droneGroupRef.current.rotation.z = Math.sin(timer.getElapsed() * 4) * 0.05;
        } else {
          droneGroupRef.current.position.y = 20 + Math.sin(timer.getElapsed() * 2) * 0.4;
        }
      }
      camera.position.lerp(targetCameraPos.current, 0.07);
      currentLookAt.current.lerp(targetLookAt.current, 0.07);
      camera.lookAt(currentLookAt.current);
      renderer.render(scene, camera);
      animationFrameId.current = requestAnimationFrame(animate);
    };
    animationFrameId.current = requestAnimationFrame(animate);
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || (compact ? 360 : 640);
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      timer.dispose();
      window.removeEventListener("resize", handleResize);
      domElement.removeEventListener("pointerdown", handlePointerDown);
      domElement.removeEventListener("pointermove", handlePointerMove);
      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      domElement.removeEventListener("wheel", onWheel);
      renderer.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, [compact, talhoes]);
  useEffect(() => {
    isDroneFlyingRef.current = isDroneFlying;
  }, [isDroneFlying]);
  useEffect(() => {
    if (!terrainMaterialRef.current) return;
    const newTex = createTerrainTexture(activeLayer);
    if (terrainMaterialRef.current.map) {
      terrainMaterialRef.current.map.dispose();
    }
    terrainMaterialRef.current.map = newTex;
    terrainMaterialRef.current.needsUpdate = true;
  }, [activeLayer, selectedTalhaoId]);
  useEffect(() => {
    if (!selectedTalhaoId) return;
    const selected = talhoes.find((t) => t.id === selectedTalhaoId);
    if (!selected) return;
    const [gx, gz] = selected.gridCoordinates;
    const elevation = getElevation(gx, gz);
    targetLookAt.current.set(gx, elevation, gz);
    if (activePreset === "perspective") {
      targetCameraPos.current.set(gx, elevation + 38, gz + 48);
    } else if (activePreset === "topdown") {
      targetCameraPos.current.set(gx, elevation + 75, gz + 0.1);
    } else {
      targetCameraPos.current.set(gx - 40, elevation + 12, gz + 20);
    }
  }, [selectedTalhaoId, activePreset]);
  const setCameraPreset = (preset) => {
    setActivePreset(preset);
    if (preset === "topdown") {
      targetCameraPos.current.set(0, 140, 0.1);
      targetLookAt.current.set(0, 0, 0);
    } else if (preset === "grazing") {
      targetCameraPos.current.set(-70, 22, 60);
      targetLookAt.current.set(10, 5, -10);
    } else {
      targetCameraPos.current.set(0, 75, 95);
      targetLookAt.current.set(0, 0, 0);
    }
  };
  const resetCamera = () => {
    setCameraPreset("perspective");
  };
  return /* @__PURE__ */ jsxs("div", { className: `relative w-full ${compact ? "h-[360px]" : "h-[580px] lg:h-[680px]"} overflow-hidden rounded-xl border border-[#232d26] bg-[#090d0a]`, children: [
    /* @__PURE__ */ jsx("div", { ref: mountRef, className: "w-full h-full cursor-grab active:cursor-grabbing" }),
    /* @__PURE__ */ jsxs("div", { className: "absolute top-4 left-4 z-10 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-[#27352b] bg-[#101712]/85 px-3 py-1.5 text-xs text-[#d6e2d4] backdrop-blur-md shadow-lg", children: [
        /* @__PURE__ */ jsx(Compass, { className: "h-3.5 w-3.5 text-[#70a37e]" }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold tracking-wide", children: "FAZENDA SANTA HELENA" }),
        /* @__PURE__ */ jsx("span", { className: "text-[#6d8071]", children: "\xB7 21\xB010\u2032 S 47\xB048\u2032 O" })
      ] }),
      isDroneFlying && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-[#70a37e]/40 bg-[#16291c]/90 px-3 py-1.5 text-xs text-[#a7d4b2] backdrop-blur-md", children: [
        /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-[#70a37e]" }),
        /* @__PURE__ */ jsx("span", { className: "font-mono uppercase tracking-wider text-[11px]", children: "Rota demonstrativa em simulação" })
      ] })
    ] }),
    hoveredTalhao && /* @__PURE__ */ jsxs("div", { className: "absolute top-4 right-4 z-10 w-64 rounded-xl border border-[#2d3d31] bg-[#121a14]/95 p-3.5 text-xs text-[#e0eae0] shadow-2xl backdrop-blur-md transition-all", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-[#233026] pb-2", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-sm text-white", children: hoveredTalhao.code }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#8fa391]", children: hoveredTalhao.name })
        ] }),
        /* @__PURE__ */ jsxs(
          "span",
          {
            className: `rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${hoveredTalhao.riskLevel === "high" ? "bg-[#eb7351]/20 text-[#ff8f70] border border-[#eb7351]/40" : hoveredTalhao.riskLevel === "medium" ? "bg-[#d1a342]/20 text-[#ebd173] border border-[#d1a342]/40" : "bg-[#639777]/20 text-[#8ec7a0] border border-[#639777]/30"}`,
            children: [
              "Risco ",
              hoveredTalhao.riskPct,
              "%"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2.5 grid grid-cols-2 gap-2 text-[11px]", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-[#728575]", children: "\xC1rea" }),
          /* @__PURE__ */ jsxs("p", { className: "font-mono font-medium text-white", children: [
            hoveredTalhao.areaHa,
            " ha"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-[#728575]", children: "Cultura" }),
          /* @__PURE__ */ jsx("p", { className: "truncate font-medium text-white", children: hoveredTalhao.crop })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-[#728575]", children: "Vigor NDVI" }),
          /* @__PURE__ */ jsx("p", { className: "font-mono font-semibold text-[#8ec7a0]", children: hoveredTalhao.ndvi.toFixed(2) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-[#728575]", children: "Amea\xE7a" }),
          /* @__PURE__ */ jsx("p", { className: "truncate font-medium text-[#e8c07d]", children: hoveredTalhao.primaryThreat })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-[10px] text-[#718274] italic", children: "Clique no talh\xE3o para inspecionar" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[95%] max-w-[840px]", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center -mb-px", children: /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => setIsDockCollapsed(!isDockCollapsed),
          className: "flex items-center gap-1.5 rounded-t-lg border-t border-x border-[#2b3a2f] bg-[#121914] px-3 py-1 text-[11px] font-medium text-[#93a796] hover:text-white transition-colors",
          children: [
            isDockCollapsed ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsx("span", { children: isDockCollapsed ? "Exibir Controles 3D" : "Recolher Dock" })
          ]
        }
      ) }),
      !isDockCollapsed && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#28382c] bg-[#121914]/95 p-3 shadow-2xl backdrop-blur-md", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 bg-[#19231c] p-1 rounded-lg border border-[#2b3b2f]", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase font-mono tracking-wider text-[#708574] px-2", children: "Camadas:" }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActiveLayer("topography"),
              className: `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeLayer === "topography" ? "bg-[#293c2e] text-white shadow" : "text-[#8da090] hover:text-white"}`,
              children: [
                /* @__PURE__ */ jsx(Layers, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsx("span", { children: "Talh\xF5es" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActiveLayer("risk"),
              className: `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeLayer === "risk" ? "bg-[#402b1f] text-[#ffb099] border border-[#eb7351]/40 shadow" : "text-[#8da090] hover:text-white"}`,
              children: [
                /* @__PURE__ */ jsx(Flame, { className: "h-3.5 w-3.5 text-[#eb7351]" }),
                /* @__PURE__ */ jsx("span", { children: "Calor de Risco" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActiveLayer("ndvi"),
              className: `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeLayer === "ndvi" ? "bg-[#1e3b2b] text-[#9de8b2] border border-[#52a66e]/40 shadow" : "text-[#8da090] hover:text-white"}`,
              children: [
                /* @__PURE__ */ jsx(Activity, { className: "h-3.5 w-3.5 text-[#70a37e]" }),
                /* @__PURE__ */ jsx("span", { children: "Vigor NDVI" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 bg-[#19231c] p-1 rounded-lg border border-[#2b3b2f]", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                title: "Vista Perspectiva 3D",
                onClick: () => setCameraPreset("perspective"),
                className: `p-1.5 rounded-md text-xs font-medium transition-colors ${activePreset === "perspective" ? "bg-[#28382d] text-white" : "text-[#7e9181] hover:text-white"}`,
                children: /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                title: "Vista Zenital Superior (Norte)",
                onClick: () => setCameraPreset("topdown"),
                className: `p-1.5 rounded-md text-xs font-medium transition-colors ${activePreset === "topdown" ? "bg-[#28382d] text-white" : "text-[#7e9181] hover:text-white"}`,
                children: /* @__PURE__ */ jsx(Compass, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                title: "Vista Rasante",
                onClick: () => setCameraPreset("grazing"),
                className: `p-1.5 rounded-md text-xs font-medium transition-colors ${activePreset === "grazing" ? "bg-[#28382d] text-white" : "text-[#7e9181] hover:text-white"}`,
                children: /* @__PURE__ */ jsx(Camera, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                title: "Redefinir C\xE2mera",
                onClick: resetCamera,
                className: "p-1.5 rounded-md text-[#7e9181] hover:text-white",
                children: /* @__PURE__ */ jsx(RotateCcw, { className: "h-3.5 w-3.5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setIsDroneFlying(!isDroneFlying),
              "aria-pressed": isDroneFlying,
              className: `flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${isDroneFlying ? "border-[#70a37e] bg-[#1a3322] text-[#b9e5c3]" : "border-[#2d3d30] bg-[#19231b] text-[#9bb09e] hover:bg-[#202d24] hover:text-white"}`,
              children: [
                isDroneFlying ? /* @__PURE__ */ jsx(Pause, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(Play, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsx("span", { children: isDroneFlying ? "Pausar simulação" : "Simular rota" })
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 right-4 hidden md:flex items-center gap-2 rounded-lg border border-[#243026] bg-[#0f1511]/80 px-2.5 py-1 text-[10px] text-[#788a7a]", children: [
      /* @__PURE__ */ jsx("span", { children: "Arraste para girar" }),
      /* @__PURE__ */ jsx("span", { children: "\xB7" }),
      /* @__PURE__ */ jsx("span", { children: "Scroll para zoom" })
    ] })
  ] });
};
export {
  FieldTerrain3D
};
