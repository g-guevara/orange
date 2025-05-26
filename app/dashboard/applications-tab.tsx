"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistance } from 'date-fns';
import { Mail, Download, ExternalLink, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock applications data
const applications = [
  {
    id: '1',
    ideaId: '1',
    ideaTitle: 'Asistente de Compras con RA',
    name: 'Ana García',
    email: 'ana@example.com',
    coverLetter: 'Tengo amplia experiencia en desarrollo móvil y tecnologías de RA. He construido varias aplicaciones de RA para clientes minoristas y me encantaría aportar mi experiencia a este proyecto.',
    cvLink: 'https://example.com/cv/ana-garcia',
    status: 'pending',
    createdAt: '2024-04-10T09:15:00Z'
  },
  {
    id: '2',
    ideaId: '1',
    ideaTitle: 'Asistente de Compras con RA',
    name: 'Miguel Torres',
    email: 'miguel@example.com',
    coverLetter: 'Como especialista en RA/RV con 5 años de experiencia, estoy emocionado por este proyecto. He trabajado en conceptos similares en el pasado y tengo ideas valiosas que aportar.',
    cvLink: 'https://example.com/cv/miguel-torres',
    status: 'accepted',
    createdAt: '2024-04-09T14:30:00Z'
  },
  {
    id: '3',
    ideaId: '3',
    ideaTitle: 'Planificador de Huertos Comunitarios',
    name: 'Laura Jiménez',
    email: 'laura@example.com',
    coverLetter: 'Soy apasionada de los proyectos comunitarios y tengo experiencia en desarrollo full-stack. Me encantaría ayudar a construir esta plataforma para conectar jardineros y mejorar la participación comunitaria.',
    cvLink: 'https://example.com/cv/laura-jimenez',
    status: 'rejected',
    createdAt: '2024-04-08T11:20:00Z'
  }
];

const statusLabels = {
  pending: 'Pendiente',
  accepted: 'Aceptada',
  rejected: 'Rechazada'
};

export default function ApplicationsTab() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
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

  const renderApplications = (applications: any[]) => {
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
          {applications.map((application, index) => (
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
                      <CardTitle className="text-lg">{application.name}</CardTitle>
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
                          <Button variant="destructive" size="sm">Rechazar</Button>
                          <Button size="sm">Aceptar</Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
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
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="pending">Pendientes</TabsTrigger>
            <TabsTrigger value="accepted">Aceptadas</TabsTrigger>
            <TabsTrigger value="rejected">Rechazadas</TabsTrigger>
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