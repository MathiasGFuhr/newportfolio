import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface NavLinkProps {
  href: string
  children: React.ReactNode
}

export const NavLink = ({ href, children }: NavLinkProps) => {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const section = document.querySelector(href)
      if (section) {
        const rect = section.getBoundingClientRect()
        setIsActive(rect.top >= -100 && rect.top <= 150)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [href])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const section = document.querySelector(href)
    if (section) {
      window.scrollTo({
        top: section.getBoundingClientRect().top + window.pageYOffset - 80,
        behavior: 'smooth'
      })
    }
  }

  return (
    <motion.div className="relative">
      <a 
        href={href} 
        onClick={scrollToSection}
        className={`text-white hover:text-orange-500 transition-all hover:scale-110 uppercase text-sm tracking-wider ${
          isActive ? 'text-orange-500' : ''
        }`}
      >
        {children}
      </a>
      {isActive && (
        <motion.div
          layoutId="activeSection"
          className="absolute -bottom-2 left-0 right-0 h-0.5 bg-orange-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  )
} 