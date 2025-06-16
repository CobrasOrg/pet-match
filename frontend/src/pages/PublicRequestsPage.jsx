import { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from '@/components/ui/card';
import {
  SearchIcon,
  FilterIcon,
  AlertCircleIcon,
  HeartIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  AlertTriangleIcon,
  ClockIcon,
  CalendarIcon,
  Building2Icon,
  WeightIcon,
  DropletIcon,
  MapPinIcon,
  LoaderIcon
} from 'lucide-react';
import { FiltersPanel, ActiveFilters } from '@/components/FiltersPanel';
import { PhoneIcon } from '@heroicons/react/24/outline';
import { BOGOTA_LOCALITIES, getLocalityLabel } from '@/constants/locations';

// Constantes para mapeo de especie y urgencia
const SPECIES_LABELS = {
  Perro: 'Perro',
  Gato: 'Gato'
};

const SPECIES_EMOJIS = {
  Perro: '🐶',
  Gato: '🐱'
};

const URGENCY_LEVELS = [
  { value: 'Alta', label: 'Alta urgencia' },
  { value: 'Media', label: 'Urgencia media' }
];

const URGENCY_BADGES = {
  Alta: {
    label: 'URGENCIA ALTA',
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    icon: AlertTriangleIcon
  },
  Media: {
    label: 'URGENCIA MEDIA',
    bgColor: 'bg-orange-500',
    textColor: 'text-white',
    icon: ClockIcon
  }
};

// Formatea la fecha en formato relativo
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  if (diffTime < 0) return 'Fecha futura';
  if (diffMinutes < 60) return diffMinutes < 1 ? 'Hace unos segundos' : `Hace ${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''}`;
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Hace 1 día';
  if (diffDays < 30) return `Hace ${diffDays} días`;
  if (diffDays < 365) {
    const diffMonths = Math.floor(diffDays / 30);
    return `Hace ${diffMonths} mes${diffMonths !== 1 ? 'es' : ''}`;
  }
  const diffYears = Math.floor(diffDays / 365);
  return `Hace ${diffYears} año${diffYears !== 1 ? 's' : ''}`;
};

// Hook de debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef();

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setDebouncedValue(value), delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Tarjeta de solicitud
const RequestCard = memo(({ request }) => {
  const urgencyBadge = URGENCY_BADGES[request.urgencia] || URGENCY_BADGES['Media'];
  const UrgencyIcon = urgencyBadge.icon;
  const speciesEmoji = SPECIES_EMOJIS[request.especie] || '';
  const formattedDate = formatDate(request.fecha_creacion);
  // Muestra la localidad tal cual viene de la API
  const localityLabel = request.localidad || '';

  return (
    <article
      className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
      role="article"
      aria-labelledby={`pet-name-${request.id}`}
    >
      <div className="p-4 sm:p-5 lg:p-6">
        {/* Badge de veterinaria */}
        <div className="absolute top-0 left-0 z-10">
          <div className="bg-blue-500 text-white px-3 py-1.5 rounded-br-lg rounded-tl-lg flex items-center gap-1.5 text-xs font-medium">
            <Building2Icon className="h-3 w-3" aria-hidden="true" />
            <span>{request.nombre_veterinaria}</span>
          </div>
        </div>

        {/* Badge de urgencia */}
        <div className="absolute top-0 right-0 z-10">
          <div
            className={`${urgencyBadge.bgColor} ${urgencyBadge.textColor} px-3 py-1.5 rounded-bl-lg rounded-tr-lg flex items-center gap-1.5 text-xs font-medium`}
            role="status"
            aria-label={`Nivel de urgencia: ${urgencyBadge.label}`}
          >
            <UrgencyIcon className="h-3 w-3" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">{urgencyBadge.label}</span>
          </div>
        </div>

        {/* Botón de acción */}
        <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 z-10">
          <Button
            asChild
            className="bg-pink-600 hover:bg-pink-700 shadow-lg text-sm"
            size="sm"
            aria-label={`Ayudar a ${request.nombre_mascota} con donación de sangre`}
          >
            <Link to={`/apply/${request.id}`}>
              <HeartIcon className="mr-1.5 h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Ayudar a {request.nombre_mascota}</span>
              <span className="sm:hidden">Ayudar</span>
            </Link>
          </Button>
        </div>

        {/* Contenido principal */}
        <div className="space-y-4 pt-8">
          {/* Header con emoji más grande y prominente */}
          <header className="flex items-center gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center border-2 border-pink-300 overflow-hidden">
              {request.foto_mascota ? (
                <img
                  src={request.foto_mascota}
                  alt={`Foto de ${request.nombre_mascota}`}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span
                  className="text-3xl"
                  role="img"
                  aria-label={request.especie}
                >
                  {speciesEmoji}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2
                id={`pet-name-${request.id}`}
                className="font-bold text-xl text-pink-600 truncate"
              >
                {request.nombre_mascota}
              </h2>
              <p className="text-sm text-gray-600 truncate">
                {SPECIES_LABELS[request.especie] || request.especie} • {localityLabel}
              </p>
            </div>
          </header>

          {/* Descripción */}
          <div className="space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
              {request.descripcion_solicitud}
            </p>

            {/* Información de contacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                <MapPinIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">Ubicación</p>
                  <p className="text-sm text-gray-700 font-medium">{request.direccion}</p>
                  <p className="text-xs text-blue-600 font-medium mt-1">{localityLabel}, Bogotá</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                <PhoneIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-green-600 font-medium uppercase tracking-wide mb-1">Contacto</p>
                  <p className="text-sm text-gray-700 font-medium">
                    <a
                      href={`tel:${request.contacto}`}
                      className="hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 rounded"
                      aria-label={`Llamar a ${request.contacto}`}
                    >
                      {request.contacto}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Requisitos del donante */}
            <section
              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              aria-labelledby={`requirements-${request.id}`}
            >
              <h3
                id={`requirements-${request.id}`}
                className="text-sm font-medium mb-3 text-gray-700 flex items-center gap-2"
              >
                <DropletIcon className="h-4 w-4 text-red-500" aria-hidden="true" />
                Requisitos del donante:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 bg-white p-3 rounded-md border border-gray-200">
                  <WeightIcon className="h-4 w-4 text-blue-500" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Peso mínimo</p>
                    <p className="text-sm font-semibold text-gray-700">{request.peso_minimo} kg</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-3 rounded-md border border-gray-200">
                  <DropletIcon className="h-4 w-4 text-red-500" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Tipo de sangre</p>
                    <p className="text-sm font-semibold text-gray-700">{request.tipo_sangre}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Fecha */}
            <footer className="flex justify-start">
              <time
                className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-md"
                dateTime={request.fecha_creacion}
                aria-label={`Publicado ${formattedDate}`}
              >
                <CalendarIcon className="h-4 w-4" aria-hidden="true" />
                <span>{formattedDate}</span>
              </time>
            </footer>
          </div>
        </div>
      </div>
    </article>
  );
});

RequestCard.displayName = 'RequestCard';

// Función para parsear filtros desde URL
const parseFiltersFromURL = (searchParams) => ({
  species: searchParams.getAll('especie').filter(Boolean).slice(0, 1) || [],
  bloodType: searchParams.getAll('tipo_sangre').filter(Boolean).slice(0, 1) || [],
  urgency: searchParams.getAll('urgencia').filter(Boolean).slice(0, 1) || [],
  locality: searchParams.getAll('localidad').filter(Boolean).slice(0, 1) || [],
  location: searchParams.get('ubicacion') || ''
});

// Componente principal
export default function PublicRequestsFeed() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);

  // Estado de filtros
  const [searchTerm, setSearchTerm] = useState(searchParams.get('busqueda') || '');
  const [filters, setFilters] = useState(() => {
    const parsed = parseFiltersFromURL(searchParams);
    return {
      species: parsed.species || [],
      bloodType: parsed.bloodType || [],
      urgency: parsed.urgencia || [],
      locality: parsed.localidad || [],
      location: parsed.location || ''
    };
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Cargar datos desde la API
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Construir query params según los filtros
    const params = new URLSearchParams();
    (filters.species || []).forEach(species => params.append('especie', species));
    (filters.bloodType || []).forEach(bloodType => params.append('tipo_sangre', bloodType));
    (filters.urgency || []).forEach(urgency => params.append('urgencia', urgency));
    (filters.locality || []).forEach(locality => params.append('localidad', locality));

    const url = `http://localhost:8000/api/v1/user/solicitudes/activas/filtrar?${params.toString()}`;

    fetch(url)
      .then(async (res) => {
        if (!res.ok) throw new Error('Error al obtener las solicitudes');
        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Error al cargar las solicitudes');
        setIsLoading(false);
      });
  }, [filters]);

  // Actualizar URL con filtros
  const updateURLWithFilters = useCallback((filters, searchTerm) => {
    const newParams = new URLSearchParams();

    if (searchTerm.trim()) {
      newParams.set('busqueda', searchTerm.trim());
    }

    (filters.species || []).forEach(species => newParams.append('especie', species));
    (filters.bloodType || []).forEach(bloodType => newParams.append('tipo_sangre', bloodType));
    (filters.urgency || []).forEach(urgency => newParams.append('urgencia', urgency));
    (filters.locality || []).forEach(locality => newParams.append('localidad', locality));

    if (filters.location.trim()) {
      newParams.set('ubicacion', filters.location.trim());
    }

    setSearchParams(newParams, { replace: true });
  }, [setSearchParams]);

  useEffect(() => {
    updateURLWithFilters(filters, debouncedSearchTerm);
  }, [filters, debouncedSearchTerm, updateURLWithFilters]);

  // Manejar cambios en filtros
  const handleFilterChange = useCallback((filterType, value) => {
    setFilters(prev => {
      if (['species', 'bloodType', 'urgency', 'locality'].includes(filterType)) {
        // Si value es vacío, limpiar filtro
        return {
          ...prev,
          [filterType]: value ? [value] : []
        };
      }
      if (filterType === 'location') {
        return { ...prev, location: value };
      }
      return prev;
    });
  }, []);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    const newFilters = {
      species: [],
      bloodType: [],
      urgency: [],
      locality: [],
      location: ''
    };
    setFilters(newFilters);
    setSearchTerm('');
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

 // Solo búsqueda por texto en frontend
  const filteredRequests = useMemo(() => {
    if (!debouncedSearchTerm) return requests;
    return requests.filter(req => {
      const localidad = req.localidad?.toLowerCase?.() || '';
      return [
        req.especie,
        req.tipo_sangre,
        req.direccion,
        req.nombre_veterinaria,
        getLocalityLabel(localidad),
        req.nombre_mascota
      ].some(field =>
        field?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    });
  }, [requests, debouncedSearchTerm]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 sm:p-6" role="status" aria-live="polite">
        <div className="bg-green-50 rounded-lg shadow-md max-w-7xl mx-auto p-6">
          <div className="text-center">
            <LoaderIcon className="animate-spin h-8 w-8 mx-auto mb-4 text-pink-600" />
            <p className="text-gray-600">Cargando solicitudes de donación...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-6 text-center" role="alert">
        <AlertCircleIcon className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Intentar de nuevo
        </Button>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-3 sm:p-4 lg:p-6 bg-green-50 rounded-lg shadow-md max-w-7xl">
      {/* Encabezado semántico */}
      <header className="mb-6 sm:mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mt-5">
          🩸 ¡Ayuda a salvar vidas peludas!
        </h1>
        <p className="mt-2 text-lg text-gray-700">
          Encuentra perros y gatos que necesitan tu ayuda en Bogotá.
          Tu mascota puede ser un héroe hoy.
        </p>
        <p className="text-xs sm:text-sm text-gray-500" aria-live="polite">
          {filteredRequests.length} solicitud{filteredRequests.length !== 1 ? 'es' : ''} activa{filteredRequests.length !== 1 ? 's' : ''}
        </p>
      </header>

      {/* Sección de filtros */}
      <section aria-label="Filtros de búsqueda">
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <label htmlFor="search-input" className="sr-only">
                    Buscar solicitudes por nombre, especie, tipo de sangre, localidad o clínica
                  </label>
                  <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" aria-hidden="true" />
                  <Input
                    id="search-input"
                    placeholder="Buscar por nombre, especie, tipo de sangre, localidad o clínica..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-describedby="search-help"
                  />
                  <div id="search-help" className="sr-only">
                    Utiliza este campo para buscar solicitudes por cualquier criterio relevante
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 w-full md:w-auto"
                  aria-expanded={showFilters}
                  aria-controls="filters-panel"
                >
                  <FilterIcon className="h-4 w-4" aria-hidden="true" />
                  {showFilters ? (
                    <>
                      <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
                      <span className="hidden sm:inline">Ocultar filtros</span>
                      <span className="sm:hidden">Ocultar</span>
                    </>
                  ) : (
                    <>
                      <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                      <span className="hidden sm:inline">Mostrar filtros</span>
                      <span className="sm:hidden">Filtros</span>
                    </>
                  )}
                </Button>
              </div>

              {showFilters && (
                <div id="filters-panel" role="region" aria-label="Panel de filtros avanzados">
                  <FiltersPanel
                    speciesLabels={SPECIES_LABELS}
                    localityOptions={BOGOTA_LOCALITIES}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={clearFilters}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <ActiveFilters
          speciesLabels={SPECIES_LABELS}
          urgencyLevels={URGENCY_LEVELS}
          localityOptions={BOGOTA_LOCALITIES}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />
      </section>

      {/* Sección de resultados */}
      <section aria-label="Solicitudes de donación" aria-live="polite">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" aria-hidden="true" />
              <p className="text-gray-500 mb-4">
                {Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== '') || debouncedSearchTerm.trim()
                  ? "No hay solicitudes que coincidan con tus filtros. Prueba ajustando los criterios."
                  : "No hay solicitudes activas en este momento."}
              </p>
              {(Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== '') || debouncedSearchTerm.trim()) && (
                <Button variant="outline" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:gap-6">
            {filteredRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}