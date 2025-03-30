import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProjectSidebar } from "@/components/sidebar/project-sidebar";
import { Project } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IF",
  description: "Intelligent Friend ai chat",
};

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
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="bottom-center" />
        {user && user.data.user ? (
          <SidebarProvider>
            <ProjectSidebar projectsPromise={getProjects()} />
            {children}
          </SidebarProvider>
        ) : (
          <>{children}</>
        )}
      </body>
    </html>
  );
}
