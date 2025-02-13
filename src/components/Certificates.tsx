import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'

interface Certificate {
  id: number
  title: string
  institution: string
  date: string
  image: string
  link?: string
  description: string
}

const Certificates = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)

  const certificates: Certificate[] = [
    {
      id: 1,
      title: "Desenvolvimento Web Full Stack",
      institution: "Udemy",
      date: "2023",
      image: "/certificates/web-development.jpg",
      link: "https://www.udemy.com/certificate/XXX",
      description: "Curso completo de desenvolvimento web, incluindo HTML, CSS, JavaScript, React e Node.js"
    },
    // Adicione mais certificados aqui
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <section id="certificados" className="py-24 md:py-32 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-6 md:px-8">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-white relative"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Certificados
          <motion.span 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-orange-500"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          />
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {certificates.map((cert) => (
            <motion.div
              key={cert.id}
              variants={item}
              className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div 
                className="relative h-48 cursor-pointer"
                onClick={() => setSelectedCertificate(cert)}
              >
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm">Clique para ampliar</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {cert.title}
                </h3>
                <p className="text-orange-500 text-sm mb-2">
                  {cert.institution}
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  {cert.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">
                    {cert.date}
                  </span>
                  {cert.link && (
                    <motion.a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-400 flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-sm">Ver credencial</span>
                      <FaExternalLinkAlt className="text-xs" />
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal para visualização ampliada */}
        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCertificate(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative max-w-4xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selectedCertificate.image}
                alt={selectedCertificate.title}
                className="w-full rounded-lg"
              />
              <button
                onClick={() => setSelectedCertificate(null)}
                className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default Certificates 