import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function EditProfileForm({ userData, userType, onSuccess, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: userData?.name || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      address: userData?.address || '',
      license: userData?.license || '',
      services: userData?.services || ''
    }
  });

  // Validaciones específicas
  const validations = {
    name: {
      required: userType === 'clinic' ? 'El nombre de la clínica es obligatorio' : 'El nombre completo es obligatorio',
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
    ...(userType === 'clinic' && {
      license: {
        required: 'El número de licencia es obligatorio',
        minLength: {
          value: 5,
          message: 'El número de licencia debe tener al menos 5 caracteres'
        }
      },
      services: {
        required: 'Describe los servicios que ofreces',
        minLength: {
          value: 10,
          message: 'La descripción debe tener al menos 10 caracteres'
        }
      }
    })
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Datos actualizados:', data);
      
      // Simular verificación de email único si cambió
      if (data.email !== userData.email) {
        const existingEmails = [
          'juan@example.com',
          'veterinaria@sanpatricio.com',
          'admin@petmatch.com'
        ];
        
        if (existingEmails.includes(data.email)) {
          alert('Este correo electrónico ya está en uso por otra cuenta.');
          return;
        }
      }
      
      alert('¡Perfil actualizado exitosamente! Los cambios se verán reflejados inmediatamente.');
      
      if (onSuccess) {
        onSuccess(data);
      }
      
    } catch {
      alert('Error al actualizar el perfil. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Información básica */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {userType === 'clinic' ? 'Nombre de la clínica' : 'Nombre completo'} *
            </label>
            <Input
              {...register('name', validations.name)}
              placeholder={userType === 'clinic' ? 'Veterinaria San Patricio' : 'Juan Pérez'}
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
              placeholder="tu@email.com"
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
        </div>
      </div>

      {/* Información específica para clínicas */}
      {userType === 'clinic' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Profesional</h3>
          <div className="space-y-4">
            {/* Número de licencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de licencia veterinaria *
              </label>
              <Input
                {...register('license', validations.license)}
                placeholder="LIC-VET-2024-001"
                className={errors.license ? 'border-red-500' : ''}
              />
              {errors.license && (
                <p className="text-red-500 text-xs mt-1">{errors.license.message}</p>
              )}
            </div>

            {/* Servicios ofrecidos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Servicios ofrecidos *
              </label>
              <Textarea
                {...register('services', validations.services)}
                placeholder="Emergencias 24/7, Banco de Sangre, Cirugía..."
                className={`min-h-[100px] ${errors.services ? 'border-red-500' : ''}`}
              />
              {errors.services && (
                <p className="text-red-500 text-xs mt-1">{errors.services.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-4 pt-6 border-t">
        <Button 
          type="submit" 
          disabled={!isValid || !isDirty || isLoading}
          className="flex-1"
        >
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>

      {/* Información sobre cambios */}
      {isDirty && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Hay cambios sin guardar.</span> 
            {' '}Asegúrate de hacer clic en "Guardar Cambios" para aplicar las modificaciones.
          </p>
        </div>
      )}

      {/* Indicador de campos obligatorios */}
      <p className="text-xs text-gray-500 text-center">
        Los campos marcados con * son obligatorios
      </p>
    </form>
  );
}
