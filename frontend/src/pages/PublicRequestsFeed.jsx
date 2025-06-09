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
import {
  BOGOTA_LOCALITIES,
  getLocalityLabel,
  SPECIES,
  URGENCY_LEVELS,
  generateMockRequests,
  formatDate
} from '../constants';

// Placeholder optimizado para mejorar LCP
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhcmdhbmRvLi4uPC90ZXh0Pjwvc3ZnPg==';

// Hook de debounce optimizado
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
};

// Componente de imagen optimizada
const OptimizedImage = memo(({ src, alt, petName, className }) => {
  const [imageSrc, setImageSrc] = useState(PLACEHOLDER_IMAGE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      setHasError(false);
    };

    img.onerror = () => {
      setImageSrc(`https://via.placeholder.com/400x300/e5e7eb/6b7280?text=${encodeURIComponent(petName)}`);
      setIsLoaded(true);
      setHasError(true);
    };

    requestAnimationFrame(() => {
      img.src = src;
    });
  }, [src, petName]);

  return (
      <img
          src={imageSrc}
          alt={alt}
          className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-70'}`}
          width="400"
          height="300"
          loading={imageSrc === PLACEHOLDER_IMAGE ? "eager" : "lazy"}
          decoding="async"
          onError={(e) => {
            if (!hasError) {
              e.target.src = `https://via.placeholder.com/400x300/e5e7eb/6b7280?text=${encodeURIComponent(petName)}`;
              setHasError(true);
            }
          }}
      />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Componente de tarjeta memoizado
const RequestCard = memo(({ request }) => {
  const urgencyInfo = useMemo(() => URGENCY_LEVELS[request.urgency], [request.urgency]);
  const UrgencyIcon = request.urgency === 'high' ? AlertTriangleIcon : ClockIcon;
  const speciesInfo = useMemo(() => SPECIES[request.species], [request.species]);
  const formattedDate = useMemo(() => formatDate(request.date), [request.date]);
  const localityLabel = useMemo(() => getLocalityLabel(request.locality), [request.locality]);

  return (
      <article
          className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
          role="article"
          aria-labelledby={`pet-name-${request.id}`}
      >
        <div className="p-3 sm:p-4 lg:p-5">
          {/* Badge de veterinaria */}
          <div className="absolute top-0 left-0 z-10">
            <div className="bg-blue-500 text-white px-2 py-1 rounded-br-lg rounded-tl-lg flex items-center gap-1 text-xs font-medium">
              <Building2Icon className="h-3 w-3" aria-hidden="true" />
              <span>{request.clinicName}</span>
            </div>
          </div>

          {/* Badge de urgencia */}
          <div className="absolute top-0 right-0 z-10">
            <div
                className={`${urgencyInfo.color} ${urgencyInfo.textColor} px-2 py-1 rounded-bl-lg rounded-tr-lg flex items-center gap-1 text-xs font-medium`}
                role="status"
                aria-label={`Nivel de urgencia: ${urgencyInfo.label}`}
            >
              <UrgencyIcon className="h-3 w-3" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">{urgencyInfo.label}</span>
            </div>
          </div>

          {/* Botón de acción */}
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10">
            <Button
                asChild
                className="bg-pink-600 hover:bg-pink-700 shadow-lg text-xs sm:text-sm"
                size="sm"
                aria-label={`Ayudar a ${request.petName} con donación de sangre`}
            >
              <Link to={`/apply/${request.id}`}>
                <HeartIcon className="mr-1 h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Ayudar a {request.petName}</span>
                <span className="sm:hidden">Ayudar</span>
              </Link>
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:items-stretch">
            {/* Contenido principal */}
            <div className="lg:w-2/3 flex flex-col space-y-2 sm:space-y-3 order-2 lg:order-1">
              {/* Header */}
              <header className="flex items-center gap-2 sm:gap-3 pt-5 sm:pt-6 lg:pt-0">
              <span
                  className="text-xl sm:text-2xl"
                  role="img"
                  aria-label={`${speciesInfo.label}`}
              >
                {speciesInfo.emoji}
              </span>
                <div className="min-w-0 flex-1">
                  <h2
                      id={`pet-name-${request.id}`}
                      className="font-bold text-base sm:text-lg text-pink-600 truncate"
                  >
                    {request.petName}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    {speciesInfo.label} • {localityLabel}
                  </p>
                </div>
              </header>

              {/* Descripción */}
              <div className="space-y-2 sm:space-y-3">
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {request.description}
                </p>

                {/* Información de contacto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                  <div className="flex items-start gap-2 bg-blue-50 p-2 sm:p-3 rounded-lg border-l-4 border-blue-400">
                    <MapPinIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">Ubicación</p>
                      <p className="text-xs sm:text-sm text-gray-700 font-medium truncate">{request.location}</p>
                      <p className="text-xs text-blue-600 font-medium mt-1">{localityLabel}, Bogotá</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-green-50 p-2 sm:p-3 rounded-lg border-l-4 border-green-400">
                    <PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-green-600 font-medium uppercase tracking-wide mb-1">Contacto</p>
                      <p className="text-xs sm:text-sm text-gray-700 font-medium truncate">
                        <a
                            href={`tel:${request.vetContact}`}
                            className="hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 rounded"
                            aria-label={`Llamar a ${request.vetContact}`}
                        >
                          {request.vetContact}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requisitos del donante */}
              <section
                  className="bg-gray-50 p-2 sm:p-3 rounded-lg"
                  aria-labelledby={`requirements-${request.id}`}
              >
                <h3
                    id={`requirements-${request.id}`}
                    className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 text-gray-700"
                >
                  Requisitos del donante:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-200">
                    <WeightIcon className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" aria-hidden="true" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Peso mínimo</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-700">{request.minWeight} kg</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-200">
                    <DropletIcon className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" aria-hidden="true" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Tipo de sangre</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-700">{request.bloodType}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Fecha */}
              <footer className="flex justify-start">
                <time
                    className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md"
                    dateTime={request.date}
                    aria-label={`Publicado ${formattedDate}`}
                >
                  <CalendarIcon className="h-3 w-3" aria-hidden="true" />
                  <span>{formattedDate}</span>
                </time>
              </footer>
            </div>

            {/* Imagen */}
            <aside className="lg:w-1/3 order-1 lg:order-2 flex items-center justify-center min-h-full">
              <div className="relative overflow-hidden rounded-lg w-full">
                <OptimizedImage
                    src={request.image}
                    alt={`Fotografía de ${request.petName}, ${speciesInfo.label} que necesita donación de sangre`}
                    petName={request.petName}
                    className="w-full h-40 sm:h-48 lg:h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent lg:hidden"></div>
              </div>
            </aside>
          </div>
        </div>
      </article>
  );
});

RequestCard.displayName = 'RequestCard';

// Función para parsear filtros desde URL
const parseFiltersFromURL = (searchParams) => ({
  species: searchParams.getAll('especie'),
  bloodType: searchParams.getAll('tipo_sangre'),
  urgency: searchParams.getAll('urgencia'),
  locality: searchParams.getAll('localidad'),
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
  const [filters, setFilters] = useState(() => parseFiltersFromURL(searchParams));

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Cargar datos una sola vez
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simular tiempo de carga realista
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockData = generateMockRequests();
        setRequests(mockData);
      } catch (err) {
        setError('Error al cargar las solicitudes');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Actualizar URL con filtros
  const updateURLWithFilters = useCallback((filters, searchTerm) => {
    const newParams = new URLSearchParams();

    if (searchTerm.trim()) {
      newParams.set('busqueda', searchTerm.trim());
    }

    filters.species.forEach(species => newParams.append('especie', species));
    filters.bloodType.forEach(bloodType => newParams.append('tipo_sangre', bloodType));
    filters.urgency.forEach(urgency => newParams.append('urgencia', urgency));
    filters.locality.forEach(locality => newParams.append('localidad', locality));

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
      if (filterType === 'location') {
        return { ...prev, location: value };
      }
      return {
        ...prev,
        [filterType]: prev[filterType].includes(value)
            ? prev[filterType].filter(item => item !== value)
            : [...prev[filterType], value]
      };
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

  // Filtrar solicitudes (memoizado)
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesSearch = !debouncedSearchTerm || [
        SPECIES[req.species]?.label,
        req.bloodType,
        req.location,
        req.clinicName,
        getLocalityLabel(req.locality),
        req.petName
      ].some(field =>
          field?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );

      const matchesFilters = (
          (filters.species.length === 0 || filters.species.includes(req.species)) &&
          (filters.bloodType.length === 0 || filters.bloodType.includes(req.bloodType)) &&
          (filters.urgency.length === 0 || filters.urgency.includes(req.urgency)) &&
          (filters.locality.length === 0 || filters.locality.includes(req.locality)) &&
          (!filters.location || req.location.toLowerCase().includes(filters.location.toLowerCase()))
      );

      return req.status === 'active' && matchesSearch && matchesFilters;
    });
  }, [requests, debouncedSearchTerm, filters]);

  // Estados de carga y error
  if (isLoading) {
    return (
        <div className="container mx-auto p-4 sm:p-6 text-center" role="status" aria-live="polite">
          <LoaderIcon className="animate-spin h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-4 text-pink-600" />
          <p className="text-sm sm:text-base text-gray-600">Cargando solicitudes de donación...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="container mx-auto p-4 sm:p-6 text-center" role="alert">
          <AlertCircleIcon className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 text-red-500" />
          <p className="text-sm sm:text-base text-gray-600">{error}</p>
        </div>
    );
  }

  return (
      <div className="container mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Solicitudes de Donación de Sangre
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ayuda a salvar vidas. Estas mascotas necesitan urgentemente donaciones de sangre.
            Cada donación puede hacer la diferencia entre la vida y la muerte.
          </p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
          {/* Búsqueda */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
            <Input
                type="text"
                placeholder="Buscar por mascota, tipo de sangre, ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 sm:pl-10 pr-4 text-sm sm:text-base"
                aria-label="Buscar solicitudes de donación"
            />
          </div>

          {/* Botón de filtros y contador */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-xs sm:text-sm"
                aria-expanded={showFilters}
                aria-controls="filters-panel"
            >
              <FilterIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Filtros</span>
              {showFilters ? (
                  <ChevronUpIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                  <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="font-medium">{filteredRequests.length}</span> solicitud{filteredRequests.length !== 1 ? 'es' : ''} encontrada{filteredRequests.length !== 1 ? 's' : ''}
              </p>
              {(filters.species.length > 0 || filters.bloodType.length > 0 || filters.urgency.length > 0 ||
                  filters.locality.length > 0 || filters.location) && (
                  <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs sm:text-sm text-red-600 hover:text-red-800 hover:bg-red-50 p-1 sm:p-2"
                  >
                    Limpiar filtros
                  </Button>
              )}
            </div>
          </div>

          {/* Panel de filtros */}
          {showFilters && (
              <div id="filters-panel" className="border-t pt-3 sm:pt-4">
                <FiltersPanel
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
              </div>
          )}

          {/* Filtros activos */}
          <ActiveFilters
              filters={filters}
              onFilterRemove={handleFilterChange}
              onClearAll={clearFilters}
          />
        </div>

        {/* Lista de solicitudes */}
        {filteredRequests.length === 0 ? (
            <Card className="p-6 sm:p-8 text-center">
              <CardContent className="space-y-3 sm:space-y-4">
                <AlertCircleIcon className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-gray-400" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900">
                  No se encontraron solicitudes
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                  No hay solicitudes que coincidan con tus criterios de búsqueda.
                  Intenta ajustar los filtros o la búsqueda.
                </p>
                {(filters.species.length > 0 || filters.bloodType.length > 0 ||
                    filters.urgency.length > 0 || filters.locality.length > 0 ||
                    filters.location || searchTerm) && (
                    <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="text-xs sm:text-sm"
                    >
                      Mostrar todas las solicitudes
                    </Button>
                )}
              </CardContent>
            </Card>
        ) : (
            <div
                className="grid gap-4 sm:gap-6"
                role="feed"
                aria-label={`${filteredRequests.length} solicitudes de donación de sangre`}
            >
              {filteredRequests.map((request, index) => (
                  <RequestCard
                      key={request.id}
                      request={request}
                      index={index}
                  />
              ))}
            </div>
        )}
      </div>
  );
}