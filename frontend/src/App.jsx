import React from 'react'
import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import RequestsPage from './pages/RequestsPage'
import RequestDetailPage from './pages/RequestDetailPage'
import PublicRequestsFeed from './pages/PublicRequestsPage'
import RequestApplications from '@/pages/RequestApplicationsPage'
import HomePage from '@/pages/HomePage'
import Footer from '@/components/Footer'
import { Toaster } from 'sonner'
import RegisterPage from './pages/auth/RegisterPage'
import LoginPage from './pages/auth/LoginPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import ChangePasswordPage from './pages/auth/ChangePasswordPage'
import ProfilePage from './pages/ProfilePage'
import MyPetsPage from './pages/MyPetsPage'
import { 
  ProtectedRoute, 
  OwnerRoute, 
  ClinicRoute, 
  PublicOnlyRoute 
} from './components/ProtectedRoutes'

const App = () => {
  return (
    <div>
      <NavBar />
      <div className='px-6 md:px-16 lg:px-24 xl:px-32'>
        <Routes>
          {/* Rutas públicas - accesibles para todos */}
          <Route path="/" element={<HomePage />} />
          
          {/* Rutas solo para usuarios NO autenticados */}
          <Route path="/register" element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          } />
          <Route path="/login" element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicOnlyRoute>
              <ForgotPasswordPage />
            </PublicOnlyRoute>
          } />
          
          {/* Ruta para restablecer contraseña - accesible para todos */}
          <Route 
            path="/reset-password/:token" 
            element={<ResetPasswordPage />} 
          />
          
          {/* Rutas para usuarios autenticados */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/change-password" element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          } />

          {/* Rutas específicas para DUEÑOS de mascotas */}
          <Route path="/public" element={
            <OwnerRoute>
              <PublicRequestsFeed />
            </OwnerRoute>
          } />
          <Route path="/my-pets" element={
            <OwnerRoute>
              <MyPetsPage />
            </OwnerRoute>
          } />

          {/* Rutas específicas para CLÍNICAS */}
          <Route path="/requests" element={
            <ClinicRoute>
              <RequestsPage />
            </ClinicRoute>
          } />
          <Route path="/requests/:id/applications" element={
            <ClinicRoute>
              <RequestApplications />
            </ClinicRoute>
          } />

          {/* Rutas accesibles para ambos tipos de usuario autenticado */}
          <Route path="/requests/:id" element={
            <ProtectedRoute>
              <RequestDetailPage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
      <Footer /> 
      <Toaster position="top-center" />
    </div>
  )
}

export default App
