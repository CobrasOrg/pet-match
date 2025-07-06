import { useState, useEffect } from 'react';
import { useUserPets } from '@/hooks/useUserPets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dog, 
  Cat,
  Calendar,
  Weight,
  Heart,
  Stethoscope,
  CheckCircle
} from 'lucide-react';

export default function PetSelectionModal({ 
  isOpen, 
  onClose, 
  onSelectPet, 
  requiredSpecies = null, 
  requiredBreed = null,
  requiredBloodType = null,
  title = "Seleccionar Mascota",
  isSubmitting = false
}) {
  const { pets, isLoading } = useUserPets();
  const [filteredPets, setFilteredPets] = useState([]);

  // Filtrar mascotas basado en requisitos
  useEffect(() => {
    if (!pets.length) return;

    const filtered = pets.filter(pet => {
      // Normalizar especies para comparación
      const normalizeSpecies = (species) => {
        if (species === 'canine' || species === 'Perro') return 'canine';
        if (species === 'feline' || species === 'Gato') return 'feline';
        return species;
      };
      
      const petSpecies = normalizeSpecies(pet.species);
      const requiredSpeciesNormalized = normalizeSpecies(requiredSpecies);
      
      const matchesSpecies = !requiredSpecies || petSpecies === requiredSpeciesNormalized;
      const matchesBreed = !requiredBreed || pet.breed === requiredBreed;
      const matchesBloodType = !requiredBloodType || pet.bloodType === requiredBloodType;
      
      const passesAllFilters = matchesSpecies && matchesBreed && matchesBloodType;
      
      return passesAllFilters;
    });

    setFilteredPets(filtered);
  }, [pets, requiredSpecies, requiredBreed, requiredBloodType]);

  const getSpeciesIcon = (species) => {
    return species === 'canine' ? Dog : Cat;
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

  const handleSelectPet = (pet) => {
    onSelectPet(pet);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 pointer-events-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <p className="text-gray-600 mt-1">
                Selecciona la mascota que deseas postular para esta donación
              </p>
              {(requiredSpecies || requiredBreed || requiredBloodType) && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {requiredSpecies && (
                    <Badge variant="outline">
                      Especie: {getSpeciesLabel(requiredSpecies)}
                    </Badge>
                  )}
                  {requiredBreed && (
                    <Badge variant="outline">
                      Raza: {requiredBreed}
                    </Badge>
                  )}
                  {requiredBloodType && (
                    <Badge variant="outline">
                      Tipo de sangre: {requiredBloodType}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando tus mascotas...</p>
              </div>
            </div>
          ) : filteredPets.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No tienes mascotas compatibles
              </h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                {requiredBreed || requiredSpecies || requiredBloodType ? 
                  'No tienes mascotas registradas que cumplan con los requisitos de esta donación.' :
                  'No tienes mascotas registradas para esta donación.'
                }
              </p>
              <div className="space-y-2">
                <Button onClick={onClose} variant="outline">
                  Cerrar
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPets.map((pet) => {
                const SpeciesIcon = getSpeciesIcon(pet.species);
                
                // Normalizar especies para comparación de compatibilidad
                const normalizeSpecies = (species) => {
                  if (species === 'canine' || species === 'Perro') return 'canine';
                  if (species === 'feline' || species === 'Gato') return 'feline';
                  return species;
                };
                
                const petSpecies = normalizeSpecies(pet.species);
                const requiredSpeciesNormalized = normalizeSpecies(requiredSpecies);
                
                const isCompatible = (!requiredSpecies || petSpecies === requiredSpeciesNormalized) &&
                                   (!requiredBreed || pet.breed === requiredBreed) &&
                                   (!requiredBloodType || pet.bloodType === requiredBloodType);
                
                return (
                  <Card key={pet.id} className={`relative ${isCompatible ? 'ring-2 ring-green-200' : ''}`}>
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
                        {isCompatible && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
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
                          <span>Vacunado</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Última vacuna: {new Date(pet.lastVaccination).toLocaleDateString('es-CO')}
                      </div>
                      
                      <div className="pt-2 border-t">
                        <Button 
                          onClick={() => handleSelectPet(pet)}
                          className="w-full flex items-center gap-2"
                          disabled={!isCompatible || isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Enviando...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Seleccionar Mascota
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
