## 🩸 PetMatch - Documentación Completa de Integración Backend

## 📋 Tabla de Contenidos

- [Información General](#información-general)
- [Estructura de Datos](#estructura-de-datos)
- [APIs de Autenticación](#apis-de-autenticación)
- [APIs de Usuario](#apis-de-usuario)
- [APIs de Mascotas](#apis-de-mascotas)
- [APIs de Solicitudes](#apis-de-solicitudes)
- [APIs de Postulaciones](#apis-de-postulaciones)
- [Constantes y Enums](#constantes-y-enums)

---

## 🎯 Información General

**Aplicación:** Sistema de donación de sangre para mascotas
**Frontend:** React + Vite
**Backend esperado:** REST API
**Base URL:** `http://localhost:8000/api/v1`
**URL Postulaciones:** `http://localhost:8001/base/api`

### Tipos de Usuario

- **owner**: Dueño de mascota
- **clinic**: Clínica veterinaria

---

## 📊 Estructura de Datos

### Usuario (Base)

```json
{
  "id": "string|number",
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "userType": "owner|clinic",
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

### Usuario Clínica (Extendido)

```json
{
  ...Usuario,
  "userType": "clinic",
  "locality": "string", // Localidad de Bogotá
  "clinicName": "string" // Nombre de la clínica
}
```

### Mascota

```json
{
  "id": "string|number",
  "petName": "string",
  "species": "canine|feline",
  "breed": "string",
  "age": "number", // en años
  "weight": "number", // en kg
  "bloodType": "string", // DEA 1.1+, DEA 1.1-, A, B, AB
  "lastVaccination": "string (ISO date)",
  "healthStatus": "string",
  "petPhoto": "string|null", // URL o Base64
  "ownerId": "string|number",
  "registeredAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

### Solicitud de Donación

```json
{
  "id": "string|number",
  "especie": "Perro|Gato",
  "tipo_sangre": "string",
  "urgencia": "Alta|Media",
  "descripcion_solicitud": "string",
  "direccion": "string",
  "contacto": "string",
  "peso_minimo": "number",
  "estado": "Activa|Revision|Completada|Cancelada",
  "fecha_creacion": "string (ISO date)",
  "localidad": "string",
  "nombre_veterinaria": "string",
  "foto_mascota": "string|null",
  "clinicaId": "string|number"
}
```

### Postulación

```json
{
  "id": "string|number",
  "solicitudId": "string|number",
  "mascotaId": "string|number",
  "ownerId": "string|number",
  "status": "pending|approved|rejected",
  "petName": "string",
  "ownerName": "string",
  "ownerPhone": "string",
  "ownerEmail": "string",
  "species": "canine|feline",
  "breed": "string",
  "age": "number",
  "weight": "number",
  "bloodType": "string",
  "lastVaccination": "string (ISO date)",
  "healthStatus": "string",
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

---

## 🔐 APIs de Autenticación

### POST `/auth/login`

**Descripción:** Inicio de sesión de usuario

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "user": {
    "id": "string|number",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "userType": "owner|clinic",
    "locality": "string" // Solo para clinic
  },
  "token": "string"
}
```

**Response Error (401):**

```json
{
  "success": false,
  "message": "Credenciales incorrectas"
}
```

**Usuarios de prueba actuales:**

```json
[
  { "email": "juan@example.com", "password": "Password123", "type": "owner" },
  {
    "email": "veterinaria@sanpatricio.com",
    "password": "Clinic123",
    "type": "clinic"
  },
  { "email": "admin@petmatch.com", "password": "Admin123", "type": "owner" }
]
```

### POST `/auth/register/owner`

**Descripción:** Registro de dueño de mascota

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "password": "string"
}
```

**Response Success (201):**

```json
{
  "success": true,
  "user": {
    "id": "string|number",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "userType": "owner"
  },
  "token": "string"
}
```

### POST `/auth/register/clinic`

**Descripción:** Registro de clínica veterinaria

**Request Body:**

```json
{
  "name": "string", // Nombre de la clínica
  "email": "string",
  "phone": "string",
  "address": "string",
  "locality": "string", // Localidad de Bogotá
  "password": "string"
}
```

**Response Success (201):**

```json
{
  "success": true,
  "user": {
    "id": "string|number",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "locality": "string",
    "userType": "clinic"
  },
  "token": "string"
}
```

### POST `/auth/forgot-password`

**Descripción:** Solicitar recuperación de contraseña

**Request Body:**

```json
{
  "email": "string"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Correo de recuperación enviado"
}
```

### POST `/auth/reset-password`

**Descripción:** Restablecer contraseña con token

**Request Body:**

```json
{
  "token": "string",
  "Password": "string", // Contraseña actual
  "newPassword": "string"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente"
}
```

**Tokens válidos para testing:**

- `token123`
- `reset456`
- `recovery789`

---

## 👤 APIs de Usuario

### GET `/user/profile`

**Descripción:** Obtener perfil del usuario autenticado
**Headers:** `Authorization: Bearer {token}`

**Response Success (200):**

```json
{
  "id": "string|number",
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "userType": "owner|clinic",
  "locality": "string", // Solo para clinic
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

### PATCH `/user/profile`

**Descripción:** Actualizar perfil del usuario
**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "locality": "string" // Solo para clinic
}
```

**Response Success (200):**

```json
{
  "id": "string|number",
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "userType": "owner|clinic",
  "locality": "string", // Solo para clinic
  "updatedAt": "string (ISO date)"
}
```

### PUT `/auth/change-password`

**Descripción:** Cambiar contraseña del usuario autenticado
**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

**Response Success (200):**

```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente"
}
```

**Response Error (400):**

```json
{
  "success": false,
  "message": "La contraseña actual es incorrecta"
}
```

**Response Error (422):**

```json
{
  "success": false,
  "message": "Error de validación",
  "errors": {
    "newPassword": ["La contraseña debe tener al menos 8 caracteres"],
    "confirmPassword": ["Las contraseñas no coinciden"]
  }
}
```

### DELETE `/user/account`

**Descripción:** Eliminar cuenta del usuario
**Headers:** `Authorization: Bearer {token}`

**Response Success (204):** Sin contenido

---

## 🐾 APIs de Mascotas

### GET `/owner/pets`

**Descripción:** Obtener mascotas del dueño autenticado
**Headers:** `Authorization: Bearer {token}`

**Response Success (200):**

```json
[
  {
    "id": "string|number",
    "petName": "string",
    "species": "canine|feline",
    "breed": "string",
    "age": "number",
    "weight": "number",
    "bloodType": "string",
    "lastVaccination": "string (ISO date)",
    "healthStatus": "string",
    "petPhoto": "string|null",
    "registeredAt": "string (ISO date)",
    "updatedAt": "string (ISO date)"
  }
]
```

### POST `/owner/pets`

**Descripción:** Registrar nueva mascota
**Headers:** `Authorization: Bearer {token}`
**Content-Type:** `multipart/form-data`

**Request Body (FormData):**

```javascript
formData.append("petName", "string");
formData.append("species", "canine|feline");
formData.append("breed", "string");
formData.append("age", "number");
formData.append("weight", "number");
formData.append("bloodType", "string");
formData.append("lastVaccination", "YYYY-MM-DD");
formData.append("healthStatus", "string");
formData.append("petPhoto", File); // Archivo de imagen
```

**Response Success (201):**

```json
{
  "id": "string|number",
  "petName": "string",
  "species": "canine|feline",
  "breed": "string",
  "age": "number",
  "weight": "number",
  "bloodType": "string",
  "lastVaccination": "string (ISO date)",
  "healthStatus": "string",
  "petPhoto": "string|null",
  "ownerId": "string|number",
  "registeredAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

### PUT `/owner/pets/{petId}`

**Descripción:** Actualizar información de mascota
**Headers:** `Authorization: Bearer {token}`
**Content-Type:** `multipart/form-data`

**Request Body:** Mismos campos que POST (opcionales)

**Response Success (200):** Mascota actualizada

### DELETE `/owner/pets/{petId}`

**Descripción:** Eliminar mascota
**Headers:** `Authorization: Bearer {token}`

**Response Success (204):** Sin contenido

---

## 🩸 APIs de Solicitudes

### GET `/vet/solicitudes`

**Descripción:** Obtener solicitudes de la clínica autenticada
**Headers:** `Authorization: Bearer {token}`
**Query Parameters:**

- `page`: number (opcional)
- `limit`: number (opcional)
- `estado`: string (opcional) - Activa|Revision|Completada|Cancelada
- `especie`: string (opcional) - Perro|Gato
- `urgencia`: string (opcional) - Alta|Media
- `search`: string (opcional) - Búsqueda por texto

**Response Success (200):**

```json
{
  "solicitudes": [
    {
      "id": "string|number",
      "especie": "Perro|Gato",
      "tipo_sangre": "string",
      "urgencia": "Alta|Media",
      "descripcion_solicitud": "string",
      "peso_minimo": "number",
      "estado": "Activa|Revision|Completada|Cancelada",
      "fecha_creacion": "string (ISO date)",
      "foto_mascota": "string|null"
    }
  ]
}
```

### GET `/vet/solicitudes/{id}`

**Descripción:** Obtener solicitud específica
**Headers:** `Authorization: Bearer {token}`

**Response Success (200):**

```json
{
  "id": "string|number",
  "nombre": "Nombre_Mascota",
  "especie": "Perro|Gato",
  "tipo_sangre": "string",
  "urgencia": "Alta|Media",
  "descripcion_solicitud": "string",
  "peso_minimo": "number",
  "estado": "Activa|Revision|Completada|Cancelada",
  "fecha_creacion": "string (ISO date)",
  "foto_mascota": "string|null"
}
```

### POST `/vet/solicitudes`

**Descripción:** Crear nueva solicitud de donación
**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "nombre": "Nombre_Mascota",
  "especie": "Perro|Gato",
  "tipo_sangre": "string",
  "urgencia": "Alta|Media",
  "descripcion_solicitud": "string",
  "peso_minimo": "number",
  "foto_mascota": "string|null" // Base64 o URL
}
```

**Response Success (201):**

```json
{
  "id": "string|number",
  "nombre": "Nombre_Mascota",
  "especie": "Perro|Gato",
  "tipo_sangre": "string",
  "urgencia": "Alta|Media",
  "descripcion_solicitud": "string",
  "direccion": "string", // Tomado del perfil de la clínica
  "contacto": "string", // Tomado del perfil de la clínica
  "peso_minimo": "number",
  "estado": "Activa",
  "fecha_creacion": "string (ISO date)",
  "localidad": "string", // Tomado del perfil de la clínica
  "nombre_veterinaria": "string", // Tomado del perfil de la clínica
  "foto_mascota": "string|null"
}
```

### PATCH `/vet/solicitudes/{id}`

**Descripción:** Actualizar solicitud existente
**Headers:** `Authorization: Bearer {token}`

**Request Body:** (campos opcionales)

```json
{
  "nombre": "Nombre_Mascota",
  "tipo_sangre": "string",
  "urgencia": "Alta|Media",
  "descripcion_solicitud": "string",
  "direccion": "string",
  "peso_minimo": "number"
}
```

**Response Success (200):** Solicitud actualizada

**⚠️ Nota:** Los campos `especie` están restringidos para edición según la lógica del frontend.

### PATCH `/vet/solicitudes/{id}/estado`

**Descripción:** Cambiar estado de solicitud
**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
  "estado": "Activa|Revision|Completada|Cancelada"
}
```

**Response Success (200):** Estado actualizado

### DELETE `/vet/solicitudes/{id}`

**Descripción:** Eliminar solicitud
**Headers:** `Authorization: Bearer {token}`

**Response Success (204):** Sin contenido

### GET `/public/solicitudes` o `/user/solicitudes/activas/filtrar`

**Descripción:** Obtener solicitudes públicas para dueños de mascotas
**Query Parameters:**

- `page`: number (opcional)
- `limit`: number (opcional)
- `localidad`: string (opcional)
- `especie`: string (opcional) - Perro|Gato
- `tipo_sangre`: string (opcional)
- `urgencia`: string (opcional) - Alta|Media
- `search`: string (opcional)

**Response Success (200):**

```json
{
  "solicitudes": [
    {
      "id": "string|number",
      "nombre_mascota": "string", // Nombre de la mascota que necesita donación
      "especie": "Perro|Gato",
      "tipo_sangre": "string",
      "urgencia": "Alta|Media",
      "descripcion_solicitud": "string",
      "direccion_veterinaria": "string",
      "contacto_veterinaria": "string",
      "peso_minimo": "number",
      "fecha_creacion": "string (ISO date)",
      "localidad_veterinaria": "string",
      "nombre_veterinaria": "string",
      "foto_mascota": "string|null"
    }
  ]
}
```

---

## 📝 APIs de Postulaciones

### GET `/solicitudes/{solicitudId}/postulaciones`

**Descripción:** Obtener postulaciones para una solicitud específica
**Headers:** `Authorization: Bearer {token}`
**Base URL:** `http://localhost:8001/base/api`

**Response Success (200):**

```json
[
  {
    "id": "string|number",
    "petName": "string",
    "ownerName": "string",
    "ownerPhone": "string",
    "ownerEmail": "string",
    "species": "canine|feline",
    "breed": "string",
    "age": "number",
    "weight": "number",
    "bloodType": "string",
    "status": "pending|approved|rejected",
    "createdAt": "string (ISO date)"
  }
]
```

### GET `/solicitudes/{solicitudId}/postulaciones/{postulacionId}`

**Descripción:** Obtener detalles de una postulación específica
**Headers:** `Authorization: Bearer {token}`
**Base URL:** `http://localhost:8001/base/api`

**Response Success (200):**

```json
{
  "id": "string|number",
  "solicitudId": "string|number",
  "mascotaId": "string|number",
  "ownerId": "string|number",
  "status": "pending|approved|rejected",
  "petName": "string",
  "ownerName": "string",
  "ownerPhone": "string",
  "ownerEmail": "string",
  "ownerAddress": "string",
  "species": "canine|feline",
  "breed": "string",
  "age": "number",
  "weight": "number",
  "bloodType": "string",
  "lastVaccination": "string (ISO date)",
  "healthStatus": "string",
  "applicationDate": "string (ISO date)",
  "createdAt": "string (ISO date)"
}
```

### PATCH `/solicitudes/{solicitudId}/postulaciones/{postulacionId}/status`

**Descripción:** Actualizar estado de postulación
**Headers:** `Authorization: Bearer {token}`
**Base URL:** `http://localhost:8001/base/api`

**Request Body:**

```json
{
  "status": "approved|rejected"
}
```

**Response Success (200):**

```json
{
  "id": "string|number",
  "status": "approved|rejected",
  "updatedAt": "string (ISO date)"
}
```

### POST `/solicitudes/{solicitudId}/postulaciones`

**Descripción:** Postular mascota a una solicitud
**Headers:** `Authorization: Bearer {token}`
**Base URL:** `http://localhost:8001/base/api`

**Request Body:**

```json
{
  "petName": "string",
  "species": "canine|feline",
  "breed": "string",
  "age": "number",
  "weight": "number",
  "bloodType": "string",
  "lastVaccination": "string (ISO date)",
  "healthStatus": "string",
  "petPhoto": "string|null",
  "ownerName": "string",
  "ownerPhone": "string",
  "ownerEmail": "string",
  "ownerAddress": "string"
}
```

**Response Success (201):**

```json
{
  "id": "string|number",
  "solicitudId": "string|number",
  "status": "pending",
  "createdAt": "string (ISO date)"
}
```

**Response Error (409):**

```json
{
  "detail": "Ya existe una postulación con este correo electrónico."
}
```

---

## � Constantes y Enums

### Localidades de Bogotá

```javascript
const BOGOTA_LOCALITIES = [
  { value: "usaquen", label: "Usaquén" },
  { value: "chapinero", label: "Chapinero" },
  { value: "santa_fe", label: "Santa Fe" },
  { value: "san_cristobal", label: "San Cristóbal" },
  { value: "usme", label: "Usme" },
  { value: "tunjuelito", label: "Tunjuelito" },
  { value: "bosa", label: "Bosa" },
  { value: "kennedy", label: "Kennedy" },
  { value: "fontibon", label: "Fontibón" },
  { value: "engativa", label: "Engativá" },
  { value: "suba", label: "Suba" },
  { value: "barrios_unidos", label: "Barrios Unidos" },
  { value: "teusaquillo", label: "Teusaquillo" },
  { value: "los_martires", label: "Los Mártires" },
  { value: "antonio_narino", label: "Antonio Nariño" },
  { value: "puente_aranda", label: "Puente Aranda" },
  { value: "la_candelaria", label: "La Candelaria" },
  { value: "rafael_uribe_uribe", label: "Rafael Uribe Uribe" },
  { value: "ciudad_bolivar", label: "Ciudad Bolívar" },
  { value: "sumapaz", label: "Sumapaz" },
];
```

### Tipos de Sangre

```javascript
const BLOOD_TYPES = {
  canine: ["DEA 1.1+", "DEA 1.1-"],
  feline: ["A", "B", "AB"],
};
```

### Razas de Mascotas

```javascript
const PET_BREEDS = {
  canine: [
    "Golden Retriever",
    "Labrador Retriever",
    "Pastor Alemán",
    "Bulldog Francés",
    "Poodle",
    "Rottweiler",
    "Yorkshire Terrier",
    "Beagle",
    "Husky Siberiano",
    "Chihuahua",
    "Mestizo",
    "Otro",
  ],
  feline: [
    "Siamés",
    "Persa",
    "Maine Coon",
    "Británico de Pelo Corto",
    "Ragdoll",
    "Bengalí",
    "Abisinio",
    "Sphynx",
    "Mestizo",
    "Otro",
  ],
};
```

### Estados de Solicitud

```javascript
const REQUEST_STATUS = {
  ACTIVE: "Activa",
  PENDING: "Revision",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
};

// Mapeo Frontend -> Backend
const STATUS_MAPPING = {
  active: "Activa",
  pending: "Revision",
  completed: "Completada",
  cancelled: "Cancelada",
};
```

### Niveles de Urgencia

```javascript
const URGENCY_LEVELS = {
  HIGH: "Alta",
  MEDIUM: "Media",
};

// Mapeo Frontend -> Backend
const URGENCY_MAPPING = {
  high: "Alta",
  medium: "Media",
};
```

### Especies

```javascript
const SPECIES = {
  CANINE: "Perro",
  FELINE: "Gato",
};

// Mapeo Frontend -> Backend
const SPECIES_MAPPING = {
  canine: "Perro",
  feline: "Gato",
};
```
