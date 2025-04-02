import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

import { Hash, Slash } from "lucide-react";
import { NewChatButton } from "@/components/project/new-chat-button";
import Link from "next/link";
import { Chat, Project } from "@/lib/types";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

type CustomChat = Chat & {
  project: Project;
};

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = (await supabase
    .from("chat")
    .select("id, title, created_at, project ( id, title ), message (*)")
    .eq("id", id)) as PostgrestSingleResponse<CustomChat[]>;

  if (error) {
    console.error("Error fetching chat data:", error);
    return notFound();
  }
  if (!data) {
    console.error("Chat not found");
    return notFound();
  }

  const chat = data[0];
  if (!chat) {
    console.error("Chat not found");
    return notFound();
  }

  return (
    <>
      <main className="flex-1 max-h-screen flex flex-col overflow-hidden relative">
        <div className="h-15">
          <div className="flex items-center justify-between p-4">
            <div className="pl-4">
              <div className="flex gap-2 items-center font-semibold text-sm">
                <Hash size={20} />
                <Link href={`/p/${chat.project.id}`}>{chat.project.title}</Link>
                <Slash
                  size={14}
                  strokeWidth={2.3}
                  className="-rotate-[18deg]"
                />
                <span className="text-muted-foreground">{chat.title}</span>
              </div>
            </div>
            <div className="pr-4 flex gap-2 items-center justify-end">
              <NewChatButton projectId={chat.project.id} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
