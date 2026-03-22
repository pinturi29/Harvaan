"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFarm } from "@/context/FarmContext";
import { getBuyersForCrop } from "@/data/buyers";

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 70 ? "#4ade80" : score >= 45 ? "#facc15" : "#f87171";
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#292524" strokeWidth={8} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x={size / 2} y={size / 2 + 1} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize={size * 0.22} fontWeight="bold">
        {score}
      </text>
    </svg>
  );
}

function ProfitBar({ current, recommended, label }: { current: number; recommended: number; label: string }) {
  const max = Math.max(Math.abs(current), Math.abs(recommended), 1);
  const curW = Math.abs(current) / max * 100;
  const recW = Math.abs(recommended) / max * 100;
  const fmt = (n: number) => n < 0 ? `-₹${Math.abs(n).toLocaleString()}` : `₹${n.toLocaleString()}`;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-stone-400 mb-1">
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-stone-500 w-16 text-right">Current</span>
        <div className="flex-1 h-5 bg-stone-800 rounded overflow-hidden">
          <div className="h-full bg-stone-600 rounded transition-all duration-500" style={{ width: `${curW}%` }} />
        </div>
        <span className="text-xs text-stone-300 w-24">{fmt(current)}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-stone-500 w-16 text-right">Recommended</span>
        <div className="flex-1 h-5 bg-stone-800 rounded overflow-hidden">
          <div className="h-full bg-green-600 rounded transition-all duration-500" style={{ width: `${recW}%` }} />
        </div>
        <span className="text-xs text-green-400 w-24 font-medium">{fmt(recommended)}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { farmData, rankings, soilHealthScore, guide, setGuide } = useFarm();
  const router = useRouter();
  const [generatingGuide, setGeneratingGuide] = useState(false);
  const [guideError, setGuideError] = useState("");

  const top = rankings[0];
  const alt1 = rankings[1];
  const alt2 = rankings[2];

  const matchedBuyers = top ? getBuyersForCrop(top.name).slice(0, 4) : [];

  const currentProfit = farmData
    ? farmData.avgYield * farmData.currentPrice * farmData.landSize - farmData.annualInputCost
    : 0;

  const generateGuide = async () => {
    if (!farmData || !rankings.length) return;
    if (guide) { router.push("/crop-guide"); return; }

    setGeneratingGuide(true);
    setGuideError("");
    try {
      const res = await fetch("/api/generate-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ farmData, topCrops: rankings.slice(0, 3) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate guide");
      setGuide(data.guide);
      router.push("/crop-guide");
    } catch (e: unknown) {
      setGuideError(e instanceof Error ? e.message : "Error generating guide");
    } finally {
      setGeneratingGuide(false);
    }
  };

  if (!farmData || !rankings.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-6">🌾</div>
        <h1 className="text-2xl font-bold text-white mb-3">No Farm Data Yet</h1>
        <p className="text-stone-400 mb-8">Enter your farm details to see your personalized crop analysis and dashboard.</p>
        <Link href="/soil-input" className="btn-primary inline-block">Analyze My Farm →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Farm Dashboard</h1>
          <p className="text-stone-400 text-sm mt-0.5">{farmData.district}, {farmData.state}</p>
        </div>
        <Link href="/soil-input" className="btn-outline text-sm py-2 px-4">Edit Data</Link>
      </div>

      {/* Top row: Farm summary + Soil health */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* Farm Card */}
        <div className="md:col-span-2 card">
          <h3 className="section-heading mb-4">Farm Overview</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Land Size", value: `${farmData.landSize} ha`, icon: "🌍" },
              { label: "Climate Zone", value: farmData.climateZone, icon: "🌤️" },
              { label: "Soil Type", value: farmData.soilType, icon: "🟫" },
              { label: "Current Crop", value: farmData.currentCrop, icon: "🌱" },
              { label: "Irrigation", value: farmData.irrigationType, icon: "💧" },
              { label: "Annual Costs", value: `₹${farmData.annualInputCost.toLocaleString()}`, icon: "💰" },
            ].map((item) => (
              <div key={item.label} className="bg-stone-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs text-stone-400">{item.label}</span>
                </div>
                <span className="text-stone-100 font-medium capitalize text-sm">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Soil Health */}
        <div className="card flex flex-col items-center justify-center text-center">
          <ScoreRing score={soilHealthScore} size={100} />
          <h4 className="font-semibold text-white mt-3">Soil Health Score</h4>
          <p className="text-stone-400 text-xs mt-1">
            {soilHealthScore >= 70 ? "Your soil is in great condition" :
             soilHealthScore >= 45 ? "Moderate soil — amendable" :
             "Soil needs significant improvement"}
          </p>
          <div className="mt-4 space-y-1 w-full text-xs">
            {[
              { label: "pH", value: farmData.ph, ok: farmData.ph >= 6 && farmData.ph <= 7.5 },
              { label: "Nitrogen", value: `${farmData.nitrogen} kg/ha`, ok: farmData.nitrogen >= 150 },
              { label: "Organic C", value: `${farmData.organicCarbon}%`, ok: farmData.organicCarbon >= 0.8 },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-stone-400 px-2">
                <span>{item.label}</span>
                <span className={item.ok ? "text-green-400" : "text-yellow-400"}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Recommendation */}
      {top && (
        <div className="card border-green-900">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-gold">Top Recommendation</span>
                <span className={`badge-${top.riskLevel === "Low" ? "green" : top.riskLevel === "Medium" ? "gold" : "red"}`}>
                  {top.riskLevel} Risk
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">{top.emoji}</span>
                Switch to {top.name}
              </h2>
              <p className="text-stone-400 text-sm mt-1">{top.season} · {top.duration}</p>
            </div>
            <ScoreRing score={top.soilFit} size={80} />
          </div>

          {/* Profit comparison */}
          <div className="mb-5">
            <ProfitBar
              current={currentProfit}
              recommended={top.estimatedProfit.mid}
              label="Seasonal Profit (₹)"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mb-5">
            <div className="bg-stone-800/60 rounded-lg p-3 text-center">
              <div className="text-xs text-stone-400 mb-1">Yield (mid)</div>
              <div className="font-bold text-white">{top.estimatedYield.mid.toLocaleString()} kg/ha</div>
            </div>
            <div className="bg-stone-800/60 rounded-lg p-3 text-center">
              <div className="text-xs text-stone-400 mb-1">Projected Profit</div>
              <div className="font-bold text-green-400">₹{top.estimatedProfit.mid.toLocaleString()}</div>
            </div>
            <div className="bg-stone-800/60 rounded-lg p-3 text-center">
              <div className="text-xs text-stone-400 mb-1">vs Current Crop</div>
              <div className={`font-bold ${top.profitVsCurrent >= 0 ? "text-green-400" : "text-red-400"}`}>
                {top.profitVsCurrent >= 0 ? "+" : ""}₹{top.profitVsCurrent.toLocaleString()}
              </div>
            </div>
          </div>

          {guideError && (
            <div className="bg-red-950/40 border border-red-800 rounded-lg px-4 py-2 text-red-400 text-sm mb-4">
              {guideError}
            </div>
          )}

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={generateGuide}
              disabled={generatingGuide}
              className="btn-gold flex items-center gap-2"
            >
              {generatingGuide ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating AI Guide...
                </>
              ) : guide ? "View Full Guide →" : "Generate AI Guide 🤖"}
            </button>
            {guide && (
              <Link href="/crop-guide" className="btn-outline">
                View Saved Guide
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Alternatives */}
      {(alt1 || alt2) && (
        <div>
          <h3 className="section-heading mb-4">Alternative Crops</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[alt1, alt2].filter(Boolean).map((crop) => (
              <div key={crop!.name} className="card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{crop!.emoji}</span>
                    <div>
                      <h4 className="font-semibold text-white">{crop!.name}</h4>
                      <p className="text-stone-400 text-xs">{crop!.category}</p>
                    </div>
                  </div>
                  <ScoreRing score={crop!.soilFit} size={56} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center bg-stone-800/50 rounded p-2">
                    <div className="text-stone-400">Profit (mid)</div>
                    <div className="font-medium text-green-400 mt-0.5">₹{crop!.estimatedProfit.mid.toLocaleString()}</div>
                  </div>
                  <div className="text-center bg-stone-800/50 rounded p-2">
                    <div className="text-stone-400">Risk</div>
                    <div className={`font-medium mt-0.5 ${crop!.riskLevel === "Low" ? "text-green-400" : crop!.riskLevel === "Medium" ? "text-yellow-400" : "text-red-400"}`}>
                      {crop!.riskLevel}
                    </div>
                  </div>
                  <div className="text-center bg-stone-800/50 rounded p-2">
                    <div className="text-stone-400">Water</div>
                    <div className="font-medium text-stone-200 mt-0.5 capitalize">{crop!.waterNeed}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matched Buyers */}
      {top && matchedBuyers.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-heading">Companies Buying {top.name}</h3>
            <Link href="/marketplace" className="text-green-400 hover:text-green-300 text-sm transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {matchedBuyers.map((buyer) => {
              const demand = buyer.cropDemands.find((d) =>
                d.cropName.toLowerCase().includes(top.name.toLowerCase()) ||
                top.name.toLowerCase().includes(d.cropName.toLowerCase())
              );
              return (
                <Link key={buyer.id} href={`/marketplace/${buyer.id}`}>
                  <div className="card-hover h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 rounded-full bg-green-900 flex items-center justify-center text-green-300 font-bold text-sm">
                        {buyer.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{buyer.name}</div>
                        <div className="text-xs text-stone-500 truncate">{buyer.location}</div>
                      </div>
                    </div>
                    {demand && (
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-stone-400">Price</span>
                          <span className="text-green-400 font-medium">₹{demand.priceRangePerKg.min}–{demand.priceRangePerKg.max}/kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Qty needed</span>
                          <span className="text-stone-200">{demand.quantityTonnesPerYear} t/yr</span>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
