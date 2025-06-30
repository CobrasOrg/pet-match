import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Heart, 
  Dog, 
  Cat,
  Calendar,
  Weight,
  Stethoscope
} from 'lucide-react';
import PetRegistrationForm from '@/components/PetRegistrationForm';

export default function MyPetsPage() {
  const { userData, userType } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  // Verificar autenticación y que sea un owner
  useEffect(() => {
    if (!userData) {
      navigate('/login');
      return;
    }
    if (userType !== 'owner') {
      navigate('/dashboard');
      return;
    }
  }, [userData, userType, navigate]);

  // Simular carga de mascotas del usuario
  useEffect(() => {
    const loadPets = async () => {
      setIsLoading(true);
      try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - en un futuro esto vendrá del backend
        const mockPets = [
          {
            id: 1,
            petName: 'Luna',
            species: 'canine',
            breed: 'Golden Retriever',
            age: 3,
            weight: 25.5,
            bloodType: 'DEA 1.1+',
            healthStatus: 'Excelente estado de salud, sin enfermedades conocidas',
            lastVaccination: '2024-11-15',
            petPhoto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop&crop=face',
            isActive: true
          },
          {
            id: 2,
            petName: 'Max',
            species: 'canine',
            breed: 'Pastor Alemán',
            age: 5,
            weight: 30.0,
            bloodType: 'DEA 1.1-',
            healthStatus: 'Artritis leve en patas traseras, tratamiento con antiinflamatorios',
            lastVaccination: '2024-10-20',
            petPhoto: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=400&fit=crop&crop=face',
            isActive: false
          }
        ];
        
        setPets(mockPets);
      } catch (error) {
        console.error('Error cargando mascotas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userData && userType === 'owner') {
      loadPets();
    }
  }, [userData, userType]);

  const handlePetRegistered = (newPet) => {
    setPets(prevPets => [...prevPets, { ...newPet, id: Date.now() }]);
    setShowRegistrationForm(false);
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
                      <Badge variant={pet.isActive ? 'default' : 'secondary'}>
                        {pet.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
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
                      Última vacuna: {new Date(pet.lastVaccination).toLocaleDateString('es-CO')}
                    </div>
                    
                    <div className="pt-2 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Editar Perfil
                      </Button>
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
      </div>
    </div>
  );
}
