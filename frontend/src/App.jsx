import React from 'react'
import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import RequestsPage from './pages/RequestsPage'
import RequestDetailPage from './pages/RequestDetailPage'
import PublicRequestsFeed from './pages/PublicRequestsPage'
import DonationApplicationForm from '@/components/DonationApplicationForm'
import RequestApplications from '@/pages/RequestApplicationsPage'
import HomePage from '@/pages/HomePage'

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
        </Routes>
      </div>
    </div>
  )
}

export default App
