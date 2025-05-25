"use client";

import { Idea } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistance } from 'date-fns';
import { Users, Edit, Trash2, MoreHorizontal, Eye } from 'lucide-react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface MyIdeasTabProps {
  userIdeas: Idea[];
}

export default function MyIdeasTab({ userIdeas }: MyIdeasTabProps) {
  if (userIdeas.length === 0) {
    return (
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle>My Ideas</CardTitle>
          <CardDescription>
            You haven't submitted any ideas yet
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">Create your first idea and find collaborators</p>
          <Button>Submit Your First Idea</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">My Ideas</h2>
      
      {userIdeas.map((idea) => (
        <Card key={idea.id} className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{idea.title}</CardTitle>
                <CardDescription>
                  Posted {formatDistance(new Date(idea.createdAt), new Date(), { addSuffix: true })}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800">
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <Edit size={14} />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-500">
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{idea.shortDescription}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{idea.category}</Badge>
              <Badge variant={idea.isPaid ? "default" : "outline"}>
                {idea.isPaid ? 'Paid' : 'Volunteer'}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users size={14} />
              <span>{idea.membersNeeded} members needed</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-4 border-t border-zinc-800">
            <Link href={`/idea/${idea.id}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Eye size={14} />
                <span>View Idea</span>
              </Button>
            </Link>
            <Link href={`/dashboard/idea/${idea.id}/applications`}>
              <Button size="sm">View Applications (3)</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}