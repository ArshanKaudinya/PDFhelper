"use client";

import Navbar from "@/components/Navbar";
import { ask } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "bot"; text: string };

const prompts = [
  "for a summary!",
  "a doubt?",
  "for key points.",
  "to explain this?",
  "about a topic!",
  "for quick notes!",
];

function StarterPrompt() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentPrompt = prompts[index];
    let timeout: NodeJS.Timeout;

    if (!deleting) {
      if (displayed.length < currentPrompt.length) {
        timeout = setTimeout(() => {
          setDisplayed(currentPrompt.slice(0, displayed.length + 1));
        }, 90);
      } else {
        timeout = setTimeout(() => {
          setDeleting(true);
        }, 1500);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(currentPrompt.slice(0, displayed.length - 1));
        }, 60);
      } else {
        setDeleting(false);
        setIndex((prev) => (prev + 1) % prompts.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, index]);

  return (
    <div className="text-slate-600 text-2xl text-center mb-[20%] select-none animate-fade">
      Ask {displayed}
      <span className="animate-pulse">|</span>
    </div>
  );
}

export default function Chat() {
  const { id } = useParams<{ id: string }>();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const askMut = useMutation({
    mutationFn: (q: string) => ask(id, q),
    onSuccess: ({ answer }) => streamAnswer(answer),
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const streamAnswer = (full: string) => {
    setMsgs(m => [...m, { role: "bot", text: "" }]);
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
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-800">
      <Navbar />

      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 relative"
      >
        {/* StarterPrompt with smooth fade-out */}
        <div
          className={`flex flex-1 items-center justify-center absolute inset-0 transition-opacity duration-500 ${
            msgs.length === 0 ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <StarterPrompt />
        </div>

        {/* Chat Messages */}
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
                    : "bg-zinc-200 rounded-bl-none"
                }`}
              >
                {searchText ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: m.text.replace(
                        new RegExp(`(${searchText})`, "gi"),
                        '<mark class="bg-yellow-200">$1</mark>'
                      ),
                    }}
                  />
                ) : (
                  m.text
                )}
              </div>
            </div>
          ))}

          {/* Typing dots */}
          {askMut.isPending && (
            <div className="flex w-full max-w-2xl justify-start">
              <div className="px-4 py-2 rounded-2xl bg-zinc-200 text-sm text-slate-700 animate-pulse">
                <span className="dot1">.</span><span className="dot2">.</span><span className="dot3">.</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* Search bar */}
      {showSearch && (
        <div className="flex justify-center mb-2">
          <input
            type="text"
            placeholder="Search chat..."
            className="border border-zinc-400 rounded-full px-4 py-1 w-64 text-sm focus:ring-2 focus:ring-emerald-300 bg-zinc-50"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      )}

      <footer className="sticky bottom-0 w-full bg-white border border-zinc-400 px-4 py-3">
        <div className="flex gap-2 max-w-3xl mx-auto items-center">
          {/* Search button */}
          <button
            onClick={() => setShowSearch(prev => !prev)}
            className="p-2 rounded-full bg-emerald-100 hover:bg-emerald-200 transition text-emerald-700 text-sm"
          >
            🔍
          </button>

          {/* Typing Input */}
          <input
            ref={inputRef}
            placeholder="Type a message…"
            className="flex-1 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300 bg-zinc-50 border border-zinc-400"
            onKeyDown={e => e.key === "Enter" && send()}
          />

          {/* Send button */}
          <button
            onClick={send}
            disabled={askMut.isPending}
            className="shrink-0 px-4 py-2 rounded-full bg-emerald-600 text-white text-sm disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}

