import { supabase } from '@/lib/supabase'

export interface ChatMessage {
  id?: string
  role: 'user' | 'assistant'
  content: string
  created_at?: string
}

export async function loadChatHistory(userId: string, sessionId: string): Promise<ChatMessage[]> {
  const { data } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
    .limit(50)
  return (data ?? []) as ChatMessage[]
}

export async function saveChatMessage(
  userId: string,
  sessionId: string,
  role: 'user' | 'assistant',
  content: string
) {
  await supabase.from('chat_messages').insert({ user_id: userId, session_id: sessionId, role, content })
}

export async function listChatSessions(userId: string): Promise<{ session_id: string; last_message: string; created_at: string }[]> {
  const { data } = await supabase
    .from('chat_messages')
    .select('session_id, content, created_at')
    .eq('user_id', userId)
    .eq('role', 'user')
    .order('created_at', { ascending: false })

  const seen = new Set<string>()
  const sessions: { session_id: string; last_message: string; created_at: string }[] = []
  for (const row of data ?? []) {
    if (!seen.has(row.session_id)) {
      seen.add(row.session_id)
      sessions.push({ session_id: row.session_id, last_message: row.content.slice(0, 60), created_at: row.created_at })
    }
  }
  return sessions
}

export function newSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}
