import { XIcon, ChevronDownIcon, CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
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
  canine: ['DEA 1.1+', 'DEA 1.1-', 'DEA 4+', 'DEA 4-', 'DEA 7+', 'DEA 7-'],
  feline: ['A', 'B', 'AB']
};

// Solo urgencia alta y media
const URGENCY_LEVELS = [
  { value: 'Alta', label: 'Alta' },
  { value: 'Media', label: 'Media' }
];

export function FiltersPanel({ filters, onFilterChange, onClearFilters }) {
  return (
      <div className="border-t pt-4 mt-2">
        <div className="flex flex-wrap gap-3">
          {/* Dropdown para especie */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span>Especie</span>
                <ChevronDownIcon className="h-4 w-4" />
                {filters.species.length > 0 && (
                    <span className="ml-1 text-xs bg-pink-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                  {filters.species.length}
                </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Selecciona especies</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(SPECIES_LABELS).map(([key, label]) => (
                  <DropdownMenuCheckboxItem
                      key={key}
                      checked={filters.species.includes(key)}
                      onCheckedChange={() => onFilterChange('species', key)}
                  >
                    {label}
                  </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dropdown para tipo de sangre */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span>Tipo de sangre</span>
                <ChevronDownIcon className="h-4 w-4" />
                {filters.bloodType.length > 0 && (
                    <span className="ml-1 text-xs bg-pink-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                  {filters.bloodType.length}
                </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
              <DropdownMenuLabel>Selecciona tipos</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(BLOOD_TYPES).flatMap(([species, types]) => (
                  filters.species.includes(species) || filters.species.length === 0 ? (
                      types.map(type => (
                          <DropdownMenuCheckboxItem
                              key={type}
                              checked={filters.bloodType.includes(type)}
                              onCheckedChange={() => onFilterChange('bloodType', type)}
                          >
                            {type}
                          </DropdownMenuCheckboxItem>
                      ))
                  ) : null
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dropdown para urgencia */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span>Urgencia</span>
                <ChevronDownIcon className="h-4 w-4" />
                {filters.urgency.length > 0 && (
                    <span className="ml-1 text-xs bg-pink-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                  {filters.urgency.length}
                </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Nivel de urgencia</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {URGENCY_LEVELS.map(({value, label}) => (
                  <DropdownMenuCheckboxItem
                      key={value}
                      checked={filters.urgency.includes(value)}
                      onCheckedChange={() => onFilterChange('urgency', value)}
                  >
                    {label}
                  </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dropdown para localidad */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span>Localidad</span>
                <ChevronDownIcon className="h-4 w-4" />
                {(filters.locality && filters.locality.length > 0) && (
                    <span className="ml-1 text-xs bg-pink-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                      {filters.locality.length}
                    </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
              <DropdownMenuLabel>Localidades de Bogotá</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {BOGOTA_LOCALITIES.map((locality) => (
                  <DropdownMenuCheckboxItem
                      key={locality.value}
                      checked={filters.locality?.includes(locality.value) || false}
                      onCheckedChange={() => onFilterChange('locality', locality.value)}
                  >
                    {locality.label}
                  </DropdownMenuCheckboxItem>
              ))}
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

  return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Filtros aplicados:</span>

          {filters.species.map(species => (
              <FilterBadge
                  key={species}
                  label={speciesLabels[species] || SPECIES_LABELS[species]}
                  onRemove={() => onFilterChange('species', species)}
              />
          ))}

          {filters.bloodType.map(type => (
              <FilterBadge
                  key={type}
                  label={`Tipo: ${type}`}
                  onRemove={() => onFilterChange('bloodType', type)}
              />
          ))}

          {filters.urgency.map(urgency => (
              <FilterBadge
                  key={urgency}
                  label={urgencyLevels?.find(u => u.value === urgency)?.label || URGENCY_LEVELS.find(u => u.value === urgency)?.label || urgency}
                  onRemove={() => onFilterChange('urgency', urgency)}
              />
          ))}

          {/* Filtros de localidad */}
          {filters.locality && filters.locality.map(locality => (
              <FilterBadge
                  key={locality}
                  label={getLocalityLabel(locality)}
                  onRemove={() => onFilterChange('locality', locality)}
              />
          ))}

          <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="ml-auto text-pink-600 hover:text-pink-700"
          >
            Limpiar todos
            <XIcon className="ml-1 h-4 w-4" />
          </Button>
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