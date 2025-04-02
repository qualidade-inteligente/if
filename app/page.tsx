import { EmptyChat } from "@/components/chat/empty-chat";

export default async function HomePage() {
  return (
    <main className="flex-1 p-4 relative">
      <EmptyChat />
    </main>
  );
}
