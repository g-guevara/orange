import { Idea } from '@/types';

export const ideas: Idea[] = [
  {
    id: '1',
    title: 'Asistente de Compras con RA',
    shortDescription: 'Una aplicación de realidad aumentada que ayuda a los usuarios a navegar por tiendas físicas y encontrar productos',
    longDescription: 
      'Esta aplicación utilizará realidad aumentada para guiar a los compradores a través de las tiendas, destacar ofertas y localizar artículos específicos en su lista de compras. Incluirá mapeo interior, reconocimiento de productos y recomendaciones personalizadas basadas en el historial de compras.',
    professions: ['Desarrollador Móvil', 'Especialista en RA/RV', 'Diseñador UI/UX', 'Desarrollador Backend'],
    category: 'Aplicación Móvil',
    timeRequired: '6-8 meses',
    isPaid: true,
    membersNeeded: 4,
    author: {
      id: '101',
      name: 'Alex Johnson',
      email: 'alex@example.com'
    },
    createdAt: '2023-11-10T14:30:00Z'
  },
  {
    id: '2',
    title: 'Analizador de Contenido con IA',
    shortDescription: 'Una herramienta que analiza y mejora el contenido escrito usando IA',
    longDescription: 
      'Esta aplicación web ayudará a los escritores a mejorar su contenido analizando tono, legibilidad, optimización SEO y gramática. Proporcionará sugerencias de mejora y permitirá a los usuarios ver cómo los cambios afectan su puntuación general de calidad del contenido.',
    professions: ['Ingeniero de IA', 'Desarrollador Full-stack', 'Especialista en NLP', 'Diseñador UI'],
    category: 'Aplicación Web',
    timeRequired: '4-5 meses',
    isPaid: true,
    membersNeeded: 3,
    author: {
      id: '102',
      name: 'Sofía Chen',
      email: 'sofia@example.com'
    },
    createdAt: '2023-12-05T09:15:00Z'
  },
  {
    id: '3',
    title: 'Planificador de Huertos Comunitarios',
    shortDescription: 'Una aplicación para ayudar a las comunidades a planificar y gestionar espacios de jardín compartidos',
    longDescription: 
      'Esta plataforma permitirá a los miembros de la comunidad planificar colaborativamente diseños de jardines, programar tareas de mantenimiento, seguir el crecimiento de las plantas y compartir cosechas. Incluirá funciones para la planificación de rotación de cultivos, integración meteorológica y coordinación de eventos comunitarios.',
    professions: ['Desarrollador Full-stack', 'Diseñador UI/UX', 'Desarrollador Móvil'],
    category: 'Aplicación Móvil y Web',
    timeRequired: '3-4 meses',
    isPaid: false,
    membersNeeded: 3,
    author: {
      id: '103',
      name: 'Marcos Verde',
      email: 'marcos@example.com'
    },
    createdAt: '2024-01-15T11:45:00Z'
  },
  {
    id: '4',
    title: 'Control de Tiempo para Freelancers',
    shortDescription: 'Una herramienta completa de seguimiento de tiempo y facturación para freelancers',
    longDescription: 
      'Esta aplicación ayudará a los freelancers a realizar un seguimiento del tiempo dedicado a proyectos, gestionar información de clientes, generar facturas profesionales y analizar la productividad. Incluirá funciones para establecer tarifas por hora, seguimiento de gastos e integración con procesadores de pago.',
    professions: ['Desarrollador Frontend', 'Desarrollador Backend', 'Diseñador UI/UX'],
    category: 'Aplicación Web',
    timeRequired: '2-3 meses',
    isPaid: true,
    membersNeeded: 2,
    author: {
      id: '104',
      name: 'Priya Patel',
      email: 'priya@example.com'
    },
    createdAt: '2024-02-20T16:20:00Z'
  },
  {
    id: '5',
    title: 'Mercado de Impresión 3D',
    shortDescription: 'Una plataforma que conecta diseñadores con propietarios de impresoras 3D',
    longDescription: 
      'Este mercado permitirá a los diseñadores 3D vender sus diseños y conectarse con personas que poseen impresoras 3D que pueden imprimir y enviar los artículos. La plataforma manejará pagos, comunicaciones y proporcionará un sistema de calificación para garantizar la calidad.',
    professions: ['Desarrollador Full-stack', 'Diseñador UI/UX', 'Experto en Modelado 3D', 'Especialista en Integración de Pagos'],
    category: 'Plataforma Web',
    timeRequired: '5-6 meses',
    isPaid: true,
    membersNeeded: 4,
    author: {
      id: '105',
      name: 'David Wilson',
      email: 'david@example.com'
    },
    createdAt: '2024-03-05T10:10:00Z'
  },
  {
    id: '6',
    title: 'Juego de Fitness en Realidad Virtual',
    shortDescription: 'Un juego inmersivo de RV que hace que el ejercicio sea divertido y atractivo',
    longDescription: 
      'Este juego de fitness en RV combinará rutinas de ejercicio con jugabilidad atractiva para hacer que el entrenamiento sea más agradable. Realizará un seguimiento de las calorías quemadas, la frecuencia cardíaca (con dispositivos compatibles) y permitirá a los usuarios competir con amigos o unirse a clases virtuales.',
    professions: ['Desarrollador VR', 'Diseñador de Juegos', 'Artista 3D', 'Experto en Fitness'],
    category: 'Juego VR',
    timeRequired: '8-10 meses',
    isPaid: true,
    membersNeeded: 5,
    author: {
      id: '106',
      name: 'Emma Rodríguez',
      email: 'emma@example.com'
    },
    createdAt: '2024-01-30T14:00:00Z'
  }
];