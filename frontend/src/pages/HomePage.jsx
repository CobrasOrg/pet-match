import React from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import cat from '../assets/cat.json';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Salvando Vidas
                <span className="text-green-600 block">Una Donación a la Vez</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Conectamos mascotas que necesitan transfusiones de sangre con donantes dispuestos a ayudar. 
                Únete a nuestra comunidad y ayuda a salvar vidas peludas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                    Únete como Donante
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Animation */}
            <div className="flex justify-center">
              <Lottie 
                animationData={cat} 
                loop={true} 
                className="w-80 h-80 md:w-96 md:h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Impacto en Números
            </h2>
            <p className="text-xl text-gray-600">
              Juntos estamos marcando la diferencia
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <p className="text-gray-600">Vidas Salvadas</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">200+</div>
              <p className="text-gray-600">Donantes Registrados</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
              <p className="text-gray-600">Clínicas Veterinarias</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo Funciona?
            </h2>
            <p className="text-xl text-gray-600">
              Proceso simple y seguro para ayudar
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🐾</span>
                </div>
                <CardTitle>1. Regístrate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Crea tu perfil como dueño de mascota o clínica veterinaria en minutos.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <CardTitle>2. Encuentra Coincidencias</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Conectamos mascotas compatibles según tipo sanguíneo y ubicación.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❤️</span>
                </div>
                <CardTitle>3. Salva Vidas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Coordina la donación con profesionales veterinarios de forma segura.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Pet Match?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🏥</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Clínicas Verificadas</h3>
              <p className="text-gray-600 text-sm">
                Trabajamos solo con profesionales veterinarios certificados.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">📍</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Cobertura Local</h3>
              <p className="text-gray-600 text-sm">
                Encuentra donantes y receptores en tu localidad.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🔒</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Seguro y Confiable</h3>
              <p className="text-gray-600 text-sm">
                Protegemos la información de mascotas y dueños.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Respuesta Rápida</h3>
              <p className="text-gray-600 text-sm">
                Notificaciones inmediatas para casos urgentes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para Hacer la Diferencia?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Únete a nuestra comunidad y ayuda a salvar vidas de mascotas hoy mismo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Registrar mi Mascota
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Soy Veterinario
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Historias que Inspiran
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4 italic">
                  "Gracias a Pet Match, pudimos encontrar un donante para Luna en menos de 2 horas. 
                  Los veterinarios fueron increíbles y todo el proceso fue muy profesional."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold">MC</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">María Castillo</p>
                    <p className="text-sm text-gray-600">Dueña de Luna</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4 italic">
                  "Como veterinario, Pet Match me ha permitido conectar rápidamente con donantes 
                  cuando tengo casos de emergencia. Es una herramienta invaluable."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold">DR</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Dr. Roberto Silva</p>
                    <p className="text-sm text-gray-600">Veterinario</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;