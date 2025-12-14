import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, AlertCircle, ArrowLeft, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Logo } from '../components/ui/Logo';
export function LoginPage() {
  const navigate = useNavigate();
  const {
    login,
    register
  } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
          await login(formData.email, formData.password);
        } else {
          setError('Email already exists');
        }
      } else {
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
  return <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Animated circuit background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <motion.path d="M 0 500 L 200 500 L 200 300 L 400 300 L 400 500 L 600 500" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" initial={{
          pathLength: 0
        }} animate={{
          pathLength: 1
        }} transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }} />
          <motion.path d="M 1000 500 L 800 500 L 800 700 L 600 700 L 600 500 L 400 500" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" initial={{
          pathLength: 0
        }} animate={{
          pathLength: 1
        }} transition={{
          duration: 3,
          delay: 1.5,
          repeat: Infinity,
          ease: 'linear'
        }} />
        </svg>
      </div>

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
          <div className="flex items-center gap-2">
            <Logo variant="icon" size="md" color="hsl(var(--primary))" />
            <span className="text-xl font-bold tracking-tight">GabAi</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.4
      }} className="w-full max-w-md">
          <Card className="shadow-xl relative overflow-hidden">
            {/* Circuit animation connecting to form */}
            <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" initial={{
            opacity: 0,
            scale: 0
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: 0.3,
            duration: 0.5
          }}>
              <Logo variant="full" size="lg" animated color="hsl(var(--primary))" />
            </motion.div>

            <CardHeader className="space-y-1 pb-6 pt-16">
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

                <Input label="Password" name="password" type={showPassword ? 'text' : 'password'} placeholder={isSignUp ? 'At least 6 characters' : 'Enter your password'} value={formData.password} onChange={handleChange} icon={<Lock className="h-4 w-4" />} rightIcon={showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} onRightIconClick={() => setShowPassword(!showPassword)} required />

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
                      <Input label="Confirm Password" name="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Re-enter your password" value={formData.confirmPassword} onChange={handleChange} icon={<Lock className="h-4 w-4" />} required />
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