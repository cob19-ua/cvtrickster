import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a CV adaptation specialist. Your job is to rewrite and restructure a Job Seeker's CV to better match a specific Job Offer.

RULES — follow these exactly:
1. NEVER invent, fabricate, or add experience, skills, education, or achievements that are not present in the original CV.
2. You MAY rewrite bullet points to mirror the language, keywords, and emphasis of the Job Offer — as long as the underlying fact remains true.
3. You MAY reorder sections and bullets to front-load what the Job Offer cares about most.
4. You MAY remove or de-emphasise sections that are irrelevant to the Job Offer.
5. Preserve the Job Seeker's name, contact details, dates, and company names exactly.
6. Output valid Markdown. Use ## for section headings, **bold** for job titles and company names, and - for bullet lists.
7. Do not add a preamble or explanation — output only the adapted CV.`;

export async function POST(req: NextRequest) {
  const { cvText, jobText } = await req.json();

  if (!cvText || typeof cvText !== "string") {
    return NextResponse.json({ error: "Missing CV text" }, { status: 400 });
  }
  if (!jobText || typeof jobText !== "string") {
    return NextResponse.json({ error: "Missing job description text" }, { status: 400 });
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `Here is the Job Seeker's CV:\n\n<cv>\n${cvText}\n</cv>\n\nHere is the Job Offer description:\n\n<job_offer>\n${jobText}\n</job_offer>\n\nAdapt the CV to match this Job Offer. Output only the adapted CV in Markdown.`,
        },
      ],
    });

    const block = message.content[0];
    if (block.type !== "text") {
      return NextResponse.json({ error: "Unexpected response from Claude" }, { status: 500 });
    }

    return NextResponse.json({ adaptedCv: block.text });
  } catch (err) {
    const message = err instanceof Anthropic.APIError ? err.message : "Claude API error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
