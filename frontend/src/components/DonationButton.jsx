import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserPets } from '@/hooks/useUserPets';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HeartIcon, AlertCircleIcon, LoaderIcon } from 'lucide-react';
import { toast } from 'sonner';
import PetSelectionModal from './PetSelectionModal';

export default function DonationButton({ request, className = "", size = "sm" }) {
  const { isLoggedIn, userType, userData } = useAuth();
  const { hasRegisteredPets, isLoading } = useUserPets();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDonationClick = () => {
    // Si no está autenticado, redirigir a login
    if (!isLoggedIn) {
      toast.error('Debes iniciar sesión para ayudar');
      navigate('/login');
      return;
    }

    // Si no es owner, mostrar mensaje
    if (userType !== 'owner') {
      toast.error('Solo los dueños de mascotas pueden postular donantes');
      return;
    }

    // Si no tiene mascotas registradas, redirigir a registro
    if (!hasRegisteredPets) {
      toast.error('Primero debes registrar al menos una mascota');
      navigate('/my-pets');
      return;
    }

    // Si es owner y tiene mascotas, abrir el modal directamente
    setShowModal(true);
  };

  const handleSelectPet = async (selectedPet) => {
    // Cerrar modal
    setShowModal(false);
    setIsSubmitting(true);
    
    try {
      // Preparar los datos para el backend usando la información existente
      const payload = {
        // Información de la mascota seleccionada
        petName: selectedPet.petName || selectedPet.name,
        species: selectedPet.species,
        breed: selectedPet.breed,
        age: selectedPet.age,
        weight: selectedPet.weight,
        bloodType: selectedPet.bloodType,
        lastVaccination: selectedPet.lastVaccination,
        healthStatus: selectedPet.healthStatus,
        medications: selectedPet.medications || '',
        petPhoto: selectedPet.petPhoto || null,
        
        // Información del dueño desde el contexto de autenticación
        ownerName: userData?.name || userData?.fullName || userData?.ownerName || '',
        ownerPhone: userData?.phone || userData?.phoneNumber || '',
        ownerEmail: userData?.email || '',
        ownerAddress: userData?.address || '',
        availability: 'Disponible según coordinación con la clínica',
        termsAccepted: true // Asumimos que acepta los términos al postular
      };

      // Enviar la postulación al backend
      const response = await fetch(`https://postulaciones-api-production.up.railway.app/base/solicitudes/${request.id}/postulaciones`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}` 
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 409) {
        toast.error('Ya existe una postulación tuya para esta solicitud.');
        return;
      }

      if (!response.ok) {
        // Manejo de errores de validación
        const errorData = await response.json().catch(() => ({}));
        let errorMsg = 'No se pudo enviar la postulación';
        if (Array.isArray(errorData.detail)) {
          errorMsg = errorData.detail.map(e => e.msg).join(' | ');
        } else if (typeof errorData.detail === 'string') {
          errorMsg = errorData.detail;
        }
        toast.error(errorMsg);
        return;
      }

      // Postulación exitosa
      toast.success(
        `¡Perfecto! ${selectedPet.petName || selectedPet.name} ha sido postulado como donante para ${request.nombre_mascota}.`,
        {
          duration: 6000,
          description: "Te contactaremos pronto con los detalles del procedimiento."
        }
      );

    } catch (error) {
      console.error('Error al enviar postulación:', error);
      toast.error('Error al enviar la postulación. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar estado de carga
  if (isLoading && isLoggedIn && userType === 'owner') {
    return (
      <Button
        disabled
        className={`bg-gray-400 ${className}`}
        size={size}
      >
        <LoaderIcon className="mr-1.5 h-4 w-4 animate-spin" aria-hidden="true" />
        <span className="hidden sm:inline">Verificando...</span>
        <span className="sm:hidden">...</span>
      </Button>
    );
  }

  // Mostrar botón deshabilitado si no tiene mascotas registradas
  if (isLoggedIn && userType === 'owner' && !hasRegisteredPets) {
    return (
      <Button
        onClick={handleDonationClick}
        variant="outline"
        className={`border-orange-300 text-orange-700 hover:bg-orange-50 ${className}`}
        size={size}
        aria-label="Necesitas registrar una mascota primero"
      >
        <AlertCircleIcon className="mr-1.5 h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Registrar Mascota</span>
        <span className="sm:hidden">Registrar</span>
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={handleDonationClick}
        disabled={isSubmitting}
        className={`bg-pink-600 hover:bg-pink-700 shadow-lg ${isSubmitting ? 'opacity-50' : ''} ${className}`}
        size={size}
        aria-label={`Ayudar a ${request.nombre_mascota} con donación de sangre`}
      >
        {isSubmitting ? (
          <>
            <LoaderIcon className="mr-1.5 h-4 w-4 animate-spin" aria-hidden="true" />
            <span className="hidden sm:inline">Enviando...</span>
            <span className="sm:hidden">...</span>
          </>
        ) : (
          <>
            <HeartIcon className="mr-1.5 h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Ayudar a {request.nombre_mascota}</span>
            <span className="sm:hidden">Ayudar</span>
          </>
        )}
      </Button>

      {/* Modal de selección de mascotas */}
      <PetSelectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelectPet={handleSelectPet}
        requiredSpecies={request.especie}
        requiredBreed={request.raza}
        requiredBloodType={request.tipo_sangre}
        title={`Seleccionar mascota para ayudar a ${request.nombre_mascota}`}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
