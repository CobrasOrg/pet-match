import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Edit, 
  Trash2,
  Heart, 
  Dog, 
  Cat,
  Calendar,
  Weight,
  Stethoscope
} from 'lucide-react';
import PetRegistrationForm from '@/components/PetRegistrationForm';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';

// NOTA: Esta página está configurada en MODO SIMULADO
// Las llamadas al backend están deshabilitadas para desarrollo
// Cuando integres el backend, reemplaza las funciones con llamadas reales a la API

export default function MyPetsPage() {
  const { userData, userType, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [deletingPet, setDeletingPet] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Función para formatear fechas correctamente para visualización
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    
    // Si es formato YYYY-MM-DD, parsear como fecha local
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-');
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('es-CO');
    }
    
    // Si es cualquier otro formato, usar Date normal
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-CO');
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return dateString;
    }
  };

  // Verificar autenticación y que sea un owner
  useEffect(() => {
    if (!userData) {
      navigate('/login');
      return;
    }
    if (userType !== 'owner') {
      navigate('/requests');
      return;
    }
  }, [userData, userType, navigate]);

  // Cargar mascotas del usuario desde datos del contexto
  useEffect(() => {
    const loadPets = async () => {
      setIsLoading(true);
      try {
        // Simular delay de carga
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Obtener mascotas del usuario autenticado
        const userPets = userData?.pets || [];
        
        setPets(userPets);
        
      } catch (error) {
        console.error('Error cargando mascotas:', error);
        alert('Error cargando las mascotas.');
      } finally {
        setIsLoading(false);
      }
    };

    if (userData && userType === 'owner') {
      loadPets();
    }
  }, [userData, userType]);

  const handlePetRegistered = (newPet) => {
    // Actualizar estado local
    setPets(prevPets => [...prevPets, newPet]);
    
    // Actualizar datos del usuario en el contexto
    const updatedUserData = {
      ...userData,
      pets: [...(userData.pets || []), newPet]
    };
    updateUserData(updatedUserData);
    
    setShowRegistrationForm(false);
  };

  const handlePetUpdated = async (updatedPet) => {
    try {
      // Simular delay de actualización
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar la lista local
      setPets(prevPets => 
        prevPets.map(pet => 
          pet.id === updatedPet.id ? updatedPet : pet
        )
      );
      
      // Actualizar datos del usuario en el contexto
      const updatedUserData = {
        ...userData,
        pets: (userData.pets || []).map(pet => 
          pet.id === updatedPet.id ? updatedPet : pet
        )
      };
      updateUserData(updatedUserData);
      
      setEditingPet(null);
      
    } catch (error) {
      console.error('Error actualizando mascota:', error);
      alert('Error al actualizar la mascota. Intenta nuevamente.');
    }
  };

  const handleEditPet = (pet) => {
    setEditingPet(pet);
    setShowRegistrationForm(false);
  };

  const handleDeletePet = (pet) => {
    setDeletingPet(pet);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // Simular delay de eliminación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remover mascota de la lista local
      setPets(prevPets => prevPets.filter(pet => pet.id !== deletingPet.id));
      
      // Actualizar datos del usuario en el contexto
      const updatedUserData = {
        ...userData,
        pets: (userData.pets || []).filter(pet => pet.id !== deletingPet.id)
      };
      updateUserData(updatedUserData);
      
      // Cerrar dialog y limpiar estado
      setShowDeleteDialog(false);
      setDeletingPet(null);
      
      alert('¡Mascota eliminada exitosamente!');
      
    } catch (error) {
      console.error('Error eliminando mascota:', error);
      alert('Error al eliminar la mascota. Intenta nuevamente.');
    }
  };

  const handleCancelEdit = () => {
    setEditingPet(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setDeletingPet(null);
  };

  const getSpeciesIcon = (species) => {
    return species === 'canine' ? Dog : Cat;
  };

  const getSpeciesLabel = (species) => {
    return species === 'canine' ? 'Perro' : 'Gato';
  };

  if (!userData || userType !== 'owner') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando tus mascotas...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Mascotas</h1>
            <p className="text-gray-600 mt-1">
              Gestiona el perfil de tus mascotas donantes
            </p>
          </div>
          <Button 
            onClick={() => setShowRegistrationForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Registrar Mascota
          </Button>
        </div>

        {/* Lista de mascotas */}
        {pets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No tienes mascotas registradas
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Registra a tu primera mascota para que pueda ser considerada como donante 
                en solicitudes compatibles.
              </p>
              <Button 
                onClick={() => setShowRegistrationForm(true)}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                Registrar Primera Mascota
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => {
              const SpeciesIcon = getSpeciesIcon(pet.species);
              return (
                <Card key={pet.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {/* Foto de la mascota o icono */}
                        <div className={`w-16 h-16 rounded-lg overflow-hidden ${pet.species === 'canine' ? 'bg-blue-100' : 'bg-orange-100'} flex items-center justify-center`}>
                          {pet.petPhoto ? (
                            <img 
                              src={pet.petPhoto} 
                              alt={pet.petName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <SpeciesIcon className={`h-8 w-8 ${pet.species === 'canine' ? 'text-blue-600' : 'text-orange-600'}`} />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{pet.petName}</CardTitle>
                          <p className="text-sm text-gray-600">
                            {getSpeciesLabel(pet.species)} • {pet.breed}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{pet.age} años</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Weight className="h-4 w-4 text-gray-500" />
                        <span>{pet.weight} kg</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>{pet.bloodType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-green-500" />
                        <span>Última vacuna</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Última vacuna: {formatDateForDisplay(pet.lastVaccination)}
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 flex items-center gap-2"
                          onClick={() => handleEditPet(pet)}
                        >
                          <Edit className="h-4 w-4" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeletePet(pet)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Modal de registro de mascota */}
        {showRegistrationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Registrar Nueva Mascota
                  </h2>
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowRegistrationForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </Button>
                </div>
                
                <PetRegistrationForm
                  onSuccess={handlePetRegistered}
                  onCancel={() => setShowRegistrationForm(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal de edición de mascota */}
        {editingPet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Editar Perfil de {editingPet.petName}
                  </h2>
                  <Button 
                    variant="ghost" 
                    onClick={handleCancelEdit}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </Button>
                </div>
                
                <PetRegistrationForm
                  mode="edit"
                  initialData={editingPet}
                  onSuccess={handlePetUpdated}
                  onCancel={handleCancelEdit}
                />
              </div>
            </div>
          </div>
        )}

        {/* Dialog de confirmación de eliminación */}
        <ConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="¿Eliminar mascota?"
          message={`¿Estás seguro de que deseas eliminar el perfil de ${deletingPet?.petName}? Esta acción no se puede deshacer y la mascota dejará de estar disponible como donante.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          variant="destructive"
        />
      </div>
    </div>
  );
}
