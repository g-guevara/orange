"use client";

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistance } from 'date-fns';
import { Calendar, Clock, FileText, ExternalLink, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApplications } from '@/contexts/applications-context';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

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

export default function MyRequestsTab() {
  const { user } = useAuth();
  const { userApplications, isLoading, getUserApplications } = useApplications();
  const [hasInitialized, setHasInitialized] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    // Solo cargar una vez cuando el componente se monta Y el usuario está disponible
    if (user && !hasInitialized && !fetchedRef.current) {
      fetchedRef.current = true;
      setHasInitialized(true);
      getUserApplications(user.id);
    }
  }, [user]); // Solo depende del user

  // Función para refrescar manualmente
  const handleRefresh = () => {
    if (user) {
      fetchedRef.current = false;
      setHasInitialized(false);
      getUserApplications(user.id);
    }
  };

  if (!hasInitialized && isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Mis Solicitudes</h2>
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FF4500]"></div>
            <span className="text-sm text-muted-foreground">Cargando...</span>
          </div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-zinc-900/50 border-zinc-800 animate-pulse">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="h-5 bg-zinc-800 rounded w-64 mb-2"></div>
                    <div className="h-4 bg-zinc-800 rounded w-48"></div>
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
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Mis Solicitudes</h2>
        <div className="flex items-center gap-4">
          {userApplications.length > 0 && (
            <Badge variant="secondary" className="px-3 py-1">
              {userApplications.length} solicitud{userApplications.length !== 1 ? 'es' : ''}
            </Badge>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </div>
      </div>
      
      {userApplications.length === 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="text-center py-12">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            </motion.div>
            <h3 className="text-lg font-medium mb-2">No has enviado solicitudes aún</h3>
            <p className="text-muted-foreground mb-4">
              Explora las ideas disponibles y aplica a los proyectos que te interesen
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button className="bg-[#FF4500] hover:bg-[#FF6B35]">
                  Explorar Ideas
                </Button>
              </Link>
              <Button variant="outline" onClick={handleRefresh}>
                Verificar de nuevo
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {userApplications.map((request, index) => {
              const StatusIcon = statusIcons[request.status as keyof typeof statusIcons];
              
              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-white flex items-center gap-2">
                            {request.ideaTitle || 'Proyecto'}
                            <StatusIcon size={16} className={
                              request.status === 'accepted' ? 'text-green-500' :
                              request.status === 'rejected' ? 'text-red-500' :
                              'text-yellow-500'
                            } />
                          </CardTitle>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>Aplicado {formatDistance(new Date(request.createdAt), new Date(), { addSuffix: true })}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              request.status === 'accepted' ? 'default' :
                              request.status === 'rejected' ? 'destructive' :
                              'secondary'
                            }
                            className={
                              request.status === 'accepted' ? 'bg-green-600 hover:bg-green-700' :
                              request.status === 'rejected' ? '' :
                              'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
                            }
                          >
                            {statusLabels[request.status as keyof typeof statusLabels]}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2 text-white">Carta de Presentación:</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                          {request.coverLetter}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-muted-foreground">
                            Solicitud #{request.id.slice(-6)}
                          </span>
                          {request.status === 'accepted' && (
                            <Badge variant="outline" className="text-green-400 border-green-400/30">
                              ¡Felicitaciones!
                            </Badge>
                          )}
                          {request.status === 'rejected' && (
                            <Badge variant="outline" className="text-red-400 border-red-400/30">
                              No seleccionado
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex items-center gap-1" asChild>
                            <a href={request.cvLink} target="_blank" rel="noopener noreferrer">
                              <ExternalLink size={14} />
                              <span>Mi CV</span>
                            </a>
                          </Button>
                          
                          <Link href={`/idea?id=${request.ideaId}`}>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Eye size={14} />
                              <span>Ver Proyecto</span>
                            </Button>
                          </Link>
                        </div>
                      </div>
                      
                      {request.status === 'accepted' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 p-3 bg-green-900/20 border border-green-600/30 rounded-md"
                        >
                          <p className="text-sm text-green-400">
                            🎉 ¡Tu solicitud fue aceptada! El creador del proyecto debería contactarte pronto.
                          </p>
                        </motion.div>
                      )}
                      
                      {request.status === 'rejected' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 p-3 bg-red-900/20 border border-red-600/30 rounded-md"
                        >
                          <p className="text-sm text-red-400">
                            No te preocupes, hay muchas otras oportunidades esperándote.
                          </p>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}