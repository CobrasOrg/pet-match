import React from 'react'

const Footer = () => {
  return (
    <footer className="mt-15 px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-500 bg-soft-green">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
        <div className="md:max-w-96">
          <div className="flex items-center gap-3">
            <img className="h-9" src="/logo_petmatch.png" alt="Logo PetMatch" />
            <div className="flex flex-col">
              <span className="text-md font-bold text-gray-800">PetMatch</span>
              <span className="text-sm text-gray-500">Conectando vidas</span>
            </div>
          </div>

          <p className="mt-6 text-sm">
            La red de donación de sangre para mascotas en la que puedes confiar.
PetMatch simplifica la conexión entre donantes y receptores, promoviendo una comunidad de ayuda mutua para el bienestar animal.
          </p>
        </div>

        {/* Enlaces */}
        <div className="flex-1 flex items-start md:justify-end gap-20">
          <div>
            <h2 className="font-semibold mb-5 text-gray-800">Compañia</h2>
            <ul className="text-sm space-y-2">
              <li><a href="#">Inicio</a></li>
              <li><a href="#">Sobre nosotros </a></li>
              <li><a href="#">Contacto</a></li>
              <li><a href="#">Política de privacidad</a></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-5 text-gray-800">Contáctanos</h2>
            <div className="text-sm space-y-2">
              <p>+1-212-456-7890</p>
              <p>contact@example.com</p>
            </div>
          </div>
        </div>
      </div>

      <p className="pt-4 text-center text-xs md:text-sm pb-5">
        Copyright 2025 © PetMatch. All Rights Reserved.
      </p>
    </footer>
  )
}

export default Footer
