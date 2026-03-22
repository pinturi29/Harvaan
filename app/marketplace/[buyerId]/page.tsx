"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BUYERS } from "@/data/buyers";
import { useFarm } from "@/context/FarmContext";

function Modal({ buyerName, onConfirm, onCancel }: {
  buyerName: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full border-green-900">
        <h3 className="text-xl font-bold text-white mb-3">Connect with {buyerName}</h3>
        <div className="bg-yellow-950/40 border border-yellow-800 rounded-lg p-4 mb-5 text-sm text-yellow-200">
          <p className="font-semibold mb-2">📋 Your farm profile will be shared:</p>
          <ul className="space-y-1 text-yellow-300/80">
            <li>• Soil analysis (pH, NPK, organic carbon)</li>
            <li>• Recommended crops and scores</li>
            <li>• Farm location and land size</li>
            <li>• Projected yields and profitability</li>
          </ul>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 btn-outline">Cancel</button>
          <button onClick={onConfirm} className="flex-1 btn-primary">Send My Profile →</button>
        </div>
      </div>
    </div>
  );
}

function SuccessModal({ buyerName, onClose }: { buyerName: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full text-center border-green-800">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-white mb-2">Request Sent!</h3>
        <p className="text-stone-400 mb-2">
          <strong className="text-white">{buyerName}</strong> will review your farm profile and respond within{" "}
          <strong className="text-green-400">5 business days</strong>.
        </p>
        <p className="text-stone-500 text-sm mb-6">
          They'll see your soil analysis, recommended crops, and projected yields.
          Watch your email for their response.
        </p>
        <button onClick={onClose} className="btn-primary w-full">Got it</button>
      </div>
    </div>
  );
}

export default function BuyerDetailPage() {
  const params = useParams();
  const buyerId = parseInt(params.buyerId as string);
  const buyer = BUYERS.find((b) => b.id === buyerId);
  const { rankings } = useFarm();

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const topCrop = rankings[0]?.name;

  if (!buyer) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-6">🏢</div>
        <h1 className="text-2xl font-bold text-white mb-3">Buyer Not Found</h1>
        <Link href="/marketplace" className="btn-primary inline-block">← Back to Marketplace</Link>
      </div>
    );
  }

  const handleConfirm = () => {
    setShowConnectModal(false);
    setShowSuccessModal(true);
  };

  const avatarColors = ["bg-green-900 text-green-300", "bg-blue-900 text-blue-300",
    "bg-purple-900 text-purple-300", "bg-amber-900 text-amber-300", "bg-teal-900 text-teal-300"];
  const color = avatarColors[buyer.id % avatarColors.length];

  return (
    <>
      {showConnectModal && (
        <Modal buyerName={buyer.name} onConfirm={handleConfirm} onCancel={() => setShowConnectModal(false)} />
      )}
      {showSuccessModal && (
        <SuccessModal buyerName={buyer.name} onClose={() => setShowSuccessModal(false)} />
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-stone-500 mb-6">
          <Link href="/marketplace" className="hover:text-stone-300 transition-colors">Marketplace</Link>
          <span>›</span>
          <span className="text-stone-300">{buyer.name}</span>
        </div>

        {/* Company Header */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-xl ${color} flex items-center justify-center text-2xl font-bold flex-shrink-0`}>
                {buyer.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-2xl font-bold text-white">{buyer.name}</h1>
                  {buyer.verified && <span className="badge-green">Verified ✓</span>}
                </div>
                <p className="text-stone-400 text-sm">{buyer.type}</p>
                <p className="text-stone-500 text-sm mt-0.5">📍 {buyer.location}</p>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className={`w-4 h-4 ${s <= Math.floor(buyer.rating) ? "text-yellow-400" : "text-stone-600"}`}
                      fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-stone-400 text-sm ml-1">{buyer.rating.toFixed(1)} / 5.0</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowConnectModal(true)}
              className="btn-primary whitespace-nowrap self-start"
            >
              🤝 Connect with Buyer
            </button>
          </div>

          <p className="text-stone-300 text-sm leading-relaxed mt-5 pt-5 border-t border-stone-800">
            {buyer.description}
          </p>
        </div>

        {/* Crop Demands Table */}
        <div className="card mb-6">
          <h2 className="section-heading mb-4">Active Crop Demands</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-800">
                  {["Crop", "Quantity (t/yr)", "Price (₹/kg)", "Contract", "Quality Requirements", "Status"].map((h) => (
                    <th key={h} className="text-left py-3 px-3 text-stone-400 font-medium text-xs whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {buyer.cropDemands.map((demand) => {
                  const isMatch = topCrop && (
                    demand.cropName.toLowerCase().includes(topCrop.toLowerCase()) ||
                    topCrop.toLowerCase().includes(demand.cropName.toLowerCase())
                  );
                  return (
                    <tr key={demand.cropName} className={`border-b border-stone-800/50 ${isMatch ? "bg-green-950/30" : ""}`}>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white whitespace-nowrap">{demand.cropName}</span>
                          {isMatch && <span className="badge-green text-xs">Your Match</span>}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-stone-300">{demand.quantityTonnesPerYear}</td>
                      <td className="py-3 px-3">
                        <span className="text-green-400 font-medium">
                          ₹{demand.priceRangePerKg.min}–{demand.priceRangePerKg.max}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`badge-${demand.contractType === "annual" ? "blue" : demand.contractType === "seasonal" ? "gold" : "green"}`}>
                          {demand.contractType}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-stone-400 text-xs max-w-xs">{demand.qualityRequirements}</td>
                      <td className="py-3 px-3">
                        <span className={`badge-${demand.status === "actively_buying" ? "green" : "blue"}`}>
                          {demand.status === "actively_buying" ? "Active" : "Upcoming"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="card border-green-900 text-center py-8">
          <h3 className="text-xl font-bold text-white mb-2">Interested in Selling to {buyer.name}?</h3>
          <p className="text-stone-400 mb-6 text-sm max-w-md mx-auto">
            Send them your farm profile, soil analysis, and crop projections. They typically respond within 5 business days.
          </p>
          <button onClick={() => setShowConnectModal(true)} className="btn-gold py-3 px-10 text-base">
            🤝 Connect with this Buyer
          </button>
        </div>
      </div>
    </>
  );
}
