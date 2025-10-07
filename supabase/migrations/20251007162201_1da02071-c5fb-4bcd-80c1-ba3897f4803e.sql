-- Create storage bucket for chat uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-uploads', 'chat-uploads', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage bucket
CREATE POLICY "Users can upload their own files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'chat-uploads' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR
   EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
);

CREATE POLICY "Users can view their own files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'chat-uploads' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR
   EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
);

CREATE POLICY "Admin can view all files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'chat-uploads' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);