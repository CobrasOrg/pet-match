import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRef } from 'react';
import { toast } from 'sonner';

// Esquema de validación con Zod usando los nombres EXACTOS que espera la API
const formSchema = z.object({
    descripcion_solicitud: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
    especie: z.string().min(1, "Selecciona una especie"),
    foto_mascota: z.any().optional(),
    nombre_mascota: z.string().min(1, "Ingresa el nombre de la mascota"),
    peso_minimo: z.number().min(0.1, "El peso debe ser mayor a 0"),
    tipo_sangre: z.string().min(1, "Selecciona un tipo de sangre"),
    urgencia: z.string().min(1, "Selecciona un nivel de urgencia"),
});

export default function BloodRequestForm({ onRequestCreated }) {
    const { userData } = useAuth();

    // Verificar que los datos del perfil estén completos
    const isProfileComplete = userData?.name && userData?.phone && userData?.address && userData?.locality;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            descripcion_solicitud: "",
            especie: "",
            foto_mascota: null,
            nombre_mascota: "",
            peso_minimo: 0,
            tipo_sangre: "",
            urgencia: ""
        }
    });

    const fileInputRef = useRef(null);

    // Observar el valor de la especie seleccionada
    const selectedSpecies = form.watch("especie");

    // Función para obtener los tipos de sangre según la especie
    const getBloodTypeOptions = (especie) => {
        switch (especie) {
            case 'Perro':
                return [
                    { value: "DEA 1.1+", label: "DEA 1.1+" },
                    { value: "DEA 1.1-", label: "DEA 1.1-" }
                ];
            case 'Gato':
                return [
                    { value: "A", label: "Tipo A" },
                    { value: "B", label: "Tipo B" },
                    { value: "AB", label: "Tipo AB" }
                ];
            default:
                return [];
        }
    };

    // Utilidad para convertir archivo a base64 (si no tienes backend para imágenes)
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            if (!file) return resolve("");
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (data) => {
        try {
            let foto_mascota = "";
            if (data.foto_mascota) {
                foto_mascota = await fileToBase64(data.foto_mascota);
            }

            const payload = {
                ...data,
                foto_mascota,
                // Agregar automáticamente datos del perfil de la veterinaria
                contacto: userData?.phone || "",
                nombre_veterinaria: userData?.name || "",
                direccion: userData?.address || "",
                // Usar la localidad del perfil de la veterinaria
                localidad: userData?.locality || "Bogotá",
                ubicacion: userData?.locality ? `${userData.locality}, Bogotá, Colombia` : userData?.address || "Bogotá, Colombia",
            };

            // Mostrar en consola el payload que se enviará a la API
            console.log("Payload enviado a la API:", payload);

            const response = await fetch('http://localhost:8000/api/v1/vet/solicitudes/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                // Mostrar en consola la respuesta de error de la API
                const errorData = await response.json();
                console.error('Respuesta de error de la API:', errorData);
                throw new Error('Error al crear la solicitud');
            }

            const result = await response.json();

            // Llama a la función callback
            if (onRequestCreated) {
                onRequestCreated(result);
            }
            toast.success('Solicitud de donación creada exitosamente');
            form.reset(); // Resetea el formulario después de enviar

        } catch (error) {
            console.error('Error en el formulario:', error);
            toast.error('Error al procesar el formulario');
        }
    };

    // Función para manejar el cambio de especie
    const handleSpeciesChange = (value) => {
        form.setValue("especie", value);
        // Limpiar el tipo de sangre cuando cambie la especie
        form.setValue("tipo_sangre", "");
    };

    return (
        <div>
            {/* Mensaje de advertencia si faltan datos del perfil */}
            {!isProfileComplete && (
                <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="font-medium">Perfil incompleto</p>
                            <p className="text-sm">
                                Para crear solicitudes necesitas completar tu perfil con: nombre de la clínica, teléfono, dirección y localidad.
                                <a href="/profile" className="underline ml-1 hover:text-yellow-800">
                                    Completar perfil →
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Campo Especie */}
                        <FormField
                            control={form.control}
                            name="especie"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Especie *</FormLabel>
                                    <Select onValueChange={handleSpeciesChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar especie" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Perro">🐶 Perro</SelectItem>
                                            <SelectItem value="Gato">🐱 Gato</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Campo Tipo de Sangre */}
                        <FormField
                            control={form.control}
                            name="tipo_sangre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Sangre *</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={!selectedSpecies}
                                    >
                                        <FormControl>
                                            <SelectTrigger className={!selectedSpecies ? "opacity-50 cursor-not-allowed" : ""}>
                                                <SelectValue
                                                    placeholder={
                                                        !selectedSpecies
                                                            ? "Primero selecciona una especie"
                                                            : `Seleccionar tipo de sangre para ${selectedSpecies}`
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {getBloodTypeOptions(selectedSpecies).map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        {!selectedSpecies
                                            ? "Selecciona primero la especie para ver los tipos de sangre disponibles"
                                            : "Especifica el sistema de grupo sanguíneo"
                                        }
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Campo Urgencia */}
                        <FormField
                            control={form.control}
                            name="urgencia"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Nivel de Urgencia *</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Alta" />
                                                </FormControl>
                                                <FormLabel className="font-normal text-red-600">
                                                    Urgencia Alta (necesidad inmediata)
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Media" />
                                                </FormControl>
                                                <FormLabel className="font-normal text-yellow-600">
                                                    Urgencia Media (en las próximas 72h)
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Campo Peso Mínimo */}
                        <FormField
                            control={form.control}
                            name="peso_minimo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Peso Mínimo Requerido (kg) *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Ej: 25"
                                            min={0}
                                            {...field}
                                            value={field.value === 0 ? "" : field.value}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === "") {
                                                    field.onChange("");
                                                } else {
                                                    const num = parseFloat(value);
                                                    if (!isNaN(num) && num >= 0) {
                                                        field.onChange(num);
                                                    }
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Peso mínimo del donante para seguridad del paciente
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                {/* Campo Descripción */}
                <FormField
                    control={form.control}
                    name="descripcion_solicitud"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción del Caso *</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describa la condición del paciente, diagnóstico y necesidades específicas..."
                                    className="min-h-[120px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Campo Nombre de Mascota */}
                <FormField
                    control={form.control}
                    name="nombre_mascota"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre de la Mascota *</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ej: Canela"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Campo Foto (Opcional) */}
                <FormField
                    control={form.control}
                    name="foto_mascota"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Foto del Paciente (Opcional)</FormLabel>
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={(e) => {
                                        field.onChange(e.target.files?.[0]);
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Seleccionar Imagen
                                </Button>
                                {field.value && (
                                    <span className="text-sm text-gray-600">
                                        {field.value.name}
                                    </span>
                                )}
                            </div>
                            <FormDescription>
                                Imagen clara del paciente para identificación
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-md font-semibold text-white rounded-lg transition-colors duration-200"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? 'Enviando...' : 'Publicar Solicitud de Donación'}
                </Button>
            </form>
        </Form>
        </div>
    );
}