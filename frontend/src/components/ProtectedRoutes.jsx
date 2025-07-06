import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// Componente para rutas que requieren autenticación
export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Componente para rutas que requieren ser dueño de mascota
export const OwnerRoute = ({ children }) => {
  const { isLoggedIn, isOwner, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isOwner()) {
    return <Navigate to="/requests" replace />;
  }

  return children;
};

// Componente para rutas que requieren ser clínica
export const ClinicRoute = ({ children }) => {
  const { isLoggedIn, isClinic, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isClinic()) {
    return <Navigate to="/public" replace />;
  }

  return children;
};

// Componente para rutas públicas (solo accesibles si NO está autenticado)
export const PublicOnlyRoute = ({ children }) => {
  const { isLoggedIn, isLoading, userType } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    // Si está loggeado, redirigir según el tipo de usuario
    if (userType === 'clinic') {
      return <Navigate to="/requests" replace />;
    } else {
      return <Navigate to="/public" replace />;
    }
  }

  return children;
};
