import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft, UserCircle, Building } from 'lucide-react';
import PetSelectionModal from '@/components/PetSelectionModal';
import { toast } from 'sonner';
import { getMockRequestById } from '@/constants/mockData';

export default function DonationSelectionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, userType } = useAuth();
  const [request, setRequest] = useState(null);
  const [showPetModal, setShowPetModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos de la solicitud
  useEffect(() => {
    const loadRequest = async () => {
      try {
        setIsLoading(true);
        
        console.log('Buscando solicitud con ID:', id); // Debug log
        
        // Intentar cargar desde la API primero
        try {
          const response = await fetch(`http://localhost:8000/api/v1/user/solicitudes/activas/filtrar`);
          if (response.ok) {
            const requests = await response.json();
            console.log('Solicitudes de la API:', requests); // Debug log
            const foundRequest = Array.isArray(requests) ? requests.find(req => req.id === id) : null;
            
            if (foundRequest) {
              // Mapear campos de la API al formato esperado
              const mappedRequest = {
                id: foundRequest.id,
                nombre_mascota: foundRequest.nombre_mascota,
                especie: foundRequest.especie === 'Perro' ? 'canine' : 
                        foundRequest.especie === 'Gato' ? 'feline' : 
                        foundRequest.especie, // Convertir español a inglés
                tipo_sangre: foundRequest.tipo_sangre,
                peso_minimo: foundRequest.peso_minimo,
                urgencia: foundRequest.urgencia,
                descripcion_solicitud: foundRequest.descripcion_solicitud,
                nombre_veterinaria: foundRequest.nombre_veterinaria,
                localidad: foundRequest.localidad,
                contacto: foundRequest.contacto,
                direccion: foundRequest.direccion || foundRequest.ubicacion,
                fecha_creacion: foundRequest.fecha_creacion,
                estado: foundRequest.estado || 'activa',
                imagen: foundRequest.foto_mascota
              };
              console.log('Solicitud encontrada en API:', mappedRequest); // Debug log
              setRequest(mappedRequest);
              return;
            }
          }
        } catch (apiError) {
          console.log('API no disponible, usando datos mock:', apiError.message);
        }
        
        // Fallback a datos mock si la API no está disponible
        console.log('Buscando en mock requests'); // Debug log
        const foundRequest = await getMockRequestById(id);
        console.log('Resultado búsqueda mock:', foundRequest); // Debug log
        
        if (!foundRequest) {
          console.error('Solicitud no encontrada con ID:', id); // Debug log
          toast.error('Solicitud no encontrada');
          navigate('/public');
          return;
        }
        
        setRequest(foundRequest);
      } catch (error) {
        console.error('Error cargando solicitud:', error);
        toast.error('Error al cargar la solicitud');
        navigate('/public');
      } finally {
        setIsLoading(false);
      }
    };

    loadRequest();
  }, [id, navigate]);

  // Verificar autenticación y tipo de usuario
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      toast.error('Debes iniciar sesión para postular una mascota');
      navigate('/login');
      return;
    }

    if (!isLoading && userType !== 'owner') {
      toast.error('Solo los dueños de mascotas pueden postular donantes');
      navigate('/public');
      return;
    }
  }, [isLoading, isLoggedIn, userType, navigate]);

  const handlePetSelected = (selectedPet) => {
    // Navegar al formulario de aplicación con la mascota pre-seleccionada
    navigate(`/apply/${id}`, { 
      state: { 
        selectedPet,
        requestInfo: request
      }
    });
  };

  const handleDirectApplication = () => {
    // Navegar al formulario sin mascota pre-seleccionada
    navigate(`/apply/${id}`);
  };

  const getSpeciesLabel = (species) => {
    // Manejar tanto el formato de la API (español) como el formato interno (inglés)
    if (species === 'canine' || species === 'Perro') {
      return 'Perro';
    }
    if (species === 'feline' || species === 'Gato') {
      return 'Gato';
    }
    return species; // Devolver tal como viene si no coincide
  };

  const getUrgencyBadge = (urgency) => {
    const badges = {
      'Alta': { label: 'Urgente', color: 'bg-red-100 text-red-800' },
      'Media': { label: 'Moderada', color: 'bg-yellow-100 text-yellow-800' },
      'Baja': { label: 'Baja', color: 'bg-green-100 text-green-800' },
      // Compatibilidad con API que use minúsculas
      'alta': { label: 'Urgente', color: 'bg-red-100 text-red-800' },
      'media': { label: 'Moderada', color: 'bg-yellow-100 text-yellow-800' },
      'baja': { label: 'Baja', color: 'bg-green-100 text-green-800' }
    };
    return badges[urgency] || badges['Media'];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return null;
  }

  const urgencyBadge = getUrgencyBadge(request.urgencia);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/public')}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a solicitudes
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Gracias por querer ayudar!
            </h1>
            <p className="text-gray-600">
              Selecciona cómo quieres proceder con tu donación
            </p>
          </div>
        </div>

        {/* Información de la solicitud */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                {request.nombre_mascota} necesita tu ayuda
              </CardTitle>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${urgencyBadge.color}`}>
                {urgencyBadge.label}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Información del paciente</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Especie:</span> {getSpeciesLabel(request.especie)}</p>
                    <p><span className="font-medium">Tipo de sangre:</span> {request.tipo_sangre}</p>
                    <p><span className="font-medium">Peso mínimo requerido:</span> {request.peso_minimo} kg</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Descripción</h3>
                  <p className="text-sm text-gray-600">{request.descripcion_solicitud}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Clínica veterinaria
                  </h3>
                  <p className="text-sm">{request.nombre_veterinaria}</p>
                  <p className="text-sm text-gray-600">{request.direccion}</p>
                  <p className="text-sm text-gray-600">{request.contacto}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opciones de donación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Opción 1: Usar mascota registrada */}
          <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Heart className="h-5 w-5" />
                Usar una de mis mascotas registradas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Selecciona una de tus mascotas ya registradas en el sistema. 
                Solo se mostrarán aquellas que cumplan con los requisitos.
              </p>
              <Button 
                onClick={() => setShowPetModal(true)}
                className="w-full"
              >
                Seleccionar Mascota
              </Button>
            </CardContent>
          </Card>

          {/* Opción 2: Registrar nueva mascota */}
          <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <UserCircle className="h-5 w-5" />
                Registrar nueva mascota
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Si es tu primera donación o quieres registrar una mascota nueva, 
                completa el formulario con toda la información necesaria.
              </p>
              <Button 
                onClick={handleDirectApplication}
                variant="outline"
                className="w-full border-green-300 text-green-700 hover:bg-green-50"
              >
                Completar Formulario
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Información adicional */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-gray-600 space-y-2">
              <p>
                <strong>Importante:</strong> La donación de sangre es un proceso seguro supervisado por profesionales veterinarios.
              </p>
              <p>
                Tu mascota debe estar en buen estado de salud, al día con sus vacunas y cumplir con los requisitos mínimos.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Modal de selección de mascota */}
        <PetSelectionModal
          isOpen={showPetModal}
          onClose={() => setShowPetModal(false)}
          onSelectPet={handlePetSelected}
          requiredSpecies={request.especie}
          requiredBloodType={request.tipo_sangre}
          requiredWeight={request.peso_minimo}
          title={`Seleccionar donante para ${request.nombre_mascota}`}
        />
      </div>
    </div>
  );
}
