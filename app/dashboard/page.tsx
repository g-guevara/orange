"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import ParticleBackground from '@/components/canvas/particles';
import { ideas } from '@/data/ideas';
import IdeaSubmissionForm from '@/components/dashboard/idea-submission-form';
import MyIdeasTab from '@/components/dashboard/my-ideas-tab';
import ApplicationsTab from '@/components/dashboard/applications-tab';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { formatDistance } from 'date-fns';
import { Calendar, Clock, FileText } from 'lucide-react';

// Mock data para las solicitudes del usuario
const mockUserRequests = [
  {
    id: '1',
    ideaId: '2',
    ideaTitle: 'Analizador de Contenido con IA',
    appliedDate: '2024-01-20T10:30:00Z',
    coverLetter: 'Me interesa mucho este proyecto porque tengo experiencia en IA y procesamiento de lenguaje natural.',
    status: 'pending'
  },
  {
    id: '2',
    ideaId: '5',
    ideaTitle: 'Mercado de Impresión 3D',
    appliedDate: '2024-01-15T14:20:00Z',
    coverLetter: 'Como desarrollador full-stack con experiencia en plataformas de e-commerce, creo que puedo aportar mucho a este proyecto.',
    status: 'pending'
  },
  {
    id: '3',
    ideaId: '6',
    ideaTitle: 'Juego de Fitness en Realidad Virtual',
    appliedDate: '2024-01-10T09:15:00Z',
    coverLetter: 'Mi experiencia en desarrollo de juegos y mi pasión por el fitness me convierten en el candidato ideal para este proyecto.',
    status: 'pending'
  }
];

// Componente para la pestaña "Mis Solicitudes"
function MyRequestsTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold mb-4">Mis Solicitudes</h2>
      
      {mockUserRequests.length === 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No has enviado ninguna solicitud aún</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {mockUserRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-white">
                        {request.ideaTitle}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Aplicado {formatDistance(new Date(request.appliedDate), new Date(), { addSuffix: true })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <Badge 
                            variant="outline" 
                            className="text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
                          >
                            Pendiente
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2 text-white">Carta de Presentación:</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {request.coverLetter}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Solicitud #{request.id}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('myideas');

  // Redirect to login if not authenticated
  if (!user) {
    typeof window !== 'undefined' && router.push('/login');
    return null;
  }

  // Filter ideas created by the user
  const userIdeas = ideas.filter(idea => idea.author.id === user.id);

  const tabVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <>
      <ParticleBackground />
      
      <div className="min-h-screen pt-8 pb-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl">
        <motion.h1 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8"
        >
          Panel de Control
        </motion.h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TabsList className="grid grid-cols-4 mb-8 bg-[#FF4500] text-black rounded-md overflow-hidden shadow-[0_0_10px_#FF4500,0_0_20px_#FF4500,0_0_30px_#FF4500]">
              <TabsTrigger 
                value="myideas" 
                className="data-[state=active]:bg-[#cc3700] data-[state=active]:text-black hover:bg-[#e03d00] transition-all duration-300"
              >
                Mis Ideas
              </TabsTrigger>
              <TabsTrigger 
                value="submit" 
                className="data-[state=active]:bg-[#cc3700] data-[state=active]:text-black hover:bg-[#e03d00] transition-all duration-300"
              >
                Crear Idea
              </TabsTrigger>
              <TabsTrigger 
                value="myrequests" 
                className="data-[state=active]:bg-[#cc3700] data-[state=active]:text-black hover:bg-[#e03d00] transition-all duration-300"
              >
                Mis Solicitudes
              </TabsTrigger>
              <TabsTrigger 
                value="applications" 
                className="data-[state=active]:bg-[#cc3700] data-[state=active]:text-black hover:bg-[#e03d00] transition-all duration-300"
              >
                Aplicaciones
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <AnimatePresence mode="wait">
            <TabsContent value="myideas" key="myideas">
              <motion.div
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <MyIdeasTab userIdeas={userIdeas} />
              </motion.div>
            </TabsContent>

            <TabsContent value="submit" key="submit">
              <motion.div
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle>Crear Nueva Idea</CardTitle>
                    <CardDescription>
                      Comparte tu idea de proyecto y encuentra colaboradores talentosos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <IdeaSubmissionForm onSuccess={() => setActiveTab('myideas')} />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="myrequests" key="myrequests">
              <motion.div
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <MyRequestsTab />
              </motion.div>
            </TabsContent>

            <TabsContent value="applications" key="applications">
              <motion.div
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <ApplicationsTab />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </>
  );
}