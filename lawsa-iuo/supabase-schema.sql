-- Create sources table for uploaded documents
CREATE TABLE IF NOT EXISTS public.sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pdf', 'text', 'url')),
  file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- Enable RLS
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own sources"
  ON sources FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sources"
  ON sources FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sources"
  ON sources FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sources"
  ON sources FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for documents
-- Note: Run this in Supabase Dashboard > Storage > New Bucket
-- Bucket name: documents
-- Public: false

-- Add phone_number to profiles if not exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone_number, level, avatar_url)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone_number',
    NEW.raw_user_meta_data->>'level',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
