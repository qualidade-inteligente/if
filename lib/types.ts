export type Project = {
  id: string;
  title: string;
  created_at: string;
  chat: Chat[];
  context: Context[];
};

export type Chat = {
  id: string;
  title: string;
  project_id: string;
  created_at: string;
};

export type Context = {
  id: string;
  title: string;
  content: string;
  type: "text" | "url" | "file";
  project_id: string;
};
