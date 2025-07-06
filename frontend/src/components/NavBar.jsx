import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const NavBar = () => {
    const [open, setOpen] = React.useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
    const { isLoggedIn, userType, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    
    // Detectar en qué página estamos
    const isOnRegisterPage = location.pathname === '/register';
    const isOnLoginPage = location.pathname === '/login';

    // Forzar actualización del estado cuando cambie la ruta
    React.useEffect(() => {
        // Este efecto se ejecuta cada vez que cambia la ruta
        // Ayuda a sincronizar el estado después de navegaciones programáticas
    }, [location.pathname]);

    const handleLogout = () => {
        setProfileMenuOpen(false);
        logout();
    };

    // Cerrar el menú de perfil cuando se hace clic fuera
    React.useEffect(() => {
        const handleClickOutside = () => {
            setProfileMenuOpen(false);
        };

        if (profileMenuOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [profileMenuOpen]);

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all ">
            <NavLink to="/" className="flex items-center gap-3">
                <img className="h-12 w-auto" src="/logo_petmatch.png" alt="PetMatch logo" />
                <div className="flex flex-col">
                    <span className="text-xl font-bold text-gray-800">PetMatch</span>
                    <span className="text-sm text-gray-500">Conectando vidas</span>
                </div>
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-6">

                {isLoggedIn ? (
                    <div className="relative">
                        <button
                            className="flex items-center gap-2 hover:text-indigo-500 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setProfileMenuOpen(!profileMenuOpen);
                            }}
                        >
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#615fff">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            {/* Icono de flecha para indicar que es un menú */}
                            <svg
                                className={`w-4 h-4 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Menú desplegable */}
                        {profileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in-0 zoom-in-95">
                                <NavLink
                                    to="/profile"
                                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                                    onClick={() => setProfileMenuOpen(false)}
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Mi Perfil
                                    </div>
                                </NavLink>
                                {userType === 'owner' && (
                                    <>
                                        <NavLink
                                            to="/my-pets"
                                            className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                                            onClick={() => setProfileMenuOpen(false)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                                Mis Mascotas
                                            </div>
                                        </NavLink>
                                        <NavLink
                                            to="/public"
                                            className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                                            onClick={() => setProfileMenuOpen(false)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Ver Solicitudes
                                            </div>
                                        </NavLink>
                                    </>
                                )}
                                {userType === 'clinic' && (
                                    <NavLink
                                        to="/requests"
                                        className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                                        onClick={() => setProfileMenuOpen(false)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Mis Solicitudes
                                        </div>
                                    </NavLink>
                                )}
                                <hr className="my-1 border-gray-100" />
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Cerrar sesión
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>                ) : (
                    <div className="flex gap-2">
                        {/* Botón de Iniciar sesión (oculto en la página de login) */}
                        {!isOnLoginPage && (
                            <button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 bg-white border border-blue-500 hover:bg-blue-50 text-blue-700 rounded-full text-sm transition-colors"
                            >
                                Iniciar sesión
                            </button>
                        )}
                        
                        {/* Botón de Registrarse (oculto en la página de registro) */}
                        {!isOnRegisterPage && (
                            <button
                                onClick={() => navigate('/register')}
                                className="px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-full text-sm transition-colors"
                            >
                                Registrarme
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setOpen(!open)} aria-label="Menu" className="sm:hidden">
                <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="21" height="1.5" rx=".75" fill="#426287" />
                    <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
                    <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
                </svg>
            </button>

            {/* Mobile Menu */}
            <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-4 px-5 text-sm md:hidden`}>
        
        

                {isLoggedIn ? (
                    <div className="w-full border-t border-gray-200 pt-3 mt-2">
                        <NavLink to="/profile" className="block w-full py-2" onClick={() => setOpen(false)}>Perfil</NavLink>

                        {userType === 'owner' && (
                            <>
                                <NavLink to="/my-pets" className="block w-full py-2" onClick={() => setOpen(false)}>Mis Mascotas</NavLink>
                                <NavLink to="/public" className="block w-full py-2" onClick={() => setOpen(false)}>Ver Solicitudes</NavLink>
                            </>
                        )}

                        {userType === 'clinic' && (
                            <NavLink to="/requests" className="block w-full py-2" onClick={() => setOpen(false)}>Mis Solicitudes</NavLink>
                        )}

                        <button
                            onClick={() => {
                                handleLogout();
                                setOpen(false);
                            }}
                            className="block w-full text-left py-2"
                        >
                            Cerrar sesión
                        </button>
                    </div>                ) : (
                    <div className="w-full border-t border-gray-200 pt-3 mt-2 flex flex-col gap-2">
                        {/* Botón de Iniciar sesión (oculto en la página de login) */}
                        {!isOnLoginPage && (
                            <button
                                onClick={() => {
                                    navigate('/login');
                                    setOpen(false);
                                }}
                                className="w-full text-left py-2 px-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                            >
                                Iniciar sesión
                            </button>
                        )}
                        
                        {/* Botón de Registrarse (oculto en la página de registro) */}
                        {!isOnRegisterPage && (
                            <button
                                onClick={() => {
                                    navigate('/register');
                                    setOpen(false);
                                }}
                                className="w-full text-left py-2 px-4 bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
                            >
                                Registrarme
                            </button>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;