-- Fix storage and database issues
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. CREATE PROFILES STORAGE BUCKET
-- ============================================

-- Insert the profiles bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'profiles',
    'profiles',
    true,
    5242880, -- 5MB in bytes
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Enable RLS on the bucket
-- Storage policies
CREATE POLICY "Allow public read access to profile avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profiles');

CREATE POLICY "Allow users to upload their own profile avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'profiles' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow users to update their own profile avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'profiles' 
    AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
    bucket_id = 'profiles' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow users to delete their own profile avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'profiles' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- 2. FIX USER_STREAKS TABLE
-- ============================================

-- Ensure user_streaks table exists
CREATE TABLE IF NOT EXISTS user_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

-- Recreate policies
DROP POLICY IF EXISTS "Users can view own streaks" ON user_streaks;
DROP POLICY IF EXISTS "Users can insert/update own streaks" ON user_streaks;

CREATE POLICY "Users can view own streaks" ON user_streaks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update own streaks" ON user_streaks
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 3. FIX USER_ACTIVITY_LOG TABLE
-- ============================================

-- Ensure user_activity_log table exists
CREATE TABLE IF NOT EXISTS user_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- Recreate policies
DROP POLICY IF EXISTS "Users can view own activity" ON user_activity_log;
DROP POLICY IF EXISTS "Users can insert own activity" ON user_activity_log;

CREATE POLICY "Users can view own activity" ON user_activity_log
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON user_activity_log
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 4. GRANT PERMISSIONS
-- ============================================

GRANT ALL ON user_streaks TO authenticated;
GRANT ALL ON user_activity_log TO authenticated;
-- Note: No sequence grants needed for UUID tables

-- ============================================
-- 5. CREATE FUNCTION TO HANDLE MISSING STREAK RECORDS
-- ============================================

CREATE OR REPLACE FUNCTION get_or_create_user_streak(user_uuid UUID)
RETURNS user_streaks AS $$
DECLARE
    streak_record user_streaks;
BEGIN
    -- Try to get existing record
    SELECT * INTO streak_record
    FROM user_streaks
    WHERE user_id = user_uuid;
    
    -- If not found, create one
    IF NOT FOUND THEN
        INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date)
        VALUES (user_uuid, 0, 0, NULL)
        RETURNING * INTO streak_record;
    END IF;
    
    RETURN streak_record;
END;
$$ LANGUAGE plpgsql;

-- Success message
SELECT 'Storage bucket and tables fixed successfully!' AS status;