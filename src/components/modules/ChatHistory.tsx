import React, { useEffect, useState } from 'react';
import { Search, MessageSquare, Clock, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
interface ChatSession {
  id: string;
  title: string;
  messages: any[];
  createdAt: Date;
  lastUpdated: Date;
}
export function ChatHistory() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    loadSessions();
  }, [user?.id]);
  const loadSessions = () => {
    if (!user?.id) return;
    const stored = localStorage.getItem(`gabai_chat_sessions_${user.id}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setSessions(parsed.map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        lastUpdated: new Date(s.lastUpdated)
      })));
    }
  };
  const deleteSession = (sessionId: string) => {
    if (confirm('Delete this conversation?')) {
      const newSessions = sessions.filter(s => s.id !== sessionId);
      localStorage.setItem(`gabai_chat_sessions_${user?.id}`, JSON.stringify(newSessions));
      setSessions(newSessions);
    }
  };
  const filteredSessions = sessions.filter(session => session.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };
  return <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Chat History
          </h2>
          <p className="text-sm text-muted-foreground">
            Review your past conversations with GabAi.
          </p>
        </div>
        <div className="w-full sm:w-72">
          <Input placeholder="Search conversations..." icon={<Search className="h-4 w-4" />} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredSessions.length > 0 ? filteredSessions.map((session, index) => <motion.div key={session.id} initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: index * 0.05
      }}>
              <Card className="cursor-pointer group transition-shadow hover:shadow-lg" onClick={() => navigate('/dashboard/chatbot')}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold truncate pr-4">
                        {session.title}
                      </h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                        <Clock className="h-3 w-3" />{' '}
                        {formatDate(session.lastUpdated)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {session.messages.length} messages
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => {
              e.stopPropagation();
              deleteSession(session.id);
            }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>) : <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No conversations yet</p>
            <Button className="mt-4" onClick={() => navigate('/dashboard/chatbot')}>
              Start a Conversation
            </Button>
          </div>}
      </div>
    </div>;
}