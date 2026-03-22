"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useFarm, FarmData, SeasonHistory, SAMPLE_FARM } from "@/context/FarmContext";
import { rankCrops } from "@/lib/cropEngine";
import { useLang } from "@/context/LanguageContext";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand",
  "West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry",
];

const COMMON_CROPS = [
  "Paddy Rice","Wheat","Maize","Sorghum","Pearl Millet","Finger Millet",
  "Turmeric","Red Chili","Black Pepper","Cardamom","Ginger","Coriander",
  "Cotton","Groundnut","Sunflower","Sesame","Soybean","Mustard",
  "Sugarcane","Banana","Mango","Coconut","Arecanut",
  "Tomato","Onion","Potato","Cabbage","Cauliflower",
  "Lemongrass","Vetiver","Black Gram","Green Gram","Red Gram",
];

const emptyHistory = (): SeasonHistory => ({ season: "", crop: "", yield: 0, price: 0 });

const BLANK: FarmData = {
  state: "", district: "", landSize: 0, climateZone: "", elevation: 0, gpsLat: "", gpsLng: "",
  soilType: "", ph: 0, nitrogen: 0, phosphorus: 0, potassium: 0, organicCarbon: 0, drainage: "",
  currentCrop: "", yearsGrowing: 0, avgYield: 0, currentPrice: 0, cropHistory: [emptyHistory()],
  irrigationType: "", waterSource: "", workers: 0, equipment: [], annualInputCost: 0,
  hasCredit: false, riskTolerance: "medium",
};

// ─── Field helpers (rendered inline — NOT as JSX components — to fix typing bug) ─

function ErrMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-red-400 text-xs mt-1">{msg}</p>;
}

function FieldLabel({ text, required, optional }: { text: string; required?: boolean; optional?: boolean }) {
  return (
    <label className="label">
      {text}
      {required && <span className="text-red-400 ml-1 text-xs">*</span>}
      {optional && <span className="text-stone-500 ml-1.5 text-xs">(optional)</span>}
    </label>
  );
}

export default function SoilInputPage() {
  const { setFarmData, setRankings } = useFarm();
  const { t } = useLang();
  const router = useRouter();

  const [mode, setMode] = useState<"simple" | "advanced">("simple");
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<FarmData>({ ...BLANK });

  // KEY FIX: use a stable updater — never redefine it on re-render
  const set = useCallback((field: keyof FarmData, value: unknown) => {
    setForm((f) => ({ ...f, [field]: value }));
  }, []);

  const loadSample = () => { setForm(SAMPLE_FARM); setErrors({}); };

  const ADVANCED_STEPS = [t.stepLocation, t.stepSoil, t.stepCrops, t.stepResources, t.stepReview];
  const totalSteps = mode === "simple" ? 2 : 5;

  // ─── Validation (only truly required fields) ───────────────────────────────
  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {};

    if (mode === "simple") {
      if (s === 1) {
        if (!form.state) e.state = t.err_state;
        if (!form.currentCrop) e.currentCrop = t.err_crop;
      }
    } else {
      if (s === 1) {
        if (!form.state) e.state = t.err_state;
      }
      if (s === 3) {
        if (!form.currentCrop) e.currentCrop = t.err_crop;
      }
      if (s === 2 && form.ph && (form.ph < 3 || form.ph > 10)) {
        e.ph = t.err_ph;
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep(step)) setStep((s) => Math.min(s + 1, totalSteps)); };
  const back = () => { setStep((s) => Math.max(s - 1, 1)); setErrors({}); };

  const addSeason = () => setForm((f) => ({ ...f, cropHistory: [...f.cropHistory, emptyHistory()] }));
  const removeSeason = (i: number) =>
    setForm((f) => ({ ...f, cropHistory: f.cropHistory.filter((_, idx) => idx !== i) }));
  const updateSeason = (i: number, field: keyof SeasonHistory, value: string | number) =>
    setForm((f) => {
      const h = [...f.cropHistory];
      (h[i] as unknown as Record<string, unknown>)[field] = value;
      return { ...f, cropHistory: h };
    });
  const toggleEquipment = (item: string) =>
    set("equipment", form.equipment.includes(item)
      ? form.equipment.filter((e) => e !== item)
      : [...form.equipment, item]);

  const handleSubmit = () => {
    if (!validateStep(mode === "simple" ? 2 : 5)) return;
    setFarmData(form);
    setRankings(rankCrops(form));
    router.push("/dashboard");
  };

  // ─── Progress bar ──────────────────────────────────────────────────────────
  const stepLabels = mode === "simple"
    ? [t.stepLocation, t.stepReview]
    : ADVANCED_STEPS;

  // ─── SIMPLE MODE — step 1: essentials, step 2: review ─────────────────────
  const renderSimpleStep1 = () => (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        {/* State — required */}
        <div>
          <FieldLabel text={t.state} required />
          <select
            className={`input-field ${errors.state ? "border-red-500" : ""}`}
            value={form.state}
            onChange={(e) => set("state", e.target.value)}
          >
            <option value="">{t.selectPlaceholder}</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <ErrMsg msg={errors.state} />
        </div>

        {/* District — optional */}
        <div>
          <FieldLabel text={t.district} optional />
          <input
            className="input-field"
            value={form.district}
            placeholder="e.g. Mysuru"
            onChange={(e) => set("district", e.target.value)}
          />
        </div>

        {/* Current crop — required */}
        <div>
          <FieldLabel text={t.currentCrop} required />
          <input
            list="crops-list"
            className={`input-field ${errors.currentCrop ? "border-red-500" : ""}`}
            value={form.currentCrop}
            placeholder="e.g. Paddy Rice"
            onChange={(e) => set("currentCrop", e.target.value)}
          />
          <datalist id="crops-list">
            {COMMON_CROPS.map((c) => <option key={c} value={c} />)}
          </datalist>
          <ErrMsg msg={errors.currentCrop} />
        </div>

        {/* Land size — optional */}
        <div>
          <FieldLabel text={t.landSize} optional />
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="input-field"
              value={form.landSize || ""}
              min={0.1} step={0.1}
              placeholder="e.g. 2.5"
              onChange={(e) => set("landSize", parseFloat(e.target.value) || 0)}
            />
            <span className="text-stone-400 text-sm whitespace-nowrap">{t.landSizeUnit}</span>
          </div>
        </div>

        {/* Climate — optional */}
        <div>
          <FieldLabel text={t.climateZone} optional />
          <select className="input-field" value={form.climateZone} onChange={(e) => set("climateZone", e.target.value)}>
            <option value="">{t.selectPlaceholder}</option>
            <option value="tropical">{t.climate_tropical}</option>
            <option value="subtropical">{t.climate_subtropical}</option>
            <option value="semi-arid">{t.climate_semiarid}</option>
            <option value="arid">{t.climate_arid}</option>
          </select>
        </div>

        {/* Soil type — optional */}
        <div>
          <FieldLabel text={t.soilType} optional />
          <select className="input-field" value={form.soilType} onChange={(e) => set("soilType", e.target.value)}>
            <option value="">{t.selectPlaceholder}</option>
            <option value="clay">{t.soil_clay}</option>
            <option value="loam">{t.soil_loam}</option>
            <option value="sandy">{t.soil_sandy}</option>
            <option value="silt">{t.soil_silt}</option>
            <option value="clay-loam">{t.soil_clayloam}</option>
            <option value="sandy-loam">{t.soil_sandyloam}</option>
          </select>
        </div>

        {/* Risk tolerance */}
        <div className="sm:col-span-2">
          <FieldLabel text={t.riskTolerance} optional />
          <div className="flex gap-3 mt-1">
            {(["low","medium","high"] as const).map((r) => {
              const label = r === "low" ? t.risk_low : r === "medium" ? t.risk_medium : t.risk_high;
              return (
                <button key={r} type="button"
                  onClick={() => set("riskTolerance", r)}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    form.riskTolerance === r
                      ? "bg-green-900/50 border-green-700 text-green-300"
                      : "bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500"
                  }`}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSimpleStep2 = () => (
    <div className="space-y-5">
      <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 text-sm text-green-300">
        ✅ {t.reviewReady}
      </div>
      <div className="grid sm:grid-cols-2 gap-3 text-sm">
        {[
          [t.state, form.state],
          [t.district, form.district || "—"],
          [t.currentCrop, form.currentCrop],
          [t.landSize, form.landSize ? `${form.landSize} ${t.landSizeUnit}` : "—"],
          [t.climateZone, form.climateZone || "—"],
          [t.soilType, form.soilType || "—"],
          [t.riskTolerance, form.riskTolerance],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between bg-stone-800/50 rounded-lg px-3 py-2">
            <span className="text-stone-400">{k}</span>
            <span className="text-stone-200 font-medium capitalize">{v}</span>
          </div>
        ))}
      </div>
      <button onClick={() => setStep(1)} className="text-green-400 hover:text-green-300 text-sm transition-colors">
        ← {t.reviewEdit}
      </button>
    </div>
  );

  // ─── ADVANCED MODE steps ───────────────────────────────────────────────────

  const renderAdvancedStep1 = () => (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <FieldLabel text={t.state} required />
          <select
            className={`input-field ${errors.state ? "border-red-500" : ""}`}
            value={form.state}
            onChange={(e) => set("state", e.target.value)}
          >
            <option value="">{t.selectPlaceholder}</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <ErrMsg msg={errors.state} />
        </div>
        <div>
          <FieldLabel text={t.district} optional />
          <input className="input-field" value={form.district} placeholder="e.g. Mysuru"
            onChange={(e) => set("district", e.target.value)} />
        </div>
        <div>
          <FieldLabel text={t.landSize} optional />
          <div className="flex items-center gap-2">
            <input type="number" className="input-field" value={form.landSize || ""} min={0.1} step={0.1}
              placeholder="e.g. 2.5" onChange={(e) => set("landSize", parseFloat(e.target.value) || 0)} />
            <span className="text-stone-400 text-sm whitespace-nowrap">{t.landSizeUnit}</span>
          </div>
        </div>
        <div>
          <FieldLabel text={t.climateZone} optional />
          <select className="input-field" value={form.climateZone} onChange={(e) => set("climateZone", e.target.value)}>
            <option value="">{t.selectPlaceholder}</option>
            <option value="tropical">{t.climate_tropical}</option>
            <option value="subtropical">{t.climate_subtropical}</option>
            <option value="semi-arid">{t.climate_semiarid}</option>
            <option value="arid">{t.climate_arid}</option>
          </select>
        </div>
        <div>
          <FieldLabel text={t.elevation} optional />
          <div className="flex items-center gap-2">
            <input type="number" className="input-field" value={form.elevation || ""} min={0}
              placeholder="e.g. 750" onChange={(e) => set("elevation", parseFloat(e.target.value) || 0)} />
            <span className="text-stone-400 text-sm">m</span>
          </div>
        </div>
        <div>
          <FieldLabel text={t.gpsCoords} optional />
          <div className="flex gap-2">
            <input className="input-field" placeholder="Lat" value={form.gpsLat}
              onChange={(e) => set("gpsLat", e.target.value)} />
            <input className="input-field" placeholder="Lng" value={form.gpsLng}
              onChange={(e) => set("gpsLng", e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdvancedStep2 = () => (
    <div className="space-y-5">
      <div className="bg-blue-950/30 border border-blue-900 rounded-lg p-3 text-xs text-blue-300">
        💡 {t.soilTip}
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <FieldLabel text={t.soilType} optional />
          <select className="input-field" value={form.soilType} onChange={(e) => set("soilType", e.target.value)}>
            <option value="">{t.selectPlaceholder}</option>
            <option value="clay">{t.soil_clay}</option>
            <option value="loam">{t.soil_loam}</option>
            <option value="sandy">{t.soil_sandy}</option>
            <option value="silt">{t.soil_silt}</option>
            <option value="clay-loam">{t.soil_clayloam}</option>
            <option value="sandy-loam">{t.soil_sandyloam}</option>
          </select>
        </div>
        <div>
          <FieldLabel text={`${t.soilPh} (3.0–10.0)`} optional />
          <input type="number" className={`input-field ${errors.ph ? "border-red-500" : ""}`}
            value={form.ph || ""} min={3} max={10} step={0.1} placeholder="e.g. 6.5"
            onChange={(e) => set("ph", parseFloat(e.target.value) || 0)} />
          <ErrMsg msg={errors.ph} />
        </div>
        <div>
          <FieldLabel text={t.nitrogen} optional />
          <div className="flex items-center gap-2">
            <input type="number" className="input-field" value={form.nitrogen || ""} min={0}
              placeholder="e.g. 180" onChange={(e) => set("nitrogen", parseFloat(e.target.value) || 0)} />
            <span className="text-stone-400 text-sm whitespace-nowrap">kg/ha</span>
          </div>
        </div>
        <div>
          <FieldLabel text={t.phosphorus} optional />
          <div className="flex items-center gap-2">
            <input type="number" className="input-field" value={form.phosphorus || ""} min={0}
              placeholder="e.g. 28" onChange={(e) => set("phosphorus", parseFloat(e.target.value) || 0)} />
            <span className="text-stone-400 text-sm whitespace-nowrap">kg/ha</span>
          </div>
        </div>
        <div>
          <FieldLabel text={t.potassium} optional />
          <div className="flex items-center gap-2">
            <input type="number" className="input-field" value={form.potassium || ""} min={0}
              placeholder="e.g. 220" onChange={(e) => set("potassium", parseFloat(e.target.value) || 0)} />
            <span className="text-stone-400 text-sm whitespace-nowrap">kg/ha</span>
          </div>
        </div>
        <div>
          <FieldLabel text={t.organicCarbon} optional />
          <div className="flex items-center gap-2">
            <input type="number" className="input-field" value={form.organicCarbon || ""} min={0} max={10} step={0.01}
              placeholder="e.g. 0.8" onChange={(e) => set("organicCarbon", parseFloat(e.target.value) || 0)} />
            <span className="text-stone-400 text-sm">%</span>
          </div>
        </div>
        <div>
          <FieldLabel text={t.drainage} optional />
          <select className="input-field" value={form.drainage} onChange={(e) => set("drainage", e.target.value)}>
            <option value="">{t.selectPlaceholder}</option>
            <option value="poor">{t.drain_poor}</option>
            <option value="moderate">{t.drain_moderate}</option>
            <option value="good">{t.drain_good}</option>
            <option value="excellent">{t.drain_excellent}</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderAdvancedStep3 = () => (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <FieldLabel text={t.currentCrop} required />
          <input list="crops-list" className={`input-field ${errors.currentCrop ? "border-red-500" : ""}`}
            value={form.currentCrop} placeholder="e.g. Paddy Rice"
            onChange={(e) => set("currentCrop", e.target.value)} />
          <datalist id="crops-list">
            {COMMON_CROPS.map((c) => <option key={c} value={c} />)}
          </datalist>
          <ErrMsg msg={errors.currentCrop} />
        </div>
        <div>
          <FieldLabel text={t.yearsGrowing} optional />
          <input type="number" className="input-field" value={form.yearsGrowing || ""} min={1}
            placeholder="e.g. 5" onChange={(e) => set("yearsGrowing", parseFloat(e.target.value) || 0)} />
        </div>
        <div>
          <FieldLabel text={t.avgYield} optional />
          <div className="flex items-center gap-2">
            <input type="number" className="input-field" value={form.avgYield || ""} min={0}
              placeholder="e.g. 3200" onChange={(e) => set("avgYield", parseFloat(e.target.value) || 0)} />
            <span className="text-stone-400 text-sm whitespace-nowrap">{t.avgYieldUnit}</span>
          </div>
        </div>
        <div>
          <FieldLabel text={t.sellingPrice} optional />
          <div className="flex items-center gap-2">
            <input type="number" className="input-field" value={form.currentPrice || ""} min={0}
              placeholder="e.g. 22" onChange={(e) => set("currentPrice", parseFloat(e.target.value) || 0)} />
            <span className="text-stone-400 text-sm whitespace-nowrap">{t.sellingPriceUnit}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-stone-200 font-medium text-sm">{t.cropHistory}</p>
            <p className="text-stone-500 text-xs">{t.optional}</p>
          </div>
          {form.cropHistory.length < 5 && (
            <button type="button" onClick={addSeason} className="btn-outline text-sm py-1.5 px-3">
              {t.addSeason}
            </button>
          )}
        </div>
        <div className="space-y-3">
          {form.cropHistory.map((h, i) => (
            <div key={i} className="bg-stone-800/50 border border-stone-700 rounded-lg p-4">
              <div className="flex justify-between mb-3">
                <span className="text-stone-400 text-sm font-medium">Season {i + 1}</span>
                {form.cropHistory.length > 1 && (
                  <button onClick={() => removeSeason(i)} className="text-red-400 hover:text-red-300 text-xs transition-colors">
                    {t.remove}
                  </button>
                )}
              </div>
              <div className="grid sm:grid-cols-4 gap-3">
                {[
                  { label: t.seasonName, field: "season" as keyof SeasonHistory, placeholder: "e.g. Kharif 2023", type: "text" },
                  { label: t.cropName, field: "crop" as keyof SeasonHistory, placeholder: "Crop name", type: "text" },
                  { label: `${t.avgYield} (kg/ha)`, field: "yield" as keyof SeasonHistory, placeholder: "0", type: "number" },
                  { label: `${t.sellingPrice} (₹/kg)`, field: "price" as keyof SeasonHistory, placeholder: "0", type: "number" },
                ].map(({ label, field, placeholder, type }) => (
                  <div key={field}>
                    <label className="label text-xs">{label}</label>
                    <input type={type} className="input-field text-sm" placeholder={placeholder}
                      value={type === "number" ? (h[field] as number || "") : h[field] as string}
                      onChange={(e) => updateSeason(i, field, type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAdvancedStep4 = () => (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <FieldLabel text={t.irrigationType} optional />
          <select className="input-field" value={form.irrigationType} onChange={(e) => set("irrigationType", e.target.value)}>
            <option value="">{t.selectPlaceholder}</option>
            <option value="rainfed">{t.irrig_rainfed}</option>
            <option value="drip">{t.irrig_drip}</option>
            <option value="flood">{t.irrig_flood}</option>
            <option value="sprinkler">{t.irrig_sprinkler}</option>
          </select>
        </div>
        <div>
          <FieldLabel text={t.waterSource} optional />
          <select className="input-field" value={form.waterSource} onChange={(e) => set("waterSource", e.target.value)}>
            <option value="">{t.selectPlaceholder}</option>
            <option value="well">{t.water_well}</option>
            <option value="canal">{t.water_canal}</option>
            <option value="river">{t.water_river}</option>
            <option value="rainwater">{t.water_rain}</option>
            <option value="borewell">{t.water_bore}</option>
          </select>
        </div>
        <div>
          <FieldLabel text={t.workers} optional />
          <input type="number" className="input-field" value={form.workers || ""} min={1}
            placeholder="e.g. 3" onChange={(e) => set("workers", parseFloat(e.target.value) || 0)} />
        </div>
        <div>
          <FieldLabel text={t.annualInputCost} optional />
          <div className="flex items-center gap-2">
            <input type="number" className="input-field" value={form.annualInputCost || ""} min={0} step={1000}
              placeholder="e.g. 85000" onChange={(e) => set("annualInputCost", parseFloat(e.target.value) || 0)} />
            <span className="text-stone-400 text-sm">₹</span>
          </div>
        </div>
      </div>

      <div>
        <FieldLabel text={t.equipment} optional />
        <div className="flex flex-wrap gap-3 mt-1">
          {[["Tractor","tractor"],["Tiller","tiller"],["Sprayer","sprayer"],["Thresher","thresher"],["Pump","pump"]].map(([label, val]) => (
            <button key={val} type="button" onClick={() => toggleEquipment(val)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                form.equipment.includes(val)
                  ? "bg-green-900/50 border-green-700 text-green-300"
                  : "bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500"
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel text={t.creditAccess} optional />
        <div className="flex gap-4 mt-1">
          {([true, false] as const).map((v) => (
            <button key={String(v)} type="button" onClick={() => set("hasCredit", v)}
              className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                form.hasCredit === v
                  ? "bg-green-900/50 border-green-700 text-green-300"
                  : "bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500"
              }`}>
              {v ? t.credit_yes : t.credit_no}
            </button>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel text={t.riskTolerance} optional />
        <div className="flex gap-3 mt-1">
          {([
            { v: "low", label: t.risk_low, sub: t.risk_low_desc },
            { v: "medium", label: t.risk_medium, sub: t.risk_medium_desc },
            { v: "high", label: t.risk_high, sub: t.risk_high_desc },
          ]).map(({ v, label, sub }) => (
            <button key={v} type="button" onClick={() => set("riskTolerance", v)}
              className={`flex-1 p-3 rounded-lg border text-left text-sm transition-all ${
                form.riskTolerance === v
                  ? "bg-green-900/50 border-green-700 text-green-300"
                  : "bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500"
              }`}>
              <div className="font-medium">{label}</div>
              <div className="text-xs mt-0.5 opacity-70">{sub}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAdvancedStep5 = () => {
    const sections = [
      { title: t.stepLocation, s: 1, items: [
        [t.state, form.state], [t.district, form.district || "—"],
        [t.landSize, form.landSize ? `${form.landSize} ha` : "—"],
        [t.climateZone, form.climateZone || "—"],
      ]},
      { title: t.stepSoil, s: 2, items: [
        [t.soilType, form.soilType || "—"], [t.soilPh, form.ph || "—"],
        [t.nitrogen, form.nitrogen ? `${form.nitrogen} kg/ha` : "—"],
        [t.phosphorus, form.phosphorus ? `${form.phosphorus} kg/ha` : "—"],
        [t.potassium, form.potassium ? `${form.potassium} kg/ha` : "—"],
        [t.organicCarbon, form.organicCarbon ? `${form.organicCarbon}%` : "—"],
      ]},
      { title: t.stepCrops, s: 3, items: [
        [t.currentCrop, form.currentCrop],
        [t.avgYield, form.avgYield ? `${form.avgYield} kg/ha` : "—"],
        [t.sellingPrice, form.currentPrice ? `₹${form.currentPrice}/kg` : "—"],
      ]},
      { title: t.stepResources, s: 4, items: [
        [t.irrigationType, form.irrigationType || "—"],
        [t.annualInputCost, form.annualInputCost ? `₹${form.annualInputCost.toLocaleString()}` : "—"],
        [t.riskTolerance, form.riskTolerance],
      ]},
    ];
    return (
      <div className="space-y-4">
        <div className="bg-green-900/20 border border-green-800 rounded-lg p-3 text-sm text-green-300">
          ✅ {t.reviewReady}
        </div>
        {sections.map((sec) => (
          <div key={sec.title} className="card">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-stone-200 text-sm">{sec.title}</h4>
              <button onClick={() => setStep(sec.s)} className="text-green-400 hover:text-green-300 text-xs transition-colors">
                {t.reviewEdit} →
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {sec.items.map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs py-1 border-b border-stone-800 last:border-0">
                  <span className="text-stone-400">{k}</span>
                  <span className="text-stone-200 font-medium capitalize">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ─── Render current step content INLINE (not as a sub-component) ───────────
  const renderStepContent = () => {
    if (mode === "simple") {
      return step === 1 ? renderSimpleStep1() : renderSimpleStep2();
    }
    switch (step) {
      case 1: return renderAdvancedStep1();
      case 2: return renderAdvancedStep2();
      case 3: return renderAdvancedStep3();
      case 4: return renderAdvancedStep4();
      case 5: return renderAdvancedStep5();
      default: return null;
    }
  };

  const isLastStep = step === totalSteps;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{t.formTitle}</h1>
          <p className="text-stone-400 mt-1 text-sm">{t.formSubtitle}</p>
        </div>
        <button onClick={loadSample} className="btn-outline text-sm py-2 px-3 whitespace-nowrap">
          {t.loadSample}
        </button>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-3 mb-6">
        {(["simple", "advanced"] as const).map((m) => {
          const label = m === "simple" ? t.simpleMode : t.advancedMode;
          const desc = m === "simple" ? t.simpleModeDesc : t.advancedModeDesc;
          return (
            <button key={m} type="button"
              onClick={() => { setMode(m); setStep(1); setErrors({}); }}
              className={`flex-1 p-4 rounded-xl border text-left transition-all ${
                mode === m
                  ? "bg-green-900/30 border-green-700 text-white"
                  : "bg-stone-900 border-stone-700 text-stone-400 hover:border-stone-500"
              }`}>
              <div className="font-semibold text-sm flex items-center gap-2">
                {m === "simple" ? "⚡" : "🔬"} {label}
              </div>
              <div className="text-xs mt-1 opacity-70">{desc}</div>
            </button>
          );
        })}
      </div>

      <div className="card">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex mb-2">
            {stepLabels.map((label, i) => (
              <button key={label} onClick={() => { if (i + 1 < step) setStep(i + 1); }}
                className={`flex-1 text-center text-xs font-medium pb-2 border-b-2 transition-colors ${
                  step === i + 1 ? "border-green-500 text-green-400"
                    : i + 1 < step ? "border-green-800 text-green-600 cursor-pointer hover:text-green-400"
                    : "border-stone-800 text-stone-600 cursor-default"
                }`}>
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{i + 1}</span>
              </button>
            ))}
          </div>
          <div className="text-xs text-stone-500 text-right">
            {step}/{totalSteps}
          </div>
        </div>

        {/* Step title */}
        <h2 className="text-xl font-semibold text-white mb-5">
          {mode === "simple"
            ? (step === 1 ? t.stepLocation : t.reviewTitle)
            : ADVANCED_STEPS[step - 1]}
        </h2>

        {/* Step content — rendered inline, no sub-component wrapping */}
        {renderStepContent()}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-stone-800">
          <button onClick={back} disabled={step === 1} className="btn-outline disabled:opacity-30">
            ← {t.back}
          </button>

          {!isLastStep ? (
            <button onClick={next} className="btn-primary">{t.continue} →</button>
          ) : (
            <button onClick={handleSubmit} className="btn-gold text-base py-3 px-8">
              🚀 {t.submit}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
