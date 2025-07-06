import { useNavigate } from 'react-router-dom';
import ChangePasswordForm from '@/components/auth/ChangePasswordForm';

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const handlePasswordChangeSuccess = () => {
    // Redirigir de vuelta al perfil después del cambio exitoso
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ChangePasswordForm onSuccess={handlePasswordChangeSuccess} />
      </div>
    </div>
  );
}
