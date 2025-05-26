"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, X } from 'lucide-react';
import { Idea } from '@/types';
import { useIdeas } from '@/contexts/ideas-context';
import { useAuth } from '@/hooks/use-auth';

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

interface EditIdeaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idea: Idea;
  onSuccess?: () => void;
}

export default function EditIdeaDialog({ open, onOpenChange, idea, onSuccess }: EditIdeaDialogProps) {
  const { user } = useAuth();
  const { updateIdea } = useIdeas();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProfession, setNewProfession] = useState('');
  
  const form = useForm<IdeaFormValues>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      title: idea.title,
      shortDescription: idea.shortDescription,
      longDescription: idea.longDescription,
      category: idea.category,
      timeRequired: idea.timeRequired,
      isPaid: idea.isPaid,
      membersNeeded: idea.membersNeeded,
      professions: idea.professions
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
      await updateIdea(idea.id, values, user.id);
      onOpenChange(false);
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error al actualizar la idea:', error);
      // Aquí podrías mostrar un toast de error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle>Editar Idea</DialogTitle>
          <DialogDescription>
            Modifica los detalles de tu idea de proyecto
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
            
            <FormField
              control={control}
              name="professions"
              render={() => (
                <FormItem>
                  <FormLabel>Profesiones Requeridas</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {professions.map((profession) => (
                      <div 
                        key={profession}
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
                      </div>
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
            
            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  'Actualizar Idea'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}