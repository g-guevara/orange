"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import ParticleBackground from '@/components/canvas/particles';
import IdeaSubmissionForm from './idea-submission-form';
import MyIdeasTab from './my-ideas-tab';
import ApplicationsTab from '@/components/dashboard/applications-tab';
import MyRequestsTab from '@/components/dashboard/my-requests-tab';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('myideas');

  // Redirect to login if not authenticated
  if (!user) {
    typeof window !== 'undefined' && router.push('/login');
    return null;
  }

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

  const handleCreateIdea = () => {
    setActiveTab('submit');
  };

  const handleIdeaSuccess = () => {
    setActiveTab('myideas');
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
                <MyIdeasTab onCreateIdea={handleCreateIdea} />
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
                    <IdeaSubmissionForm onSuccess={handleIdeaSuccess} />
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