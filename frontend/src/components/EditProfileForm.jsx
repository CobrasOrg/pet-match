import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BOGOTA_LOCALITIES } from '@/constants/locations';
import { generateMockClinics, generateMockPetOwners } from '@/constants/mockUsers';

export default function EditProfileForm({ userData, userType, onSuccess, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: userData?.name || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      address: userData?.address || '',
      locality: userData?.locality || ''
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
      locality: {
        required: 'La localidad es obligatoria'
      }
    })
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Datos actualizados:', data);
      
      // Simular verificación de email único si cambió usando datos mock
      if (data.email !== userData.email) {
        const owners = generateMockPetOwners();
        const clinics = generateMockClinics();
        
        const emailExists = owners.some(owner => owner.email === data.email && owner.id !== userData.id) || 
                           clinics.some(clinic => clinic.email === data.email && clinic.id !== userData.id);
        
        if (emailExists) {
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

          {/* Localidad - Solo para clínicas */}
          {userType === 'clinic' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localidad de Bogotá *
              </label>
              <Select onValueChange={(value) => setValue('locality', value)} defaultValue={userData?.locality || ''}>
                <SelectTrigger className={`w-full ${errors.locality ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Selecciona una localidad" />
                </SelectTrigger>
                <SelectContent>
                  {BOGOTA_LOCALITIES.map((locality) => (
                    <SelectItem key={locality.value} value={locality.value}>
                      {locality.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register('locality', validations.locality)}
              />
              {errors.locality && (
                <p className="text-red-500 text-xs mt-1">{errors.locality.message}</p>
              )}
            </div>
          )}
        </div>
      </div>

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
