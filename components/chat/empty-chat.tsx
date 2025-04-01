import { Button } from "../ui/button";
import { ChatInput } from "./chat-input";

export function EmptyChat() {
  return (
    <>
      <div className="w-[320px] left-1/2 -translate-x-1/2 absolute top-1/2 -translate-y-1/2">
        <h1 className="text-base font-semibold mb-2">
          Create a Project or Type below
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          Create a new project to start chatting with our AI assistant. You can
          provide context about your work to get more tailored assistance and
          relevant suggestions.
        </p>

        <Button
          type="submit"
          className="w-full text-sm h-9"
          // disabled={loading}
        >
          {/* {loading ? "Logging in..." : "Login"} */}
          Create Project
        </Button>
      </div>
      <ChatInput />
    </>
  );
}
