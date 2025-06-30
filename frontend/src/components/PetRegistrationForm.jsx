import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUploader from '@/components/ui/ImageUploader';

// Constantes para el formulario
const SPECIES_OPTIONS = [
  { value: 'canine', label: 'Perro' },
  { value: 'feline', label: 'Gato' }
];

const BLOOD_TYPES = {
  canine: [
    'DEA 1.1+',
    'DEA 1.1-', 
    'DEA 1.2+',
    'DEA 1.2-',
    'DEA 3+',
    'DEA 3-',
    'DEA 4+',
    'DEA 4-',
    'DEA 5+',
    'DEA 5-',
    'DEA 7+',
    'DEA 7-'
  ],
  feline: [
    'A',
    'B',
    'AB'
  ]
};

const COMMON_BREEDS = {
  canine: [
    'Golden Retriever',
    'Labrador Retriever', 
    'Pastor Alemán',
    'Bulldog Francés',
    'Poodle',
    'Beagle',
    'Rottweiler',
    'Yorkshire Terrier',
    'Chihuahua',
    'Mestizo',
    'Otro'
  ],
  feline: [
    'Mestizo',
    'Persa',
    'Siamés',
    'Maine Coon',
    'Ragdoll',
    'British Shorthair',
    'Abisinio',
    'Bengalí',
    'Sphynx',
    'Otro'
  ]
};

export default function PetRegistrationForm({ onSuccess, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      petName: '',
      species: '',
      breed: '',
      customBreed: '',
      age: '',
      weight: '',
      bloodType: '',
      lastVaccination: '',
      healthStatus: '',
      petPhoto: null
    }
  });

  const watchedSpecies = watch('species');
  const watchedBreed = watch('breed');

  // Validaciones
  const validations = {
    petName: {
      required: 'El nombre de la mascota es obligatorio',
      minLength: {
        value: 2,
        message: 'El nombre debe tener al menos 2 caracteres'
      },
      maxLength: {
        value: 50,
        message: 'El nombre no puede tener más de 50 caracteres'
      }
    },
    species: {
      required: 'La especie es obligatoria'
    },
    breed: {
      required: 'La raza es obligatoria'
    },
    age: {
      required: 'La edad es obligatoria',
      min: {
        value: 0.5,
        message: 'La edad mínima es 6 meses'
      },
      max: {
        value: 20,
        message: 'La edad máxima es 20 años'
      },
      pattern: {
        value: /^\d+(\.\d{1,2})?$/,
        message: 'Formato de edad inválido (ej: 2 o 2.5)'
      }
    },
    weight: {
      required: 'El peso es obligatorio',
      min: {
        value: 1,
        message: 'El peso mínimo es 1 kg'
      },
      max: {
        value: 100,
        message: 'El peso máximo es 100 kg'
      },
      pattern: {
        value: /^\d+(\.\d{1,2})?$/,
        message: 'Formato de peso inválido (ej: 25 o 25.5)'
      }
    },
    bloodType: {
      required: 'El tipo de sangre es obligatorio'
    },
    lastVaccination: {
      required: 'La fecha de la última vacuna es obligatoria',
      validate: (value) => {
        const vaccinationDate = new Date(value);
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        
        if (vaccinationDate > today) {
          return 'La fecha no puede ser futura';
        }
        if (vaccinationDate < oneYearAgo) {
          return 'La última vacuna debe ser dentro del último año';
        }
        return true;
      }
    },
    healthStatus: {
      required: 'El estado de salud es obligatorio',
      minLength: {
        value: 10,
        message: 'Describe el estado de salud con al menos 10 caracteres'
      }
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular subida de imagen si existe
      let imageUrl = null;
      if (selectedImage) {
        // En un entorno real, aquí subirías la imagen a un servicio de almacenamiento
        // Por ahora, simulamos creando una URL local
        imageUrl = URL.createObjectURL(selectedImage);
        console.log('Imagen simulada subida:', imageUrl);
      }
      
      const petData = {
        petName: data.petName,
        species: data.species,
        breed: data.breed === 'Otro' ? data.customBreed : data.breed,
        age: parseFloat(data.age),
        weight: parseFloat(data.weight),
        bloodType: data.bloodType,
        lastVaccination: data.lastVaccination,
        healthStatus: data.healthStatus,
        petPhoto: imageUrl, // URL de la imagen
        registeredAt: new Date().toISOString(),
        isActive: true
      };
      
      console.log('Datos de la mascota:', petData);
      
      alert('¡Mascota registrada exitosamente! Ya puede ser considerada para donaciones compatibles.');
      
      if (onSuccess) {
        onSuccess(petData);
      }
      
    } catch (error) {
      console.error('Error registrando mascota:', error);
      alert('Error al registrar la mascota. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Información básica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la mascota *
              </label>
              <Input
                {...register('petName', validations.petName)}
                placeholder="Luna, Max, Bella..."
                className={errors.petName ? 'border-red-500' : ''}
              />
              {errors.petName && (
                <p className="text-red-500 text-xs mt-1">{errors.petName.message}</p>
              )}
            </div>

            {/* Especie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Especie *
              </label>
              <Select 
                value={watchedSpecies} 
                onValueChange={(value) => {
                  setValue('species', value);
                  setValue('breed', ''); // Reset breed when species changes
                  setValue('bloodType', ''); // Reset blood type when species changes
                }}
              >
                <SelectTrigger className={errors.species ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecciona la especie" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIES_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.species && (
                <p className="text-red-500 text-xs mt-1">{errors.species.message}</p>
              )}
            </div>

            {/* Raza */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raza *
              </label>
              <Select 
                value={watchedBreed} 
                onValueChange={(value) => setValue('breed', value)}
                disabled={!watchedSpecies}
              >
                <SelectTrigger className={errors.breed ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecciona la raza" />
                </SelectTrigger>
                <SelectContent>
                  {watchedSpecies && COMMON_BREEDS[watchedSpecies]?.map((breed) => (
                    <SelectItem key={breed} value={breed}>
                      {breed}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.breed && (
                <p className="text-red-500 text-xs mt-1">{errors.breed.message}</p>
              )}
            </div>

            {/* Raza personalizada */}
            {watchedBreed === 'Otro' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especifica la raza *
                </label>
                <Input
                  {...register('customBreed', { 
                    required: watchedBreed === 'Otro' ? 'Especifica la raza' : false 
                  })}
                  placeholder="Ingresa la raza específica"
                  className={errors.customBreed ? 'border-red-500' : ''}
                />
                {errors.customBreed && (
                  <p className="text-red-500 text-xs mt-1">{errors.customBreed.message}</p>
                )}
              </div>
            )}

            {/* Edad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Edad (años) *
              </label>
              <Input
                type="number"
                step="0.5"
                min="0.5"
                max="20"
                {...register('age', validations.age)}
                placeholder="2.5"
                className={errors.age ? 'border-red-500' : ''}
              />
              {errors.age && (
                <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Edad mínima: 6 meses (0.5 años)
              </p>
            </div>

            {/* Peso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso (kg) *
              </label>
              <Input
                type="number"
                step="0.1"
                min="1"
                max="100"
                {...register('weight', validations.weight)}
                placeholder="25.5"
                className={errors.weight ? 'border-red-500' : ''}
              />
              {errors.weight && (
                <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información médica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Médica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Tipo de sangre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de sangre *
              </label>
              <Select 
                value={watch('bloodType')} 
                onValueChange={(value) => setValue('bloodType', value)}
                disabled={!watchedSpecies}
              >
                <SelectTrigger className={errors.bloodType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  {watchedSpecies && BLOOD_TYPES[watchedSpecies]?.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bloodType && (
                <p className="text-red-500 text-xs mt-1">{errors.bloodType.message}</p>
              )}
            </div>

            {/* Última vacuna */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Última vacuna *
              </label>
              <Input
                type="date"
                {...register('lastVaccination', validations.lastVaccination)}
                className={errors.lastVaccination ? 'border-red-500' : ''}
              />
              {errors.lastVaccination && (
                <p className="text-red-500 text-xs mt-1">{errors.lastVaccination.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Debe ser dentro del último año
              </p>
            </div>
          </div>

          {/* Estado de salud */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado de salud *
            </label>
            <Textarea
              {...register('healthStatus', validations.healthStatus)}
              placeholder="Describe el estado de salud general de tu mascota, alergias conocidas, medicamentos actuales, enfermedades crónicas, etc."
              className={`min-h-[100px] ${errors.healthStatus ? 'border-red-500' : ''}`}
            />
            {errors.healthStatus && (
              <p className="text-red-500 text-xs mt-1">{errors.healthStatus.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Incluye información médica relevante para las clínicas veterinarias
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Foto de la mascota */}
      <Card>
        <CardHeader>
          <CardTitle>Foto de la Mascota</CardTitle>
          <p className="text-sm text-gray-600">
            Sube una foto clara de tu mascota para que sea fácilmente reconocible
          </p>
        </CardHeader>
        <CardContent>
          <ImageUploader
            value={selectedImage}
            onChange={setSelectedImage}
            accept="image/*"
            maxSize={2 * 1024 * 1024} // 2MB
          />
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex gap-4 pt-4">
        <Button 
          type="submit" 
          disabled={!isValid || isLoading}
          className="flex-1"
        >
          {isLoading ? 'Registrando...' : 'Registrar Mascota'}
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

      {/* Información sobre campos obligatorios */}
      <p className="text-xs text-gray-500 text-center">
        Los campos marcados con * son obligatorios
      </p>
    </form>
  );
}
