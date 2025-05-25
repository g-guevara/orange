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
import { Loader2, Plus, X } from 'lucide-react';

const categories = [
  'Mobile App',
  'Web App',
  'Web Platform',
  'Desktop App',
  'Game',
  'AI/ML Project',
  'VR/AR Experience',
  'IoT Project',
  'Blockchain',
  'Other'
];

const ideaSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }).max(100),
  shortDescription: z.string().min(20, { message: 'Short description must be at least 20 characters' }).max(200),
  longDescription: z.string().min(100, { message: 'Long description must be at least 100 characters' }),
  category: z.string({ required_error: 'Please select a category' }),
  timeRequired: z.string().min(3, { message: 'Please enter estimated time required' }),
  isPaid: z.boolean().default(false),
  membersNeeded: z.coerce.number().int().min(1).max(20),
  professions: z.array(z.string()).min(1, { message: 'Please add at least one required profession' })
});

type IdeaFormValues = z.infer<typeof ideaSchema>;

interface IdeaSubmissionFormProps {
  onSuccess: () => void;
}

export default function IdeaSubmissionForm({ onSuccess }: IdeaSubmissionFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProfession, setNewProfession] = useState('');
  
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

  const { control, watch, setValue } = form;
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
      // In a real app, this would send data to an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Idea submitted:', values);
      onSuccess();
    } catch (error) {
      console.error('Error submitting idea:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="A brief, catchy title for your idea" {...field} className="bg-zinc-950/50 border-zinc-800" />
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
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="A brief overview (will appear in the idea cards)" 
                  {...field} 
                  className="bg-zinc-950/50 border-zinc-800"
                />
              </FormControl>
              <FormDescription>Keep this concise, around 1-2 sentences.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="longDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detailed Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Provide a comprehensive description of your idea" 
                  {...field} 
                  rows={6}
                  className="bg-zinc-950/50 border-zinc-800"
                />
              </FormControl>
              <FormDescription>
                Include the problem you're solving, the solution approach, potential challenges, etc.
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
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-zinc-950/50 border-zinc-800">
                      <SelectValue placeholder="Select a category" />
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
                <FormLabel>Time Required</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., 2-3 months" 
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
                <FormLabel>Team Members Needed</FormLabel>
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
                  <FormLabel>This is a paid project</FormLabel>
                  <FormDescription>
                    Check this if team members will be compensated
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
              <FormLabel>Required Professions</FormLabel>
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
                      className="text-muted-foreground hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="e.g., Frontend Developer"
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
                >
                  <Plus size={16} />
                </Button>
              </div>
              <FormDescription>
                Add all the professions required for your project
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Idea'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}