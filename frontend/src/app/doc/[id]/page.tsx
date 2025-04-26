"use client";

import { ask } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import Navbar from "@/components/Navbar";

type Msg = { role: "user" | "bot"; text: string };

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const askMut = useMutation({
    mutationFn: (q: string) => ask(id, q),
    onSuccess: (data) =>
      setMsgs((m) => [...m, { role: "bot", text: data.answer }]),
  });

  const send = () => {
    const q = inputRef.current?.value.trim();
    if (!q) return;
    setMsgs((m) => [...m, { role: "user", text: q }]);
    inputRef.current!.value = "";
    askMut.mutate(q);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {msgs.map((m, i) => (
          <p
            key={i}
            className={`max-w-xl ${
              m.role === "user"
                ? "self-end bg-emerald-50"
                : "self-start bg-gray-100"
            } rounded-xl px-4 py-2 text-sm`}
          >
            {m.text}
          </p>
        ))}
      </main>

      <footer className="border-t px-6 py-3">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            placeholder="Send a message…"
            className="flex-1 border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button
            onClick={send}
            disabled={askMut.isPending}
            className="px-3 py-2 border rounded-md text-sm hover:bg-emerald-50 disabled:opacity-50"
          >
            ➤
          </button>
        </div>
      </footer>
    </div>
  );
}
