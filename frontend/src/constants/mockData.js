// Datos mock centralizados para desarrollo
// Este archivo contiene todos los datos de prueba que deben ser consistentes
// entre diferentes componentes y páginas

export const MOCK_REQUESTS = [
  {
    id: 'REQ-001',
    nombre_mascota: 'Rocky',
    especie: 'canine',
    tipo_sangre: 'DEA 1.1+',
    peso_minimo: 25,
    urgencia: 'Alta',
    descripcion_solicitud: 'Rocky es un pastor alemán de 5 años que ha sido diagnosticado con anemia severa después de una complicación durante una cirugía de emergencia. Su hemograma muestra valores críticos y necesita una transfusión de sangre urgente para estabilizar su condición.',
    nombre_veterinaria: 'Veterinaria San Patricio',
    localidad: 'suba',
    contacto: '+57 300 123 4567',
    direccion: 'Clínica VetCentral, Av. Principal 123',
    fecha_creacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    estado: 'activa',
    imagen: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop'
  },
  {
    id: 'REQ-002',
    nombre_mascota: 'Luna',
    especie: 'feline',
    tipo_sangre: 'A',
    peso_minimo: 4,
    urgencia: 'Media',
    descripcion_solicitud: 'Luna es una gata siamés de 3 años que necesita una transfusión de sangre como preparación para una cirugía compleja programada para la próxima semana. Su estado es estable pero requiere preparación.',
    nombre_veterinaria: 'Clínica Gatuna VIP',
    localidad: 'chapinero',
    contacto: '+57 301 234 5678',
    direccion: 'Hospital Felino, Calle Secundaria 456',
    fecha_creacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    estado: 'activa',
    imagen: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=300&fit=crop'
  },
  {
    id: 'REQ-003',
    nombre_mascota: 'Bella',
    especie: 'feline',
    tipo_sangre: 'B',
    peso_minimo: 5,
    urgencia: 'Alta',
    descripcion_solicitud: 'Bella es una gata persa de 4 años que necesita una transfusión urgente debido a una pérdida de sangre significativa durante una cirugía de emergencia. Su condición es crítica pero estable.',
    nombre_veterinaria: 'Hospital Veterinario Norte',
    localidad: 'usaquen',
    contacto: '+57 302 345 6789',
    direccion: 'Calle 127 #15-45, Bogotá',
    fecha_creacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    estado: 'activa',
    imagen: 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=400&h=300&fit=crop'
  },
  {
    id: 'REQ-004',
    nombre_mascota: 'Thor',
    especie: 'canine',
    tipo_sangre: 'DEA 1.1-',
    peso_minimo: 20,
    urgencia: 'Media',
    descripcion_solicitud: 'Thor es un labrador de 4 años que requiere una transfusión después de una cirugía complicada en la pata trasera. Su recuperación depende de encontrar un donante compatible con su tipo de sangre.',
    nombre_veterinaria: 'Clínica Veterinaria Sur',
    localidad: 'kennedy',
    contacto: '+57 303 456 7890',
    direccion: 'Carrera 78 #42-15, Bogotá',
    fecha_creacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    estado: 'activa',
    imagen: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop'
  },
  {
    id: 'REQ-005',
    nombre_mascota: 'Mia',
    especie: 'feline',
    tipo_sangre: 'AB',
    peso_minimo: 3,
    urgencia: 'Alta',
    descripcion_solicitud: 'Mia es una gata Maine Coon de 6 años que necesita una transfusión urgente debido a complicaciones post-operatorias. Su tipo de sangre AB es raro y necesitamos encontrar un donante compatible.',
    nombre_veterinaria: 'Centro Veterinario Especializado',
    localidad: 'teusaquillo',
    contacto: '+57 304 567 8901',
    direccion: 'Avenida 68 #24-18, Bogotá',
    fecha_creacion: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    estado: 'activa',
    imagen: 'https://images.unsplash.com/photo-1573824774533-ee72bb8b4e1a?w=400&h=300&fit=crop'
  },
  {
    id: 'REQ-006',
    nombre_mascota: 'Zeus',
    especie: 'canine',
    tipo_sangre: 'DEA 1.1+',
    peso_minimo: 30,
    urgencia: 'Media',
    descripcion_solicitud: 'Zeus es un rottweiler de 7 años que necesita una transfusión como preparación para una cirugía programada de tumor abdominal. Su estado es estable pero requiere preparación.',
    nombre_veterinaria: 'Clínica Veterinaria Integral',
    localidad: 'engativa',
    contacto: '+57 305 678 9012',
    direccion: 'Calle 80 #90-23, Bogotá',
    fecha_creacion: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    estado: 'activa',
    imagen: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop'
  }
];

// Función para obtener solicitudes mock (simula llamada a API)
export const getMockRequests = (filters = {}) => {
  return new Promise((resolve) => {
    // Simular delay de red
    setTimeout(() => {
      let filteredRequests = [...MOCK_REQUESTS];
      
      // Aplicar filtros si existen
      if (filters.especie && filters.especie.length > 0) {
        filteredRequests = filteredRequests.filter(req => 
          filters.especie.includes(req.especie)
        );
      }
      
      if (filters.tipo_sangre && filters.tipo_sangre.length > 0) {
        filteredRequests = filteredRequests.filter(req => 
          filters.tipo_sangre.includes(req.tipo_sangre)
        );
      }
      
      if (filters.urgencia && filters.urgencia.length > 0) {
        filteredRequests = filteredRequests.filter(req => 
          filters.urgencia.includes(req.urgencia)
        );
      }
      
      if (filters.localidad && filters.localidad.length > 0) {
        filteredRequests = filteredRequests.filter(req => 
          filters.localidad.includes(req.localidad)
        );
      }
      
      resolve(filteredRequests);
    }, 300);
  });
};

// Función para obtener una solicitud específica
export const getMockRequestById = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const request = MOCK_REQUESTS.find(req => req.id === id);
      resolve(request);
    }, 200);
  });
};

// Utilidades para mapear datos
export const mapApiRequestToMockFormat = (apiRequest) => {
  return {
    id: apiRequest.id,
    nombre_mascota: apiRequest.nombre_mascota,
    especie: apiRequest.especie,
    tipo_sangre: apiRequest.tipo_sangre,
    peso_minimo: apiRequest.peso_minimo,
    urgencia: apiRequest.urgencia,
    descripcion_solicitud: apiRequest.descripcion_solicitud,
    nombre_veterinaria: apiRequest.nombre_veterinaria,
    localidad: apiRequest.localidad,
    contacto: apiRequest.contacto,
    direccion: apiRequest.direccion || apiRequest.ubicacion,
    fecha_creacion: apiRequest.fecha_creacion,
    estado: apiRequest.estado || 'activa',
    imagen: apiRequest.imagen || null
  };
};
