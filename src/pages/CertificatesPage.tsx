import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { certificateService, Certificate } from '../services/certificateService'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)

  useEffect(() => {
    loadCertificates()
  }, [])

  const loadCertificates = async () => {
    try {
      const data = await certificateService.getCertificates()
      setCertificates(data)
    } catch (error) {
      console.error('Erro ao carregar certificados:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), "dd-MM-yyyy", { locale: ptBR })
    } catch (error) {
      return date
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-24">
      <div className="container mx-auto px-6 md:px-8">
        <div className="mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center text-white hover:text-orange-500 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Voltar para Home
          </Link>
        </div>

        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-white relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Meus Certificados
          <motion.span 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-orange-500"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.2 }}
          />
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {certificates.map((cert) => (
            <motion.div
              key={cert.id}
              className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-300 flex flex-col h-full"
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

              <div className="p-6 flex flex-col flex-1">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {cert.title}
                  </h3>
                  <p className="text-orange-500 text-sm mt-1 mb-2">
                    {cert.institution}
                  </p>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <span className="text-orange-500 font-medium">
                      Concluído em:
                    </span>
                    {formatDate(cert.date)}
                  </p>
                </div>

                {cert.link && (
                  <motion.a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-orange-500 hover:text-orange-400 mt-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-sm">Ver credencial</span>
                    <FaExternalLinkAlt className="text-xs ml-2" />
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

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
    </div>
  )
}

export default CertificatesPage 