import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  try {
    new URL(url); // validate URL shape
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Could not fetch the job offer page. Try pasting the description manually." },
        { status: 422 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove noise
    $("script, style, nav, header, footer, iframe, [aria-hidden='true']").remove();

    const text = $("body").text().replace(/\s+/g, " ").trim();

    if (!text || text.length < 100) {
      return NextResponse.json(
        { error: "Page content too short to extract. Try pasting the description manually." },
        { status: 422 }
      );
    }

    return NextResponse.json({ text });
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    return NextResponse.json(
      {
        error: isTimeout
          ? "Request timed out. Try pasting the description manually."
          : "Could not scrape the page. Try pasting the description manually.",
      },
      { status: 422 }
    );
  }
}
