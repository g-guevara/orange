"use client";

import { useState, useEffect } from 'react';
import { useIdeas } from '@/contexts/ideas-context';
import IdeaCard from '@/components/idea-card';
import ParticleBackground from '@/components/canvas/particles';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Home() {
  const { ideas, isLoading } = useIdeas();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProfession, setSelectedProfession] = useState<string | null>(null);
  const [filteredIdeas, setFilteredIdeas] = useState(ideas);

  // Obtener categorías y profesiones únicas para los filtros
  const categories = Array.from(new Set(ideas.map(idea => idea.category)));
  const allProfessions = ideas.flatMap(idea => idea.professions);
  const professions = Array.from(new Set(allProfessions));

  useEffect(() => {
    let results = ideas;
    
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      results = results.filter(idea => 
        idea.title.toLowerCase().includes(lowerCaseSearch) || 
        idea.shortDescription.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    if (selectedCategory) {
      results = results.filter(idea => idea.category === selectedCategory);
    }
    
    if (selectedProfession) {
      results = results.filter(idea => 
        idea.professions.some(profession => profession === selectedProfession)
      );
    }
    
    setFilteredIdeas(results);
  }, [searchTerm, selectedCategory, selectedProfession, ideas]);

  return (
    <>
      <ParticleBackground />
      
      <div className="min-h-screen">
        <section className="pt-20 pb-32 px-4 sm:px-6 flex flex-col items-center justify-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-9xl font-bold mb-6">
<span style={{
  fontFamily: "'Inter', sans-serif",
  fontSize: "6.5rem",
  fontWeight: "900",
  color: "#FF4500",
  animation: "neonGlow 4s ease-in-out infinite",
  textShadow: `
    0 0 5px #FF4500,
    0 0 10px #FF4500,
    0 0 20px #FF4500,
    0 0 40px #FF4500,
    0 0 80px #FF4500
  `,
  transform: "scaleX(1.8)",
  display: "inline-block", // necesario para que scaleX funcione correctamente
}}>
  IDEALINK
</span>
<style>{`
  @keyframes neonGlow {
    0%, 100% {
      text-shadow: 0 0 5px #FF4500, 0 0 10px #FF4500, 0 0 20px #FF4500, 0 0 40px #FF4500, 0 0 80px #FF4500;
      color: #FF4500;
    }
    50% {
      text-shadow: 0 0 2px #FF4500, 0 0 4px #FF4500, 0 0 8px #FF4500, 0 0 20px #FF4500, 0 0 40px #FF4500;
      color: #FF4500;
    }
  }
`}</style>

          </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Conecta con personas talentosas para transformar tu visión en realidad o únete a proyectos que coincidan con tus habilidades.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-xl relative"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              type="text"
              placeholder="Buscar ideas..."
              className="pl-10 py-6 bg-zinc-900/70 border-zinc-800 focus-visible:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl pb-20">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
            <div className="w-full md:w-64">
              <div className="flex items-center gap-2 mb-4">
                <Filter size={16} className="text-muted-foreground" />
                <h3 className="font-medium">Categorías</h3>
              </div>
              <Select
                value={selectedCategory || "all"}
                onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-full bg-zinc-900/70 border-zinc-800">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-64">
              <div className="flex items-center gap-2 mb-4">
                <Filter size={16} className="text-muted-foreground" />
                <h3 className="font-medium">Profesiones</h3>
              </div>
              <Select
                value={selectedProfession || "all"}
                onValueChange={(value) => setSelectedProfession(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-full bg-zinc-900/70 border-zinc-800">
                  <SelectValue placeholder="Seleccionar profesión" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="all">Todas las profesiones</SelectItem>
                  {professions.map((profession) => (
                    <SelectItem key={profession} value={profession}>
                      {profession}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 h-64">
                    <div className="h-6 bg-zinc-800 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-zinc-800 rounded w-full mb-2"></div>
                    <div className="h-4 bg-zinc-800 rounded w-2/3 mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-zinc-800 rounded w-16"></div>
                      <div className="h-6 bg-zinc-800 rounded w-20"></div>
                    </div>
                    <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredIdeas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIdeas.map((idea, index) => (
                <IdeaCard key={idea.id} idea={idea} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl mb-2">No hay ideas que coincidan con tu búsqueda</h3>
              <p className="text-muted-foreground">Intenta ajustar tus filtros o término de búsqueda</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}