"use client";

import { useMutation } from "@tanstack/react-query";
import { uploadPdf } from "@/lib/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ChangeEvent } from "react";

export default function Home() {
  const router = useRouter();
  const mutation = useMutation({ mutationFn: uploadPdf });

  const onSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    mutation.mutate(file, {
      onSuccess: (data) =>
        router.push(`/doc/${data.doc_id}?file=${encodeURIComponent(file.name)}`),
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <input
        id="fileInput"
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={onSelect}
      />

      <main className="flex-1 flex flex-col items-center justify-center text-center">
        <button
          onClick={() =>
            document.getElementById("fileInput")?.dispatchEvent(
              new MouseEvent("click")
            )
          }
          className="border-2 border-dashed border-emerald-400 rounded-lg p-12 hover:bg-emerald-50 transition"
        >
          <span className="text-4xl block mb-2">＋</span>
          <span className="text-lg text-emerald-700">Upload a PDF</span>
          <p className="text-sm text-gray-500 mt-2">
            Max 10 MB &nbsp;•&nbsp; Answers stay on your machine
          </p>
        </button>
      </main>
    </div>
  );
}
