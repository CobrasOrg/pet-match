import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook personalizado para manejar las mascotas registradas del usuario
 * Conecta PetRegistrationForm con CardMascotaPostulada
 */
export function usePets() {
  const { userData, userType } = useAuth();
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar mascotas del usuario
  const loadPets = async () => {
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
  };

  // Agregar nueva mascota
  const addPet = async (petData) => {
    try {
      // TODO: Reemplazar con llamada real al backend
      // const response = await fetch('/api/pets', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...petData, ownerId: userData.id })
      // });
      // const newPet = await response.json();
      
      // Simulación temporal
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
      // TODO: Reemplazar con llamada real al backend
      // const response = await fetch(`/api/pets/${petId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(petData)
      // });
      // const updatedPet = await response.json();
      
      // Simulación temporal
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
      // TODO: Reemplazar con llamada real al backend
      // await fetch(`/api/pets/${petId}`, { method: 'DELETE' });
      
      // Simulación temporal
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

  // Obtener mascotas elegibles para donación (criterios básicos generales)
  const getEligiblePets = () => {
    return pets.filter(pet => {
      // Criterios básicos para ser elegible como donante
      const isHealthy = pet.healthStatus && !pet.healthStatus.toLowerCase().includes('enferm');
      const hasRecentVaccination = pet.lastVaccination && 
        new Date(pet.lastVaccination) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // Último año
      const hasAppropriateWeight = pet.weight >= 5; // Peso mínimo básico (5kg para gatos pequeños)
      const hasAppropriateAge = pet.age >= 1 && pet.age <= 8; // Edad apropiada
      
      return isHealthy && hasRecentVaccination && hasAppropriateWeight && hasAppropriateAge;
    });
  };

  // Obtener mascotas elegibles para una solicitud específica
  const getEligiblePetsForRequest = (request) => {
    return pets.filter(pet => {
      // Criterios básicos de salud
      const isHealthy = pet.healthStatus && !pet.healthStatus.toLowerCase().includes('enferm');
      const hasRecentVaccination = pet.lastVaccination && 
        new Date(pet.lastVaccination) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      const hasAppropriateAge = pet.age >= 1 && pet.age <= 8;
      
      // Criterios específicos de la solicitud
      const normalizeSpecies = (species) => {
        if (species === 'canine' || species === 'Perro') return 'canine';
        if (species === 'feline' || species === 'Gato') return 'feline';
        return species;
      };
      
      const petSpecies = normalizeSpecies(pet.species);
      const requiredSpeciesNormalized = normalizeSpecies(request.especie);
      
      const matchesSpecies = !request.especie || petSpecies === requiredSpeciesNormalized;
      const matchesBreed = !request.raza || pet.breed === request.raza;
      const matchesBloodType = !request.tipo_sangre || pet.bloodType === request.tipo_sangre;
      const matchesWeight = !request.peso_minimo || pet.weight >= request.peso_minimo;
      
      return isHealthy && hasRecentVaccination && hasAppropriateAge && 
             matchesSpecies && matchesBreed && matchesBloodType && matchesWeight;
    });
  };

  // Cargar mascotas al montar el hook
  useEffect(() => {
    if (userData && userType === 'owner') {
      loadPets();
    }
  }, [userData, userType]); // loadPets se define dentro del efecto para evitar dependencias

  return {
    pets,
    isLoading,
    refreshPets,
    addPet,
    updatePet,
    deletePet,
    getPetById,
    getEligiblePets,
    getEligiblePetsForRequest
  };
}
