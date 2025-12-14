import React, { useEffect, useState, useRef } from 'react';
import { Send, Bot, User as UserIcon, Loader2, Paperclip, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  attachments?: Array<{
    type: 'image' | 'file';
    url: string;
    name: string;
  }>;
}
interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastUpdated: Date;
}
const getMockResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  if (lowerMessage.includes('engineering') || lowerMessage.includes('college')) {
    return 'The College of Engineering is located in the East Wing, Building C. It offers programs in Civil, Mechanical, Electrical, and Electronics Engineering. Would you like to know more about specific programs?';
  }
  if (lowerMessage.includes('scholarship') || lowerMessage.includes('financial')) {
    return 'NEMSU offers several scholarship programs including Academic Excellence, Sports Scholarship, and CHED Tulong Dunong. You can view detailed requirements in the Scholarships section. Would you like me to guide you there?';
  }
  if (lowerMessage.includes('course') || lowerMessage.includes('program')) {
    return 'NEMSU offers various undergraduate and graduate programs across different colleges. Popular programs include BS Computer Science, BS Civil Engineering, and BS Education. You can explore all courses in the Courses section.';
  }
  if (lowerMessage.includes('map') || lowerMessage.includes('location') || lowerMessage.includes('where')) {
    return 'I can help you find locations on campus! The interactive Campus Map shows all major buildings including the Library, Student Center, and various college buildings. Would you like me to show you the map?';
  }
  if (lowerMessage.includes('enroll') || lowerMessage.includes('admission')) {
    return "For enrollment inquiries, you need to submit: High School Report Card (Form 138), Certificate of Good Moral Character, PSA Birth Certificate, and NCAE Result. The Registrar's Office is open Monday-Friday, 8AM-5PM.";
  }
  if (lowerMessage.includes('library') || lowerMessage.includes('book')) {
    return 'The NEMSU Library is open Monday-Saturday, 8AM-8PM. It offers study areas, computer labs, and a vast collection of books and digital resources. You can find it on the Campus Map.';
  }
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! I'm GabAi, your NEMSU AI Assistant. I can help you with information about courses, scholarships, campus locations, and more. What would you like to know?";
  }
  if (lowerMessage.includes('thank')) {
    return "You're welcome! Feel free to ask if you have any other questions about NEMSU. I'm here to help!";
  }
  return 'I can help you with information about NEMSU departments, courses, scholarships, campus locations, and enrollment. What specific information are you looking for?';
};
export function Chatbot() {
  const {
    user
  } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<Array<{
    type: 'image' | 'file';
    url: string;
    name: string;
  }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentSession = sessions.find(s => s.id === currentSessionId);
  // Load sessions from localStorage with error handling
  useEffect(() => {
    if (!user?.id) return;
    try {
      const stored = localStorage.getItem(`gabai_chat_sessions_${user.id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSessions(parsed);
        if (parsed.length > 0 && !currentSessionId) {
          setCurrentSessionId(parsed[0].id);
        }
      } else {
        createNewChat();
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      createNewChat();
    }
  }, [user?.id]);
  // Save sessions to localStorage with error handling
  useEffect(() => {
    if (!user?.id || sessions.length === 0) return;
    try {
      localStorage.setItem(`gabai_chat_sessions_${user.id}`, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving chat sessions:', error);
    }
  }, [sessions, user?.id]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [currentSession?.messages, isTyping]);
  const createNewChat = () => {
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
  };
  const deleteChat = (sessionId: string) => {
    if (confirm('Delete this conversation?')) {
      const newSessions = sessions.filter(s => s.id !== sessionId);
      setSessions(newSessions);
      if (currentSessionId === sessionId) {
        if (newSessions.length > 0) {
          setCurrentSessionId(newSessions[0].id);
        } else {
          createNewChat();
        }
      }
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const url = e.target?.result as string;
        if (url) {
          setAttachments(prev => [...prev, {
            type: file.type.startsWith('image/') ? 'image' : 'file',
            url,
            name: file.name
          }]);
        }
      };
      reader.onerror = () => {
        console.error('Error reading file:', file.name);
      };
      reader.readAsDataURL(file);
    });
  };
  const handleSend = async () => {
    if (!inputValue.trim() && attachments.length === 0) return;
    if (!currentSessionId) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };
    setSessions(prev => prev.map(session => session.id === currentSessionId ? {
      ...session,
      messages: [...session.messages, userMessage],
      title: session.messages.length === 1 ? inputValue.slice(0, 50) : session.title,
      lastUpdated: new Date()
    } : session));
    setInputValue('');
    setAttachments([]);
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: getMockResponse(inputValue),
      sender: 'bot',
      timestamp: new Date()
    };
    setIsTyping(false);
    setSessions(prev => prev.map(session => session.id === currentSessionId ? {
      ...session,
      messages: [...session.messages, botResponse],
      lastUpdated: new Date()
    } : session));
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  if (!user) {
    return <div className="flex items-center justify-center h-[calc(100vh-140px)]">
        <p className="text-muted-foreground">
          Please log in to use the chatbot.
        </p>
      </div>;
  }
  return <div className="flex h-[calc(100vh-140px)] gap-4 max-w-7xl mx-auto">
      {/* Chat Sessions Sidebar */}
      <div className="hidden md:flex w-64 flex-col gap-2">
        <Button onClick={createNewChat} className="w-full justify-start gap-2">
          <Plus className="h-4 w-4" /> New Chat
        </Button>
        <Card className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {sessions.map(session => <div key={session.id} className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${currentSessionId === session.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`} onClick={() => setCurrentSessionId(session.id)}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {session.title}
                  </p>
                  <p className="text-xs opacity-70">
                    {session.messages.length} messages
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={e => {
              e.stopPropagation();
              deleteChat(session.id);
            }}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>)}
          </div>
        </Card>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <h2 className="text-3xl font-bold tracking-tight">AI Assistant</h2>
          <p className="text-muted-foreground">Ask me anything about NEMSU!</p>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            <AnimatePresence initial={false}>
              {currentSession?.messages.map((message, index) => <motion.div key={message.id} initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: index * 0.02
            }} className={`flex gap-3 md:gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${message.sender === 'bot' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                    {message.sender === 'bot' ? <Bot size={20} /> : <UserIcon size={20} />}
                  </div>
                  <div className={`max-w-[75%] ${message.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                    {message.attachments && message.attachments.length > 0 && <div className="flex flex-wrap gap-2">
                        {message.attachments.map((att, i) => <div key={i} className="relative">
                            {att.type === 'image' ? <img src={att.url} alt={att.name} className="max-w-xs rounded-lg" /> : <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                                <Paperclip className="h-4 w-4" />
                                <span className="text-sm">{att.name}</span>
                              </div>}
                          </div>)}
                      </div>}
                    <div className={`rounded-2xl px-4 md:px-5 py-3 md:py-3.5 ${message.sender === 'bot' ? 'bg-muted text-foreground rounded-tl-none' : 'bg-primary text-primary-foreground rounded-tr-none'}`}>
                      <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground px-1">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                    </span>
                  </div>
                </motion.div>)}
            </AnimatePresence>

            {isTyping && <motion.div initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} className="flex gap-3 md:gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Bot size={20} />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-none px-5 py-4">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{
                  animationDelay: '0ms'
                }} />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{
                  animationDelay: '150ms'
                }} />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{
                  animationDelay: '300ms'
                }} />
                  </div>
                </div>
              </motion.div>}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4 md:p-6 bg-muted/20">
            {attachments.length > 0 && <div className="flex flex-wrap gap-2 mb-3">
                {attachments.map((att, i) => <div key={i} className="relative group">
                    {att.type === 'image' ? <img src={att.url} alt={att.name} className="h-20 w-20 object-cover rounded-lg" /> : <div className="flex items-center gap-2 p-2 rounded-lg bg-muted border border-border">
                        <Paperclip className="h-4 w-4" />
                        <span className="text-xs">{att.name}</span>
                      </div>}
                    <button onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      ×
                    </button>
                  </div>)}
              </div>}
            <div className="flex gap-2 md:gap-3">
              <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={handleFileSelect} className="hidden" />
              <Button variant="outline" size="icon" className="h-12 w-12 shrink-0" onClick={() => fileInputRef.current?.click()} disabled={isTyping}>
                <Paperclip className="h-5 w-5" />
              </Button>
              <textarea value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your message..." className="flex-1 min-h-[48px] max-h-32 rounded-lg border border-input bg-background px-4 py-3 text-sm md:text-base resize-none focus:outline-none focus:ring-2 focus:ring-ring" disabled={isTyping} rows={1} />
              <Button onClick={handleSend} disabled={!inputValue.trim() && attachments.length === 0 || isTyping} size="icon" className="h-12 w-12 shrink-0">
                {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Press Enter to send • Shift + Enter for new line
            </p>
          </div>
        </Card>
      </div>
    </div>;
}