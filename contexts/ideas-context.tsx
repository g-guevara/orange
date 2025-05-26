"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Idea } from '@/types';

type IdeasContextType = {
  ideas: Idea[];
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt'>) => Promise<Idea>;
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