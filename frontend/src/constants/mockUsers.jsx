import { generateMockId } from './utils';

export const generateMockClinics = () => {
    return [
        {
            id: generateMockId('CLI'),
            name: 'Veterinaria San Patricio',
            email: 'info@sanpatricio.vet',
            phone: '+57 300 123 4567',
            address: 'Av. Principal 123',
            locality: 'suba',
            city: 'Bogotá',
            verified: true,
            rating: 4.8,
            services: ['Emergencias 24/7', 'Banco de Sangre', 'Cirugía'],
            schedule: {
                monday: { open: '07:00', close: '20:00' },
                tuesday: { open: '07:00', close: '20:00' },
                wednesday: { open: '07:00', close: '20:00' },
                thursday: { open: '07:00', close: '20:00' },
                friday: { open: '07:00', close: '20:00' },
                saturday: { open: '08:00', close: '16:00' },
                sunday: { open: '08:00', close: '14:00' }
            }
        },
        {
            id: generateMockId('CLI'),
            name: 'Clínica Gatuna VIP',
            email: 'contacto@gatunavip.com',
            phone: '+57 301 234 5678',
            address: 'Calle Felina 456',
            locality: 'chapinero',
            city: 'Bogotá',
            verified: true,
            rating: 4.9,
            services: ['Especialistas Felinos', 'Banco de Sangre', 'Hospitalización'],
            schedule: {
                monday: { open: '08:00', close: '18:00' },
                tuesday: { open: '08:00', close: '18:00' },
                wednesday: { open: '08:00', close: '18:00' },
                thursday: { open: '08:00', close: '18:00' },
                friday: { open: '08:00', close: '18:00' },
                saturday: { open: '09:00', close: '15:00' },
                sunday: { open: '09:00', close: '13:00' }
            }
        }
    ];
};

export const generateMockPetOwners = () => {
    return [
        {
            id: generateMockId('OWN'),
            name: 'Juan Pérez',
            email: 'juan.perez@example.com',
            phone: '+57 300 123 4567',
            address: 'Calle 123 #45-67',
            locality: 'suba',
            city: 'Bogotá',
            pets: [
                {
                    id: generateMockId('PET'),
                    name: 'Max',
                    species: 'canine',
                    breed: 'Labrador Retriever',
                    age: 3,
                    weight: 28,
                    bloodType: 'DEA 1.1+',
                    isDonor: true
                }
            ]
        }
    ];
};