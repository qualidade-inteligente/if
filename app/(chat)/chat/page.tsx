import { ChatInput } from "@/components/chat/chat-input";

export default async function ChatPage() {
  return (
    <main className="flex-1 p-4 relative">
      <h1>No chat selected</h1>
      <ChatInput />
    </main>
  );
}
