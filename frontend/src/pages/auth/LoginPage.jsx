import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const navigate = useNavigate();
  
  const handleLoginSuccess = (userType) => {
    // Redirigir a la homepage personalizada para ambos tipos de usuario
    navigate('/');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
