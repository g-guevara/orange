"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, LogIn, UserPlus, Pause, Play } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useAnimationState } from '@/hooks/use-animation-state';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isAnimating, toggleAnimation } = useAnimationState();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavItem = ({ href, title }: { href: string; title: string }) => (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors hover:text-primary',
        pathname === href ? 'text-white' : 'text-muted-foreground'
      )}
      onClick={() => setIsOpen(false)}
    >
      {title}
    </Link>
  );

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-sm',
        scrolled ? 'bg-black/80 shadow-md' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl tracking-tight">IdeaSphere</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAnimation}
            className="flex items-center gap-1"
          >
            {isAnimating ? (
              <>
                <Pause size={16} />
                <span>Detener Animación</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>Iniciar Animación</span>
              </>
            )}
          </Button>
          
          <NavItem href="/" title="Explorar Ideas" />
          {user ? (
            <>
              <NavItem href="/dashboard" title="Dashboard" />
              <Button variant="ghost" onClick={logout}>
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <LogIn size={16} />
                  <span>Iniciar Sesión</span>
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <UserPlus size={16} />
                  <span>Registrarse</span>
                </Button>
              </Link>
            </>
          )}
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 py-4 bg-black/95 backdrop-blur-md">
          <nav className="flex flex-col space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAnimation}
              className="flex items-center gap-1 justify-start"
            >
              {isAnimating ? (
                <>
                  <Pause size={16} />
                  <span>Detener Animación</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>Iniciar Animación</span>
                </>
              )}
            </Button>
            
            <NavItem href="/" title="Explorar Ideas" />
            {user ? (
              <>
                <NavItem href="/dashboard" title="Dashboard" />
                <Button variant="ghost" onClick={logout} className="justify-start">
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="w-full">
                  <Button variant="ghost" className="w-full justify-start">
                    <LogIn size={16} className="mr-2" />
                    <span>Iniciar Sesión</span>
                  </Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <UserPlus size={16} className="mr-2" />
                    <span>Registrarse</span>
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}