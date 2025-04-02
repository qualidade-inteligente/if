"use client";

import { useAppSelector } from "@/hooks/use-redux";
import { ContextDialog } from "./new-context-dialog";
import { ImageIcon, FileText, Globe, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useState } from "react";
import { DeleteContextButton } from "./delete-context-button";

export type ContextDialogType = {
  key: number;
  type: "file" | "url" | "text";
  title: string;
  description: string;
  labels: {
    title: string;
    description: string;
  };
  values: {
    title: string;
    description: string;
  };
};

const typeIconMap: Record<ContextDialogType["type"], React.ReactNode> = {
  file: <ImageIcon size={16} />,
  url: <Globe size={16} />,
  text: <FileText size={16} />,
};

const contextActions: ContextDialogType[] = [
  {
    key: 0,
    type: "file",
    title: "Upload File",
    description: "Upload any file pdf images docx csv...",
    labels: {
      title: "File Title",
      description: "File",
    },
    values: {
      title: "Enter a title for the file",
      description: "Upload a file",
    },
  },
  {
    key: 1,
    type: "url",
    title: "Add an URL",
    description: "Add an URL that can be accessed by the model.",
    labels: {
      title: "URL Title",
      description: "URL",
    },
    values: {
      title: "Enter a title for the URL",
      description: "Enter the URL",
    },
  },
  {
    key: 2,
    type: "text",
    title: "Add Text",
    description: "Add any text that can be accessed by the model.",
    labels: {
      title: "Text Title",
      description: "Text",
    },
    values: {
      title: "Enter a title for the text",
      description: "Enter the text",
    },
  },
];

export function ContextTable({ projectId }: { projectId: string }) {
  const [contextDialog, setContextDialog] = useState<ContextDialogType | null>(
    null
  );
  const project = useAppSelector((state) =>
    state.project.projects.find((p) => p.id === projectId)
  );

  if (!project) {
    return null; // or handle the case when the project is not found
  }

  return (
    <>
      {contextDialog ? (
        <ContextDialog
          key={contextDialog.key}
          projectId={projectId}
          dialog={contextDialog}
          defaultOpen
        />
      ) : null}
      <div className="pl-2 pr-4 pb-12">
        <div className="w-full flex flex-col px-4 pb-2">
          <div className="border-b border-border w-full flex items-center justify-between gap-2 px-4">
            <div className="py-2 text-xs font-medium w-full">
              Context and Files
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Plus size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer text-xs"
                  onClick={() =>
                    setContextDialog({
                      ...contextActions[0],
                      key: Math.random(),
                    })
                  }
                >
                  Upload File
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-xs"
                  onClick={() =>
                    setContextDialog({
                      ...contextActions[1],
                      key: Math.random(),
                    })
                  }
                >
                  Add an URL
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-xs"
                  onClick={() =>
                    setContextDialog({
                      ...contextActions[2],
                      key: Math.random(),
                    })
                  }
                >
                  Add Text
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="w-full flex flex-col">
          {project.context.length === 0
            ? contextActions.map((contextAction, i) => (
                <ContextDialog
                  key={i}
                  projectId={projectId}
                  dialog={contextAction}
                >
                  <div
                    className="h-10 group rounded-md hover:bg-muted cursor-pointer has-[+div]:[&>div]:border-border/50 has-[+div:hover]:[&>div]:border-b-transparent px-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="h-full relative w-full flex text-muted-foreground items-center gap-2 border-b border-transparent group-hover:border-b-transparent">
                      {/* <div className="size-1.5 rounded-full bg-violet-700/80 absolute -left-4 top-1/2 -translate-y-1/2" /> */}
                      <div className="p-0 w-52 truncate text-xs text-foreground font-medium rounded-l-md">
                        {contextAction.title}
                      </div>
                      <div className="text-xs rounded-r-md text-right">
                        <span>{contextAction.description}</span>
                      </div>
                    </div>
                  </div>
                </ContextDialog>
              ))
            : null}
          {project.context
            ? project.context.map((contextItem, i) => (
                <div
                  key={i}
                  className="h-10 group rounded-md hover:bg-muted cursor-pointer has-[+div]:[&>div]:border-border/50 has-[+div:hover]:[&>div]:border-b-transparent px-8"
                  onClick={() => setContextDialog(contextActions[0])}
                >
                  <div className="h-full relative w-full flex text-muted-foreground items-center gap-2 border-b border-transparent group-hover:border-b-transparent">
                    {/* <div className="size-1.5 rounded-full bg-violet-700/80 absolute -left-4 top-1/2 -translate-y-1/2" /> */}
                    <div className="p-0 w-52 truncate flex gap-1 [&_svg]:size-4 text-xs text-foreground font-medium ">
                      {typeIconMap[contextItem.type]}
                      {contextItem.title}
                    </div>
                    <div className="text-xs flex-1 truncate">
                      <span>{contextItem.content}</span>
                    </div>
                    <DeleteContextButton context={contextItem} />
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </>
  );
}
