"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import ParticleBackground from '@/components/canvas/particles';
import { ideas } from '@/data/ideas';
import IdeaSubmissionForm from '@/components/dashboard/idea-submission-form';
import MyIdeasTab from '@/components/dashboard/my-ideas-tab';
import ApplicationsTab from '@/components/dashboard/applications-tab';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('submit');

  // Redirect to login if not authenticated
  if (!user) {
    typeof window !== 'undefined' && router.push('/login');
    return null;
  }

  // Filter ideas created by the user
  const userIdeas = ideas.filter(idea => idea.author.id === user.id);

  return (
    <>
      <ParticleBackground />
      
      <div className="min-h-screen pt-8 pb-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <Tabs defaultValue="submit" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="submit">Submit Idea</TabsTrigger>
            <TabsTrigger value="myideas">My Ideas</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submit">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle>Submit a New Idea</CardTitle>
                <CardDescription>
                  Share your project idea and find talented collaborators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IdeaSubmissionForm onSuccess={() => setActiveTab('myideas')} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="myideas">
            <MyIdeasTab userIdeas={userIdeas} />
          </TabsContent>
          
          <TabsContent value="applications">
            <ApplicationsTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}