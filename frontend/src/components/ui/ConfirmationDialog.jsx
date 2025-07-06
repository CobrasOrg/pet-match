import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmationDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "¿Estás seguro?",
  message = "Esta acción no se puede deshacer.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "destructive" // "destructive" or "default"
}) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error en confirmación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            {variant === "destructive" && (
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            )}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">{message}</p>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              variant={variant}
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Procesando...' : confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
