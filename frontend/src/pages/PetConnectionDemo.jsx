import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import PetSelector from '@/components/PetSelector';
import CardMascotaPostulada from '@/components/CardMascotaPostulada';
import PetRegistrationForm from '@/components/PetRegistrationForm';
import { usePets } from '@/hooks/usePetsConnected';

/**
 * Página demo que muestra la conexión entre:
 * 1. PetRegistrationForm (registro de mascotas)
 * 2. PetSelector (selección de mascotas registradas)  
 * 3. CardMascotaPostulada (vista de mascota postulada)
 */
export default function PetConnectionDemo() {
  const { addPet } = usePets();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);

  // Datos simulados de una solicitud de donación
  const mockRequestData = {
    id: 1,
    tipo_sangre: 'DEA 1.1+',
    especie: 'canine',
    peso_minimo: 25,
    descripcion_solicitud: 'Perro con emergencia médica necesita transfusión urgente',
    urgencia: 'Alta'
  };

  const handlePetRegistered = async (petData) => {
    try {
      await addPet(petData);
      setShowRegistrationForm(false);
      alert('¡Mascota registrada exitosamente! Ahora puedes seleccionarla para postulaciones.');
    } catch (error) {
      console.error('Error registrando mascota:', error);
    }
  };

  const handlePetSelected = (applicationData) => {
    setSelectedApplication(applicationData);
  };

  const handleShowApplicationDetails = () => {
    if (selectedApplication) {
      setShowApplicationDialog(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Conexión de Componentes de Mascotas
          </h1>
          <p className="text-gray-600 mt-2">
            Demo de integración: Registro → Selección → Postulación
          </p>
        </div>

        {/* Flujo de conexión */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Flujo de Conexión de Datos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-900">1. Registro</div>
                <div className="text-sm text-blue-700 mt-1">
                  PetRegistrationForm
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  Usuario registra datos completos de su mascota
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="font-semibold text-green-900">2. Selección</div>
                <div className="text-sm text-green-700 mt-1">
                  PetSelector
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  Selecciona mascota registrada para postular
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="font-semibold text-purple-900">3. Postulación</div>
                <div className="text-sm text-purple-700 mt-1">
                  CardMascotaPostulada
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  Muestra datos completos en la postulación
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Datos de la solicitud simulada */}
        <Card>
          <CardHeader>
            <CardTitle>🩸 Solicitud de Donación (Simulada)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div><strong>Tipo de sangre:</strong> {mockRequestData.tipo_sangre}</div>
                <div><strong>Especie:</strong> {mockRequestData.especie === 'canine' ? 'Perro' : 'Gato'}</div>
                <div><strong>Peso mínimo:</strong> {mockRequestData.peso_minimo} kg</div>
                <div><strong>Urgencia:</strong> {mockRequestData.urgencia}</div>
              </div>
              <div className="mt-2">
                <strong>Descripción:</strong> {mockRequestData.descripcion_solicitud}
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Formulario de registro condicional */}
        {showRegistrationForm ? (
          <Card>
            <CardHeader>
              <CardTitle>✏️ Registrar Nueva Mascota</CardTitle>
            </CardHeader>
            <CardContent>
              <PetRegistrationForm
                onSuccess={handlePetRegistered}
                onCancel={() => setShowRegistrationForm(false)}
              />
            </CardContent>
          </Card>
        ) : (
          /* Selector de mascotas */
          <PetSelector
            onPetSelected={handlePetSelected}
            onRegisterNew={() => setShowRegistrationForm(true)}
            selectedRequestData={mockRequestData}
          />
        )}

        {/* Resultado de la selección */}
        {selectedApplication && !showRegistrationForm && (
          <Card>
            <CardHeader>
              <CardTitle>✅ Datos de Postulación Generados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ¡Postulación lista! Los datos de la mascota registrada se han conectado correctamente.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Mascota:</strong> {selectedApplication.petName}</div>
                  <div><strong>Raza:</strong> {selectedApplication.breed}</div>
                  <div><strong>Peso:</strong> {selectedApplication.weight} kg</div>
                  <div><strong>Tipo de sangre:</strong> {selectedApplication.bloodType}</div>
                  <div><strong>Dueño:</strong> {selectedApplication.ownerName}</div>
                  <div><strong>Teléfono:</strong> {selectedApplication.ownerPhone}</div>
                </div>

                <Button onClick={handleShowApplicationDetails} className="w-full">
                  Ver Detalles Completos (CardMascotaPostulada)
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialog de CardMascotaPostulada */}
        <CardMascotaPostulada
          application={selectedApplication}
          isOpen={showApplicationDialog}
          onClose={() => setShowApplicationDialog(false)}
        />

        {/* Información técnica */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle>🔧 Información Técnica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Estado de Conexión:</strong> {selectedApplication ? '✅ Conectado' : '⏳ Pendiente'}
              </div>
              <div>
                <strong>Hook usado:</strong> <code>usePetsConnected.js</code>
              </div>
              <div>
                <strong>Almacenamiento:</strong> localStorage (temporal) → Backend (producción)
              </div>
              <div>
                <strong>Componentes integrados:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>PetRegistrationForm.jsx</li>
                  <li>PetSelector.jsx (nuevo)</li>
                  <li>CardMascotaPostulada.jsx</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
