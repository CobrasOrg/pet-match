import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DogIcon,
  CatIcon,
  CalendarIcon,
  ScaleIcon,
  HeartIcon,
  ShieldCheckIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  UserIcon
} from 'lucide-react';

const SPECIES_LABELS = {
  canine: 'Perro',
  feline: 'Gato'
};

const STATUSES = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Aprobado', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rechazado', color: 'bg-red-100 text-red-800' }
};

export default function DonorProfileDialog({ application, isOpen, onClose }) {
  if (!application) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HeartIcon className="h-5 w-5 text-red-500" />
            Perfil del Donante
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información de la Mascota */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {application.petPhoto ? (
                  <img 
                    src={application.petPhoto} 
                    alt={application.petName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  application.species === 'canine' ? 
                    <DogIcon className="h-8 w-8 text-gray-400" /> : 
                    <CatIcon className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{application.petName || 'Sin nombre'}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {application.species === 'canine' ? 
                    <DogIcon className="h-4 w-4" /> : 
                    <CatIcon className="h-4 w-4" />
                  }
                  <span>{SPECIES_LABELS[application.species] || application.species} - {application.breed || 'N/A'}</span>
                </div>
                {application.status && STATUSES[application.status] && (
                  <Badge className={STATUSES[application.status].color}>
                    {STATUSES[application.status].label}
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <CalendarIcon className="h-5 w-5 mx-auto mb-1 text-gray-500" />
                <div className="text-sm font-medium">{application.age ?? 'N/A'} años</div>
                <div className="text-xs text-gray-500">Edad</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <ScaleIcon className="h-5 w-5 mx-auto mb-1 text-gray-500" />
                <div className="text-sm font-medium">{application.weight ?? 'N/A'} kg</div>
                <div className="text-xs text-gray-500">Peso</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <HeartIcon className="h-5 w-5 mx-auto mb-1 text-red-500" />
                <div className="text-sm font-medium">{application.bloodType || 'N/A'}</div>
                <div className="text-xs text-gray-500">Tipo de Sangre</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <ShieldCheckIcon className="h-5 w-5 mx-auto mb-1 text-green-500" />
                <div className="text-sm font-medium">
                  {formatDate(application.lastVaccination)}
                </div>
                <div className="text-xs text-gray-500">Última Vacuna</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Estado de Salud */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <ShieldCheckIcon className="h-4 w-4" />
              Estado de Salud
            </h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {application.healthStatus || 'N/A'}
            </p>
          </div>

          <Separator />

          {/* Información del Dueño */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Información del Dueño
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <div className="font-medium">{application.ownerName || 'N/A'}</div>
                  <div className="text-sm text-gray-500">Propietario</div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <PhoneIcon className="h-4 w-4 text-gray-400" />
                  <span>{application.ownerPhone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MailIcon className="h-4 w-4 text-gray-400" />
                  <span>{application.ownerEmail || 'N/A'}</span>
                </div>
                {application.ownerAddress && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                    <span>{application.ownerAddress}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Historial de Donaciones */}
          {application.donationHistory && application.donationHistory.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <HeartIcon className="h-4 w-4 text-red-500" />
                Historial de Donaciones
              </h4>
              <div className="space-y-2">
                {application.donationHistory.map((donation, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">{formatDate(donation.date)}</span>
                    <Badge variant="outline">{donation.clinic}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fecha de Aplicación */}
          <div className="text-xs text-gray-500 text-center">
            Postulación realizada el {formatDate(application.applicationDate)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}