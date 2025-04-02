"use client";

import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { insertProject, removeProject } from "@/lib/redux/project-slice";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const project = useAppSelector((state) =>
    state.project.projects.find((p) => p.id === projectId)
  );
  const dispatch = useAppDispatch();

  async function handleDelete(event: React.MouseEvent) {
    event.stopPropagation();
    const supabase = createClient();
    dispatch(removeProject(projectId));
    const { error } = await supabase
      .from("project")
      .delete()
      .eq("id", projectId);
    if (error && project) {
      dispatch(insertProject({ ...project }));
      toast.error("Error deleting project");
    } else {
      router.replace("/");
      toast.success("Project deleted successfully");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 size={16} />
          Delete project
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            project and the chats within it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
