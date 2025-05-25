"use client";

import { useState, useEffect } from 'react';
import { ideas } from '@/data/ideas';
import IdeaCard from '@/components/idea-card';
import ParticleBackground from '@/components/canvas/particles';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Obtener categorías y profesiones únicas para los filtros
const categories = Array.from(new Set(ideas.map(idea => idea.category)));
const allProfessions = ideas.flatMap(idea => idea.professions);
const professions = Array.from(new Set(allProfessions));

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProfession, setSelectedProfession] = useState<string | null>(null);
  const [filteredIdeas, setFilteredIdeas] = useState(ideas);

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
  }, [searchTerm, selectedCategory, selectedProfession]);

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
          <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-black-900">IDEAPAD</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Conecta con personas talentosas para transformar tu visión en realidad o únete a proyectos  que coincidan con tus habilidades.
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

          {filteredIdeas.length > 0 ? (
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