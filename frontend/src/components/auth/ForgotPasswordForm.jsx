import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import apiService from '@/services/AuthApi';

export default function ForgotPasswordForm({ onSuccess, prefilledEmail = null }) {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { userData } = useAuth();

  // Si el usuario está logueado, usar su email, si no, usar el email prefill
  const initialEmail = userData?.email || prefilledEmail || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: initialEmail
    }
  });

  // Actualizar el email cuando cambie userData o prefilledEmail
  useEffect(() => {
    const emailToUse = userData?.email || prefilledEmail || '';
    if (emailToUse) {
      setValue('email', emailToUse);
    }
  }, [userData, prefilledEmail, setValue]);

  const validations = {
    email: {
      required: 'El correo electrónico es obligatorio',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Formato de correo electrónico inválido'
      }
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      console.log('Solicitud de recuperación enviada para:', data.email);
      
      // Llamar a la API de forgot password
      const response = await apiService.forgotPassword(data.email);
      
      if (response.success) {
        setEmailSent(true);
        
        if (onSuccess) {
          onSuccess(data.email);
        }
      } else {
        alert('Error inesperado. Intenta nuevamente.');
      }
      
    } catch (error) {
      console.error('Error en forgot password:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900">
          ¡Correo enviado!
        </h3>
        
        <p className="text-gray-600">
          Hemos enviado un enlace de recuperación a tu correo electrónico.
          Revisa tu bandeja de entrada y sigue las instrucciones.
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            El enlace expirará en 1 hora por seguridad.
            Si no recibes el correo, revisa tu carpeta de spam.
          </p>
        </div>
        
        <Button 
          onClick={() => setEmailSent(false)}
          variant="outline"
          className="w-full"
        >
          Enviar otro correo
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="text-center mb-6">
        {userData ? (
          <p className="text-gray-600">
            Confirma que deseas cambiar la contraseña de tu cuenta.
          </p>
        ) : (
          <p className="text-gray-600">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        )}
      </div>

      {/* Campo de email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Correo electrónico *
        </label>
        <Input
          type="email"
          {...register('email', validations.email)}
          placeholder="tu@email.com"
          className={errors.email ? 'border-red-500' : ''}
          autoComplete="email"
          disabled={!!userData}
          readOnly={!!userData}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
        {userData && (
          <p className="text-xs text-gray-500 mt-1">
            Este es el email asociado a tu cuenta actual
          </p>
        )}
      </div>

      {/* Botón de envío */}
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!isValid || isLoading}
      >
        {isLoading ? 'Enviando correo...' : userData ? 'Enviar enlace de cambio' : 'Enviar enlace de recuperación'}
      </Button>

      {/* Indicador de campos obligatorios */}
      <p className="text-xs text-gray-500 text-center mt-2">
        Los campos marcados con * son obligatorios
      </p>
    </form>
  );
}
