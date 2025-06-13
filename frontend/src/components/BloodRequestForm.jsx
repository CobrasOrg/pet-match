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

// Esquema de validación con Zod
const formSchema = z.object({
    species: z.string().min(1, "Selecciona una especie"),
    bloodType: z.string().min(1, "Selecciona un tipo de sangre"),
    urgency: z.string().min(1, "Selecciona un nivel de urgencia"),
    minWeight: z.number().min(0.1, "El peso debe ser mayor a 0"),
    description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
    locality: z.string().min(1, "Selecciona una localidad"),
    clinicName: z.string().min(1, "Ingresa el nombre de la clínica"),
    location: z.string().min(1, "Ingresa la dirección completa"),
    contact: z.string().regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, "Ingrese un número de teléfono válido"),
    photo: z.any().optional()
});

export default function BloodRequestForm({ onRequestCreated }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            species: "",
            bloodType: "",
            urgency: "",
            minWeight: 0,
            description: "",
            locality: "",
            clinicName: "",
            location: "",
            contact: "",
            photo: null
        }
    });

    const fileInputRef = useRef(null);

    // Observar el valor de la especie seleccionada
    const selectedSpecies = form.watch("species");

    // Función para obtener los tipos de sangre según la especie
    const getBloodTypeOptions = (species) => {
        switch (species) {
            case 'canine':
                return [
                    { value: "DEA 1.1", label: "DEA 1.1" },
                    { value: "DEA 1.2", label: "DEA 1.2" },
                    { value: "DEA 3", label: "DEA 3" },
                    { value: "DEA 4", label: "DEA 4" },
                    { value: "DEA 5", label: "DEA 5" },
                    { value: "DEA 7", label: "DEA 7" },
                    { value: "DEA 8", label: "DEA 8" }
                ];
            case 'feline':
                return [
                    { value: "A", label: "Tipo A" },
                    { value: "B", label: "Tipo B" },
                    { value: "AB", label: "Tipo AB" }
                ];
            default:
                return [];
        }
    };

    // Función para manejar el envío del formulario
    const handleSubmit = (data) => {
        try {
            console.log('Datos del formulario:', data);

            // Simulamos la respuesta exitosa
            const mockResponse = {
                ...data,
                id: `REQ-${Math.random().toString(36).substr(2, 8)}`,
                status: 'active',
                date: new Date().toISOString(),
                petName: `Mascota ${Math.floor(Math.random() * 100)}`,
                image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&auto=format',
                vetContact: data.contact
            };

            form.reset();
            toast.success('Solicitud creada exitosamente');

            // Llama a la función callback
            if (onRequestCreated) {
                onRequestCreated(mockResponse);
            }

        } catch (error) {
            console.error('Error en el formulario:', error);
            toast.error('Error al procesar el formulario');
        }
    };

    // Función para manejar el cambio de especie
    const handleSpeciesChange = (value) => {
        form.setValue("species", value);
        // Limpiar el tipo de sangre cuando cambie la especie
        form.setValue("bloodType", "");
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campo Especie */}
                    <FormField
                        control={form.control}
                        name="species"
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
                                        <SelectItem value="canine">🐶 Perro</SelectItem>
                                        <SelectItem value="feline">🐱 Gato</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Campo Tipo de Sangre */}
                    <FormField
                        control={form.control}
                        name="bloodType"
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
                                                        : `Seleccionar tipo de sangre para ${selectedSpecies === 'canine' ? 'perros' : 'gatos'}`
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
                        name="urgency"
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
                                                <RadioGroupItem value="high" />
                                            </FormControl>
                                            <FormLabel className="font-normal text-red-600">
                                                Urgencia Alta (necesidad inmediata)
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="medium" />
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
                        name="minWeight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Peso Mínimo Requerido (kg) *</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Ej: 25"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                    name="description"
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

                {/* Sección de Ubicación */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campo Localidad */}
                    <FormField
                        control={form.control}
                        name="locality"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Localidad de Bogotá *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar localidad" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {BOGOTA_LOCALITIES.map((locality) => (
                                            <SelectItem key={locality.value} value={locality.value}>
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
                        name="clinicName"
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

                {/* Campo Ubicación */}
                <FormField
                    control={form.control}
                    name="location"
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

                {/* Campo Contacto */}
                <FormField
                    control={form.control}
                    name="contact"
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
                    name="photo"
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
                                        console.log('Imagen seleccionada');
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