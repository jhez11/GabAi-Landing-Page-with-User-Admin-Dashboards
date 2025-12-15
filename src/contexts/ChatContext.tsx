import React, { useCallback, useEffect, useState, createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  attachments?: Array<{
    type: 'image' | 'file' | 'audio';
    url: string;
    name: string;
    duration?: number;
  }>;
}
export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastUpdated: Date;
}
interface ChatContextType {
  sessions: ChatSession[];
  currentSessionId: string | null;
  currentSession: ChatSession | null;
  isLoading: boolean;
  loadSession: (id: string) => void;
  createNewSession: () => string;
  updateSessionTitle: (id: string, title: string) => void;
  deleteSession: (id: string) => void;
  addMessage: (message: Message) => void;
  clearCurrentSession: () => void;
}
const ChatContext = createContext<ChatContextType | undefined>(undefined);
export function ChatProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const {
    user
  } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Load sessions from localStorage on mount
  useEffect(() => {
    if (!user?.id) return;
    const loadSessions = () => {
      try {
        const stored = localStorage.getItem(`gabai_chat_sessions_${user.id}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          const sessionsWithDates = parsed.map((s: any) => ({
            ...s,
            createdAt: new Date(s.createdAt),
            lastUpdated: new Date(s.lastUpdated),
            messages: s.messages.map((m: any) => ({
              ...m,
              timestamp: new Date(m.timestamp)
            }))
          }));
          setSessions(sessionsWithDates);
          // Load the most recent session by default
          if (sessionsWithDates.length > 0 && !currentSessionId) {
            setCurrentSessionId(sessionsWithDates[0].id);
          }
        } else {
          // Create initial session if none exist
          const newSessionId = createInitialSession();
          setCurrentSessionId(newSessionId);
        }
      } catch (error) {
        console.error('Error loading chat sessions:', error);
        const newSessionId = createInitialSession();
        setCurrentSessionId(newSessionId);
      }
    };
    loadSessions();
  }, [user?.id]);
  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (!user?.id || sessions.length === 0) return;
    try {
      localStorage.setItem(`gabai_chat_sessions_${user.id}`, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving chat sessions:', error);
    }
  }, [sessions, user?.id]);
  const createInitialSession = (): string => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [{
        id: '1',
        text: "Hello! I'm GabAi, your NEMSU AI Assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      }],
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    setSessions([newSession]);
    return newSession.id;
  };
  const createNewSession = useCallback((): string => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [{
        id: '1',
        text: "Hello! I'm GabAi, your NEMSU AI Assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      }],
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  }, []);
  const loadSession = useCallback((id: string) => {
    setIsLoading(true);
    // Simulate loading delay for smooth transition
    setTimeout(() => {
      setCurrentSessionId(id);
      setIsLoading(false);
    }, 150);
  }, []);
  const updateSessionTitle = useCallback((id: string, title: string) => {
    setSessions(prev => prev.map(session => session.id === id ? {
      ...session,
      title,
      lastUpdated: new Date()
    } : session));
  }, []);
  const deleteSession = useCallback((id: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      // If deleting current session, switch to another
      if (id === currentSessionId) {
        if (filtered.length > 0) {
          setCurrentSessionId(filtered[0].id);
        } else {
          // Create new session if none left
          const newSessionId = createInitialSession();
          setCurrentSessionId(newSessionId);
        }
      }
      return filtered;
    });
  }, [currentSessionId]);
  const addMessage = useCallback((message: Message) => {
    if (!currentSessionId) return;
    setSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        const updatedMessages = [...session.messages, message];
        // Auto-update title from first user message
        const title = session.messages.length === 1 && message.sender === 'user' ? message.text.slice(0, 50) + (message.text.length > 50 ? '...' : '') : session.title;
        return {
          ...session,
          messages: updatedMessages,
          title,
          lastUpdated: new Date()
        };
      }
      return session;
    }));
  }, [currentSessionId]);
  const clearCurrentSession = useCallback(() => {
    if (!currentSessionId) return;
    setSessions(prev => prev.map(session => session.id === currentSessionId ? {
      ...session,
      messages: [{
        id: Date.now().toString(),
        text: "Hello! I'm GabAi, your NEMSU AI Assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      }],
      title: 'New Conversation',
      lastUpdated: new Date()
    } : session));
  }, [currentSessionId]);
  const currentSession = sessions.find(s => s.id === currentSessionId) || null;
  return <ChatContext.Provider value={{
    sessions,
    currentSessionId,
    currentSession,
    isLoading,
    loadSession,
    createNewSession,
    updateSessionTitle,
    deleteSession,
    addMessage,
    clearCurrentSession
  }}>
      {children}
    </ChatContext.Provider>;
}
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};