"use client";

import { DeleteChatButton } from "./delete-chat-button";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { useRouter } from "next/navigation";
import { NewChatButton } from "./new-chat-button";
import { insertChat } from "@/lib/redux/project-slice";
import { createClient } from "@/lib/supabase/client";

export function ChatTable({ projectId }: { projectId: string }) {
  const dispatch = useAppDispatch();
  const supabase = createClient();
  const router = useRouter();

  const project = useAppSelector((state) =>
    state.project.projects.find((p) => p.id === projectId)
  );

  if (!project) {
    return null; // or handle the case when the project is not found
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

    dispatch(insertChat({ id: project_id, chat: newChat }));
    await supabase
      .from("chat")
      .insert([newChat])
      .then(({ data, error }) => {
        if (error) {
          console.error("[ERROR CHAT]:", error);
          return error;
        }
        console.log("[CHAT]:", data);
        return null;
      });
  }

  return (
    <div className="flex-1 h-[calc(100vh-60px)] overflow-y-auto pb-20 pl-2 pr-4">
      <div className="w-full flex flex-col px-4 pb-2">
        <div className="border-b border-border w-full flex items-center justify-between gap-2 px-4">
          <div className="py-2 text-xs font-medium w-full">Chats</div>
          <NewChatButton projectId={project.id} />
        </div>
      </div>
      <div className="w-full flex flex-col">
        {project.chat && project.chat.length === 0 ? (
          <div
            onClick={() => createChat(project.id)}
            className="h-10 group relative rounded-md hover:bg-muted cursor-pointer px-8"
          >
            <div className="h-full w-full flex text-foreground font-medium items-center text-xs">
              Start a new chat
            </div>
          </div>
        ) : null}
        {project.chat
          ? project.chat.map((chat) => (
              <div
                key={chat.id}
                className="h-10 group rounded-md hover:bg-muted cursor-pointer has-[+div]:[&>div]:border-border/50 has-[+div:hover]:[&>div]:border-b-transparent px-8"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/c/${chat.id}`);
                }}
              >
                <div className="h-full relative w-full flex text-muted-foreground items-center gap-2 border-b border-transparent group-hover:border-b-transparent">
                  {/* <div className="size-1.5 rounded-full bg-violet-700/80 absolute -left-4 top-1/2 -translate-y-1/2" /> */}
                  <div className="p-0 w-full truncate flex gap-1 [&_svg]:size-4 text-xs text-foreground font-medium ">
                    {chat.title}
                  </div>
                  <div className="relative text-xs text-right">
                    <span className="group-hover:opacity-0">
                      {formatDate(chat.created_at)}
                    </span>
                    <DeleteChatButton chat={chat} />
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

function formatDate(input: string | Date): string {
  // Convert input to Date object if necessary
  const date = typeof input === "string" ? new Date(input) : input;

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  const now = new Date();

  // Check if the given date is today
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) {
    // Format time with leading zeros (HH:MM)
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } else {
    // Format date in American format (MM/DD/YYYY) with leading zeros for month and day
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
}
