import React, { useEffect, useState, useRef, Component } from 'react';
import { Send, Paperclip, Mic, X, Download, ChevronDown, Pause, Play, FileText, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
interface Message {
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
interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastUpdated: Date;
}
// Dedicated Image Component for sophisticated loading and hover effects
const ChatImage = ({
  src,
  alt,
  onClick
}: {
  src: string;
  alt: string;
  onClick: () => void;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return <motion.div className="relative overflow-hidden rounded-xl cursor-pointer group" style={{
    maxWidth: '400px',
    maxHeight: '300px'
  }} whileHover={{
    scale: 1.02
  }} transition={{
    duration: 0.3,
    ease: 'easeOut'
  }} onClick={onClick}>
      {/* Blur placeholder background */}
      <div className="absolute inset-0 bg-muted/20 backdrop-blur-xl" />

      <motion.img src={src} alt={alt} onLoad={() => setIsLoaded(true)} initial={{
      opacity: 0,
      filter: 'blur(10px)'
    }} animate={{
      opacity: isLoaded ? 1 : 0,
      filter: isLoaded ? 'blur(0px)' : 'blur(10px)'
    }} transition={{
      duration: 0.5
    }} className="w-full h-full object-cover shadow-sm group-hover:shadow-md transition-shadow duration-300" style={{
      maxHeight: '300px',
      width: 'auto',
      objectFit: 'cover'
    }} />

      {/* Hover overlay hint */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
    </motion.div>;
};
const getMockResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  if (lowerMessage.includes('engineering') || lowerMessage.includes('college')) {
    return 'The College of Engineering is located in the East Wing, Building C. It offers programs in Civil, Mechanical, Electrical, and Electronics Engineering. Would you like to know more about specific programs?';
  }
  if (lowerMessage.includes('scholarship') || lowerMessage.includes('financial')) {
    return 'NEMSU offers several scholarship programs including Academic Excellence, Sports Scholarship, and CHED Tulong Dunong. You can view detailed requirements in the Scholarships section.';
  }
  if (lowerMessage.includes('course') || lowerMessage.includes('program')) {
    return 'NEMSU offers various undergraduate and graduate programs across different colleges. Popular programs include BS Computer Science, BS Civil Engineering, and BS Education.';
  }
  if (lowerMessage.includes('map') || lowerMessage.includes('location') || lowerMessage.includes('where')) {
    return 'I can help you find locations on campus! The interactive Campus Map shows all major buildings including the Library, Student Center, and various college buildings.';
  }
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! I'm GabAi, your NEMSU AI Assistant. I can help you with information about courses, scholarships, campus locations, and more. What would you like to know?";
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
    type: 'image' | 'file' | 'audio';
    url: string;
    name: string;
    duration?: number;
  }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const currentSession = sessions.find(s => s.id === currentSessionId);
  // Load sessions
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
  // Save sessions
  useEffect(() => {
    if (!user?.id || sessions.length === 0) return;
    try {
      localStorage.setItem(`gabai_chat_sessions_${user.id}`, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving chat sessions:', error);
    }
  }, [sessions, user?.id]);
  // Scroll handling
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, isTyping]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
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
  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    processFiles(Array.from(files));
  };
  const processFiles = (files: File[]) => {
    files.forEach(file => {
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
  // Voice recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm'
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAttachments(prev => [...prev, {
          type: 'audio',
          url: audioUrl,
          name: 'Voice message',
          duration: recordingTime
        }]);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };
  const startVoiceToText = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }
    try {
      recognitionRef.current.start();
      setIsTranscribing(true);
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  };
  const stopVoiceToText = () => {
    if (recognitionRef.current && isTranscribing) {
      recognitionRef.current.stop();
      setIsTranscribing(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };
  const toggleMicMode = () => {
    if (isRecording) {
      stopRecording();
    } else if (isTranscribing) {
      stopVoiceToText();
    } else {
      startVoiceToText();
    }
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
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        if (finalTranscript) {
          setInputValue(prev => prev + finalTranscript);
        }
      };
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsTranscribing(false);
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
        }
      };
      recognitionRef.current.onend = () => {
        setIsTranscribing(false);
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
        }
      };
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  if (!user) {
    return <div className="flex items-center justify-center h-[calc(100vh-140px)]">
        <p className="text-muted-foreground">
          Please log in to use the chatbot.
        </p>
      </div>;
  }
  return <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto relative" onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      {/* Drag overlay */}
      <AnimatePresence>
        {isDragging && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm border-2 border-dashed border-primary rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Paperclip className="h-12 w-12 mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium">Drop files here</p>
              <p className="text-sm text-muted-foreground">
                Images, documents, and more
              </p>
            </div>
          </motion.div>}
      </AnimatePresence>

      {/* Messages Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {currentSession?.messages.map((message, index) => <motion.div key={message.id} initial={{
            opacity: 0,
            y: 5
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.2
          }} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                  {message.attachments && message.attachments.length > 0 && <div className={`flex flex-col gap-2 w-full ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      {message.attachments.map((att, i) => <div key={i} className="overflow-hidden">
                          {att.type === 'image' ? <ChatImage src={att.url} alt={att.name} onClick={() => setLightboxImage(att.url)} /> : att.type === 'audio' ? <div className="flex items-center gap-3 bg-muted rounded-lg p-3 min-w-[200px] border border-border">
                              <button onClick={() => setPlayingAudio(playingAudio === att.url ? null : att.url)} className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                                {playingAudio === att.url ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                              </button>
                              <div className="flex-1">
                                <div className="h-1 bg-primary/20 rounded-full overflow-hidden">
                                  <div className="h-full bg-primary w-0" />
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(att.duration || 0)}
                              </span>
                            </div> : <div className="flex items-center gap-3 bg-card rounded-lg p-3 border border-border shadow-sm max-w-xs">
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {att.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Attachment
                                </p>
                              </div>
                              <button className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                                <Download className="h-4 w-4" />
                              </button>
                            </div>}
                        </div>)}
                    </div>}
                  {message.text && <div className={`rounded-2xl px-5 py-3.5 shadow-sm ${message.sender === 'bot' ? 'bg-card border border-border text-foreground rounded-tl-none' : 'bg-primary text-primary-foreground rounded-tr-none'}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                    </div>}
                  <span className="text-[10px] text-muted-foreground px-1 opacity-70">
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
          y: 5
        }} animate={{
          opacity: 1,
          y: 0
        }} className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl rounded-tl-none px-5 py-4 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{
                animationDelay: '0ms'
              }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{
                animationDelay: '150ms'
              }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{
                animationDelay: '300ms'
              }} />
                </div>
              </div>
            </motion.div>}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && <motion.button initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: 10
      }} onClick={scrollToBottom} className="absolute bottom-24 right-4 h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors z-10">
            <ChevronDown className="h-5 w-5" />
          </motion.button>}
      </AnimatePresence>

      {/* Input Area */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm p-4">
        {attachments.length > 0 && <div className="flex flex-wrap gap-2 mb-3">
            {attachments.map((att, i) => <div key={i} className="relative group animate-in fade-in zoom-in duration-200">
                {att.type === 'image' ? <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-border">
                    <img src={att.url} alt={att.name} className="h-full w-full object-cover" />
                  </div> : att.type === 'audio' ? <div className="flex items-center gap-2 p-2 h-16 rounded-lg bg-muted border border-border min-w-[120px]">
                    <Mic className="h-4 w-4 text-primary" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-medium truncate">
                        Voice Note
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatTime(att.duration || 0)}
                      </span>
                    </div>
                  </div> : <div className="flex items-center gap-2 p-2 h-16 rounded-lg bg-muted border border-border min-w-[120px]">
                    <FileText className="h-4 w-4 text-primary" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-medium truncate max-w-[100px]">
                        {att.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        File
                      </span>
                    </div>
                  </div>}
                <button onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <X className="h-3 w-3" />
                </button>
              </div>)}
          </div>}

        {(isRecording || isTranscribing) && <div className={`flex items-center gap-3 mb-3 p-3 rounded-lg border ${isTranscribing ? 'bg-primary/10 border-primary/20' : 'bg-destructive/10 border-destructive/20'}`}>
            <div className={`h-3 w-3 rounded-full animate-pulse ${isTranscribing ? 'bg-primary' : 'bg-destructive'}`} />
            <span className={`text-sm font-medium ${isTranscribing ? 'text-primary' : 'text-destructive'}`}>
              {isTranscribing ? 'Listening...' : 'Recording...'}
            </span>
            <span className="text-sm text-muted-foreground ml-auto font-mono">
              {formatTime(recordingTime)}
            </span>
          </div>}

        <div className="flex gap-2 items-end">
          <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" />

          <div className="flex gap-1">
            <button onClick={() => fileInputRef.current?.click()} disabled={isTyping || isRecording || isTranscribing} className="h-10 w-10 shrink-0 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center justify-center disabled:opacity-50" title="Attach file">
              <Paperclip className="h-5 w-5" />
            </button>

            <button onClick={toggleMicMode} disabled={isTyping} className={`h-10 w-10 shrink-0 rounded-full transition-colors flex items-center justify-center disabled:opacity-50 ${isTranscribing ? 'bg-primary text-primary-foreground animate-pulse' : isRecording ? 'bg-destructive text-destructive-foreground animate-pulse' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} title={isTranscribing ? 'Stop transcribing' : isRecording ? 'Stop recording' : 'Start voice-to-text'}>
              <Mic className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 bg-muted/50 rounded-2xl border border-transparent focus-within:border-primary/20 focus-within:bg-background transition-all">
            <textarea value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your message..." className="w-full min-h-[44px] max-h-32 rounded-2xl bg-transparent px-4 py-3 text-sm resize-none focus:outline-none" disabled={isTyping || isRecording || isTranscribing} rows={1} style={{
            height: 'auto',
            minHeight: '44px'
          }} onInput={e => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
          }} />
          </div>

          <button onClick={handleSend} disabled={!inputValue.trim() && attachments.length === 0 || isTyping || isRecording || isTranscribing} className="h-10 w-10 shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Enhanced Lightbox */}
      <AnimatePresence>
        {lightboxImage && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.2
      }} onClick={() => setLightboxImage(null)} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-10">
            <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }} transition={{
          type: 'spring',
          damping: 25,
          stiffness: 300
        }} className="relative max-w-full max-h-full" onClick={e => e.stopPropagation()}>
              <img src={lightboxImage} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
              <button onClick={() => setLightboxImage(null)} className="absolute -top-12 right-0 md:-right-12 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors backdrop-blur-md">
                <X className="h-6 w-6" />
              </button>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </div>;
}