"use client";

import type React from "react";

import { useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Message sent:", message);
      setMessage("");
    }
  };

  return (
    <div className="rounded-lg bg-sidebar bg-stone-150 border-border border-1 p-2 max-w-xl absolute left-1/2 -translate-x-1/2 bottom-2 w-full shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-0">
        <div
          className={cn(
            "min-h-[30px] w-full rounded-md px-2 py-2 transition-all mb-0",
            isFocused ? "ring-0" : ""
          )}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask me anything..."
            className="w-full resize-none text-sm bg-transparent outline-none placeholder:text-zinc-500"
            rows={1}
            style={{
              height:
                Math.max(
                  30,
                  Math.min(120, 10 + message.split("\n").length * 20)
                ) + "px",
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button size="icon" variant="ghost" className="p-2">
              <Paperclip className="h-5 w-5" />
            </Button>

            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className={cn(
                "p-2",
                message.trim() ? "text-black" : "text-zinc-400"
              )}
              disabled={!message.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
