import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Building2, GraduationCap, Award, Map, Settings, Users, Database, LogOut, ChevronLeft, ChevronRight, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isMobile?: boolean;
  onClose?: () => void;
}
export function Sidebar({
  isOpen,
  setIsOpen,
  isMobile = false,
  onClose
}: SidebarProps) {
  const {
    user,
    logout
  } = useAuth();
  const isAdmin = user?.role === 'admin';
  const userLinks = [{
    icon: Bot,
    label: 'AI Chatbot',
    to: '/dashboard/chatbot'
  }, {
    icon: MessageSquare,
    label: 'Chat History',
    to: '/dashboard/chat'
  }, {
    icon: Building2,
    label: 'Departments',
    to: '/dashboard/departments'
  }, {
    icon: GraduationCap,
    label: 'Courses',
    to: '/dashboard/courses'
  }, {
    icon: Award,
    label: 'Scholarships',
    to: '/dashboard/scholarships'
  }, {
    icon: Map,
    label: 'Campus Map',
    to: '/dashboard/map'
  }, {
    icon: Settings,
    label: 'Settings',
    to: '/dashboard/settings'
  }];
  const adminLinks = [{
    icon: LayoutDashboard,
    label: 'Admin Dashboard',
    to: '/admin'
  }, {
    icon: Users,
    label: 'User Management',
    to: '/admin/users'
  }, {
    icon: Building2,
    label: 'Manage Departments',
    to: '/admin/departments'
  }, {
    icon: GraduationCap,
    label: 'Manage Courses',
    to: '/admin/courses'
  }, {
    icon: Award,
    label: 'Manage Scholarships',
    to: '/admin/scholarships'
  }, {
    icon: Map,
    label: 'Manage Map',
    to: '/admin/map'
  }, {
    icon: Database,
    label: 'Database Upload',
    to: '/admin/upload'
  }];
  const links = isAdmin ? adminLinks : userLinks;
  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };
  const sidebarContent = <>
      {/* Logo Area */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            G
          </div>
          {isOpen && <motion.span initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="font-bold text-lg whitespace-nowrap">
              GabAi
            </motion.span>}
        </div>
        {isMobile ? <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
            <X className="h-4 w-4" />
          </Button> : <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="shrink-0">
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {links.map(link => <NavLink key={link.to} to={link.to} end={link.to === '/dashboard' || link.to === '/admin'} onClick={handleLinkClick} className={({
        isActive
      }) => `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}>
            <link.icon className="h-5 w-5 shrink-0" />
            {isOpen && <motion.span initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="truncate">
                {link.label}
              </motion.span>}
          </NavLink>)}
      </nav>

      {/* Footer / Logout */}
      <div className="border-t border-border p-4">
        <Button variant="ghost" className={`w-full justify-start ${!isOpen && 'justify-center px-0'}`} onClick={logout}>
          <LogOut className="h-5 w-5 shrink-0" />
          {isOpen && <span className="ml-3">Sign Out</span>}
        </Button>
      </div>
    </>;
  // Mobile sidebar (overlay)
  if (isMobile) {
    return <AnimatePresence>
        {isOpen && <>
            {/* Backdrop */}
            <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} onClick={onClose} className="fixed inset-0 z-40 bg-black/50 md:hidden" />
            {/* Sidebar */}
            <motion.aside initial={{
          x: -280
        }} animate={{
          x: 0
        }} exit={{
          x: -280
        }} transition={{
          type: 'spring',
          damping: 30,
          stiffness: 300
        }} className="fixed left-0 top-0 z-50 h-screen w-[280px] border-r border-border bg-card shadow-xl md:hidden flex flex-col">
              {sidebarContent}
            </motion.aside>
          </>}
      </AnimatePresence>;
  }
  // Desktop sidebar
  return <motion.aside initial={false} animate={{
    width: isOpen ? 280 : 80
  }} className="fixed left-0 top-0 z-40 h-screen border-r border-border bg-card shadow-lg hidden md:flex flex-col">
      {sidebarContent}
    </motion.aside>;
}