"use client";

import { useState } from "react";
import { CVUpload } from "@/components/CVUpload";
import { JobOfferInput } from "@/components/JobOfferInput";

export default function Home() {
  const [cvText, setCvText] = useState<string | null>(null);
  const [jobText, setJobText] = useState<string | null>(null);

  const ready = cvText !== null && jobText !== null;

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

        <button
          disabled={!ready}
          className="w-full rounded-md bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-40 transition-colors"
        >
          Adapt my CV
        </button>
      </div>
    </div>
  );
}
