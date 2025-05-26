import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface RouteParams {
  params: {
    id: string;
  };
}

// PATCH - Actualizar una idea
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const updateData = await request.json();

    // Validar que el ID sea válido
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID de idea inválido' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const ideasCollection = db.collection('ideas');

    // Verificar que la idea existe
    const existingIdea = await ideasCollection.findOne({ _id: new ObjectId(id) });
    if (!existingIdea) {
      return NextResponse.json(
        { error: 'Idea no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que el usuario sea el autor de la idea
    if (existingIdea.author.id !== updateData.authorId) {
      return NextResponse.json(
        { error: 'No tienes permisos para editar esta idea' },
        { status: 403 }
      );
    }

    // Preparar los datos de actualización
    const updatePayload = {
      title: updateData.title,
      shortDescription: updateData.shortDescription,
      longDescription: updateData.longDescription,
      category: updateData.category,
      timeRequired: updateData.timeRequired,
      isPaid: Boolean(updateData.isPaid),
      membersNeeded: Number(updateData.membersNeeded),
      professions: updateData.professions,
      updatedAt: new Date().toISOString()
    };

    // Actualizar la idea
    const result = await ideasCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatePayload }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Error al actualizar la idea' },
        { status: 500 }
      );
    }

    // Obtener la idea actualizada
    const updatedIdea = await ideasCollection.findOne({ _id: new ObjectId(id) });
    
    // Verificar que la idea actualizada existe
    if (!updatedIdea) {
      return NextResponse.json(
        { error: 'Error al obtener la idea actualizada' },
        { status: 500 }
      );
    }
    
    const transformedIdea = {
      id: updatedIdea._id.toString(),
      title: updatedIdea.title,
      shortDescription: updatedIdea.shortDescription,
      longDescription: updatedIdea.longDescription,
      category: updatedIdea.category,
      timeRequired: updatedIdea.timeRequired,
      isPaid: updatedIdea.isPaid,
      membersNeeded: updatedIdea.membersNeeded,
      professions: updatedIdea.professions,
      author: updatedIdea.author,
      createdAt: updatedIdea.createdAt,
      updatedAt: updatedIdea.updatedAt
    };

    return NextResponse.json({
      success: true,
      idea: transformedIdea
    });

  } catch (error) {
    console.error('Error updating idea:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una idea
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Validar que el ID sea válido
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID de idea inválido' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const ideasCollection = db.collection('ideas');
    const applicationsCollection = db.collection('applications');

    // Verificar que la idea existe y que el usuario sea el autor
    const existingIdea = await ideasCollection.findOne({ _id: new ObjectId(id) });
    if (!existingIdea) {
      return NextResponse.json(
        { error: 'Idea no encontrada' },
        { status: 404 }
      );
    }

    if (existingIdea.author.id !== userId) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar esta idea' },
        { status: 403 }
      );
    }

    // Eliminar todas las aplicaciones relacionadas con esta idea
    await applicationsCollection.deleteMany({ ideaId: id });

    // Eliminar la idea
    const result = await ideasCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Error al eliminar la idea' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Idea eliminada correctamente'
    });

  } catch (error) {
    console.error('Error deleting idea:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}