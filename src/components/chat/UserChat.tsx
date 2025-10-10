import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Send, Paperclip, Gamepad2 } from "lucide-react";
import { toast } from "sonner";
import MessageBubble from "./MessageBubble";

interface Message {
  id: string;
  user_id: string;
  sender: "user" | "admin";
  content: string | null;
  file_path: string | null;
  file_type: string | null;
  seen: boolean;
  created_at: string;
}

export default function UserChat({ user }: { user: User }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update last_online periodically
  useEffect(() => {
    const updatePresence = async () => {
      await supabase
        .from("profiles")
        .update({ last_online: new Date().toISOString() })
        .eq("id", user.id);
    };

    updatePresence();
    const interval = setInterval(updatePresence, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [user.id]);

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        toast.error("Failed to load messages");
        return;
      }

      setMessages(data as Message[] || []);
    };

    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel("user-messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, payload.new as Message]);
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === payload.new.id ? (payload.new as Message) : msg
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!content.trim()) return;

    try {
      const { error } = await supabase.from("messages").insert({
        user_id: user.id,
        sender: "user",
        content: content.trim(),
      });

      if (error) throw error;

      setContent("");
    } catch (error: any) {
      toast.error("Failed to send message");
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const loadingToast = toast.loading(`Uploading ${file.name}...`);
    
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("chat-uploads")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("messages").insert({
        user_id: user.id,
        sender: "user",
        file_path: fileName,
        file_type: file.type,
      });

      if (insertError) throw insertError;

      toast.success("File sent successfully", { id: loadingToast });
    } catch (error: any) {
      toast.error(error.message || "Failed to upload file", { id: loadingToast });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gaming-darker">
      {/* Header */}
      <header className="bg-card border-b-2 border-primary/20 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-gaming rounded-lg flex items-center justify-center shadow-glow-cyan">
              <Gamepad2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-gaming bg-clip-text text-transparent">
                Apna Esport Support
              </h1>
              <p className="text-xs text-muted-foreground">We're here to help</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-card border-t-2 border-primary/20 p-4">
        <div className="container mx-auto flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept="image/*,video/*,.pdf,.doc,.docx"
            className="hidden"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="border-primary/50 hover:bg-primary/10 hover:border-primary"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="bg-muted border-border focus:border-primary"
          />
          <Button
            onClick={handleSend}
            disabled={!content.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-cyan"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
