import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'

const WhatsAppButton = () => {
  const phoneNumber = '55997282539' // Substitua pelo seu número
  const message = encodeURIComponent('Olá! Vi seu portfólio e gostaria de conversar sobre um projeto.')

  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  return (
    <motion.button
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300"
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      title="Fale comigo no WhatsApp"
    >
      <FaWhatsapp className="text-2xl" />
      <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
        1
      </span>
    </motion.button>
  )
}

export default WhatsAppButton 