
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
  ArrowLeftIcon
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

// Constantes para especies
const SPECIES_LABELS = {
  canine: 'Perro',
  feline: 'Gato'
};

// Datos de ejemplo (luego reemplazar con API real)
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
    healthStatus: 'Excelente',
    ownerName: 'Juan Pérez',
    ownerPhone: '+1234567890',
    ownerEmail: 'juan@example.com',
    status: 'pending', // pending, approved, rejected
    applicationDate: '2023-11-20T14:30:00Z'
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
    healthStatus: 'Bueno, con alergias leves',
    ownerName: 'María Gómez',
    ownerPhone: '+0987654321',
    ownerEmail: 'maria@example.com',
    status: 'pending',
    applicationDate: '2023-11-21T10:15:00Z'
  }
];

const STATUSES = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: <ClockIcon className="h-4 w-4" /> },
  approved: { label: 'Aprobado', color: 'bg-green-100 text-green-800', icon: <CheckCircle2Icon className="h-4 w-4" /> },
  rejected: { label: 'Rechazado', color: 'bg-red-100 text-red-800', icon: <XCircleIcon className="h-4 w-4" /> }
};

export default function RequestApplications() {
  const { id } = useParams(); // ID de la solicitud
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulación de carga de datos
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        // En producción sería: const response = await fetch(`/api/requests/${id}/applications`);
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
    // Filtro por término de búsqueda
    if (searchTerm &&
        !app.petName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !app.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filtro por estado
    if (statusFilter !== 'all' && app.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const handleStatusChange = (applicationId, newStatus) => {
    setApplications(prev => prev.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
    ));
    // Aquí iría la llamada API para actualizar el estado en el backend
    console.log(`Cambiando aplicación ${applicationId} a estado ${newStatus}`);
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
        {/* Botón de Volver agregado aquí */}
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
            {/* Filtros */}
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
                            <div className="font-medium">{app.petName}</div>
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
                          </TableCell>
                          <TableCell>
                            <div>{app.ownerName}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <PhoneIcon className="h-3 w-3 mr-1" /> {app.ownerPhone}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <MailIcon className="h-3 w-3 mr-1" /> {app.ownerEmail}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {app.bloodType || 'Desconocido'}
                          </TableCell>
                          <TableCell className="text-center">
                      <span className="flex items-center justify-center">
                        <ScaleIcon className="h-4 w-4 mr-1" /> {app.weight} kg
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
                              {app.status !== 'approved' && (
                                  <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 text-green-600 border-green-200"
                                      onClick={() => handleStatusChange(app.id, 'approved')}
                                  >
                                    <CheckCircle2Icon className="h-4 w-4 mr-1" />
                                    Aprobar
                                  </Button>
                              )}
                              {app.status !== 'rejected' && (
                                  <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 text-red-600 border-red-200"
                                      onClick={() => handleStatusChange(app.id, 'rejected')}
                                  >
                                    <XCircleIcon className="h-4 w-4 mr-1" />
                                    Rechazar
                                  </Button>
                              )}
                              <Button variant="outline" size="sm" className="h-8">
                                Ver detalles
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
      </div>
  );
}