import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

// ============================================
// QUESTIONS API
// ============================================

export interface Question {
  id: string;
  category_id: string;
  level: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question_text: string;
  scenario?: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
  source?: string;
}

export interface QuestionCategory {
  id: string;
  name: string;
  description?: string;
  level?: string;
}

export async function getQuestions(filters?: {
  level?: string;
  category?: string;
  difficulty?: string;
  limit?: number;
}) {
  let query = supabase
    .from('questions')
    .select(`
      *,
      category:question_categories(id, name)
    `)
    .eq('is_active', true);

  if (filters?.level) {
    query = query.eq('level', filters.level);
  }
  if (filters?.category) {
    query = query.eq('category_id', filters.category);
  }
  if (filters?.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data as Question[];
}

export async function getRandomQuestions(level: string, count: number = 10) {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('level', level)
    .eq('is_active', true)
    .order('id', { ascending: false })
    .limit(count);

  if (error) throw error;
  
  // Shuffle the questions
  const shuffled = [...(data || [])].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count) as Question[];
}

export async function getQuestionCategories() {
  const { data, error } = await supabase
    .from('question_categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data as QuestionCategory[];
}

// ============================================
// CBT ATTEMPTS API
// ============================================

export interface CBTAttempt {
  id: string;
  user_id: string;
  category_id?: string;
  level: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  time_taken_seconds?: number;
  questions_data: {
    question_id: string;
    selected_answer: number;
    correct_answer: number;
    is_correct: boolean;
  }[];
  completed_at: string;
}

export async function saveCBTAttempt(attempt: Omit<CBTAttempt, 'id' | 'completed_at'>) {
  const { data, error } = await supabase
    .from('cbt_attempts')
    .insert([attempt])
    .select()
    .single();

  if (error) throw error;
  return data as CBTAttempt;
}

export async function getUserCBTAttempts(userId: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('cbt_attempts')
    .select(`
      *,
      category:question_categories(name)
    `)
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as (CBTAttempt & { category: { name: string } })[];
}

export async function getUserCBTAverage(userId: string, level?: string) {
  let query = supabase
    .from('cbt_attempts')
    .select('score, total_questions')
    .eq('user_id', userId);

  if (level) {
    query = query.eq('level', level);
  }

  const { data, error } = await query;

  if (error) throw error;
  if (!data || data.length === 0) return 0;

  const totalScore = data.reduce((acc, curr) => acc + (curr.score / curr.total_questions) * 100, 0);
  return Math.round(totalScore / data.length);
}

// ============================================
// COURSES API
// ============================================

export interface Course {
  id: string;
  code: string;
  title: string;
  level: string;
  description?: string;
  modules_count: number;
  duration_weeks?: number;
}

export async function getCourses(level?: string) {
  let query = supabase
    .from('courses')
    .select('*')
    .eq('is_active', true)
    .order('code');

  if (level) {
    query = query.eq('level', level);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Course[];
}

export async function getCourseById(courseId: string) {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();

  if (error) throw error;
  return data as Course;
}

// ============================================
// MATERIALS API
// ============================================

export interface Material {
  id: string;
  course_id: string;
  title: string;
  type: 'pdf' | 'video' | 'text' | 'audio';
  file_url?: string;
  file_size_bytes?: number;
  content?: string;
  duration_minutes?: number;
  order_index: number;
  is_premium: boolean;
}

export interface UserMaterialProgress {
  id: string;
  user_id: string;
  material_id: string;
  progress_percentage: number;
  last_position: number;
  completed: boolean;
  completed_at?: string;
  started_at: string;
  last_accessed_at: string;
}

export async function getMaterialsByCourse(courseId: string) {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('course_id', courseId)
    .eq('is_active', true)
    .order('order_index');

  if (error) throw error;
  return data as Material[];
}

export async function getUserMaterialProgress(userId: string, materialId: string) {
  const { data, error } = await supabase
    .from('user_material_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('material_id', materialId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as UserMaterialProgress | null;
}

export async function updateMaterialProgress(
  userId: string,
  materialId: string,
  progress: {
    progress_percentage: number;
    last_position: number;
    completed?: boolean;
  }
) {
  const { data, error } = await supabase
    .from('user_material_progress')
    .upsert({
      user_id: userId,
      material_id: materialId,
      ...progress,
      completed_at: progress.completed ? new Date().toISOString() : undefined,
      last_accessed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as UserMaterialProgress;
}

// ============================================
// STUDY SESSIONS API
// ============================================

export interface StudySession {
  id: string;
  user_id: string;
  session_type: 'reading' | 'cbt' | 'video' | 'practice';
  material_id?: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
}

export async function startStudySession(
  userId: string,
  sessionType: StudySession['session_type'],
  materialId?: string
) {
  const { data, error } = await supabase
    .from('study_sessions')
    .insert([{
      user_id: userId,
      session_type: sessionType,
      material_id: materialId,
      start_time: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return data as StudySession;
}

export async function endStudySession(sessionId: string) {
  const { data: session, error: fetchError } = await supabase
    .from('study_sessions')
    .select('start_time')
    .eq('id', sessionId)
    .single();

  if (fetchError || !session) throw fetchError || new Error('Session not found');

  const endTime = new Date();
  const startTime = new Date(session.start_time);
  const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

  const { data, error } = await supabase
    .from('study_sessions')
    .update({
      end_time: endTime.toISOString(),
      duration_minutes: durationMinutes,
    })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data as StudySession;
}

export async function getUserStudyStats(userId: string) {
  try {
    // Get total study hours
    const { data: sessions, error: sessionsError } = await supabase
      .from('study_sessions')
      .select('duration_minutes')
      .eq('user_id', userId)
      .not('duration_minutes', 'is', null);

    if (sessionsError) {
      console.warn('Error fetching study sessions:', sessionsError);
    }

    const totalMinutes = (sessions || []).reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0);
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

    // Get current streak
    const { data: streak, error: streakError } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (streakError && streakError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.warn('Error fetching user streaks:', streakError);
    }

    return {
      totalHours,
      currentStreak: streak?.current_streak || 0,
      longestStreak: streak?.longest_streak || 0,
    };
  } catch (error) {
    console.error('Error in getUserStudyStats:', error);
    return {
      totalHours: 0,
      currentStreak: 0,
      longestStreak: 0,
    };
  }
}

// ============================================
// USER STATS API
// ============================================

export async function getUserDashboardStats(userId: string, level: string) {
  try {
    const [studyStats, cbtAverage, materialsProgress, attempts] = await Promise.all([
      getUserStudyStats(userId),
      getUserCBTAverage(userId, level),
      getUserMaterialsProgress(userId),
      getUserCBTAttempts(userId, 1),
    ]);

    return {
      studyHours: studyStats.totalHours,
      cbtAverage,
      modulesRead: materialsProgress.completed,
      totalModules: materialsProgress.total,
      streak: studyStats.currentStreak,
      longestStreak: studyStats.longestStreak,
      lastAttempt: attempts[0] || null,
    };
  } catch (error) {
    console.error('Error in getUserDashboardStats:', error);
    // Return default values if there's an error
    return {
      studyHours: 0,
      cbtAverage: 0,
      modulesRead: 0,
      totalModules: 0,
      streak: 0,
      longestStreak: 0,
      lastAttempt: null,
    };
  }
}

async function getUserMaterialsProgress(userId: string) {
  const { data, error } = await supabase
    .from('user_material_progress')
    .select('completed')
    .eq('user_id', userId);

  if (error) throw error;

  const completed = (data || []).filter(p => p.completed).length;
  return { completed, total: data?.length || 0 };
}

// ============================================
// ACTIVITY LOGGING
// ============================================

export async function logUserActivity(
  userId: string,
  activityType: string,
  details?: Record<string, any>
) {
  try {
    const { error } = await supabase
      .from('user_activity_log')
      .insert([{
        user_id: userId,
        activity_type: activityType,
        details,
        created_at: new Date().toISOString(),
      }]);

    if (error) {
      console.warn('Error logging user activity:', error);
      // Don't throw - activity logging should not break the app
    }
  } catch (error) {
    console.warn('Error in logUserActivity:', error);
    // Silently fail - activity logging is not critical
  }
}

// ============================================
// STATUTES & CASE LAW
// ============================================

export interface Statute {
  id: string;
  title: string;
  short_title?: string;
  category: string;
  year?: number;
  sections_count?: number;
  full_text?: string;
}

export async function getStatutes(category?: string) {
  let query = supabase
    .from('statutes')
    .select('*')
    .eq('is_active', true)
    .order('title');

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Statute[];
}

export async function getStatuteById(id: string) {
  const { data, error } = await supabase
    .from('statutes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Statute;
}

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================

export function subscribeToUserProgress(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel('user-progress')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_material_progress',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
}

export function subscribeToCBTAttempts(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel('cbt-attempts')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'cbt_attempts',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
}

// ============================================
// CBT PROGRESS (PAUSE/RESUME) API
// ============================================

export interface CBTProgress {
  id: string;
  user_id: string;
  course_id: string;
  level: string;
  questions: {
    question_id: string;
    question_text: string;
    options: string[];
    selected_answer: number | null;
    correct_answer: number;
    is_answered: boolean;
  }[];
  current_question_index: number;
  time_remaining_seconds: number;
  started_at: string;
  last_updated_at: string;
  is_completed: boolean;
}

export async function saveCBTProgress(
  userId: string,
  courseId: string,
  level: string,
  questions: any[],
  currentIndex: number,
  timeRemaining: number
) {
  const { data, error } = await supabase
    .from('cbt_progress')
    .upsert({
      user_id: userId,
      course_id: courseId,
      level: level,
      questions: questions,
      current_question_index: currentIndex,
      time_remaining_seconds: timeRemaining,
      is_completed: false,
    }, {
      onConflict: 'user_id,course_id'
    })
    .select()
    .single();

  if (error) throw error;
  return data as CBTProgress;
}

export async function getActiveCBTProgress(userId: string): Promise<CBTProgress | null> {
  const { data, error } = await supabase
    .from('cbt_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('is_completed', false)
    .order('last_updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as CBTProgress | null;
}

export async function getCBTProgressByCourse(userId: string, courseId: string): Promise<CBTProgress | null> {
  const { data, error } = await supabase
    .from('cbt_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .eq('is_completed', false)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as CBTProgress | null;
}

export async function deleteCBTProgress(progressId: string) {
  const { error } = await supabase
    .from('cbt_progress')
    .delete()
    .eq('id', progressId);

  if (error) throw error;
}

export async function markCBTProgressAsCompleted(progressId: string) {
  const { error } = await supabase
    .from('cbt_progress')
    .update({ is_completed: true })
    .eq('id', progressId);

  if (error) throw error;
}

export async function getQuestionsByCourse(courseId: string, limit: number = 20) {
  // Get course level first
  const { data: course } = await supabase
    .from('courses')
    .select('level, code')
    .eq('id', courseId)
    .single();

  if (!course) throw new Error('Course not found');

  // Get questions for that level
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('level', course.level)
    .eq('is_active', true)
    .limit(limit);

  if (error) throw error;
  
  // Shuffle questions
  const shuffled = [...(data || [])].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit) as Question[];
}

// ============================================
// CHAT HISTORY API
// ============================================

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'user' | 'model';
  content: string;
  citations?: any[];
  created_at: string;
}

export async function getChatConversations(userId: string): Promise<ChatConversation[]> {
  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createChatConversation(userId: string, title: string): Promise<ChatConversation> {
  const { data, error } = await supabase
    .from('chat_conversations')
    .insert({
      user_id: userId,
      title: title.slice(0, 100), // Limit title length
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateConversationTitle(conversationId: string, title: string) {
  const { error } = await supabase
    .from('chat_conversations')
    .update({ title: title.slice(0, 100), updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  if (error) throw error;
}

export async function deleteChatConversation(conversationId: string) {
  const { error } = await supabase
    .from('chat_conversations')
    .delete()
    .eq('id', conversationId);

  if (error) throw error;
}

export async function getChatMessages(conversationId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function saveChatMessage(
  conversationId: string,
  userId: string,
  role: 'user' | 'model',
  content: string,
  citations?: any[]
): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      conversation_id: conversationId,
      user_id: userId,
      role,
      content,
      citations: citations || [],
    })
    .select()
    .single();

  if (error) throw error;
  
  // Update the conversation's updated_at timestamp
  await supabase
    .from('chat_conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);
  
  return data;
}

export async function deleteChatMessage(messageId: string) {
  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('id', messageId);

  if (error) throw error;
}
