import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Send, Paperclip, CheckCheck, Gamepad2 } from "lucide-react";
import { toast } from "sonner";
import MessageBubble from "./MessageBubble";
import FileUploader from "./FileUploader";
import { formatDistanceToNow } from "date-fns";

interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  last_online: string | null;
}

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

export default function AdminDashboard({ user }: { user: User }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showFileUpload, setShowFileUpload] = useState(false);

  // Load all user profiles
  useEffect(() => {
    const loadProfiles = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_admin", false)
        .order("last_online", { ascending: false });

      if (error) {
        toast.error("Failed to load users");
        return;
      }

      setProfiles(data || []);
    };

    loadProfiles();

    // Subscribe to profile changes
    const channel = supabase
      .channel("profiles-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        () => {
          loadProfiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Load messages for selected user
  useEffect(() => {
    if (!selectedUserId) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", selectedUserId)
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
      .channel("admin-messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `user_id=eq.${selectedUserId}`,
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
  }, [selectedUserId]);

  const handleSend = async () => {
    if (!content.trim() || !selectedUserId) return;

    try {
      const { error } = await supabase.from("messages").insert({
        user_id: selectedUserId,
        sender: "admin",
        content: content.trim(),
      });

      if (error) throw error;

      setContent("");
    } catch (error: any) {
      toast.error("Failed to send message");
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!selectedUserId) return;

    setUploading(true);
    setUploadProgress(0);
    
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `admin/${selectedUserId}/${Date.now()}.${fileExt}`;

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 200);

      const { error: uploadError } = await supabase.storage
        .from("chat-uploads")
        .upload(fileName, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("messages").insert({
        user_id: selectedUserId,
        sender: "admin",
        file_path: fileName,
        file_type: file.type,
      });

      if (insertError) throw insertError;

      toast.success("File uploaded successfully");
      setShowFileUpload(false);
      setUploadProgress(0);
    } catch (error: any) {
      toast.error("Failed to upload file");
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const markAsSeen = async () => {
    if (!selectedUserId) return;

    try {
      const { error } = await supabase
        .from("messages")
        .update({ seen: true })
        .eq("user_id", selectedUserId)
        .eq("seen", false);

      if (error) throw error;

      toast.success("Messages marked as seen");
    } catch (error: any) {
      toast.error("Failed to mark messages as seen");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const selectedProfile = profiles.find((p) => p.id === selectedUserId);
  const unseenCount = messages.filter((m) => !m.seen && m.sender === "user").length;

  return (
    <div className="min-h-screen flex bg-gaming-darker">
      {/* Sidebar - Users List */}
      <div className="w-80 bg-card border-r-2 border-primary/20 flex flex-col">
        <div className="p-4 border-b-2 border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-gaming rounded-lg flex items-center justify-center shadow-glow-cyan">
              <Gamepad2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold bg-gradient-gaming bg-clip-text text-transparent">
                Admin Dashboard
              </h2>
              <p className="text-xs text-muted-foreground">Support Center</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => setSelectedUserId(profile.id)}
              className={`w-full p-3 rounded-lg text-left transition-all ${
                selectedUserId === profile.id
                  ? "bg-primary/20 border-2 border-primary shadow-glow-cyan"
                  : "bg-muted/50 hover:bg-muted border-2 border-transparent"
              }`}
            >
              <div className="font-medium truncate">
                {profile.display_name || profile.email}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {profile.email}
              </div>
              {profile.last_online && (
                <div className="text-xs text-muted-foreground mt-1">
                  Active {formatDistanceToNow(new Date(profile.last_online), { addSuffix: true })}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUserId ? (
          <>
            {/* Header */}
            <header className="bg-card border-b-2 border-primary/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold">
                    {selectedProfile?.display_name || selectedProfile?.email}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {selectedProfile?.email}
                  </p>
                </div>
                {unseenCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAsSeen}
                    className="border-primary/50 hover:bg-primary/10"
                  >
                    <CheckCheck className="w-4 h-4 mr-2" />
                    Mark as Seen ({unseenCount})
                  </Button>
                )}
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} isAdmin />
              ))}
            </div>

            {/* File Upload Modal */}
            {showFileUpload && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-card rounded-xl p-6 max-w-md w-full border-2 border-primary/20 shadow-glow-cyan animate-scale-in">
                  <h3 className="text-lg font-semibold mb-4 bg-gradient-gaming bg-clip-text text-transparent">
                    Upload File
                  </h3>
                  <FileUploader 
                    onUpload={handleFileUpload} 
                    uploading={uploading}
                    uploadProgress={uploadProgress}
                  />
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-primary/30 hover:bg-primary/10"
                    onClick={() => !uploading && setShowFileUpload(false)}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Input */}
            <div className="bg-card border-t-2 border-primary/20 p-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFileUpload(true)}
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Gamepad2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a user to view their conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
