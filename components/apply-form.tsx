"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useApplications } from '@/contexts/applications-context';
import { motion } from 'framer-motion';

const applicationSchema = z.object({
  name: z.string().min(2, { message: 'El nombre es requerido' }),
  email: z.string().email({ message: 'Por favor ingresa un correo válido' }),
  coverLetter: z.string().min(50, { message: 'La carta de presentación debe tener al menos 50 caracteres' }),
  cvLink: z.string().url({ message: 'Por favor proporciona una URL válida para tu CV/currículum' })
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface ApplyFormProps {
  ideaId: string;
  onSubmit: () => void;
}

export default function ApplyForm({ ideaId, onSubmit }: ApplyFormProps) {
  const { user } = useAuth();
  const { addApplication } = useApplications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      coverLetter: '',
      cvLink: ''
    }
  });

  const handleSubmit = async (values: ApplicationFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await addApplication({
        ideaId,
        userId: user.id,
        name: values.name,
        email: values.email,
        coverLetter: values.coverLetter,
        cvLink: values.cvLink
      });
      
      onSubmit();
    } catch (error: any) {
      console.error('Error al enviar la aplicación:', error);
      setError(error.message || 'Error al enviar la aplicación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onSubmit(); // Esto cerrará el formulario
  };

  return (
    <motion.div 
      className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-6">Aplicar a este proyecto</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-md">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Pérez" {...field} className="bg-zinc-950/50 border-zinc-800" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="tu@ejemplo.com" type="email" {...field} className="bg-zinc-950/50 border-zinc-800" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="coverLetter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carta de Presentación</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Explica por qué estás interesado en este proyecto y qué habilidades puedes aportar..." 
                    {...field} 
                    rows={6}
                    className="bg-zinc-950/50 border-zinc-800"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cvLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enlace a CV/Currículum</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://drive.google.com/tu-cv" 
                    {...field} 
                    className="bg-zinc-950/50 border-zinc-800"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Aplicación'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}