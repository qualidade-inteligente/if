"use client";

import { Project } from "@/lib/types";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Hash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export function ContextDialog({ project }: { project: Project }) {
  return (
    <Dialog>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <DialogTrigger>
            <Hash size={16} />
            <span className="text-xs">Context and Files</span>
          </DialogTrigger>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage {project.title} context and files</DialogTitle>
          <p>{project.title}</p>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
