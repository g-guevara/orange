"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ideas } from '@/data/ideas';
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

export default function IdeaDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const { user } = useAuth();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  useEffect(() => {
    const foundIdea = ideas.find(i => i.id === id);
    
    if (!foundIdea) {
      router.push('/');
      return;
    }
    
    setIdea(foundIdea);
  }, [id, router]);

  if (!idea) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
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
          
          {applicationSubmitted ? (
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
                <p className="text-muted-foreground">
                  Serás notificado si el creador del proyecto desea discutir más detalles.
                </p>
              </CardContent>
            </Card>
          ) : isApplying ? (
            <ApplyForm ideaId={idea.id} onSubmit={handleApplicationSubmit} />
          ) : (
            <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
              <h2 className="text-xl font-semibold mb-2">¿Interesado en este proyecto?</h2>
              <p className="text-muted-foreground mb-4">
                Aplica ahora para colaborar con {idea.author.name} en esta emocionante idea.
              </p>
              
              {user ? (
                <Button onClick={handleApply} className="w-full sm:w-auto">
                  Aplicar a este proyecto
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-400">
                    <AlertCircle size={18} />
                    <p className="text-sm">Necesitas iniciar sesión para aplicar a este proyecto.</p>
                  </div>
                  <Button onClick={() => router.push('/login')} className="w-full sm:w-auto">
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