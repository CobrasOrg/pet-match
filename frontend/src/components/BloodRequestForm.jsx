import { useForm } from 'react-hook-form';
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

export default function BloodRequestForm({ onSuccess }) {
    const form = useForm();
    const fileInputRef = useRef(null);

    // Observar el valor de la especie seleccionada
    const selectedSpecies = form.watch("species");

    // Función para obtener los tipos de sangre según la especie
    const getBloodTypeOptions = (species) => {
        switch (species) {
            case 'canine':
                return [
                    { value: "DEA 1.1 Positivo", label: "DEA 1.1 Positivo" },
                    { value: "DEA 1.1 Negativo", label: "DEA 1.1 Negativo" },
                    { value: "DEA 1.2 Positivo", label: "DEA 1.2 Positivo" },
                    { value: "DEA 1.2 Negativo", label: "DEA 1.2 Negativo" },
                    { value: "DEA 3 Positivo", label: "DEA 3 Positivo" },
                    { value: "DEA 3 Negativo", label: "DEA 3 Negativo" },
                    { value: "DEA 4 Positivo", label: "DEA 4 Positivo" },
                    { value: "DEA 4 Negativo", label: "DEA 4 Negativo" },
                    { value: "DEA 5 Positivo", label: "DEA 5 Positivo" },
                    { value: "DEA 5 Negativo", label: "DEA 5 Negativo" },
                    { value: "DEA 6 Positivo", label: "DEA 6 Positivo" },
                    { value: "DEA 6 Negativo", label: "DEA 6 Negativo" },
                    { value: "DEA 7 Positivo", label: "DEA 7 Positivo" },
                    { value: "DEA 7 Negativo", label: "DEA 7 Negativo" },
                    { value: "DEA 8 Positivo", label: "DEA 8 Positivo" },
                    { value: "DEA 8 Negativo", label: "DEA 8 Negativo" },
                    { value: "Donante Universal", label: "Donante Universal" }
                ];
            case 'feline':
                return [
                    { value: "Tipo A", label: "Tipo A" },
                    { value: "Tipo B", label: "Tipo B" },
                    { value: "Tipo AB", label: "Tipo AB" }
                ];
            default:
                return [];
        }
    };

    // Función simplificada para manejar el envío del formulario
    const handleSubmit = (data) => {
        try {
            console.log('Datos del formulario (para backend):', data);

            // Simulamos la respuesta exitosa que vendría del backend
            const mockResponse = {
                ...data,
                id: `REQ-${Math.random().toString(36).substr(2, 8)}`,
                status: 'active',
                date: new Date().toISOString(),
                // Agregar campos adicionales para compatibilidad
                petName: `Mascota ${Math.floor(Math.random() * 100)}`,
                clinicName: 'Clínica Demo',
                image: 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Mascota',
                vetContact: data.contact
            };

            form.reset();

            // Llama a la función onSuccess con los datos simulados
            if (onSuccess) {
                onSuccess(mockResponse);
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
                    {/* Campo Especie - Solo Perro y Gato */}
                    <FormField
                        control={form.control}
                        name="species"
                        rules={{ required: "Este campo es obligatorio" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Especie *</FormLabel>
                                <Select onValueChange={handleSpeciesChange} defaultValue={field.value}>
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

                    {/* Campo Tipo de Sangre - DINÁMICO SEGÚN ESPECIE */}
                    <FormField
                        control={form.control}
                        name="bloodType"
                        rules={{
                            required: selectedSpecies ? "Este campo es obligatorio" : false
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de Sangre *</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
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
                                        : "Especificar sistema de grupo sanguíneo"
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
                                        defaultValue={field.value}
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
                        rules={{
                            required: "Este campo es obligatorio",
                            min: { value: 0, message: "El peso debe ser positivo" }
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Peso Mínimo Requerido (kg) *</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Ej: 25"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                    rules={{ required: "Este campo es obligatorio" }}
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
                        rules={{ required: "Este campo es obligatorio" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Localidad de Bogotá *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        rules={{ required: "Este campo es obligatorio" }}
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
                    rules={{ required: "Este campo es obligatorio" }}
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
                    rules={{
                        required: "Este campo es obligatorio",
                        pattern: {
                            value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                            message: "Ingrese un número de teléfono válido"
                        }
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contacto de Emergencia *</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Teléfono con código de área"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Campo Foto (Opcional) - Se mantiene pero no se procesará realmente */}
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
                                        console.log('Imagen seleccionada (en producción se enviaría al backend)');
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
                    className="w-full bg-blue-400 hover:bg-blue-500 py-6 text-lg"
                >
                    Publicar Solicitud de Donación
                </Button>
            </form>
        </Form>
    );
}