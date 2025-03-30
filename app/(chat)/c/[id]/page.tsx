import { ChatInput } from "@/components/chat/chat-input";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="flex-1 p-4">
      <h1>Selected chat: {id}</h1>
      <ChatInput />
    </main>
  );
}
