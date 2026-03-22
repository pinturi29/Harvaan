"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface SeasonHistory {
  season: string;
  crop: string;
  yield: number;
  price: number;
}

export interface FarmData {
  // Step 1 – Location & Land
  state: string;
  district: string;
  landSize: number;
  climateZone: string;
  elevation: number;
  gpsLat: string;
  gpsLng: string;

  // Step 2 – Soil
  soilType: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicCarbon: number;
  drainage: string;

  // Step 3 – Crops
  currentCrop: string;
  yearsGrowing: number;
  avgYield: number;
  currentPrice: number;
  cropHistory: SeasonHistory[];

  // Step 4 – Resources
  irrigationType: string;
  waterSource: string;
  workers: number;
  equipment: string[];
  annualInputCost: number;
  hasCredit: boolean;
  riskTolerance: string;
}

export interface CropScore {
  name: string;
  emoji: string;
  soilFit: number;
  profitScore: number;
  riskScore: number;
  compositeScore: number;
  estimatedYield: { low: number; mid: number; high: number };
  estimatedRevenue: { low: number; mid: number; high: number };
  inputCost: number;
  estimatedProfit: { low: number; mid: number; high: number };
  profitVsCurrent: number;
  riskLevel: "Low" | "Medium" | "High";
  season: string;
  duration: string;
  waterNeed: string;
  category: string;
}

export interface GuideData {
  executive_summary: string;
  soil_analysis: string;
  recommended_crop: string;
  transition_plan: string;
  risk_assessment: string;
  alternatives: string;
  action_plan: string;
  topCrop: string;
  topCropEmoji: string;
}

interface FarmContextValue {
  farmData: FarmData | null;
  setFarmData: (data: FarmData) => void;
  rankings: CropScore[];
  setRankings: (r: CropScore[]) => void;
  guide: GuideData | null;
  setGuide: (g: GuideData) => void;
  soilHealthScore: number;
}

const defaultFarm: FarmData = {
  state: "", district: "", landSize: 0, climateZone: "", elevation: 0,
  gpsLat: "", gpsLng: "",
  soilType: "", ph: 0, nitrogen: 0, phosphorus: 0, potassium: 0,
  organicCarbon: 0, drainage: "",
  currentCrop: "", yearsGrowing: 0, avgYield: 0, currentPrice: 0,
  cropHistory: [],
  irrigationType: "", waterSource: "", workers: 0, equipment: [],
  annualInputCost: 0, hasCredit: false, riskTolerance: "medium",
};

const FarmContext = createContext<FarmContextValue>({
  farmData: null,
  setFarmData: () => {},
  rankings: [],
  setRankings: () => {},
  guide: null,
  setGuide: () => {},
  soilHealthScore: 0,
});

export function FarmProvider({ children }: { children: ReactNode }) {
  const [farmData, setFarmDataState] = useState<FarmData | null>(null);
  const [rankings, setRankings] = useState<CropScore[]>([]);
  const [guide, setGuide] = useState<GuideData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("harvaan_farm");
    if (saved) setFarmDataState(JSON.parse(saved));
    const savedRank = localStorage.getItem("harvaan_rankings");
    if (savedRank) setRankings(JSON.parse(savedRank));
    const savedGuide = localStorage.getItem("harvaan_guide");
    if (savedGuide) setGuide(JSON.parse(savedGuide));
  }, []);

  const setFarmData = (data: FarmData) => {
    setFarmDataState(data);
    localStorage.setItem("harvaan_farm", JSON.stringify(data));
  };

  const setRankingsWithSave = (r: CropScore[]) => {
    setRankings(r);
    localStorage.setItem("harvaan_rankings", JSON.stringify(r));
  };

  const setGuideWithSave = (g: GuideData) => {
    setGuide(g);
    localStorage.setItem("harvaan_guide", JSON.stringify(g));
  };

  const soilHealthScore = (() => {
    if (!farmData) return 0;
    const phScore = farmData.ph >= 6 && farmData.ph <= 7.5 ? 25 : farmData.ph >= 5.5 && farmData.ph <= 8 ? 15 : 5;
    const nScore  = farmData.nitrogen >= 150 ? 20 : (farmData.nitrogen / 150) * 20;
    const pScore  = farmData.phosphorus >= 30 ? 15 : (farmData.phosphorus / 30) * 15;
    const kScore  = farmData.potassium >= 200 ? 15 : (farmData.potassium / 200) * 15;
    const ocScore = farmData.organicCarbon >= 1 ? 15 : (farmData.organicCarbon / 1) * 15;
    const dScore  = farmData.drainage === "good" || farmData.drainage === "excellent" ? 10 : farmData.drainage === "moderate" ? 6 : 2;
    return Math.round(Math.min(100, Math.max(0, phScore + nScore + pScore + kScore + ocScore + dScore)));
  })();

  return (
    <FarmContext.Provider value={{
      farmData, setFarmData,
      rankings, setRankings: setRankingsWithSave,
      guide, setGuide: setGuideWithSave,
      soilHealthScore,
    }}>
      {children}
    </FarmContext.Provider>
  );
}

export const useFarm = () => useContext(FarmContext);

export const SAMPLE_FARM: FarmData = {
  state: "Karnataka", district: "Mysuru", landSize: 3.5, climateZone: "tropical",
  elevation: 750, gpsLat: "12.2958", gpsLng: "76.6394",
  soilType: "clay-loam", ph: 6.2, nitrogen: 180, phosphorus: 28, potassium: 220,
  organicCarbon: 0.8, drainage: "moderate",
  currentCrop: "paddy rice", yearsGrowing: 5, avgYield: 3200, currentPrice: 22,
  cropHistory: [
    { season: "Kharif 2021", crop: "paddy rice", yield: 3000, price: 20 },
    { season: "Rabi 2021-22", crop: "groundnut", yield: 1800, price: 55 },
    { season: "Kharif 2022", crop: "paddy rice", yield: 3200, price: 21 },
    { season: "Rabi 2022-23", crop: "black gram", yield: 900, price: 68 },
    { season: "Kharif 2023", crop: "paddy rice", yield: 3100, price: 22 },
  ],
  irrigationType: "flood", waterSource: "canal", workers: 3, equipment: ["tractor", "tiller"],
  annualInputCost: 85000, hasCredit: true, riskTolerance: "medium",
};
