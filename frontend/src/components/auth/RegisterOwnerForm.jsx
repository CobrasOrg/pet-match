import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import apiService from '@/services/AuthApi';

export default function RegisterOwnerForm({ onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange', // Validación en tiempo real
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch('password');

  // Validaciones específicas para dueños de mascotas
  const validations = {
    name: {
      required: 'El nombre completo es obligatorio',
      minLength: {
        value: 2,
        message: 'El nombre debe tener al menos 2 caracteres'
      }
    },
    email: {
      required: 'El correo electrónico es obligatorio',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Formato de correo electrónico inválido'
      }
    },
    phone: {
      required: 'El teléfono es obligatorio',
      pattern: {
        value: /^[+]?[(]?[0-9]{10,}$/,
        message: 'Formato de teléfono inválido (mínimo 10 dígitos)'
      }
    },
    address: {
      required: 'La dirección es obligatoria',
      minLength: {
        value: 5,
        message: 'La dirección debe tener al menos 5 caracteres'
      }
    },
    password: {
      required: 'La contraseña es obligatoria',
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
        message: 'La contraseña debe tener al menos 8 caracteres, 1 mayúscula y 1 número'
      }
    },
    confirmPassword: {
      required: 'Confirma tu contraseña',
      validate: value => value === password || 'Las contraseñas no coinciden'
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      console.log('Intentando registro de owner con:', data.email);
      
      // Preparar datos para la API (la API espera confirmPassword)
      const registrationData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        password: data.password,
        confirmPassword: data.confirmPassword
      };
      
      // Llamar a la API de registro
      const response = await apiService.registerOwner(registrationData);
      
      if (response.success && response.token && response.user) {
        console.log('Registro exitoso:', response.user);
        
        // Registrar usuario usando el hook de autenticación
        login(response.user.userType, response.user, response.token);
        
        alert(`¡Registro exitoso! Bienvenido ${response.user.name}. Serás redirigido a las solicitudes públicas.`);
        
        // Llamar onSuccess si se proporciona
        if (onSuccess) {
          onSuccess();
        }
        
        // Navegar a la página correspondiente
        navigate('/public');
        
      } else {
        alert('Respuesta inesperada del servidor. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      alert(`Error en el registro: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nombre completo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre completo *
        </label>
        <Input
          {...register('name', validations.name)}
          placeholder="Juan Pérez"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Correo electrónico *
        </label>
        <Input
          type="email"
          {...register('email', validations.email)}
          placeholder="juan@example.com"
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono *
        </label>
        <Input
          {...register('phone', validations.phone)}
          placeholder="+57 300 123 4567"
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Dirección */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección *
        </label>
        <Input
          {...register('address', validations.address)}
          placeholder="Calle 123 #45-67"
          className={errors.address ? 'border-red-500' : ''}
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
        )}
      </div>

      {/* Contraseña */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña *
        </label>
        <Input
          type="password"
          {...register('password', validations.password)}
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Mínimo 8 caracteres, 1 mayúscula y 1 número
        </p>
      </div>

      {/* Confirmar contraseña */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirmar contraseña *
        </label>
        <Input
          type="password"
          {...register('confirmPassword', validations.confirmPassword)}
          className={errors.confirmPassword ? 'border-red-500' : ''}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Botón de envío */}
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!isValid || isLoading}
      >
        {isLoading ? 'Registrando...' : 'Registrarse'}
      </Button>

      {/* Indicador de campos obligatorios */}
      <p className="text-xs text-gray-500 text-center mt-2">
        Los campos marcados con * son obligatorios
      </p>
    </form>
  );
}
