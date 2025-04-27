import axios from "axios";

const base = process.env.NEXT_PUBLIC_API_BASE; //for prod process.env.NEXT_PUBLIC_API_BASE, for local http://127.0.0.1:8000

export async function uploadPdf(file: File) {
  const URL = `${base}/upload`;
  const form = new FormData();
  form.append("file", file);

  console.log("[uploadPdf] Uploading to:", URL);

  const res = await fetch(URL, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    console.error("[uploadPdf] Error:", res.statusText);
    throw new Error("Upload failed");
  }

  const data = await res.json();
  console.log("[uploadPdf] Success:", data);
  return data as { doc_id: string };
}


export async function ask(docId: string, question: string) {
  const URL = `${base}/ask`;

  console.log("[ask] Asking:", URL, { docId, question });

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ doc_id: docId, question }),
  });

  if (!res.ok) {
    console.error("[ask] Error:", res.statusText);
    throw new Error("Question failed");
  }

  const data = await res.json();
  console.log("[ask] Success:", data);
  return data as { answer: string };
}
