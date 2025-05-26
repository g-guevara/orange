"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Application } from '@/types';

type ApplicationsContextType = {
  applications: Application[];
  userApplications: Application[];
  addApplication: (application: Omit<Application, 'id' | 'createdAt' | 'status'>) => Promise<Application>;
  updateApplicationStatus: (applicationId: string, status: 'accepted' | 'rejected') => Promise<void>;
  refreshApplications: () => Promise<void>;
  isLoading: boolean;
  getUserApplications: (userId: string) => Promise<void>;
  getIdeaAuthorApplications: (ideaAuthorId: string) => Promise<void>;
};

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined);

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [userApplications, setUserApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Función para agregar una nueva aplicación
  const addApplication = async (applicationData: Omit<Application, 'id' | 'createdAt' | 'status'>) => {
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar la aplicación');
      }

      const newApplication = data.application;
      setUserApplications(prev => [newApplication, ...prev]);
      
      return newApplication;
    } catch (error) {
      console.error('Error adding application:', error);
      throw error;
    }
  };

  // Función para actualizar el estado de una aplicación
  const updateApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
    try {
      const response = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar el estado');
      }

      // Actualizar el estado local
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status }
            : app
        )
      );

    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  };

  // Función para obtener las aplicaciones de un usuario específico
  const getUserApplications = async (userId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/applications?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setUserApplications(data.applications);
      }
    } catch (error) {
      console.error('Error fetching user applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener aplicaciones recibidas por un autor de ideas
  const getIdeaAuthorApplications = async (ideaAuthorId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/applications?ideaAuthorId=${ideaAuthorId}`);
      const data = await response.json();
      
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Error fetching idea author applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para refrescar las aplicaciones
  const refreshApplications = async () => {
    // Esta función puede ser expandida según las necesidades
  };

  return (
    <ApplicationsContext.Provider value={{
      applications,
      userApplications,
      addApplication,
      updateApplicationStatus,
      refreshApplications,
      isLoading,
      getUserApplications,
      getIdeaAuthorApplications
    }}>
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationsContext);
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationsProvider');
  }
  return context;
}