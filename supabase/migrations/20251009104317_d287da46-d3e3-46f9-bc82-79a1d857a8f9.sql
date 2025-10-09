-- Drop existing policies on storage.objects for chat-uploads
DROP POLICY IF EXISTS "Users can insert own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can select own files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can select all files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;

-- Create improved policies for chat-uploads bucket
-- Users can upload files to their own folder
CREATE POLICY "Users can upload to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins can upload files to any user's folder
CREATE POLICY "Admins can upload to any folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-uploads' AND
  public.is_admin(auth.uid())
);

-- Users can view files in their own folder
CREATE POLICY "Users can view own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'chat-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins can view all chat upload files
CREATE POLICY "Admins can view all files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'chat-uploads' AND
  public.is_admin(auth.uid())
);

-- Users can delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins can delete any files
CREATE POLICY "Admins can delete any files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-uploads' AND
  public.is_admin(auth.uid())
);