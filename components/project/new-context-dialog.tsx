"use client";

import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ContextDialogType } from "./context-table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { useAppDispatch } from "@/hooks/use-redux";
import { insertContext, removeContext } from "@/lib/redux/project-slice";

const contextSchema = z.object({
  project_id: z.string(),
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  type: z.enum(["text", "file", "url"]),
});

export function ContextDialog({
  defaultOpen,
  projectId,
  dialog,
  children,
}: {
  defaultOpen?: boolean;
  projectId: string;
  dialog: ContextDialogType;
  children?: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const supabase = createClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setOpen] = useState(defaultOpen || false);

  const form = useForm<z.infer<typeof contextSchema>>({
    resolver: zodResolver(contextSchema),
    defaultValues: {
      project_id: projectId,
      type: dialog.type,
      title: "",
      content: "",
    },
  });

  async function onSubmit(data: z.infer<typeof contextSchema>) {
    setIsSubmitting(true);

    const newContext = {
      id: crypto.randomUUID(),
      project_id: data.project_id,
      title: data.title,
      content: data.content,
      type: dialog.type,
    };

    const { error } = await supabase.from("context").insert({ ...newContext });
    dispatch(insertContext({ pid: data.project_id, context: newContext }));

    if (error) {
      toast.error("Error creating context");
      dispatch(removeContext({ pid: data.project_id, cid: newContext.id }));
      console.error("[ERROR CONTEXT]:", error);
    }

    setIsSubmitting(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialog.title}</DialogTitle>
          <DialogDescription>{dialog.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)(e);
              setOpen(false);
            }}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dialog.labels.title}</FormLabel>
                  <FormControl>
                    <Input placeholder={dialog.values.title} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dialog.labels.description}</FormLabel>
                  <FormControl>
                    {dialog.type === "text" ? (
                      <Textarea
                        placeholder={dialog.values.description}
                        {...field}
                      />
                    ) : dialog.type === "file" ? (
                      <Input
                        type="file"
                        placeholder={dialog.values.description}
                        {...field}
                      />
                    ) : (
                      <Input
                        type="url"
                        placeholder={dialog.values.description}
                        {...field}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Context"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
