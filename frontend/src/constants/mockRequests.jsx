
// DEPRECADO: Este archivo está siendo reemplazado por mockData.js
// Mantener por compatibilidad temporal

import { MOCK_REQUESTS } from './mockData';

// Función mantenida por compatibilidad
export const generateMockRequests = () => {
    console.warn('generateMockRequests está deprecado. Usa MOCK_REQUESTS de mockData.js');
    return MOCK_REQUESTS.map(req => ({
        ...req,
        // Mapear campos si es necesario para compatibilidad
        petName: req.nombre_mascota,
        species: req.especie,
        bloodType: req.tipo_sangre,
        urgency: req.urgencia,
        minWeight: req.peso_minimo,
        description: req.descripcion_solicitud,
        location: req.direccion,
        locality: req.localidad,
        status: req.estado,
        date: req.fecha_creacion,
        clinicName: req.nombre_veterinaria,
        image: req.imagen || 'https://images.unsplash.com/photo-1551717743-49959800b1f6',
        vetContact: req.contacto
    }));
};