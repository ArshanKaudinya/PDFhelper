"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const params = useSearchParams();
  const fileName = params.get("file") ?? "";

  const triggerUpload = () => {
    document.getElementById("fileInput")?.click();
  };

  return (
    <header className="h-15 sticky top-0 border-b bg-white border-gray-200 flex items-center px-8 justify-between">
      <Link href="/" className="text-xl font-semibold text-emerald-600">
        ai<span className="font-light">planet</span>
      </Link>

      <div className="flex items-center gap-4">
        {fileName && (
          <span className="text-sm text-emerald-700 flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v8m4-4H8"
              />
            </svg>
            {fileName}
          </span>
        )}

        <button
          onClick={triggerUpload}
          className="border rounded-md px-4 py-1.5 text-sm flex items-center gap-1 hover:bg-emerald-50"
        >
          <span className="text-xl leading-none">＋</span>
          Upload PDF
        </button>
      </div>
    </header>
  );
}
