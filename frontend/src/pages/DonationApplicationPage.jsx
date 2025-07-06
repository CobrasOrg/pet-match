import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DonationApplicationForm from '@/components/DonationApplicationForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Dog, Cat } from 'lucide-react';

export default function DonationApplicationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);

  useEffect(() => {
    // Obtener datos del estado de navegación
    if (location.state && location.state.request && location.state.selectedPet) {
      setRequest(location.state.request);
      setSelectedPet(location.state.selectedPet);
    } else {
      // Si no hay datos, redirigir a la página principal
      navigate('/public');
    }
  }, [location.state, navigate]);

  if (!request || !selectedPet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Cargando...
          </h2>
          <p className="text-gray-600">
            Preparando tu solicitud de donación
          </p>
        </div>
      </div>
    );
  }

  const getSpeciesIcon = (species) => {
    if (species === 'canine' || species === 'Perro') return <Dog className="h-5 w-5" />;
    if (species === 'feline' || species === 'Gato') return <Cat className="h-5 w-5" />;
    return <Heart className="h-5 w-5" />;
  };

  const getDisplaySpecies = (species) => {
    if (species === 'canine') return 'Perro';
    if (species === 'feline') return 'Gato';
    return species;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/public')}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a solicitudes
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Postular Donante
            </h1>
            <p className="text-gray-600">
              Ayudando a <span className="font-semibold text-pink-600">{request.nombre_mascota}</span>
            </p>
          </div>
        </div>

        {/* Información resumida */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Información del receptor */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                {getSpeciesIcon(request.especie)}
                Mascota que necesita ayuda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre:</span>
                  <span className="font-semibold">{request.nombre_mascota}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Especie:</span>
                  <span className="font-semibold">{getDisplaySpecies(request.especie)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Raza:</span>
                  <span className="font-semibold">{request.raza}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo de sangre:</span>
                  <span className="font-semibold">{request.tipo_sangre}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del donante */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-600" />
                Tu mascota donante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre:</span>
                  <span className="font-semibold">{selectedPet.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Especie:</span>
                  <span className="font-semibold">{getDisplaySpecies(selectedPet.species)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Raza:</span>
                  <span className="font-semibold">{selectedPet.breed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo de sangre:</span>
                  <span className="font-semibold">{selectedPet.bloodType}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulario de aplicación */}
        <DonationApplicationForm 
          request={request} 
          selectedPet={selectedPet}
        />
      </div>
    </div>
  );
}
