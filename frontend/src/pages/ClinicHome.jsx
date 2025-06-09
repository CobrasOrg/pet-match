import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { PlusIcon, ActivityIcon, DropletIcon, AlertTriangleIcon, CalendarIcon } from 'lucide-react';
import BloodRequestForm from '@/components/BloodRequestForm';
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useNavigate } from 'react-router-dom';

export default function ClinicHome() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRequests, setActiveRequests] = useState(3);
  const [matchedDonors, setMatchedDonors] = useState(5);
  const [urgentCases, setUrgentCases] = useState(2);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      // Simulación de envío a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generar un ID ficticio para la demo
      const mockId = Math.floor(Math.random() * 10000);
      
      toast.success(
        <div className="flex flex-col gap-1">
          <h4 className="font-bold">¡Solicitud creada exitosamente!</h4>
          <p className="text-sm">
            Te avisaremos cuando alguien se postule.
          </p>
          <div className="mt-1 text-xs text-gray-500">
            ID: #{mockId} • {new Date().toLocaleDateString()}
          </div>
        </div>,
        {
          duration: 8000,
          action: {
            label: 'Ver solicitud',
            onClick: () => navigate(`/requests/${mockId}`)
          }
        }
      );
      
      setActiveRequests(prev => prev + 1);
      setIsOpen(false);
    } catch (error) {
      toast.error('Error al crear la solicitud', {
        description: 'Por favor intenta nuevamente o contacta soporte',
      });
    }
  };

  // Mock data para solicitudes recientes
  const recentRequests = [
    { id: 1, species: 'Canino', bloodType: 'DEA 1.1+', urgency: 'Alta', date: '2023-11-15' },
    { id: 2, species: 'Felino', bloodType: 'A', urgency: 'Media', date: '2023-11-10' },
    { id: 3, species: 'Canino', bloodType: 'DEA 4-', urgency: 'Baja', date: '2023-11-05' }
  ];

  return (
    <div className="container mx-auto p-6">
      {/* Componente Toaster - debe estar en la raíz */}
      <Toaster position="top-right" richColors expand={true} />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Panel Clínica Veterinaria</h1>
          <p className="text-gray-600">Bienvenido al sistema de donaciones sanguíneas</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <PlusIcon className="mr-2 h-4 w-4" /> Nueva Solicitud
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Nueva Solicitud de Donación</h2>
            <BloodRequestForm onSubmit={handleSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={<ActivityIcon className="h-6 w-6" />}
          title="Solicitudes Activas"
          value={activeRequests}
          color="text-blue-600"
        />
        <StatCard 
          icon={<DropletIcon className="h-6 w-6" />}
          title="Donantes Compatibles"
          value={matchedDonors}
          color="text-green-600"
        />
        <StatCard 
          icon={<AlertTriangleIcon className="h-6 w-6" />}
          title="Casos Urgentes"
          value={urgentCases}
          color="text-red-600"
        />
      </div>

      {/* Recent Requests Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Solicitudes Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especie</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Sanguíneo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgencia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.species}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.bloodType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.urgency === 'Alta' ? 'bg-red-100 text-red-800' : 
                        request.urgency === 'Media' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {request.urgency}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 px-6 py-3">
          <p className="text-xs text-gray-500">Mostrando {recentRequests.length} solicitudes</p>
        </CardFooter>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button variant="outline" className="border-blue-300 text-blue-600">
          <DropletIcon className="mr-2 h-4 w-4" /> Ver donantes disponibles
        </Button>
        <Button variant="outline" className="border-green-300 text-green-600">
          <ActivityIcon className="mr-2 h-4 w-4" /> Historial de solicitudes
        </Button>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
      </CardContent>
    </Card>
  );
}