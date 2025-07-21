import React from 'react';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center bg-no-repeat text-white w-screen relative left-1/2 right-1/2 mx-[-50vw]" style={{backgroundImage: 'url("/vet.jpg")'}}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight opacity-0 translate-y-8 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
              ¿Quiénes Somos?
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed opacity-0 translate-y-8 animate-[fadeInUp_0.8s_ease-out_0.5s_forwards]">
              La plataforma líder que conecta mascotas en situaciones críticas con donadores 
              de sangre, revolucionando la medicina veterinaria de emergencia.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Company Overview */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-8">
              Transformando la Medicina Veterinaria de Emergencia
            </h2>
            <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
              <p>
                PetMatch es una plataforma digital que facilita la conexión entre mascotas 
                que necesitan transfusiones sanguíneas y donadores compatibles en su área local, 
                ayudando a reducir los tiempos de búsqueda en situaciones de emergencia.
              </p>
              <p>
                Nuestro sistema permite a veterinarios y dueños de mascotas encontrar donadores 
                de manera más eficiente, organizando la información de compatibilidad sanguínea 
                y ubicación para facilitar el proceso de transfusión.
              </p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-3xl p-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
              Beneficios Clave
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex-shrink-0 mt-1 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Búsqueda Rápida</h4>
                  <p className="text-slate-600">Encuentra donadores compatibles en tu zona de forma inmediata</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex-shrink-0 mt-1 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Compatibilidad Verificada</h4>
                  <p className="text-slate-600">Sistema que organiza tipos sanguíneos y características</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex-shrink-0 mt-1 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Red de Veterinarios</h4>
                  <p className="text-slate-600">Conecta profesionales y facilita el proceso médico</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex-shrink-0 mt-1 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Fácil de Usar</h4>
                  <p className="text-slate-600">Interfaz simple tanto para dueños como veterinarios</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="bg-gradient-to-br from-slate-50 to-indigo-50 w-screen relative left-1/2 right-1/2 mx-[-50vw] py-24 mb-24">
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-indigo-100/50 to-purple-100/50"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Nuestra Razón de Ser
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto"></div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 lg:p-12 border border-slate-200/50 shadow-xl hover:bg-white/90 transition-all duration-300">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">Nuestra Misión</h3>
                </div>
                <p className="text-slate-700 text-lg leading-relaxed">
                  Facilitar conexiones efectivas entre mascotas que necesitan transfusiones sanguíneas 
                  y donadores compatibles, creando una red de apoyo que salva vidas en momentos críticos 
                  a través de tecnología confiable y accesible.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 lg:p-12 border border-slate-200/50 shadow-xl hover:bg-white/90 transition-all duration-300">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">Nuestra Visión</h3>
                </div>
                <p className="text-slate-700 text-lg leading-relaxed">
                  Ser la plataforma de referencia para transfusiones veterinarias, expandiendo 
                  nuestra red de colaboración y mejorando continuamente para hacer la diferencia 
                  en la vida de mascotas y sus familias.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="max-w-7xl mx-auto px-4 mb-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">Nuestros Principios</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Los valores que nos guían para ofrecer un mejor servicio.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Confiabilidad</h3>
                <p className="text-slate-600 leading-relaxed">
                  Trabajamos para mantener información precisa y actualizada, 
                  facilitando conexiones seguras entre usuarios de la plataforma.
                </p>
              </div>
            </div>

            <div className="group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Mejora Continua</h3>
                <p className="text-slate-600 leading-relaxed">
                  Buscamos constantemente formas de mejorar nuestra plataforma 
                  basándonos en las necesidades de usuarios y veterinarios.
                </p>
              </div>
            </div>

            <div className="group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Apoyo Comunitario</h3>
                <p className="text-slate-600 leading-relaxed">
                  Promovemos la colaboración entre dueños de mascotas y profesionales 
                  para crear una red de apoyo solidaria en situaciones de necesidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
