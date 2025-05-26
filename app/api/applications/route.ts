import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json();
    
    // Validar datos requeridos
    const { ideaId, userId, name, email, coverLetter, cvLink } = applicationData;
    
    if (!ideaId || !userId || !name || !email || !coverLetter || !cvLink) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const applicationsCollection = db.collection('applications');
    const ideasCollection = db.collection('ideas');

    // Verificar que la idea existe
    const idea = await ideasCollection.findOne({ _id: new ObjectId(ideaId) });
    if (!idea) {
      return NextResponse.json(
        { error: 'La idea no existe' },
        { status: 404 }
      );
    }

    // Verificar que el usuario no esté aplicando a su propia idea
    if (idea.author.id === userId) {
      return NextResponse.json(
        { error: 'No puedes aplicar a tu propia idea' },
        { status: 400 }
      );
    }

    // Verificar que el usuario no haya aplicado ya a esta idea
    const existingApplication = await applicationsCollection.findOne({
      ideaId,
      userId
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'Ya has aplicado a esta idea' },
        { status: 400 }
      );
    }

    // Crear la nueva aplicación
    const newApplication = {
      ideaId,
      ideaTitle: idea.title,
      userId,
      name,
      email,
      coverLetter,
      cvLink,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await applicationsCollection.insertOne(newApplication);

    // Retornar la aplicación creada con el ID generado
    const createdApplication = {
      id: result.insertedId.toString(),
      ...newApplication
    };

    return NextResponse.json({
      success: true,
      application: createdApplication
    });

  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const ideaAuthorId = searchParams.get('ideaAuthorId');

    const db = await getDatabase();
    const applicationsCollection = db.collection('applications');
    
    let query = {};

    // Si se proporciona userId, obtener las aplicaciones del usuario
    if (userId) {
      query = { userId };
    }
    // Si se proporciona ideaAuthorId, obtener aplicaciones para las ideas del autor
    else if (ideaAuthorId) {
      const ideasCollection = db.collection('ideas');
      const userIdeas = await ideasCollection.find({ 'author.id': ideaAuthorId }).toArray();
      const ideaIds = userIdeas.map(idea => idea._id.toString());
      query = { ideaId: { $in: ideaIds } };
    }

    // Obtener aplicaciones ordenadas por fecha de creación (más recientes primero)
    const applications = await applicationsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // Transformar las aplicaciones para incluir el id como string
    const transformedApplications = applications.map(app => ({
      id: app._id.toString(),
      ideaId: app.ideaId,
      ideaTitle: app.ideaTitle,
      userId: app.userId,
      name: app.name,
      email: app.email,
      coverLetter: app.coverLetter,
      cvLink: app.cvLink,
      status: app.status,
      createdAt: app.createdAt
    }));

    return NextResponse.json({
      success: true,
      applications: transformedApplications
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}