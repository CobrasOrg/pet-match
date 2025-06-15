import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { BOGOTA_LOCALITIES } from '@/constants/locations';

// Esquema de validación con Zod usando los nombres EXACTOS que espera la API
const formSchema = z.object({
    contacto: z.string().regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, "Ingrese un número de teléfono válido"),
    descripcion_solicitud: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
    direccion: z.string().min(1, "Ingresa la dirección completa"),
    especie: z.string().min(1, "Selecciona una especie"),
    foto_mascota: z.any().optional(),
    localidad: z.string().min(1, "Selecciona una localidad"),
    nombre_mascota: z.string().min(1, "Ingresa el nombre de la mascota"),
    nombre_veterinaria: z.string().min(1, "Ingresa el nombre de la clínica"),
    peso_minimo: z.number().min(0.1, "El peso debe ser mayor a 0"),
    tipo_sangre: z.string().min(1, "Selecciona un tipo de sangre"),
    ubicacion: z.string().min(1, "Ingresa la ubicación"),
    urgencia: z.string().min(1, "Selecciona un nivel de urgencia"),
});

export default function BloodRequestForm({ onRequestCreated }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            contacto: "",
            descripcion_solicitud: "",
            direccion: "",
            especie: "",
            foto_mascota: null,
            localidad: "",
            nombre_mascota: "",
            nombre_veterinaria: "",
            peso_minimo: 0,
            tipo_sangre: "",
            ubicacion: "",
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

    // Autocompletar ubicación al seleccionar localidad
    const handleLocalidadChange = (value) => {
        form.setValue("localidad", value);
        form.setValue("ubicacion", `${value}, Bogotá`);
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

                {/* Sección de Ubicación */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campo Localidad */}
                    <FormField
                        control={form.control}
                        name="localidad"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Localidad de Bogotá *</FormLabel>
                                <Select onValueChange={handleLocalidadChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar localidad" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {BOGOTA_LOCALITIES.map((locality) => (
                                            <SelectItem key={locality.value} value={locality.label}>
                                                {locality.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Localidad donde se encuentra la clínica
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Campo Nombre de Clínica */}
                    <FormField
                        control={form.control}
                        name="nombre_veterinaria"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre de la Clínica *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ej: Veterinaria San Patricio"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Nombre oficial de la clínica veterinaria
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Campo Dirección */}
                <FormField
                    control={form.control}
                    name="direccion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Dirección Completa de la Clínica *</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ej: Calle 123 #45-67, Edificio Veterinario"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Dirección específica dentro de la localidad seleccionada
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Campo Ubicación */}
                <FormField
                    control={form.control}
                    name="ubicacion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ubicación *</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ej: Usaquén, Bogotá"
                                    {...field}
                                    disabled // <-- Esto bloquea el campo para que no se pueda modificar
                                />
                            </FormControl>
                            <FormDescription>
                                Ejemplo: Usaquén, Bogotá
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Campo Contacto */}
                <FormField
                    control={form.control}
                    name="contacto"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contacto de Emergencia *</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ej: +57 300 123 4567"
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
    );
}