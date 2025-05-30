"use client";

import { useMutation } from "@tanstack/react-query";
import { uploadPdf } from "@/lib/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ChangeEvent, useState, Suspense } from "react";

export default function Home() {
  const router = useRouter();
  const mutation = useMutation({ mutationFn: uploadPdf });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);



  const onSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(false);
    mutation.mutate(file, {
      onSuccess: (d) => router.push(`/doc/${d.doc_id}?file=${encodeURIComponent(file.name)}`),
      onError: () => {
        setLoading(false);
        setError(true);
        setTimeout(() => setError(false), 3000);  
      },
    });
  };
  

  return (
    <div className="min-h-screen relative flex flex-col bg-white">
      <Suspense>
        <Navbar />
      </Suspense>
      

      <input
        id="fileInput"
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={onSelect}
      />

      <main className="flex-1 flex flex-col items-center justify-center text-center space-y-8 px-4">
        <h1 className="text-3xl font-semibold text-zinc-700">
          Ask questions&nbsp;about any&nbsp;PDF&nbsp;in&nbsp;seconds
        </h1>

        <button
          onClick={() =>
            document.getElementById("fileInput")?.dispatchEvent(new MouseEvent("click"))
          }
          className="border-2 border-dashed border-emerald-400 rounded-lg p-12 w-full max-w-md hover:bg-emerald-50 transition flex flex-col items-center gap-4"
        >
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
          <span className="text-lg text-emerald-700 select-none">
            Upload – Drag & Drop / Browse
          </span>
        </button>

        <ul className="text-sm text-zinc-600 space-y-1 max-w-md mx-auto list-disc pl-5 text-left">
          <li>Max file size&nbsp;<strong>10&nbsp;MB</strong></li>
          <li>Unlimited document queries powered by <strong>Mixtral AI</strong></li>
          <li>Seamless real-time interaction without page reloads</li>
          <li><strong>No account required</strong> – just drop a PDF and start chatting</li>
        </ul>

        <div className="relative mt-0 flex justify-center w-full">
          <div className="relative">
            <button
              className="w-8 h-8 border border-emerald-500 text-emerald-500 bg-white text-md font-semibold flex items-center justify-center rounded-full select-none"
              aria-label="App credits"
              onClick={() => setShow(prev => !prev)}
              onMouseEnter={() => setShow(true)}
              onMouseLeave={() => setShow(false)}
            >
              i
            </button>

            <span
              className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white text-emerald-700 border border-emerald-400 text-xs px-3 py-2 rounded shadow-sm w-[220px] text-center transition-opacity ${
                show ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              Made by Arshan Kaudinya <br />
              For AI Planet Internship
            </span>

          </div>
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
      {error && (
        <div className="absolute bottom-4 bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded shadow-md text-sm">
          An error occurred. Please try again.<br />Contact admin if the issue persists.
        </div>
      )}

    </div>
  );
}


