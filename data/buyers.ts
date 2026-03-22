export interface CropDemand {
  cropName: string;
  quantityTonnesPerYear: string;
  priceRangePerKg: { min: number; max: number };
  qualityRequirements: string;
  contractType: "spot" | "seasonal" | "annual";
  status: "actively_buying" | "upcoming";
}

export interface Buyer {
  id: number;
  name: string;
  type: string;
  location: string;
  description: string;
  verified: boolean;
  rating: number;
  website?: string;
  cropDemands: CropDemand[];
}

export const BUYERS: Buyer[] = [
  {
    id: 1,
    name: "Synthite Industries",
    type: "Essential Oils & Oleoresins",
    location: "Kolenchery, Kerala",
    description: "India's largest producer of spice oleoresins and essential oils. Sources high-grade turmeric, chili, and spice crops from smallholder farmers across South India through their Farmer Connect program.",
    verified: true,
    rating: 4.8,
    cropDemands: [
      { cropName: "Turmeric", quantityTonnesPerYear: "2000–5000", priceRangePerKg: { min: 110, max: 160 }, qualityRequirements: "Min 3% curcumin, dry polished fingers, moisture <12%", contractType: "annual", status: "actively_buying" },
      { cropName: "Red Chili", quantityTonnesPerYear: "1000–3000", priceRangePerKg: { min: 95, max: 175 }, qualityRequirements: "Teja/334 variety, ASTA 80+, moisture <10%", contractType: "annual", status: "actively_buying" },
      { cropName: "Black Pepper", quantityTonnesPerYear: "200–500", priceRangePerKg: { min: 350, max: 550 }, qualityRequirements: "Grade 1, 550 g/l bulk density, moisture <12%", contractType: "seasonal", status: "actively_buying" },
    ],
  },
  {
    id: 2,
    name: "AVT Natural Products",
    type: "Natural Extracts & Oleoresins",
    location: "Cochin, Kerala",
    description: "A leading exporter of natural extracts, oleoresins, and essential oils certified to ISO and FSSC standards. Particularly focused on turmeric and cardamom sourcing with traceability to the farm level.",
    verified: true,
    rating: 4.7,
    cropDemands: [
      { cropName: "Turmeric", quantityTonnesPerYear: "500–1500", priceRangePerKg: { min: 105, max: 155 }, qualityRequirements: "Curcumin >3.5%, clean, free of pesticide residues", contractType: "annual", status: "actively_buying" },
      { cropName: "Lemongrass", quantityTonnesPerYear: "100–300", priceRangePerKg: { min: 4.5, max: 6.5 }, qualityRequirements: "Fresh cut, >75% citral oil content", contractType: "seasonal", status: "actively_buying" },
    ],
  },
  {
    id: 3,
    name: "ITC Agri Business",
    type: "FMCG & Agri Commodities",
    location: "Hyderabad, Telangana",
    description: "ITC's agribusiness division procures agricultural commodities through their e-Choupal network — India's largest rural digital infrastructure. Buys wheat, rice, spices, and pulses at transparent market-linked prices.",
    verified: true,
    rating: 4.9,
    cropDemands: [
      { cropName: "Paddy Rice", quantityTonnesPerYear: "50000–100000", priceRangePerKg: { min: 20, max: 26 }, qualityRequirements: "Fine grain, moisture <14%, free of stones and impurities", contractType: "annual", status: "actively_buying" },
      { cropName: "Red Chili", quantityTonnesPerYear: "5000–15000", priceRangePerKg: { min: 90, max: 165 }, qualityRequirements: "Guntur/Teja varieties, good colour, moisture <10%", contractType: "seasonal", status: "actively_buying" },
      { cropName: "Turmeric", quantityTonnesPerYear: "2000–6000", priceRangePerKg: { min: 100, max: 150 }, qualityRequirements: "Erode/Nizamabad variety, curcumin >2.5%", contractType: "annual", status: "actively_buying" },
      { cropName: "Black Gram", quantityTonnesPerYear: "3000–8000", priceRangePerKg: { min: 68, max: 85 }, qualityRequirements: "Bold grain, machine cleaned, moisture <12%", contractType: "seasonal", status: "actively_buying" },
    ],
  },
  {
    id: 4,
    name: "Olam Agri India",
    type: "Global Agricultural Supply Chain",
    location: "Chennai, Tamil Nadu",
    description: "Olam is one of the world's largest agri-commodity traders. Their India operations source spices, rice, and oilseeds for export to over 60 countries. Offer pre-financing support to contracted farmers.",
    verified: true,
    rating: 4.6,
    cropDemands: [
      { cropName: "Groundnut", quantityTonnesPerYear: "10000–30000", priceRangePerKg: { min: 52, max: 72 }, qualityRequirements: "Bold java variety, aflatoxin <4ppb, moisture <9%", contractType: "annual", status: "actively_buying" },
      { cropName: "Sesame", quantityTonnesPerYear: "2000–5000", priceRangePerKg: { min: 115, max: 165 }, qualityRequirements: "White sesame, >99% purity, oil content >48%", contractType: "seasonal", status: "actively_buying" },
      { cropName: "Cotton", quantityTonnesPerYear: "20000–60000", priceRangePerKg: { min: 58, max: 72 }, qualityRequirements: "Staple length 28mm+, micronaire 3.5–4.9, moisture <8%", contractType: "annual", status: "actively_buying" },
      { cropName: "Maize", quantityTonnesPerYear: "30000–80000", priceRangePerKg: { min: 19, max: 27 }, qualityRequirements: "Moisture <14%, aflatoxin free, yellow variety", contractType: "seasonal", status: "actively_buying" },
    ],
  },
  {
    id: 5,
    name: "Eastern Condiments",
    type: "Spice Processing & FMCG",
    location: "Muvattupuzha, Kerala",
    description: "One of Kerala's leading spice companies, processing and marketing branded spice products. Sources turmeric, chili, and pepper through a network of 50,000+ farm families.",
    verified: true,
    rating: 4.5,
    cropDemands: [
      { cropName: "Turmeric", quantityTonnesPerYear: "800–2000", priceRangePerKg: { min: 100, max: 145 }, qualityRequirements: "Bright colour, curcumin >3%, clean", contractType: "annual", status: "actively_buying" },
      { cropName: "Red Chili", quantityTonnesPerYear: "600–1800", priceRangePerKg: { min: 88, max: 160 }, qualityRequirements: "Bright red, ASTA 60+, free of mould", contractType: "seasonal", status: "actively_buying" },
    ],
  },
  {
    id: 6,
    name: "Kancor Ingredients",
    type: "Spice Extracts & Natural Colours",
    location: "Angamaly, Kerala",
    description: "A subsidiary of AVT Group specialising in natural colour extracts and spice oleoresins for food industry clients. Needs high-curcumin turmeric and high-ASTA chili with strict pesticide compliance.",
    verified: true,
    rating: 4.7,
    cropDemands: [
      { cropName: "Turmeric", quantityTonnesPerYear: "600–1500", priceRangePerKg: { min: 115, max: 170 }, qualityRequirements: "Curcumin >4%, Alleppey variety preferred, pesticide residue free", contractType: "annual", status: "actively_buying" },
      { cropName: "Red Chili", quantityTonnesPerYear: "400–1200", priceRangePerKg: { min: 100, max: 195 }, qualityRequirements: "ASTA 120+, low moisture, pesticide residue free", contractType: "annual", status: "actively_buying" },
    ],
  },
  {
    id: 7,
    name: "Cargill India",
    type: "Agri-Commodities & Processing",
    location: "Gurugram, Haryana",
    description: "Cargill's India operations cover edible oils, food ingredients, and agricultural commodities. They procure cotton, maize, and oilseeds for both domestic processing and export, with strong logistics infrastructure.",
    verified: true,
    rating: 4.6,
    cropDemands: [
      { cropName: "Maize", quantityTonnesPerYear: "50000–150000", priceRangePerKg: { min: 19, max: 26 }, qualityRequirements: "Yellow maize, moisture <14%, protein >8%, no mycotoxins", contractType: "annual", status: "actively_buying" },
      { cropName: "Cotton", quantityTonnesPerYear: "15000–50000", priceRangePerKg: { min: 56, max: 70 }, qualityRequirements: "BT cotton, machine picked preferred, gin turnout >40%", contractType: "annual", status: "actively_buying" },
      { cropName: "Groundnut", quantityTonnesPerYear: "8000–25000", priceRangePerKg: { min: 50, max: 68 }, qualityRequirements: "Sound bold java, aflatoxin <8ppb, moisture <9%", contractType: "seasonal", status: "actively_buying" },
      { cropName: "Sunflower", quantityTonnesPerYear: "5000–15000", priceRangePerKg: { min: 47, max: 65 }, qualityRequirements: "Oil content >42%, moisture <10%, clean", contractType: "seasonal", status: "actively_buying" },
    ],
  },
  {
    id: 8,
    name: "Adani Wilmar",
    type: "Edible Oils & Food Products",
    location: "Ahmedabad, Gujarat",
    description: "India's leading branded edible oil company (Fortune brand). Procures sunflower, groundnut, and mustard at scale from farming clusters in Karnataka, AP, and Rajasthan.",
    verified: true,
    rating: 4.4,
    cropDemands: [
      { cropName: "Sunflower", quantityTonnesPerYear: "20000–60000", priceRangePerKg: { min: 45, max: 62 }, qualityRequirements: "Oil content >42%, moisture <10%", contractType: "annual", status: "actively_buying" },
      { cropName: "Groundnut", quantityTonnesPerYear: "15000–40000", priceRangePerKg: { min: 48, max: 65 }, qualityRequirements: "Runner/Java variety, aflatoxin <4ppb", contractType: "annual", status: "actively_buying" },
      { cropName: "Sesame", quantityTonnesPerYear: "3000–8000", priceRangePerKg: { min: 110, max: 155 }, qualityRequirements: "White sesame, >99% purity", contractType: "seasonal", status: "actively_buying" },
    ],
  },
  {
    id: 9,
    name: "Dabur India",
    type: "Ayurveda & Natural Healthcare",
    location: "Ghaziabad, Uttar Pradesh",
    description: "India's largest Ayurveda company. Sources medicinal and functional crops including turmeric and amla at premium prices for their healthcare product lines. Requires clean, pesticide-residue-free inputs.",
    verified: true,
    rating: 4.8,
    cropDemands: [
      { cropName: "Turmeric", quantityTonnesPerYear: "300–800", priceRangePerKg: { min: 130, max: 190 }, qualityRequirements: "Curcumin >5%, certified pesticide-free, organic preferred", contractType: "annual", status: "actively_buying" },
    ],
  },
  {
    id: 10,
    name: "Hindustan Unilever",
    type: "FMCG – Foods & Beverages",
    location: "Mumbai, Maharashtra",
    description: "HUL's food division (Knorr, Kissan) sources tomatoes, onions, and key vegetables at scale from contracted farming clusters. Provides agronomic inputs and guaranteed buyback to registered farmers.",
    verified: true,
    rating: 4.9,
    cropDemands: [
      { cropName: "Tomato", quantityTonnesPerYear: "10000–30000", priceRangePerKg: { min: 9, max: 22 }, qualityRequirements: "Processing variety, soluble solids >5%, residue free", contractType: "annual", status: "actively_buying" },
      { cropName: "Onion", quantityTonnesPerYear: "8000–20000", priceRangePerKg: { min: 11, max: 28 }, qualityRequirements: "Medium to large bulbs, pungency >6%, moisture <86%", contractType: "seasonal", status: "actively_buying" },
    ],
  },
  {
    id: 11,
    name: "Tata Consumer Products",
    type: "Branded Foods & Beverages",
    location: "Kolkata, West Bengal",
    description: "The consumer foods arm of the Tata Group. Procures spices and commodities for brands including Tata Sampann. Actively investing in a direct farmer procurement network in South India.",
    verified: true,
    rating: 4.8,
    cropDemands: [
      { cropName: "Red Chili", quantityTonnesPerYear: "1000–3000", priceRangePerKg: { min: 92, max: 162 }, qualityRequirements: "Clean, bright red, moisture <10%, no adulteration", contractType: "annual", status: "actively_buying" },
      { cropName: "Turmeric", quantityTonnesPerYear: "500–1500", priceRangePerKg: { min: 105, max: 148 }, qualityRequirements: "Erode variety, clean fingers, curcumin >2.5%", contractType: "seasonal", status: "actively_buying" },
      { cropName: "Black Gram", quantityTonnesPerYear: "2000–5000", priceRangePerKg: { min: 70, max: 88 }, qualityRequirements: "Bold, machine cleaned, moisture <12%", contractType: "seasonal", status: "upcoming" },
    ],
  },
  {
    id: 12,
    name: "McCormick India",
    type: "Global Spice Company",
    location: "Mumbai, Maharashtra",
    description: "The India arm of McCormick & Company, the world's largest spice company. Sources premium spices with full traceability and GlobalGAP/Rainforest Alliance certification preferred.",
    verified: true,
    rating: 4.7,
    cropDemands: [
      { cropName: "Turmeric", quantityTonnesPerYear: "400–1000", priceRangePerKg: { min: 120, max: 175 }, qualityRequirements: "Curcumin >4%, pesticide-free, GlobalGAP preferred", contractType: "annual", status: "actively_buying" },
      { cropName: "Red Chili", quantityTonnesPerYear: "300–900", priceRangePerKg: { min: 105, max: 190 }, qualityRequirements: "ASTA 100+, pesticide residue <MRL, no artificial colour", contractType: "annual", status: "actively_buying" },
    ],
  },
  {
    id: 13,
    name: "Plant Lipids",
    type: "Spice Oleoresins & Essential Oils",
    location: "Cochin, Kerala",
    description: "A major exporter of spice oleoresins and essential oils to the global food industry. Sources ginger, pepper, turmeric, and cardamom. Offers premium prices for clean, high-curcumin turmeric.",
    verified: true,
    rating: 4.6,
    cropDemands: [
      { cropName: "Turmeric", quantityTonnesPerYear: "300–800", priceRangePerKg: { min: 118, max: 168 }, qualityRequirements: "Curcumin >4.5%, clean and dry, pesticide compliant", contractType: "annual", status: "actively_buying" },
      { cropName: "Lemongrass", quantityTonnesPerYear: "50–200", priceRangePerKg: { min: 5, max: 7.5 }, qualityRequirements: "High citral >78%, freshly cut or distilled oil", contractType: "seasonal", status: "actively_buying" },
    ],
  },
  {
    id: 14,
    name: "Akay Flavours & Aromatics",
    type: "Natural Flavour Extracts",
    location: "Cochin, Kerala",
    description: "Specialises in capsicum and turmeric oleoresins for the global food and pharma industries. A leading buyer of high-ASTA red chili and high-curcumin turmeric with fixed-price contracts.",
    verified: true,
    rating: 4.5,
    cropDemands: [
      { cropName: "Red Chili", quantityTonnesPerYear: "500–1500", priceRangePerKg: { min: 105, max: 200 }, qualityRequirements: "ASTA 150+, Byadagi/Kashmiri variety premium, moisture <9%", contractType: "annual", status: "actively_buying" },
      { cropName: "Turmeric", quantityTonnesPerYear: "200–600", priceRangePerKg: { min: 125, max: 180 }, qualityRequirements: "Curcumin >5%, Alleppey variety, certified inputs", contractType: "annual", status: "actively_buying" },
    ],
  },
  {
    id: 15,
    name: "Griffith Foods India",
    type: "Custom Food Ingredient Solutions",
    location: "Bengaluru, Karnataka",
    description: "Griffith Foods provides custom spice and flavour blends to restaurant chains and food manufacturers. Consistently buys clean spices in mid-scale volumes with strict food safety requirements and traceability.",
    verified: true,
    rating: 4.4,
    cropDemands: [
      { cropName: "Turmeric", quantityTonnesPerYear: "100–400", priceRangePerKg: { min: 112, max: 158 }, qualityRequirements: "Curcumin >3%, FSSC-compliant sourcing, pesticide free", contractType: "annual", status: "actively_buying" },
      { cropName: "Red Chili", quantityTonnesPerYear: "100–350", priceRangePerKg: { min: 98, max: 172 }, qualityRequirements: "ASTA 80+, traceable to farm, no artificial additives", contractType: "annual", status: "actively_buying" },
      { cropName: "Maize", quantityTonnesPerYear: "500–2000", priceRangePerKg: { min: 20, max: 26 }, qualityRequirements: "Food-grade yellow maize, moisture <13%, no mycotoxins", contractType: "seasonal", status: "upcoming" },
    ],
  },
];

export function getBuyersForCrop(cropName: string): Buyer[] {
  const normalised = cropName.toLowerCase();
  return BUYERS.filter((b) =>
    b.cropDemands.some((d) => d.cropName.toLowerCase().includes(normalised) || normalised.includes(d.cropName.toLowerCase()))
  );
}

export function getAllCropDemands(): Record<string, { buyers: Buyer[]; totalQuantityLow: number; totalQuantityHigh: number; priceMin: number; priceMax: number }> {
  const result: Record<string, { buyers: Buyer[]; totalQuantityLow: number; totalQuantityHigh: number; priceMin: number; priceMax: number }> = {};

  BUYERS.forEach((buyer) => {
    buyer.cropDemands.forEach((demand) => {
      const crop = demand.cropName;
      if (!result[crop]) result[crop] = { buyers: [], totalQuantityLow: 0, totalQuantityHigh: 0, priceMin: Infinity, priceMax: -Infinity };

      if (!result[crop].buyers.find((b) => b.id === buyer.id)) result[crop].buyers.push(buyer);

      const [qLo, qHi] = demand.quantityTonnesPerYear.split("–").map(Number);
      result[crop].totalQuantityLow  += qLo || 0;
      result[crop].totalQuantityHigh += qHi || qLo || 0;

      if (demand.priceRangePerKg.min < result[crop].priceMin) result[crop].priceMin = demand.priceRangePerKg.min;
      if (demand.priceRangePerKg.max > result[crop].priceMax) result[crop].priceMax = demand.priceRangePerKg.max;
    });
  });

  return result;
}
