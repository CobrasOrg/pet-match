// Localidades de Bogotá
export const BOGOTA_LOCALITIES = [
    { value: 'Usaquén', label: 'Usaquén' },
    { value: 'Chapinero', label: 'Chapinero' },
    { value: 'Santa Fe', label: 'Santa Fe' },
    { value: 'San Cristóbal', label: 'San Cristóbal' },
    { value: 'Usme', label: 'Usme' },
    { value: 'Tunjuelito', label: 'Tunjuelito' },
    { value: 'Bosa', label: 'Bosa' },
    { value: 'Kennedy', label: 'Kennedy' },
    { value: 'Fontibón', label: 'Fontibón' },
    { value: 'Engativá', label: 'Engativá' },
    { value: 'Suba', label: 'Suba' },
    { value: 'Barrios Unidos', label: 'Barrios Unidos' },
    { value: 'Teusaquillo', label: 'Teusaquillo' },
    { value: 'Los Mártires', label: 'Los Mártires' },
    { value: 'Antonio Nariño', label: 'Antonio Nariño' },
    { value: 'Puente Aranda', label: 'Puente Aranda' },
    { value: 'La Candelaria', label: 'La Candelaria' },
    { value: 'Rafael Uribe Uribe', label: 'Rafael Uribe Uribe' },
    { value: 'Ciudad Bolívar', label: 'Ciudad Bolívar' },
    { value: 'Sumapaz', label: 'Sumapaz' }
];

// Función helper para obtener el label de una localidad
export const getLocalityLabel = (localityValue) => {
    const locality = BOGOTA_LOCALITIES.find(loc => loc.value === localityValue);
    return locality ? locality.label : localityValue;
};