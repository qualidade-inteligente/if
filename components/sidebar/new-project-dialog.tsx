"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useAppDispatch } from "@/hooks/use-redux";
import { insertProject } from "@/lib/redux/project-slice";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
});

export function NewProjectDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(values: z.infer<typeof projectSchema>) {
    setIsSubmitting(true);
    const id = crypto.randomUUID();
    const { error } = await supabase
      .from("project")
      .insert({ id, title: values.title });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Project created successfully");
      setOpen(false);
      dispatch(
        insertProject({
          id,
          title: values.title,
          created_at: new Date().toISOString(),
          chat: [],
          context: [],
        })
      );
    }

    setIsSubmitting(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Name your project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
