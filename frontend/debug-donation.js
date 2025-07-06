// Script de debug para DonationSelectionPage
// Pega esto en la consola del navegador cuando aparezca "Solicitud no encontrada"

console.log('=== DEBUG DONATION SELECTION ===');
console.log('URL actual:', window.location.href);
console.log('ID de la solicitud:', window.location.pathname.split('/').pop());

// Verificar localStorage para datos de usuario
console.log('Usuario autenticado:', localStorage.getItem('isLoggedIn'));
console.log('Tipo de usuario:', localStorage.getItem('userType'));

// Probar la API de solicitudes
fetch('http://localhost:8000/api/v1/user/solicitudes/activas/filtrar')
  .then(response => response.json())
  .then(data => {
    console.log('Solicitudes de la API:', data);
    console.log('IDs disponibles:', data.map(req => req.id));
  })
  .catch(error => {
    console.log('Error API:', error);
    console.log('Usando datos mock...');
  });

console.log('=== FIN DEBUG ===');
