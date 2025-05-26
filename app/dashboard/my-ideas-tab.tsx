"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistance } from 'date-fns';
import { Users, Edit, Trash2, MoreHorizontal, Eye, Plus } from 'lucide-react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { useIdeas } from '@/contexts/ideas-context';
import { useAuth } from '@/hooks/use-auth';
import { Idea } from '@/types';
import EditIdeaDialog from '@/components/edit-idea-dialog';
import DeleteIdeaDialog from '@/components/delete-idea-dialog';

interface MyIdeasTabProps {
  onCreateIdea: () => void;
}

export default function MyIdeasTab({ onCreateIdea }: MyIdeasTabProps) {
  const { getUserIdeas, isLoading } = useIdeas();
  const { user } = useAuth();
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [deletingIdea, setDeletingIdea] = useState<Idea | null>(null);
  
  const userIdeas = user ? getUserIdeas(user.id) : [];

  const handleEditClick = (idea: Idea) => {
    setEditingIdea(idea);
  };

  const handleDeleteClick = (idea: Idea) => {
    setDeletingIdea(idea);
  };

  const handleEditSuccess = () => {
    setEditingIdea(null);
  };

  const handleDeleteSuccess = () => {
    setDeletingIdea(null);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-zinc-900/50 border-zinc-800 animate-pulse">
            <CardHeader>
              <div className="h-6 bg-zinc-800 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-zinc-800 rounded w-full mb-4"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-zinc-800 rounded w-20"></div>
                <div className="h-6 bg-zinc-800 rounded w-16"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    );
  }

  if (userIdeas.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle>Mis Ideas</CardTitle>
            <CardDescription>
              Aún no has publicado ninguna idea
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Plus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            </motion.div>
            <p className="text-muted-foreground mb-4">Crea tu primera idea y encuentra colaboradores</p>
            <Button onClick={onCreateIdea} className="bg-[#FF4500] hover:bg-[#FF6B35]">
              Crear Mi Primera Idea
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-4">Mis Ideas ({userIdeas.length})</h2>
          <Button onClick={onCreateIdea} size="sm" className="bg-[#FF4500] hover:bg-[#FF6B35]">
            <Plus size={16} className="mr-2" />
            Nueva Idea
          </Button>
        </div>
        
        {userIdeas.map((idea, index) => (
          <motion.div
            key={idea.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50 transition-colors duration-300">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{idea.title}</CardTitle>
                    <CardDescription>
                      Publicado {formatDistance(new Date(idea.createdAt), new Date(), { addSuffix: true })}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800">
                      <DropdownMenuItem 
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleEditClick(idea)}
                      >
                        <Edit size={14} />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex items-center gap-2 cursor-pointer text-red-500"
                        onClick={() => handleDeleteClick(idea)}
                      >
                        <Trash2 size={14} />
                        <span>Eliminar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{idea.shortDescription}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{idea.category}</Badge>
                  <Badge variant={idea.isPaid ? "default" : "outline"} className={idea.isPaid ? "bg-green-600 hover:bg-green-700" : ""}>
                    {idea.isPaid ? 'Pagado' : 'Voluntario'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Users size={14} />
                  <span>{idea.membersNeeded} miembro{idea.membersNeeded !== 1 ? 's' : ''} necesario{idea.membersNeeded !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {idea.professions.slice(0, 3).map((profession, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {profession}
                    </Badge>
                  ))}
                  {idea.professions.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{idea.professions.length - 3} más
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4 border-t border-zinc-800">
                <Link href={`/idea?id=${idea.id}`}>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Eye size={14} />
                    <span>Ver Idea</span>
                  </Button>
                </Link>
                <Link href={`/dashboard/idea/${idea.id}/applications`}>
                  <Button size="sm">Ver Aplicaciones (0)</Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Edit Idea Dialog */}
      {editingIdea && (
        <EditIdeaDialog
          open={!!editingIdea}
          onOpenChange={(open) => !open && setEditingIdea(null)}
          idea={editingIdea}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Idea Dialog */}
      {deletingIdea && (
        <DeleteIdeaDialog
          open={!!deletingIdea}
          onOpenChange={(open) => !open && setDeletingIdea(null)}
          idea={deletingIdea}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  );
}