import { Button } from '@/components/ui/button';
import {
  FilterIcon,
  XIcon,
  MapPinIcon,
  DropletIcon,
  DogIcon,
  CatIcon,
  AlertTriangleIcon
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

// Solo especies disponibles: perros y gatos
const SPECIES_OPTIONS = [
  { value: 'canine', label: 'Perro', icon: <DogIcon className="h-4 w-4 mr-2" /> },
  { value: 'feline', label: 'Gato', icon: <CatIcon className="h-4 w-4 mr-2" /> }
];

// Solo urgencia alta y media
const URGENCY_OPTIONS = [
  { value: 'high', label: 'Alta urgencia' },
  { value: 'medium', label: 'Urgencia media' }
];

// Tipos de sangre más comunes
const BLOOD_TYPE_OPTIONS = [
  // Perros
  { value: 'DEA 1.1+', label: 'DEA 1.1+', species: 'canine' },
  { value: 'DEA 1.1-', label: 'DEA 1.1-', species: 'canine' },
  { value: 'DEA 4+', label: 'DEA 4+', species: 'canine' },
  { value: 'DEA 4-', label: 'DEA 4-', species: 'canine' },
  { value: 'DEA 7+', label: 'DEA 7+', species: 'canine' },
  { value: 'DEA 7-', label: 'DEA 7-', species: 'canine' },
  // Gatos
  { value: 'A', label: 'A', species: 'feline' },
  { value: 'B', label: 'B', species: 'feline' },
  { value: 'AB', label: 'AB', species: 'feline' }
];

export default function AdvancedFilters({ filters, setFilters }) {
  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      species: [],
      bloodType: [],
      location: '',
      urgency: []
    });
  };

  // Manejar cambio de especie
  const handleSpeciesChange = (value) => {
    const newSpecies = value === '' ? [] : [value];
    setFilters({
      ...filters,
      species: newSpecies,
      // Limpiar tipo de sangre si cambia la especie
      bloodType: []
    });
  };

  // Manejar cambio de tipo de sangre
  const handleBloodTypeChange = (value) => {
    const newBloodType = value === '' ? [] : [value];
    setFilters({...filters, bloodType: newBloodType});
  };

  // Manejar cambio de urgencia
  const handleUrgencyChange = (value) => {
    const newUrgency = value === '' ? [] : [value];
    setFilters({...filters, urgency: newUrgency});
  };

  // Filtrar tipos de sangre según la especie seleccionada
  const getAvailableBloodTypes = () => {
    if (filters.species.length === 0) {
      return BLOOD_TYPE_OPTIONS;
    }
    return BLOOD_TYPE_OPTIONS.filter(bt => filters.species.includes(bt.species));
  };

  return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FilterIcon className="h-4 w-4" />
            Filtros avanzados
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center">
                <FilterIcon className="h-4 w-4 mr-2" />
                Filtros
              </h4>
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
              >
                <XIcon className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            </div>

            <Separator />

            {/* Filtro por especie */}
            <div>
              <Label className="flex items-center mb-2">
                <DogIcon className="h-4 w-4 mr-2" />
                Especie
              </Label>
              <Select
                  value={filters.species.length > 0 ? filters.species[0] : ''}
                  onValueChange={handleSpeciesChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las especies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  {SPECIES_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          {option.icon}
                          {option.label}
                        </div>
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Filtro por tipo de sangre */}
            <div>
              <Label className="flex items-center mb-2">
                <DropletIcon className="h-4 w-4 mr-2" />
                Tipo de sangre
              </Label>
              <Select
                  value={filters.bloodType.length > 0 ? filters.bloodType[0] : ''}
                  onValueChange={handleBloodTypeChange}
                  disabled={filters.species.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    filters.species.length === 0
                        ? "Selecciona una especie primero"
                        : "Todos los tipos"
                  } />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {getAvailableBloodTypes().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Filtro por localidad */}
            <div>
              <Label className="flex items-center mb-2">
                <MapPinIcon className="h-4 w-4 mr-2" />
                Localidad
              </Label>
              <Input
                  placeholder="Ciudad o dirección"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
              />
            </div>

            <Separator />

            {/* Filtro por urgencia */}
            <div>
              <Label className="flex items-center mb-2">
                <AlertTriangleIcon className="h-4 w-4 mr-2" />
                Nivel de urgencia
              </Label>
              <Select
                  value={filters.urgency.length > 0 ? filters.urgency[0] : ''}
                  onValueChange={handleUrgencyChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los niveles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {URGENCY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
  );
}