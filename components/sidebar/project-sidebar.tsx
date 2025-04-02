"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { FolderClosed, FolderOpen, Speech } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NewProjectDialog } from "./new-project-dialog";
import { useAppSelector } from "@/hooks/use-redux";
import { cn } from "@/lib/utils";

export function ProjectSidebar() {
  const projects = useAppSelector((state) => state.project);

  const router = useRouter();
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="px-2 py-1 text-xl font-semibold flex gap-2 items-center justify-start">
          <Speech size={24} />
        </h2>
      </SidebarHeader>
      <SidebarContent className="gap-0 ">
        <SidebarGroup>
          <SidebarGroupLabel>Your Projects</SidebarGroupLabel>

          <SidebarMenu>
            {projects.projects
              ? projects.projects.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton
                      className={cn(
                        pathname.includes(project.id) && "bg-muted"
                      )}
                      onClick={() => router.push(`/p/${project.id}`)}
                    >
                      {pathname.includes(project.id) ? (
                        <FolderOpen size={16} />
                      ) : (
                        <FolderClosed size={16} />
                      )}
                      <span className="font-medium text-xs">
                        {project.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              : null}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <NewProjectDialog />
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
