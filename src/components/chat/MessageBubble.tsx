import { format } from "date-fns";
import { CheckCheck } from "lucide-react";
import FileAttachment from "./FileAttachment";

interface Message {
  id: string;
  sender: "user" | "admin";
  content: string | null;
  file_path: string | null;
  file_type: string | null;
  seen: boolean;
  created_at: string;
}

export default function MessageBubble({
  message,
  isAdmin = false,
}: {
  message: Message;
  isAdmin?: boolean;
}) {
  const isOwnMessage = isAdmin ? message.sender === "admin" : message.sender === "user";

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-2xl p-4 ${
          isOwnMessage
            ? "bg-primary text-primary-foreground shadow-glow-cyan"
            : "bg-card border-2 border-border"
        }`}
      >
        {message.content && (
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        )}
        
        {message.file_path && (
          <FileAttachment
            filePath={message.file_path}
            fileType={message.file_type}
          />
        )}

        <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
          <span>{format(new Date(message.created_at), "h:mm a")}</span>
          {isOwnMessage && message.seen && (
            <CheckCheck className="w-3 h-3" />
          )}
        </div>
      </div>
    </div>
  );
}
