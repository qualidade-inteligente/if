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

const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
});

export function NewProjectDialog() {
  const dispatch = useAppDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(values: z.infer<typeof projectSchema>) {
    setIsSubmitting(true);
    dispatch(createProject(values.title));
    setIsSubmitting(false);
  }

  return (
    <Dialog>
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
