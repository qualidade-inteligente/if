import { Context } from "@/lib/types";
import { DeleteContextButton } from "./delete-context-button";
import { FileText, Globe, ImageIcon } from "lucide-react";
import { ContextDialogType } from "./context-table";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const typeIconMap: Record<ContextDialogType["type"], React.ReactNode> = {
  file: <ImageIcon size={16} />,
  url: <Globe size={16} />,
  text: <FileText size={16} />,
};

export function ContextItem({ context }: { context: Context }) {
  switch (context.type) {
    case "file":
      return <LinkItem context={context} />;
    case "url":
      return <LinkItem context={context} />;
    case "text":
      return <TextItem context={context} />;
    default:
      return null;
  }
}

function LinkItem({ context }: { context: Context }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [signedURL, setSignedURL] = useState<string | null>(null);

  useEffect(() => {
    async function getSignedURL(fileName: string) {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from("context")
        .createSignedUrl(fileName, 60 * 5); // 5 minutes

      if (error) {
        console.error("Error creating signed URL:", error);
        return null;
      }

      setSignedURL(data.signedUrl);
      setLoading(false);
    }

    if (context.type === "file") {
      getSignedURL(context.content);
    }
  }, [context, supabase]);

  return (
    <Link
      href={signedURL || context.content}
      target="_blank"
      aria-disabled={loading}
      key={context.id}
      className="h-10 group rounded-md aria-disabled:opacity-50 hover:bg-muted cursor-pointer has-[+div]:[&>div]:border-border/50 has-[+div:hover]:[&>div]:border-b-transparent px-8"
    >
      <div className="h-full relative w-full flex text-muted-foreground items-center gap-2 border-b border-transparent group-hover:border-b-transparent">
        {/* <div className="size-1.5 rounded-full bg-violet-700/80 absolute -left-4 top-1/2 -translate-y-1/2" /> */}
        <div className="flex gap-2 :[&>svg]:size-4 text-foreground">
          {typeIconMap[context.type]}
          <div className="p-0 w-72 truncate text-xs font-medium">
            {context.title}
          </div>
        </div>
        <div className="text-xs flex-1 truncate">
          <span>{context.content}</span>
        </div>
        <DeleteContextButton context={context} />
      </div>
    </Link>
  );
}

function TextItem({ context }: { context: Context }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          key={context.id}
          className="h-10 group rounded-md hover:bg-muted cursor-pointer has-[+div]:[&>div]:border-border/50 has-[+div:hover]:[&>div]:border-b-transparent px-8"
        >
          <div className="h-full relative w-full flex text-muted-foreground items-center gap-2 border-b border-transparent group-hover:border-b-transparent">
            {/* <div className="size-1.5 rounded-full bg-violet-700/80 absolute -left-4 top-1/2 -translate-y-1/2" /> */}
            <div className="flex gap-2 :[&>svg]:size-4 text-foreground">
              {typeIconMap[context.type]}
              <div className="p-0 w-72 truncate text-xs font-medium">
                {context.title}
              </div>
            </div>
            <div className="text-xs flex-1 truncate">
              <span>{context.content}</span>
            </div>
            <DeleteContextButton context={context} />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text">{context.title}</DialogTitle>
          <DialogDescription>{context.content}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
