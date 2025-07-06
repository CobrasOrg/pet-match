import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { useAuth } from '@/context/AuthContext';

export default function ForgotPasswordPage() {
  const { userData } = useAuth();
  
  const handleEmailSent = (email) => {
    console.log('Email de recuperación enviado a:', email);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img 
              className="h-16 w-auto" 
              src="/logo_petmatch.png" 
              alt="PetMatch logo" 
            />
          </div>
          
          <CardTitle className="text-2xl font-bold">
            {userData ? 'Cambiar Contraseña' : 'Recuperar Contraseña'}
          </CardTitle>
          <p className="text-gray-600">
            {userData ? 'Actualiza la contraseña de tu cuenta' : 'Restablece el acceso a tu cuenta'}
          </p>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm onSuccess={handleEmailSent} />
          
          {/* Enlaces de navegación - solo mostrar si no está logueado */}
          {!userData && (
            <div className="mt-6 space-y-2 text-center">
              <p className="text-sm text-gray-600">
                ¿Recordaste tu contraseña?{' '}
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  Iniciar sesión
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link 
                  to="/register" 
                  className="text-green-600 hover:text-green-800 hover:underline font-medium"
                >
                  Registrarse
                </Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
