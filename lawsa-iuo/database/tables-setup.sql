-- ============================================
-- COMPLETE DATABASE TABLES SETUP FOR LAWSA-IUO
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CREATE STORAGE BUCKETS (Tables only)
-- ============================================

-- Create the documents bucket for PDF uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents',
    false,
    10485760,
    ARRAY['application/pdf', 'text/plain', 'text/markdown', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 10485710,
    allowed_mime_types = ARRAY['application/pdf', 'text/plain', 'text/markdown', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

-- Create the profiles bucket for avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'profiles',
    'profiles',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- ============================================
-- 2. CREATE USER_STREAKS TABLE
-- ============================================

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

ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own streaks" ON user_streaks;
DROP POLICY IF EXISTS "Users can insert/update own streaks" ON user_streaks;

CREATE POLICY "Users can view own streaks" ON user_streaks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update own streaks" ON user_streaks
    FOR ALL USING (auth.uid() = user_id);

GRANT ALL ON user_streaks TO authenticated;

-- ============================================
-- 3. CREATE USER_ACTIVITY_LOG TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS user_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own activity" ON user_activity_log;
DROP POLICY IF EXISTS "Users can insert own activity" ON user_activity_log;

CREATE POLICY "Users can view own activity" ON user_activity_log
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON user_activity_log
    FOR INSERT WITH CHECK (auth.uid() = user_id);

GRANT ALL ON user_activity_log TO authenticated;

-- ============================================
-- 4. CREATE CBT_PROGRESS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS cbt_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    attempt_id UUID,
    current_question_index INTEGER DEFAULT 0,
    answers JSONB DEFAULT '{}'::jsonb,
    time_remaining_seconds INTEGER,
    is_completed BOOLEAN DEFAULT false,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, attempt_id)
);

ALTER TABLE cbt_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own CBT progress" ON cbt_progress;
DROP POLICY IF EXISTS "Users can insert/update own CBT progress" ON cbt_progress;

CREATE POLICY "Users can view own CBT progress" ON cbt_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update own CBT progress" ON cbt_progress
    FOR ALL USING (auth.uid() = user_id);

GRANT ALL ON cbt_progress TO authenticated;

-- ============================================
-- 5. CREATE SOURCES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    type TEXT NOT NULL DEFAULT 'text',
    file_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own sources" ON sources;
DROP POLICY IF EXISTS "Users can insert own sources" ON sources;
DROP POLICY IF EXISTS "Users can update own sources" ON sources;
DROP POLICY IF EXISTS "Users can delete own sources" ON sources;

CREATE POLICY "Users can view own sources" ON sources
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sources" ON sources
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sources" ON sources
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sources" ON sources
    FOR DELETE USING (auth.uid() = user_id);

GRANT ALL ON sources TO authenticated;

-- ============================================
-- 6. CREATE FUNCTION FOR USER STREAKS
-- ============================================

CREATE OR REPLACE FUNCTION get_or_create_user_streak(user_uuid UUID)
RETURNS user_streaks AS $$
DECLARE
    streak_record user_streaks;
BEGIN
    SELECT * INTO streak_record
    FROM user_streaks
    WHERE user_id = user_uuid;
    
    IF NOT FOUND THEN
        INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date)
        VALUES (user_uuid, 0, 0, NULL)
        RETURNING * INTO streak_record;
    END IF;
    
    RETURN streak_record;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SUCCESS
-- ============================================

SELECT 'All tables and buckets created successfully!' AS status;
