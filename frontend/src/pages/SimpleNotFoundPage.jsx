import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function SimpleNotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            className="h-16 w-auto" 
            src="/logo_petmatch.png" 
            alt="PetMatch logo" 
          />
        </div>

        {/* 404 grande */}
        <h1 className="text-9xl font-extrabold text-gray-900 tracking-widest">404</h1>
        
        
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-4">
          ¡Oops! Algo salió mal
        </h2>
        
        <p className="text-gray-600 mt-4 mb-8">
          La página que buscas no existe o ha sido movida.
        </p>

        {/* Botones */}
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate('/')}>
            Ir al inicio
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Volver atrás
          </Button>
        </div>
      </div>
    </div>
  );
}
