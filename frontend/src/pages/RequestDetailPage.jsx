import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
  ClockIcon
} from 'lucide-react';
import { toast } from 'sonner';

export default function RequestDetailPage() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();
  

  const speciesOptions = [
    { value: 'canine', label: 'Perro' },
    { value: 'feline', label: 'Gato' }
  ];

  const urgencyOptions = [
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Media' }
  ];

  const bloodTypeOptions = {
    canine: ['DEA 1.1+', 'DEA 1.1-', 'DEA 3+', 'DEA 3-', 'DEA 4+', 'DEA 4-', 'DEA 5+', 'DEA 5-'],
    feline: ['A', 'B', 'AB']
  };

  // --- AQUÍ va el useEffect, fuera de cualquier función ---
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetch(`http://localhost:8000/api/v1/vet/solicitudes/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('No se pudo cargar la solicitud');
        return res.json();
      })
      .then(data => {
        setRequest({
          id: data.id,
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
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);
  // --- FIN DEL useEffect ---

const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar esta solicitud? Esta acción no se puede deshacer.')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/vet/solicitudes/${id}`, {
        method: 'DELETE'
      });

      if (response.status === 204) {
        toast.success('Solicitud eliminada correctamente');
        navigate('/requests');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al eliminar la solicitud');
      }
    } catch (err) {
      toast.error(err.message || 'Error al eliminar la solicitud');
    }
  };


  const handleStatusChange = async (newStatus) => {
    // Mapea el estado interno al valor que espera la API
  const statusMap = {
    active: 'Activa',
    pending: 'Revision',
    completed: 'Completada',
    cancelled: 'Cancelada'
  };

  try {
    const response = await fetch(`http://localhost:8000/api/v1/vet/solicitudes/${id}/estado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ estado: statusMap[newStatus] })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al actualizar el estado');
    }

    const updated = await response.json();

    setRequest(prev => ({
      ...prev,
      status: newStatus,
      // Actualiza otros campos si lo deseas, por ejemplo:
      // ...otros campos del objeto updated si quieres mantenerlos sincronizados
    }));

    toast.success('Estado actualizado correctamente');
  } catch (err) {
    toast.error(err.message || 'Error al actualizar el estado');
  }
};
    
  

  const handleEditStart = () => {
    setEditForm({
      species: request.species,
      bloodType: request.bloodType,
      urgency: request.urgency,
      description: request.description,
      location: request.location,
      contact: request.contact,
      minWeight: request.minWeight
    });
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setEditForm({});
    setIsEditing(false);
  };

  const handleEditSave =  async () => {
    // Validaciones básicas
    if (!editForm.species || !editForm.bloodType || !editForm.urgency || !editForm.description) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return;
    }

    if (editForm.minWeight <= 0) {
      toast.error('El peso mínimo debe ser mayor a 0');
      return;
    }

    // Mapeo de valores para la API
    const speciesMap = { canine: 'Perro', feline: 'Gato' };
    const urgencyMap = { high: 'Alta', medium: 'Media' };

    const body = {
    descripcion_solicitud: editForm.description,
    direccion: editForm.location,
    especie: editForm.species === 'canine' ? 'Perro' : 'Gato',
    estado: editForm.status || 'Activa', // O el estado actual si no editas el estado
    peso_minimo: Number(editForm.minWeight),
    tipo_sangre: editForm.bloodType,
    urgencia: editForm.urgency === 'high' ? 'Alta' : 'Media'
};
    try {
    const response = await fetch(`http://localhost:8000/api/v1/vet/solicitudes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al actualizar la solicitud');
    }

    const updated = await response.json();

    setRequest({
      id: updated.id,
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
    toast.error(err.message || 'Error al actualizar la solicitud');
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
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">Solicitud #{id}</h1>
          </div>
        </div>

        {/* Contenido principal responsivo */}
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
                          <label className="text-xs sm:text-sm text-gray-500 block mb-1">Especie *</label>
                          <Select
                              value={editForm.species}
                              onValueChange={(value) => {
                                handleFormChange('species', value);
                                if (value !== editForm.species) {
                                  handleFormChange('bloodType', '');
                                }
                              }}
                          >
                            <SelectTrigger className="text-sm">
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
                      <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        <div>
                          <label className="text-xs sm:text-sm text-gray-500 block mb-1">Ubicación</label>
                          <Input
                              value={editForm.location}
                              onChange={(e) => handleFormChange('location', e.target.value)}
                              placeholder="Dirección de la clínica"
                              className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm text-gray-500 block mb-1">Contacto</label>
                          <Input
                              value={editForm.contact}
                              onChange={(e) => handleFormChange('contact', e.target.value)}
                              placeholder="Dr. Nombre - Teléfono"
                              className="text-sm"
                          />
                        </div>
                      </div>
                    </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha responsiva */}
          <div className="space-y-4 lg:space-y-6">
            {/* Información de contacto */}
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
                  <p className="font-medium text-sm sm:text-base">{request.date}</p>
                </div>
              </CardContent>
            </Card>

            {/* Acciones responsivas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <Button
                    asChild
                    variant="outline"
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 w-full text-xs sm:text-sm"
                >
                  <Link to={`/requests/${request.id}/applications`}>
                    <span className="truncate">Ver mascotas postuladas ({request.donorMatches?.length || 0})</span>
                  </Link>
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
      </div>
  );
}