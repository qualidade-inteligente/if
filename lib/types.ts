export type Project = {
  id: string;
  title: string;
  created_at: string;
  user_id: string;
  chat: Chat[];
};

export type Chat = {
  id: string;
  title: string;
  project_id: string;
  created_at: string;
};
