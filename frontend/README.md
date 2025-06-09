# Documentación Frontend PetMatch

## Estructura General

La aplicación está construida con React y utiliza varias bibliotecas modernas para la UI y gestión de estado.

## Páginas Principales

### HomePage (`HomePage.jsx`)
- Página de inicio de la aplicación
- Actualmente en construcción, muestra un mensaje simple con el título de PetMatch

### ClinicHome (`ClinicHome.jsx`)
- Dashboard para clínicas veterinarias
- Muestra estadísticas importantes:
  * Solicitudes activas
  * Donantes coincidentes
  * Casos urgentes
- Permite crear nuevas solicitudes de sangre
- Incluye un feed de solicitudes recientes

### RequestsPage (`RequestsPage.jsx`)
- Gestión de solicitudes de sangre
- Características:
  * Filtrado por especie, tipo de sangre, urgencia y ubicación
  * Vista en tabs para diferentes estados de solicitudes
  * Creación de nuevas solicitudes
  * Búsqueda y ordenamiento

### PublicRequestsFeed (`PublicRequestsFeed.jsx`)
- Feed público de solicitudes de donación
- Incluye:
  * Filtros avanzados
  * Sistema de búsqueda
  * Vista de cards con detalles de cada solicitud

### RequestDetailPage (`RequestDetailPage.jsx`)
- Vista detallada de una solicitud específica
- Funcionalidades:
  * Edición de solicitudes
  * Cambio de estado
  * Visualización de donantes coincidentes
  * Información detallada de la solicitud

## Componentes Principales

### NavBar (`NavBar.jsx`)
- Barra de navegación principal
- Manejo de autenticación
- Menú de navegación responsive
- Diferentes opciones según tipo de usuario (clínica/propietario)

### BloodRequestForm (`BloodRequestForm.jsx`)
- Formulario para crear solicitudes de sangre
- Campos:
  * Especie (perro/gato)
  * Tipo de sangre
  * Nivel de urgencia
  * Ubicación
  * Detalles adicionales

### DonationApplicationForm (`DonationApplicationForm.jsx`)
- Formulario para postularse como donante
- Recoge información sobre:
  * Datos de la mascota
  * Historial médico
  * Información de contacto del propietario
  * Disponibilidad

### FiltersPanel y AdvancedFilters (`FiltersPanel.jsx`, `AdvancedFilters.jsx`)
- Sistema de filtrado avanzado
- Filtros disponibles:
  * Especie
  * Tipo de sangre
  * Ubicación
  * Nivel de urgencia

### RequestApplications (`RequestApplications.jsx`)
- Gestión de postulaciones para una solicitud
- Funcionalidades:
  * Lista de aplicaciones
  * Estado de cada aplicación
  * Información detallada de donantes
  * Acciones de aprobación/rechazo

## Contexto Global

### AppContext (`AppContext.jsx`)
- Manejo del estado global de la aplicación
- Gestiona:
  * Autenticación de usuario
  * Tipo de usuario (clínica/propietario)
  * Estado de navegación

## Tipos de Usuarios

1. **Clínicas Veterinarias**
   - Pueden crear y gestionar solicitudes de sangre
   - Ver aplicaciones de donantes
   - Gestionar el estado de las solicitudes

2. **Propietarios de Mascotas**
   - Pueden ver el feed público de solicitudes
   - Aplicar como donantes
   - Seguir el estado de sus aplicaciones

## Constantes y Configuraciones

- Tipos de sangre específicos para perros y gatos
- Niveles de urgencia (alta/media)
- Localidades de Bogotá
- Estados de solicitudes y aplicaciones
