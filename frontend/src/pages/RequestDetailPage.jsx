import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ActivityIcon,
  CheckCircle2Icon,
  XCircleIcon,
  ArrowLeftIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  ClockIcon,
  DogIcon,
  CatIcon,
  ScaleIcon,
  PhoneIcon,
  MailIcon,
  EyeIcon
} from 'lucide-react';
import { toast } from 'sonner';
import CardMascotaPostulada from "@/components/CardMascotaPostulada";
import solicitudesApi from '@/services/solicitudesApi';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function RequestDetailPage() {
  const { id } = useParams();
  const { userType } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();
  
  // Estado para mostrar postulaciones
  const [showApplications, setShowApplications] = useState(false);
  const [applications, setApplications] = useState([]);
  const [applicationsCount, setApplicationsCount] = useState(0); // Nuevo estado para el conteo
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [applicationsError, setApplicationsError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null); // eslint-disable-line no-unused-vars
  const [selectedApplicationDetails, setSelectedApplicationDetails] = useState(null);

  const speciesOptions = [
    { value: 'canine', label: 'Perro' },
    { value: 'feline', label: 'Gato' }
  ];

  const urgencyOptions = [
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Media' }
  ];

  const bloodTypeOptions = {
    canine: ['DEA 1.1+', 'DEA 1.1-'],
    feline: ['A', 'B', 'AB']
  };

  
  useEffect(() => {
    const fetchRequest = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await solicitudesApi.getSolicitudById(id);
        
        setRequest({
          id: data.id,
          petName: data.nombre_mascota,
          species: data.especie === 'Perro' ? 'canine' : data.especie === 'Gato' ? 'feline' : data.especie,
          bloodType: data.tipo_sangre,
          urgency: data.urgencia === 'Alta' ? 'high' : 'medium',
          date: data.fecha_creacion,
          status: (() => {
            switch ((data.estado || '').toLowerCase()) {
              case 'activa': return 'active';
              case 'revision':
              case 'en revisión': return 'pending';
              case 'completada': return 'completed';
              case 'cancelada': return 'cancelled';
              default: return 'active';
            }
          })(),
          description: data.descripcion_solicitud,
          location: data.direccion,
          contact: data.contacto,
          minWeight: data.peso_minimo,
          clinicName: data.nombre_veterinaria,
          photo: data.foto_mascota,
          locality: data.localidad?.toLowerCase() || '',
        });
      } catch (err) {
        console.error('Error cargando solicitud:', err);
        setError('No se pudo cargar la solicitud');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequest();
  }, [id]);
  

const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar esta solicitud? Esta acción no se puede deshacer.')) return;

    // Verificar que el usuario sea una clínica
    if (userType !== 'clinic') {
      toast.error('Solo las clínicas pueden eliminar solicitudes');
      return;
    }

    const solicitudId = request?.id || id; 

    try {
      await solicitudesApi.deleteSolicitud(solicitudId);
      toast.success('Solicitud eliminada correctamente');
      navigate('/requests');
    } catch (err) {
      console.error('Error eliminando solicitud:', err);
      toast.error('Error al eliminar la solicitud');
    }
  };


  const handleStatusChange = async (newStatus) => {
    // Mapear el estado interno al valor que espera la API
    const statusMap = {
      active: 'Activa',
      pending: 'Revision',
      completed: 'Completada',
      cancelled: 'Cancelada'
    };

    try {
      await solicitudesApi.updateSolicitudEstado(id, statusMap[newStatus]);
      
      setRequest(prev => ({
        ...prev,
        status: newStatus
      }));

      toast.success('Estado actualizado correctamente');
    } catch (err) {
      console.error('Error actualizando estado:', err);
      toast.error('Error al actualizar el estado');
    }
  };

  const handleEditStart = () => {
    setEditForm({
      species: request.species,
      bloodType: request.bloodType,
      urgency: request.urgency,
      description: request.description,
      minWeight: request.minWeight
    });
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setEditForm({});
    setIsEditing(false);
  };

  const handleEditSave = async () => {
    // Validaciones
    if (!editForm.species || !editForm.bloodType || !editForm.urgency || !editForm.description) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return;
    }

    if (editForm.minWeight <= 0) {
      toast.error('El peso mínimo debe ser mayor a 0');
      return;
    }

    const updateData = {
      descripcion_solicitud: editForm.description,
      especie: editForm.species === 'canine' ? 'Perro' : 'Gato',
      peso_minimo: Number(editForm.minWeight),
      tipo_sangre: editForm.bloodType,
      urgencia: editForm.urgency === 'high' ? 'Alta' : 'Media'
    };

    try {
      const updated = await solicitudesApi.updateSolicitud(id, updateData);

      setRequest({
        id: updated.id,
        petName: updated.nombre_mascota,
        species: updated.especie === 'Perro' ? 'canine' : updated.especie === 'Gato' ? 'feline' : updated.especie,
        bloodType: updated.tipo_sangre,
        urgency: updated.urgencia === 'Alta' ? 'high' : 'medium',
        date: updated.fecha_creacion,
        status: (() => {
          switch ((updated.estado || '').toLowerCase()) {
            case 'activa': return 'active';
            case 'revision':
            case 'en revisión': return 'pending';
            case 'completada': return 'completed';
            case 'cancelada': return 'cancelled';
            default: return 'active';
          }
        })(),
        description: updated.descripcion_solicitud,
        location: updated.direccion,
        contact: updated.contacto,
        minWeight: updated.peso_minimo,
        clinicName: updated.nombre_veterinaria,
        photo: updated.foto_mascota,
        locality: updated.localidad?.toLowerCase() || '',
      });

      setIsEditing(false);
      toast.success('Solicitud actualizada correctamente');
    } catch (err) {
      console.error('Error actualizando solicitud:', err);
      toast.error('Error al actualizar la solicitud');
    }
  };


  const handleFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getSpeciesLabel = (species) => {
    return speciesOptions.find(opt => opt.value === species)?.label || species;
  };

  const getUrgencyLabel = (urgency) => {
    return urgencyOptions.find(opt => opt.value === urgency)?.label || urgency;
  };

  // Función helper para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const now = new Date();
    let createdDate;

    try {
      if (typeof dateString === 'string') {
        if (dateString.includes('T')) {
          createdDate = new Date(dateString);
        } else {
          createdDate = new Date(dateString);
        }
      } else {
        createdDate = new Date(dateString);
      }

      if (isNaN(createdDate.getTime())) {
        return 'Fecha inválida';
      }

      // Ajustar zona horaria
      const diffMs = now.getTime() - createdDate.getTime();
      if (diffMs < -3600000) { // -1 hora en ms
        createdDate = new Date(createdDate.getTime() - (5 * 60 * 60 * 1000)); // Restar 5 horas (Colombia)
      }

      const timeDiff = now.getTime() - createdDate.getTime();
      
      if (timeDiff < 0) {
        return 'Hace unos segundos';
      }

      const seconds = Math.floor(timeDiff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (seconds < 60) {
        return 'Hace unos segundos';
      } else if (minutes < 60) {
        return `Hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
      } else if (hours < 24) {
        return `Hace ${hours} hora${hours !== 1 ? 's' : ''}`;
      } else if (days === 1) {
        return 'Hace 1 día';
      } else if (days < 30) {
        return `Hace ${days} días`;
      } else {
        const months = Math.floor(days / 30);
        if (months < 12) {
          return `Hace ${months} mes${months !== 1 ? 'es' : ''}`;
        } else {
          const years = Math.floor(days / 365);
          return `Hace ${years} año${years !== 1 ? 's' : ''}`;
        }
      }
    } catch (error) {
      console.error('Error parseando fecha:', error, dateString);
      return 'Fecha inválida';
    }
  };

  const StatusBadge = () => {
    const statusConfig = {
      active: {
        label: 'Activa',
        color: 'bg-blue-100 text-blue-800',
        icon: <ActivityIcon className="h-4 w-4" />
      },
      pending: {
        label: 'En revisión',
        color: 'bg-yellow-100 text-yellow-800',
        icon: <ClockIcon className="h-4 w-4" />
      },
      completed: {
        label: 'Completada',
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle2Icon className="h-4 w-4" />
      },
      cancelled: {
        label: 'Cancelada',
        color: 'bg-red-100 text-red-800',
        icon: <XCircleIcon className="h-4 w-4" />
      }
    };

    const current = statusConfig[request.status] || statusConfig.active;

    return (
        <span className={`inline-flex items-center rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium ${current.color}`}>
        {current.icon}
          <span className="ml-1">{current.label}</span>
      </span>
    );
  };

  
  // Función para cargar postulaciones del ID simulado
  const fetchApplications = async () => {
    setLoadingApplications(true);
    setApplicationsError(null);
    try {
    const res = await fetch(`https://postulaciones-api-production.up.railway.app/base/solicitudes/${id}/postulaciones`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
      }
    });
      if (!res.ok) throw new Error('No se pudieron cargar las postulaciones');
      const data = await res.json();
      setApplications(data);
      setApplicationsCount(Array.isArray(data) ? data.length : 0); // Actualiza el conteo aquí también
    } catch (err) {
      setApplicationsError(err.message || 'Error al cargar postulaciones');
      setApplicationsCount(0);
    } finally {
      setLoadingApplications(false);
    }
  };

  // Nueva función para obtener solo el número de postulaciones
  const fetchApplicationsCount = useCallback(async () => {
    try {
    const res = await fetch(`https://postulaciones-api-production.up.railway.app/base/solicitudes/${id}/postulaciones`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
      }
    });
      if (!res.ok) throw new Error('No se pudieron cargar las postulaciones');
      const data = await res.json();
      setApplicationsCount(Array.isArray(data) ? data.length : 0);
    } catch {
      setApplicationsCount(0);
    }
  }, [id]);

  // Función para cargar detalles de una postulación
  const fetchApplicationDetails = async (postulacionId) => {
    try {
    const res = await fetch(`https://postulaciones-api-production.up.railway.app/base/solicitudes/${id}/postulaciones/${postulacionId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
      }
    });
      if (!res.ok) throw new Error('No se pudo cargar la postulación');
      const data = await res.json();
      setSelectedApplicationDetails(data);
    } catch (err) {
      setSelectedApplicationDetails(null);
      alert('Error al cargar detalles: ' + err.message);
    }
  };

  // Llamar a fetchApplicationsCount al cargar la página y cuando se cierra el modal
  useEffect(() => {
    fetchApplicationsCount();
  }, [fetchApplicationsCount]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <span>Cargando solicitud...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!request) {
    return null;
  }

  return (
      <div className="container mx-auto p-3 sm:p-4 lg:p-6 max-w-7xl">
        {/* Cabecera responsiva */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button asChild variant="ghost" size="icon" className="flex-shrink-0">
              <Link to="/requests">
                <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
              Solicitud #{id?.slice(-8) || id}
            </h1>
          </div>
        </div>

        {/* Contenido principal responsiva */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
                  <CardTitle className="text-base sm:text-lg">Información de la solicitud</CardTitle>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <StatusBadge />
                    {!isEditing ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEditStart}
                            className="flex items-center gap-1 w-full sm:w-auto text-xs sm:text-sm"
                        >
                          <EditIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="sm:inline">Editar</span>
                        </Button>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={handleEditCancel}
                              className="flex items-center gap-1 justify-center text-xs sm:text-sm"
                          >
                            <XIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Cancelar</span>
                          </Button>
                          <Button
                              size="sm"
                              onClick={handleEditSave}
                              className="flex items-center gap-1 justify-center bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                          >
                            <SaveIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Guardar</span>
                          </Button>
                        </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEditing ? (
                    // Vista de solo lectura responsiva
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">Nombre de la mascota</p>
                          <p className="font-medium text-sm sm:text-base">{request.petName}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">Especie</p>
                          <p className="font-medium text-sm sm:text-base">{getSpeciesLabel(request.species)}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">Tipo de sangre</p>
                          <p className="font-medium text-sm sm:text-base">{request.bloodType}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">Urgencia</p>
                          <p className="font-medium text-sm sm:text-base">{getUrgencyLabel(request.urgency)}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">Peso mínimo</p>
                          <p className="font-medium text-sm sm:text-base">{request.minWeight} kg</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Descripción</p>
                        <p className="font-medium text-sm sm:text-base leading-relaxed">{request.description}</p>
                      </div>
                    </>
                ) : (
                    // Vista de edición responsiva
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="text-xs sm:text-sm text-gray-500 block mb-1">
                            Especie * {userType === 'clinic' && <span className="text-gray-400">(No editable)</span>}
                          </label>
                          <Select
                              value={editForm.species}
                              onValueChange={(value) => {
                                handleFormChange('species', value);
                                if (value !== editForm.species) {
                                  handleFormChange('bloodType', '');
                                }
                              }}
                              disabled={userType === 'clinic'}
                          >
                            <SelectTrigger className={`text-sm ${userType === 'clinic' ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
                              <SelectValue placeholder="Seleccionar especie" />
                            </SelectTrigger>
                            <SelectContent>
                              {speciesOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm text-gray-500 block mb-1">Tipo de sangre *</label>
                          <Select
                              value={editForm.bloodType}
                              onValueChange={(value) => handleFormChange('bloodType', value)}
                              disabled={!editForm.species}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {editForm.species && bloodTypeOptions[editForm.species]?.map(type => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm text-gray-500 block mb-1">Urgencia *</label>
                          <Select
                              value={editForm.urgency}
                              onValueChange={(value) => handleFormChange('urgency', value)}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Seleccionar urgencia" />
                            </SelectTrigger>
                            <SelectContent>
                              {urgencyOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm text-gray-500 block mb-1">Peso mínimo (kg) *</label>
                          <Input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={editForm.minWeight}
                              onChange={(e) => handleFormChange('minWeight', parseFloat(e.target.value))}
                              placeholder="Ej: 25"
                              className="text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm text-gray-500 block mb-1">Descripción *</label>
                        <Textarea
                            value={editForm.description}
                            onChange={(e) => handleFormChange('description', e.target.value)}
                            placeholder="Describe la situación de la mascota..."
                            rows={4}
                            className="text-sm resize-none"
                        />
                      </div>
                    </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha responsiva */}
          <div className="space-y-4 lg:space-y-6">
            {/* Información de contacto - Solo visible para dueños de mascotas */}
            {userType !== 'clinic' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Información de contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Clínica</p>
                    <p className="font-medium text-sm sm:text-base break-words">{request.location}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Contacto</p>
                    <p className="font-medium text-sm sm:text-base break-words">{request.contact}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Fecha de creación</p>
                    <p className="font-medium text-sm sm:text-base">{formatDate(request.date)}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Acciones responsivas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <Button
                  variant="outline"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 w-full text-xs sm:text-sm"
                  onClick={() => {
                    setShowApplications(true);
                    fetchApplications();
                  }}
                >
                  <span className="truncate">
                    Ver mascotas postuladas ({applicationsCount})
                  </span>
                </Button>

                {request.status === 'active' && (
                    <>
                      <Button
                          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-xs sm:text-sm"
                          onClick={() => handleStatusChange('pending')}
                      >
                        <ClockIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">Poner en revisión</span>
                      </Button>
                      <Button
                          className="w-full bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                          onClick={() => handleStatusChange('completed')}
                      >
                        <CheckCircle2Icon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">Marcar como completada</span>
                      </Button>
                    </>
                )}

                {request.status === 'pending' && (
                    <>
                      <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
                          onClick={() => handleStatusChange('active')}
                      >
                        <ActivityIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">Reactivar solicitud</span>
                      </Button>
                      <Button
                          className="w-full bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                          onClick={() => handleStatusChange('completed')}
                      >
                        <CheckCircle2Icon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">Marcar como completada</span>
                      </Button>
                    </>
                )}

                {(request.status === 'active' || request.status === 'pending') && (
                    <Button
                        variant="outline"
                        className="w-full text-red-600 text-xs sm:text-sm"
                        onClick={() => {
                          if (confirm('¿Estás seguro de cancelar esta solicitud?')) {
                            handleStatusChange('cancelled');
                          }
                        }}
                    >
                      <XCircleIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">Cancelar solicitud</span>
                    </Button>
                )}
                <Button
                variant="destructive"
                className="w-full text-xs sm:text-sm"
                onClick={handleDelete}
              >
                <XIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">Eliminar solicitud</span>
              </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal/Postulaciones */}
        {showApplications && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowApplications(false);
                  setSelectedApplication(null);
                  setSelectedApplicationDetails(null);
                  fetchApplicationsCount(); // Actualiza el número al cerrar el modal
                }}
              >
                <XIcon className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-bold mb-4">Mascotas postuladas ({id})</h2>
              {loadingApplications ? (
                <div className="text-center py-4">Cargando postulaciones...</div>
              ) : applicationsError ? (
                <div className="text-red-500">{applicationsError}</div>
              ) : applications.length === 0 ? (
                <div className="text-gray-500">No hay postulaciones registradas.</div>
              ) : (
                <div className="overflow-x-auto">
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
                      {applications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 border-2 border-pink-300 flex items-center justify-center flex-shrink-0">
                                <span className="text-xl" role="img" aria-label={app.species === 'canine' ? 'Perro' : 'Gato'}>
                                  {app.species === 'canine' ? '🐶' : '🐱'}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-blue-600">{app.petName}</div>
                                <div className="text-sm text-gray-500">
                                  {app.species === 'canine' ? (
                                    <span className="flex items-center">
                                      <DogIcon className="h-4 w-4 mr-1" />
                                      Perro - {app.breed}
                                    </span>
                                  ) : (
                                    <span className="flex items-center">
                                      <CatIcon className="h-4 w-4 mr-1" />
                                      Gato - {app.breed}
                                    </span>
                                  )}
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
                            <Badge className={
                              app.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : app.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }>
                              {app.status === 'pending'
                                ? 'Pendiente'
                                : app.status === 'approved'
                                ? 'Aprobado'
                                : 'Rechazado'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                onClick={async () => {
                                  setSelectedApplication(app);
                                  await fetchApplicationDetails(app.id);
                                }}
                              >
                                <EyeIcon className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Ver Detalles</span>
                                <span className="sm:hidden">Ver</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-green-600 border-green-200 hover:bg-green-50"
                                onClick={async () => {
                                await fetch(`https://postulaciones-api-production.up.railway.app/base/solicitudes/${id}/postulaciones/${app.id}/status`, {
                                  method: 'PATCH',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                                  },
                                  body: JSON.stringify({ status: 'approved' })
                                });
                                  fetchApplications();
                                }}
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
                                onClick={async () => {
                                await fetch(`https://postulaciones-api-production.up.railway.app/base/solicitudes/${id}/postulaciones/${app.id}/status`, {
                                  method: 'PATCH',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                                  },
                                  body: JSON.stringify({ status: 'rejected' })
                                });

                                  fetchApplications();
                                }}
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
                </div>
              )}
            </div>
            {/* Diálogo de detalles */}
            <CardMascotaPostulada
              application={selectedApplicationDetails}
              isOpen={!!selectedApplicationDetails}
              onClose={() => setSelectedApplicationDetails(null)}
            />
          </div>
        )}
      </div>
  );
}