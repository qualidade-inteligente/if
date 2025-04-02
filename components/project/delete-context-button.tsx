"use client";

import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Context } from "@/lib/types";
import { useAppDispatch } from "@/hooks/use-redux";
import { insertContext, removeContext } from "@/lib/redux/project-slice";

export function DeleteContextButton({ context }: { context: Context }) {
  const dispatch = useAppDispatch();

  async function handleDelete(event: React.MouseEvent) {
    event.stopPropagation();
    const supabase = createClient();

    const { error } = await supabase
      .from("context")
      .delete()
      .eq("id", context.id);
    dispatch(removeContext({ pid: context.project_id, cid: context.id }));
    if (error) {
      dispatch(insertContext({ pid: context.project_id, context }));
      toast.error("Error deleting context");
    } else {
      toast("Context deleted successfully", {
        action: {
          label: "Undo",
          onClick: async () => {
            dispatch(insertContext({ pid: context.project_id, context }));
            const { error: undoError } = await supabase
              .from("context")
              .insert({ ...context });
            if (undoError) {
              dispatch(
                removeContext({ pid: context.project_id, cid: context.id })
              );
              toast.error("Error restoring context");
            } else {
              toast.success("Context restored successfully");
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
      className="bg-muted cursor-pointer absolute pointer-events-none top-1/2 -translate-y-1/2 right-0 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto"
    >
      <Trash2 size={16} />
    </Button>
  );
}
