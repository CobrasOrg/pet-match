// API Configuration and Base Service
const API_BASE_URL = 'https://auth-service-g7nh.onrender.com/api/v1';

// Configuración base para fetch
const createFetchConfig = (method = 'GET', body = null, includeAuth = false) => {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Agregar token de autorización si es necesario
  if (includeAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Agregar body si existe
  if (body) {
    config.body = JSON.stringify(body);
  }

  return config;
};

// Función helper para manejar respuestas de la API
const handleApiResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  // Verificar si la respuesta contiene JSON
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    
    if (!response.ok) {
      // Manejar errores específicos de la API
      if (response.status === 401) {
        // Token inválido o expirado - limpiar autenticación local
        localStorage.removeItem('authToken');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userType');
        localStorage.removeItem('userData');
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      
      if (response.status === 422) {
        // Error de validación
        const errorMessage = data.detail?.[0]?.msg || 'Error de validación';
        throw new Error(errorMessage);
      }
      
      // Otros errores
      const errorMessage = data.message || data.detail || 'Error en la solicitud';
      throw new Error(errorMessage);
    }
    
    return data;
  } else {
    // Si no hay JSON, verificar status
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return null;
  }
};

// Clase de servicio API
class ApiService {
  // Método genérico para hacer peticiones
  async request(endpoint, options = {}) {
    const { method = 'GET', body = null, includeAuth = false } = options;
    
    try {
      const config = createFetchConfig(method, body, includeAuth);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      return await handleApiResponse(response);
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error.message);
      throw error;
    }
  }

  // Métodos de autenticación
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
      includeAuth: true
    });
  }

  async registerOwner(userData) {
    return this.request('/auth/register/owner', {
      method: 'POST',
      body: userData
    });
  }

  async registerClinic(userData) {
    return this.request('/auth/register/clinic', {
      method: 'POST',
      body: userData
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: { email }
    });
  }

  async resetPassword(token, newPassword, confirmPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: { token, newPassword, confirmPassword }
    });
  }

  async changePassword(currentPassword, newPassword, confirmPassword) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: { currentPassword, newPassword, confirmPassword },
      includeAuth: true
    });
  }

  async verifyToken() {
    return this.request('/auth/verify-token', {
      method: 'POST',
      includeAuth: true
    });
  }

  // Métodos de usuario
  async getUserProfile() {
    return this.request('/user/profile', {
      method: 'GET',
      includeAuth: true
    });
  }

  async updateUserProfile(userData) {
    return this.request('/user/profile', {
      method: 'PATCH',
      body: userData,
      includeAuth: true
    });
  }

  async deleteUserAccount() {
    return this.request('/user/account', {
      method: 'DELETE',
      includeAuth: true
    });
  }

  // Métodos de salud y bienvenida
  async getWelcome() {
    return this.request('/');
  }

  async getHealth() {
    return this.request('/health');
  }
}

// Crear instancia única del servicio
const apiService = new ApiService();

export default apiService;

// Exportar métodos individuales para conveniencia
export const {
  login,
  logout,
  registerOwner,
  registerClinic,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyToken,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getWelcome,
  getHealth
} = apiService;
