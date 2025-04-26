import axios from "axios";

const base = "http://127.0.0.1:8000";

export const api = axios.create({ baseURL: base });

export async function uploadPdf(file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post("/upload", form);
  return data as { doc_id: string };
}

export async function ask(docId: string, question: string) {
  const { data } = await api.post("/ask", {
    doc_id: docId,
    question,
  });
  return data as { answer: string };
}
