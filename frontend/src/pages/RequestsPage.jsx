import { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from '@/components/ui/card';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';
import {
  ActivityIcon,
  CheckCircle2Icon,
  XCircleIcon,
  SearchIcon,
  FilterIcon,
  AlertTriangleIcon,
  ClockIcon,
  CalendarIcon,
  WeightIcon,
  DropletIcon,
  MapPinIcon,
  EditIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  AlertCircleIcon,
  LoaderIcon,
  PlusIcon
} from 'lucide-react';
import BloodRequestForm from '@/components/BloodRequestForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Toaster } from "@/components/ui/sonner";
import { PhoneIcon } from '@heroicons/react/24/outline';
import { BOGOTA_LOCALITIES, getLocalityLabel } from '@/constants/locations';
import { FiltersPanel, ActiveFilters } from '@/components/FiltersPanel';

// Constantes optimizadas
const SPECIES_LABELS = {
  canine: 'Perro',
  feline: 'Gato'
};

const URGENCY_LEVELS = [
  { value: 'high', label: 'Alta urgencia' },
  { value: 'medium', label: 'Urgencia media' }
];

// Placeholder optimizado
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhcmdhbmRvLi4uPC90ZXh0Pjwvc3ZnPg==';

// Datos mock mejorados
const generateMockRequests = () => {
  const now = new Date();

  return [
    {
      id: 'REQ-001',
      petName: 'Rocky',
      species: 'canine',
      bloodType: 'DEA 1.1+',
      urgency: 'high',
      minWeight: 25,
      description: 'Rocky es un pastor alemán de 5 años que ha sido diagnosticado con anemia severa después de una complicación durante una cirugía de emergencia.',
      location: 'Clínica VetCentral, Av. Principal 123',
      locality: 'suba',
      status: 'active',
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      clinicName: 'Veterinaria San Patricio',
      image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop&auto=format',
      vetContact: "+57 300 123 4567"
    },
    {
      id: 'REQ-002',
      petName: 'Luna',
      species: 'feline',
      bloodType: 'A',
      urgency: 'medium',
      minWeight: 4,
      description: 'Luna es una hermosa gata siamés de 3 años que necesita una transfusión de sangre como preparación para una cirugía compleja.',
      location: 'Hospital Veterinario Felino, Calle Los Veterinarios 456',
      locality: 'chapinero',
      status: 'completed',
      date: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      clinicName: 'Clínica Gatuna VIP',
      image: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=300&fit=crop&auto=format',
      vetContact: "+57 301 234 5678"
    },
    {
      id: 'REQ-003',
      petName: 'Max',
      species: 'canine',
      bloodType: 'DEA 1.1-',
      urgency: 'high',
      minWeight: 20,
      description: 'Max es un golden retriever de 4 años que sufrió un grave accidente automovilístico esta madrugada.',
      location: 'Hospital Veterinario de Emergencias 24/7, Av. Las Condes 789',
      locality: 'kennedy',
      status: 'active',
      date: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      clinicName: 'Hospital Vet Central',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&auto=format',
      vetContact: "+57 302 345 6789"
    },
    {
      id: 'REQ-004',
      petName: 'Charlie',
      species: 'canine',
      bloodType: 'DEA 3+',
      urgency: 'medium',
      minWeight: 18,
      description: 'Charlie es un beagle de 6 años que desarrolló una anemia hemolítica autoinmune.',
      location: 'Clínica Veterinaria Central, Carrera 15 #85-20',
      locality: 'fontibón',
      status: 'cancelled',
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      clinicName: 'Clínica Animales Felices',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop&auto=format',
      vetContact: "+57 304 567 8901"
    }
  ];
};

// Definición de estados
const STATUSES = {
  active: {
    label: 'Activa',
    color: 'bg-blue-100 text-blue-800',
    icon: ActivityIcon
  },
  completed: {
    label: 'Completada',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle2Icon
  },
  cancelled: {
    label: 'Cancelada',
    color: 'bg-red-100 text-red-800',
    icon: XCircleIcon
  }
};

// Función de fecha optimizada con caché
const formatDate = (() => {
  const cache = new Map();

  return (dateString) => {
    if (cache.has(dateString)) {
      return cache.get(dateString);
    }

    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    let result;
    if (diffTime < 0) {
      result = 'Fecha futura';
    } else if (diffMinutes < 60) {
      result = diffMinutes < 1 ? 'Hace unos segundos' : `Hace ${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      result = `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
      result = 'Hoy';
    } else if (diffDays === 1) {
      result = 'Hace 1 día';
    } else if (diffDays < 30) {
      result = `Hace ${diffDays} días`;
    } else if (diffDays < 365) {
      const diffMonths = Math.floor(diffDays / 30);
      result = `Hace ${diffMonths} mes${diffMonths !== 1 ? 'es' : ''}`;
    } else {
      const diffYears = Math.floor(diffDays / 365);
      result = `Hace ${diffYears} año${diffYears !== 1 ? 's' : ''}`;
    }

    cache.set(dateString, result);
    return result;
  };
})();

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

// Componente RequestCard memoizado
const RequestCard = memo(({ request }) => {
  const urgencyInfo = useMemo(() => {
    return request.urgency === 'high' ? {
      label: 'URGENCIA ALTA',
      color: 'bg-red-500',
      textColor: 'text-white'
    } : {
      label: 'URGENCIA MEDIA',
      color: 'bg-orange-500',
      textColor: 'text-white'
    };
  }, [request.urgency]);
  
  const UrgencyIcon = request.urgency === 'high' ? AlertTriangleIcon : ClockIcon;
  const StatusIcon = STATUSES[request.status].icon;
  const speciesEmoji = request.species === 'canine' ? '🐶' : '🐱';
  const formattedDate = useMemo(() => formatDate(request.date), [request.date]);
  const localityLabel = useMemo(() => getLocalityLabel(request.locality), [request.locality]);

  return (
      <article
          className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
          role="article"
          aria-labelledby={`request-title-${request.id}`}
      >
        <div className="p-0">
          {/* Badge de urgencia */}
          <div className="absolute top-0 right-0 z-10">
            <div
                className={`${urgencyInfo.color} ${urgencyInfo.textColor} px-2 py-1 rounded-bl-lg rounded-tr-lg flex items-center gap-1 text-xs font-medium`}
                role="status"
                aria-label={`Nivel de urgencia: ${urgencyInfo.label}`}
            >
              <UrgencyIcon className="h-3 w-3" aria-hidden="true" />
              <span className="hidden sm:inline">{urgencyInfo.label}</span>
              <span className="sm:hidden">
                {urgencyInfo.label.includes('ALTA') ? 'ALTA' : 'MEDIA'}
              </span>
            </div>
          </div>

          {/* Botón de gestión */}
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10">
            <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 shadow-lg text-xs sm:text-sm"
                size="sm"
                aria-label={`Gestionar solicitud de ${request.petName}`}
            >
              <Link to={`/requests/${request.id}`}>
                <EditIcon className="mr-1 h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Gestionar</span>
                <span className="sm:hidden">Gest.</span>
              </Link>
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:items-stretch">
            {/* Contenido principal */}
            <div className="lg:w-2/3 flex flex-col space-y-2 sm:space-y-3 order-2 lg:order-1 p-3 sm:p-4 lg:p-5">
              {/* Header */}
              <header className="flex items-center gap-2 sm:gap-3">
                <span
                    className="text-xl sm:text-2xl"
                    role="img"
                    aria-label={SPECIES_LABELS[request.species]}
                >
                  {speciesEmoji}
                </span>
                <div className="flex-1 min-w-0">
                  <h2
                      id={`request-title-${request.id}`}
                      className="font-bold text-base sm:text-lg xl:text-xl text-blue-600 truncate"
                  >
                    {request.petName || 'Mascota'}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    {SPECIES_LABELS[request.species]} • {localityLabel}
                  </p>
                </div>
              </header>

              {/* Descripción */}
              <div className="space-y-2 sm:space-y-3">
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 lg:line-clamp-3">
                  {request.description}
                </p>

                {/* Información de contacto */}
                <div className="space-y-2 sm:space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
                  <div className="flex items-start gap-2 bg-blue-50 p-2 sm:p-3 rounded-lg border-l-4 border-blue-400">
                    <MapPinIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">Ubicación</p>
                      <p className="text-xs sm:text-sm text-gray-700 font-medium truncate">{request.location}</p>
                      <p className="text-xs text-blue-600 font-medium mt-1">{localityLabel}, Bogotá</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-green-50 p-2 sm:p-3 rounded-lg border-l-4 border-green-400">
                    <PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-green-600 font-medium uppercase tracking-wide mb-1">Contacto</p>
                      <p className="text-xs sm:text-sm text-gray-700 font-medium truncate">
                        <a
                            href={`tel:${request.vetContact || request.contact}`}
                            className="hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 rounded"
                            aria-label={`Llamar a ${request.vetContact || request.contact}`}
                        >
                          {request.vetContact || request.contact}
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
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-200">
                    <WeightIcon className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium">Peso mínimo</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-700 truncate">{request.minWeight} kg</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-200">
                    <DropletIcon className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium">Tipo de sangre</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-700 truncate">{request.bloodType}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Estado y fecha */}
              <footer className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${STATUSES[request.status].color} w-fit`}
                    role="status"
                    aria-label={`Estado: ${STATUSES[request.status].label}`}
                >
                  <StatusIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                  <span>{STATUSES[request.status].label}</span>
                </div>
                <time
                    className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md w-fit"
                    dateTime={request.date}
                    aria-label={`Creado ${formattedDate}`}
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
                    src={request.image || `https://via.placeholder.com/400x300/e5e7eb/6b7280?text=${request.petName || 'Mascota'}`}
                    alt={`Fotografía de ${request.petName || 'la mascota'}, ${SPECIES_LABELS[request.species]} que necesita donación de sangre`}
                    petName={request.petName || 'Mascota'}
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

// Componente RequestList memoizado
const RequestList = memo(({ requests, status }) => {
  if (requests.length === 0) {
    return (
        <Card>
          <CardContent className="py-8 sm:py-12 text-center">
            <AlertCircleIcon className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-4" aria-hidden="true" />
            <p className="text-gray-500 text-sm sm:text-base">
              No hay solicitudes {status === 'active' ? 'activas' : status === 'completed' ? 'completadas' : 'canceladas'}
            </p>
          </CardContent>
        </Card>
    );
  }

  return (
      <div className="space-y-3 sm:space-y-4" role="list" aria-label={`Solicitudes ${status}`}>
        {requests.map((request) => (
            <div key={request.id} role="listitem">
              <RequestCard request={request} />
            </div>
        ))}
      </div>
  );
});

RequestList.displayName = 'RequestList';

// Función para parsear filtros desde URL
const parseFiltersFromURL = (searchParams) => ({
  species: searchParams.getAll('especie'),
  bloodType: searchParams.getAll('tipo_sangre'),
  urgency: searchParams.getAll('urgencia'),
  locality: searchParams.getAll('localidad'),
  location: searchParams.get('ubicacion') || ''
});

// Componente principal
export default function RequestsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado de filtros
  const [searchTerm, setSearchTerm] = useState(searchParams.get('busqueda') || '');
  const [activeTab, setActiveTab] = useState(searchParams.get('estado') || 'active');
  const [filters, setFilters] = useState(() => parseFiltersFromURL(searchParams));

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Cargar datos
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise(resolve => setTimeout(resolve, 300));
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

  // Actualizar URL con parámetros
  const updateURLWithParams = useCallback((filters, searchTerm, activeTab) => {
    const newParams = new URLSearchParams();

    if (searchTerm.trim()) {
      newParams.set('busqueda', searchTerm.trim());
    }

    if (activeTab !== 'active') {
      newParams.set('estado', activeTab);
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

  // Sincronizar cambios con URL
  useEffect(() => {
    updateURLWithParams(filters, debouncedSearchTerm, activeTab);
  }, [filters, debouncedSearchTerm, activeTab, updateURLWithParams]);

  // Manejar nueva solicitud
  const handleRequestCreated = useCallback((newRequest) => {
    const requestWithId = {
      ...newRequest,
      id: `REQ-${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`,
      status: 'active',
      date: new Date().toISOString(),
      petName: newRequest.petName || `Mascota ${Math.floor(Math.random() * 100)}`,
      clinicName: newRequest.clinicName || 'Clínica Demo',
      image: newRequest.image || 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Mascota',
      vetContact: newRequest.contact || '+57 300 000 0000',
      locality: newRequest.locality || 'suba'
    };

    setRequests(prev => [requestWithId, ...prev]);
    setIsModalOpen(false);
  }, []);

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
    setActiveTab('active');
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  // Filtrar solicitudes (memoizado)
  const filteredRequests = useMemo(() => {
    return (status) => {
      return requests
          .filter(req => req.status === status)
          .filter(req => {
            const matchesSearch = !debouncedSearchTerm || [
              req.species,
              req.bloodType,
              req.petName,
              req.location,
              req.clinicName,
              getLocalityLabel(req.locality),
              SPECIES_LABELS[req.species]
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

            return matchesSearch && matchesFilters;
          });
    };
  }, [requests, debouncedSearchTerm, filters]);

  if (isLoading) {
    return (
        <div className="container mx-auto p-4 sm:p-6 text-center" role="status" aria-live="polite">
          <LoaderIcon className="animate-spin h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-4 text-blue-600" />
          <p className="text-sm sm:text-base text-gray-600">Cargando solicitudes...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="container mx-auto p-4 sm:p-6 text-center" role="alert">
          <AlertCircleIcon className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Intentar de nuevo
          </Button>
        </div>
    );
  }

  return (
      <main className="container mx-auto p-3 sm:p-4 lg:p-6 bg-green-50 rounded-lg shadow-md max-w-7xl">
        <Toaster position="top-center" />

        {/* Header semántico */}
        <header className="mb-6 lg:mb-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Gestión de Solicitudes</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Administra las solicitudes de donación de sangre en Bogotá
              </p>
            </div>
            <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-pink-600 hover:bg-pink-700 w-full sm:w-auto whitespace-nowrap"
                aria-label="Crear nueva solicitud de donación"
            >
              <PlusIcon className="mr-2 h-4 w-4" aria-hidden="true" />
              Nueva Solicitud
            </Button>
          </div>
        </header>

        {/* Diálogo para nueva solicitud */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle>Nueva Solicitud de Donación</DialogTitle>
            </DialogHeader>
            <BloodRequestForm onRequestCreated={handleRequestCreated} />
          </DialogContent>
        </Dialog>

        {/* Sección de filtros */}
        <section aria-label="Filtros de búsqueda">
          <Card className="mb-4 sm:mb-6">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                  <div className="relative flex-1">
                    <label htmlFor="search-input" className="sr-only">
                      Buscar solicitudes por nombre, especie, tipo de sangre, localidad o clínica
                    </label>
                    <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" aria-hidden="true" />
                    <Input
                        id="search-input"
                        placeholder="Buscar por mascota, clínica, tipo de sangre, localidad..."
                        className="pl-10 text-sm sm:text-base"
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
                      className="flex items-center gap-2 w-full md:w-auto text-sm"
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

        {/* Tabs para estados */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active" className="text-xs sm:text-sm">
              Activas ({filteredRequests('active').length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm">
              Completadas ({filteredRequests('completed').length})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs sm:text-sm">
              Canceladas ({filteredRequests('cancelled').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <RequestList requests={filteredRequests('active')} status="active" />
          </TabsContent>

          <TabsContent value="completed">
            <RequestList requests={filteredRequests('completed')} status="completed" />
          </TabsContent>

          <TabsContent value="cancelled">
            <RequestList requests={filteredRequests('cancelled')} status="cancelled" />
          </TabsContent>
        </Tabs>
      </main>
  );
}