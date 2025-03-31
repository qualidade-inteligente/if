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
        user_id: project.user_id,
        chat: project.chat,
      }));
    },
    createProject: (
      state,
      action: PayloadAction<{ user_id: string; title: string }>
    ) => {
      const newProject: Project = {
        id: crypto.randomUUID(),
        title: action.payload.title,
        created_at: new Date().toISOString(),
        user_id: action.payload.user_id,
        chat: [],
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

    // Decrement action without a payload
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(
        (project) => project.id !== action.payload
      );
    },
  },
});

export const { initializeProjects, createProject, deleteProject, insertChat } =
  projectSlice.actions;
export default projectSlice.reducer;
