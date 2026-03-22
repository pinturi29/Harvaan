import { FarmData, CropScore } from "@/context/FarmContext";

// ─── Crop Database ────────────────────────────────────────────────────────────

export interface CropProfile {
  name: string;
  emoji: string;
  category: string;
  idealPh: [number, number];
  idealNitrogen: [number, number];
  idealPhosphorus: [number, number];
  idealPotassium: [number, number];
  idealOrganicCarbon: [number, number];
  compatibleSoils: string[];
  waterNeed: "low" | "medium" | "high";
  compatibleIrrigation: string[];
  season: string;
  duration: string;
  yieldRange: [number, number]; // kg/ha
  priceRange: [number, number]; // ₹/kg
  inputCostPerHa: number;       // ₹/ha
}

export const CROP_DATABASE: Record<string, CropProfile> = {
  turmeric: {
    name: "Turmeric", emoji: "🟡", category: "Spice",
    idealPh: [5.5, 7.0], idealNitrogen: [120, 200], idealPhosphorus: [20, 40],
    idealPotassium: [150, 250], idealOrganicCarbon: [0.8, 2.0],
    compatibleSoils: ["loam", "clay-loam", "sandy-loam", "silt"],
    waterNeed: "medium", compatibleIrrigation: ["drip", "sprinkler", "flood"],
    season: "Kharif (Jun–Jul planting)", duration: "8–9 months",
    yieldRange: [2500, 6000], priceRange: [90, 180], inputCostPerHa: 95000,
  },
  "red-chili": {
    name: "Red Chili", emoji: "🌶️", category: "Spice",
    idealPh: [6.0, 7.0], idealNitrogen: [150, 250], idealPhosphorus: [25, 45],
    idealPotassium: [150, 280], idealOrganicCarbon: [0.6, 1.5],
    compatibleSoils: ["loam", "clay-loam", "sandy-loam"],
    waterNeed: "medium", compatibleIrrigation: ["drip", "flood", "sprinkler"],
    season: "Kharif (Jun–Jul) / Rabi (Oct–Nov)", duration: "5–6 months",
    yieldRange: [1500, 4000], priceRange: [80, 200], inputCostPerHa: 75000,
  },
  cotton: {
    name: "Cotton", emoji: "☁️", category: "Cash Crop",
    idealPh: [5.8, 8.0], idealNitrogen: [80, 150], idealPhosphorus: [15, 30],
    idealPotassium: [120, 220], idealOrganicCarbon: [0.4, 1.2],
    compatibleSoils: ["clay", "loam", "clay-loam", "silt"],
    waterNeed: "medium", compatibleIrrigation: ["rainfed", "flood", "drip"],
    season: "Kharif (May–Jul planting)", duration: "5–7 months",
    yieldRange: [900, 2200], priceRange: [55, 75], inputCostPerHa: 65000,
  },
  "paddy-rice": {
    name: "Paddy Rice", emoji: "🌾", category: "Staple",
    idealPh: [5.5, 6.5], idealNitrogen: [100, 180], idealPhosphorus: [20, 40],
    idealPotassium: [100, 200], idealOrganicCarbon: [0.5, 1.5],
    compatibleSoils: ["clay", "silt", "clay-loam", "loam"],
    waterNeed: "high", compatibleIrrigation: ["flood", "canal"],
    season: "Kharif (Jun–Jul) / Rabi (Nov–Dec)", duration: "3–5 months",
    yieldRange: [2500, 5000], priceRange: [18, 28], inputCostPerHa: 45000,
  },
  groundnut: {
    name: "Groundnut", emoji: "🥜", category: "Oilseed",
    idealPh: [6.0, 7.0], idealNitrogen: [20, 80], idealPhosphorus: [20, 40],
    idealPotassium: [100, 200], idealOrganicCarbon: [0.5, 1.5],
    compatibleSoils: ["sandy", "sandy-loam", "loam"],
    waterNeed: "medium", compatibleIrrigation: ["rainfed", "drip", "sprinkler"],
    season: "Kharif (Jun–Jul) / Rabi (Oct–Nov)", duration: "4–5 months",
    yieldRange: [1200, 2800], priceRange: [50, 80], inputCostPerHa: 40000,
  },
  maize: {
    name: "Maize", emoji: "🌽", category: "Cereal",
    idealPh: [5.8, 7.0], idealNitrogen: [120, 220], idealPhosphorus: [20, 45],
    idealPotassium: [100, 200], idealOrganicCarbon: [0.5, 1.5],
    compatibleSoils: ["loam", "sandy-loam", "clay-loam", "silt"],
    waterNeed: "medium", compatibleIrrigation: ["rainfed", "drip", "flood", "sprinkler"],
    season: "Kharif (Jun) / Rabi (Nov)", duration: "3–4 months",
    yieldRange: [4000, 9000], priceRange: [18, 28], inputCostPerHa: 38000,
  },
  sesame: {
    name: "Sesame", emoji: "🌿", category: "Oilseed",
    idealPh: [5.5, 7.5], idealNitrogen: [30, 80], idealPhosphorus: [15, 35],
    idealPotassium: [80, 180], idealOrganicCarbon: [0.4, 1.2],
    compatibleSoils: ["sandy", "sandy-loam", "loam"],
    waterNeed: "low", compatibleIrrigation: ["rainfed", "drip"],
    season: "Kharif (Jun–Jul)", duration: "3–4 months",
    yieldRange: [400, 900], priceRange: [100, 180], inputCostPerHa: 25000,
  },
  lemongrass: {
    name: "Lemongrass", emoji: "🍋", category: "Essential Oil",
    idealPh: [5.5, 7.5], idealNitrogen: [80, 160], idealPhosphorus: [20, 40],
    idealPotassium: [100, 200], idealOrganicCarbon: [0.5, 1.5],
    compatibleSoils: ["loam", "sandy-loam", "clay-loam"],
    waterNeed: "low", compatibleIrrigation: ["rainfed", "drip", "sprinkler"],
    season: "Year-round (perennial)", duration: "Perennial – harvest every 3 months",
    yieldRange: [15000, 35000], priceRange: [3.5, 6], inputCostPerHa: 45000,
  },
  sugarcane: {
    name: "Sugarcane", emoji: "🎋", category: "Cash Crop",
    idealPh: [6.0, 7.5], idealNitrogen: [150, 250], idealPhosphorus: [25, 50],
    idealPotassium: [150, 280], idealOrganicCarbon: [0.6, 1.5],
    compatibleSoils: ["loam", "clay-loam", "clay", "silt"],
    waterNeed: "high", compatibleIrrigation: ["flood", "drip", "canal"],
    season: "Planted Oct–Nov (ratoon crop)", duration: "12–18 months",
    yieldRange: [50000, 100000], priceRange: [2.8, 3.5], inputCostPerHa: 85000,
  },
  "black-gram": {
    name: "Black Gram", emoji: "🫘", category: "Pulse",
    idealPh: [6.0, 7.5], idealNitrogen: [15, 50], idealPhosphorus: [15, 30],
    idealPotassium: [80, 160], idealOrganicCarbon: [0.5, 1.2],
    compatibleSoils: ["loam", "clay-loam", "sandy-loam"],
    waterNeed: "low", compatibleIrrigation: ["rainfed", "drip"],
    season: "Kharif (Jun–Jul) / Rabi (Oct–Nov)", duration: "2.5–3 months",
    yieldRange: [600, 1200], priceRange: [65, 90], inputCostPerHa: 22000,
  },
  tomato: {
    name: "Tomato", emoji: "🍅", category: "Vegetable",
    idealPh: [6.0, 7.0], idealNitrogen: [150, 250], idealPhosphorus: [30, 60],
    idealPotassium: [150, 280], idealOrganicCarbon: [0.8, 1.8],
    compatibleSoils: ["loam", "sandy-loam", "clay-loam"],
    waterNeed: "medium", compatibleIrrigation: ["drip", "sprinkler"],
    season: "Kharif / Rabi / Summer", duration: "3–4 months",
    yieldRange: [20000, 50000], priceRange: [8, 25], inputCostPerHa: 80000,
  },
  onion: {
    name: "Onion", emoji: "🧅", category: "Vegetable",
    idealPh: [6.0, 7.5], idealNitrogen: [100, 180], idealPhosphorus: [30, 60],
    idealPotassium: [100, 200], idealOrganicCarbon: [0.6, 1.5],
    compatibleSoils: ["loam", "sandy-loam", "silt"],
    waterNeed: "medium", compatibleIrrigation: ["drip", "sprinkler", "flood"],
    season: "Rabi (Oct–Nov planting)", duration: "4–5 months",
    yieldRange: [15000, 35000], priceRange: [10, 30], inputCostPerHa: 70000,
  },
  sunflower: {
    name: "Sunflower", emoji: "🌻", category: "Oilseed",
    idealPh: [6.0, 7.5], idealNitrogen: [80, 160], idealPhosphorus: [20, 45],
    idealPotassium: [100, 200], idealOrganicCarbon: [0.5, 1.5],
    compatibleSoils: ["loam", "sandy-loam", "clay-loam"],
    waterNeed: "medium", compatibleIrrigation: ["rainfed", "drip", "flood"],
    season: "Kharif / Rabi / Summer", duration: "3–4 months",
    yieldRange: [1200, 2500], priceRange: [45, 70], inputCostPerHa: 35000,
  },
  mango: {
    name: "Mango", emoji: "🥭", category: "Horticulture",
    idealPh: [5.5, 7.5], idealNitrogen: [60, 120], idealPhosphorus: [15, 40],
    idealPotassium: [100, 200], idealOrganicCarbon: [0.5, 1.5],
    compatibleSoils: ["loam", "sandy-loam", "clay-loam"],
    waterNeed: "low", compatibleIrrigation: ["rainfed", "drip"],
    season: "Flowering Feb–Mar (perennial)", duration: "Perennial – 3–5 yrs to first yield",
    yieldRange: [5000, 15000], priceRange: [25, 80], inputCostPerHa: 50000,
  },
  coconut: {
    name: "Coconut", emoji: "🥥", category: "Horticulture",
    idealPh: [5.2, 8.0], idealNitrogen: [60, 120], idealPhosphorus: [15, 35],
    idealPotassium: [150, 300], idealOrganicCarbon: [0.5, 1.5],
    compatibleSoils: ["sandy", "sandy-loam", "loam"],
    waterNeed: "medium", compatibleIrrigation: ["drip", "flood"],
    season: "Year-round (perennial)", duration: "Perennial – 6–7 yrs to first yield",
    yieldRange: [60, 120], priceRange: [12, 22], inputCostPerHa: 40000, // per tree approximation
  },
};

// ─── Data completeness ────────────────────────────────────────────────────────

/** Returns 0–100: how much soil data the farmer provided. */
export function dataCoverage(farmData: FarmData): number {
  let filled = 0;
  const checks: boolean[] = [
    !!farmData.state,
    !!farmData.currentCrop,
    !!farmData.soilType,
    !!farmData.ph,
    !!farmData.nitrogen,
    !!farmData.phosphorus,
    !!farmData.potassium,
    !!farmData.organicCarbon,
    !!farmData.drainage,
    !!farmData.irrigationType,
    !!farmData.landSize,
    !!farmData.avgYield,
    !!farmData.currentPrice,
    !!farmData.annualInputCost,
  ];
  checks.forEach((c) => { if (c) filled++; });
  return Math.round((filled / checks.length) * 100);
}

/** True when there is enough soil data to give meaningful per-crop scores. */
export function hasSufficientSoilData(farmData: FarmData): boolean {
  const soilFields = [farmData.ph, farmData.nitrogen, farmData.phosphorus, farmData.potassium].filter(Boolean);
  return soilFields.length >= 2 || !!farmData.soilType;
}

// ─── Scoring helpers ──────────────────────────────────────────────────────────

/** Score a single parameter against an ideal range. Returns 0–100.
 *  If value is 0/falsy (not provided), returns the neutral midpoint (50)
 *  rather than penalising the crop. */
function scoreParam(value: number, ideal: [number, number]): number {
  if (!value) return 50; // unknown — don't penalise
  const [lo, hi] = ideal;
  if (value >= lo && value <= hi) return 100;
  const range = hi - lo;
  if (value < lo) return Math.max(0, 100 - ((lo - value) / (range + 1)) * 100);
  return Math.max(0, 100 - ((value - hi) / (range + 1)) * 100);
}

export function scoreSoilFit(farmData: FarmData, crop: CropProfile): number {
  // If we don't have enough soil data, return 50 (neutral) rather than misleading scores
  if (!hasSufficientSoilData(farmData)) return 50;

  const phScore   = scoreParam(farmData.ph, crop.idealPh) * 0.25;
  const nScore    = scoreParam(farmData.nitrogen, crop.idealNitrogen) * 0.20;
  const pScore    = scoreParam(farmData.phosphorus, crop.idealPhosphorus) * 0.15;
  const kScore    = scoreParam(farmData.potassium, crop.idealPotassium) * 0.15;
  const ocScore   = scoreParam(farmData.organicCarbon, crop.idealOrganicCarbon) * 0.15;
  // Soil type: if not provided, use neutral 60 instead of heavily penalising
  const soilMatch = !farmData.soilType ? 60 : crop.compatibleSoils.includes(farmData.soilType) ? 100 : 30;
  const soilScore = soilMatch * 0.10;
  return Math.round(phScore + nScore + pScore + kScore + ocScore + soilScore);
}

export function calculateProfit(
  farmData: FarmData,
  crop: CropProfile,
  soilFit: number,
): CropScore["estimatedYield"] & { revenue: CropScore["estimatedRevenue"]; inputCost: number; profit: CropScore["estimatedProfit"]; profitVsCurrent: number } {
  const fitMult = 0.6 + (soilFit / 100) * 0.4;
  const [yLo, yHi] = crop.yieldRange;
  const yMid = (yLo + yHi) / 2;

  const yieldLow  = Math.round(yLo * fitMult);
  const yieldMid  = Math.round(yMid * fitMult);
  const yieldHigh = Math.round(yHi * fitMult);

  const [pLo, pHi] = crop.priceRange;
  const pMid = (pLo + pHi) / 2;

  const revLow  = Math.round(yieldLow  * pLo * farmData.landSize);
  const revMid  = Math.round(yieldMid  * pMid * farmData.landSize);
  const revHigh = Math.round(yieldHigh * pHi  * farmData.landSize);

  const inputCost = Math.round(crop.inputCostPerHa * farmData.landSize);

  const profitLow  = revLow  - inputCost;
  const profitMid  = revMid  - inputCost;
  const profitHigh = revHigh - inputCost;

  const currentRevenue = farmData.avgYield * farmData.currentPrice * farmData.landSize - farmData.annualInputCost;
  const profitVsCurrent = profitMid - currentRevenue;

  return {
    low: yieldLow, mid: yieldMid, high: yieldHigh,
    revenue: { low: revLow, mid: revMid, high: revHigh },
    inputCost,
    profit: { low: profitLow, mid: profitMid, high: profitHigh },
    profitVsCurrent,
  };
}

export function assessRisk(farmData: FarmData, crop: CropProfile, soilFit: number): number {
  // Price volatility (spread as % of midpoint)
  const [pLo, pHi] = crop.priceRange;
  const priceVolatility = ((pHi - pLo) / ((pLo + pHi) / 2)) * 100;
  const priceRisk = Math.min(100, priceVolatility * 1.5);

  // Yield volatility
  const [yLo, yHi] = crop.yieldRange;
  const yieldVolatility = ((yHi - yLo) / ((yLo + yHi) / 2)) * 100;
  const yieldRisk = Math.min(100, yieldVolatility);

  // Water risk
  const irrigMatch = crop.compatibleIrrigation.includes(farmData.irrigationType);
  const waterRisk = irrigMatch ? 0 : (crop.waterNeed === "high" ? 80 : 40);

  // Transition difficulty (how different from current?)
  const isNewCategory = !farmData.currentCrop.toLowerCase().includes(crop.name.toLowerCase().split(" ")[0]);
  const transitionRisk = isNewCategory ? 40 : 15;

  // Financial risk
  const inputCostTotal = crop.inputCostPerHa * farmData.landSize;
  const affordability = farmData.annualInputCost > 0
    ? Math.min(100, (inputCostTotal / farmData.annualInputCost) * 50)
    : 50;

  const totalRisk = (priceRisk * 0.25 + yieldRisk * 0.20 + waterRisk * 0.25 + transitionRisk * 0.15 + affordability * 0.15);

  // Adjust for risk tolerance
  const toleranceMult = farmData.riskTolerance === "high" ? 0.8 : farmData.riskTolerance === "low" ? 1.2 : 1.0;
  return Math.round(Math.min(100, totalRisk * toleranceMult));
}

export function rankCrops(farmData: FarmData): CropScore[] {
  const scored: CropScore[] = Object.entries(CROP_DATABASE).map(([key, crop]) => {
    const soilFit     = scoreSoilFit(farmData, crop);
    const profitData  = calculateProfit(farmData, crop, soilFit);
    const riskScore   = assessRisk(farmData, crop, soilFit);

    // Profitability score 0-100 based on profit vs typical range
    const maxExpectedProfit = crop.yieldRange[1] * crop.priceRange[1] * farmData.landSize;
    const profitScore = Math.min(100, Math.max(0,
      maxExpectedProfit > 0 ? (profitData.profit.mid / maxExpectedProfit) * 100 : 0
    ));

    // Composite: 40% soil fit + 35% profitability + 25% inverse risk
    const compositeScore = Math.round(
      soilFit * 0.40 +
      profitScore * 0.35 +
      (100 - riskScore) * 0.25
    );

    const riskLevel: "Low" | "Medium" | "High" =
      riskScore < 35 ? "Low" : riskScore < 65 ? "Medium" : "High";

    return {
      name: crop.name,
      emoji: crop.emoji,
      soilFit,
      profitScore,
      riskScore,
      compositeScore,
      estimatedYield: { low: profitData.low, mid: profitData.mid, high: profitData.high },
      estimatedRevenue: profitData.revenue,
      inputCost: profitData.inputCost,
      estimatedProfit: profitData.profit,
      profitVsCurrent: profitData.profitVsCurrent,
      riskLevel,
      season: crop.season,
      duration: crop.duration,
      waterNeed: crop.waterNeed,
      category: crop.category,
    };
  });

  return scored.sort((a, b) => b.compositeScore - a.compositeScore);
}

export function getTopCrops(farmData: FarmData, n = 5): CropScore[] {
  return rankCrops(farmData).slice(0, n);
}
