"use client";

import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useAppSelector } from "@/hooks/use-redux";

export function ProjectDialog({ projectId }: { projectId: string }) {
  const project = useAppSelector((state) =>
    state.project.projects.find((p) => p.id === projectId)
  );

  if (!project) return null;

  return (
    <Dialog>
      <Button size="sm" variant="outline" asChild>
        <DialogTrigger>
          <Sparkles size={16} />
          <span className="text-xs">Edit context</span>
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage {project.title} context and files</DialogTitle>
          <p>{project.title}</p>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
