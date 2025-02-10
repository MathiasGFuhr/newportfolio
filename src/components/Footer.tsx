import { motion } from 'framer-motion'
import { FaEnvelope, FaMapMarkerAlt, FaGithub, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/mathiasfuhr', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://linkedin.com/in/mathias-fuhr', label: 'LinkedIn' }
  ]

  return (
    <footer className="bg-gradient-to-b from-black to-gray-900 py-12 text-white/80">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Informações de Contato */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-orange-500 mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-orange-500 text-lg" />
                <span>Alecrim, RS</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-orange-500 text-lg" />
                <a 
                  href="mailto:mathiasgilvanf@gmail.com"
                  className="hover:text-orange-500 transition-colors"
                >
                  mathiasgilvanf@gmail.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* Redes Sociais e Copyright */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <h3 className="text-xl font-bold text-orange-500 mb-4">Redes Sociais</h3>
              <div className="flex gap-4">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-orange-500 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <link.icon className="text-2xl" />
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div className="text-sm text-white/60">
              <p>&copy; {currentYear} Mathias Gilvan. Todos os direitos reservados.</p>
            </div>
          </motion.div>
        </div>

        {/* Linha decorativa */}
        <motion.div 
          className="mt-8 pt-8 border-t border-white/10"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-center text-sm text-white/40">
            Desenvolvido com <span className="text-orange-500">♥</span> por Mathias Gilvan
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer 