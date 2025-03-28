import { ProjectSidebar } from "../../components/sidebar/project-sidebar";
import { Project } from "@/lib/types";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";

async function getProjects(): Promise<Project[]> {
  return [
    {
      id: "1",
      name: "Project alpha",
      chats: [
        {
          id: "1",
          name: "Chat 1",
        },
        {
          id: "2",
          name: "Chat 2",
        },
      ],
    },
    {
      id: "2",
      name: "Project beta",
      chats: [],
    },
  ];
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <Toaster position="bottom-center" />
      <ProjectSidebar projectsPromise={getProjects()} />
      {children}
    </SidebarProvider>
  );
}
