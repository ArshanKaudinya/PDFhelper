import axios from "axios";

const base =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

  export const api = axios.create({ baseURL: base });

export async function uploadPdf(file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post("/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data as { doc_id: string };
}

export async function ask(docId: string, question: string) {
  const { data } = await api.post("/ask", {
    doc_id: docId,
    question,
  });
  return data as { answer: string };
}
