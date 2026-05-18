"use client";

import { useState } from "react";

interface Props {
  onResolved: (text: string) => void;
}

export function JobOfferInput({ onResolved }: Props) {
  const [url, setUrl] = useState("");
  const [manualText, setManualText] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleScrape() {
    if (!url.trim()) return;
    setStatus("loading");
    setError(null);

    const res = await fetch("/api/scrape-job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setError(data.error ?? "Failed to scrape job offer");
      setShowManual(true);
      return;
    }

    setStatus("done");
    onResolved(data.text);
  }

  function handleManualSubmit() {
    if (!manualText.trim()) return;
    setStatus("done");
    setError(null);
    onResolved(manualText.trim());
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Job offer URL</label>
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/jobs/123"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <button
          onClick={handleScrape}
          disabled={status === "loading" || !url.trim()}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {status === "loading" ? "Fetching…" : "Fetch"}
        </button>
      </div>

      {status === "done" && !showManual && (
        <p className="text-sm text-green-600 font-medium">✓ Job offer loaded</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {showManual && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Paste job description manually
          </label>
          <textarea
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            rows={8}
            placeholder="Paste the full job description here…"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button
            onClick={handleManualSubmit}
            disabled={!manualText.trim()}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            Use this description
          </button>
        </div>
      )}
    </div>
  );
}
