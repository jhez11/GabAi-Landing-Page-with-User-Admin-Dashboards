import React, { useEffect, useState, useRef } from 'react';
import { Menu, Bell, X, BookOpen, Award, Megaphone, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
interface HeaderProps {
  toggleSidebar: () => void;
}
interface Notification {
  id: string;
  type: 'course' | 'scholarship' | 'announcement';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}
export function Header({
  toggleSidebar
}: HeaderProps) {
  const {
    user
  } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const stored = localStorage.getItem('gabai_notifications');
    if (stored) {
      return JSON.parse(stored).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      }));
    }
    // Default notifications
    return [{
      id: '1',
      type: 'course',
      title: 'New Course Available',
      message: 'BS Computer Science - Data Structures is now open for enrollment',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false
    }, {
      id: '2',
      type: 'scholarship',
      title: 'Scholarship Opportunity',
      message: 'Academic Excellence Scholarship applications are now open',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: false
    }, {
      id: '3',
      type: 'announcement',
      title: 'Campus Update',
      message: 'Library hours extended until 10 PM starting next week',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: false
    }];
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;
  useEffect(() => {
    localStorage.setItem('gabai_notifications', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? {
      ...n,
      read: true
    } : n));
  };
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({
      ...n,
      read: true
    })));
  };
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-4 w-4" />;
      case 'scholarship':
        return <Award className="h-4 w-4" />;
      case 'announcement':
        return <Megaphone className="h-4 w-4" />;
    }
  };
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };
  return <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold md:text-xl text-foreground">
          {user?.role === 'admin' ? 'Admin Portal' : 'Student Portal'}
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <Button variant="ghost" size="icon" className="relative hidden sm:flex" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background">
                {unreadCount}
              </span>}
          </Button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && <motion.div initial={{
            opacity: 0,
            y: -10,
            scale: 0.95
          }} animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }} exit={{
            opacity: 0,
            y: -10,
            scale: 0.95
          }} transition={{
            duration: 0.15
          }} className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg border border-border bg-card shadow-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && <button onClick={markAllAsRead} className="text-xs text-primary hover:underline">
                        Mark all read
                      </button>}
                    <button onClick={() => setShowNotifications(false)} className="h-6 w-6 rounded-full hover:bg-muted flex items-center justify-center">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length > 0 ? notifications.map(notification => <div key={notification.id} onClick={() => markAsRead(notification.id)} className={`p-4 border-b border-border last:border-0 cursor-pointer transition-colors ${notification.read ? 'bg-background hover:bg-muted/50' : 'bg-primary/5 hover:bg-primary/10'}`}>
                        <div className="flex gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${notification.type === 'course' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : notification.type === 'scholarship' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-medium text-sm">
                                {notification.title}
                              </h4>
                              {!notification.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />}
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {notification.message}
                            </p>
                            <span className="text-[10px] text-muted-foreground">
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>) : <div className="p-8 text-center text-sm text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                      <p>No notifications</p>
                    </div>}
                </div>
              </motion.div>}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-border">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
              {user?.email}
            </p>
          </div>
          <Avatar src={user?.avatar} fallback={user?.name || 'U'} size="md" />
        </div>
      </div>
    </header>;
}