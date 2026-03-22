"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BUYERS, getAllCropDemands, Buyer } from "@/data/buyers";
import { useFarm } from "@/context/FarmContext";

const CROP_EMOJIS: Record<string, string> = {
  "Turmeric": "🟡", "Red Chili": "🌶️", "Cotton": "☁️", "Paddy Rice": "🌾",
  "Groundnut": "🥜", "Maize": "🌽", "Sesame": "🌿", "Lemongrass": "🍋",
  "Sugarcane": "🎋", "Black Gram": "🫘", "Tomato": "🍅", "Onion": "🧅",
  "Sunflower": "🌻", "Mango": "🥭", "Coconut": "🥥", "Black Pepper": "⚫",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.floor(rating) ? "text-yellow-400" : "text-stone-600"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-stone-400 text-xs ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function BuyerCard({ buyer, highlightCrop }: { buyer: Buyer; highlightCrop?: string }) {
  const isMatch = highlightCrop && buyer.cropDemands.some((d) =>
    d.cropName.toLowerCase().includes(highlightCrop.toLowerCase()) ||
    highlightCrop.toLowerCase().includes(d.cropName.toLowerCase())
  );
  const avatarColors = ["bg-green-900 text-green-300", "bg-blue-900 text-blue-300",
    "bg-purple-900 text-purple-300", "bg-amber-900 text-amber-300", "bg-teal-900 text-teal-300"];
  const color = avatarColors[buyer.id % avatarColors.length];

  return (
    <Link href={`/marketplace/${buyer.id}`}>
      <div className={`card-hover h-full relative ${isMatch ? "border-green-700" : ""}`}>
        {isMatch && (
          <div className="absolute -top-2 left-3">
            <span className="badge-green text-xs">Great Match ✨</span>
          </div>
        )}
        <div className="flex items-start gap-3 mb-3 mt-1">
          <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center font-bold text-sm flex-shrink-0`}>
            {buyer.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-white text-sm">{buyer.name}</span>
              {buyer.verified && <span className="badge-green text-xs">Verified</span>}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">{buyer.type}</div>
            <div className="text-xs text-stone-500 mt-0.5">📍 {buyer.location}</div>
          </div>
        </div>
        <StarRating rating={buyer.rating} />
        <div className="flex flex-wrap gap-1.5 mt-3">
          {buyer.cropDemands.slice(0, 4).map((d) => (
            <span key={d.cropName} className={`text-xs px-2 py-0.5 rounded-full border ${
              highlightCrop && (d.cropName.toLowerCase().includes(highlightCrop.toLowerCase()) || highlightCrop.toLowerCase().includes(d.cropName.toLowerCase()))
                ? "bg-green-900/50 border-green-700 text-green-300"
                : "bg-stone-800 border-stone-700 text-stone-400"
            }`}>
              {CROP_EMOJIS[d.cropName] || "🌿"} {d.cropName}
            </span>
          ))}
          {buyer.cropDemands.length > 4 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-800 border border-stone-700 text-stone-500">
              +{buyer.cropDemands.length - 4} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function MarketplacePage() {
  const { rankings } = useFarm();
  const [activeTab, setActiveTab] = useState<"demands" | "buyers">("demands");
  const [search, setSearch] = useState("");
  const [expandedCrop, setExpandedCrop] = useState<string | null>(null);
  const [sort, setSort] = useState<"demand" | "price" | "buyers">("demand");

  const topRecommendedCrop = rankings[0]?.name;
  const cropDemands = getAllCropDemands();

  const filteredBuyers = useMemo(() => {
    const q = search.toLowerCase();
    return BUYERS.filter((b) =>
      b.name.toLowerCase().includes(q) ||
      b.type.toLowerCase().includes(q) ||
      b.location.toLowerCase().includes(q) ||
      b.cropDemands.some((d) => d.cropName.toLowerCase().includes(q))
    );
  }, [search]);

  const sortedCrops = useMemo(() => {
    const entries = Object.entries(cropDemands).filter(([crop]) =>
      !search || crop.toLowerCase().includes(search.toLowerCase())
    );
    return entries.sort((a, b) => {
      if (sort === "price") return b[1].priceMax - a[1].priceMax;
      if (sort === "buyers") return b[1].buyers.length - a[1].buyers.length;
      return b[1].totalQuantityHigh - a[1].totalQuantityHigh;
    });
  }, [search, sort, cropDemands]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Buyer Marketplace</h1>
        <p className="text-stone-400 mt-1">
          15 enterprise buyers actively purchasing Indian crops · Real prices · Verified companies
        </p>
        {topRecommendedCrop && (
          <div className="mt-3 inline-flex items-center gap-2 bg-green-900/30 border border-green-800 text-green-300 text-sm px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            Your recommended crop: <strong>{topRecommendedCrop}</strong> — matched buyers are highlighted
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Tabs */}
        <div className="flex bg-stone-900 border border-stone-800 rounded-lg p-1">
          {([["demands", "Crop Demands"], ["buyers", "All Buyers"]] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-green-800 text-white shadow"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1">
          <input
            className="input-field"
            placeholder="Search crops, companies, or locations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Sort */}
        {activeTab === "demands" && (
          <select
            className="input-field sm:w-48"
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
          >
            <option value="demand">Sort: Total Demand</option>
            <option value="price">Sort: Highest Price</option>
            <option value="buyers">Sort: Most Buyers</option>
          </select>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "demands" ? (
        <div className="space-y-3">
          {sortedCrops.map(([crop, data]) => {
            const isMatch = topRecommendedCrop && (
              crop.toLowerCase().includes(topRecommendedCrop.toLowerCase()) ||
              topRecommendedCrop.toLowerCase().includes(crop.toLowerCase())
            );
            const isExpanded = expandedCrop === crop;

            return (
              <div key={crop} className={`card ${isMatch ? "border-green-700" : ""}`}>
                <button
                  className="w-full flex items-center justify-between text-left"
                  onClick={() => setExpandedCrop(isExpanded ? null : crop)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{CROP_EMOJIS[crop] || "🌿"}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{crop}</span>
                        {isMatch && <span className="badge-green text-xs">Your Match ✨</span>}
                      </div>
                      <div className="text-xs text-stone-400 mt-0.5">
                        {data.buyers.length} buyer{data.buyers.length !== 1 ? "s" : ""} ·
                        {data.totalQuantityLow.toLocaleString()}–{data.totalQuantityHigh.toLocaleString()} t/yr total demand
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mr-2">
                    <div className="text-right hidden sm:block">
                      <div className="text-green-400 font-semibold text-sm">
                        ₹{data.priceMin}–₹{data.priceMax}/kg
                      </div>
                      <div className="text-stone-500 text-xs">price range</div>
                    </div>
                    <svg className={`w-5 h-5 text-stone-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-stone-800 space-y-3">
                    {data.buyers.map((buyer) => {
                      const demand = buyer.cropDemands.find((d) => d.cropName === crop);
                      if (!demand) return null;
                      return (
                        <Link key={buyer.id} href={`/marketplace/${buyer.id}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between
                                          bg-stone-800/50 rounded-lg px-4 py-3 hover:bg-stone-700/50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-900 text-green-300 flex items-center justify-center text-sm font-bold">
                                {buyer.name[0]}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-white">{buyer.name}</div>
                                <div className="text-xs text-stone-500">{buyer.location}</div>
                              </div>
                            </div>
                            <div className="flex gap-4 mt-2 sm:mt-0 text-xs ml-11 sm:ml-0">
                              <div>
                                <span className="text-stone-400">Price: </span>
                                <span className="text-green-400 font-medium">₹{demand.priceRangePerKg.min}–{demand.priceRangePerKg.max}/kg</span>
                              </div>
                              <div>
                                <span className="text-stone-400">Qty: </span>
                                <span className="text-stone-200">{demand.quantityTonnesPerYear} t/yr</span>
                              </div>
                              <div>
                                <span className={`badge-${demand.status === "actively_buying" ? "green" : "blue"}`}>
                                  {demand.status === "actively_buying" ? "Active" : "Upcoming"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredBuyers.map((buyer) => (
            <BuyerCard key={buyer.id} buyer={buyer} highlightCrop={topRecommendedCrop} />
          ))}
          {filteredBuyers.length === 0 && (
            <div className="col-span-full text-center py-16 text-stone-500">
              No buyers found for "{search}". Try a different search term.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
