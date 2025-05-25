"use client";

import { Idea } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { formatDistance } from 'date-fns';

interface IdeaCardProps {
  idea: Idea;
  index: number;
}

export default function IdeaCard({ idea, index }: IdeaCardProps) {
  const router = useRouter();

  const fadeInUp = {
    initial: { y: 30, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
    hover: { 
      y: -5,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="h-full"
      onClick={() => router.push(`/idea?id=${idea.id}`)}
    >
      <Card className="h-full hover:bg-zinc-900 border-zinc-800 transition-colors duration-300 overflow-hidden group cursor-pointer">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
            {idea.title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {formatDistance(new Date(idea.createdAt), new Date(), { addSuffix: true })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{idea.shortDescription}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {idea.professions.slice(0, 3).map((profession, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {profession}
              </Badge>
            ))}
            {idea.professions.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{idea.professions.length - 3} más
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-zinc-800 hover:bg-zinc-800 text-xs">
              {idea.category}
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {idea.isPaid ? 'Pagado' : 'Voluntario'}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-zinc-800 pt-4">
          <div className="text-sm text-muted-foreground">
            {idea.membersNeeded} miembro{idea.membersNeeded !== 1 ? 's' : ''} necesario{idea.membersNeeded !== 1 ? 's' : ''}
          </div>
          <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform duration-300" />
        </CardFooter>
      </Card>
    </motion.div>
  );
}