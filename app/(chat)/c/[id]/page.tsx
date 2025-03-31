"use client";

import { ChatInput } from "@/components/chat/chat-input";

export default function ChatPage({}) {
  return (
    <main className="flex-1 p-4">
      <h1>Selected chat</h1>
      <ChatInput />
    </main>
  );
}
