"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import ParticleBackground from '@/components/canvas/particles';

const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor ingresa un correo válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await login(values.email, values.password);
      router.push('/');
    } catch (error) {
      setError('Correo o contraseña inválidos. Prueba con demo@example.com / password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ParticleBackground />
      
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md bg-[#2a1000]/50 border-[#FF4500]/30">
          <CardHeader className="space-y-4 text-center">
            <CardTitle className="text-4xl font-black tracking-tight bg-gradient-to-r from-[#FF4500] to-[#ffb688] text-transparent bg-clip-text" style={{ fontFamily: "'Inter', sans-serif" }}>
              Bienvenido de nuevo
            </CardTitle>
            <CardDescription className="text-lg">
              Inicia sesión en tu cuenta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="tu@ejemplo.com" 
                          {...field} 
                          className="bg-[#1a0800] border-[#FF4500]/20 focus-visible:ring-[#FF4500]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Contraseña</FormLabel>
                        <Link href="#" className="text-xs text-[#FF4500] hover:text-[#FF6B35]">
                          ¿Olvidaste tu contraseña?
                        </Link>
                      </div>
                      <FormControl>
                        <Input 
                          placeholder="••••••••" 
                          type="password" 
                          {...field} 
                          className="bg-[#1a0800] border-[#FF4500]/20 focus-visible:ring-[#FF4500]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {error && (
                  <div className="p-3 text-sm rounded-md bg-red-500/10 text-red-400 border border-red-500/20">
                    {error}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#FF4500] hover:bg-[#FF6B35]" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-[#FF4500]/20" />
              </div>
              {/* <div className="relative flex justify-center text-xs">
                <span className="bg-[#2a1000] px-2 text-muted-foreground">
                  O continuar con
                </span>
              </div> */}
            </div>
            
            {/* <div className="flex flex-col space-y-2">
              <Button 
                variant="outline" 
                className="bg-[#1a0800] border-[#FF4500]/20 hover:bg-[#2a1000]"
              >
                Continuar con Google
              </Button>
              <Button 
                variant="outline" 
                className="bg-[#1a0800] border-[#FF4500]/20 hover:bg-[#2a1000]"
              >
                Continuar con GitHub
              </Button>
            </div> */}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              ¿No tienes una cuenta?{' '}
              <Link href="/register" className="text-[#FF4500] hover:text-[#FF6B35] hover:underline">
                Regístrate
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}