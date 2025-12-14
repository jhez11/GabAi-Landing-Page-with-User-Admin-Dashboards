import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminDashboardHome } from '../components/modules/admin/AdminDashboard';
import { UserManagement } from '../components/modules/admin/UserManagement';
import { DatasetUpload } from '../components/modules/admin/DatasetUpload';
import { DepartmentCRUD } from '../components/modules/admin/DepartmentCRUD';
import { CourseCRUD } from '../components/modules/admin/CourseCRUD';
import { ScholarshipCRUD } from '../components/modules/admin/ScholarshipCRUD';
import { MapCRUD } from '../components/modules/admin/MapCRUD';
import { FacultyCRUD } from '../components/modules/admin/FacultyCRUD';
export function AdminDashboard() {
  return <Routes>
      <Route path="/" element={<AdminDashboardHome />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="upload" element={<DatasetUpload />} />
      <Route path="departments" element={<DepartmentCRUD />} />
      <Route path="courses" element={<CourseCRUD />} />
      <Route path="scholarships" element={<ScholarshipCRUD />} />
      <Route path="map" element={<MapCRUD />} />
      <Route path="faculty" element={<FacultyCRUD />} />
    </Routes>;
}