
import React from 'react';
import logo from '../assets/logo_petmatch.png';

/**
 * Componente Header de la aplicación
 * Muestra el logo, nombre de la app y navegación principal
 * Es sticky y responsive para todas las resoluciones
 */
const Header: React.FC = () => {
    return (
        // Header principal con rol banner para accesibilidad
        <header className="app-header" role="banner">
            <div className="header-container">
                {/* Sección izquierda: Logo y branding */}
                <div className="logo-section">
                    {/* Logo de la aplicación con alt descriptivo */}
                    <img
                        src={logo}
                        alt="Pet Match - Conectamos mascotas con donantes"
                        className="logo"
                    />

                    {/* Texto del branding */}
                    <div className="logo-text">
                        <h1 className="app-name">Pet Match</h1>
                        <p className="app-tagline">Conectando vidas</p>
                    </div>
                </div>

                {/* Sección derecha: Navegación */}
                <nav className="nav-section" role="navigation" aria-label="Navegación principal">
                    {/* Botón de menú hamburguesa para futuras funcionalidades */}
                    <button
                        className="nav-button"
                        aria-label="Menú de navegación"
                    >
                        <span className="hamburger-icon">☰</span>
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;