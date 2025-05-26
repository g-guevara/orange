"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useIdeas } from '@/contexts/ideas-context';
import { Idea } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Clock, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import ApplyForm from '@/components/apply-form';
import ParticleBackground from '@/components/canvas/particles';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function IdeaDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const { user } = useAuth();
  const { ideas, isLoading } = useIdeas();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);

  useEffect(() => {
    if (!isLoading && ideas.length > 0 && id) {
      const foundIdea = ideas.find(i => i.id === id);
      
      if (!foundIdea) {
        router.push('/');
        return;
      }
      
      setIdea(foundIdea);
    }
  }, [id, router, ideas, isLoading]);

  // Función para verificar si ya aplicó a esta idea
  const checkIfAlreadyApplied = async () => {
    if (!user || !idea) return;
    
    setCheckingApplication(true);
    try {
      const response = await fetch(`/api/applications?userId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        const hasUserApplied = data.applications.some((app: any) => app.ideaId === idea.id);
        setHasApplied(hasUserApplied);
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    } finally {
      setCheckingApplication(false);
    }
  };

  // Verificar si ya aplicó cuando se cargan la idea y el usuario
  useEffect(() => {
    if (idea && user && user.id !== idea.author.id) {
      checkIfAlreadyApplied();
    }
  }, [idea, user]);

  if (isLoading) {
    return (
      <>
        <ParticleBackground />
        <div className="min-h-screen pt-8 pb-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-zinc-800 rounded w-32"></div>
            <div className="space-y-2">
              <div className="h-4 bg-zinc-800 rounded w-20"></div>
              <div className="h-10 bg-zinc-800 rounded w-3/4"></div>
              <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 h-24"></div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-zinc-800 rounded w-48"></div>
              <div className="space-y-2">
                <div className="h-4 bg-zinc-800 rounded w-full"></div>
                <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
                <div className="h-4 bg-zinc-800 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!idea) {
    return (
      <>
        <ParticleBackground />
        <div className="min-h-screen flex items-center justify-center">
          <p>Idea no encontrada</p>
        </div>
      </>
    );
  }

  const handleApply = () => {
    if (user) {
      setIsApplying(true);
    } else {
      router.push('/login');
    }
  };

  const handleApplicationSubmit = () => {
    setIsApplying(false);
    setApplicationSubmitted(true);
    setHasApplied(true);
  };

  const handleCancelApplication = () => {
    setIsApplying(false);
  };

  return (
    <>
      <ParticleBackground />
      
      <div className="min-h-screen pt-8 pb-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push('/')}
        >
          ← Volver a ideas
        </Button>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap gap-3 mb-4">
            <Badge className="bg-zinc-800 hover:bg-zinc-800">
              {idea.category}
            </Badge>
            <Badge 
              variant="outline"
              className={`${idea.isPaid ? 'border-green-500 text-green-400' : 'border-blue-500 text-blue-400'}`}
            >
              {idea.isPaid ? 'Proyecto Pagado' : 'Proyecto Voluntario'}
            </Badge>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{idea.title}</h1>
          
          <div className="flex items-center text-muted-foreground mb-8">
            <p>Publicado por {idea.author.name}</p>
            <span className="mx-2">•</span>
            <p>{formatDistance(new Date(idea.createdAt), new Date(), { addSuffix: true })}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" />
                  Tiempo Requerido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{idea.timeRequired}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users size={16} className="text-muted-foreground" />
                  Tamaño del Equipo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{idea.membersNeeded} miembro{idea.membersNeeded !== 1 ? 's' : ''} necesario{idea.membersNeeded !== 1 ? 's' : ''}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CalendarDays size={16} className="text-muted-foreground" />
                  Fecha de Inicio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Inmediatamente</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Descripción</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-base text-white whitespace-pre-line bg-[#FF4500] px-4 py-2 rounded-md shadow-[0_0_15px_#FF4500]">
                {idea.longDescription}
              </p>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Profesiones Requeridas</h2>
            <div className="flex flex-wrap gap-2">
              {idea.professions.map((profession, index) => (
                <Badge key={index} variant="secondary">
                  {profession}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="my-8 bg-zinc-800" />
          
          {/* Sección de aplicación actualizada */}
          {user && user.id === idea.author.id ? (
            // Es el autor de la idea
            <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
              <h2 className="text-xl font-semibold mb-2">Esta es tu idea</h2>
              <p className="text-muted-foreground mb-4">
                Puedes ver las aplicaciones que has recibido desde tu panel de control.
              </p>
              <div className="flex gap-4">
                <Link href="/dashboard?tab=applications">
                  <Button variant="outline">
                    Ver Aplicaciones
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button>
                    Ir al Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          ) : hasApplied ? (
            // Ya aplicó a esta idea
            <Card className="border-blue-500/30 bg-blue-900/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <CheckCircle2 size={20} />
                  Ya aplicaste a este proyecto
                </CardTitle>
                <CardDescription>
                  Puedes ver el estado de tu solicitud en tu panel de control.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Link href="/dashboard?tab=myrequests">
                    <Button variant="outline">
                      Ver mis solicitudes
                    </Button>
                  </Link>
                  <Link href={`/idea?id=${idea.id}`}>
                    <Button variant="ghost" onClick={() => window.location.reload()}>
                      Actualizar estado
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : applicationSubmitted ? (
            // Aplicación recién enviada
            <Card className="border-green-500/30 bg-green-900/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 size={20} />
                  Solicitud Enviada
                </CardTitle>
                <CardDescription>
                  Tu solicitud ha sido enviada al creador del proyecto.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Serás notificado si el creador del proyecto desea discutir más detalles.
                </p>
                <Link href="/dashboard?tab=myrequests">
                  <Button variant="outline">
                    Ver mis solicitudes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : isApplying ? (
            // Formulario de aplicación
            <ApplyForm 
              ideaId={idea.id} 
              onSubmit={handleApplicationSubmit}
            />
          ) : (
            // Botón para aplicar
            <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
              <h2 className="text-xl font-semibold mb-2">¿Interesado en este proyecto?</h2>
              <p className="text-muted-foreground mb-4">
                Aplica ahora para colaborar con {idea.author.name} en esta idea.
              </p>
              
              {user ? (
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={handleApply} 
                    className="bg-[#FF4500] hover:bg-[#FF6B35]"
                    disabled={checkingApplication}
                  >
                    {checkingApplication ? 'Verificando...' : 'Aplicar a este proyecto'}
                  </Button>
                  {checkingApplication && (
                    <span className="text-sm text-muted-foreground">
                      Verificando si ya aplicaste...
                    </span>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-400">
                    <AlertCircle size={18} />
                    <p className="text-sm">Necesitas iniciar sesión para aplicar a este proyecto.</p>
                  </div>
                  <Button 
                    onClick={() => router.push('/login')} 
                    className="bg-[#FF4500] hover:bg-[#FF6B35]"
                  >
                    Iniciar sesión para aplicar
                  </Button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}