"use client";

import { useState } from "react";
import { CVUpload } from "@/components/CVUpload";
import { JobOfferInput } from "@/components/JobOfferInput";
import { AdaptedCVEditor } from "@/components/AdaptedCVEditor";

export default function Home() {
  const [cvText, setCvText] = useState<string | null>(null);
  const [jobText, setJobText] = useState<string | null>(null);
  const [adaptedCv, setAdaptedCv] = useState<string | null>(null);
  const [editedCv, setEditedCv] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const ready = cvText !== null && jobText !== null;

  async function handleAdapt() {
    if (!cvText || !jobText) return;
    setStatus("loading");
    setError(null);

    const res = await fetch("/api/adapt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cvText, jobText }),
    });
    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setError(data.error ?? "Adaptation failed");
      return;
    }

    setStatus("idle");
    setAdaptedCv(data.adaptedCv);
    setEditedCv(data.adaptedCv);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Adapt your CV to any job offer</h1>
        <p className="mt-2 text-gray-600">
          Upload your CV and paste a job offer URL — we'll tailor your CV to match.
        </p>
      </div>

      <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <CVUpload onParsed={setCvText} />
        <JobOfferInput onResolved={setJobText} />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={handleAdapt}
          disabled={!ready || status === "loading"}
          className="w-full rounded-md bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-40 transition-colors"
        >
          {status === "loading" ? "Adapting…" : "Adapt my CV"}
        </button>
      </div>

      {adaptedCv && editedCv !== null && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <AdaptedCVEditor
            initialValue={adaptedCv}
            onChange={setEditedCv}
          />
        </div>
      )}
    </div>
  );
}
