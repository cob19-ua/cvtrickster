"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  initialValue: string;
  onChange: (value: string) => void;
}

export function AdaptedCVEditor({ initialValue, onChange }: Props) {
  const [markdown, setMarkdown] = useState(initialValue);
  const [mode, setMode] = useState<"preview" | "edit">("preview");

  function handleChange(value: string) {
    setMarkdown(value);
    onChange(value);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Adapted CV</h2>
        <div className="flex rounded-md border border-gray-200 overflow-hidden text-sm">
          <button
            onClick={() => setMode("preview")}
            className={`px-3 py-1.5 transition-colors ${
              mode === "preview" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setMode("edit")}
            className={`px-3 py-1.5 transition-colors ${
              mode === "edit" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Edit
          </button>
        </div>
      </div>

      {mode === "preview" ? (
        <div className="prose prose-sm max-w-none rounded-lg border border-gray-200 bg-white p-6 min-h-64">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={markdown}
          onChange={(e) => handleChange(e.target.value)}
          rows={30}
          spellCheck
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 font-mono text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-y"
        />
      )}
    </div>
  );
}
