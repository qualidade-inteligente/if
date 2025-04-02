"use client";

import { DeleteChatButton } from "./delete-chat-button";
import { useAppSelector } from "@/hooks/use-redux";
import { useRouter } from "next/navigation";

export function ChatTable({ projectId }: { projectId: string }) {
  const router = useRouter();

  const project = useAppSelector((state) =>
    state.project.projects.find((p) => p.id === projectId)
  );

  if (!project) {
    return null; // or handle the case when the project is not found
  }
  return (
    <div className="w-full flex flex-col">
      {project.chat.map((chat) => (
        <div
          key={chat.id}
          className="h-10 group relative rounded-md hover:bg-muted cursor-pointer has-[+div:hover]:[&>div]:border-b-transparent px-8"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/c/${chat.id}`);
          }}
        >
          <div className="h-full w-full flex text-muted-foreground items-center gap-2 border-b border-border/50 group-hover:border-b-transparent">
            <div className="p-0 text-xs font-medium w-full rounded-l-md">
              {chat.title}
            </div>
            <div className="relative text-xs rounded-r-md  text-right">
              <span className="group-hover:opacity-0">
                {formatDate(chat.created_at)}
              </span>
              <DeleteChatButton chat={chat} />
            </div>
          </div>
        </div>
      ))}
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
