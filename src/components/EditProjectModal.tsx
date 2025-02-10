import { motion } from 'framer-motion'
import { Project } from '../services/projectService'
import { useState } from 'react'
import { FaSpinner } from 'react-icons/fa'

interface EditProjectModalProps {
  project: Project
  onClose: () => void
  onSave: (project: Partial<Project>) => Promise<void>
}

const EditProjectModal = ({ project, onClose, onSave }: EditProjectModalProps) => {
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description,
    github: project.github || '',
    demo: project.demo || '',
    technologies: project.technologies || ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div 
        className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 className="text-xl font-bold mb-4">Editar Projeto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tecnologias
            </label>
            <input
              type="text"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
              placeholder="React, TypeScript, Tailwind..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link do GitHub
            </label>
            <input
              type="url"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link do Deploy
            </label>
            <input
              type="url"
              value={formData.demo}
              onChange={(e) => setFormData({ ...formData, demo: e.target.value })}
              className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 flex items-center"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default EditProjectModal 