import { XIcon, ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { BOGOTA_LOCALITIES } from '@/constants/locations';

// Solo especies disponibles: perros y gatos
const SPECIES_LABELS = {
  Perro: 'Perro',
  Gato: 'Gato'
};

// Tipos de sangre más comunes y relevantes
const BLOOD_TYPES = {
  Perro: ['DEA 1.1+', 'DEA 1.1-'],
  Gato: ['A', 'B', 'AB']
};

// Solo urgencia alta y media
const URGENCY_LEVELS = [
  { value: 'Alta', label: 'Alta' },
  { value: 'Media', label: 'Media' }
];

export function FiltersPanel({ filters, onFilterChange, onClearFilters }) {
  // Obtener tipos de sangre según especie seleccionada
  const selectedSpecies = filters.species?.[0];
  const bloodTypesToShow = selectedSpecies
    ? (selectedSpecies === 'Perro' ? ['DEA 1.1+', 'DEA 1.1-'] : ['A', 'B', 'AB'])
    : ['DEA 1.1+', 'DEA 1.1-', 'A', 'B', 'AB'];

  return (
    <div className="border-t pt-4 mt-2">
      <div className="flex flex-wrap gap-3">
        {/* Dropdown para especie */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <span>Especie</span>
              <ChevronDownIcon className="h-4 w-4" />
              {filters.species?.[0] && (
                <span className="ml-1 text-xs bg-pink-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                  1
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Selecciona especie</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={filters.species?.[0] || ''}
              onValueChange={val => onFilterChange('species', val)}
            >
              <DropdownMenuRadioItem value="">
                Todos
              </DropdownMenuRadioItem>
              {Object.entries(SPECIES_LABELS).map(([key, label]) => (
                <DropdownMenuRadioItem key={key} value={key}>
                  {label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dropdown para tipo de sangre */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <span>Tipo de sangre</span>
              <ChevronDownIcon className="h-4 w-4" />
              {filters.bloodType?.[0] && (
                <span className="ml-1 text-xs bg-pink-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                  1
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
            <DropdownMenuLabel>Selecciona tipo</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={filters.bloodType?.[0] || ''}
              onValueChange={val => onFilterChange('bloodType', val)}
            >
              <DropdownMenuRadioItem value="">
                Todos
              </DropdownMenuRadioItem>
              {bloodTypesToShow.map(type => (
                <DropdownMenuRadioItem key={type} value={type}>
                  {type}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dropdown para urgencia */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <span>Urgencia</span>
              <ChevronDownIcon className="h-4 w-4" />
              {filters.urgency?.[0] && (
                <span className="ml-1 text-xs bg-pink-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                  1
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Nivel de urgencia</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={filters.urgency?.[0] || ''}
              onValueChange={val => onFilterChange('urgency', val)}
            >
              <DropdownMenuRadioItem value="">
                Todos
              </DropdownMenuRadioItem>
              {URGENCY_LEVELS.map(({ value, label }) => (
                <DropdownMenuRadioItem key={value} value={value}>
                  {label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dropdown para localidad */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <span>Localidad</span>
              <ChevronDownIcon className="h-4 w-4" />
              {filters.locality?.[0] && (
                <span className="ml-1 text-xs bg-pink-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                  1
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
            <DropdownMenuLabel>Localidades de Bogotá</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={filters.locality?.[0] || ''}
              onValueChange={val => onFilterChange('locality', val)}
            >
              <DropdownMenuRadioItem value="">
                Todas
              </DropdownMenuRadioItem>
              {BOGOTA_LOCALITIES.map((locality) => (
                <DropdownMenuRadioItem key={locality.value} value={locality.value}>
                  {locality.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Botón para limpiar filtros */}
        <Button
          variant="ghost"
          onClick={onClearFilters}
          className="text-pink-600 hover:text-pink-700"
        >
          Limpiar todos
          <XIcon className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Componente para mostrar los filtros activos
export function ActiveFilters({ speciesLabels, urgencyLevels, filters, onFilterChange, onClearFilters }) {
  const hasActiveFilters =
      filters.species.length > 0 ||
      filters.bloodType.length > 0 ||
      filters.urgency.length > 0 ||
      (filters.locality && filters.locality.length > 0);

  if (!hasActiveFilters) return null;

  // Función helper para obtener el label de una localidad
  const getLocalityLabel = (localityValue) => {
    const locality = BOGOTA_LOCALITIES.find(loc => loc.value === localityValue);
    return locality ? locality.label : localityValue;
  };

  // Nueva función para limpiar un filtro individual (deja el filtro vacío)
  const handleRemove = (filterType) => {
    onFilterChange(filterType, '');
  };

  return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Filtros aplicados:</span>

          {filters.species.map(species => (
              <FilterBadge
                  key={species}
                  label={speciesLabels[species] || SPECIES_LABELS[species]}
                  onRemove={() => handleRemove('species')}
              />
          ))}

          {filters.bloodType.map(type => (
              <FilterBadge
                  key={type}
                  label={`Tipo: ${type}`}
                  onRemove={() => handleRemove('bloodType')}
              />
          ))}

          {filters.urgency.map(urgency => (
              <FilterBadge
                  key={urgency}
                  label={urgencyLevels?.find(u => u.value === urgency)?.label || URGENCY_LEVELS.find(u => u.value === urgency)?.label || urgency}
                  onRemove={() => handleRemove('urgency')}
              />
          ))}

          {/* Filtros de localidad */}
          {filters.locality && filters.locality.map(locality => (
              <FilterBadge
                  key={locality}
                  label={getLocalityLabel(locality)}
                  onRemove={() => handleRemove('locality')}
              />
          ))}
        </div>
      </div>
  );
}

// Componente para los badges de filtros
function FilterBadge({ label, onRemove }) {
  return (
      <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
      {label}
        <button
            type="button"
            onClick={onRemove}
            className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
        >
        <XIcon className="h-3 w-3" />
      </button>
    </span>
  );
}
