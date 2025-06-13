import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2Icon,
  XCircleIcon,
  ClockIcon,
  SearchIcon,
  DogIcon,
  CatIcon,
  ScaleIcon,
  PhoneIcon,
  MailIcon,
  ArrowLeftIcon,
  EyeIcon
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DonorProfileDialog from '../components/CardMascotaPostulada';

// Constantes para especies
const SPECIES_LABELS = {
  canine: 'Perro',
  feline: 'Gato'
};

// Función para obtener emoji de especie
const getSpeciesEmoji = (species) => {
  return species === 'canine' ? '🐶' : '🐱';
};

// Datos de ejemplo actualizados sin fotos
const MOCK_APPLICATIONS = [
  {
    id: 'APP-001',
    requestId: 'REQ-001',
    petName: 'Max',
    species: 'canine',
    breed: 'Labrador Retriever',
    age: 3,
    weight: 28,
    bloodType: 'DEA 1.1+',
    lastVaccination: '2023-10-15',
    healthStatus: 'Excelente estado de salud. Todas las vacunas al día. Sin historial de enfermedades graves.',
    ownerName: 'Juan Pérez',
    ownerPhone: '+57 310 123 4567',
    ownerEmail: 'juan.perez@example.com',
    ownerAddress: 'Calle 100 #15-20, Chapinero, Bogotá',
    status: 'pending',
    applicationDate: '2023-11-20T14:30:00Z',
    donationHistory: [
      { date: '2023-08-15', clinic: 'Clínica Veterinaria Central' },
      { date: '2023-05-10', clinic: 'Hospital Animal Norte' }
    ]
  },
  {
    id: 'APP-002',
    requestId: 'REQ-001',
    petName: 'Bella',
    species: 'canine',
    breed: 'Pastor Alemán',
    age: 4,
    weight: 30,
    bloodType: 'DEA 1.1+',
    lastVaccination: '2023-09-20',
    healthStatus: 'Buen estado general. Presenta alergias leves a ciertos alimentos, pero controladas. Historial de donaciones exitosas.',
    ownerName: 'María Gómez',
    ownerPhone: '+57 320 987 6543',
    ownerEmail: 'maria.gomez@example.com',
    ownerAddress: 'Carrera 7 #85-32, Zona Rosa, Bogotá',
    status: 'approved',
    applicationDate: '2023-11-21T10:15:00Z',
    donationHistory: [
      { date: '2023-07-20', clinic: 'Veterinaria Animales Felices' }
    ]
  },
  {
    id: 'APP-003',
    requestId: 'REQ-001',
    petName: 'Rocky',
    species: 'canine',
    breed: 'Golden Retriever',
    age: 5,
    weight: 32,
    bloodType: 'DEA 1.1+',
    lastVaccination: '2023-11-01',
    healthStatus: 'Excelente condición física. Donante experimentado con múltiples donaciones exitosas.',
    ownerName: 'Carlos Rodríguez',
    ownerPhone: '+57 315 456 7890',
    ownerEmail: 'carlos.rodriguez@example.com',
    ownerAddress: 'Avenida 68 #45-12, Engativá, Bogotá',
    status: 'rejected',
    applicationDate: '2023-11-19T16:45:00Z',
    donationHistory: [
      { date: '2023-09-10', clinic: 'Clínica Veterinaria del Norte' },
      { date: '2023-06-15', clinic: 'Hospital Animal Central' },
      { date: '2023-03-20', clinic: 'Veterinaria San José' }
    ]
  }
];

const STATUSES = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: <ClockIcon className="h-4 w-4" /> },
  approved: { label: 'Aprobado', color: 'bg-green-100 text-green-800', icon: <CheckCircle2Icon className="h-4 w-4" /> },
  rejected: { label: 'Rechazado', color: 'bg-red-100 text-red-800', icon: <XCircleIcon className="h-4 w-4" /> }
};

export default function RequestApplications() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const filtered = MOCK_APPLICATIONS.filter(app => app.requestId === id);
        setApplications(filtered);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [id]);

  const filteredApplications = applications.filter(app => {
    if (searchTerm &&
        !app.petName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !app.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    if (statusFilter !== 'all' && app.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const handleStatusChange = (applicationId, newStatus) => {
    setApplications(prev => prev.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
    ));
    console.log(`Cambiando aplicación ${applicationId} a estado ${newStatus}`);
  };

  const handleViewProfile = (application) => {
    setSelectedApplication(application);
    setIsProfileDialogOpen(true);
  };

  if (isLoading) {
    return (
        <div className="container mx-auto p-6 text-center">
          <p>Cargando postulaciones...</p>
        </div>
    );
  }

  return (
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <Button asChild variant="outline">
            <Link to={`/requests/${id}`} className="flex items-center">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Volver a la solicitud
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Mascotas Postuladas</span>
              <Badge variant="outline">
                {filteredApplications.length} {filteredApplications.length === 1 ? 'postulación' : 'postulaciones'}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Buscar por nombre de mascota o dueño..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="approved">Aprobados</SelectItem>
                  <SelectItem value="rejected">Rechazados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredApplications.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No hay postulaciones que coincidan con los filtros</p>
                </div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mascota</TableHead>
                      <TableHead>Dueño</TableHead>
                      <TableHead className="text-center">Tipo Sangre</TableHead>
                      <TableHead className="text-center">Peso</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {/* Círculo con emoji en lugar de imagen */}
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 border-2 border-pink-300 flex items-center justify-center flex-shrink-0">
                                <span className="text-xl" role="img" aria-label={SPECIES_LABELS[app.species]}>
                                  {getSpeciesEmoji(app.species)}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-blue-600">{app.petName}</div>
                                <div className="text-sm text-gray-500">
                                  {app.species === 'canine' ? (
                                      <span className="flex items-center">
                                        <DogIcon className="h-4 w-4 mr-1" />
                                        {SPECIES_LABELS[app.species]} - {app.breed}
                                      </span>
                                  ) : (
                                      <span className="flex items-center">
                                        <CatIcon className="h-4 w-4 mr-1" />
                                        {SPECIES_LABELS[app.species]} - {app.breed}
                                      </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {app.age} {app.age === 1 ? 'año' : 'años'}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{app.ownerName}</div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <PhoneIcon className="h-3 w-3 mr-1 flex-shrink-0" /> 
                              <span className="truncate">{app.ownerPhone}</span>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <MailIcon className="h-3 w-3 mr-1 flex-shrink-0" /> 
                              <span className="truncate">{app.ownerEmail}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {app.bloodType || 'Desconocido'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="flex items-center justify-center font-medium">
                              <ScaleIcon className="h-4 w-4 mr-1 text-blue-500" /> 
                              {app.weight} kg
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className={STATUSES[app.status].color}>
                              {STATUSES[app.status].icon}
                              <span className="ml-1">{STATUSES[app.status].label}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8"
                                  onClick={() => handleViewProfile(app)}
                              >
                                <EyeIcon className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Ver Detalles</span>
                                <span className="sm:hidden">Ver</span>
                              </Button>
                              <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 text-green-600 border-green-200 hover:bg-green-50"
                                  onClick={() => handleStatusChange(app.id, 'approved')}
                                  disabled={app.status === 'approved'}
                              >
                                <CheckCircle2Icon className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Aprobar</span>
                                <span className="sm:hidden">✓</span>
                              </Button>
                              <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => handleStatusChange(app.id, 'rejected')}
                                  disabled={app.status === 'rejected'}
                              >
                                <XCircleIcon className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Rechazar</span>
                                <span className="sm:hidden">✗</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>

        {/* Dialog para ver perfil completo */}
        <DonorProfileDialog
            application={selectedApplication}
            isOpen={isProfileDialogOpen}
            onClose={() => setIsProfileDialogOpen(false)}
        />
      </div>
  );
}