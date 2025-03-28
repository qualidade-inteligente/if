export type Project = {
  id: string;
  name: string;
  chats: Chat[];
};

export type Chat = {
  id: string;
  name: string;
};
