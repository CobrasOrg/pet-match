inc# Integración del Backend - Instrucciones

Este archivo contiene las instrucciones para integrar el backend real con la funcionalidad de mascotas.

## 🚀 Estado Actual: MODO SIMULADO

Actualmente, la aplicación funciona en **modo simulado** para permitir el desarrollo del frontend sin necesidad del backend. Todas las operaciones (crear, editar, eliminar mascotas) funcionan localmente con datos temporales.

## 📁 Archivos Afectados

### 1. `src/components/PetRegistrationForm.jsx`

- **Función `onSubmit`**: Configurada para simular llamadas al backend
- **Estado**: Modo simulado ✅

### 2. `src/pages/MyPetsPage.jsx`

- **Función `loadPets`**: Carga datos mock en lugar de llamar al backend
- **Función `handlePetUpdated`**: Simula actualización sin backend
- **Función `handleConfirmDelete`**: Simula eliminación sin backend
- **Estado**: Modo simulado ✅

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
- [Configuración del Servidor](#configuración-del-servidor)
- [Ejemplos de Integración](#ejemplos-de-integración)

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
  "medications": "string",
  "availability": "string",
  "termsAccepted": "boolean",
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
      "direccion": "string",
      "contacto": "string",
      "peso_minimo": "number",
      "estado": "Activa|Revision|Completada|Cancelada",
      "fecha_creacion": "string (ISO date)",
      "localidad": "string",
      "nombre_veterinaria": "string",
      "foto_mascota": "string|null"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
}
```

### GET `/vet/solicitudes/{id}`

**Descripción:** Obtener solicitud específica
**Headers:** `Authorization: Bearer {token}`

**Response Success (200):**

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
  "foto_mascota": "string|null"
}
```

### POST `/vet/solicitudes`

**Descripción:** Crear nueva solicitud de donación
**Headers:** `Authorization: Bearer {token}`

**Request Body:**

```json
{
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
      "direccion": "string",
      "contacto": "string",
      "peso_minimo": "number",
      "fecha_creacion": "string (ISO date)",
      "localidad": "string",
      "nombre_veterinaria": "string",
      "foto_mascota": "string|null"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
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
  "medications": "string",
  "availability": "string",
  "termsAccepted": "boolean",
  "donationHistory": [
    {
      "date": "string (ISO date)",
      "clinic": "string"
    }
  ],
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
  "medications": "string",
  "petPhoto": "string|null",
  "ownerName": "string",
  "ownerPhone": "string",
  "ownerEmail": "string",
  "ownerAddress": "string",
  "availability": "string",
  "termsAccepted": "boolean"
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

---

## ⚙️ Configuración del Servidor

### Variables de Entorno Esperadas

```env
# URLs del Backend
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_POSTULATIONS_API_URL=http://localhost:8001/base/api

# Otras configuraciones
VITE_APP_NAME=PetMatch
VITE_ENVIRONMENT=development
```

### Headers Requeridos

```javascript
// Para requests autenticados
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}

// Para uploads de archivos
{
  "Authorization": "Bearer {token}",
  // Content-Type se establece automáticamente con FormData
}

// Para requests públicos
{
  "Content-Type": "application/json"
}
```

### Códigos de Estado HTTP

- **200**: Éxito
- **201**: Creado exitosamente
- **204**: Sin contenido (para DELETE)
- **400**: Solicitud incorrecta
- **401**: No autorizado
- **403**: Prohibido
- **404**: No encontrado
- **409**: Conflicto (email duplicado, postulación duplicada, etc.)
- **422**: Entidad no procesable (errores de validación)
- **500**: Error interno del servidor

### Manejo de Errores

```javascript
// Formato esperado de errores de validación
{
  "detail": [
    {
      "msg": "El correo electrónico es obligatorio",
      "type": "value_error"
    }
  ]
}

// Formato esperado de errores simples
{
  "detail": "Ya existe una postulación con este correo electrónico."
}
```

---

## �🔄 Ejemplos de Integración

### Ejemplo 1: Registro de Mascota

**Frontend (PetRegistrationForm.jsx):**

```javascript
const onSubmit = async (data) => {
  const formData = new FormData();

  formData.append("petName", data.petName);
  formData.append("species", data.species);
  formData.append(
    "breed",
    data.breed === "Otro" ? data.customBreed : data.breed
  );
  formData.append("age", parseFloat(data.age));
  formData.append("weight", parseFloat(data.weight));
  formData.append("bloodType", data.bloodType);
  formData.append("lastVaccination", data.lastVaccination);
  formData.append("healthStatus", data.healthStatus);

  if (selectedImage && typeof selectedImage !== "string") {
    formData.append("petPhoto", selectedImage);
  }

  const url = isEditMode ? `/owner/pets/${initialData.id}` : "/owner/pets";
  const method = isEditMode ? "PUT" : "POST";

  const response = await fetch(`${VITE_API_BASE_URL}${url}`, {
    method: method,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error al registrar la mascota");
  }

  const result = await response.json();
  // Manejar respuesta exitosa
};
```

### Ejemplo 2: Crear Solicitud de Donación

**Frontend (BloodRequestForm.jsx):**

```javascript
const handleSubmit = async (data) => {
  let foto_mascota = "";
  if (data.foto_mascota) {
    foto_mascota = await fileToBase64(data.foto_mascota);
  }

  const payload = {
    especie: data.especie,
    tipo_sangre: data.tipo_sangre,
    urgencia: data.urgencia,
    descripcion_solicitud: data.descripcion_solicitud,
    peso_minimo: parseFloat(data.peso_minimo),
    foto_mascota,
  };

  const response = await fetch(`${VITE_API_BASE_URL}/vet/solicitudes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Error al crear la solicitud");
  }

  const result = await response.json();
  // Manejar respuesta exitosa
};
```

### Ejemplo 3: Postular Mascota

**Frontend (DonationButton.jsx):**

```javascript
const handleSelectPet = async (selectedPet) => {
  const payload = {
    petName: selectedPet.petName || selectedPet.name,
    species: selectedPet.species,
    breed: selectedPet.breed,
    age: selectedPet.age,
    weight: selectedPet.weight,
    bloodType: selectedPet.bloodType,
    lastVaccination: selectedPet.lastVaccination,
    healthStatus: selectedPet.healthStatus,
    medications: selectedPet.medications || "",
    petPhoto: selectedPet.petPhoto || null,
    ownerName: userData?.name || "",
    ownerPhone: userData?.phone || "",
    ownerEmail: userData?.email || "",
    ownerAddress: userData?.address || "",
    availability: "Disponible según coordinación con la clínica",
    termsAccepted: true,
  };

  const response = await fetch(
    `${VITE_POSTULATIONS_API_URL}/solicitudes/${request.id}/postulaciones`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (response.status === 409) {
    toast.error("Ya existe una postulación tuya para esta solicitud.");
    return;
  }

  if (!response.ok) {
    const errorData = await response.json();
    let errorMsg = "No se pudo enviar la postulación";
    if (Array.isArray(errorData.detail)) {
      errorMsg = errorData.detail.map((e) => e.msg).join(" | ");
    } else if (typeof errorData.detail === "string") {
      errorMsg = errorData.detail;
    }
    toast.error(errorMsg);
    return;
  }

  toast.success(
    `¡Perfecto! ${selectedPet.petName} ha sido postulado como donante.`
  );
};
```

### Ejemplo 4: Autenticación y Manejo de Token

**Frontend (AuthContext.jsx):**

```javascript
const login = async (email, password) => {
  const response = await fetch(`${VITE_API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Credenciales incorrectas");
  }

  const data = await response.json();

  // Guardar token y datos de usuario
  localStorage.setItem("token", data.token);
  localStorage.setItem("userData", JSON.stringify(data.user));
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userType", data.user.userType);

  return data;
};
```

---

## 🚨 Consideraciones Importantes

### 1. **Seguridad**

- Todos los endpoints protegidos requieren token JWT válido
- Validar permisos: owners solo pueden acceder a sus mascotas, clínicas solo a sus solicitudes
- Sanitizar todos los inputs del usuario
- Validar tipos de archivo para uploads de imágenes

### 2. **Validaciones**

- Validar formato de email en registro/login
- Validar que las fechas de vacunación no sean futuras ni muy antiguas
- Validar pesos y edades dentro de rangos lógicos
- Validar tipos de sangre según la especie

### 3. **Almacenamiento de Imágenes**

- Implementar subida de archivos para fotos de mascotas
- Considerar límites de tamaño (2MB en frontend)
- Generar URLs accesibles para las imágenes
- Manejar casos donde no hay imagen disponible

### 4. **Rendimiento**

- Implementar paginación para listas grandes
- Considerar caché para datos que no cambian frecuentemente
- Optimizar consultas de base de datos

### 5. **Compatibilidad**

- Mantener consistencia en formatos de fecha (ISO 8601)
- Usar convenciones de naming consistentes
- Manejar casos donde APIs no están disponibles (fallback a mock data)

---

## 📞 Contacto y Soporte

### Para implementar este backend:

1. **Revisa cada endpoint cuidadosamente** - Los formatos de request/response deben coincidir exactamente
2. **Implementa validaciones robustas** - El frontend espera mensajes de error específicos
3. **Maneja la autenticación correctamente** - Los tokens deben persistir entre sesiones
4. **Prueba con datos reales** - Usa los usuarios de prueba proporcionados
5. **Considera la experiencia de usuario** - Respuestas rápidas y mensajes claros

### Archivos Frontend clave para revisar:

- `src/components/auth/LoginForm.jsx` - Lógica de autenticación
- `src/components/PetRegistrationForm.jsx` - Registro de mascotas
- `src/components/BloodRequestForm.jsx` - Creación de solicitudes
- `src/components/DonationButton.jsx` - Postulaciones de mascotas
- `src/pages/RequestDetailPage.jsx` - Gestión de solicitudes

**¡Importante!** Todos los campos marcados como requeridos en los Request Body son obligatorios y deben validarse tanto en frontend como backend.

### Paso 1: Actualizar `PetRegistrationForm.jsx`

Reemplaza la función `onSubmit` con esta implementación:

```jsx
const onSubmit = async (data) => {
  setIsLoading(true);

  try {
    // Preparar los datos para enviar
    const formData = new FormData();

    // Agregar datos básicos
    formData.append("petName", data.petName);
    formData.append("species", data.species);
    formData.append(
      "breed",
      data.breed === "Otro" ? data.customBreed : data.breed
    );
    formData.append("age", parseFloat(data.age));
    formData.append("weight", parseFloat(data.weight));
    formData.append("bloodType", data.bloodType);
    formData.append("lastVaccination", data.lastVaccination);
    formData.append("healthStatus", data.healthStatus);

    // Agregar imagen si existe y es nueva
    if (selectedImage && typeof selectedImage !== "string") {
      formData.append("petPhoto", selectedImage);
    }

    // Determinar URL y método basado en modo
    const url = isEditMode
      ? `/api/mascotas/${initialData.id}`
      : "/api/mascotas";
    const method = isEditMode ? "PUT" : "POST";

    // Hacer la llamada al backend
    const response = await fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        `Error ${isEditMode ? "actualizando" : "registrando"} mascota`
      );
    }

    const result = await response.json();

    // Preparar datos para el callback
    const petData = {
      ...(isEditMode && { id: initialData.id }),
      petName: data.petName,
      species: data.species,
      breed: data.breed === "Otro" ? data.customBreed : data.breed,
      age: parseFloat(data.age),
      weight: parseFloat(data.weight),
      bloodType: data.bloodType,
      lastVaccination: data.lastVaccination,
      healthStatus: data.healthStatus,
      petPhoto:
        result.petPhoto ||
        (typeof selectedImage === "string" ? selectedImage : null),
      ...(isEditMode
        ? { updatedAt: new Date().toISOString() }
        : {
            registeredAt: new Date().toISOString(),
            id: result.id,
          }),
    };

    if (onSuccess) {
      onSuccess(petData);
    }
  } catch (error) {
    console.error(
      `Error ${isEditMode ? "actualizando" : "registrando"} mascota:`,
      error
    );
    alert(
      `Error al ${
        isEditMode ? "actualizar" : "registrar"
      } la mascota. Intenta nuevamente.`
    );
  } finally {
    setIsLoading(false);
  }
};
```

### Paso 2: Actualizar `MyPetsPage.jsx`

#### Función `loadPets`:

```jsx
const loadPets = async () => {
  setIsLoading(true);
  try {
    const response = await fetch("/api/mascotas", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error cargando mascotas");
    }

    const data = await response.json();
    setPets(data);
  } catch (error) {
    console.error("Error cargando mascotas:", error);
    alert("Error cargando las mascotas.");
  } finally {
    setIsLoading(false);
  }
};
```

#### Función `handlePetUpdated`:

```jsx
const handlePetUpdated = async (updatedPet) => {
  try {
    const response = await fetch(`/api/mascotas/${updatedPet.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedPet),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar la mascota");
    }

    setPets((prevPets) =>
      prevPets.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet))
    );

    setEditingPet(null);
    alert("¡Mascota actualizada exitosamente!");
  } catch (error) {
    console.error("Error actualizando mascota:", error);
    alert("Error al actualizar la mascota. Intenta nuevamente.");
  }
};
```

#### Función `handleConfirmDelete`:

```jsx
const handleConfirmDelete = async () => {
  try {
    const response = await fetch(`/api/mascotas/${deletingPet.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la mascota");
    }

    setPets((prevPets) => prevPets.filter((pet) => pet.id !== deletingPet.id));
    setShowDeleteDialog(false);
    setDeletingPet(null);
    alert("¡Mascota eliminada exitosamente!");
  } catch (error) {
    console.error("Error eliminando mascota:", error);
    alert("Error al eliminar la mascota. Intenta nuevamente.");
  }
};
```

## 🚨 PROBLEMA IDENTIFICADO Y SOLUCIONADO

### Issue: Inconsistencia en el formato de especies

**Problema**: La API del backend devuelve las especies en español ("Perro", "Gato") pero el frontend espera códigos en inglés ("canine", "feline").

**Ejemplo de datos del backend**:

```json
{
  "especie": "Perro", // ❌ Frontend espera "canine"
  "tipo_sangre": "DEA 1.1+"
}
```

**Síntoma**: Rocky aparecía como "Gato" porque:

1. Backend devuelve `"especie": "Perro"`
2. Frontend hace `species === 'canine'` → `false`
3. Aplica el else y muestra "Gato"

**Solución implementada**:

- Mapeo automático en `PublicRequestsPage.jsx` y `DonationSelectionPage.jsx`
- Función `getSpeciesLabel()` actualizada para manejar ambos formatos
- Filtrado de mascotas actualizado para normalizar especies

```javascript
// Mapeo automático de la API
const mappedData = data.map((request) => ({
  ...request,
  especie:
    request.especie === "Perro"
      ? "canine"
      : request.especie === "Gato"
      ? "feline"
      : request.especie,
}));

// Función de etiqueta mejorada
const getSpeciesLabel = (species) => {
  if (species === "canine" || species === "Perro") return "Perro";
  if (species === "feline" || species === "Gato") return "Gato";
  return species;
};
```

### Estados solucionados:

- ✅ **RESUELTO**: Rocky aparece correctamente como "Perro" en todas las páginas
- ✅ **RESUELTO**: Filtrado de mascotas funciona con ambos formatos
- ✅ **RESUELTO**: Compatibilidad con API en español y formato interno en inglés
- ✅ **RESUELTO**: Modal de selección muestra mascotas compatibles correctamente
- ✅ **RESUELTO**: Sincronización de fechas entre visualización y formulario de edición

### Problemas de fechas solucionados:

**Problema**: Las fechas de última vacuna no coincidían entre la visualización en "Mis Mascotas" y el formulario de edición.

**Causa**: Error de zona horaria cuando se parsean fechas en formato `YYYY-MM-DD`:

- JavaScript interpreta `'2024-11-15'` como UTC
- `toLocaleDateString()` convierte a zona horaria local
- Resultado: `'2024-11-15'` se mostraba como `14/11/2024` (un día menos)

**Solución implementada**:

1. **Formateo para visualización** (`MyPetsPage.jsx`):

   - Función `formatDateForDisplay()` que parsea fechas `YYYY-MM-DD` como locales
   - Evita el problema de zona horaria construyendo la fecha con `new Date(year, month-1, day)`

2. **Formateo para formulario** (`PetRegistrationForm.jsx`):
   - Función `formatDateForInput()` que convierte fechas a formato `YYYY-MM-DD`
   - Garantiza compatibilidad con campos `input[type="date"]`

```javascript
// Visualización corregida
const formatDateForDisplay = (dateString) => {
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("es-CO");
  }
  // ... resto del código
};

// Formulario corregido
const formatDateForInput = (dateString) => {
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString;
  }
  return new Date(dateString).toISOString().split("T")[0];
};
```

**Resultado**: Ahora `'2024-11-15'` se muestra correctamente como `15/11/2024` y se precarga correctamente en el formulario.

### Problema de fotos en postulaciones:

**Problema**: Las fotos de las mascotas no se muestran cuando las veterinarias revisan las postulaciones.

**Causa**: El endpoint `GET /api/solicitudes/{id}/postulaciones` no incluye el campo `petPhoto` en la respuesta.

**Componente afectado**: `CardMascotaPostulada.jsx` - Está preparado para mostrar las fotos pero no las recibe del backend.

**Solución pendiente**: El backend debe incluir la URL de la foto de la mascota en la respuesta de postulaciones.

```jsx
// El componente ya está preparado para mostrar fotos:
{
  application.petPhoto ? (
    <img
      src={application.petPhoto}
      alt={application.petName}
      className="w-full h-full object-cover"
    />
  ) : (
    // Icono de respaldo si no hay foto
    <DogIcon className="h-8 w-8 text-gray-400" />
  );
}
```

**Estado**: ⏳ **PENDIENTE** - Requiere actualización del backend para incluir `petPhoto` en las respuestas de postulaciones.

## 🔌 Endpoints del Backend Necesarios

### GET `/api/mascotas`

- **Descripción**: Obtener todas las mascotas del usuario autenticado
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta**: Array de objetos mascota

### POST `/api/mascotas`

- **Descripción**: Crear nueva mascota
- **Headers**: `Authorization: Bearer <token>`
- **Body**: FormData con datos de la mascota e imagen
- **Respuesta**: Objeto mascota creada con ID

### PUT `/api/mascotas/{id}`

- **Descripción**: Actualizar mascota existente
- **Headers**: `Authorization: Bearer <token>`
- **Body**: FormData con datos actualizados
- **Respuesta**: Objeto mascota actualizada

### DELETE `/api/mascotas/{id}`

- **Descripción**: Eliminar mascota
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta**: Status 200/204

### POST `/api/solicitudes/{id}/postulaciones`

- **Descripción**: Crear una nueva postulación para una solicitud de donación
- **Headers**: `Authorization: Bearer <token>`
- **Body**: JSON con datos de la mascota y del dueño
- **Respuesta**: Objeto postulación creada con ID

### GET `/api/solicitudes/{id}/postulaciones`

- **Descripción**: Obtener todas las postulaciones para una solicitud específica
- **Headers**: `Authorization: Bearer <token>`
- **Respuesta**: Array de objetos postulación con datos completos de mascotas

**⚠️ IMPORTANTE**: Este endpoint debe incluir la foto de la mascota (`petPhoto`) en la respuesta para que las veterinarias puedan ver las imágenes de las mascotas postuladas.

**Estructura de respuesta esperada**:

```json
[
  {
    "id": 1,
    "petName": "Luna",
    "species": "canine",
    "breed": "Golden Retriever",
    "age": 3,
    "weight": 25.5,
    "bloodType": "DEA 1.1+",
    "lastVaccination": "2024-11-15",
    "healthStatus": "Excelente estado",
    "petPhoto": "https://example.com/photos/luna.jpg", // ← IMPORTANTE: Incluir la foto
    "ownerName": "Juan Pérez",
    "ownerPhone": "+57 300 123 4567",
    "ownerEmail": "juan@email.com",
    "ownerAddress": "Calle 123 #45-67",
    "status": "pending",
    "createdAt": "2024-12-01T10:30:00Z"
  }
]
```

## 📝 Estructura de Datos Esperada

```typescript
interface Pet {
  id: number;
  petName: string;
  species: "canine" | "feline";
  breed: string;
  age: number;
  weight: number;
  bloodType: string;
  lastVaccination: string; // ISO date string
  healthStatus: string;
  petPhoto?: string; // URL de la imagen
  registeredAt: string; // ISO date string
  updatedAt?: string; // ISO date string
}
```

## ✅ Checklist de Integración

- [ ] Backend endpoints implementados
- [ ] Autenticación JWT configurada
- [ ] Subida de archivos configurada
- [ ] Actualizar `PetRegistrationForm.jsx`
- [ ] Actualizar `MyPetsPage.jsx`
- [ ] Probar registro de mascota
- [ ] Probar edición de mascota
- [ ] Probar eliminación de mascota
- [ ] Probar subida de imágenes
- [ ] **Incluir `petPhoto` en respuestas de postulaciones**
- [ ] Probar visualización de fotos en postulaciones
- [ ] Manejo de errores del backend
- [ ] Remover comentarios de "MODO SIMULADO"

## 🎉 Una vez integrado

1. Remover todos los comentarios que indican "MODO SIMULADO"
2. Remover este archivo de instrucciones
3. Actualizar la documentación del proyecto
