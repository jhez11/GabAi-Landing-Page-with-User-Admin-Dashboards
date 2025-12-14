import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Chatbot } from '../components/modules/Chatbot';
import { ChatHistory } from '../components/modules/ChatHistory';
import { Departments } from '../components/modules/Departments';
import { Courses } from '../components/modules/Courses';
import { Scholarships } from '../components/modules/Scholarships';
import { CampusMap } from '../components/modules/CampusMap';
import { Faculty } from '../components/modules/Faculty';
import { Settings } from '../components/modules/Settings';
export function UserDashboard() {
  return <Routes>
      <Route path="/" element={<Navigate to="chatbot" replace />} />
      <Route path="chatbot" element={<Chatbot />} />
      <Route path="chat" element={<ChatHistory />} />
      <Route path="departments" element={<Departments />} />
      <Route path="courses" element={<Courses />} />
      <Route path="scholarships" element={<Scholarships />} />
      <Route path="faculty" element={<Faculty />} />
      <Route path="map" element={<CampusMap />} />
      <Route path="settings" element={<Settings />} />
    </Routes>;
}