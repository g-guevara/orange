// app/idea/[id]/page.tsx
import { notFound } from 'next/navigation';

// This function tells Next.js which dynamic routes to pre-generate
export async function generateStaticParams() {
  // Option 1: Static list of IDs
  const ideas = [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    // Add all your idea IDs here
  ];

  return ideas.map((idea) => ({
    id: idea.id,
  }));

  // Option 2: Uncomment below and comment above if fetching from API
  /*
  try {
    const response = await fetch('https://your-api.com/ideas');
    const ideas = await response.json();
    
    return ideas.map((idea: any) => ({
      id: idea.id.toString(),
    }));
  } catch (error) {
    console.error('Error fetching ideas for static generation:', error);
    return [];
  }
  */
}

// Your page component
interface PageProps {
  params: {
    id: string;
  };
}

export default function IdeaPage({ params }: PageProps) {
  const { id } = params;

  // Your existing page logic here
  // If the idea doesn't exist, call notFound()
  
  return (
    <div>
      <h1>Idea {id}</h1>
      {/* Your page content */}
    </div>
  );
}

// Optional: Generate metadata for each page
export async function generateMetadata({ params }: PageProps) {
  const { id } = params;
  
  return {
    title: `Idea ${id}`,
    description: `Details for idea ${id}`,
  };
}