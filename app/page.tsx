"use client";

import Link from "next/link";

const features = [
  {
    icon: "🧪",
    title: "Deep Soil Analysis",
    desc: "Enter pH, NPK levels, organic carbon, soil type, and drainage. We map your soil profile against 15 crops to find the perfect fit.",
  },
  {
    icon: "🤖",
    title: "AI Transition Guide",
    desc: "Claude generates a personalized month-by-month transition plan with profit projections, soil prep steps, and risk mitigation.",
  },
  {
    icon: "🏪",
    title: "Enterprise Marketplace",
    desc: "Connect directly with Synthite, ITC, Cargill, Olam, and 11 other top buyers who are actively seeking your crops.",
  },
  {
    icon: "📊",
    title: "Profit Comparison",
    desc: "See exact revenue projections for your recommended crop vs. current crop — low, mid, and high scenarios with input cost breakdowns.",
  },
  {
    icon: "📄",
    title: "Downloadable PDF Guide",
    desc: "Get a professional consulting-grade report you can share with your bank, co-op, or family when planning the transition.",
  },
  {
    icon: "⚡",
    title: "5-Minute Setup",
    desc: "A guided multi-step form captures everything needed. No account required. Your data stays on your device.",
  },
];

const steps = [
  { n: "01", title: "Enter Farm Data", desc: "Tell us about your soil, location, current crops, and resources." },
  { n: "02", title: "Get Your Score", desc: "Our engine scores 15 crops for soil fit, profitability, and risk." },
  { n: "03", title: "Read Your Guide", desc: "Claude generates a full personalized transition guide — download as PDF." },
  { n: "04", title: "Meet Your Buyers", desc: "See which companies want your recommended crop and at what price." },
];

const stats = [
  { value: "15", label: "Crops Analyzed", sub: "scored against your soil" },
  { value: "15", label: "Enterprise Buyers", sub: "Synthite, ITC, Cargill & more" },
  { value: "5", label: "Minutes", sub: "to your personalized guide" },
  { value: "3×", label: "Profit Potential", sub: "vs. average paddy rotation" },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-24">
        {/* BG gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/30 via-stone-950 to-yellow-950/20 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(46,125,50,0.15),transparent)] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-900/30 border border-green-800 text-green-400
                          text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            AI-Powered Crop Transition Platform for Indian Farmers
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-white">Grow What</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-500">
              Your Soil Loves
            </span>
          </h1>

          <p className="text-xl text-stone-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Enter your soil data. Get a personalized AI transition guide. Connect with enterprise buyers
            who are actively purchasing your ideal crop — all in under 10 minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/soil-input" className="btn-primary text-base py-3 px-8 inline-block">
              Analyze My Farm →
            </Link>
            <Link href="/marketplace" className="btn-outline text-base py-3 px-8 inline-block">
              Browse Buyers
            </Link>
          </div>

          <p className="mt-6 text-stone-600 text-sm">
            No signup required · Your data stays local · Free to use
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-stone-800 bg-stone-900/40 py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-1">{s.value}</div>
              <div className="text-stone-200 font-semibold text-sm">{s.label}</div>
              <div className="text-stone-500 text-xs mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">How Harvaan Works</h2>
            <p className="text-stone-400 text-lg">From soil data to signed buyer contract in four steps</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-green-800 to-transparent z-0" />
                )}
                <div className="card relative z-10">
                  <div className="text-4xl font-black text-green-900 mb-3">{s.n}</div>
                  <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-stone-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-stone-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Everything You Need</h2>
            <p className="text-stone-400 text-lg">Tools built for real farming decisions</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card hover:border-stone-600 transition-all duration-200">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card border-green-900">
            <div className="text-4xl mb-4">🌾</div>
            <h2 className="text-3xl font-bold text-white mb-3">Ready to Find Your Best Crop?</h2>
            <p className="text-stone-400 mb-8 text-lg">
              It takes 5 minutes to enter your farm data. Your personalized AI guide is generated instantly.
            </p>
            <Link href="/soil-input" className="btn-primary text-base py-3 px-10 inline-block">
              Start Free Analysis →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
