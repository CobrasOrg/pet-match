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

// Constantes optimizadas
const SPECIES_LABELS = {
  canine: 'Perro',
  feline: 'Gato'
};

const URGENCY_LEVELS = [
  { value: 'high', label: 'Alta urgencia' },
  { value: 'medium', label: 'Urgencia media' }
];

// Funciones optimizadas con memoización
const getSpeciesEmoji = (() => {
  const cache = {
    canine: '🐶',
    feline: '🐱'
  };
  return (species) => cache[species] || '';
})();

const getUrgencyBadge = (() => {
  const cache = {
    high: {
      label: 'URGENCIA ALTA',
      bgColor: 'bg-red-500',
      textColor: 'text-white',
      icon: AlertTriangleIcon
    },
    medium: {
      label: 'URGENCIA MEDIA',
      bgColor: 'bg-orange-500',
      textColor: 'text-white',
      icon: ClockIcon
    }
  };
  return (urgency) => cache[urgency] || cache.medium;
})();

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

// Datos estáticos únicos sin imágenes
const generateStaticRequests = () => {
  const now = new Date();

  return [
    {
      id: 'REQ-001',
      petName: 'Rocky',
      species: 'canine',
      bloodType: 'DEA 1.1+',
      urgency: 'high',
      minWeight: 25,
      description: 'Rocky es un pastor alemán de 5 años que ha sido diagnosticado con anemia severa después de una complicación durante una cirugía de emergencia. Su hemograma muestra valores críticos y necesita una transfusión de sangre urgente para estabilizar su condición. Es un perro muy cariñoso y luchador que ha estado bajo cuidados intensivos las últimas 48 horas.',
      location: 'Clínica VetCentral, Av. Principal 123',
      locality: 'suba',
      status: 'active',
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      clinicName: 'Veterinaria San Patricio',
      vetContact: "+57 300 123 4567"
    },
    {
      id: 'REQ-002',
      petName: 'Luna',
      species: 'feline',
      bloodType: 'A',
      urgency: 'medium',
      minWeight: 4,
      description: 'Luna es una hermosa gata siamés de 3 años que necesita una transfusión de sangre como preparación para una cirugía compleja programada para la próxima semana. Fue rescatada hace un año de la calle en condiciones muy precarias y desde entonces ha sido el amor de la familia que la adoptó.',
      location: 'Hospital Veterinario Felino Especializado, Calle Los Veterinarios 456',
      locality: 'chapinero',
      status: 'active',
      date: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      clinicName: 'Clínica Gatuna VIP',
      vetContact: "+57 301 234 5678"
    },
    {
      id: 'REQ-003',
      petName: 'Max',
      species: 'canine',
      bloodType: 'DEA 1.1-',
      urgency: 'high',
      minWeight: 20,
      description: 'Max es un golden retriever de 4 años que sufrió un grave accidente automovilístico esta madrugada mientras paseaba con su dueño. Afortunadamente no tiene fracturas graves, pero perdió mucha sangre debido a laceraciones internas. Es un perro muy activo, le encanta nadar y jugar en el parque con otros perros.',
      location: 'Hospital Veterinario de Emergencias 24/7, Av. Las Condes 789',
      locality: 'kennedy',
      status: 'active',
      date: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      clinicName: 'Hospital Vet Central',
      vetContact: "+57 302 345 6789"
    },
    {
      id: 'REQ-004',
      petName: 'Bella',
      species: 'feline',
      bloodType: 'B',
      urgency: 'medium',
      minWeight: 3.5,
      description: 'Bella es una gata persa de 2 años que necesita una transfusión debido a una anemia causada por parásitos. Está siendo tratada en una clínica especializada y su pronóstico es muy bueno con el tratamiento adecuado. Es muy cariñosa y le encanta estar cerca de las personas.',
      location: 'Clínica Veterinaria Zona Norte, Calle 170 #45-32',
      locality: 'usaquen',
      status: 'active',
      date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      clinicName: 'Vet Norte',
      vetContact: "+57 303 456 7890"
    },
    {
      id: 'REQ-005',
      petName: 'Charlie',
      species: 'canine',
      bloodType: 'DEA 3+',
      urgency: 'high',
      minWeight: 18,
      description: 'Charlie es un beagle de 6 años que desarrolló una anemia hemolítica autoinmune. Es un perro muy alegre y sociable que siempre está moviendo la cola. Su familia está muy preocupada y esperanzada en encontrar un donante compatible pronto.',
      location: 'Clínica Veterinaria Central, Carrera 15 #85-20',
      locality: 'fontibón',
      status: 'active',
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      clinicName: 'Clínica Animales Felices',
      vetContact: "+57 304 567 8901"
    },
    {
      id: 'REQ-006',
      petName: 'Mia',
      species: 'feline',
      bloodType: 'AB',
      urgency: 'medium',
      minWeight: 3,
      description: 'Mia es una gatita mestiza de 1 año que necesita una transfusión para una cirugía reconstructiva después de un accidente. A pesar de su corta edad, ha mostrado una gran fortaleza y ganas de vivir. Su tipo de sangre AB es poco común, por lo que necesitamos ayuda urgente.',
      location: 'Hospital Veterinario Especializado, Av. Boyacá #90-15',
      locality: 'engativá',
      status: 'active',
      date: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      clinicName: 'Hospital Veterinario 24h',
      vetContact: "+57 305 678 9012"
    },
    {
      id: 'REQ-007',
      petName: 'Zeus',
      species: 'canine',
      bloodType: 'DEA 1.1+',
      urgency: 'high',
      minWeight: 30,
      description: 'Zeus es un rottweiler de 7 años que necesita una transfusión después de una cirugía de emergencia por torsión gástrica. Es un perro muy noble y protector de su familia. Los veterinarios han logrado estabilizar la torsión, pero ahora necesita apoyo sanguíneo para su recuperación.',
      location: 'Clínica Veterinaria Sur, Calle 40 Sur #25-10',
      locality: 'bosa',
      status: 'active',
      date: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      clinicName: 'Vet Plus',
      vetContact: "+57 306 789 0123"
    },
    {
      id: 'REQ-008',
      petName: 'Coco',
      species: 'feline',
      bloodType: 'A',
      urgency: 'medium',
      minWeight: 4.5,
      description: 'Coco es un gato ragdoll de 4 años que desarrolló anemia debido a una enfermedad renal crónica. Es un gato muy tranquilo y cariñoso que disfruta de las caricias y los mimos. Su familia está trabajando con los veterinarios para manejar su condición a largo plazo.',
      location: 'Clínica Pet Care, Av. NQS #65-45',
      locality: 'teusaquillo',
      status: 'active',
      date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      clinicName: 'Clínica Pet Care',
      vetContact: "+57 307 890 1234"
    },
    {
      id: 'REQ-009',
      petName: 'Buddy',
      species: 'canine',
      bloodType: 'DEA 4+',
      urgency: 'medium',
      minWeight: 22,
      description: 'Buddy es un labrador mestizo de 5 años que necesita una transfusión antes de una cirugía para remover un tumor benigno en el abdomen. Es un perro muy juguetón y le encanta perseguir pelotas. Su cirugía está programada para la próxima semana.',
      location: 'Hospital Veterinario Norte, Calle 127 #15-30',
      locality: 'usaquen',
      status: 'active',
      date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      clinicName: 'Vet Norte',
      vetContact: "+57 308 901 2345"
    },
    {
      id: 'REQ-010',
      petName: 'Nala',
      species: 'feline',
      bloodType: 'B',
      urgency: 'high',
      minWeight: 3.8,
      description: 'Nala es una gata bengalí de 3 años que sufrió una intoxicación accidental y desarrolló anemia hemolítica. Es una gata muy activa y curiosa que ama explorar. Los veterinarios están trabajando para eliminar las toxinas de su sistema, pero necesita apoyo sanguíneo inmediato.',
      location: 'Clínica de Emergencias Veterinarias, Av. Caracas #50-20',
      locality: 'chapinero',
      status: 'active',
      date: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
      clinicName: 'Clínica Gatuna VIP',
      vetContact: "+57 309 012 3456"
    }
  ];
};

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

// Componente de tarjeta memoizado sin imagen
const RequestCard = memo(({ request }) => {
  const urgencyBadge = useMemo(() => getUrgencyBadge(request.urgency), [request.urgency]);
  const UrgencyIcon = urgencyBadge.icon;
  const speciesEmoji = useMemo(() => getSpeciesEmoji(request.species), [request.species]);
  const formattedDate = useMemo(() => formatDate(request.date), [request.date]);
  const localityLabel = useMemo(() => getLocalityLabel(request.locality), [request.locality]);

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
            <span>{request.clinicName}</span>
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
            aria-label={`Ayudar a ${request.petName} con donación de sangre`}
          >
            <Link to={`/apply/${request.id}`}>
              <HeartIcon className="mr-1.5 h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Ayudar a {request.petName}</span>
              <span className="sm:hidden">Ayudar</span>
            </Link>
          </Button>
        </div>

        {/* Contenido principal */}
        <div className="space-y-4 pt-8">
          {/* Header con emoji más grande y prominente */}
          <header className="flex items-center gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center border-2 border-pink-300">
              <span
                className="text-3xl"
                role="img"
                aria-label={`${SPECIES_LABELS[request.species]}`}
              >
                {speciesEmoji}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h2
                id={`pet-name-${request.id}`}
                className="font-bold text-xl text-pink-600 truncate"
              >
                {request.petName}
              </h2>
              <p className="text-sm text-gray-600 truncate">
                {SPECIES_LABELS[request.species]} • {localityLabel}
              </p>
            </div>
          </header>

          {/* Descripción */}
          <div className="space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
              {request.description}
            </p>

            {/* Información de contacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                <MapPinIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">Ubicación</p>
                  <p className="text-sm text-gray-700 font-medium">{request.location}</p>
                  <p className="text-xs text-blue-600 font-medium mt-1">{localityLabel}, Bogotá</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                <PhoneIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-green-600 font-medium uppercase tracking-wide mb-1">Contacto</p>
                  <p className="text-sm text-gray-700 font-medium">
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
                    <p className="text-sm font-semibold text-gray-700">{request.minWeight} kg</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-3 rounded-md border border-gray-200">
                  <DropletIcon className="h-4 w-4 text-red-500" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Tipo de sangre</p>
                    <p className="text-sm font-semibold text-gray-700">{request.bloodType}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Fecha */}
            <footer className="flex justify-start">
              <time
                className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-md"
                dateTime={request.date}
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

  // Cargar datos estáticos de forma inmediata para mejor rendimiento
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      setError(null);

      try {
        // Cargar datos inmediatamente sin delay
        const staticRequests = generateStaticRequests();
        setRequests(staticRequests);
        setIsLoading(false);
      } catch (err) {
        setError('Error al cargar las solicitudes');
        console.error('Error loading data:', err);
        setIsLoading(false);
      }
    };

    // Usar requestIdleCallback para no bloquear el hilo principal
    if (window.requestIdleCallback) {
      window.requestIdleCallback(loadData);
    } else {
      // Fallback inmediato
      loadData();
    }
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
      const isValidSpecies = req.species === 'canine' || req.species === 'feline';
      const isValidUrgency = req.urgency === 'high' || req.urgency === 'medium';

      const matchesSearch = !debouncedSearchTerm || [
        req.species,
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

      return req.status === 'active' && isValidSpecies && isValidUrgency && matchesSearch && matchesFilters;
    });
  }, [requests, debouncedSearchTerm, filters]);

  // Loading state optimizado
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