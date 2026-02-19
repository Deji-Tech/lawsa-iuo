-- ============================================
-- CHAT HISTORY TABLES (FIXED - Handles Existing Policies)
-- ============================================

-- ============================================
-- 1. CREATE CHAT CONVERSATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS chat_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Users can delete own conversations" ON chat_conversations;

-- Create policies
CREATE POLICY "Users can view own conversations" ON chat_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON chat_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON chat_conversations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations" ON chat_conversations
    FOR DELETE USING (auth.uid() = user_id);

GRANT ALL ON chat_conversations TO authenticated;

-- ============================================
-- 2. CREATE CHAT MESSAGES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'model')),
    content TEXT NOT NULL,
    citations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can delete own messages" ON chat_messages;

-- Create policies
CREATE POLICY "Users can view own messages" ON chat_messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" ON chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages" ON chat_messages
    FOR DELETE USING (auth.uid() = user_id);

GRANT ALL ON chat_messages TO authenticated;

-- ============================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_chat_conversations_user ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_updated ON chat_conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

SELECT 'Chat history tables and policies updated successfully!' AS status;
