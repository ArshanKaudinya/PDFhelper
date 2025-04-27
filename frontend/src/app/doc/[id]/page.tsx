"use client";

import Navbar from "@/components/Navbar";
import { ask } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "bot"; text: string };

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const inputRef  = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [showTop,    setShowTop]    = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  /* ───────── API call ───────── */
  const askMut = useMutation({
    mutationFn: (q: string) => ask(id, q),
    onSuccess: ({ answer }) => streamAnswer(answer),
  });

  /* stream the answer word-by-word */
  const streamAnswer = (full: string) => {
    setMsgs(m => [...m, { role: "bot", text: "" }]);     // placeholder
    let i = 0;
  
    const type = () => {
      setMsgs(m => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "bot", text: full.slice(0, i) };
        return copy;
      });
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  
      i++;
      if (i <= full.length) setTimeout(type, 13);        
    };
  
    type();
  };


  const send = () => {
    const q = inputRef.current?.value.trim();
    if (!q) return;
    setMsgs(m => [...m, { role: "user", text: q }]);
    inputRef.current!.value = "";
    askMut.mutate(q);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-800">
      <Navbar />

      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 relative"
      >
        <div className="flex flex-col items-center space-y-4">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`flex w-full max-w-2xl ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl text-sm break-words max-w-xs md:max-w-md ${
                  m.role === "user"
                    ? "bg-emerald-200 rounded-br-none"
                    : "bg-zinc-200  rounded-bl-none"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {askMut.isPending && (
            <div className="flex w-full max-w-2xl justify-start">
              <div className="w-6 h-6 border-[3px] border-emerald-300 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      <footer className="sticky bottom-0 w-full bg-white border border-zinc-400 px-4 py-3">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input
            ref={inputRef}
            placeholder="Type a message…"
            className="flex-1 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300 bg-zinc-50 border border-zinc-400"
            onKeyDown={e => e.key === "Enter" && send()}
          />
          <button
            onClick={send}
            disabled={askMut.isPending}
            className="shrink-0 px-4 py-2 rounded-full bg-emerald-500 text-white text-sm disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}
