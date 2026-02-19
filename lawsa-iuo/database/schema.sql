-- Database Schema for LAWSA-IUO
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. QUESTION BANK
-- ============================================

CREATE TABLE IF NOT EXISTS question_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    level TEXT, -- 100L, 200L, 300L, 400L, 500L or NULL for all levels
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES question_categories(id) ON DELETE CASCADE,
    level TEXT NOT NULL, -- 100L, 200L, 300L, 400L, 500L
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    question_text TEXT NOT NULL,
    scenario TEXT, -- Optional scenario/case study
    options JSONB NOT NULL, -- Array of options: ["Option A", "Option B", ...]
    correct_answer INTEGER NOT NULL, -- Index of correct option (0-based)
    explanation TEXT, -- Explanation of why the answer is correct
    source TEXT, -- Source material (e.g., "Constitution Section 33")
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. USER CBT ATTEMPTS & PROGRESS
-- ============================================

CREATE TABLE IF NOT EXISTS cbt_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES question_categories(id),
    level TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    time_taken_seconds INTEGER, -- Time taken to complete
    questions_data JSONB, -- Store the questions and user's answers: [{question_id, selected_answer, correct_answer, is_correct}]
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_question_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    attempts INTEGER DEFAULT 0,
    correct_attempts INTEGER DEFAULT 0,
    last_answered_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, question_id)
);

-- ============================================
-- 3. COURSES & MATERIALS
-- ============================================

CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    level TEXT NOT NULL, -- 100L, 200L, 300L, 400L, 500L
    description TEXT,
    modules_count INTEGER DEFAULT 0,
    duration_weeks INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT CHECK (type IN ('pdf', 'video', 'text', 'audio')),
    file_url TEXT, -- URL to stored file
    file_size_bytes INTEGER,
    content TEXT, -- For text materials
    duration_minutes INTEGER, -- For video/audio
    order_index INTEGER DEFAULT 0, -- For ordering within course
    is_premium BOOLEAN DEFAULT false, -- Premium content
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_material_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0,
    last_position INTEGER DEFAULT 0, -- Last page/time position
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, material_id)
);

-- ============================================
-- 4. USER STUDY SESSIONS & STATS
-- ============================================

CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_type TEXT CHECK (session_type IN ('reading', 'cbt', 'video', 'practice')),
    material_id UUID REFERENCES materials(id) ON DELETE SET NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    metadata JSONB -- Additional data like pages read, etc.
);

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

-- ============================================
-- 5. NIGERIAN LAW DATABASE
-- ============================================

CREATE TABLE IF NOT EXISTS statutes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    short_title TEXT, -- e.g., "Constitution 1999"
    category TEXT NOT NULL, -- Constitutional, Criminal, Civil, etc.
    year INTEGER,
    sections_count INTEGER,
    full_text TEXT, -- Full text of the statute
    document_url TEXT, -- Link to PDF
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS case_law (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citation TEXT NOT NULL UNIQUE, -- e.g., "[2020] 12 NWLR (Pt. 1950) 45"
    title TEXT NOT NULL,
    summary TEXT,
    full_text TEXT,
    court TEXT, -- Supreme Court, Court of Appeal, etc.
    date_decided DATE,
    judges TEXT, -- Comma-separated list
    principles TEXT[], -- Array of legal principles established
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    statute_id UUID REFERENCES statutes(id) ON DELETE CASCADE,
    case_law_id UUID REFERENCES case_law(id) ON DELETE CASCADE,
    bookmarked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (
        (statute_id IS NOT NULL AND case_law_id IS NULL) OR
        (statute_id IS NULL AND case_law_id IS NOT NULL)
    ),
    UNIQUE(user_id, statute_id, case_law_id)
);

-- ============================================
-- 6. USER ACTIVITY LOG
-- ============================================

CREATE TABLE IF NOT EXISTS user_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- login, material_viewed, test_completed, etc.
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cbt_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_question_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_material_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- Questions: Public can view active questions
CREATE POLICY "Public questions are viewable by everyone" ON questions
    FOR SELECT USING (is_active = true);

-- CBT Attempts: Users can only see their own attempts
CREATE POLICY "Users can view own CBT attempts" ON cbt_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own CBT attempts" ON cbt_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Question History: Users can only see their own
CREATE POLICY "Users can view own question history" ON user_question_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update own question history" ON user_question_history
    FOR ALL USING (auth.uid() = user_id);

-- Materials: Public can view active materials
CREATE POLICY "Public materials are viewable by everyone" ON materials
    FOR SELECT USING (is_active = true);

-- User Material Progress: Users can only see their own
CREATE POLICY "Users can view own material progress" ON user_material_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update own material progress" ON user_material_progress
    FOR ALL USING (auth.uid() = user_id);

-- Study Sessions: Users can only see their own
CREATE POLICY "Users can view own study sessions" ON study_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study sessions" ON study_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Streaks: Users can only see their own
CREATE POLICY "Users can view own streaks" ON user_streaks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update own streaks" ON user_streaks
    FOR ALL USING (auth.uid() = user_id);

-- Statutes & Case Law: Public can view
CREATE POLICY "Public statutes are viewable by everyone" ON statutes
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public case law is viewable by everyone" ON case_law
    FOR SELECT USING (true);

-- User Bookmarks: Users can only see their own
CREATE POLICY "Users can view own bookmarks" ON user_bookmarks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/delete own bookmarks" ON user_bookmarks
    FOR ALL USING (auth.uid() = user_id);

-- User Activity Log: Users can only see their own
CREATE POLICY "Users can view own activity" ON user_activity_log
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON user_activity_log
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_statutes_updated_at BEFORE UPDATE ON statutes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update user streaks
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
    last_date DATE;
    current_streak INTEGER;
BEGIN
    -- Get current streak info
    SELECT last_activity_date, current_streak 
    INTO last_date, current_streak
    FROM user_streaks
    WHERE user_id = NEW.user_id;
    
    -- If no streak record exists, create one
    IF NOT FOUND THEN
        INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date)
        VALUES (NEW.user_id, 1, 1, CURRENT_DATE);
        RETURN NEW;
    END IF;
    
    -- Update streak based on last activity
    IF last_date = CURRENT_DATE THEN
        -- Already active today, do nothing
        NULL;
    ELSIF last_date = CURRENT_DATE - INTERVAL '1 day' THEN
        -- Active yesterday, increment streak
        UPDATE user_streaks
        SET current_streak = current_streak + 1,
            longest_streak = GREATEST(longest_streak, current_streak + 1),
            last_activity_date = CURRENT_DATE,
            updated_at = NOW()
        WHERE user_id = NEW.user_id;
    ELSE
        -- Streak broken, reset to 1
        UPDATE user_streaks
        SET current_streak = 1,
            last_activity_date = CURRENT_DATE,
            updated_at = NOW()
        WHERE user_id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update streak on activity
CREATE TRIGGER update_streak_on_activity
    AFTER INSERT ON user_activity_log
    FOR EACH ROW
    EXECUTE FUNCTION update_user_streak();

-- ============================================
-- SEED DATA - Question Categories
-- ============================================

INSERT INTO question_categories (name, description, level) VALUES
('Legal Methods', 'Introduction to legal research and methodology', '100L'),
('Nigerian Legal System', 'Structure and operation of Nigerian legal system', '100L'),
('Constitutional Law', 'Constitutional principles and Nigerian constitution', '200L'),
('Contract Law', 'Formation and enforcement of contracts', '200L'),
('Criminal Law', 'Offenses and criminal liability', '300L'),
('Torts', 'Civil wrongs and remedies', '300L'),
('Commercial Law', 'Business and commercial transactions', '300L'),
('Land Law', 'Property rights and land tenure', '400L'),
('Equity and Trusts', 'Equitable principles and trust law', '400L'),
('Evidence', 'Rules of evidence in Nigerian courts', '400L'),
('Company Law', 'Corporate law and business organizations', '500L'),
('Jurisprudence', 'Legal theory and philosophy', '500L'),
('Environmental Law', 'Environmental protection and regulations', '500L');

-- ============================================
-- SEED DATA - Sample Courses
-- ============================================

INSERT INTO courses (code, title, level, description, modules_count, duration_weeks) VALUES
('LAW 101', 'Legal Methods I', '100L', 'Introduction to legal research, writing, and methodology', 9, 12),
('LAW 102', 'Nigerian Legal System I', '100L', 'Overview of the Nigerian legal system and court hierarchy', 9, 12),
('LAW 103', 'Constitutional Law I', '200L', 'Fundamental principles of constitutional law in Nigeria', 12, 12),
('LAW 104', 'Contract Law I', '200L', 'Formation, validity, and discharge of contracts', 13, 12),
('LAW 201', 'Criminal Law I', '300L', 'General principles of criminal liability and defenses', 12, 12),
('LAW 202', 'Law of Torts I', '300L', 'Intentional torts and negligence', 13, 12),
('LAW 203', 'Commercial Law I', '300L', 'Sale of goods, agency, and hire purchase', 12, 12),
('LAW 301', 'Land Law I', '400L', 'Land tenure, title, and registration', 14, 12),
('LAW 302', 'Equity and Trusts I', '400L', 'Equitable remedies and trust creation', 12, 12),
('LAW 303', 'Law of Evidence', '400L', 'Admissibility and weight of evidence', 14, 12),
('LAW 401', 'Company Law I', '500L', 'Formation and management of companies', 14, 12),
('LAW 402', 'Jurisprudence I', '500L', 'Nature of law and legal positivism', 12, 12),
('LAW 403', 'Environmental Law', '500L', 'Environmental protection and regulations', 10, 12);

-- ============================================
-- SEED DATA - Sample Statutes
-- ============================================

INSERT INTO statutes (title, short_title, category, year, sections_count) VALUES
('Constitution of the Federal Republic of Nigeria 1999 (as amended)', 'Constitution 1999', 'Constitutional Law', 1999, 320),
('Criminal Code Act', 'Criminal Code', 'Criminal Law', 1916, 560),
('Evidence Act 2011', 'Evidence Act', 'Evidence', 2011, 259),
('Companies and Allied Matters Act 2020', 'CAMA 2020', 'Company Law', 2020, 870),
('Land Use Act 1978', 'Land Use Act', 'Land Law', 1978, 47),
('Sale of Goods Act', 'Sale of Goods Act', 'Commercial Law', 1893, 64),
('Administration of Criminal Justice Act 2015', 'ACJA 2015', 'Criminal Procedure', 2015, 495),
('Environmental Impact Assessment Act', 'EIA Act', 'Environmental Law', 1992, 62);

-- ============================================
-- SEED DATA - Sample Questions
-- ============================================

INSERT INTO questions (category_id, level, difficulty, question_text, options, correct_answer, explanation, source) 
SELECT 
    qc.id,
    '100L',
    'easy',
    'What is the primary source of Nigerian law?',
    '["English Law", "Nigerian Legislation", "Customary Law", "Islamic Law"]',
    1,
    'Nigerian Legislation, including Acts of the National Assembly and laws of State Houses of Assembly, is the primary source of law in Nigeria.',
    'Nigerian Legal System'
FROM question_categories qc 
WHERE qc.name = 'Nigerian Legal System';

INSERT INTO questions (category_id, level, difficulty, question_text, options, correct_answer, explanation, source) 
SELECT 
    qc.id,
    '100L',
    'medium',
    'In legal research, what does the doctrine of judicial precedent mean?',
    '["Judges can make new laws", "Lower courts must follow decisions of higher courts", "Only Supreme Court decisions matter", "Precedents can never be overturned"]',
    1,
    'The doctrine of stare decisis (judicial precedent) means that lower courts are bound to follow the decisions of higher courts in similar cases.',
    'Legal Methods'
FROM question_categories qc 
WHERE qc.name = 'Legal Methods';

INSERT INTO questions (category_id, level, difficulty, question_text, scenario, options, correct_answer, explanation, source) 
SELECT 
    qc.id,
    '200L',
    'medium',
    'Which of the following is a valid contract?',
    'John promised to pay N50,000 to Mary if she paints his house. Mary orally agreed and started painting.',
    '["Invalid - no written agreement", "Valid - consideration exists", "Invalid - insufficient consideration", "Valid - only if witnessed"]',
    1,
    'A contract is valid if there is offer, acceptance, consideration, and intention to create legal relations. Writing is not always required.',
    'Contract Law'
FROM question_categories qc 
WHERE qc.name = 'Contract Law';

INSERT INTO questions (category_id, level, difficulty, question_text, options, correct_answer, explanation, source) 
SELECT 
    qc.id,
    '200L',
    'hard',
    'Under the Nigerian Constitution, which section guarantees the right to life?',
    '["Section 30", "Section 32", "Section 33", "Section 35"]',
    2,
    'Section 33 of the Constitution of the Federal Republic of Nigeria 1999 (as amended) guarantees the fundamental right to life.',
    'Constitution 1999, Section 33'
FROM question_categories qc 
WHERE qc.name = 'Constitutional Law';

INSERT INTO questions (category_id, level, difficulty, question_text, scenario, options, correct_answer, explanation, source) 
SELECT 
    qc.id,
    '300L',
    'hard',
    'What offense, if any, has John committed?',
    'John broke into a house at night with a gun intending to steal. He was caught before taking anything.',
    '["Theft", "Robbery", "Burglary", "No offense - attempt only"]',
    2,
    'Breaking into a dwelling house at night with intent to commit a felony constitutes burglary under Section 411 of the Criminal Code.',
    'Criminal Code, Section 411'
FROM question_categories qc 
WHERE qc.name = 'Criminal Law';

-- Add more questions in batches
INSERT INTO questions (category_id, level, difficulty, question_text, options, correct_answer, explanation, source) VALUES
-- Legal Methods (100L)
((SELECT id FROM question_categories WHERE name = 'Legal Methods'), '100L', 'easy', 'What does the Latin term "ratio decidendi" mean?', '["The reason for the decision", "The facts of the case", "The judgment itself", "The dissenting opinion"]', 0, 'Ratio decidendi is the legal principle or reasoning upon which a court decision is based.', 'Legal Methods'),
((SELECT id FROM question_categories WHERE name = 'Legal Methods'), '100L', 'medium', 'Which of the following is NOT a primary source of law?', '["Statutes", "Case law", "Textbooks", "Constitution"]', 2, 'Textbooks are secondary sources. Primary sources are statutes, case law, and constitutions.', 'Legal Methods'),

-- Constitutional Law (200L)
((SELECT id FROM question_categories WHERE name = 'Constitutional Law'), '200L', 'easy', 'How many tiers of government are recognized in the Nigerian Constitution?', '["2", "3", "4", "5"]', 1, 'The Constitution recognizes three tiers: Federal, State, and Local Government.', 'Constitution 1999, Section 2'),
((SELECT id FROM question_categories WHERE name = 'Constitutional Law'), '200L', 'medium', 'What is the maximum tenure for a President under the 1999 Constitution?', '["4 years", "5 years", "8 years (2 terms)", "10 years"]', 2, 'Section 137 limits the President to two terms of four years each, totaling 8 years maximum.', 'Constitution 1999, Section 137'),

-- Contract Law (200L)
((SELECT id FROM question_categories WHERE name = 'Contract Law'), '200L', 'easy', 'What is the legal term for something of value exchanged in a contract?', '["Offer", "Acceptance", "Consideration", "Intention"]', 2, 'Consideration is something of value that is exchanged between parties to a contract.', 'Contract Law'),
((SELECT id FROM question_categories WHERE name = 'Contract Law'), '200L', 'medium', 'A contract entered into under duress is:', '["Valid and enforceable", "Void", "Voidable", "Illegal"]', 2, 'Contracts entered under duress are voidable at the option of the party subjected to duress.', 'Contract Law');

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_questions_category ON questions(category_id);
CREATE INDEX idx_questions_level ON questions(level);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_active ON questions(is_active);
CREATE INDEX idx_cbt_attempts_user ON cbt_attempts(user_id);
CREATE INDEX idx_cbt_attempts_date ON cbt_attempts(completed_at);
CREATE INDEX idx_materials_course ON materials(course_id);
CREATE INDEX idx_materials_active ON materials(is_active);
CREATE INDEX idx_user_progress_user ON user_material_progress(user_id);
CREATE INDEX idx_user_progress_material ON user_material_progress(material_id);
CREATE INDEX idx_study_sessions_user ON study_sessions(user_id);
CREATE INDEX idx_study_sessions_time ON study_sessions(start_time);
CREATE INDEX idx_activity_user ON user_activity_log(user_id);
CREATE INDEX idx_activity_type ON user_activity_log(activity_type);
CREATE INDEX idx_activity_date ON user_activity_log(created_at);

-- Success message
SELECT 'Database schema created successfully!' AS status;
