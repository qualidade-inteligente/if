import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

import { Hash } from "lucide-react";
import { ChatTable } from "@/components/project/chat-table";
import { NewChatButton } from "@/components/project/new-chat-button";
import { DeleteProjectButton } from "@/components/project/delete-project-button";
import { ProjectDialog } from "@/components/project/project-dialog";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project")
    .select("id, title")
    .eq("id", id);

  if (error) {
    console.error("Error fetching project data:", error);
    return notFound();
  }
  if (!data) {
    console.error("Project not found");
    return notFound();
  }

  const project = data[0];
  if (!project) {
    console.error("Project not found");
    return notFound();
  }

  return (
    <>
      <main className="flex-1 max-h-screen flex flex-col overflow-hidden relative">
        <div className="h-15">
          <div className="flex items-center justify-between p-4">
            <div className="pl-4">
              <div className="flex gap-2 items-center font-semibold">
                <Hash size={20} />
                {project.title}
              </div>
            </div>
            <div className="pr-4 flex gap-2 items-center justify-end">
              <NewChatButton projectId={project.id} />
              <ProjectDialog projectId={project.id} />
              <DeleteProjectButton projectId={project.id} />
            </div>
          </div>
        </div>
        <div className="flex-1 h-[calc(100vh-60px)] overflow-y-auto pb-20 pl-2 pr-4">
          <div className="w-full flex flex-col px-4 pb-2">
            <div className="border-b border-border w-full flex items-center gap-2">
              <div className="py-2 px-4 text-xs font-medium w-full">
                Your Chats
              </div>
            </div>
          </div>
          <ChatTable projectId={project.id} />
        </div>
      </main>
    </>
  );
}
