"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

type Project = {
  id: string;
  title: string;
  created_at: string;
};

export function AllProjects({ projects }: { projects: Project[] }) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link href="/projects/new">
          <Button>New Project</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project: Project) => (
          <div
            key={project.id}
            className="border p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="text-sm text-gray-500 mt-2">
              Created: {new Date(project.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
