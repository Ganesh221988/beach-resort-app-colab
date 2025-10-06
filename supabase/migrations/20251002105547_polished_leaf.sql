/*
  # Create Storage Buckets for Property Media

  1. Storage Buckets
    - `property-images` - For property photos
    - `property-videos` - For property videos
    - `user-avatars` - For user profile pictures
    - `documents` - For KYC and business documents

  2. Security
    - Public read access for property media
    - Authenticated write access with user restrictions
    - File type and size restrictions
    - RLS policies for secure access

  3. Features
    - Automatic image optimization
    - CDN delivery for fast loading
    - Secure file uploads
    - File versioning support
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'property-images',
    'property-images',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  ),
  (
    'property-videos',
    'property-videos', 
    true,
    104857600, -- 100MB limit
    ARRAY['video/mp4', 'video/webm', 'video/mov', 'video/avi']
  ),
  (
    'user-avatars',
    'user-avatars',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  ),
  (
    'documents',
    'documents',
    false, -- Private bucket for sensitive documents
    10485760, -- 10MB limit
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  )
ON CONFLICT (id) DO NOTHING;

-- Storage policies for property-images bucket
CREATE POLICY "Public can view property images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own property images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'property-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own property images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for property-videos bucket
CREATE POLICY "Public can view property videos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'property-videos');

CREATE POLICY "Authenticated users can upload property videos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own property videos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'property-videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own property videos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for user-avatars bucket
CREATE POLICY "Public can view user avatars"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can manage own avatars"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'user-avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'user-avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for documents bucket (private)
CREATE POLICY "Users can manage own documents"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Admins can access all documents
CREATE POLICY "Admins can access all documents"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    bucket_id = 'documents' AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );