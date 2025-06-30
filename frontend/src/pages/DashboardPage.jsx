import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HeartHandshake, 
  Calendar, 
  MapPin, 
  Phone,
  Mail,
  Plus,
  Eye,
  Users,
  BarChart3
} from 'lucide-react';

export default function DashboardPage() {
  const { userData, userType } = useAuth();
  const navigate = useNavigate();

  // Verificar autenticación
  if (!userData) {
    navigate('/login');
    return null;
  }

  const getRoleDisplay = () => {
    return userType === 'clinic' ? 'Clínica Veterinaria' : 'Dueño de Mascota';
  };

  const getRoleBadgeColor = () => {
    return userType === 'clinic' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  // Mock data para el dashboard
  const dashboardStats = {
    owner: {
      activeRequests: 2,
      totalApplications: 8,
      successfulDonations: 3,
      savedLives: 5
    },
    clinic: {
      activeRequests: 12,
      patientsHelped: 45,
      partneredOwners: 23,
      emergencyCases: 7
    }
  };

  const stats = userType === 'clinic' ? dashboardStats.clinic : dashboardStats.owner;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ¡Hola, {userData.name || 'Usuario'}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Bienvenido a tu panel de control de Pet Match
              </p>
            </div>
            <Badge className={`${getRoleBadgeColor()} text-sm px-3 py-1`}>
              {getRoleDisplay()}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {userType === 'owner' ? (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <HeartHandshake className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Solicitudes Activas</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeRequests}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Aplicaciones Recibidas</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Donaciones Exitosas</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.successfulDonations}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <HeartHandshake className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Vidas Salvadas</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.savedLives}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Solicitudes Activas</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeRequests}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pacientes Ayudados</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.patientsHelped}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <HeartHandshake className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Dueños Asociados</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.partneredOwners}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Calendar className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Casos de Emergencia</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.emergencyCases}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => navigate('/requests')} 
                className="w-full justify-start"
                variant="outline"
              >
                <Plus className="mr-2 h-4 w-4" />
                {userType === 'owner' ? 'Crear Nueva Solicitud' : 'Ver Todas las Solicitudes'}
              </Button>
              <Button 
                onClick={() => navigate('/public')} 
                className="w-full justify-start"
                variant="outline"
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver Solicitudes Públicas
              </Button>
              <Button 
                onClick={() => navigate('/profile')} 
                className="w-full justify-start"
                variant="outline"
              >
                <Users className="mr-2 h-4 w-4" />
                Editar Mi Perfil
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mi Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{userData.email}</span>
              </div>
              {userData.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{userData.phone}</span>
                </div>
              )}
              {userData.address && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{userData.address}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity - Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <HeartHandshake className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                Aquí aparecerá tu actividad reciente cuando comiences a usar Pet Match
              </p>
              <Button onClick={() => navigate('/public')}>
                Explorar Solicitudes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
