import React from 'react';

// Interfaz que define la estructura de una solicitud de donación
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

// Props que recibe el componente CardSolicitud
interface CardSolicitudProps {
    solicitud: Solicitud;
}

/**
 * Función que retorna las clases CSS según el nivel de urgencia
 * @param urgencia - Nivel de urgencia de la solicitud
 * @returns String con las clases CSS apropiadas
 */
const getUrgenciaColor = (urgencia: string): string => {
    switch (urgencia) {
        case 'alta': return 'text-red-700 bg-red-100';
        case 'media': return 'text-orange-700 bg-orange-100';
        case 'baja': return 'text-green-700 bg-green-100';
        default: return 'text-gray-700 bg-gray-100';
    }
};

/**
 * Función que retorna el emoji apropiado según el tipo de mascota
 * @param tipo - Tipo de mascota ('perro' o 'gato')
 * @returns Emoji representativo
 */
const getMascotaIcon = (tipo: string): string => {
    return tipo === 'perro' ? '🐕' : '🐱';
};

/**
 * Componente CardSolicitud
 * Muestra la información de una solicitud de donación de sangre
 * en formato de tarjeta responsive
 */
const CardSolicitud: React.FC<CardSolicitudProps> = ({ solicitud }) => {
    return (
        // Article semántico con roles de accesibilidad
        <article className="card" role="article" aria-labelledby={`solicitud-${solicitud.id}`}>

            {/* Header de la card con info básica y urgencia */}
            <header className="card-header">
                <div className="pet-info">
                    {/* Emoji de la mascota con label accesible */}
                    <span className="pet-icon" role="img" aria-label={`Icono de ${solicitud.tipoMascota}`}>
            {getMascotaIcon(solicitud.tipoMascota)}
          </span>

                    {/* Detalles básicos de la mascota */}
                    <div className="pet-details">
                        <h3 id={`solicitud-${solicitud.id}`} className="pet-name">
                            {solicitud.nombreMascota}
                        </h3>
                        <p className="pet-type">{solicitud.tipoMascota}</p>
                    </div>
                </div>

                {/* Badge de urgencia con colores dinámicos */}
                <span
                    className={`urgency-badge ${getUrgenciaColor(solicitud.urgencia)}`}
                    aria-label={`Urgencia ${solicitud.urgencia}`}
                >
          {solicitud.urgencia}
        </span>
            </header>

            {/* Contenido principal de la card */}
            <div className="card-content">

                {/* Grid con información médica y ubicación */}
                <div className="info-grid">
                    {/* Tipo de sangre destacado */}
                    <div className="info-item">
                        <span className="info-label">Tipo de sangre:</span>
                        <span className="blood-type">{solicitud.tipoSangre}</span>
                    </div>

                    {/* Veterinaria donde se encuentra */}
                    <div className="info-item">
                        <span className="info-label">Veterinaria:</span>
                        <span className="info-value">{solicitud.veterinaria}</span>
                    </div>

                    {/* Ubicación geográfica */}
                    <div className="info-item">
                        <span className="info-label">Ubicación:</span>
                        <span className="info-value">{solicitud.ubicacion}</span>
                    </div>
                </div>

                {/* Descripción detallada del caso */}
                <p className="description">
                    {solicitud.descripcion}
                </p>

                {/* Fecha de creación con formato semántico */}
                <time className="date" dateTime={solicitud.fechaCreacion}>
                    {solicitud.fechaCreacion}
                </time>
            </div>

            {/* Botón de acción principal para ver los detalles*/}
            <button
                className="btn-primary"
                aria-label={`Ver detalles de solicitud para ${solicitud.nombreMascota} en ${solicitud.veterinaria}`}
            >
                Ver detalles
            </button>
        </article>
    );
};

export default CardSolicitud;