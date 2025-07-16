const SOLICITUDES_API_BASE_URL = 'https://solicitudes-service.fly.dev/api/v1';

const createSolicitudesConfig = (method = 'GET', body = null, isFormData = false, userType = 'owner') => {
  const config = {
    method,
    headers: {
      'X-User-Type': userType 
    },
  };

  
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (body && !isFormData) {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(body);
  } else if (body && isFormData) {
    config.body = body;
  }

  return config;
};

const handleSolicitudesResponse = async (response, endpoint = '') => {
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
        throw new Error('Solicitud no encontrada');
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

class SolicitudesApiService {
  async request(endpoint, options = {}) {
    const { method = 'GET', body = null, isFormData = false, userType = 'owner' } = options;
    
    try {
      const config = createSolicitudesConfig(method, body, isFormData, userType);
      const response = await fetch(`${SOLICITUDES_API_BASE_URL}${endpoint}`, config);
      return await handleSolicitudesResponse(response, endpoint);
    } catch (error) {
      console.error(`Solicitudes API Error [${method} ${endpoint}]:`, error.message);
      throw error;
    }
  }

  // ENDPOINTS VETERINARIAS
  
  // Obtener todas las solicitudes
  async getAllSolicitudes() {
    return this.request('/solicitudes/vet/', {
      userType: 'clinic'
    });
  }

  // Filtrar solicitudes
  async filterSolicitudes(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.estado) params.append('estado', filters.estado);
    if (filters.especie) {
      if (Array.isArray(filters.especie)) {
        params.append('especie', filters.especie.join(','));
      } else {
        params.append('especie', filters.especie);
      }
    }
    if (filters.tipo_sangre) {
      if (Array.isArray(filters.tipo_sangre)) {
        params.append('tipo_sangre', filters.tipo_sangre.join(','));
      } else {
        params.append('tipo_sangre', filters.tipo_sangre);
      }
    }
    if (filters.urgencia) {
      if (Array.isArray(filters.urgencia)) {
        params.append('urgencia', filters.urgencia.join(','));
      } else {
        params.append('urgencia', filters.urgencia);
      }
    }
    if (filters.localidad) {
      if (Array.isArray(filters.localidad)) {
        params.append('localidad', filters.localidad.join(','));
      } else {
        params.append('localidad', filters.localidad);
      }
    }
    
    const queryString = params.toString();
    const endpoint = `/solicitudes/vet/filtrar${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint, {
      userType: 'clinic'
    });
  }

  // Obtener solicitud específica
  async getSolicitudById(id) {
    return this.request(`/solicitudes/vet/${id}`, {
      userType: 'clinic'
    });
  }

  // Crear nueva solicitud
  async createSolicitud(formData) {
    return this.request('/solicitudes/vet/', {
      method: 'POST',
      body: formData,
      isFormData: true,
      userType: 'clinic'
    });
  }

  // Actualizar solicitud
  async updateSolicitud(id, updates, fotoMascota = null) {
    if (fotoMascota || Object.keys(updates).some(key => key !== 'estado')) {
      // Usar FormData si hay foto o campos que no sean estado
      const formData = new FormData();
      
      Object.keys(updates).forEach(key => {
        if (updates[key] !== null && updates[key] !== undefined) {
          formData.append(key, updates[key]);
        }
      });
      
      if (fotoMascota) {
        formData.append('foto_mascota', fotoMascota);
      }
      
      return this.request(`/solicitudes/vet/${id}`, {
        method: 'PATCH',
        body: formData,
        isFormData: true,
        userType: 'clinic'
      });
    } else {
      return this.request(`/solicitudes/vet/${id}`, {
        method: 'PATCH',
        body: updates,
        userType: 'clinic'
      });
    }
  }

  // Actualizar solo el estado
  async updateSolicitudEstado(id, estado) {
    return this.request(`/solicitudes/vet/${id}/estado`, {
      method: 'PATCH',
      body: { estado },
      userType: 'clinic'
    });
  }

  // Eliminar solicitud
  async deleteSolicitud(id) {
    return this.request(`/solicitudes/vet/${id}`, {
      method: 'DELETE',
      userType: 'clinic'
    });
  }

  // ENDPOINTS USUARIOS
  
  // Obtener solicitudes activas
  async getActiveSolicitudes() {
    return this.request('/solicitudes/user/activas');
  }

  // Filtrar solicitudes activas
  async filterActiveSolicitudes(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.especie) {
      if (Array.isArray(filters.especie)) {
        params.append('especie', filters.especie.join(','));
      } else {
        params.append('especie', filters.especie);
      }
    }
    
    if (filters.tipo_sangre) {
      if (Array.isArray(filters.tipo_sangre)) {
        params.append('tipo_sangre', filters.tipo_sangre.join(','));
      } else {
        params.append('tipo_sangre', filters.tipo_sangre);
      }
    }
    
    if (filters.urgencia) {
      if (Array.isArray(filters.urgencia)) {
        params.append('urgencia', filters.urgencia.join(','));
      } else {
        params.append('urgencia', filters.urgencia);
      }
    }
    
    if (filters.localidad) {
      if (Array.isArray(filters.localidad)) {
        params.append('localidad', filters.localidad.join(','));
      } else {
        params.append('localidad', filters.localidad);
      }
    }
    
    const queryString = params.toString();
    const endpoint = `/solicitudes/user/activas/filtrar${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  // Obtener solicitud específica
  async getSolicitudByIdUser(id) {
    return this.request(`/solicitudes/user/${id}`);
  }
}


const solicitudesApi = new SolicitudesApiService();

export default solicitudesApi;

export const {
  getAllSolicitudes,
  filterSolicitudes,
  getSolicitudById,
  createSolicitud,
  updateSolicitud,
  updateSolicitudEstado,
  deleteSolicitud,
  getActiveSolicitudes,
  filterActiveSolicitudes,
  getSolicitudByIdUser
} = solicitudesApi;