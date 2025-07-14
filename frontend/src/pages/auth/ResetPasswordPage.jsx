import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import apiService from '@/services/api';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [tokenValid, setTokenValid] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Validación REAL del token con el backend
    const validateToken = async () => {
      try {
        if (!token) {
          setTokenValid(false);
          setError('No se proporcionó un token de recuperación');
          return;
        }

        // Validar el token con el backend
        const result = await apiService.validateResetToken(token);
        
        if (result.valid) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setError(result.error || 'Token inválido o expirado');
        }
        
      } catch {
        setTokenValid(false);
        setError('Error al validar el enlace de recuperación');
      }
    };

    validateToken();
  }, [token]);

  const handleResetSuccess = () => {
    // La redirección se maneja en el componente ResetPasswordForm
  };

  // Loading state mientras valida el token
  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600">Validando enlace de recuperación...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Token inválido o expirado
  if (!tokenValid) {
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
            
            <CardTitle className="text-2xl font-bold text-red-600">Enlace Inválido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900">
                {error || 'El enlace ha expirado o es inválido'}
              </h3>
              
              <p className="text-gray-600">
                {error ? 
                  'Por favor, solicita un nuevo enlace de recuperación.' :
                  'El enlace de recuperación de contraseña puede haber expirado o ser incorrecto. Solicita un nuevo enlace para restablecer tu contraseña.'
                }
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/forgot-password')}
                  className="w-full"
                >
                  Solicitar nuevo enlace
                </Button>
                
                <Button 
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="w-full"
                >
                  Ir a iniciar sesión
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Token válido - mostrar formulario de reset
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
          
          <CardTitle className="text-2xl font-bold">Restablecer Contraseña</CardTitle>
          <p className="text-gray-600">Ingresa tu nueva contraseña</p>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm 
            token={token} 
            onSuccess={handleResetSuccess} 
          />
          
          {/* Enlaces de navegación */}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
