import { motion } from 'framer-motion'
import { FaExclamationTriangle } from 'react-icons/fa'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  itemName: string
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <FaExclamationTriangle className="text-2xl" />
            <h3 className="text-xl font-bold">{title}</h3>
          </div>

          <p className="text-gray-600 mb-2">{message}</p>
          <p className="text-gray-800 font-medium mb-6">"{itemName}"</p>

          <div className="flex justify-end gap-3">
            <motion.button
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancelar
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={onConfirm}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Excluir
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DeleteConfirmationModal 