import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  ClockIcon,
  SearchIcon,
  FilterIcon,
  AlertTriangleIcon,
  CalendarIcon,
  WeightIcon,
  DropletIcon,
  EditIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  AlertCircleIcon,
  LoaderIcon,
  PlusIcon,
  Building2Icon

} from 'lucide-react';
import BloodRequestForm from '@/components/BloodRequestForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BOGOTA_LOCALITIES } from '@/constants/locations';
import { FiltersPanel, ActiveFilters } from '@/components/FiltersPanel';

// Mapeos para los valores que espera la API
const MAP_SPECIES_TO_API = { canine: 'Perro', feline: 'Gato' };
const MAP_URGENCY_TO_API = { high: 'Alta', medium: 'Media' };
const MAP_STATUS_TO_API = {
  active: 'Activa',
  pending: 'Revision',
  completed: 'Completada',
  cancelled: 'Cancelada'
};

const SPECIES_LABELS = {
  canine: 'Perro',
  feline: 'Gato'
};

const parseFiltersFromURL = (searchParams) => ({
  species: searchParams.getAll('especie'),
  bloodType: searchParams.getAll('tipo_sangre'),
  urgency: searchParams.getAll('urgencia'),
  locality: searchParams.getAll('localidad'),
  location: searchParams.get('ubicacion') || ''
});

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// Componente RequestCard
function RequestCard({ request }) {
  const urgencyBadge = useMemo(() => {
    if (request.urgency === 'high') {
      return {
        label: 'URGENCIA ALTA',
        bgColor: 'bg-red-500',
        textColor: 'text-white',
        icon: AlertCircleIcon
      };
    }
    return {
      label: 'URGENCIA MEDIA',
      bgColor: 'bg-orange-500',
      textColor: 'text-white',
      icon: ClockIcon
    };
  }, [request.urgency]);

  const UrgencyIcon = urgencyBadge.icon;
  const speciesEmoji = request.species === 'canine' ? '🐶' : request.species === 'feline' ? '🐱' : '';
  const formattedDate = useMemo(() => {
    if (!request.date) return '';
    const date = new Date(request.date);
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
  }, [request.date]);

  // Estado visual
  const STATUS_CONFIG = {
    active: { label: 'Activa', color: 'bg-blue-100 text-blue-800', icon: ActivityIcon },
    pending: { label: 'En revisión', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
    completed: { label: 'Completada', color: 'bg-green-100 text-green-800', icon: CheckCircle2Icon },
    cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800', icon: XCircleIcon }
  };
  const statusConf = STATUS_CONFIG[request.status];

  return (
    <article
      className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
      role="article"
      aria-labelledby={`request-title-${request.id}`}
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

        {/* Botón de gestión */}
        <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 z-10">
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 shadow-lg text-sm"
            size="sm"
            aria-label={`Gestionar solicitud de ${request.petName}`}
          >
            <a href={`/requests/${request.id}`}>
              <EditIcon className="mr-1.5 h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Gestionar</span>
              <span className="sm:hidden">Gest.</span>
            </a>
          </Button>
        </div>

        {/* Fecha en esquina inferior izquierda */}
        <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 z-10">
          <time
            className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-md"
            dateTime={request.date}
            aria-label={`Creado ${formattedDate}`}
          >
            <ClockIcon className="h-4 w-4" aria-hidden="true" />
            <span>{formattedDate}</span>
          </time>
        </div>

        {/* Contenido principal */}
        <div className="space-y-4 pt-8 pb-16">
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
                id={`request-title-${request.id}`}
                className="font-bold text-xl text-blue-600 truncate"
              >
                {request.petName}
              </h2>
              <p className="text-sm text-gray-600 truncate">
                {SPECIES_LABELS[request.species]}
              </p>
            </div>
          </header>

          {/* Descripción */}
          <div className="space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
              {request.description}
            </p>

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

            {/* Estado */}
            <div className="flex justify-start">
              <div
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusConf.color} w-fit`}
                role="status"
                aria-label={`Estado: ${statusConf.label}`}
              >
                <statusConf.icon className="h-3 w-3 mr-1" aria-hidden="true" />
                <span>{statusConf.label}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// Componente RequestList
function RequestList({ requests, status }) {
  const getStatusLabel = (status) => {
    const labels = {
      pending: 'en revisión',
      active: 'activas',
      completed: 'completadas',
      cancelled: 'canceladas'
    };
    return labels[status] || status;
  };

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 sm:py-12 text-center">
          <AlertCircleIcon className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-4" aria-hidden="true" />
          <p className="text-gray-500 text-sm sm:text-base">
            No hay solicitudes {getStatusLabel(status)}
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
}

export default function RequestsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado de filtros
  const [searchTerm, setSearchTerm] = useState(searchParams.get('busqueda') || '');
  const [activeTab, setActiveTab] = useState(searchParams.get('estado') || 'pending');
  const [filters, setFilters] = useState(() => parseFiltersFromURL(searchParams));
  const [tabCounts, setTabCounts] = useState({
    active: 0,
    pending: 0,
    completed: 0,
    cancelled: 0
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Cargar solicitudes desde la API usando el endpoint de filtrar
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams();

    // Solo agregar el estado si NO hay búsqueda por texto
    if (!debouncedSearchTerm && activeTab) {
      params.append('estado', MAP_STATUS_TO_API[activeTab]);
    }
    // Filtros
    filters.species.forEach(s => params.append('especie', MAP_SPECIES_TO_API[s] || s));
    filters.bloodType.forEach(b => params.append('tipo_sangre', b));
    filters.urgency.forEach(u => params.append('urgencia', MAP_URGENCY_TO_API[u] || u));
    filters.locality.forEach(l => params.append('localidad', l));

    const url = `http://localhost:8000/api/v1/vet/solicitudes/filtrar?${params.toString()}`;

    fetch(url)
      .then(async (res) => {
        if (!res.ok) throw new Error('Error al cargar las solicitudes');
        const data = await res.json();

        // Mapea los campos de la API a los que espera tu frontend
        const mapEstadoToStatus = (estado) => {
          switch ((estado || '').toLowerCase()) {
            case 'activa': return 'active';
            case 'revision':
            case 'en revisión': return 'pending';
            case 'completada': return 'completed';
            case 'cancelada': return 'cancelled';
            default: return 'pending';
          }
        };

        const mapped = data.map(item => ({
          id: item.id,
          petName: item.nombre_mascota,
          species: item.especie === 'Perro' ? 'canine' : item.especie === 'Gato' ? 'feline' : item.especie,
          bloodType: item.tipo_sangre,
          urgency: item.urgencia === 'Alta' ? 'high' : 'medium',
          minWeight: item.peso_minimo,
          description: item.descripcion_solicitud,
          location: item.direccion,
          locality: item.localidad || '',
          status: mapEstadoToStatus(item.estado),
          date: item.fecha_creacion,
          clinicName: item.nombre_veterinaria,
          vetContact: item.contacto,
          photo: item.foto_mascota
        }));

        setRequests(mapped);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Error al cargar las solicitudes');
        setIsLoading(false);
      });
  }, [filters, activeTab, debouncedSearchTerm]); // <-- agregar debouncedSearchTerm a las dependencias

  // Cargar contadores de tabs (solo si no hay búsqueda por texto)
  useEffect(() => {
    if (debouncedSearchTerm) return;

    const fetchCounts = async () => {
      const states = ['active', 'pending', 'completed', 'cancelled'];
      const promises = states.map(tab => {
        const params = new URLSearchParams();
        params.append('estado', MAP_STATUS_TO_API[tab]);
        filters.species.forEach(s => params.append('especie', MAP_SPECIES_TO_API[s] || s));
        filters.bloodType.forEach(b => params.append('tipo_sangre', b));
        filters.urgency.forEach(u => params.append('urgencia', MAP_URGENCY_TO_API[u] || u));
        filters.locality.forEach(l => params.append('localidad', l));
        return fetch(`http://localhost:8000/api/v1/vet/solicitudes/filtrar?${params.toString()}`)
          .then(res => res.ok ? res.json() : [])
          .then(data => Array.isArray(data) ? data.length : 0)
          .catch(() => 0);
      });

      const counts = await Promise.all(promises);
      setTabCounts({
        active: counts[0],
        pending: counts[1],
        completed: counts[2],
        cancelled: counts[3]
      });
    };

    fetchCounts();
  }, [filters, debouncedSearchTerm]);

  // Actualizar URL con filtros y tab
  const updateURLWithFilters = useCallback((filters, searchTerm, activeTab) => {
    const newParams = new URLSearchParams();

    if (searchTerm.trim()) {
      newParams.set('busqueda', searchTerm.trim());
    }

    if (activeTab !== 'pending') {
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

  useEffect(() => {
    updateURLWithFilters(filters, debouncedSearchTerm, activeTab);
  }, [filters, debouncedSearchTerm, activeTab, updateURLWithFilters]);

  // Manejar cambios en filtros
  const handleFilterChange = useCallback((filterType, value) => {
    setFilters(prev => {
      if (filterType === 'location') {
        return { ...prev, location: value };
      }
      // Solo un valor por filtro (como array de máximo un elemento)
      return {
        ...prev,
        [filterType]: value ? [value] : []
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
    setActiveTab('pending');
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  // Solo búsqueda por texto en frontend, ahora filtrando por estado
  const filteredRequestsByTab = useMemo(() => {
    // Si no hay búsqueda, simplemente retorna los requests por estado
    if (!debouncedSearchTerm) {
      return {
        active: requests.filter(req => req.status === 'active'),
        pending: requests.filter(req => req.status === 'pending'),
        completed: requests.filter(req => req.status === 'completed'),
        cancelled: requests.filter(req => req.status === 'cancelled'),
      };
    }
    // Si hay búsqueda, filtra por texto y luego separa por estado
    const filtered = requests.filter(req => {
      return (
        req.petName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    });
    return {
      active: filtered.filter(req => req.status === 'active'),
      pending: filtered.filter(req => req.status === 'pending'),
      completed: filtered.filter(req => req.status === 'completed'),
      cancelled: filtered.filter(req => req.status === 'cancelled'),
    };
  }, [requests, debouncedSearchTerm]);

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
    <main className="container mx-auto p-3 sm:p-4 lg:p-6 bg-soft-green rounded-lg shadow-md max-w-7xl">

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
          <BloodRequestForm onRequestCreated={() => setIsModalOpen(false)} />
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
                    Buscar por nombre de mascota
                  </label>
                  <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" aria-hidden="true" />
                  <Input
                    id="search-input"
                    placeholder="Buscar por nombre de mascota"
                    className="pl-10 text-sm sm:text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-describedby="search-help"
                  />
                  <div id="search-help" className="sr-only">
                    Utiliza este campo para buscar solicitudes por nombre de mascota
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
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />
      </section>

      {/* Tabs para estados */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-0 h-auto p-1">
          <TabsTrigger value="active" className="text-xs sm:text-sm py-2 px-1 sm:px-3 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <span className="hidden sm:inline">Activas</span>
            <span className="sm:hidden">Act.</span>
            <span className="ml-1">
              ({debouncedSearchTerm ? filteredRequestsByTab.active.length : tabCounts.active})
            </span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs sm:text-sm py-2 px-1 sm:px-3 data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
            <span className="hidden sm:inline">En revisión</span>
            <span className="sm:hidden">Pend.</span>
            <span className="ml-1">
              ({debouncedSearchTerm ? filteredRequestsByTab.pending.length : tabCounts.pending})
            </span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm py-2 px-1 sm:px-3 data-[state=active]:bg-green-500 data-[state=active]:text-white">
            <span className="hidden sm:inline">Completadas</span>
            <span className="sm:hidden">Comp.</span>
            <span className="ml-1">
              ({debouncedSearchTerm ? filteredRequestsByTab.completed.length : tabCounts.completed})
            </span>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="text-xs sm:text-sm py-2 px-1 sm:px-3 data-[state=active]:bg-red-500 data-[state=active]:text-white">
            <span className="hidden sm:inline">Canceladas</span>
            <span className="sm:hidden">Canc.</span>
            <span className="ml-1">
              ({debouncedSearchTerm ? filteredRequestsByTab.cancelled.length : tabCounts.cancelled})
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <RequestList requests={filteredRequestsByTab.active} status="active" />
        </TabsContent>
        <TabsContent value="pending">
          <RequestList requests={filteredRequestsByTab.pending} status="pending" />
        </TabsContent>
        <TabsContent value="completed">
          <RequestList requests={filteredRequestsByTab.completed} status="completed" />
        </TabsContent>
        <TabsContent value="cancelled">
          <RequestList requests={filteredRequestsByTab.cancelled} status="cancelled" />
        </TabsContent>
      </Tabs>
    </main>
  );
}
