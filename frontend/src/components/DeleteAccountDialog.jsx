import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import apiService from '@/services/api';

export default function DeleteAccountDialog({ isOpen, onClose, onConfirm, userData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setIsLoading(true);
    setError('');

    try {
      console.log('Eliminando cuenta del usuario:', userData.email);
      
      // Llamar a la API para eliminar la cuenta
      const response = await apiService.deleteUserAccount();
      
      if (response.success) {
        onConfirm();
      } else {
        setError('Error inesperado al eliminar la cuenta. Por favor, inténtalo de nuevo.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      setError(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="delete-account-description">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <DialogTitle className="text-red-900">
              Eliminar Cuenta Permanentemente
            </DialogTitle>
          </div>
          <DialogDescription id="delete-account-description" className="text-left space-y-2">
            <p className="text-gray-700">
              Estás a punto de eliminar permanentemente tu cuenta de <strong>Pet Match</strong>.
            </p>
            <p className="text-gray-700">
              Esta acción <strong>NO SE PUEDE DESHACER</strong> y resultará en:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Pérdida permanente de todos tus datos</li>
              <li>Eliminación de todas tus solicitudes de donación</li>
              <li>Pérdida del historial de aplicaciones</li>
              <li>Cancelación de todas las solicitudes pendientes</li>
            </ul>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-2">Cuenta a eliminar:</h4>
            <div className="text-sm text-red-800">
              <p><strong>Nombre:</strong> {userData?.name || 'No especificado'}</p>
              <p><strong>Email:</strong> {userData?.email || 'No especificado'}</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 font-medium">
              ⚠️ Esta acción es irreversible. Una vez confirmada, no podrás recuperar tu cuenta ni tus datos.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              'Sí, Eliminar Cuenta'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
