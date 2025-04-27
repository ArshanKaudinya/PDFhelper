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
  const inputRef   = useRef<HTMLInputElement>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);

  const [showTop,    setShowTop]    = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  /* ------------- API call ------------- */
  const askMut = useMutation({
    mutationFn: (q: string) => ask(id, q),
    onSuccess: (data) =>
      setMsgs(m => [...m, { role: "bot", text: data.answer }]),
  });

  const send = () => {
    const q = inputRef.current?.value.trim();
    if (!q) return;
    setMsgs(m => [...m, { role: "user", text: q }]);
    inputRef.current!.value = "";
    askMut.mutate(q);
  };

  /* ------------- scroll helpers ------------- */
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setShowTop(scrollTop > 120);
    setShowBottom(scrollTop + clientHeight < scrollHeight - 120);
  };

  const toTop    = () => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  const toBottom = () => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });

  /* ------------- effects ------------- */
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);
  useEffect(() => handleScroll(), []);                // trigger once after mount

  /* ------------- UI ------------- */
  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-800">
      <Navbar />

      <main
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-6 relative"
      >
        <div className="flex flex-col items-center space-y-4">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`flex w-full max-w-2xl ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl shadow text-sm break-words max-w-xs md:max-w-md ${
                  m.role === "user"
                    ? "bg-emerald-200 text-right rounded-br-none"
                    : "bg-zinc-200  text-left  rounded-bl-none"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {askMut.isPending && (
            <div className="flex w-full max-w-2xl justify-start">
              <div className="w-8 h-8 border-4 border-emerald-300 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* ↑ ↓ floating buttons */}
        {showTop && (
          <button
            onClick={toTop}
            className="fixed right-4 bottom-28 z-50 p-2 bg-emerald-500 text-white rounded-full shadow hover:bg-emerald-600 transition"
          >
            ↑
          </button>
        )}
        {showBottom && (
          <button
            onClick={toBottom}
            className="fixed right-4 bottom-16 z-50 p-2 bg-emerald-500 text-white rounded-full shadow hover:bg-emerald-600 transition"
          >
            ↓
          </button>
        )}
      </main>

      <footer className="sticky bottom-0 w-full bg-white border-t px-4 py-3">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input
            ref={inputRef}
            placeholder="Type a message…"
            className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300 bg-zinc-50"
            onKeyDown={e => e.key === "Enter" && send()}
          />
          <button
            onClick={send}
            disabled={askMut.isPending}
            className="shrink-0 px-4 py-2 rounded-full border bg-emerald-500 text-white text-sm disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}
