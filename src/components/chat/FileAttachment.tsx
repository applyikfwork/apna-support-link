import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FileAttachment({
  filePath,
  fileType,
}: {
  filePath: string;
  fileType: string | null;
}) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSignedUrl = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: urlError } = await supabase.storage
          .from("chat-uploads")
          .createSignedUrl(filePath, 3600); // 1 hour expiry

        if (urlError) {
          console.error("Error getting signed URL:", urlError);
          setError("Failed to load file");
          return;
        }

        if (data) {
          setSignedUrl(data.signedUrl);
        }
      } catch (err) {
        console.error("Error in getSignedUrl:", err);
        setError("Failed to load file");
      } finally {
        setLoading(false);
      }
    };

    getSignedUrl();
  }, [filePath]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        Loading file...
      </div>
    );
  }

  if (error || !signedUrl) {
    return (
      <div className="text-xs text-destructive bg-destructive/10 p-2 rounded">
        {error || "File not available"}
      </div>
    );
  }

  const isImage = fileType?.startsWith("image/");
  const isVideo = fileType?.startsWith("video/");
  const isPDF = fileType === "application/pdf";

  if (isImage) {
    return (
      <img
        src={signedUrl}
        alt="Attachment"
        className="max-w-full rounded-lg mt-2"
      />
    );
  }

  if (isVideo) {
    return (
      <video
        src={signedUrl}
        controls
        className="max-w-full rounded-lg mt-2"
      />
    );
  }

  if (isPDF) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => window.open(signedUrl, "_blank")}
      >
        <FileIcon className="w-4 h-4 mr-2" />
        View PDF
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="mt-2"
      onClick={() => window.open(signedUrl, "_blank")}
    >
      <Download className="w-4 h-4 mr-2" />
      Download File
    </Button>
  );
}
