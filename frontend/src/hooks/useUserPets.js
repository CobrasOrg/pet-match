// Hook para verificar si el usuario tiene mascotas registradas
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const useUserPets = () => {
  const { isLoggedIn, userType, userData } = useAuth();
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRegisteredPets, setHasRegisteredPets] = useState(false);

  useEffect(() => {
    const loadPets = async () => {
      if (!isLoggedIn || userType !== 'owner' || !userData) {
        setIsLoading(false);
        return;
      }

      try {
        // Simular delay de carga
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Obtener mascotas del usuario autenticado
        const userPets = userData.pets || [];

        setPets(userPets);
        setHasRegisteredPets(userPets.length > 0);
        
      } catch (error) {
        console.error('Error cargando mascotas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPets();
  }, [isLoggedIn, userType, userData]);

  return { pets, isLoading, hasRegisteredPets };
};
