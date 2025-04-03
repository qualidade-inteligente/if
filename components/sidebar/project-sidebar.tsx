"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { FolderClosed, FolderOpen, Plus, Speech } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NewProjectDialog } from "./new-project-dialog";
import { useAppSelector } from "@/hooks/use-redux";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

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
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <Collapsible defaultOpen>
              <div className="relative">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="text-muted-foreground text-xs font-medium hover:text-muted-foreground">
                    Projects
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <div className="absolute right-1 top-0 bottom-0 grid place-items-center">
                  <NewProjectDialog>
                    <Button
                      variant="ghost"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs right-1  rounded-sm hover:bg-muted-foreground/10 text-muted-foreground size-6"
                      size="icon"
                    >
                      <Plus strokeWidth={2.3} />
                    </Button>
                  </NewProjectDialog>
                </div>
              </div>
              <CollapsibleContent className="space-y-1">
                {projects.projects
                  ? projects.projects.map((project) => (
                      <SidebarMenuItem key={project.id}>
                        <SidebarMenuButton
                          className={cn(
                            pathname.includes(project.id) &&
                              "bg-muted-foreground/10"
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
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
