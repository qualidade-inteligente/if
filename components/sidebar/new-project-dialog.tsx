"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { PlusCircle } from "lucide-react";
import { useAppDispatch } from "@/hooks/use-redux";
import { createProject } from "@/lib/redux/project-slice";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
});

export function NewProjectDialog() {
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
      return;
    }
    dispatch(createProject({ id, title: values.title }));
    setIsSubmitting(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <DialogTrigger>
            <PlusCircle size={16} />
            <span className="text-xs">New Project</span>
          </DialogTrigger>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new Project</DialogTitle>
          <DialogDescription>
            Enter the details for your new project.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)(e);
              setOpen(false);
            }}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
