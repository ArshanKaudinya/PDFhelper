"use client";

import { useMutation } from "@tanstack/react-query";
import { uploadPdf } from "@/lib/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ChangeEvent, useState } from "react";

export default function Home() {
  const router = useRouter();
  const mutation = useMutation({ mutationFn: uploadPdf });
  const [loading, setLoading] = useState(false);

  const onSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true); // start loading screen
    mutation.mutate(file, {
      onSuccess: d =>
        router.push(`/doc/${d.doc_id}?file=${encodeURIComponent(file.name)}`),
      onError: () => setLoading(false), // handle possible upload errors
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <Navbar />

      {/* hidden browser picker */}
      <input
        id="fileInput"
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={onSelect}
      />

      <main className="flex-1 flex flex-col items-center justify-center text-center space-y-8 px-4">
        {/* tagline */}
        <h1 className="text-3xl font-semibold text-zinc-700">
          Ask questions&nbsp;about any&nbsp;PDF&nbsp;in&nbsp;seconds
        </h1>

        {/* ── upload zone ── */}
        <button
          onClick={() =>
            document.getElementById("fileInput")?.dispatchEvent(
              new MouseEvent("click")
            )
          }
          className="border-2 border-dashed border-emerald-400 rounded-lg p-12 w-full max-w-md hover:bg-emerald-50 transition flex flex-col items-center gap-4"
        >
          {/* ▲ NEW icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M16 12l-4-4m0 0-4 4m4-4v12" />
          </svg>

          {/* label */}
          <span className="text-lg text-emerald-700 select-none">
            Upload - Drag & Drop / Browse
          </span>
        </button>

        {/* ── info list ── */}
        <ul className="text-sm text-zinc-600 space-y-1 max-w-md mx-auto list-disc pl-5 text-left">
          <li>Max file size&nbsp;<strong>10&nbsp;MB</strong></li>
          <li>All embeddings stay <strong>on your device</strong></li>
          <li>Powered by local embeddings + remote Mixtral answers</li>
          <li>No account required – just drop a PDF and start chatting</li>
        </ul>
        <div className="relative mt-0 flex justify-center w-full">
          <button
            className="group w-8 h-8 border border-emerald-500 text-emerald-500 bg-white text-md font-semibold flex items-center justify-center rounded-full select-none"
            aria-label="App credits"
          >
            i
            {/* tooltip */}
            <span className="absolute top-full mt-2 bg-white text-emerald-700 border border-emerald-400 text-xs px-4 py-2 rounded shadow-sm opacity-0 group-hover:opacity-100 transition pointer-events-none max-w-xs text-center">
              Made by Arshan Kaudinya during 25–29 April.<br />For AI Planet full-stack intern assignment
            </span>
          </button>
        </div>
      </main>
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-emerald-600 text-center text-sm">
            Loading chat...<br />
            Server response may take up to a minute!
          </p>
        </div>
      )}
    </div>
  );
}

