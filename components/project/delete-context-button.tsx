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
    event.preventDefault();
    const supabase = createClient();

    dispatch(removeContext({ pid: context.project_id, cid: context.id }));
    const { error } = await supabase
      .from("context")
      .delete()
      .eq("id", context.id);

    if (error) {
      // If there is an error, insert the context back into the store
      dispatch(insertContext({ pid: context.project_id, context }));
      toast.error("Error deleting context");
    } else {
      // Delete the file from storage if it is a file type
      if (context.type === "file") {
        const { error: deleteError } = await supabase.storage
          .from("context")
          .remove([context.content]);
        if (deleteError) {
          dispatch(insertContext({ pid: context.project_id, context }));
          toast.error("Error deleting file");
        }
      }
      toast.success("Context deleted successfully");
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
