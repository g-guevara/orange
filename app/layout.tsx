import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/header';
import { AuthProvider } from '@/hooks/use-auth';
import { IdeasProvider } from '@/contexts/ideas-context';
import { ApplicationsProvider } from '@/contexts/applications-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IdeaLink - Connect & Build',
  description: 'Share your ideas ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#1a0800] text-white min-h-screen border-[#FF4500] border-4`}>
        <ThemeProvider>
          <AuthProvider>
            <IdeasProvider>
              <ApplicationsProvider>
                <Header />
                <main className="pt-16">{children}</main>
              </ApplicationsProvider>
            </IdeasProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}