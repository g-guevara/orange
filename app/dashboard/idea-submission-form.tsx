"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { useIdeas } from '@/contexts/ideas-context';
import { Loader2, Plus, X, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  'Aplicación Móvil',
  'Aplicación Web',
  'Plataforma Web',
  'Aplicación de Escritorio',
  'Juego',
  'Proyecto de IA/ML',
  'Experiencia VR/AR',
  'Proyecto IoT',
  'Blockchain',
  'Otro'
];

const ideaSchema = z.object({
  title: z.string().min(5, { message: 'El título debe tener al menos 5 caracteres' }).max(100),
  shortDescription: z.string().min(20, { message: 'La descripción corta debe tener al menos 20 caracteres' }).max(200),
  longDescription: z.string().min(100, { message: 'La descripción larga debe tener al menos 100 caracteres' }),
  category: z.string({ required_error: 'Por favor selecciona una categoría' }),
  timeRequired: z.string().min(3, { message: 'Por favor ingresa el tiempo estimado requerido' }),
  isPaid: z.boolean().default(false),
  membersNeeded: z.coerce.number().int().min(1).max(20),
  professions: z.array(z.string()).min(1, { message: 'Por favor agrega al menos una profesión requerida' })
});

type IdeaFormValues = z.infer<typeof ideaSchema>;

interface IdeaSubmissionFormProps {
  onSuccess: () => void;
}

export default function IdeaSubmissionForm({ onSuccess }: IdeaSubmissionFormProps) {
  const { user } = useAuth();
  const { addIdea } = useIdeas();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProfession, setNewProfession] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const form = useForm<IdeaFormValues>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      title: '',
      shortDescription: '',
      longDescription: '',
      category: '',
      timeRequired: '',
      isPaid: false,
      membersNeeded: 3,
      professions: []
    }
  });

  const { control, watch, setValue, reset } = form;
  const professions = watch('professions') || [];

  const handleAddProfession = () => {
    if (newProfession.trim() !== '' && !professions.includes(newProfession.trim())) {
      setValue('professions', [...professions, newProfession.trim()]);
      setNewProfession('');
    }
  };

  const handleRemoveProfession = (profession: string) => {
    setValue('professions', professions.filter(p => p !== profession));
  };

  const onSubmit = async (values: IdeaFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      await addIdea({
        ...values,
        author: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });

      setSubmitSuccess(true);
      reset();
      
      // Mostrar mensaje de éxito por 2 segundos y luego llamar onSuccess
      setTimeout(() => {
        setSubmitSuccess(false);
        onSuccess();
      }, 2000);
      
    } catch (error) {
      console.error('Error al enviar la idea:', error);
      // Aquí podrías mostrar un toast de error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">¡Idea Publicada Exitosamente!</h3>
        <p className="text-muted-foreground">
          Tu idea ha sido publicada y ya está disponible para que otros colaboradores la vean.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Un título breve y atractivo para tu idea" {...field} className="bg-zinc-950/50 border-zinc-800" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <FormField
              control={control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción Corta</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Una descripción breve (aparecerá en las tarjetas de ideas)" 
                      {...field} 
                      className="bg-zinc-950/50 border-zinc-800"
                    />
                  </FormControl>
                  <FormDescription>Manténlo conciso, alrededor de 1-2 oraciones.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <FormField
              control={control}
              name="longDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción Detallada</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Proporciona una descripción completa de tu idea" 
                      {...field} 
                      rows={6}
                      className="bg-zinc-950/50 border-zinc-800"
                    />
                  </FormControl>
                  <FormDescription>
                    Incluye el problema que resuelves, el enfoque de la solución, posibles desafíos, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <FormField
                control={control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-950/50 border-zinc-800">
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <FormField
                control={control}
                name="timeRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiempo Requerido</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ej. 2-3 meses" 
                        {...field} 
                        className="bg-zinc-950/50 border-zinc-800"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <FormField
                control={control}
                name="membersNeeded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Miembros del Equipo Necesarios</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1} 
                        max={20} 
                        {...field} 
                        className="bg-zinc-950/50 border-zinc-800"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <FormField
                control={control}
                name="isPaid"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-start space-x-3 space-y-0 rounded-md border border-zinc-800 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Este es un proyecto pagado</FormLabel>
                      <FormDescription>
                        Marca esto si los miembros del equipo serán compensados
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <FormField
              control={control}
              name="professions"
              render={() => (
                <FormItem>
                  <FormLabel>Profesiones Requeridas</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {professions.map((profession) => (
                      <motion.div 
                        key={profession}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center space-x-1 px-3 py-1 rounded-full bg-zinc-800 text-sm"
                      >
                        <span>{profession}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveProfession(profession)}
                          className="text-muted-foreground hover:text-white transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="ej. Desarrollador Frontend"
                      value={newProfession}
                      onChange={(e) => setNewProfession(e.target.value)}
                      className="bg-zinc-950/50 border-zinc-800"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddProfession();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={handleAddProfession}
                      className="shrink-0"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <FormDescription>
                    Agrega todas las profesiones necesarias para tu proyecto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div 
            className="flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.9 }}
          >
            <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Crear Idea'
              )}
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}