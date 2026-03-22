import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function parseXmlTag(content: string, tag: string): string {
  const regex = new RegExp(`<${tag}>[\\s\\S]*?<\\/${tag}>`, "i");
  const match = content.match(regex);
  if (!match) return "";
  return match[0]
    .replace(new RegExp(`^<${tag}>`, "i"), "")
    .replace(new RegExp(`<\\/${tag}>$`, "i"), "")
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const { farmData, topCrops } = await req.json();

    if (!farmData || !topCrops || topCrops.length === 0) {
      return NextResponse.json({ error: "Missing farmData or topCrops" }, { status: 400 });
    }

    // Check if we have enough data to generate a meaningful guide
    const soilFields = [farmData.ph, farmData.nitrogen, farmData.phosphorus, farmData.potassium].filter(Boolean);
    const hasCrop = !!farmData.currentCrop;
    const hasLocation = !!farmData.state;

    if (!hasCrop || !hasLocation) {
      return NextResponse.json({
        error: "insufficient_data",
        message: "We need at least your location and current crop to generate a guide. Please go back and fill in those fields.",
      }, { status: 422 });
    }

    const limitedData = soilFields.length < 2 && !farmData.soilType;

    const top = topCrops[0];
    const alt1 = topCrops[1];
    const alt2 = topCrops[2];

    const systemPrompt = `You are an expert agricultural advisor for smallholder farmers in India.
You create detailed, actionable, personalised crop transition guides based on real soil data.
Write in clear, practical language that a farmer with secondary education can act on.
Use specific numbers and timelines. Structure your response strictly using the XML tags specified.
All monetary values should be in Indian Rupees (₹). All weights in kg or tonnes.
${limitedData ? "IMPORTANT: Soil test data is limited or missing for this farmer. Do NOT invent or assume specific soil numbers. Instead, acknowledge the missing data, explain what tests the farmer should get done, and base recommendations on location, climate, and crop history only. Be explicit about what you don't know." : ""}`;

    const userPrompt = `Generate a comprehensive crop transition guide for this farmer.

FARMER PROFILE:
- Location: ${farmData.district}, ${farmData.state}
- Land: ${farmData.landSize} hectares, ${farmData.climateZone} climate, elevation ${farmData.elevation || "not specified"}m
- Current Crop: ${farmData.currentCrop} (growing for ${farmData.yearsGrowing} years)
- Current Yield: ${farmData.avgYield} kg/hectare, selling at ₹${farmData.currentPrice}/kg
- Irrigation: ${farmData.irrigationType} from ${farmData.waterSource}
- Workers: ${farmData.workers}, Equipment: ${farmData.equipment?.join(", ") || "none"}
- Annual Input Cost: ₹${farmData.annualInputCost?.toLocaleString()}
- Credit Access: ${farmData.hasCredit ? "Yes" : "No"}
- Risk Tolerance: ${farmData.riskTolerance}

SOIL DATA:
- Soil Type: ${farmData.soilType}
- pH: ${farmData.ph}
- Nitrogen: ${farmData.nitrogen} kg/ha
- Phosphorus: ${farmData.phosphorus} kg/ha
- Potassium: ${farmData.potassium} kg/ha
- Organic Carbon: ${farmData.organicCarbon}%
- Drainage: ${farmData.drainage}

CROP ANALYSIS RESULTS:
Top Recommendation: ${top.name} (${top.emoji})
- Soil Fit Score: ${top.soilFit}/100
- Estimated Yield: ${top.estimatedYield.low}–${top.estimatedYield.high} kg/ha
- Estimated Profit (low/mid/high): ₹${top.estimatedProfit.low?.toLocaleString()} / ₹${top.estimatedProfit.mid?.toLocaleString()} / ₹${top.estimatedProfit.high?.toLocaleString()} per season
- Profit vs Current Crop: ₹${top.profitVsCurrent?.toLocaleString()} change
- Risk Level: ${top.riskLevel}

Alternative #2: ${alt1?.name} (Soil Fit: ${alt1?.soilFit}/100, Profit Mid: ₹${alt1?.estimatedProfit?.mid?.toLocaleString()})
Alternative #3: ${alt2?.name} (Soil Fit: ${alt2?.soilFit}/100, Profit Mid: ₹${alt2?.estimatedProfit?.mid?.toLocaleString()})

Generate a complete guide using EXACTLY these XML tags:

<executive_summary>
2-3 paragraphs: summarise their current situation (soil health, current crop profitability),
the recommendation, and the expected outcome with specific profit numbers and timeline.
</executive_summary>

<soil_analysis>
Explain their soil strengths and weaknesses in plain language — what their soil is naturally
good for, what nutrients it has in excess or is lacking, and what the pH means for crop selection.
Mention whether soil amendments are needed before transition.
</soil_analysis>

<recommended_crop>
Why ${top.name} fits their specific soil and climate. Expected yield and profit projections with
low/mid/high scenarios in rupees per season for their ${farmData.landSize} hectare farm.
Direct comparison to their current ${farmData.currentCrop} profitability.
Include market demand context and price outlook.
</recommended_crop>

<transition_plan>
Month-by-month timeline for the FIRST YEAR of transition. Format as:
Month 1-2: [specific actions]
Month 3-4: [specific actions]
... and so on.
Include: soil preparation steps, what inputs to buy and when, estimated cost at each stage,
what equipment is needed, when to plant, key growth stages to monitor, when to harvest.
</transition_plan>

<risk_assessment>
3-5 key risks specific to this farmer's situation (their soil, irrigation, location, and finances).
For each risk: describe it, give the probability (Low/Medium/High), and give a specific mitigation strategy.
Include worst-case vs best-case financial scenario.
End with 2-3 decision checkpoints where the farmer should pause and evaluate whether to continue.
</risk_assessment>

<alternatives>
Brief overview of ${alt1?.name} as backup option #1 and ${alt2?.name} as backup option #2.
For each: why it fits, profit comparison, and what kind of farmer should choose this over the top recommendation.
</alternatives>

<action_plan>
Concrete next steps for the NEXT 30 DAYS to get started.
Format as a numbered checklist with specific actions like soil testing labs to contact,
input dealers to visit, government schemes to apply for, and buyers to contact.
</action_plan>`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      temperature: 0.3,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const rawContent = message.content[0].type === "text" ? message.content[0].text : "";

    const guide = {
      executive_summary: parseXmlTag(rawContent, "executive_summary"),
      soil_analysis:     parseXmlTag(rawContent, "soil_analysis"),
      recommended_crop:  parseXmlTag(rawContent, "recommended_crop"),
      transition_plan:   parseXmlTag(rawContent, "transition_plan"),
      risk_assessment:   parseXmlTag(rawContent, "risk_assessment"),
      alternatives:      parseXmlTag(rawContent, "alternatives"),
      action_plan:       parseXmlTag(rawContent, "action_plan"),
      topCrop:           top.name,
      topCropEmoji:      top.emoji,
      rawContent,
    };

    return NextResponse.json({ guide });
  } catch (err: unknown) {
    console.error("Guide generation error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to generate guide: ${message}` },
      { status: 500 },
    );
  }
}
