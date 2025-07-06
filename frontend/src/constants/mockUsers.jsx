import { generateMockId } from './utils';

export const generateMockClinics = () => {
    return [
        {
            id: generateMockId('CLI'),
            name: 'Veterinaria San Patricio',
            email: 'veterinaria@sanpatricio.com',
            password: 'Clinic123', // Contraseña para testing
            phone: '+57 300 123 4567',
            address: 'Av. Principal 123',
            locality: 'Teusaquillo',
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
            password: 'Clinic456', // Contraseña para testing
            phone: '+57 301 234 5678',
            address: 'Calle Felina 456',
            locality: 'Chapinero',
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
            email: 'juan@example.com',
            password: 'Password123', // Contraseña para testing
            phone: '+57 300 123 4567',
            address: 'Calle 123 #45-67',
            locality: 'Suba',
            city: 'Bogotá',
            pets: [
                {
                    id: generateMockId('PET'),
                    petName: 'Max',
                    species: 'canine',
                    breed: 'Labrador Retriever',
                    age: 3,
                    weight: 28,
                    bloodType: 'DEA 1.1+',
                    isDonor: true,
                    healthStatus: 'Excelente estado de salud, sin enfermedades conocidas',
                    lastVaccination: '2024-11-15',
                    petPhoto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop&crop=face'
                },
                {
                    id: generateMockId('PET'),
                    petName: 'Luna',
                    species: 'canine',
                    breed: 'Golden Retriever',
                    age: 2,
                    weight: 22.5,
                    bloodType: 'DEA 1.1-',
                    isDonor: false,
                    healthStatus: 'Salud perfecta, muy activa y juguetona',
                    lastVaccination: '2024-12-05',
                    petPhoto: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop&crop=face'
                }
            ]
        },
        {
            id: generateMockId('OWN'),
            name: 'María García',
            email: 'maria@example.com',
            password: 'Password123',
            phone: '+57 301 234 5678',
            address: 'Carrera 45 #123-89',
            locality: 'Chapinero',
            city: 'Bogotá',
            pets: [
                {
                    id: generateMockId('PET'),
                    petName: 'Mimi',
                    species: 'feline',
                    breed: 'Siamés',
                    age: 2,
                    weight: 4.5,
                    bloodType: 'A',
                    isDonor: true,
                    healthStatus: 'Salud excelente, muy activa y juguetona',
                    lastVaccination: '2024-12-01',
                    petPhoto: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop&crop=face'
                },
                {
                    id: generateMockId('PET'),
                    petName: 'Whiskers',
                    species: 'feline',
                    breed: 'Persa',
                    age: 3,
                    weight: 5.2,
                    bloodType: 'B',
                    isDonor: false,
                    healthStatus: 'Excelente condición física, muy tranquilo',
                    lastVaccination: '2024-11-20',
                    petPhoto: 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=400&h=400&fit=crop&crop=face'
                }
            ]
        }
    ];
};