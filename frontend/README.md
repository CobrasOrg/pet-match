# 🩸 PetMatch Frontend - Sistema de Donación de Sangre para Mascotas

## 📋 Estructura General

La aplicación está construida con **React + Vite** y utiliza bibliotecas modernas para UI, gestión de estado y autenticación. PetMatch conecta clínicas veterinarias con dueños de mascotas para facilitar donaciones de sangre de emergencia.

## 🚀 Estado del Proyecto

- **Frontend**: ✅ Completamente funcional
- **Backend**: 🔄 En integración (actualmente en modo simulado)
- **Documentación**: ✅ Completa (ver `BACKEND_INTEGRATION.md`)

## 🏠 Páginas Principales

### 📑 Índice de Páginas

- **Páginas Principales**: [HomePage](#homepage-homepagejsx) | [RequestsPage](#requestspage-requestspagejsx) | [RequestDetailPage](#requestdetailpage-requestdetailpagejsx)
- **Gestión de Usuario**: [MyPetsPage](#mypetspage-mypetspagejsx) | [ProfilePage](#profilepage-profilepagejsx)
- **Donaciones**: [PublicRequestsPage](#publicrequestspage-publicrequestspagejsx) | [DonationApplicationPage](#donationapplicationpage-donationapplicationpagejsx) | [DonationSelectionPage](#donationselectionpage-donationselectionpagejsx)
- **Gestión de Solicitudes**: [RequestApplicationsPage](#requestapplicationspage-requestapplicationspagejsx)
- **Autenticación**: [LoginPage](#loginpage-authloginpagejsx) | [RegisterPage](#registerpage-authregisterpagejsx) | [ForgotPasswordPage](#forgotpasswordpage-authforgotpasswordpagejsx) | [ResetPasswordPage](#resetpasswordpage-authresetpasswordpagejsx)

---

### HomePage (`HomePage.jsx`)

- Página de inicio de la aplicación
- **Recomendación**: Implementar animaciones Lottie relacionadas con la causa:
  - Animaciones de corazón (representando donaciones que salvan vidas)
  - Gotas de sangre animadas
  - Veterinarios con mascotas
  - Huellas de patas con motivos de corazón

### RequestsPage (`RequestsPage.jsx`)

- Gestión de solicitudes de sangre
- Características:
  - Filtrado por especie, tipo de sangre, urgencia y ubicación
  - Vista en tabs para diferentes estados de solicitudes
  - Creación de nuevas solicitudes
  - Búsqueda y ordenamiento

### RequestDetailPage (`RequestDetailPage.jsx`)

- Vista detallada de una solicitud específica
- **✨ Funcionalidades mejoradas**:
  - Edición de solicitudes con **permisos basados en roles**
  - **Restricción para clínicas**: No pueden editar el campo "especie"
  - **Acceso completo**: Las clínicas pueden editar "tipo de sangre"
  - **Panel de contacto**: Oculto automáticamente para clínicas
  - Cambio de estado de solicitudes
  - Visualización de donantes coincidentes
  - Contador de postulaciones en tiempo real
  - Información detallada con UX optimizada por tipo de usuario

### MyPetsPage (`MyPetsPage.jsx`)

- Gestión completa de mascotas del usuario
- Funcionalidades:
  - Lista de mascotas registradas
  - Agregar nuevas mascotas
  - Editar información de mascotas existentes
  - Eliminar mascotas (con confirmación)
  - Formulario de registro integrado

### ProfilePage (`ProfilePage.jsx`)

- Página de perfil del usuario
- Permite editar:
  - Información personal
  - Datos de contacto
  - Configuraciones de cuenta
  - Gestión de preferencias

### PublicRequestsPage (`PublicRequestsPage.jsx`)

- Feed público principal de solicitudes de donación
- Características:
  - Vista de todas las solicitudes activas
  - Sistema de filtrado avanzado
  - Búsqueda por múltiples criterios
  - Acceso público para todos los usuarios

### DonationApplicationPage (`DonationApplicationPage.jsx`)

- Página para postularse como donante a una solicitud específica
- Incluye:
  - Formulario completo de postulación
  - Selección de mascota donante
  - Información médica requerida
  - Datos de contacto y disponibilidad

### DonationSelectionPage (`DonationSelectionPage.jsx`)

- Página de selección de tipo de donación
- Funcionalidades:
  - Diferentes tipos de donación disponibles
  - Información sobre cada tipo
  - Redirección a formularios específicos

### RequestApplicationsPage (`RequestApplicationsPage.jsx`)

- Gestión de postulaciones para solicitudes (vista de clínica)
- Características:
  - Lista completa de postulaciones recibidas
  - Filtrado por estado de postulación
  - Detalles de cada donante
  - Acciones de aprobación/rechazo
  - Comunicación con donantes

### PetConnectionDemo (`PetConnectionDemo.jsx`)

- Página de demostración/ejemplo
- Muestra conexiones entre mascotas
- Funcionalidad de prueba para desarrollo

## 🔐 Páginas de Autenticación

### LoginPage (`auth/LoginPage.jsx`)

- Página de inicio de sesión
- Soporte para ambos tipos de usuario:
  - Propietarios de mascotas
  - Clínicas veterinarias
- Validación de credenciales
- Redirección automática según tipo de usuario

### RegisterPage (`auth/RegisterPage.jsx`)

- Página de registro principal
- Opciones de registro:
  - Registro como propietario de mascota
  - Registro como clínica veterinaria
- Formularios diferenciados por tipo de usuario
- Validación de datos en tiempo real

### ForgotPasswordPage (`auth/ForgotPasswordPage.jsx`)

- Recuperación de contraseña
- Envío de email de recuperación
- Validación de email existente
- Redirección a reset de contraseña

### ResetPasswordPage (`auth/ResetPasswordPage.jsx`)

- Restablecimiento de contraseña
- Validación de token de recuperación
- Establecimiento de nueva contraseña
- Confirmación de contraseña

## 🧩 Componentes Principales

### NavBar (`NavBar.jsx`)

- Barra de navegación principal
- **Sistema de autenticación robusto**
- Menú de navegación responsive
- **Diferentes opciones según tipo de usuario** (clínica/propietario)
- Integración con contexto de autenticación

### BloodRequestForm (`BloodRequestForm.jsx`)

- Formulario para crear solicitudes de sangre
- Campos:
  - Especie (perro/gato)
  - Tipo de sangre
  - Nivel de urgencia
  - Ubicación
  - Detalles adicionales

### DonationApplicationForm (`DonationApplicationForm.jsx`)

- Formulario para postularse como donante
- Recoge información sobre:
  - Datos de la mascota
  - Historial médico
  - Información de contacto del propietario
  - Disponibilidad

### FiltersPanel y AdvancedFilters (`FiltersPanel.jsx`, `AdvancedFilters.jsx`)

- Sistema de filtrado avanzado
- Filtros disponibles:
  - Especie
  - Tipo de sangre
  - Ubicación
  - Nivel de urgencia

### RequestApplications (`RequestApplications.jsx`)

- Gestión de postulaciones para una solicitud
- Funcionalidades:
  - Lista de aplicaciones
  - Estado de cada aplicación
  - Información detallada de donantes
  - Acciones de aprobación/rechazo

## 🌐 Contexto Global

### AuthContext (`AuthContext.jsx`)

- **Sistema de autenticación centralizado**
- Gestión de tokens y sesiones
- Determinación de tipos de usuario (clinic/owner)
- Estados de autenticación globales

### AppContext (`AppContext.jsx`)

- Manejo del estado global de la aplicación
- Gestiona:
  - Estado de navegación
  - Configuraciones globales
  - Estados compartidos entre componentes

### NotificationContext (`NotificationContext.jsx`)

- Sistema de notificaciones unificado
- Gestión de alertas y mensajes
- Feedback visual para acciones del usuario

## 👥 Tipos de Usuarios y Permisos

### 1. **Clínicas Veterinarias** 🏥

- ✅ Crear y gestionar solicitudes de sangre
- ✅ Ver aplicaciones de donantes
- ✅ Gestionar el estado de las solicitudes

### 2. **Propietarios de Mascotas** 🐾

- ✅ Ver el feed público de solicitudes
- ✅ Aplicar como donantes
- ✅ Seguir el estado de sus aplicaciones
- ✅ Gestionar perfiles de mascotas

## ⚙️ Constantes y Configuraciones

### Archivos de Configuración

- **Tipos de sangre**: Específicos para perros y gatos (`src/constants/bloodTypes.jsx`)
- **Especies**: Canino/Felino (`src/constants/species.jsx`)
- **Niveles de urgencia**: Alta/Media/Baja (`src/constants/status.jsx`)
- **Localidades**: Bogotá y municipios (`src/constants/locations.jsx`)
- **Estados**: Solicitudes y aplicaciones (`src/constants/status.jsx`)

### Datos Mock (Desarrollo)

- **Mock Users**: Usuarios de prueba (`src/constants/mockUsers.jsx`)
- **Mock Requests**: Solicitudes de ejemplo (`src/constants/mockRequests.jsx`)
- **Mock Applications**: Aplicaciones simuladas (`src/constants/mockApplications.jsx`)

## 🔧 Herramientas de Desarrollo

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilación para producción
npm run preview      # Vista previa de la build
npm run lint         # Análisis de código
```

### Estructura de Archivos Importantes

```
src/
├── components/      # Componentes reutilizables
│   ├── ui/         # Componentes de UI base
│   └── auth/       # Componentes de autenticación
├── pages/          # Páginas principales
├── context/        # Contextos de React
├── hooks/          # Hooks personalizados
├── constants/      # Constantes y configuraciones
└── lib/           # Utilidades y helpers
```

## 📚 Documentación Adicional

- **📖 Integración Backend**: Ver `BACKEND_INTEGRATION.md` para guía completa de APIs
- **🔄 Simplificación de Contacto**: Ver `CONTACT_SIMPLIFICATION.md`
- **💰 Integración de Donaciones**: Ver `DONATION_INTEGRATION.md`

## 🚀 Próximos Pasos

1. **Integración Backend**: Reemplazar datos mock con APIs reales
2. **Animaciones Homepage**: Implementar Lottie animations sugeridas
3. **Testing**: Agregar tests unitarios y de integración
4. **PWA**: Configurar como Progressive Web App
5. **Optimización**: Code splitting y lazy loading
6. **Dashboard Clínicas**: Crear página específica de dashboard para clínicas (ClinicHome)
7. **Componente Feed**: Desarrollar componente PublicRequestsFeed reutilizable

## 📋 Archivos Activos vs No Utilizados

### ✅ Archivos Principales en Uso

- Todos los archivos en `src/pages/`
- Todos los componentes en `src/components/` (excepto los marcados como "en_desuso")
- Contextos y hooks personalizados
- Archivos de constantes y utilidades

### ⚠️ Archivos Posiblemente No Utilizados

- `DonationApplicationForm(en_desuso).jsx` - Marcado como obsoleto
- Algunos archivos en `src/assets/` pueden no estar en uso activo

_Para identificar archivos no utilizados, usa "Find All References" en VS Code o herramientas como `depcheck`._
