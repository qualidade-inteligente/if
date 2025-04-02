"use client";

import { SquarePen } from "lucide-react";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";
import { useAppDispatch } from "@/hooks/use-redux";
import { insertChat } from "@/lib/redux/project-slice";

export function NewChatButton({ projectId }: { projectId: string }) {
  const supabase = createClient();
  const dispatch = useAppDispatch();

  async function createChat(project_id: string) {
    const uuid = crypto.randomUUID();
    // create chat locally and in supabase
    const newChat = {
      id: uuid,
      title: "New chat",
      project_id,
      created_at: new Date().toISOString(),
    };

    dispatch(insertChat({ id: project_id, chat: newChat }));
    await supabase
      .from("chat")
      .insert([newChat])
      .then(({ data, error }) => {
        if (error) {
          console.error("[ERROR CHAT]:", error);
          return error;
        }
        console.log("[CHAT]:", data);
        return null;
      });
  }

  return (
    <Button variant="ghost" size="icon" onClick={() => createChat(projectId)}>
      <SquarePen size={16} />
    </Button>
  );
}
