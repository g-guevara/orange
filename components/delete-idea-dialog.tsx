"use client";

import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Idea } from '@/types';
import { useIdeas } from '@/contexts/ideas-context';
import { useAuth } from '@/hooks/use-auth';

interface DeleteIdeaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idea: Idea;
  onSuccess?: () => void;
}

export default function DeleteIdeaDialog({ open, onOpenChange, idea, onSuccess }: DeleteIdeaDialogProps) {
  const { user } = useAuth();
  const { deleteIdea } = useIdeas();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    
    try {
      await deleteIdea(idea.id, user.id);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error al eliminar la idea:', error);
      // Aquí podrías mostrar un toast de error
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <AlertDialogTitle className="text-left">Eliminar Idea</AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                ¿Estás seguro de que quieres eliminar la idea "{idea.title}"?
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        
        <div className="bg-red-500/10 border border-red-500/20 rounded-md p-4 mt-4">
          <div className="flex">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-red-200 mb-1">Esta acción no se puede deshacer</p>
              <p className="text-red-300">
                Se eliminará permanentemente la idea y todas las aplicaciones asociadas a ella.
              </p>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel 
            disabled={isDeleting}
            className="bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Eliminando...
              </>
            ) : (
              'Eliminar Idea'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}