"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistance } from 'date-fns';
import { Mail, Download, ExternalLink, Calendar } from 'lucide-react';

// Mock applications data
const applications = [
  {
    id: '1',
    ideaId: '1',
    ideaTitle: 'AR Shopping Assistant',
    name: 'Jane Smith',
    email: 'jane@example.com',
    coverLetter: 'I have extensive experience in mobile development and AR technologies. I\'ve built several AR applications for retail clients and would love to bring my expertise to this project.',
    cvLink: 'https://example.com/cv/jane-smith',
    status: 'pending',
    createdAt: '2024-04-10T09:15:00Z'
  },
  {
    id: '2',
    ideaId: '1',
    ideaTitle: 'AR Shopping Assistant',
    name: 'Michael Wong',
    email: 'michael@example.com',
    coverLetter: 'As a specialist in AR/VR with 5 years of experience, I am excited about this project. I have worked on similar concepts in the past and have valuable insights to contribute.',
    cvLink: 'https://example.com/cv/michael-wong',
    status: 'accepted',
    createdAt: '2024-04-09T14:30:00Z'
  },
  {
    id: '3',
    ideaId: '3',
    ideaTitle: 'Community Garden Planner',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    coverLetter: 'I am passionate about community projects and have experience in full-stack development. I would love to help build this platform to connect gardeners and enhance community engagement.',
    cvLink: 'https://example.com/cv/sarah-johnson',
    status: 'rejected',
    createdAt: '2024-04-08T11:20:00Z'
  }
];

export default function ApplicationsTab() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const filteredApplications = selectedStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === selectedStatus);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" onValueChange={setSelectedStatus} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Applications</h2>
          <TabsList className="bg-zinc-800">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="space-y-4">
          {renderApplications(filteredApplications)}
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          {renderApplications(filteredApplications)}
        </TabsContent>
        <TabsContent value="accepted" className="space-y-4">
          {renderApplications(filteredApplications)}
        </TabsContent>
        <TabsContent value="rejected" className="space-y-4">
          {renderApplications(filteredApplications)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function renderApplications(applications: any[]) {
  if (applications.length === 0) {
    return (
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No applications in this category</p>
        </CardContent>
      </Card>
    );
  }
  
  return applications.map((application) => (
    <Card key={application.id} className="bg-zinc-900/50 border-zinc-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{application.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Mail size={14} />
              <span>{application.email}</span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="capitalize" variant={getStatusVariant(application.status)}>
              {application.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-1">Applied for:</h4>
          <p className="text-muted-foreground">{application.ideaTitle}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-1">Cover Letter:</h4>
          <p className="text-muted-foreground text-sm">{application.coverLetter}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar size={14} />
            <span>Applied {formatDistance(new Date(application.createdAt), new Date(), { addSuffix: true })}</span>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1" asChild>
              <a href={application.cvLink} target="_blank" rel="noopener noreferrer">
                <Download size={14} />
                <span>CV</span>
                <ExternalLink size={12} className="ml-1" />
              </a>
            </Button>
            
            {application.status === 'pending' && (
              <>
                <Button variant="destructive" size="sm">Reject</Button>
                <Button size="sm">Accept</Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  ));
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'accepted':
      return 'default';
    case 'rejected':
      return 'destructive';
    case 'pending':
    default:
      return 'secondary';
  }
}