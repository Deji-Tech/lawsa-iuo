-- CBT Progress Tracking Schema Update
-- Run this in Supabase SQL Editor

-- ============================================
-- CBT IN-PROGRESS ATTEMPTS (for pause/resume)
-- ============================================

CREATE TABLE IF NOT EXISTS cbt_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    level TEXT NOT NULL,
    questions JSONB NOT NULL, -- Array of questions with user's current answers
    current_question_index INTEGER DEFAULT 0,
    time_remaining_seconds INTEGER DEFAULT 1800, -- 30 minutes default
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_completed BOOLEAN DEFAULT false,
    UNIQUE(user_id, course_id) -- Only one active progress per course per user
);

-- Enable RLS
ALTER TABLE cbt_progress ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own CBT progress" ON cbt_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own CBT progress" ON cbt_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CBT progress" ON cbt_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own CBT progress" ON cbt_progress
    FOR DELETE USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX idx_cbt_progress_user ON cbt_progress(user_id);
CREATE INDEX idx_cbt_progress_active ON cbt_progress(user_id, is_completed) WHERE is_completed = false;

-- Function to update last_updated_at timestamp
CREATE OR REPLACE FUNCTION update_cbt_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cbt_progress_timestamp
    BEFORE UPDATE ON cbt_progress
    FOR EACH ROW EXECUTE FUNCTION update_cbt_progress_timestamp();

-- Success message
SELECT 'CBT progress tracking tables created successfully!' AS status;