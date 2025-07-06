import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Cargar estado desde localStorage al inicializar
  useEffect(() => {
    const savedIsLoggedIn = localStorage.getItem('isLoggedIn');
    const savedUserType = localStorage.getItem('userType');
    const savedUserData = localStorage.getItem('userData');
    
    if (savedIsLoggedIn === 'true' && savedUserType) {
      setIsLoggedIn(true);
      setUserType(savedUserType);
      if (savedUserData) {
        try {
          setUserData(JSON.parse(savedUserData));
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
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
    
    navigate('/');
  };

  const isOwner = () => userType === 'owner';
  const isClinic = () => userType === 'clinic';

  return {
    isLoggedIn,
    userType,
    userData,
    login,
    logout,
    isOwner,
    isClinic
  };
};
