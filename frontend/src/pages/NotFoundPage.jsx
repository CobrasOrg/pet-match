import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              className="h-20 w-auto" 
              src="/logo_petmatch.png" 
              alt="PetMatch logo" 
            />
          </div>

          {/* Icono de error 404 */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.44-1.01-5.879-2.625M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Título y mensaje */}
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Página no encontrada
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Lo sentimos, la página que estás buscando no existe o ha sido movida. 
            Verifica la URL o regresa a la página principal.
          </p>

          {/* Botones de navegación */}
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')}
              className="w-full"
              size="lg"
            >
              Ir a la página principal
            </Button>
            
            <Button 
              onClick={handleGoBack}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Volver atrás
            </Button>

            <div className="flex gap-2 mt-4">
              <Button 
                onClick={() => navigate('/login')}
                variant="ghost"
                className="flex-1"
              >
                Iniciar sesión
              </Button>
              
              <Button 
                onClick={() => navigate('/register')}
                variant="ghost"
                className="flex-1"
              >
                Registrarse
              </Button>
            </div>
          </div>

          {/* Mensaje adicional */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">¿Necesitas ayuda?</span> 
              <br />
              Si crees que esto es un error, puedes contactar a nuestro equipo de soporte.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
