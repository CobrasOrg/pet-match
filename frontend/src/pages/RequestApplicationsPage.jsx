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

// Mapeo de estados a iconos, etiquetas y colores
const STATUSES = {
  pending: {
    icon: <ClockIcon className="h-4 w-4 mr-1 text-yellow-500" />,
    label: 'Pendiente',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200'
  },
  approved: {
    icon: <CheckCircle2Icon className="h-4 w-4 mr-1 text-green-600" />,
    label: 'Aprobado',
    color: 'bg-green-50 text-green-700 border-green-200'
  },
  rejected: {
    icon: <XCircleIcon className="h-4 w-4 mr-1 text-red-600" />,
    label: 'Rechazado',
    color: 'bg-red-50 text-red-700 border-red-200'
  }
};

// Función para obtener emoji de especie
const getSpeciesEmoji = (species) => {
  return species === 'canine' ? '🐶' : '🐱';
};

export default function RequestApplications() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  // Cargar postulaciones reales
  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8001/base/api/solicitudes/${id}/postulaciones`);
      if (!res.ok) throw new Error('No se pudieron cargar las postulaciones');
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      setApplications([]);
      console.error("Error fetching applications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line
  }, [id]);

  const filteredApplications = applications.filter(app => {
    if (searchTerm &&
        !app.petName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !app.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && app.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Obtener detalles de una postulación
  const handleViewProfile = async (application) => {
    try {
      const res = await fetch(`http://localhost:8001/base/api/solicitudes/${id}/postulaciones/${application.id}`);
      if (!res.ok) throw new Error('No se pudo cargar la postulación');
      const data = await res.json();
      setSelectedApplication(data);
      setIsProfileDialogOpen(true);
    } catch (err) {
      alert('Error al cargar detalles: ' + err.message);
    }
  };

  // Cambiar estado usando PATCH
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8001/base/api/solicitudes/${id}/postulaciones/${applicationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('No se pudo actualizar el estado');
      await fetchApplications();
    } catch (err) {
      alert('Error al actualizar estado: ' + err.message);
    }
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