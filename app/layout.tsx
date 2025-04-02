import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ProjectSidebar } from "@/components/sidebar/project-sidebar";
import { createClient } from "@/lib/supabase/server";
import Providers from "@/lib/providers";
import { Project } from "@/lib/types";

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
  const supabase = await createClient();
  const { data, error } = await supabase.from("project").select("*, chat(*)");
  if (error) {
    console.error("[ERROR PROJECT]:", error);
  }
  return data as Project[];
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const user = await supabase.auth.getUser();

  const projects = await getProjects();

  console.log("Projects:", projects);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-center" />
        {user && user.data.user ? (
          <Providers serverProjects={await getProjects()}>
            <ProjectSidebar />
            {children}
          </Providers>
        ) : (
          <>{children}</>
        )}
      </body>
    </html>
  );
}
