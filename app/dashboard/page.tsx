"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import ParticleBackground from '@/components/canvas/particles';
import IdeaSubmissionForm from './idea-submission-form';
import MyIdeasTab from './my-ideas-tab';
import ApplicationsTab from '@/components/dashboard/applications-tab';
import MyRequestsTab from '@/components/dashboard/my-requests-tab';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('myideas');

  const navRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  if (!user) {
    typeof window !== 'undefined' && router.push('/login');
    return null;
  }

  const tabList = [
    { value: 'myideas', label: 'Mis Ideas' },
    { value: 'submit', label: 'Crear Idea' },
    { value: 'myrequests', label: 'Mis Solicitudes' },
    { value: 'applications', label: 'Aplicaciones' },
  ];

  const tabVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  };

  const handleCreateIdea = () => setActiveTab('submit');
  const handleIdeaSuccess = () => setActiveTab('myideas');

  useEffect(() => {
    const activeEl = navRef.current?.querySelector(`[data-value="${activeTab}"]`) as HTMLElement;
    if (activeEl) {
      setIndicator({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
      });
    }
  }, [activeTab]);

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
            <div className="relative mb-8" ref={navRef}>
              <div className="grid grid-cols-4 bg-[#FF4500] text-black rounded-md overflow-hidden shadow-[0_0_10px_#FF4500,0_0_20px_#FF4500,0_0_30px_#FF4500] relative">
                {/* Animated background behind active tab */}
                <motion.div
                  className="absolute top-0 bottom-0 bg-[#cc3700] z-0 rounded-md"
                  animate={{ left: indicator.left, width: indicator.width }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />

                {/* Tab buttons */}
                {tabList.map((tab) => (
                  <button
                    key={tab.value}
                    data-value={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={cn(
                      'relative z-10 text-sm font-medium transition-all duration-300 px-4 py-2',
                      activeTab === tab.value ? 'text-black' : 'text-black/70'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {activeTab === 'myideas' && (
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
            )}

            {activeTab === 'submit' && (
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
            )}

            {activeTab === 'myrequests' && (
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
            )}

            {activeTab === 'applications' && (
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
            )}
          </AnimatePresence>
        </Tabs>
      </div>
    </>
  );
}
