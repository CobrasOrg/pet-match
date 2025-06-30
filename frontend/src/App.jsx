import React from 'react'
import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import RequestsPage from './pages/RequestsPage'
import RequestDetailPage from './pages/RequestDetailPage'
import PublicRequestsFeed from './pages/PublicRequestsPage'
import DonationApplicationForm from '@/components/DonationApplicationForm'
import RequestApplications from '@/pages/RequestApplicationsPage'
import HomePage from '@/pages/HomePage'
import Footer from '@/components/Footer'
import { Toaster } from 'sonner'
import RegisterPage from './pages/auth/RegisterPage'
import LoginPage from './pages/auth/LoginPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import ProfilePage from './pages/ProfilePage'
import DashboardPage from './pages/DashboardPage'
import MyPetsPage from './pages/MyPetsPage'

const App = () => {
  return (
    <div>
      <NavBar />
      <div className='px-6 md:px-16 lg:px-24 xl:px-32'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/requests/:id" element={<RequestDetailPage />} />
          <Route path="/public" element={<PublicRequestsFeed />} />
          <Route path="/apply/:id" element={<DonationApplicationForm />} />
          <Route path="/requests/:id/applications" element={<RequestApplications />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-pets" element={<MyPetsPage />} />
        </Routes>
      </div>
      <Footer /> 
      <Toaster position="top-center" />
    </div>
  )
}

export default App
