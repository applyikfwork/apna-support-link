-- Add storage RLS policies for chat-uploads bucket
-- Users can upload their own files
CREATE POLICY "Users can upload own files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'chat-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can read their own files
CREATE POLICY "Users can read own files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'chat-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'chat-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Admins can read all files
CREATE POLICY "Admins can read all files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'chat-uploads' 
  AND public.is_admin(auth.uid())
);