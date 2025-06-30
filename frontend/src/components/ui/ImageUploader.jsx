import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, X, Upload } from 'lucide-react';

export default function ImageUploader({ 
  value, 
  onChange, 
  accept = ".jpg,.jpeg,.png",
  maxSize = 2 * 1024 * 1024, // 2MB
  className = ""
}) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Sincronizar preview con el valor externo
  useEffect(() => {
    if (value) {
      if (typeof value === 'string') {
        // Si es una URL string (imagen existente)
        setPreview(value);
      } else if (value instanceof File) {
        // Si es un archivo (imagen nueva)
        const url = URL.createObjectURL(value);
        setPreview(url);
        // Cleanup function para liberar memoria
        return () => URL.revokeObjectURL(url);
      }
    } else {
      // Si no hay valor, limpiar preview
      setPreview(null);
    }
  }, [value]);

  // Función para comprimir imagen
  const compressImage = (file, maxSize) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo la proporción
        let { width, height } = img;
        const maxDimension = 800; // Máximo 800px en cualquier lado
        
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a blob con calidad reducida si es necesario
        let quality = 0.8;
        const tryCompress = () => {
          canvas.toBlob((blob) => {
            if (blob.size <= maxSize || quality <= 0.1) {
              resolve(blob);
            } else {
              quality -= 0.1;
              tryCompress();
            }
          }, 'image/jpeg', quality);
        };
        
        tryCompress();
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError('');
    setIsLoading(true);

    try {
      // Validar tipo de archivo específicamente JPG y PNG
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        throw new Error('Por favor selecciona solo archivos JPG o PNG');
      }

      let processedFile = file;

      // Comprimir si excede el tamaño máximo
      if (file.size > maxSize) {
        console.log(`Comprimiendo imagen de ${(file.size / 1024 / 1024).toFixed(2)}MB...`);
        processedFile = await compressImage(file, maxSize);
        console.log(`Imagen comprimida a ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`);
      }

      // Crear preview
      const previewUrl = URL.createObjectURL(processedFile);
      setPreview(previewUrl);

      // Llamar onChange con el archivo procesado
      if (onChange) {
        onChange(processedFile);
      }

    } catch (err) {
      setError(err.message);
      console.error('Error procesando imagen:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    // Cleanup de URL si existe
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onChange) {
      onChange(null);
    }
  };

  const handleClick = () => {
    // Limpiar el input file para permitir seleccionar la misma imagen nuevamente o cambiar
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    fileInputRef.current?.click();
  };

  // Handlers para drag & drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      // Simular el evento del input file
      const fakeEvent = {
        target: { files: [files[0]] }
      };
      await handleFileSelect(fakeEvent);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Vista previa o área de subida */}
      <Card className="relative overflow-hidden">
        <CardContent className="p-0">
          {preview ? (
            <div className="space-y-3">
              {/* Imagen sin overlays complejos */}
              <div className="relative">
                <img
                  src={preview}
                  alt="Vista previa de la mascota"
                  className="w-full h-48 object-cover rounded-md"
                  style={{ backgroundColor: 'transparent' }}
                  onError={(e) => {
                    console.error('Error loading image:', e);
                    console.error('Image src was:', e.target.src);
                    setError('Error al cargar la imagen. Intenta con otra imagen.');
                    setPreview(null);
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', preview);
                    setError(''); // Clear any previous errors
                  }}
                />
              </div>
              
              {/* Botones debajo de la imagen */}
              <div className="flex gap-2 justify-center">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleClick}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Cambiar imagen
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            </div>
          ) : (
            <div
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`h-48 flex flex-col items-center justify-center cursor-pointer transition-colors border-2 border-dashed ${
                isDragOver 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              {isLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-gray-600">Procesando imagen...</p>
                </div>
              ) : (
                <>
                  <Upload className={`h-12 w-12 mb-2 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
                  <p className={`text-sm font-medium ${isDragOver ? 'text-blue-700' : 'text-gray-700'}`}>
                    {isDragOver ? 'Suelta la imagen aquí' : 'Subir foto de mascota'}
                  </p>
                  <p className={`text-xs ${isDragOver ? 'text-blue-600' : 'text-gray-500'}`}>
                    Haz clic aquí o arrastra una imagen
                  </p>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información y errores */}
      <div className="space-y-1">
        {error && (
          <p className="text-red-500 text-xs">{error}</p>
        )}
        <p className="text-xs text-gray-500">
          Formatos soportados: JPG, PNG. Tamaño máximo: {(maxSize / 1024 / 1024).toFixed(0)}MB
        </p>
        {preview && (
          <p className="text-xs text-green-600">
            ✓ Imagen cargada correctamente. Usa los botones para cambiarla o eliminarla.
          </p>
        )}
      </div>
    </div>
  );
}
