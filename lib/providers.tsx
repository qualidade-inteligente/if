"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "@/lib/redux/project-slice";
import { Project } from "./types";

export default function Providers({
  serverProjects,
  children,
}: Readonly<{
  serverProjects: Project[];
  children: React.ReactNode;
}>) {
  const store = configureStore({
    reducer: {
      project: projectReducer,
    },
    preloadedState: {
      project: {
        projects: serverProjects,
      },
    },
  });

  return (
    <Provider store={store}>
      <SidebarProvider>{children}</SidebarProvider>
    </Provider>
  );
}
