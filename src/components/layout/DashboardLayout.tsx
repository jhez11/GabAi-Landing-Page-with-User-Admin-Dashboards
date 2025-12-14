import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  return <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Mobile Sidebar */}
      <Sidebar isOpen={isMobileSidebarOpen} setIsOpen={setIsMobileSidebarOpen} isMobile={true} onClose={() => setIsMobileSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex min-h-screen flex-col transition-all duration-300" style={{
      marginLeft: isSidebarOpen ? '280px' : '80px'
    }}>
        <style>{`
          @media (max-width: 768px) {
            .flex.min-h-screen {
              margin-left: 0 !important;
            }
          }
        `}</style>

        <Header toggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>;
}