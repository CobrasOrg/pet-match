const PETS_API_BASE_URL = 'https://mascotas-service.fly.dev/api/v1';

const createPetsConfig = (method = 'GET', body = null, isFormData = false) => {
  const config = {
    method,
    headers: {},
  };

  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (body && !isFormData) {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(body);
  } else if (body && isFormData) {
    // NO establecer Content-Type para FormData, dejar que el navegador lo establezca automáticamente
    // con el boundary correcto para multipart/form-data
    config.body = body;
  }

  return config;
};

const handlePetsResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  if (response.status === 204) {
    return null; 
  }
  
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userType');
        localStorage.removeItem('userData');
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      
      if (response.status === 404) {
        throw new Error('Mascota no encontrada');
      }
      
      const errorMessage = data.detail || data.message || `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }
    
    return data;
  } else {
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return null;
  }
};

class PetsApiService {
  async request(endpoint, options = {}) {
    const { method = 'GET', body = null, isFormData = false } = options;
    
    try {
      const config = createPetsConfig(method, body, isFormData);
      const response = await fetch(`${PETS_API_BASE_URL}${endpoint}`, config);
      return await handlePetsResponse(response);
    } catch (error) {
      console.error(`Pets API Error [${method} ${endpoint}]:`, error.message);
      throw error;
    }
  }

  // ENDPOINTS PARA USUARIOS AUTENTICADOS
  
  // Obtener todas las mascotas del usuario autenticado
  async getUserPets() {
    return this.request('/pets/');
  }

  // Crear una nueva mascota asociada al usuario autenticado
  async createPet(formData) {
    return this.request('/pets/', {
      method: 'POST',
      body: formData,
      isFormData: true
    });
  }

  // Actualizar la información de una mascota existente (solo mascotas propias)
  async updatePet(petId, updates, fotoMascota = null) {
    // Intentar primero con JSON para evitar problemas de CORS
    if (!fotoMascota) {
      return this.request(`/pets/${petId}`, {
        method: 'PUT',
        body: updates
      });
    } else {
      // Si hay imagen, usar FormData con PUT
      const formData = new FormData();
      
      // Agregar campos de actualización
      Object.keys(updates).forEach(key => {
        if (updates[key] !== null && updates[key] !== undefined) {
          formData.append(key, updates[key]);
        }
      });
      
      // Agregar imagen
      formData.append('petPhoto', fotoMascota);
      
      return this.request(`/pets/${petId}`, {
        method: 'PUT',
        body: formData,
        isFormData: true
      });
    }
  }

  // Función alternativa para actualizar sin imagen (para evitar problemas de CORS)
  async updatePetWithoutImage(petId, updates) {
    return this.request(`/pets/${petId}`, {
      method: 'PUT',
      body: updates
    });
  }

  // Eliminar una mascota (solo mascotas propias)
  async deletePet(petId) {
    return this.request(`/pets/${petId}`, {
      method: 'DELETE'
    });
  }

  // ENDPOINTS PARA ADMINISTRADORES
  
  // Obtener todas las mascotas de un usuario específico (para administradores)
  async getUserPetsByUserId(userId) {
    return this.request(`/pets/user/${userId}`);
  }

  // Actualizar mascota de un usuario específico (para administradores)
  async updateUserPetByUserId(userId, petId, updates, fotoMascota = null) {
    if (fotoMascota) {
      // Usar FormData si hay foto
      const formData = new FormData();
      
      Object.keys(updates).forEach(key => {
        if (updates[key] !== null && updates[key] !== undefined) {
          formData.append(key, updates[key]);
        }
      });
      
      if (fotoMascota) {
        formData.append('petPhoto', fotoMascota);
      }
      
      return this.request(`/pets/user/${userId}/${petId}`, {
        method: 'PUT',
        body: formData,
        isFormData: true
      });
    } else {
      return this.request(`/pets/user/${userId}/${petId}`, {
        method: 'PUT',
        body: updates
      });
    }
  }

  // Eliminar mascota de un usuario específico (para administradores)
  async deleteUserPetByUserId(userId, petId) {
    return this.request(`/pets/user/${userId}/${petId}`, {
      method: 'DELETE'
    });
  }
}

const petsApi = new PetsApiService();

export default petsApi;

export const {
  getUserPets,
  createPet,
  updatePet,
  updatePetWithoutImage,
  deletePet,
  getUserPetsByUserId,
  updateUserPetByUserId,
  deleteUserPetByUserId
} = petsApi; 