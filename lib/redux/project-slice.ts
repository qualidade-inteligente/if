import { Chat, Context, Project } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProjectState {
  projects: Project[];
}

const initialState: ProjectState = {
  projects: [],
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    initializeProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload.map((project) => ({
        id: project.id,
        title: project.title,
        created_at: project.created_at,
        chat: project.chat,
        context: project.context,
      }));
    },
    insertProject: (
      state,
      action: PayloadAction<{
        id: string;
        title: string;
        created_at: string | undefined;
        chat: Chat[] | undefined;
        context: Context[] | undefined;
      }>
    ) => {
      const newProject: Project = {
        id: action.payload.id,
        title: action.payload.title,
        created_at: action.payload.created_at || new Date().toISOString(),
        chat: action.payload.chat || [],
        context: action.payload.context || [],
      };

      state.projects.push(newProject);
    },
    removeProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(
        (project) => project.id !== action.payload
      );
    },
    insertChat: (state, action: PayloadAction<{ id: string; chat: Chat }>) => {
      const index = state.projects.findIndex(
        (project) => project.id === action.payload.id
      );
      if (index !== -1) {
        state.projects[index].chat.push(action.payload.chat);
      }
    },
    removeChat: (
      state,
      action: PayloadAction<{ pid: string; cid: string }>
    ) => {
      const index = state.projects.findIndex(
        (project) => project.id === action.payload.pid
      );
      if (index !== -1) {
        const chatIndex = state.projects[index].chat.findIndex(
          (chat) => chat.id === action.payload.cid
        );
        if (chatIndex !== -1) {
          state.projects[index].chat.splice(chatIndex, 1);
        }
      }
    },
    insertContext: (
      state,
      action: PayloadAction<{ pid: string; context: Context }>
    ) => {
      const index = state.projects.findIndex(
        (project) => project.id === action.payload.pid
      );
      if (index !== -1) {
        state.projects[index].context.push(action.payload.context);
      }
    },
    removeContext: (
      state,
      action: PayloadAction<{ pid: string; cid: string }>
    ) => {
      const index = state.projects.findIndex(
        (project) => project.id === action.payload.pid
      );
      if (index !== -1) {
        const contextIndex = state.projects[index].context.findIndex(
          (context) => context.id === action.payload.cid
        );
        if (contextIndex !== -1) {
          state.projects[index].context.splice(contextIndex, 1);
        }
      }
    },
  },
});

export const {
  initializeProjects,
  insertProject,
  removeProject,
  insertChat,
  removeChat,
  insertContext,
  removeContext,
} = projectSlice.actions;
export default projectSlice.reducer;
