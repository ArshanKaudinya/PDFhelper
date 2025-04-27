"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, ChangeEvent, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { uploadPdf } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();
  const params = useSearchParams();
  const fileName = params.get("file") ?? "";

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({ mutationFn: uploadPdf });

  const onSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    mutation.mutate(file, {
      onSuccess: (d) =>
        router.push(`/doc/${d.doc_id}?file=${encodeURIComponent(file.name)}`),
      onError: () => setLoading(false),
    });
  };

  return (
    <header className="sticky top-0 border-b bg-white border-gray-200 flex items-center z-20 justify-between px-8 py-4">
      <Link href="/" className="text-xl ml-4 font-semibold text-emerald-600">
        ai<span className="font-light">planet</span>
      </Link>

      <div className="flex items-center gap-4 relative">
        {fileName && (
          <span className="text-sm text-emerald-700 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m4-4H8" />
            </svg>
            {fileName}
          </span>
        )}

        {/* Hidden file input */}
        <input
          id="fileInput"
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={onSelect}
        />

        {/* Upload button */}
        <label
          htmlFor="fileInput"
          className="cursor-pointer group border border-emerald-600 rounded-md px-4 py-1.5 text-sm relative overflow-hidden bg-emerald-600 flex items-center gap-1 text-white"
        >
          <span className="text-xl leading-none">＋</span>
          Upload PDF
        </label>
      </div>

      {/* Loading Screen */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-emerald-600 text-center text-sm">
            Loading chat...<br />
            Server response may take up to a minute!
          </p>
        </div>
      )}
    </header>
  );
}




