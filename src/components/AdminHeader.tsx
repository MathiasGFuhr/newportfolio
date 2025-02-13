import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { FaHome, FaSignOutAlt, FaCode, FaCertificate, FaBars, FaTimes } from 'react-icons/fa'
import { useState } from 'react'

const AdminHeader = () => {
  const { logout } = useAuth()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Ver Site', icon: FaHome },
    { path: '/admin/projetos', label: 'Projetos', icon: FaCode },
    { path: '/admin/certificados', label: 'Certificados', icon: FaCertificate }
  ]

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/admin/dashboard"
              className="text-xl font-bold text-gray-900 hover:text-orange-500 transition-colors"
            >
              Admin
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex ml-8">
              <ul className="flex space-x-4">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path
                  
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors
                          ${isActive 
                            ? 'bg-orange-500 text-white' 
                            : 'text-gray-700 hover:bg-orange-50 hover:text-orange-500'
                          }`}
                      >
                        {item.icon && <item.icon className="text-base" />}
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>

          {/* Desktop Logout */}
          <div className="hidden md:flex items-center">
            <motion.button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-orange-500 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSignOutAlt />
              Sair
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-orange-500 transition-colors"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        initial={false}
        animate={isMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 transition-colors
                  ${isActive 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-500'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon && <item.icon className="text-base" />}
                {item.label}
              </Link>
            )
          })}
          
          {/* Mobile Logout */}
          <button
            onClick={() => {
              setIsMenuOpen(false)
              logout()
            }}
            className="w-full px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
          >
            <FaSignOutAlt />
            Sair
          </button>
        </div>
      </motion.div>
    </header>
  )
}

export default AdminHeader 