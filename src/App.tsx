import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Home from './pages/Home'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminLayout from './components/AdminLayout'
import { Toaster } from 'react-hot-toast'
import WhatsAppButton from './components/WhatsAppButton'
import { useEffect } from 'react'
import emailjs from '@emailjs/browser'
import { emailjsConfig } from './config/emailjs'
import Footer from './components/Footer'
import CertificatesPage from './pages/CertificatesPage'
import AdminProjects from './pages/AdminProjects'
import AdminCertificates from './pages/AdminCertificates'

function App() {
  useEffect(() => {
    emailjs.init(emailjsConfig.publicKey)
  }, [])

  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#F97316',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/certificados" element={<CertificatesPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="projetos" element={<AdminProjects />} />
            <Route path="certificados" element={<AdminCertificates />} />
          </Route>
        </Routes>
        {!window.location.pathname.includes('/admin') && (
          <>
            <WhatsAppButton />
            <Footer />
          </>
        )}
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
