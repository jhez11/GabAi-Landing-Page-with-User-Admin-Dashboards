import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Map, GraduationCap, Building2, ShieldCheck, ArrowRight, Bot } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { ThemeToggle } from '../components/ui/ThemeToggle';
export function LandingPage() {
  const navigate = useNavigate();
  const features = [{
    icon: Bot,
    title: 'AI Assistant',
    description: '24/7 intelligent chatbot support for all your campus inquiries and guidance.'
  }, {
    icon: Map,
    title: 'Campus Navigation',
    description: 'Interactive map with precise coordinates to help you find your way around NEMSU.'
  }, {
    icon: GraduationCap,
    title: 'Course Information',
    description: 'Detailed insights into available programs, requirements, and curriculum.'
  }, {
    icon: Building2,
    title: 'Department Directory',
    description: 'Connect easily with various academic and administrative departments.'
  }, {
    icon: ShieldCheck,
    title: 'Secure Access',
    description: 'Role-based access control ensuring data privacy and security.'
  }, {
    icon: MessageSquare,
    title: 'Smart History',
    description: 'Keep track of your conversations and retrieve important information anytime.'
  }];
  return <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              G
            </div>
            <span className="text-xl font-bold tracking-tight">GabAi</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button onClick={() => navigate('/login')}>Sign In</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                NEMSU AI Assistant
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
                Your Intelligent Campus <br className="hidden lg:block" />
                <span className="text-primary">Guide & Companion</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                Navigate university life with ease. GabAi provides instant
                answers about courses, scholarships, campus locations, and
                more—powered by advanced AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8" onClick={() => navigate('/login')}>
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8">
                  Learn More
                </Button>
              </div>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }} className="flex-1 relative w-full max-w-lg mx-auto">
              <div className="relative w-full aspect-square">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-full blur-3xl animate-pulse" />
                <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden h-full flex flex-col">
                  <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="text-xs text-muted-foreground font-medium ml-2">
                      GabAi Assistant
                    </div>
                  </div>
                  <div className="flex-1 p-6 space-y-4 overflow-hidden">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Bot size={16} />
                      </div>
                      <div className="bg-muted p-3 rounded-2xl rounded-tl-none text-sm max-w-[80%]">
                        Hello! I'm GabAi. How can I help you with your NEMSU
                        journey today?
                      </div>
                    </div>
                    <div className="flex gap-3 flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                        <div className="w-4 h-4 rounded-full bg-secondary" />
                      </div>
                      <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-none text-sm max-w-[80%]">
                        Where is the College of Engineering located?
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Bot size={16} />
                      </div>
                      <div className="bg-muted p-3 rounded-2xl rounded-tl-none text-sm max-w-[80%]">
                        The College of Engineering is located in the East Wing,
                        Building C. Would you like to see it on the map?
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Everything you need in one place
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              GabAi integrates all essential campus information into one
              intuitive interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-xs">
              G
            </div>
            <span className="font-bold text-foreground">GabAi</span>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} North Eastern Mindanao State
            University. All rights reserved.
          </p>
        </div>
      </footer>
    </div>;
}