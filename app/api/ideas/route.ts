import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const ideaData = await request.json();
    
    // Validar datos requeridos
    const { title, shortDescription, longDescription, category, timeRequired, isPaid, membersNeeded, professions, authorId, authorName, authorEmail } = ideaData;
    
    if (!title || !shortDescription || !longDescription || !category || !timeRequired || membersNeeded === undefined || !professions?.length || !authorId) {
      return NextResponse.json(
        { error: 'Todos los campos requeridos deben estar completos' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const ideasCollection = db.collection('ideas');

    // Crear la nueva idea
    const newIdea = {
      title,
      shortDescription,
      longDescription,
      category,
      timeRequired,
      isPaid: Boolean(isPaid),
      membersNeeded: Number(membersNeeded),
      professions,
      author: {
        id: authorId,
        name: authorName,
        email: authorEmail
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await ideasCollection.insertOne(newIdea);

    // Retornar la idea creada con el ID generado
    const createdIdea = {
      id: result.insertedId.toString(),
      ...newIdea
    };

    return NextResponse.json({
      success: true,
      idea: createdIdea
    });

  } catch (error) {
    console.error('Error creating idea:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getDatabase();
    const ideasCollection = db.collection('ideas');
    
    // Obtener todas las ideas, ordenadas por fecha de creación (más recientes primero)
    const ideas = await ideasCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Transformar las ideas para incluir el id como string
    const transformedIdeas = ideas.map(idea => ({
      id: idea._id.toString(),
      title: idea.title,
      shortDescription: idea.shortDescription,
      longDescription: idea.longDescription,
      category: idea.category,
      timeRequired: idea.timeRequired,
      isPaid: idea.isPaid,
      membersNeeded: idea.membersNeeded,
      professions: idea.professions,
      author: idea.author,
      createdAt: idea.createdAt
    }));

    return NextResponse.json({
      success: true,
      ideas: transformedIdeas
    });

  } catch (error) {
    console.error('Error fetching ideas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}