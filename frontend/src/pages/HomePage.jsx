import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaPaw, FaUserMd } from 'react-icons/fa';
import petImg from '../assets/pet-hero.png';
import { UserPlus, Search, HeartHandshake, Hospital, MapPin, ShieldCheck, Zap } from "lucide-react";
import { Quote } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white font-[Inter]">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="py-20 px-4 bg-soft-green w-screen relative left-1/2 right-1/2 mx-[-50vw] rounded-b-lg"
      >
      
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 pl-8 md:pl-16 lg:pl-24 ">
          {/* Content */}
          <div className="flex-1 space-y-6 ">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
              <span className="block text-soft-green mb-2">Pet Match</span>
              <span className="block text-3xl md:text-4xl font-medium text-gray-700">
                Salvando vidas, conectando corazones
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Conectamos mascotas que necesitan transfusiones de sangre con donantes dispuestos a ayudar.
              Únete a nuestra comunidad y ayuda a salvar vidas peludas.
            </p>
            <div className="flex gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-8 py-3 text-lg font-semibold">
                  <FaPaw className="inline mr-2" /> Únete como Donante
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-blue-500 text-blue-600 rounded-xl px-8 py-3 text-lg font-semibold">
                  <FaUserMd className="inline mr-2" /> Soy Veterinario
                </Button>
              </Link>
            </div>
          </div>
          {/* Imagen de mascota */}
          <div className="flex-1 flex justify-center">
            <img
              src={petImg}
              alt="Mascota feliz"
              className="w-100 h-120 max-w-md object-contain rounded-3xl"
            />
          </div>
        </div>
      </motion.section>
   

      {/* Statistics Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
        className="py-16 bg-white"
      >
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
              <div className="text-5xl font-bold text-green-600 mb-2">500+</div>
              <p className="text-gray-600">Vidas Salvadas</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">200+</div>
              <p className="text-gray-600">Donantes Registrados</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">50+</div>
              <p className="text-gray-600">Clínicas Veterinarias</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
        className="py-16 bg-gradient-to-br from-emerald-100 via-white to-emerald-100 w-screen relative left-1/2 right-1/2 mx-[-50vw]"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-raleway">
              ¿Cómo Funciona?
            </h2>
            <p className="text-xl text-gray-600">
              Proceso simple y seguro para ayudar
            </p>
          </div>
          
              <div className="grid md:grid-cols-3 gap-8">
              <Card className="group max-w-xs mx-auto rounded-xl transition-all duration-300 hover:bg-blue-400 shadow-md">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-100 group-hover:bg-white rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                    <UserPlus className="w-7 h-7 text-emerald-600 group-hover:text-emerald-700 transition-colors duration-300" />
                  </div>
                 <CardTitle className="text-neutral-800 group-hover:text-white transition-colors duration-300">
                   1. Regístrate
                  </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 group-hover:text-white text-center transition-colors duration-300">
                  Crea tu perfil como dueño de mascota o clínica veterinaria en minutos.
                </p>
              </CardContent>
            </Card>

            
            <Card className="group max-w-xs mx-auto rounded-xl transition-all duration-300 hover:bg-blue-400 shadow-md">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 group-hover:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-sky-600 transition-colors duration-300 " />
                </div>
                <CardTitle className="text-neutral-800 group-hover:text-white transition-colors duration-300">
                  2. Encuentra Coincidencias</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 group-hover:text-white text-center transition-colors duration-300">
                  Conectamos mascotas compatibles según tipo sanguíneo y ubicación.
                </p>
              </CardContent>
            </Card>

            <Card className="group max-w-xs mx-auto rounded-xl transition-all duration-300 hover:bg-blue-400 shadow-md">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 group-hover:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartHandshake className="w-7 h-7 text-rose-600" />
                </div>
                <CardTitle className="text-neutral-800 group-hover:text-white transition-colors duration-300">
                  3. Salva Vidas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 group-hover:text-white text-center transition-colors duration-300">
                  Coordina la donación con profesionales veterinarios de forma segura.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
        className="py-16 bg-white"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Pet Match?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Hospital className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Clínicas Verificadas</h3>
              <p className="text-gray-600 text-sm">
                Trabajamos solo con profesionales veterinarios certificados.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-sky-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Cobertura Local</h3>
              <p className="text-gray-600 text-sm">
                Encuentra donantes y receptores en tu localidad.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-7 h-7 text-rose-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Seguro y Confiable</h3>
              <p className="text-gray-600 text-sm">
                Protegemos la información de mascotas y dueños.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Respuesta Rápida</h3>
              <p className="text-gray-600 text-sm">
                Notificaciones inmediatas para casos urgentes.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-300 to-blue-600 w-screen relative left-1/2 right-1/2 mx-[-50vw]">
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
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
        className="py-16 bg-white"
      >
      
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Historias que Inspiran
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <Quote className="w-6 h-6 text-emerald-500 mb-4" />
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

            <Card className="transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <Quote className="w-6 h-6 text-sky-500 mb-4" />
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
      </motion.section>
    </div>
  );
};

export default HomePage;