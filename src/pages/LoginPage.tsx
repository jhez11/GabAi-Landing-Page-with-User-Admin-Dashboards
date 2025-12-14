import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, AlertCircle, Bot, ArrowLeft, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
export function LoginPage() {
  const navigate = useNavigate();
  const {
    login,
    register
  } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isSignUp) {
        // Registration
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        const success = await register(formData.name, formData.email, formData.password);
        if (success) {
          // Auto-login after registration
          await login(formData.email, formData.password);
        } else {
          setError('Email already exists');
        }
      } else {
        // Login
        const success = await login(formData.email, formData.password);
        if (!success) {
          setError('Invalid email or password');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };
  return <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              G
            </div>
            <span className="text-xl font-bold tracking-tight">GabAi</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.4
      }} className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </CardTitle>
              <p className="text-sm text-muted-foreground text-center">
                {isSignUp ? 'Sign up to get started with GabAi' : 'Sign in to access your NEMSU AI Assistant'}
              </p>
            </CardHeader>
            <CardContent>
              {/* Tab Toggle */}
              <div className="flex gap-2 p-1 bg-muted rounded-lg mb-6">
                <button type="button" onClick={() => {
                setIsSignUp(false);
                setError('');
                setFormData({
                  name: '',
                  email: '',
                  password: '',
                  confirmPassword: ''
                });
              }} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${!isSignUp ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                  Sign In
                </button>
                <button type="button" onClick={() => {
                setIsSignUp(true);
                setError('');
                setFormData({
                  name: '',
                  email: '',
                  password: '',
                  confirmPassword: ''
                });
              }} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${isSignUp ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {isSignUp && <motion.div initial={{
                  opacity: 0,
                  height: 0
                }} animate={{
                  opacity: 1,
                  height: 'auto'
                }} exit={{
                  opacity: 0,
                  height: 0
                }}>
                      <Input label="Full Name" name="name" type="text" placeholder="Juan Dela Cruz" value={formData.name} onChange={handleChange} icon={<User className="h-4 w-4" />} required />
                    </motion.div>}
                </AnimatePresence>

                <Input label="Email Address" name="email" type="email" placeholder="your.email@nemsu.edu.ph" value={formData.email} onChange={handleChange} icon={<Mail className="h-4 w-4" />} required />

                <Input label="Password" name="password" type="password" placeholder={isSignUp ? 'At least 6 characters' : 'Enter your password'} value={formData.password} onChange={handleChange} icon={<Lock className="h-4 w-4" />} required />

                <AnimatePresence mode="wait">
                  {isSignUp && <motion.div initial={{
                  opacity: 0,
                  height: 0
                }} animate={{
                  opacity: 1,
                  height: 'auto'
                }} exit={{
                  opacity: 0,
                  height: 0
                }}>
                      <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="Re-enter your password" value={formData.confirmPassword} onChange={handleChange} icon={<Lock className="h-4 w-4" />} required />
                    </motion.div>}
                </AnimatePresence>

                {error && <motion.div initial={{
                opacity: 0,
                y: -10
              }} animate={{
                opacity: 1,
                y: 0
              }} className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </motion.div>}

                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>;
}