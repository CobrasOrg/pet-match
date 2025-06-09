// Localidades de Bogotá
export const BOGOTA_LOCALITIES = [
    { value: 'usaquen', label: 'Usaquén' },
    { value: 'chapinero', label: 'Chapinero' },
    { value: 'santa_fe', label: 'Santa Fe' },
    { value: 'san_cristobal', label: 'San Cristóbal' },
    { value: 'usme', label: 'Usme' },
    { value: 'tunjuelito', label: 'Tunjuelito' },
    { value: 'bosa', label: 'Bosa' },
    { value: 'kennedy', label: 'Kennedy' },
    { value: 'fontibon', label: 'Fontibón' },
    { value: 'engativa', label: 'Engativá' },
    { value: 'suba', label: 'Suba' },
    { value: 'barrios_unidos', label: 'Barrios Unidos' },
    { value: 'teusaquillo', label: 'Teusaquillo' },
    { value: 'martires', label: 'Los Mártires' },
    { value: 'antonio_narino', label: 'Antonio Nariño' },
    { value: 'puente_aranda', label: 'Puente Aranda' },
    { value: 'candelaria', label: 'La Candelaria' },
    { value: 'rafael_uribe', label: 'Rafael Uribe Uribe' },
    { value: 'ciudad_bolivar', label: 'Ciudad Bolívar' },
    { value: 'sumapaz', label: 'Sumapaz' }
];

// Función helper para obtener el label de una localidad
export const getLocalityLabel = (localityValue) => {
    const locality = BOGOTA_LOCALITIES.find(loc => loc.value === localityValue);
    return locality ? locality.label : localityValue;
};