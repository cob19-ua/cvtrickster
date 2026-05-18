import { NextRequest, NextResponse } from "next/server";
type PdfParseResult = { text: string };
type PdfParseFn = (buf: Buffer) => Promise<PdfParseResult>;
// Use the Node.js-specific build; unwrap CJS default if needed
// eslint-disable-next-line @typescript-eslint/no-require-imports
const _pdfMod = require("pdf-parse/node");
const pdfParse: PdfParseFn = typeof _pdfMod === "function" ? _pdfMod : _pdfMod.default;
import mammoth from "mammoth";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File exceeds 5MB limit" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    let text: string;

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      const result = await pdfParse(buffer);
      text = result.text;
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Upload a PDF or DOCX." },
        { status: 400 }
      );
    }

    if (!text.trim()) {
      return NextResponse.json({ error: "Could not extract text from file" }, { status: 422 });
    }

    return NextResponse.json({ text: text.trim() });
  } catch {
    return NextResponse.json({ error: "Failed to parse file" }, { status: 500 });
  }
}
