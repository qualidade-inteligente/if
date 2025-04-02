import { Chat, Project } from "@/lib/types";
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
      }));
    },
    insertProject: (
      state,
      action: PayloadAction<{
        id: string;
        title: string;
        created_at: string | undefined;
        chat: Chat[] | undefined;
      }>
    ) => {
      const newProject: Project = {
        id: action.payload.id,
        title: action.payload.title,
        created_at: action.payload.created_at || new Date().toISOString(),
        chat: action.payload.chat || [],
      };

      state.projects.push(newProject);
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
    // Decrement action without a payload
    removeProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(
        (project) => project.id !== action.payload
      );
    },
  },
});

export const {
  initializeProjects,
  insertProject,
  removeProject,
  insertChat,
  removeChat,
} = projectSlice.actions;
export default projectSlice.reducer;
