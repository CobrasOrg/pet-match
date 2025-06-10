
import { generateMockId } from './utils';

export const generateMockRequests = () => {
    const now = new Date();

    return [
        {
            id: generateMockId('REQ'),
            petName: 'Rocky',
            species: 'canine',
            bloodType: 'DEA 1.1+',
            urgency: 'high',
            minWeight: 25,
            description: 'Rocky es un pastor alemán de 5 años que ha sido diagnosticado con anemia severa después de una complicación durante una cirugía de emergencia. Su hemograma muestra valores críticos y necesita una transfusión de sangre urgente para estabilizar su condición.',
            location: 'Clínica VetCentral, Av. Principal 123',
            locality: 'suba',
            status: 'active',
            date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            clinicName: 'Veterinaria San Patricio',
            image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6',
            vetContact: '+57 300 123 4567'
        },
        {
            id: generateMockId('REQ'),
            petName: 'Luna',
            species: 'feline',
            bloodType: 'A',
            urgency: 'medium',
            minWeight: 4,
            description: 'Luna es una gata siamés de 3 años que necesita una transfusión de sangre como preparación para una cirugía compleja programada para la próxima semana.',
            location: 'Hospital Felino, Calle Secundaria 456',
            locality: 'chapinero',
            status: 'active',
            date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            clinicName: 'Clínica Gatuna VIP',
            image: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e',
            vetContact: '+57 301 234 5678'
        }
    ];
};