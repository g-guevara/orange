"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, LogIn, UserPlus, Pause, Play } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useAnimationState } from '@/hooks/use-animation-state';
import { motion } from 'framer-motion';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isAnimating, toggleAnimation } = useAnimationState();

  const navRef = useRef<HTMLDivElement>(null);
  const [indicatorProps, setIndicatorProps] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const activeLink = navRef.current?.querySelector(`[data-path="${pathname}"]`) as HTMLElement;
    if (activeLink) {
      setIndicatorProps({
        left: activeLink.offsetLeft,
        width: activeLink.offsetWidth,
      });
    }
  }, [pathname]);

  const NavItem = ({ href, title }: { href: string; title: string }) => (
    <Link
      href={href}
      data-path={href}
      className={cn(
        'relative text-sm font-medium transition-colors px-2',
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
          <span className="font-bold text-xl tracking-tight">IdeaLink</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4 relative" ref={navRef}>
          {/* Línea animada */}
          <motion.div
            className="absolute bottom-0 h-[2px] bg-white"
            animate={{ left: indicatorProps.left, width: indicatorProps.width }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
          {/* Botón animación */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAnimation}
            className="flex items-center gap-1 text-muted-foreground"
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
    </header>
  );
}
