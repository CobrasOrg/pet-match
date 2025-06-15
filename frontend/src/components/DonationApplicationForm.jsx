import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DogIcon,
  CatIcon,
  CalendarIcon,
  ScaleIcon,
  HeartPulseIcon,
  AlertCircleIcon,
  ClipboardListIcon
} from 'lucide-react';
//import { useParams } from 'react-router-dom'; desactivada por el momento, ya que no se usa el ID de la solicitud
import Lottie from "lottie-react";
import dog from "@/assets/dog.json";
import { toast } from 'sonner';

const speciesOptions = [
  { value: 'canine', label: 'Perro', icon: <DogIcon className="h-4 w-4 mr-2" /> },
  { value: 'feline', label: 'Gato', icon: <CatIcon className="h-4 w-4 mr-2" /> }
];

const bloodTypeOptions = {
  canine: ['DEA 1.1+', 'DEA 1.1-'],
  feline: ['A', 'B', 'AB']
};

export default function DonationApplicationForm() {
  const { id: requestId } = useParams(); // ID de la solicitud a la que se está aplicando
  console.log("ID de solicitud:", requestId); // Para depuración, puedes eliminarlo más tarde

  const form = useForm({
    defaultValues: {
      petName: '',
      species: '',
      breed: '',
      age: '',
      weight: '',
      bloodType: '',
      lastVaccination: '',
      healthStatus: '', // Cambiado de healthConditions
      medications: '',
      ownerName: '',
      ownerPhone: '',
      ownerEmail: '',
      ownerAddress: '', // Nuevo campo
      availability: '',
      termsAccepted: false
    }
  });

  const selectedSpecies = form.watch('species');

  const onSubmit = async (data) => {
    // Adaptar los datos al esquema de la API
    const payload = {
      petName: data.petName,
      species: data.species,
      breed: data.breed,
      age: Number(data.age),
      weight: Number(data.weight),
      bloodType: data.bloodType,
      lastVaccination: data.lastVaccination,
      healthStatus: data.healthStatus,
      medications: data.medications,
      ownerName: data.ownerName,
      ownerPhone: data.ownerPhone,
      ownerEmail: data.ownerEmail,
      ownerAddress: data.ownerAddress,
      availability: data.availability, // <-- Faltaba este campo en el payload
      termsAccepted: data.termsAccepted
    };

    try {
      const res = await fetch(`http://localhost:8001/base/api/solicitudes/${requestId}/postulaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.status === 409) {
        toast.error('Ya existe una postulación con este correo electrónico.');
        return;
      }
      if (!res.ok) {
        // Manejo mejorado de errores de validación
        const errorData = await res.json().catch(() => ({}));
        // FastAPI suele devolver un array en errorData.detail
        let errorMsg = 'No se pudo enviar la postulación';
        if (Array.isArray(errorData.detail)) {
          errorMsg = errorData.detail.map(e => e.msg).join(' | ');
        } else if (typeof errorData.detail === 'string') {
          errorMsg = errorData.detail;
        }
        toast.error(errorMsg);
        return;
      }
      toast.success('¡Gracias por tu voluntad de ayudar! Hemos recibido tu información.');
      form.reset();
    } catch (err) {
      toast.error('Error al enviar la postulación: ' + (err.message || 'Error desconocido'));
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mt-4">Formulario de Donación</h1>
        <p className="text-gray-600">Proporciona información sobre tu mascota para evaluar su aptitud como donante</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información básica de la mascota */}
            <FormField
              control={form.control}
              name="petName"
              rules={{ required: "Este campo es obligatorio" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de tu mascota *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Max" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="species"
              rules={{ required: "Este campo es obligatorio" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especie *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una especie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {speciesOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center">
                            {option.icon}
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Raza (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Pastor Alemán, Siamesa..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              rules={{ required: "Este campo es obligatorio" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Edad (años) *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input type="number" className="pl-10" placeholder="Ej: 3" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              rules={{ 
                required: "Este campo es obligatorio",
                min: { value: 0, message: "El peso debe ser positivo" }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso (kg) *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <ScaleIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input type="number" className="pl-10" placeholder="Ej: 25" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedSpecies && (
              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de sangre (si lo conoces)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tipo de sangre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bloodTypeOptions[selectedSpecies].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Historial de salud */}
          <div className="space-y-6">
            <h3 className="font-medium flex items-center">
              <HeartPulseIcon className="h-5 w-5 mr-2" />
              Historial de salud
            </h3>

            <FormField
              control={form.control}
              name="lastVaccination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Última vacunación (fecha aproximada)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="healthStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condiciones médicas conocidas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe cualquier condición médica, enfermedad previa o alergias..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicamentos actuales</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Lista cualquier medicamento que tu mascota esté tomando actualmente..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Información del dueño */}
          <div className="space-y-6">
            <h3 className="font-medium flex items-center">
              <ClipboardListIcon className="h-5 w-5 mr-2" />
              Información del dueño
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="ownerName"
                rules={{ required: "Este campo es obligatorio" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ownerPhone"
                rules={{ 
                  required: "Este campo es obligatorio",
                  pattern: {
                    value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                    message: "Ingrese un número de teléfono válido"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono de contacto *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: +1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ownerEmail"
                rules={{ 
                  required: "Este campo es obligatorio",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Ingrese un correo electrónico válido"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="tu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ownerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección del dueño</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Calle 100 #15-20, Bogotá" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disponibilidad para donación</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Fines de semana, mañanas..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Términos y condiciones */}
          <FormField
            control={form.control}
            name="termsAccepted"
            rules={{ required: "Debes aceptar los términos para continuar" }}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Acepto los términos y condiciones de donación *
                  </FormLabel>
                  <p className="text-sm text-gray-500">
                    Confirmo que la información proporcionada es verídica y que mi mascota cumple con los requisitos básicos para donar sangre.
                  </p>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col items-center"> 
            <Lottie animationData={dog} loop={true} className="w-32 h-32" />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700  px-7 py-6 text-md ">
              Enviar solicitud de donación
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}