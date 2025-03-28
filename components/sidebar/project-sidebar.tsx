"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  PlusCircle,
  FolderClosed,
  FolderOpen,
  Speech,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Project } from "@/lib/types";
import { ContextDialog } from "./context-dialog";

export function ProjectSidebar({
  projectsPromise,
}: {
  projectsPromise: Promise<Project[]>;
}) {
  const projects = React.use(projectsPromise);

  const pathname = usePathname();

  const [openProjects, setOpenProjects] = React.useState<
    Record<string, boolean>
  >({});

  function toggleProject(projectId: string) {
    setOpenProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="px-2 py-1 text-xl font-semibold flex gap-2 items-center justify-start">
          <Speech size={24} />
        </h2>
      </SidebarHeader>
      <SidebarContent className="gap-0 ">
        {projects &&
          projects.map((project) => (
            <Collapsible
              key={project.id}
              open={openProjects[project.id]}
              onOpenChange={() => toggleProject(project.id)}
              className="group/collapsible"
            >
              <SidebarGroup className="py-0.5">
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {openProjects[project.id] ? (
                        <FolderOpen size={16} />
                      ) : (
                        <FolderClosed size={16} />
                      )}
                      <span>{project.name}</span>
                    </div>
                    <ChevronDown className=" transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu className="gap-0">
                      {/* Default subitems for each project */}
                      <ContextDialog project={project} />

                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href={`/projects/${project.id}/new-chat`}>
                            <PlusCircle size={16} />
                            <span className="text-xs">New Chat</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {/* Project chats */}
                      {project.chats.length > 0 && (
                        <SidebarMenuSub>
                          {project.chats.map((chat) => (
                            <SidebarMenuSubItem key={chat.id}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === `/chat/${chat.id}`}
                              >
                                <Link href={`/chat/${chat.id}`}>
                                  <span className="text-xs">{chat.name}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/projects/new">
                <PlusCircle size={16} />
                <span className="text-xs">New Project</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
