import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '@/services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Función helper para limpiar datos de autenticación
  const clearAuthData = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUserData(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    localStorage.removeItem('userEmail');
  };

  // Cargar estado desde localStorage al inicializar
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const savedToken = localStorage.getItem('authToken');
        const savedIsLoggedIn = localStorage.getItem('isLoggedIn');
        const savedUserType = localStorage.getItem('userType');
        const savedUserData = localStorage.getItem('userData');
        
        if (savedIsLoggedIn === 'true' && savedToken && savedUserType) {
          // Verificar si el token sigue siendo válido
          try {
            await apiService.verifyToken();
            // Si el token es válido, restaurar el estado
            setIsLoggedIn(true);
            setUserType(savedUserType);
            if (savedUserData) {
              setUserData(JSON.parse(savedUserData));
            }
          } catch (error) {
            console.log('Token inválido o expirado, limpiando sesión:', error.message);
            // Si el token no es válido, limpiar todo
            clearAuthData();
          }
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();

    // Escuchar cambios en localStorage (para múltiples pestañas)
    const handleStorageChange = (e) => {
      if (e.key === 'isLoggedIn' || e.key === 'userType' || e.key === 'userData') {
        loadAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (userType, userData, token) => {
    setIsLoggedIn(true);
    setUserType(userType);
    setUserData(userData);
    
    // Persistir en localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userType', userType);
    localStorage.setItem('authToken', token);
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  };

  const logout = async () => {
    try {
      // Intentar hacer logout en el servidor
      await apiService.logout();
    } catch (error) {
      // Si falla el logout en el servidor, proceder de todas formas
      console.warn('Error durante logout en servidor:', error.message);
    } finally {
      // Limpiar estado local independientemente del resultado del servidor
      clearAuthData();
      // Navegar a la página de inicio
      navigate('/');
    }
  };

  const updateUserData = (newData) => {
    const updatedData = { ...userData, ...newData };
    setUserData(updatedData);
    
    // Actualizar localStorage
    localStorage.setItem('userData', JSON.stringify(updatedData));
  };

  // Función para refrescar los datos del usuario desde el servidor
  const refreshUserData = async () => {
    try {
      const profileData = await apiService.getUserProfile();
      setUserData(profileData);
      localStorage.setItem('userData', JSON.stringify(profileData));
      return profileData;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      throw error;
    }
  };

  const isOwner = () => userType === 'owner';
  const isClinic = () => userType === 'clinic';

  const value = {
    isLoggedIn,
    userType,
    userData,
    isLoading,
    login,
    logout,
    updateUserData,
    refreshUserData,
    isOwner,
    isClinic
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
