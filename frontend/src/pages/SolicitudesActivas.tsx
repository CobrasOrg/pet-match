import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import CardSolicitud from '../components/CardSolicitud';

// Interfaz duplicada aquí para mantener independencia del componente
// En un proyecto real, esto estaría en un archivo de tipos compartido
interface Solicitud {
  id: number;
  tipoMascota: 'perro' | 'gato';
  nombreMascota: string;
  tipoSangre: string;
  veterinaria: string;
  ubicacion: string;
  urgencia: 'baja' | 'media' | 'alta';
  descripcion: string;
  fechaCreacion: string;
  estado: 'pendiente' | 'en_proceso' | 'completada';
}

/**
 * Hook personalizado para implementar scroll infinito
 * Detecta cuando el usuario llega cerca del final de la página
 * @param callback - Función a ejecutar cuando se detecta el scroll
 */
const useInfiniteScroll = (callback: () => void): void => {
  useEffect(() => {
    const handleScroll = () => {
      // Calcula si el usuario está cerca del final (100px antes)
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        callback();
      }
    };

    // Agregar y limpiar event listener
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback]);
};

/**
 * Componente de loading con spinner animado
 * Incluye accesibilidad para lectores de pantalla
 */
const LoadingSpinner: React.FC = () => (
    <div className="loading-container" role="status" aria-label="Cargando más solicitudes">
      <div className="spinner"></div>
      <span className="sr-only">Cargando...</span>
    </div>
);

/**
 * Componente para mostrar mensajes de error
 * @param message - Mensaje de error a mostrar
 */
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <div className="error-container" role="alert">
      <p className="error-message">{message}</p>
    </div>
);

/**
 * Función que genera datos mock para desarrollo
 * En producción, esto se reemplazaría por llamadas a API reales
 * @param page - Número de página para generar datos únicos
 * @returns Array de solicitudes simuladas
 */
const generarSolicitudesMock = (page: number): Solicitud[] => {
  // Arrays con datos de ejemplo para generar contenido variado
  const veterinarias = ['VetCare', 'MascotaSalud', 'VetCenter'];
  const ubicaciones = ['Centro', 'Norte', 'Sur'];
  const tipos: ('perro' | 'gato')[] = ['perro', 'gato'];
  const urgencias: ('baja' | 'media' | 'alta')[] = ['baja', 'media', 'alta'];

  // Nombres específicos por tipo de mascota
  const nombresPerros = ['Max', 'Luna', 'Rocky', 'Bella', 'Charlie', 'Mia'];
  const nombresGatos = ['Whiskers', 'Matilda', 'Simba', 'Nala', 'Felix', 'Cleo'];

  // Tipos de sangre médicamente correctos por especie
  const tiposSangrePerro = ['DEA 1.1+', 'DEA 1.1-', 'DEA 3+', 'DEA 4+', 'DEA 7+'];
  const tiposSangreGato = ['Tipo A', 'Tipo B', 'Tipo AB'];

  // Descripciones
  const descripcionesPerros = [
    'Max sufrió un accidente automovilístico cuando se escapó de casa durante una tormenta. Las heridas internas requieren una cirugía de emergencia y necesita una transfusión urgente para estabilizar su condición.',
    'Rocky fue atacado por otro animal mientras paseaba en el parque. Perdió mucha sangre y los veterinarios necesitan donantes compatibles para salvar su vida.',
    'Charlie está programado para una cirugía compleja de tumor. Los médicos requieren sangre disponible durante el procedimiento para cualquier complicación que pueda surgir.',
    'Bella necesita una transfusión después de una cirugía de emergencia por obstrucción intestinal. Su recuperación depende de encontrar un donante compatible rápidamente.'
  ];

  const descripcionesGatos = [
    'Matilda sufrió un accidente cuando se encontraba fuera de su casa explorando el vecindario. Las heridas graves requieren múltiples cirugías y necesita donación de sangre urgente.',
    'Whiskers fue encontrado en estado crítico tras un accidente. Los veterinarios luchan por estabilizarlo y necesitan sangre compatible para continuar el tratamiento.',
    'Simba requiere una cirugía programada para remover un tumor. El procedimiento es delicado y necesitamos tener sangre disponible para cualquier emergencia durante la operación.',
    'Nala está en cuidados intensivos después de una intoxicación severa. Su sistema necesita apoyo y una transfusión podría ser crucial para su recuperación.'
  ];

  // Generar 8 solicitudes por página con datos aleatorios pero coherentes
  return Array.from({ length: 8 }, (_, i) => {
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const nombres = tipo === 'perro' ? nombresPerros : nombresGatos;
    const tiposSangre = tipo === 'perro' ? tiposSangrePerro : tiposSangreGato;
    const descripciones = tipo === 'perro' ? descripcionesPerros : descripcionesGatos;

    return {
      // ID único basado en página e índice
      id: page * 8 + i + 1,
      tipoMascota: tipo,
      nombreMascota: nombres[Math.floor(Math.random() * nombres.length)],
      tipoSangre: tiposSangre[Math.floor(Math.random() * tiposSangre.length)],
      veterinaria: veterinarias[Math.floor(Math.random() * veterinarias.length)],
      ubicacion: ubicaciones[Math.floor(Math.random() * ubicaciones.length)],
      urgencia: urgencias[Math.floor(Math.random() * urgencias.length)],
      descripcion: descripciones[Math.floor(Math.random() * descripciones.length)],
      // Fecha aleatoria en los últimos 7 días
      fechaCreacion: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      estado: 'pendiente'
    };
  });
};

/**
 * Página principal que muestra el feed de solicitudes activas
 * Implementa scroll infinito y manejo de estados de carga
 */
const SolicitudesActivas: React.FC = () => {
  // Estados para manejo de datos y UI
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]); // Lista de solicitudes
  const [loading, setLoading] = useState<boolean>(false); // Estado de carga
  const [error, setError] = useState<string>(''); // Mensajes de error
  const [page, setPage] = useState<number>(0); // Página actual para paginación
  const [hasMore, setHasMore] = useState<boolean>(true); // Indica si hay más datos

  /**
   * Función para cargar solicitudes
   * Usa useCallback para evitar re-renderizados innecesarios
   */
  const fetchSolicitudes = useCallback(async () => {
    // Evitar múltiples llamadas simultáneas o cuando no hay más datos
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      // Simular demora de red (en producción sería una llamada real a API)
      await new Promise(resolve => setTimeout(resolve, 800));
      const nuevasSolicitudes = generarSolicitudesMock(page);

      // Simular fin de datos después de 4 páginas
      if (page >= 4) {
        setHasMore(false);
        return;
      }

      // Agregar nuevas solicitudes al estado existente
      setSolicitudes(prev => [...prev, ...nuevasSolicitudes]);
      setPage(prev => prev + 1);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Manejo de errores
      setError('Error al cargar las solicitudes');
    } finally {
      // Siempre limpiar el estado de loading
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // Cargar datos iniciales al montar el componente
  useEffect(() => {
    fetchSolicitudes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Activar scroll infinito
  useInfiniteScroll(fetchSolicitudes);

  // Renderizado condicional para errores
  if (error) return <ErrorMessage message={error} />;

  return (
      <>
        {/* Header sticky */}
        <Header />

        {/* Contenido principal */}
        <main className="container">
          <section className="page-content">

            {/* Header del contenido */}
            <div className="content-header">
              <h2 className="section-title">Solicitudes Activas</h2>
              <p className="section-subtitle">Encuentra donantes para tu mascota</p>
            </div>

            {/* Grid responsive de solicitudes */}
            <div className="solicitudes-grid" aria-label="Lista de solicitudes activas">
              {solicitudes.map((solicitud) => (
                  <CardSolicitud key={solicitud.id} solicitud={solicitud} />
              ))}
            </div>

            {/* Indicadores de estado */}
            {loading && <LoadingSpinner />}
            {!hasMore && solicitudes.length > 0 && (
                <p className="no-more-results" role="status">
                  No hay más solicitudes disponibles
                </p>
            )}
          </section>
        </main>
      </>
  );
};

export default SolicitudesActivas;