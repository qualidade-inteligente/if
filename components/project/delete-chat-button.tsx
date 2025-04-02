"use client";

import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Chat } from "@/lib/types";
import { useAppDispatch } from "@/hooks/use-redux";
import { insertChat, removeChat } from "@/lib/redux/project-slice";

export function DeleteChatButton({ chat }: { chat: Chat }) {
  const dispatch = useAppDispatch();

  async function handleDelete(event: React.MouseEvent) {
    event.stopPropagation();
    const supabase = createClient();
    const { error } = await supabase.from("chat").delete().eq("id", chat.id);
    dispatch(removeChat({ pid: chat.project_id, cid: chat.id }));
    if (error) {
      dispatch(insertChat({ id: chat.project_id, chat }));
      toast.error("Error deleting chat");
    } else {
      toast("Chat deleted successfully", {
        action: {
          label: "Undo",
          onClick: async () => {
            dispatch(insertChat({ id: chat.project_id, chat }));
            const { error: undoError } = await supabase
              .from("chat")
              .insert({ ...chat });
            if (undoError) {
              dispatch(removeChat({ pid: chat.project_id, cid: chat.id }));
              toast.error("Error restoring chat");
            } else {
              toast.success("Chat restored successfully");
            }
          },
        },
      });
    }
  }

  return (
    <Button
      onClick={handleDelete}
      variant="outline"
      size="icon"
      type="submit"
      className="bg-muted cursor-pointer absolute pointer-events-none top-1/2 -translate-y-1/2 right-12 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150"
    >
      <Trash2 size={16} />
    </Button>
  );
}
