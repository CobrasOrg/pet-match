import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

/**
 * Hook personalizado para manejar las mascotas registradas del usuario
 * Conecta PetRegistrationForm con CardMascotaPostulada
 */
export function usePets() {
  const { userData, userType } = useAuth();
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Función para cargar mascotas (usando useCallback para evitar dependencias)
  const loadPets = useCallback(async () => {
    if (!userData || userType !== 'owner') return;
    
    setIsLoading(true);
    try {
      // TODO: Reemplazar con llamada real al backend
      // const response = await fetch(`/api/pets?userId=${userData.id}`);
      // const data = await response.json();
      
      // Simulación temporal - en producción esto vendrá del backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Por ahora usar datos del localStorage como cache local
      const storedPets = localStorage.getItem(`pets_${userData.email}`);
      const userPets = storedPets ? JSON.parse(storedPets) : [];
      
      setPets(userPets);
    } catch (error) {
      console.error('Error cargando mascotas:', error);
      setPets([]);
    } finally {
      setIsLoading(false);
    }
  }, [userData, userType]);

  // Agregar nueva mascota
  const addPet = async (petData) => {
    try {
      // TODO: Reemplazar con llamada real al backend
      const newPet = {
        ...petData,
        id: Date.now(),
        ownerId: userData.id,
        ownerName: userData.name,
        ownerEmail: userData.email,
        ownerPhone: userData.phone,
        ownerAddress: userData.address,
        registeredAt: new Date().toISOString()
      };
      
      const updatedPets = [...pets, newPet];
      setPets(updatedPets);
      
      // Guardar en localStorage como cache temporal
      localStorage.setItem(`pets_${userData.email}`, JSON.stringify(updatedPets));
      
      return newPet;
    } catch (error) {
      console.error('Error agregando mascota:', error);
      throw error;
    }
  };

  // Actualizar mascota existente
  const updatePet = async (petId, petData) => {
    try {
      const updatedPets = pets.map(pet => 
        pet.id === petId ? { ...pet, ...petData, updatedAt: new Date().toISOString() } : pet
      );
      setPets(updatedPets);
      
      // Guardar en localStorage como cache temporal
      localStorage.setItem(`pets_${userData.email}`, JSON.stringify(updatedPets));
      
      return updatedPets.find(pet => pet.id === petId);
    } catch (error) {
      console.error('Error actualizando mascota:', error);
      throw error;
    }
  };

  // Eliminar mascota
  const deletePet = async (petId) => {
    try {
      const updatedPets = pets.filter(pet => pet.id !== petId);
      setPets(updatedPets);
      
      // Guardar en localStorage como cache temporal
      localStorage.setItem(`pets_${userData.email}`, JSON.stringify(updatedPets));
    } catch (error) {
      console.error('Error eliminando mascota:', error);
      throw error;
    }
  };

  // Obtener mascota por ID (útil para postulaciones)
  const getPetById = (petId) => {
    return pets.find(pet => pet.id === petId);
  };

  // Obtener mascotas elegibles para donación
  const getEligiblePets = () => {
    return pets.filter(pet => {
      // Criterios básicos para ser elegible como donante
      const isHealthy = pet.healthStatus && !pet.healthStatus.toLowerCase().includes('enferm');
      const hasRecentVaccination = pet.lastVaccination && 
        new Date(pet.lastVaccination) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // Último año
      const hasAppropriateWeight = pet.weight >= 25; // Peso mínimo típico para donantes
      const hasAppropriateAge = pet.age >= 1 && pet.age <= 8; // Edad apropiada
      
      return isHealthy && hasRecentVaccination && hasAppropriateWeight && hasAppropriateAge;
    });
  };

  // Cargar mascotas al montar el hook
  useEffect(() => {
    loadPets();
  }, [loadPets]);

  return {
    pets,
    isLoading,
    loadPets,
    addPet,
    updatePet,
    deletePet,
    getPetById,
    getEligiblePets
  };
}
