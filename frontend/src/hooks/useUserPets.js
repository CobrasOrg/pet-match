// Hook para verificar si el usuario tiene mascotas registradas
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import petsApi from '@/services/petsApi';

export const useUserPets = () => {
  const { isLoggedIn, userType } = useAuth();
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRegisteredPets, setHasRegisteredPets] = useState(false);

  useEffect(() => {
    const loadPets = async () => {
      if (!isLoggedIn || userType !== 'owner') {
        setIsLoading(false);
        setHasRegisteredPets(false);
        setPets([]);
        return;
      }

      try {
        // Obtener mascotas del usuario autenticado desde la API
        const userPets = await petsApi.getUserPets();
        
        setPets(userPets);
        setHasRegisteredPets(Array.isArray(userPets) && userPets.length > 0);
        
      } catch (error) {
        // En caso de error, asumir que no tiene mascotas
        setPets([]);
        setHasRegisteredPets(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadPets();
  }, [isLoggedIn, userType]);

  return { pets, isLoading, hasRegisteredPets };
};
