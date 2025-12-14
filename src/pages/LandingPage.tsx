import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, BookOpen, Users, MapPin, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';
export function LandingPage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo variant="icon" size="md" color="hsl(var(--primary))" />
            <span className="text-xl font-bold tracking-tight">GabAi</span>
          </div>
          <Button onClick={() => navigate('/login')} variant="outline">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{
          scale: 0,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} transition={{
          duration: 0.5
        }} className="flex justify-center mb-8">
            <Logo variant="full" size="xl" animated={isLoaded} color="hsl(var(--primary))" className="h-24 w-24" />
          </motion.div>

          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 1.2,
          duration: 0.6
        }} className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Your AI-Powered
            <br />
            <span className="text-primary">Campus Assistant</span>
          </motion.h1>

          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 1.4,
          duration: 0.6
        }} className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get instant answers about courses, scholarships, faculty, and campus
            locations. Your intelligent guide to NEMSU.
          </motion.p>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 1.6,
          duration: 0.6
        }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/login')} className="text-lg">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[{
          icon: Bot,
          title: 'AI Chatbot',
          description: 'Ask questions and get instant, accurate answers about NEMSU',
          color: 'text-blue-500',
          delay: 1.8
        }, {
          icon: BookOpen,
          title: 'Course Information',
          description: 'Explore programs, requirements, and academic offerings',
          color: 'text-purple-500',
          delay: 2.0
        }, {
          icon: Users,
          title: 'Faculty Directory',
          description: 'Find professors, office hours, and contact information',
          color: 'text-green-500',
          delay: 2.2
        }, {
          icon: MapPin,
          title: 'Campus Navigation',
          description: 'Interactive maps to help you find your way around',
          color: 'text-orange-500',
          delay: 2.4
        }].map(feature => <motion.div key={feature.title} initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: feature.delay,
          duration: 0.6
        }} className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 ${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>)}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        delay: 2.6,
        duration: 0.6
      }} className="max-w-3xl mx-auto text-center p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
          <Sparkles className="h-12 w-12 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of students using GabAi to navigate their academic
            journey
          </p>
          <Button size="lg" onClick={() => navigate('/login')}>
            Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Logo variant="icon" size="sm" color="hsl(var(--primary))" />
              <span className="text-sm text-muted-foreground">
                © 2024 GabAi. All rights reserved.
              </span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                About
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>;
}