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

const applicationSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  coverLetter: z.string().min(50, { message: 'Cover letter should be at least 50 characters' }),
  cvLink: z.string().url({ message: 'Please provide a valid URL to your CV/resume' })
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface ApplyFormProps {
  ideaId: string;
  onSubmit: () => void;
}

export default function ApplyForm({ ideaId, onSubmit }: ApplyFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send data to an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Application submitted:', { ideaId, ...values });
      onSubmit();
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
      <h2 className="text-xl font-semibold mb-6">Apply for this project</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className="bg-zinc-950/50 border-zinc-800" />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" type="email" {...field} className="bg-zinc-950/50 border-zinc-800" />
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
                <FormLabel>Cover Letter</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Explain why you're interested in this project and what skills you can bring..." 
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
                <FormLabel>CV/Resume Link</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://drive.google.com/your-cv" 
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
              onClick={() => onSubmit()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}