"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ideas } from '@/data/ideas';
import { Idea } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Clock, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import ApplyForm from '@/components/apply-form';
import ParticleBackground from '@/components/canvas/particles';
import { motion } from 'framer-motion';

export default function IdeaDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  useEffect(() => {
    const foundIdea = ideas.find(i => i.id === id);
    
    if (!foundIdea) {
      router.push('/');
      return;
    }
    
    setIdea(foundIdea);
  }, [id, router]);

  if (!idea) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const handleApply = () => {
    if (user) {
      setIsApplying(true);
    } else {
      router.push('/login');
    }
  };

  const handleApplicationSubmit = () => {
    setIsApplying(false);
    setApplicationSubmitted(true);
  };

  return (
    <>
      <ParticleBackground />
      
      <div className="min-h-screen pt-8 pb-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push('/')}
        >
          ← Back to ideas
        </Button>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap gap-3 mb-4">
            <Badge className="bg-zinc-800 hover:bg-zinc-800">
              {idea.category}
            </Badge>
            <Badge 
              variant="outline"
              className={`${idea.isPaid ? 'border-green-500 text-green-400' : 'border-blue-500 text-blue-400'}`}
            >
              {idea.isPaid ? 'Paid Project' : 'Volunteer Project'}
            </Badge>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{idea.title}</h1>
          
          <div className="flex items-center text-muted-foreground mb-8">
            <p>Posted by {idea.author.name}</p>
            <span className="mx-2">•</span>
            <p>{formatDistance(new Date(idea.createdAt), new Date(), { addSuffix: true })}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" />
                  Time Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{idea.timeRequired}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users size={16} className="text-muted-foreground" />
                  Team Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{idea.membersNeeded} member{idea.membersNeeded !== 1 ? 's' : ''} needed</p>
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CalendarDays size={16} className="text-muted-foreground" />
                  Start Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Immediately</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-base text-muted-foreground whitespace-pre-line">
                {idea.longDescription}
              </p>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Required Professions</h2>
            <div className="flex flex-wrap gap-2">
              {idea.professions.map((profession, index) => (
                <Badge key={index} variant="secondary">
                  {profession}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="my-8 bg-zinc-800" />
          
          {applicationSubmitted ? (
            <Card className="border-green-500/30 bg-green-900/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 size={20} />
                  Application Submitted
                </CardTitle>
                <CardDescription>
                  Your application has been sent to the project creator.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You will be notified if the project creator wants to discuss further details.
                </p>
              </CardContent>
            </Card>
          ) : isApplying ? (
            <ApplyForm ideaId={idea.id} onSubmit={handleApplicationSubmit} />
          ) : (
            <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
              <h2 className="text-xl font-semibold mb-2">Interested in this project?</h2>
              <p className="text-muted-foreground mb-4">
                Apply now to collaborate with {idea.author.name} on this exciting idea.
              </p>
              
              {user ? (
                <Button onClick={handleApply} className="w-full sm:w-auto">
                  Apply for this project
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-400">
                    <AlertCircle size={18} />
                    <p className="text-sm">You need to be logged in to apply for this project.</p>
                  </div>
                  <Button onClick={() => router.push('/login')} className="w-full sm:w-auto">
                    Log in to apply
                  </Button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}