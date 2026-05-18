"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  markdown: string;
}

export function ExportButtons({ markdown }: Props) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState<"pdf" | "md" | null>(null);

  function downloadMarkdown() {
    setExporting("md");
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "adapted-cv.md";
    a.click();
    URL.revokeObjectURL(url);
    setExporting(null);
  }

  async function downloadPDF() {
    setExporting("pdf");
    const el = previewRef.current;
    if (!el) return;

    const { default: html2canvas } = await import("html2canvas");
    const { jsPDF } = await import("jspdf");

    const canvas = await html2canvas(el, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const imgW = pageW - margin * 2;
    const imgH = (canvas.height * imgW) / canvas.width;

    let yPos = margin;
    let remaining = imgH;

    while (remaining > 0) {
      pdf.addImage(imgData, "PNG", margin, yPos, imgW, imgH);
      remaining -= pageH - margin * 2;
      if (remaining > 0) {
        pdf.addPage();
        yPos = margin - (imgH - remaining);
      }
    }

    pdf.save("adapted-cv.pdf");
    setExporting(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <button
          onClick={downloadMarkdown}
          disabled={exporting !== null}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          {exporting === "md" ? "Downloading…" : "Download Markdown"}
        </button>
        <button
          onClick={downloadPDF}
          disabled={exporting !== null}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {exporting === "pdf" ? "Generating PDF…" : "Download PDF"}
        </button>
      </div>

      {/* Hidden render target for PDF capture */}
      <div className="sr-only" aria-hidden>
        <div
          ref={previewRef}
          className="prose prose-sm max-w-none bg-white p-8"
          style={{ width: "794px" }}
        >
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
