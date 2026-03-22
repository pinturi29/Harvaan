"use client";

import { useState } from "react";
import Link from "next/link";
import { useFarm } from "@/context/FarmContext";
import { getBuyersForCrop } from "@/data/buyers";

// ─── Section Renderer ────────────────────────────────────────────────────────

function GuideSection({
  icon, title, content, className = "",
}: { icon: string; title: string; content: string; className?: string }) {
  if (!content) return null;
  // Convert markdown-style bold and bullet points for display
  const formatted = content
    .split("\n")
    .map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} className="h-2" />;
      if (trimmed.startsWith("Month")) {
        return (
          <div key={i} className="flex gap-3 py-2 border-l-2 border-green-700 pl-4 mb-2">
            <div className="text-sm text-stone-200">{trimmed}</div>
          </div>
        );
      }
      if (trimmed.startsWith("-") || trimmed.startsWith("•")) {
        return (
          <div key={i} className="flex gap-2 text-sm text-stone-300 mb-1 ml-2">
            <span className="text-green-500 mt-0.5">•</span>
            <span>{trimmed.replace(/^[-•]\s*/, "")}</span>
          </div>
        );
      }
      if (/^\d+\./.test(trimmed)) {
        return (
          <div key={i} className="flex gap-2 text-sm text-stone-300 mb-1.5">
            <span className="text-yellow-500 font-bold min-w-[1.2rem]">{trimmed.match(/^\d+/)?.[0]}.</span>
            <span>{trimmed.replace(/^\d+\.\s*/, "")}</span>
          </div>
        );
      }
      if (trimmed.startsWith("**") || trimmed.endsWith("**")) {
        return <p key={i} className="font-semibold text-stone-100 text-sm mt-3 mb-1">{trimmed.replace(/\*\*/g, "")}</p>;
      }
      return <p key={i} className="text-sm text-stone-300 leading-relaxed mb-2">{trimmed}</p>;
    });

  return (
    <div className={`card mb-5 ${className}`}>
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-800">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div>{formatted}</div>
    </div>
  );
}

// ─── Transition Timeline ──────────────────────────────────────────────────────

function TransitionTimeline({ content }: { content: string }) {
  const months = content.split("\n").filter((l) => l.trim().startsWith("Month"));
  if (months.length === 0) return <GuideSection icon="📅" title="Transition Plan" content={content} />;

  return (
    <div className="card mb-5">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-stone-800">
        <span className="text-2xl">📅</span>
        <h3 className="text-lg font-semibold text-white">Transition Plan</h3>
      </div>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-green-900" />
        {content.split("\n").filter((l) => l.trim()).map((line, i) => {
          const isMonth = line.trim().startsWith("Month");
          return (
            <div key={i} className={`relative pl-10 pb-4 ${isMonth ? "" : "ml-2"}`}>
              {isMonth && (
                <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-green-600 border-2 border-green-400" />
              )}
              <p className={`text-sm ${isMonth ? "font-semibold text-green-300" : "text-stone-400 mt-1"}`}>
                {line.trim().replace(/^-\s*/, "")}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Risk Meter ───────────────────────────────────────────────────────────────

function RiskMeter({ score }: { score: number }) {
  const color = score < 35 ? "#4ade80" : score < 65 ? "#facc15" : "#f87171";
  const label = score < 35 ? "Low Risk" : score < 65 ? "Medium Risk" : "High Risk";
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-stone-400 mb-1">
        <span>Risk Level</span>
        <span style={{ color }}>{label}</span>
      </div>
      <div className="h-2.5 bg-stone-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: `linear-gradient(to right, #4ade80, #facc15, #f87171)` }}
        />
      </div>
    </div>
  );
}

// ─── PDF Download ─────────────────────────────────────────────────────────────

async function downloadPDF(guide: NonNullable<ReturnType<typeof useFarm>["guide"]>, farmData: NonNullable<ReturnType<typeof useFarm>["farmData"]>, topCrop: { name: string; soilFit: number; estimatedProfit: { low: number; mid: number; high: number }; riskLevel: string }) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;

  // Cover page
  doc.setFillColor(10, 35, 16);
  doc.rect(0, 0, W, 297, "F");
  doc.setTextColor(184, 134, 11);
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.text("HARVAAN", W / 2, 60, { align: "center" });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("Crop Transition Report", W / 2, 80, { align: "center" });
  doc.setFontSize(13);
  doc.setTextColor(180, 180, 180);
  doc.text(`Recommended Crop: ${guide.topCrop}`, W / 2, 105, { align: "center" });
  doc.text(`Farmer: ${farmData.district}, ${farmData.state}`, W / 2, 115, { align: "center" });
  doc.text(`Land: ${farmData.landSize} hectares`, W / 2, 125, { align: "center" });
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, W / 2, 135, { align: "center" });

  // Summary table on cover
  autoTable(doc, {
    startY: 155,
    head: [["Metric", "Value"]],
    body: [
      ["Soil Fit Score", `${topCrop.soilFit}/100`],
      ["Projected Profit (mid)", `₹${topCrop.estimatedProfit.mid.toLocaleString()}`],
      ["Projected Profit (high)", `₹${topCrop.estimatedProfit.high.toLocaleString()}`],
      ["Risk Level", topCrop.riskLevel],
      ["Current Crop", farmData.currentCrop],
    ],
    theme: "grid",
    headStyles: { fillColor: [26, 92, 46], textColor: [255, 255, 255] },
    bodyStyles: { fillColor: [20, 72, 36], textColor: [220, 220, 220] },
    styles: { font: "helvetica", fontSize: 11 },
    margin: { left: 40, right: 40 },
  });

  // Sections
  const sections = [
    { title: "Executive Summary", content: guide.executive_summary },
    { title: "Soil Analysis", content: guide.soil_analysis },
    { title: "Recommended Crop: " + guide.topCrop, content: guide.recommended_crop },
    { title: "Transition Plan", content: guide.transition_plan },
    { title: "Risk Assessment", content: guide.risk_assessment },
    { title: "Alternative Crops", content: guide.alternatives },
    { title: "Action Plan – Next 30 Days", content: guide.action_plan },
  ];

  sections.forEach((sec) => {
    if (!sec.content) return;
    doc.addPage();
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, W, 297, "F");

    doc.setFillColor(26, 92, 46);
    doc.rect(0, 0, W, 18, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(sec.title, 15, 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    const lines = doc.splitTextToSize(sec.content, W - 30);
    doc.text(lines, 15, 28);

    // Page number
    const pageNum = doc.getCurrentPageInfo().pageNumber;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${pageNum} | Harvaan Crop Guide`, W / 2, 290, { align: "center" });
  });

  doc.save(`Harvaan_Crop_Guide_${guide.topCrop.replace(/ /g, "_")}.pdf`);
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CropGuidePage() {
  const { guide, farmData, rankings } = useFarm();
  const [downloading, setDownloading] = useState(false);

  if (!guide || !farmData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-6">📄</div>
        <h1 className="text-2xl font-bold text-white mb-3">No Guide Generated Yet</h1>
        <p className="text-stone-400 mb-8">Go to your dashboard to generate the AI crop transition guide.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/soil-input" className="btn-outline">Enter Farm Data</Link>
          <Link href="/dashboard" className="btn-primary">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  const top = rankings[0];
  const matchedBuyers = getBuyersForCrop(guide.topCrop).slice(0, 4);

  const handleDownload = async () => {
    if (!top) return;
    setDownloading(true);
    try {
      await downloadPDF(guide, farmData, top);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="card border-green-900 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-gold">AI Crop Guide</span>
              <span className="text-stone-500 text-xs">Generated by Claude</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">{guide.topCropEmoji}</span>
              {guide.topCrop} Transition Guide
            </h1>
            <p className="text-stone-400 text-sm mt-1">
              {farmData.district}, {farmData.state} · {farmData.landSize} ha ·{" "}
              {new Date().toLocaleDateString("en-IN")}
            </p>
          </div>
          <div className="flex gap-3 items-center">
            {top && (
              <div className="text-center">
                <div className={`text-2xl font-bold ${top.soilFit >= 70 ? "text-green-400" : top.soilFit >= 50 ? "text-yellow-400" : "text-orange-400"}`}>
                  {top.soilFit}
                </div>
                <div className="text-xs text-stone-400">Soil Fit</div>
              </div>
            )}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn-gold flex items-center gap-2"
            >
              {downloading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "📥"}
              {downloading ? "Generating..." : "Download PDF"}
            </button>
          </div>
        </div>

        {/* Profit snapshot */}
        {top && (
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-stone-800">
            {[
              { label: "Profit (Low)", value: `₹${top.estimatedProfit.low.toLocaleString()}`, color: "text-stone-300" },
              { label: "Profit (Mid)", value: `₹${top.estimatedProfit.mid.toLocaleString()}`, color: "text-green-400" },
              { label: "Profit (High)", value: `₹${top.estimatedProfit.high.toLocaleString()}`, color: "text-yellow-400" },
            ].map((p) => (
              <div key={p.label} className="text-center">
                <div className={`text-lg font-bold ${p.color}`}>{p.value}</div>
                <div className="text-xs text-stone-500">{p.label}/season</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guide Sections */}
      <GuideSection icon="📋" title="Executive Summary" content={guide.executive_summary} />
      <GuideSection icon="🧪" title="Soil Analysis" content={guide.soil_analysis} />
      <GuideSection icon={guide.topCropEmoji} title={`Why ${guide.topCrop}?`} content={guide.recommended_crop} />
      <TransitionTimeline content={guide.transition_plan} />

      {/* Risk section with meter */}
      <div className="card mb-5">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-800">
          <span className="text-2xl">⚠️</span>
          <h3 className="text-lg font-semibold text-white">Risk Assessment</h3>
        </div>
        {top && <RiskMeter score={top.riskScore} />}
        <div className="mt-4 space-y-1">
          {guide.risk_assessment.split("\n").filter((l) => l.trim()).map((line, i) => {
            const t = line.trim();
            if (/^\d+\./.test(t)) {
              return (
                <div key={i} className="flex gap-2 text-sm text-stone-300 mb-2">
                  <span className="text-yellow-500 font-bold min-w-[1.2rem]">{t.match(/^\d+/)?.[0]}.</span>
                  <span>{t.replace(/^\d+\.\s*/, "")}</span>
                </div>
              );
            }
            if (t.startsWith("-") || t.startsWith("•")) {
              return (
                <div key={i} className="flex gap-2 text-sm text-stone-400 ml-4">
                  <span className="text-stone-600">–</span>
                  <span>{t.replace(/^[-•]\s*/, "")}</span>
                </div>
              );
            }
            return <p key={i} className="text-sm text-stone-300 leading-relaxed mb-2">{t}</p>;
          })}
        </div>
      </div>

      <GuideSection icon="🌿" title="Alternative Crops" content={guide.alternatives} />

      {/* Action plan with checkboxes */}
      <div className="card mb-5 border-yellow-900">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-stone-800">
          <span className="text-2xl">✅</span>
          <h3 className="text-lg font-semibold text-white">Action Plan — Next 30 Days</h3>
        </div>
        <div className="space-y-2">
          {guide.action_plan.split("\n").filter((l) => l.trim()).map((line, i) => {
            const t = line.trim();
            if (/^\d+\./.test(t)) {
              return (
                <label key={i} className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-0.5 accent-green-500" />
                  <span className="text-sm text-stone-300 group-hover:text-white transition-colors">
                    {t.replace(/^\d+\.\s*/, "")}
                  </span>
                </label>
              );
            }
            return <p key={i} className="text-sm text-stone-400 ml-6">{t.replace(/^[-•]\s*/, "")}</p>;
          })}
        </div>
      </div>

      {/* Matched buyers */}
      {matchedBuyers.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-heading">Buyers for {guide.topCrop}</h3>
            <Link href="/marketplace" className="text-green-400 hover:text-green-300 text-sm">View All →</Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {matchedBuyers.map((buyer) => {
              const demand = buyer.cropDemands.find((d) =>
                d.cropName.toLowerCase().includes(guide.topCrop.toLowerCase()) ||
                guide.topCrop.toLowerCase().includes(d.cropName.toLowerCase())
              );
              return (
                <Link key={buyer.id} href={`/marketplace/${buyer.id}`}>
                  <div className="card-hover">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center text-green-300 font-bold">
                        {buyer.name[0]}
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{buyer.name}</div>
                        <div className="text-xs text-stone-500">{buyer.type}</div>
                      </div>
                      <div className="ml-auto">
                        <span className="badge-green">Verified ✓</span>
                      </div>
                    </div>
                    {demand && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-stone-800/50 rounded p-2">
                          <div className="text-stone-400">Price Range</div>
                          <div className="text-green-400 font-medium">₹{demand.priceRangePerKg.min}–{demand.priceRangePerKg.max}/kg</div>
                        </div>
                        <div className="bg-stone-800/50 rounded p-2">
                          <div className="text-stone-400">Quantity</div>
                          <div className="text-stone-200 font-medium">{demand.quantityTonnesPerYear} t/yr</div>
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

      {/* Bottom PDF button */}
      <div className="mt-8 text-center">
        <button onClick={handleDownload} disabled={downloading} className="btn-gold py-3 px-10">
          📥 Download Full PDF Report
        </button>
        <p className="text-stone-500 text-xs mt-2">
          Professional consulting-grade report · Share with your bank, co-op, or family
        </p>
      </div>
    </div>
  );
}
