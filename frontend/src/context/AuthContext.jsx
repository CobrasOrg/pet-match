import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar estado desde localStorage al inicializar
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const savedIsLoggedIn = localStorage.getItem('isLoggedIn');
        const savedUserType = localStorage.getItem('userType');
        const savedUserData = localStorage.getItem('userData');
        
        if (savedIsLoggedIn === 'true' && savedUserType) {
          setIsLoggedIn(true);
          setUserType(savedUserType);
          if (savedUserData) {
            setUserData(JSON.parse(savedUserData));
          }
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
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

  const login = (type, data = null) => {
    setIsLoggedIn(true);
    setUserType(type);
    setUserData(data);
    
    // Persistir en localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userType', type);
    if (data) {
      localStorage.setItem('userData', JSON.stringify(data));
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUserData(null);
    
    // Limpiar localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    localStorage.removeItem('userEmail');
    
    // Navegar a la página de inicio
    navigate('/');
  };

  const updateUserData = (newData) => {
    const updatedData = { ...userData, ...newData };
    setUserData(updatedData);
    
    // Actualizar localStorage
    localStorage.setItem('userData', JSON.stringify(updatedData));
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
    isOwner,
    isClinic
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
