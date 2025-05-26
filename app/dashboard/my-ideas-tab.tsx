"use client";

import { Idea } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistance } from 'date-fns';
import { Users, Edit, Trash2, MoreHorizontal, Eye } from 'lucide-react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

interface MyIdeasTabProps {
  userIdeas: Idea[];
}

export default function MyIdeasTab({ userIdeas }: MyIdeasTabProps) {
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
            <p className="text-muted-foreground mb-4">Crea tu primera idea y encuentra colaboradores</p>
            <Button>Crear Mi Primera Idea</Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4">Mis Ideas</h2>
      
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
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                      <Edit size={14} />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-500">
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
                <Badge variant={idea.isPaid ? "default" : "outline"}>
                  {idea.isPaid ? 'Pagado' : 'Voluntario'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users size={14} />
                <span>{idea.membersNeeded} miembro{idea.membersNeeded !== 1 ? 's' : ''} necesario{idea.membersNeeded !== 1 ? 's' : ''}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-4 border-t border-zinc-800">
              <Link href={`/idea/${idea.id}`}>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Eye size={14} />
                  <span>Ver Idea</span>
                </Button>
              </Link>
              <Link href={`/dashboard/idea/${idea.id}/applications`}>
                <Button size="sm">Ver Aplicaciones (3)</Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}