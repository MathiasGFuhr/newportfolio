import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaWhatsapp, FaCode } from 'react-icons/fa'

const Hero = () => {
  const socialLinks = [
    {
      icon: FaGithub,
      href: "https://github.com/MathiasGFuhr",
      label: "GitHub",
      color: "hover:text-gray-700"
    },
    {
      icon: FaLinkedin,
      href: "https://www.linkedin.com/in/mathiasgilvanfuhr/",
      label: "LinkedIn",
      color: "hover:text-blue-600"
    },
    {
      icon: FaWhatsapp,
      href: "https://wa.me/55997282539",
      label: "WhatsApp",
      color: "hover:text-green-500"
    }
  ]

  return (
    <section id="home" className="min-h-screen pt-24 md:pt-32 flex items-center bg-gradient-to-b from-black via-black to-gray-900">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16 py-8 md:py-12">
          <motion.div 
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Olá, eu sou<br />
              <motion.span 
                className="text-orange-500 hover:text-orange-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Mathias Fuhr
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Desenvolvedor Front-End em transição de carreira, apaixonado por criar interfaces dinâmicas e amigáveis
            </motion.p>

            <motion.div 
              className="flex items-center justify-center md:justify-start gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white ${color} text-2xl sm:text-3xl transition-all`}
                  whileHover={{ 
                    scale: 1.2,
                    rotate: 360,
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.9 }}
                  title={label}
                >
                  <Icon />
                </motion.a>
              ))}
            </motion.div>

            <div className="flex justify-center md:justify-start">
              <motion.a 
                href="/cv-mathias-fuhr.pdf"
                className="group bg-orange-500 text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-orange-600 transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(249,115,22,0.5)" }}
                whileTap={{ scale: 0.95 }}
                download
              >
                Download CV
                <motion.svg 
                  className="w-4 h-4"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </motion.a>
            </div>
          </motion.div>
          <motion.div 
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {/* Container Principal */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg transform rotate-6 shadow-xl"
                animate={{ rotate: [6, -6, 6] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Camada de Código */}
              <motion.div
                className="absolute inset-0 bg-black/90 rounded-lg backdrop-blur-sm p-6 flex flex-col justify-center items-center"
              >
                <div className="w-full space-y-3">
                  {/* Linhas de "código" */}
                  <motion.div 
                    className="h-3 w-3/4 bg-orange-500/20 rounded"
                    animate={{ width: ["75%", "60%", "75%"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div 
                    className="h-3 w-1/2 bg-orange-500/30 rounded"
                    animate={{ width: ["50%", "70%", "50%"] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <motion.div 
                    className="h-3 w-2/3 bg-orange-500/40 rounded"
                    animate={{ width: ["66%", "40%", "66%"] }}
                    transition={{ duration: 3.5, repeat: Infinity }}
                  />
                  
                  {/* Ícone Central */}
                  <motion.div
                    className="text-6xl text-orange-500 my-6 flex justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaCode />
                  </motion.div>
                  
                  {/* Mais linhas de "código" */}
                  <motion.div 
                    className="h-3 w-2/3 bg-orange-500/40 rounded"
                    animate={{ width: ["66%", "80%", "66%"] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <motion.div 
                    className="h-3 w-1/2 bg-orange-500/30 rounded"
                    animate={{ width: ["50%", "30%", "50%"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div 
                    className="h-3 w-3/4 bg-orange-500/20 rounded"
                    animate={{ width: ["75%", "90%", "75%"] }}
                    transition={{ duration: 3.5, repeat: Infinity }}
                  />
                </div>
              </motion.div>

              {/* Elementos decorativos flutuantes */}
              <motion.div
                className="absolute -top-4 -right-4 text-2xl text-orange-500"
                animate={{ y: [-10, 10, -10], rotate: [0, 360] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                {'</>'}
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-4 text-2xl text-orange-500"
                animate={{ y: [10, -10, 10], rotate: [360, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                {'{...}'}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero 