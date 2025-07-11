import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { generateMockClinics, generateMockPetOwners } from '@/constants/mockUsers';

export default function LoginForm({ onSuccess, onForgotPassword }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange', // Validación en tiempo real
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Validaciones específicas para inicio de sesión
  const validations = {
    email: {
      required: 'El correo electrónico es obligatorio',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Formato de correo electrónico inválido'
      }
    },
    password: {
      required: 'La contraseña es obligatoria',
      minLength: {
        value: 1,
        message: 'La contraseña no puede estar vacía'
      }
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      // Simular llamada a API de autenticación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulación de validación de credenciales
      const isValidCredentials = simulateLogin(data.email, data.password);
      
      if (isValidCredentials.success) {
        console.log('Inicio de sesión exitoso:', data.email);
        console.log('Tipo de usuario:', isValidCredentials.userType);
        console.log('Datos del usuario:', isValidCredentials.userData);
        
        // Usar el contexto de autenticación para hacer login con datos completos
        login(isValidCredentials.userType, isValidCredentials.userData);
        
        alert(`Bienvenido ${isValidCredentials.userData.name}! Redirigiendo al panel de ${isValidCredentials.userType === 'clinic' ? 'clínica' : 'dueño'}...`);
        
        // Llamar callback de éxito
        if (onSuccess) {
          onSuccess(isValidCredentials.userType);
        }
      } else {
        alert('Credenciales incorrectas. Verifica tu correo y contraseña.');
      }
    } catch {
      alert('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Simulación de validación de credenciales usando datos mock
  const simulateLogin = (email, password) => {
    // Obtener usuarios mock
    const owners = generateMockPetOwners();
    const clinics = generateMockClinics();
    
    // Buscar en propietarios
    const owner = owners.find(u => u.email === email && u.password === password);
    if (owner) {
      return {
        success: true,
        userType: 'owner',
        userData: owner
      };
    }
    
    // Buscar en clínicas
    const clinic = clinics.find(u => u.email === email && u.password === password);
    if (clinic) {
      return {
        success: true,
        userType: 'clinic',
        userData: clinic
      };
    }
    
    // No encontrado
    return { success: false };
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Campo de contraseña con toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña *
        </label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            {...register('password', validations.password)}
            placeholder="Tu contraseña"
            className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            ) : (
              <EyeIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Botón de iniciar sesión */}
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!isValid || isLoading}
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </Button>

      {/* Enlace para recuperar contraseña */}
      <div className="text-center">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {/* Información de usuarios de prueba (solo para demo) */}
      <div className="mt-6 p-3 bg-gray-50 rounded-md">
        <p className="text-xs text-gray-600 font-medium mb-2">Usuarios de prueba (desde mockUsers.jsx):</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>Dueño: {generateMockPetOwners()[0].email} / {generateMockPetOwners()[0].password}</p>
          <p>Clínica: {generateMockClinics()[0].email} / {generateMockClinics()[0].password}</p>
        </div>
      </div>

      {/* Indicador de campos obligatorios */}
      <p className="text-xs text-gray-500 text-center mt-2">
        Los campos marcados con * son obligatorios
      </p>
    </form>
  );
}
