import { generateMockId } from './utils';

export const generateMockApplications = () => {
    const now = new Date();

    return [
        {
            id: generateMockId('APP'),
            requestId: 'REQ-001',
            petName: 'Max',
            species: 'canine',
            breed: 'Labrador Retriever',
            age: 3,
            weight: 28,
            bloodType: 'DEA 1.1+',
            lastVaccination: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            healthStatus: 'Excelente',
            ownerName: 'Juan Pérez',
            ownerPhone: '+57 300 123 4567',
            ownerEmail: 'juan.perez@example.com',
            status: 'pending',
            applicationDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            availability: 'Disponible fines de semana',
            previousDonations: false,
            medications: 'Ninguna',
            vetComments: ''
        },
        {
            id: generateMockId('APP'),
            requestId: 'REQ-002',
            petName: 'Luna',
            species: 'feline',
            breed: 'Siamés',
            age: 2,
            weight: 4.5,
            bloodType: 'A',
            lastVaccination: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            healthStatus: 'Bueno',
            ownerName: 'María Gómez',
            ownerPhone: '+57 301 234 5678',
            ownerEmail: 'maria.gomez@example.com',
            status: 'approved',
            applicationDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            availability: 'Disponible entre semana',
            previousDonations: true,
            medications: 'Ninguna',
            vetComments: 'Donante regular, excelente comportamiento'
        }
    ];
};