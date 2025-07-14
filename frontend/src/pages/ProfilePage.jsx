import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EditProfileForm from '@/components/EditProfileForm';
import DeleteAccountDialog from '@/components/DeleteAccountDialog';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const { userData, userType, logout, updateUserData } = useAuth();
  const navigate = useNavigate();

  // Verificar autenticación
  if (!userData) {
    navigate('/login');
    return null;
  }

  const handleEditSuccess = (updatedData) => {
    console.log('Perfil actualizado:', updatedData);
    // Actualizar el contexto con los nuevos datos
    updateUserData(updatedData);
    setIsEditing(false);
    
    // Mostrar mensaje de éxito temporal
    setShowUpdateSuccess(true);
    setTimeout(() => setShowUpdateSuccess(false), 3000);
  };

  const handleDeleteAccount = () => {
    console.log('Cuenta eliminada');
    logout();
    navigate('/');
  };

  const getRoleDisplay = () => {
    return userType === 'clinic' ? 'Clínica Veterinaria' : 'Dueño de Mascota';
  };

  const getRoleBadgeColor = () => {
    return userType === 'clinic' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              className="mb-4"
            >
              ← Volver al perfil
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Editar Perfil</h1>
            <p className="text-gray-600">Actualiza tu información personal</p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <EditProfileForm 
                userData={userData}
                userType={userType}
                onSuccess={handleEditSuccess}
                onCancel={() => setIsEditing(false)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información personal y configuración de cuenta</p>
        </div>

        {/* Mensaje de éxito */}
        {showUpdateSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              ¡Perfil actualizado exitosamente! Los cambios se han guardado.
            </div>
          </div>
        )}

        {/* Información del perfil */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-xl">{userData.name || 'Usuario'}</CardTitle>
                  <Badge className={`${getRoleBadgeColor()} mt-1`}>
                    {getRoleDisplay()}
                  </Badge>
                </div>
              </div>
              <Button onClick={() => setIsEditing(true)}>
                Editar Perfil
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Información de contacto */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Información de Contacto</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{userData.email || 'No especificado'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Teléfono</label>
                    <p className={`${userData.phone ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                      {userData.phone || 'No especificado - Agregar en editar perfil'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Dirección</label>
                    <p className={`${userData.address ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                      {userData.address || 'No especificado - Agregar en editar perfil'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Información específica por tipo */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  {userType === 'clinic' ? 'Información de Ubicación' : 'Información Adicional'}
                </h3>
                <div className="space-y-3">
                  {userType === 'clinic' && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Localidad</label>
                      <p className={`${userData.locality ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                        {userData.locality || 'No especificado - Agregar en editar perfil'}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tipo de Usuario</label>
                    <p className="text-gray-900">{getRoleDisplay()}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de cuenta */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Cuenta</CardTitle>
            <p className="text-gray-600">Gestiona las opciones de tu cuenta</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Cambiar Contraseña</h4>
                  <p className="text-sm text-gray-600">Actualiza tu contraseña por seguridad</p>
                </div>
                <Button variant="outline" onClick={() => navigate('/change-password')}>
                  Cambiar
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50">
                <div>
                  <h4 className="font-medium text-red-900">Eliminar Cuenta</h4>
                  <p className="text-sm text-red-600">
                    Esta acción es permanente y no se puede deshacer
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteDialog(true)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dialog de confirmación de eliminación */}
        <DeleteAccountDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteAccount}
          userData={userData}
        />
      </div>
    </div>
  );
}
