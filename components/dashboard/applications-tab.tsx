"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistance } from 'date-fns';
import { Mail, Download, ExternalLink, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApplications } from '@/contexts/applications-context';
import { useAuth } from '@/hooks/use-auth';

const statusLabels = {
  pending: 'Pendiente',
  accepted: 'Aceptada',
  rejected: 'Rechazada'
};

const statusIcons = {
  pending: Clock,
  accepted: CheckCircle2,
  rejected: XCircle
};

export default function ApplicationsTab() {
  const { user } = useAuth();
  const { applications, isLoading, getIdeaAuthorApplications, updateApplicationStatus } = useApplications();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      getIdeaAuthorApplications(user.id);
    }
  }, [user, getIdeaAuthorApplications]);

  const filteredApplications = selectedStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === selectedStatus);
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'pending':
      default:
        return 'secondary';
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: 'accepted' | 'rejected') => {
    setUpdatingStatus(applicationId);
    try {
      await updateApplicationStatus(applicationId, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const renderApplications = (applications: any[]) => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-zinc-900/50 border-zinc-800 animate-pulse">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="h-5 bg-zinc-800 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-zinc-800 rounded w-32"></div>
                  </div>
                  <div className="h-6 bg-zinc-800 rounded w-20"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-zinc-800 rounded w-full mb-2"></div>
                <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (applications.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No hay aplicaciones en esta categoría</p>
            </CardContent>
          </Card>
        </motion.div>
      );
    }
    
    return (
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {applications.map((application, index) => {
            const StatusIcon = statusIcons[application.status as keyof typeof statusIcons];
            
            return (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {application.name}
                          <StatusIcon size={16} className={
                            application.status === 'accepted' ? 'text-green-500' :
                            application.status === 'rejected' ? 'text-red-500' :
                            'text-yellow-500'
                          } />
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <Mail size={14} />
                          <span>{application.email}</span>
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className="capitalize" 
                          variant={getStatusVariant(application.status)}
                        >
                          {statusLabels[application.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-1">Aplicó para:</h4>
                      <p className="text-muted-foreground">{application.ideaTitle}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-1">Carta de Presentación:</h4>
                      <p className="text-muted-foreground text-sm">{application.coverLetter}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar size={14} />
                        <span>Aplicó {formatDistance(new Date(application.createdAt), new Date(), { addSuffix: true })}</span>
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
                            <Button 
                              variant="destructive" 
                              size="sm"
                              disabled={updatingStatus === application.id}
                              onClick={() => handleStatusUpdate(application.id, 'rejected')}
                            >
                              {updatingStatus === application.id ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                />
                              ) : (
                                'Rechazar'
                              )}
                            </Button>
                            <Button 
                              size="sm"
                              disabled={updatingStatus === application.id}
                              onClick={() => handleStatusUpdate(application.id, 'accepted')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {updatingStatus === application.id ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                />
                              ) : (
                                'Aceptar'
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  };

  const getApplicationsCount = (status?: string) => {
    if (!status || status === 'all') return applications.length;
    return applications.filter(app => app.status === status).length;
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs defaultValue="all" onValueChange={setSelectedStatus} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Aplicaciones Recibidas</h2>
          <TabsList className="bg-zinc-800">
            <TabsTrigger value="all" className="relative">
              Todas
              {getApplicationsCount() > 0 && (
                <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                  {getApplicationsCount()}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="pending" className="relative">
              Pendientes
              {getApplicationsCount('pending') > 0 && (
                <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                  {getApplicationsCount('pending')}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Aceptadas
              {getApplicationsCount('accepted') > 0 && (
                <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                  {getApplicationsCount('accepted')}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rechazadas
              {getApplicationsCount('rejected') > 0 && (
                <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                  {getApplicationsCount('rejected')}
                </Badge>
              )}
            </TabsTrigger>
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
    </motion.div>
  );
}