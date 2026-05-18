"use client";

import { useRef, useState } from "react";

interface Props {
  onParsed: (text: string) => void;
}

export function CVUpload({ onParsed }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setStatus("loading");
    setError(null);
    setFileName(file.name);

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/parse-cv", { method: "POST", body: form });
    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setError(data.error ?? "Failed to parse CV");
      return;
    }

    setStatus("done");
    onParsed(data.text);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Your CV</label>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white px-6 py-10 text-center hover:border-gray-400 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={handleChange}
        />
        {status === "idle" && (
          <>
            <p className="text-sm text-gray-600">Drop your CV here or click to browse</p>
            <p className="mt-1 text-xs text-gray-400">PDF or DOCX · Max 5MB</p>
          </>
        )}
        {status === "loading" && <p className="text-sm text-gray-500">Parsing {fileName}…</p>}
        {status === "done" && (
          <p className="text-sm text-green-600 font-medium">✓ {fileName} parsed</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}
