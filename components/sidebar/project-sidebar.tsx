"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
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
  // SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar";
// import { ContextDialog } from "./context-dialog";
import { NewProjectDialog } from "./new-project-dialog";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Chat } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { insertChat } from "@/lib/redux/project-slice";

export function ProjectSidebar(
  {
    // projectsPromise,
    // }:{
    // projectsPromise: Promise<Project[]>;
  }
) {
  const dispatch = useAppDispatch();
  const supabase = createClient();

  const projects = useAppSelector((state) => state.project);
  // const serverProjects = React.use(projectsPromise);

  const router = useRouter();
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

  async function createChat(project_id: string) {
    const uuid = crypto.randomUUID();
    // create chat locally and in supabase
    const newChat = {
      id: uuid,
      title: "New chat",
      project_id,
      created_at: new Date().toISOString(),
    };

    router.replace(`/c/${uuid}`);

    await supabase
      .from("chat")
      .insert([newChat])
      .then(({ data, error }) => {
        dispatch(insertChat({ id: project_id, chat: newChat }));
        if (error) {
          console.error("[ERROR CHAT]:", error);
          return error;
        }
        console.log("[CHAT]:", data);
        return null;
      });
  }

  // React.useEffect(() => {
  //   dispatch(initializeProjects(serverProjects));
  // }, [serverProjects, dispatch]);

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="px-2 py-1 text-xl font-semibold flex gap-2 items-center justify-start">
          <Speech size={24} />
        </h2>
      </SidebarHeader>
      <SidebarContent className="gap-0 ">
        {projects.projects
          ? projects.projects.map((project) => (
              <Collapsible
                key={project.id}
                open={openProjects[project.id]}
                onOpenChange={() => toggleProject(project.id)}
                className="group/collapsible"
              >
                <SidebarGroup className="py-0.5">
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        {openProjects[project.id] ? (
                          <FolderOpen size={16} />
                        ) : (
                          <FolderClosed size={16} />
                        )}
                        <span>{project.title}</span>
                      </div>
                      <ChevronDown className=" transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu className="gap-0">
                        {/* Default subitems for each project */}
                        {/* <ContextDialog project={project} /> */}

                        {/* New chat button */}
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            onClick={() => createChat(project.id)}
                          >
                            <PlusCircle size={16} />
                            <span className="text-xs">New Chat</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        {/* Project chats */}
                        {project.chat ? (
                          <SidebarMenuSub className="gap-0 space-y-0">
                            {project.chat.map((chat: Chat) => (
                              <SidebarMenuItem key={chat.id}>
                                <SidebarMenuButton
                                  asChild
                                  isActive={pathname === `/c/${chat.id}`}
                                >
                                  <Link href={`/c/${chat.id}`}>
                                    {pathname === `/c/${chat.id}` ? (
                                      <div className="size-1.5 bg-black rounded-full" />
                                    ) : null}
                                    <span className="text-xs">
                                      {chat.title || "New chat"}
                                    </span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenuSub>
                        ) : null}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            ))
          : null}
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
