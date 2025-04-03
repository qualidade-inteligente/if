import { NewProjectDialog } from "../sidebar/new-project-dialog";
import { Button } from "../ui/button";
import { ChatInput } from "./chat-input";

export function EmptyChat() {
  return (
    <>
      <div className="w-[320px] space-y-2 left-1/2 -translate-x-1/2 absolute top-1/2 -translate-y-1/2">
        <h1 className="text-sm font-semibold">
          Create a Project or Type below
        </h1>
        <p className="text-xs text-muted-foreground">
          By creating a project, you can save your chats and access them later.
        </p>

        <NewProjectDialog>
          <Button
            type="submit"
            size="sm"
            className="w-full"
            // disabled={loading}
          >
            {/* {loading ? "Logging in..." : "Login"} */}
            Create Project
          </Button>
        </NewProjectDialog>
      </div>
      <ChatInput />
    </>
  );
}
