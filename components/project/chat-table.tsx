"use client";

import { TableBody, TableRow, TableCell } from "../ui/table";
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
    <TableBody>
      {project.chat.map((chat) => (
        <TableRow
          key={chat.id}
          className="group relative "
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/c/${chat.id}`);
          }}
        >
          <TableCell className="p-0 pl-8 text-xs font-medium w-full rounded-l-md group-hover:bg-muted">
            {chat.title}
          </TableCell>
          <TableCell className="relative text-xs rounded-r-md group-hover:bg-muted text-right pr-12">
            <span className="group-hover:opacity-0 transition-opacity duration-150">
              {formatDate(chat.created_at)}
            </span>
            <DeleteChatButton chat={chat} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
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
