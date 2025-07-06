import { useState, useEffect } from 'react';
import { usePets } from '@/hooks/usePetsConnected';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dog, 
  Cat,
  Calendar,
  Weight,
  Heart,
  CheckCircle,
  AlertTriangle,
  PlusCircle
} from 'lucide-react';

/**
 * Componente para seleccionar una mascota registrada para postular a donación
 * Conecta los datos de PetRegistrationForm con CardMascotaPostulada
 */
export default function PetSelector({ onPetSelected, onRegisterNew, selectedRequestData }) {
  const { pets, isLoading, getEligiblePets } = usePets();
  const [selectedPetId, setSelectedPetId] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);

  const eligiblePets = getEligiblePets();

  useEffect(() => {
    if (selectedPetId) {
      const pet = pets.find(p => p.id.toString() === selectedPetId);
      setSelectedPet(pet);
      if (onPetSelected && pet) {
        // Formatear datos para CardMascotaPostulada
        const applicationData = {
          petName: pet.petName,
          species: pet.species,
          breed: pet.breed,
          age: pet.age,
          weight: pet.weight,
          bloodType: pet.bloodType,
          healthStatus: pet.healthStatus,
          lastVaccination: pet.lastVaccination,
          petPhoto: pet.petPhoto,
          // Datos del dueño
          ownerName: pet.ownerName,
          ownerEmail: pet.ownerEmail,
          ownerPhone: pet.ownerPhone,
          ownerAddress: pet.ownerAddress,
          // Metadatos de la postulación
          applicationDate: new Date().toISOString(),
          status: 'pending',
          requestId: selectedRequestData?.id
        };
        onPetSelected(applicationData);
      }
    } else {
      setSelectedPet(null);
    }
  }, [selectedPetId, pets, onPetSelected, selectedRequestData]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  const isCompatibleBloodType = (petBloodType, requestedBloodType) => {
    if (!petBloodType || !requestedBloodType) return false;
    
    // Lógica básica de compatibilidad sanguínea
    // Para perros: DEA 1.1- puede donar a cualquiera, DEA 1.1+ solo a DEA 1.1+
    if (petBloodType.includes('DEA')) {
      if (petBloodType === 'DEA 1.1-') return true; // Donante universal canino
      return petBloodType === requestedBloodType;
    }
    
    // Para gatos: tipo A puede donar a A, tipo B a B, AB puede recibir de cualquiera
    if (requestedBloodType === 'AB') return true; // Receptor universal felino
    return petBloodType === requestedBloodType;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Cargando mascotas...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Seleccionar Mascota Donante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <PlusCircle className="h-4 w-4" />
            <AlertDescription>
              No tienes mascotas registradas. Para postular a donaciones, primero debes registrar a tu mascota.
            </AlertDescription>
          </Alert>
          <Button onClick={onRegisterNew} className="w-full mt-4">
            <PlusCircle className="h-4 w-4 mr-2" />
            Registrar Primera Mascota
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (eligiblePets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Seleccionar Mascota Donante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Ninguna de tus mascotas registradas cumple con los criterios básicos para donación (peso mínimo 25kg, edad 1-8 años, vacunas recientes, buena salud).
            </AlertDescription>
          </Alert>
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Tus mascotas registradas:</p>
            {pets.map(pet => (
              <div key={pet.id} className="p-2 bg-gray-50 rounded text-sm">
                <span className="font-medium">{pet.petName}</span> - {pet.weight}kg, {pet.age} años
              </div>
            ))}
          </div>
          <Button onClick={onRegisterNew} variant="outline" className="w-full mt-4">
            <PlusCircle className="h-4 w-4 mr-2" />
            Registrar Nueva Mascota
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Seleccionar Mascota Donante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecciona una de tus mascotas registradas
              </label>
              <Select value={selectedPetId} onValueChange={setSelectedPetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Elige una mascota..." />
                </SelectTrigger>
                <SelectContent>
                  {eligiblePets.map(pet => (
                    <SelectItem key={pet.id} value={pet.id.toString()}>
                      <div className="flex items-center gap-2">
                        {pet.species === 'canine' ? 
                          <Dog className="h-4 w-4" /> : 
                          <Cat className="h-4 w-4" />
                        }
                        <span>{pet.petName} - {pet.breed}</span>
                        {selectedRequestData?.tipo_sangre && 
                         isCompatibleBloodType(pet.bloodType, selectedRequestData.tipo_sangre) && (
                          <Badge variant="secondary" className="text-xs">
                            Compatible
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRequestData?.tipo_sangre && (
              <Alert>
                <Heart className="h-4 w-4" />
                <AlertDescription>
                  <strong>Tipo de sangre requerido:</strong> {selectedRequestData.tipo_sangre}
                  <br />
                  <small className="text-gray-600">
                    Solo se muestran mascotas con criterios básicos para donación
                  </small>
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={onRegisterNew} variant="outline" className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              Registrar Nueva Mascota
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vista previa de la mascota seleccionada */}
      {selectedPet && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Mascota Seleccionada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                {selectedPet.petPhoto ? (
                  <img 
                    src={selectedPet.petPhoto} 
                    alt={selectedPet.petName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  selectedPet.species === 'canine' ? 
                    <Dog className="h-6 w-6 text-gray-400" /> : 
                    <Cat className="h-6 w-6 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-lg">{selectedPet.petName}</h4>
                <p className="text-sm text-gray-600">{selectedPet.breed}</p>
                
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{selectedPet.age} años</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Weight className="h-3 w-3" />
                    <span>{selectedPet.weight} kg</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-red-500" />
                    <span>{selectedPet.bloodType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Vacuna: {formatDate(selectedPet.lastVaccination)}</span>
                  </div>
                </div>

                {selectedRequestData?.tipo_sangre && (
                  <div className="mt-2">
                    {isCompatibleBloodType(selectedPet.bloodType, selectedRequestData.tipo_sangre) ? (
                      <Badge className="bg-green-100 text-green-800">
                        ✓ Tipo de sangre compatible
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        ⚠ Tipo de sangre no compatible
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
