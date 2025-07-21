import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RegisterOwnerForm from '@/components/auth/RegisterOwnerForm';
import RegisterClinicForm from '@/components/auth/RegisterClinicForm';

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState('owner');

  const handleRegistrationSuccess = () => {
    // La redirección se maneja en los componentes de formulario
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Registrarse</CardTitle>
          <p className="text-gray-600">Crea tu cuenta para comenzar</p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="owner">Dueño de Mascota</TabsTrigger>
              <TabsTrigger value="clinic">Clínica Veterinaria</TabsTrigger>
            </TabsList>
            <TabsContent value="owner">
              <RegisterOwnerForm onSuccess={handleRegistrationSuccess} />
            </TabsContent>
            <TabsContent value="clinic">
              <RegisterClinicForm onSuccess={handleRegistrationSuccess} />
            </TabsContent>
          </Tabs>

          {/* Enlace a login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                inicia sesión
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
