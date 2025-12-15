import React, { useState } from 'react';
import { Search, MessageSquare, Clock, Trash2, Plus } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../contexts/ChatContext';
export function ChatHistory() {
  const navigate = useNavigate();
  const {
    sessions,
    loadSession,
    deleteSession,
    createNewSession
  } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const handleNewChat = () => {
    createNewSession();
    navigate('/dashboard/chatbot');
  };
  const handleSessionClick = (sessionId: string) => {
    loadSession(sessionId);
    navigate('/dashboard/chatbot');
  };
  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (confirm('Delete this conversation?')) {
      deleteSession(sessionId);
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
        <Button onClick={handleNewChat} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      <div className="w-full sm:w-72">
        <Input placeholder="Search conversations..." icon={<Search className="h-4 w-4" />} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filteredSessions.length > 0 ? filteredSessions.map((session, index) => <motion.div key={session.id} initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          x: -20
        }} transition={{
          delay: index * 0.05
        }} layout>
                <Card className="cursor-pointer group transition-all hover:shadow-lg hover:scale-[1.01]" onClick={() => handleSessionClick(session.id)}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <motion.div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors" whileHover={{
                scale: 1.1
              }} whileTap={{
                scale: 0.95
              }}>
                      <MessageSquare className="h-6 w-6" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold truncate pr-4">
                          {session.title}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(session.lastUpdated)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {session.messages.length} messages
                      </p>
                    </div>
                    <motion.div initial={{
                opacity: 0
              }} whileHover={{
                opacity: 1
              }} className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={e => handleDeleteSession(e, session.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>) : <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="text-center py-12 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No conversations yet</p>
              <Button className="mt-4" onClick={handleNewChat}>
                Start a Conversation
              </Button>
            </motion.div>}
        </AnimatePresence>
      </div>
    </div>;
}