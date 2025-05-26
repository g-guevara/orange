"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Idea } from '@/types';

type IdeasContextType = {
  ideas: Idea[];
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt'>) => Promise<Idea>;
  updateIdea: (ideaId: string, updateData: Omit<Idea, 'id' | 'createdAt' | 'author'>, userId: string) => Promise<Idea>;
  deleteIdea: (ideaId: string, userId: string) => Promise<void>;
  refreshIdeas: () => Promise<void>;
  isLoading: boolean;
  getUserIdeas: (userId: string) => Idea[];
};

const IdeasContext = createContext<IdeasContextType | undefined>(undefined);

export function IdeasProvider({ children }: { children: ReactNode }) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Función para obtener todas las ideas desde la API
  const fetchIdeas = async () => {
    try {
      const response = await fetch('/api/ideas');
      const data = await response.json();
      
      if (data.success) {
        setIdeas(data.ideas);
      }
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para agregar una nueva idea
  const addIdea = async (ideaData: Omit<Idea, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...ideaData,
          authorId: ideaData.author.id,
          authorName: ideaData.author.name,
          authorEmail: ideaData.author.email
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la idea');
      }

      const newIdea = data.idea;
      setIdeas(prevIdeas => [newIdea, ...prevIdeas]);
      
      return newIdea;
    } catch (error) {
      console.error('Error adding idea:', error);
      throw error;
    }
  };

  // Función para actualizar una idea existente
  const updateIdea = async (ideaId: string, updateData: Omit<Idea, 'id' | 'createdAt' | 'author'>, userId: string) => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updateData,
          authorId: userId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar la idea');
      }

      const updatedIdea = data.idea;
      
      // Actualizar la idea en el estado local
      setIdeas(prevIdeas => 
        prevIdeas.map(idea => 
          idea.id === ideaId ? updatedIdea : idea
        )
      );
      
      return updatedIdea;
    } catch (error) {
      console.error('Error updating idea:', error);
      throw error;
    }
  };

  // Función para eliminar una idea
  const deleteIdea = async (ideaId: string, userId: string) => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}?userId=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar la idea');
      }

      // Remover la idea del estado local
      setIdeas(prevIdeas => 
        prevIdeas.filter(idea => idea.id !== ideaId)
      );

    } catch (error) {
      console.error('Error deleting idea:', error);
      throw error;
    }
  };

  // Función para refrescar las ideas
  const refreshIdeas = async () => {
    setIsLoading(true);
    await fetchIdeas();
  };

  // Función para obtener las ideas de un usuario específico
  const getUserIdeas = (userId: string) => {
    return ideas.filter(idea => idea.author.id === userId);
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  return (
    <IdeasContext.Provider value={{
      ideas,
      addIdea,
      updateIdea,
      deleteIdea,
      refreshIdeas,
      isLoading,
      getUserIdeas
    }}>
      {children}
    </IdeasContext.Provider>
  );
}

export function useIdeas() {
  const context = useContext(IdeasContext);
  if (context === undefined) {
    throw new Error('useIdeas must be used within an IdeasProvider');
  }
  return context;
}