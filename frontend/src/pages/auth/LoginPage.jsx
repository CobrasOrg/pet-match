import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const navigate = useNavigate();
  
  const handleLoginSuccess = (userType) => {
    // Redirigir según el tipo de usuario
    if (userType === 'clinic') {
      navigate('/requests');  // → Gestión de solicitudes
    } else {
      navigate('/public');    // → Solicitudes públicas
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
          <p className="text-gray-600">Accede a tu cuenta de Pet Match</p>
        </CardHeader>
        <CardContent>
          <LoginForm 
            onSuccess={handleLoginSuccess}
            onForgotPassword={handleForgotPassword}
          />
          
          {/* Enlaces adicionales */}
          <div className="mt-6 space-y-2 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link 
                to="/register" 
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                Registrarse
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              <Link 
                to="/public" 
                className="text-gray-500 hover:text-gray-700 hover:underline"
              >
                Ver solicitudes públicas
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
