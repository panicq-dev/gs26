export type RiskLevel = 'low' | 'medium' | 'high';

export interface Talhao {
  id: string;
  code: string;
  name: string;
  sector: string;
  areaHa: number;
  crop: string;
  variety: string;
  soilType: string;
  elevationM: number;
  moisturePct: number;
  temperatureC: number;
  riskLevel: RiskLevel;
  riskPct: number;
  primaryThreat: string;
  threatType: 'insect' | 'fungus' | 'weed';
  ndvi: number;
  lastDronePass: string;
  sprayWindowStatus: 'open' | 'closing' | 'closed';
  gridCoordinates: [number, number]; // center on 3D grid [-x..x, -z..z]
  bounds: { width: number; depth: number };
}

export interface PestRecord {
  id: string;
  name: string;
  scientificName: string;
  cropTarget: string;
  riskLevel: RiskLevel;
  probabilityPct: number;
  primaryLocation: string;
  affectedTalhoes: string[];
  damageDescription: string;
  economicThreshold: string;
  activeIngredient: string;
  dosagePerHa: string;
  biologicalAlternative: string;
  urgencyHours: number;
  color: string;
}

export interface SupplyItem {
  id: string;
  name: string;
  category: 'Fertilizante' | 'Inseticida' | 'Biológico' | 'Adjuvante' | 'Desfolhante';
  currentStock: number;
  unit: 't' | 'kg' | 'L';
  minimumSafeStock: number;
  consumptionPerDay: number;
  daysRemaining: number;
  targetTalhoes: string[];
  lastSupplier: string;
  status: 'optimal' | 'warning' | 'critical';
}

export interface SupplierItem {
  id: string;
  name: string;
  city: string;
  state: string;
  categories: string[];
  leadTimeDays: number;
  rating: number;
  reliabilityPct: number;
  certified: boolean;
  phone: string;
  email: string;
}

export interface WeatherHour {
  hour: string;
  temp: number;
  rainProb: number;
  rainMm: number;
  windSpeed: number;
  humidity: number;
  sprayStatus: 'ideal' | 'alerta' | 'inadequado';
}

export interface FinancialSimulation {
  hectaresTreated: number;
  pesticideCostPerHa: number;
  cottonPricePerArroba: number;
  currentProductivity: number; // arrobas por hectare
  damageAvoidedPct: number;
  sprayingDelayDays: number;
}
