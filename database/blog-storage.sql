-- Create blog-images storage bucket (run this in Supabase dashboard SQL editor)
-- Note: The bucket itself must be created via the Supabase Storage dashboard UI
-- (Storage → New bucket → name: "blog-images" → Public: ON)
-- Then run these policies:

CREATE POLICY "Public read blog images" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete blog images" ON storage.objects
  FOR DELETE USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');
