import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import { NavLink } from './Header/NavLink'
import { MenuButton } from './Header/MenuButton'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { FaUserCog } from 'react-icons/fa'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { scrollY } = useScroll()
  const { isAuthenticated } = useAuth()
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.95)']
  )

  const navItems = ['home', 'sobre', 'projetos', 'contato']

  // Fecha o menu quando a tela é redimensionada para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Impede o scroll quando o menu mobile está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <motion.header
      style={{ backgroundColor }}
      className="fixed top-0 w-full backdrop-blur-sm z-50 transition-all duration-300"
    >
      <nav className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.h1 
            className="text-xl font-bold text-white hover:text-orange-500 transition-colors cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Seu Nome
          </motion.h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink key={item} href={`#${item}`}>
                {item}
              </NavLink>
            ))}
            {isAuthenticated && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-colors"
                >
                  <FaUserCog className="text-base" />
                  Admin
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <MenuButton isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
          </div>

          {/* Menu Mobile */}
          <motion.div
            className="fixed inset-x-0 top-[72px] bottom-0 bg-black/95 backdrop-blur-lg md:hidden z-50"
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            variants={{
              closed: {
                opacity: 0,
                y: -20,
                display: 'none',
                transition: {
                  duration: 0.2,
                  display: { delay: 0.2 }
                }
              },
              open: {
                opacity: 1,
                y: 0,
                display: 'block',
                transition: {
                  duration: 0.2
                }
              }
            }}
          >
            <motion.nav
              className="flex flex-col items-center justify-start h-full pt-20 pb-20 px-6"
            >
              <motion.div 
                className="w-full max-w-md mx-auto bg-gradient-to-b from-orange-400 to-orange-500 rounded-3xl p-8 shadow-[0_0_25px_rgba(249,115,22,0.3)] border border-orange-300"
                variants={{
                  closed: { scale: 0.95, opacity: 0 },
                  open: { 
                    scale: 1, 
                    opacity: 1,
                    transition: { duration: 0.3 }
                  }
                }}
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item}
                    variants={{
                      closed: {
                        opacity: 0,
                        x: -20,
                        transition: {
                          duration: 0.1
                        }
                      },
                      open: {
                        opacity: 1,
                        x: 0,
                        transition: {
                          delay: index * 0.1,
                          duration: 0.2
                        }
                      }
                    }}
                    className="w-full"
                  >
                    <a
                      href={`#${item}`}
                      className="text-black hover:text-black/70 transition-all text-2xl uppercase tracking-wider py-5 w-full flex justify-center items-center font-bold hover:scale-105 relative group"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="relative">
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </a>
                    {index < navItems.length - 1 && (
                      <motion.div
                        className="h-px w-32 bg-gradient-to-r from-transparent via-black/20 to-transparent mx-auto"
                        variants={{
                          closed: { scaleX: 0 },
                          open: { 
                            scaleX: 1,
                            transition: {
                              delay: index * 0.1 + 0.1,
                              duration: 0.2
                            }
                          }
                        }}
                      />
                    )}
                  </motion.div>
                ))}
                {isAuthenticated && (
                  <motion.div
                    variants={{
                      closed: { opacity: 0, x: -20 },
                      open: { opacity: 1, x: 0 }
                    }}
                    className="mt-4"
                  >
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaUserCog className="text-base" />
                      Acessar Admin
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </motion.nav>
          </motion.div>
        </div>
      </nav>
    </motion.header>
  )
}

export default Header 