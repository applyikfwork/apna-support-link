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

  useEffect(() => {
    const getSignedUrl = async () => {
      const { data, error } = await supabase.storage
        .from("chat-uploads")
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (!error && data) {
        setSignedUrl(data.signedUrl);
      }
    };

    getSignedUrl();
  }, [filePath]);

  if (!signedUrl) {
    return <div className="text-xs text-muted-foreground">Loading file...</div>;
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
