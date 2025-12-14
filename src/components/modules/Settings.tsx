import React, { useState, useRef } from 'react';
import { User, Lock, Bell, Palette, Moon, Sun, Laptop, Upload, X, Image as ImageIcon, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
export function Settings() {
  const {
    user,
    updateProfile
  } = useAuth();
  const {
    theme,
    setTheme
  } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || 'College of Computer Studies'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };
  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string;
      if (result) {
        setAvatarPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };
  const handleSaveChanges = async () => {
    setIsSaving(true);
    const success = await updateProfile({
      name: formData.name,
      department: formData.department,
      avatar: avatarPreview || undefined
    });
    setIsSaving(false);
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };
  return <div className="max-w-2xl mx-auto space-y-8">
      {/* Success notification */}
      <AnimatePresence>
        {showSuccess && <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -20
      }} className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">
            <Check className="h-5 w-5" />
            <span className="font-medium">Profile updated successfully!</span>
          </motion.div>}
      </AnimatePresence>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account preferences and profile.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center sm:flex-row gap-6">
            <div className={`relative group h-24 w-24 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${isDragging ? 'border-primary ring-4 ring-primary/20 scale-105' : 'border-muted hover:border-primary/50'}`} onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
              {avatarPreview ? <img src={avatarPreview} alt="Profile" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground">
                  <User className="h-10 w-10" />
                </div>}

              {/* Overlay */}
              <div className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <Upload className="h-6 w-6 mb-1" />
                <span className="text-[10px] font-medium">Change</span>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <h3 className="font-medium">Profile Picture</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop an image or click to upload.
                <br />
                Supports JPG, PNG or GIF.
              </p>
              {avatarPreview && avatarPreview !== user?.avatar && <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive h-auto p-0 hover:bg-transparent" onClick={() => setAvatarPreview(user?.avatar || null)}>
                  Reset to default
                </Button>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full Name" value={formData.name} onChange={e => setFormData({
            ...formData,
            name: e.target.value
          })} />
            <Input label="Email Address" defaultValue={user?.email} disabled />
            <Input label="Student ID / Employee ID" defaultValue="2024-00123" disabled />
            <Input label="Department" value={formData.department} onChange={e => setFormData({
            ...formData,
            department: e.target.value
          })} />
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleSaveChanges} isLoading={isSaving}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" /> Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <button onClick={() => setTheme('light')} className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted/50 hover:bg-muted'}`}>
              <Sun className="h-6 w-6" />
              <span className="text-sm font-medium">Light</span>
            </button>
            <button onClick={() => setTheme('dark')} className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted/50 hover:bg-muted'}`}>
              <Moon className="h-6 w-6" />
              <span className="text-sm font-medium">Dark</span>
            </button>
            <button onClick={() => setTheme('system')} className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted/50 hover:bg-muted'}`}>
              <Laptop className="h-6 w-6" />
              <span className="text-sm font-medium">System</span>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" /> Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="Current Password" type="password" />
          <Input label="New Password" type="password" />
          <Input label="Confirm New Password" type="password" />
          <div className="flex justify-end mt-4">
            <Button variant="outline">Update Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>;
}