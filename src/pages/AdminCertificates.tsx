import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { certificateService, Certificate } from '../services/certificateService'
import { FaSpinner, FaTimes, FaPlus } from 'react-icons/fa'
import EditCertificateModal from '../components/EditCertificateModal'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)
  const [newCertificate, setNewCertificate] = useState({
    title: '',
    institution: '',
    date: '',
    image: null as File | null,
    link: ''
  })
  const [imagePreview, setImagePreview] = useState<string>('')
  const [deletingCertificate, setDeletingCertificate] = useState<Certificate | null>(null)

  useEffect(() => {
    loadCertificates()
  }, [])

  const loadCertificates = async () => {
    try {
      const data = await certificateService.getCertificates()
      setCertificates(data)
    } catch (err) {
      setError('Erro ao carregar certificados')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCertificate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newCertificate.title.trim()) {
      toast.error('Título é obrigatório')
      return
    }

    const promise = (async () => {
      setSubmitting(true)
      try {
        const formData = new FormData()
        formData.append('title', newCertificate.title)
        formData.append('institution', newCertificate.institution)
        formData.append('date', newCertificate.date)
        if (newCertificate.image) formData.append('image', newCertificate.image)
        formData.append('link', newCertificate.link)

        const certificate = await certificateService.createCertificate(formData)
        setCertificates([certificate, ...certificates])
        
        setNewCertificate({
          title: '',
          institution: '',
          date: '',
          image: null,
          link: ''
        })
        setImagePreview('')
        return 'Certificado adicionado com sucesso!'
      } catch (err) {
        throw new Error('Erro ao criar certificado')
      } finally {
        setSubmitting(false)
      }
    })()

    toast.promise(promise, {
      loading: 'Salvando certificado...',
      success: (message) => message,
      error: (err) => err.message
    })
  }

  const handleUpdateCertificate = async (updatedData: Partial<Certificate>) => {
    if (!editingCertificate) return

    const promise = (async () => {
      try {
        const updatedCertificate = await certificateService.updateCertificate(
          editingCertificate.id,
          updatedData
        )
        setCertificates(certificates.map(c => 
          c.id === updatedCertificate.id ? updatedCertificate : c
        ))
        setEditingCertificate(null)
        return 'Certificado atualizado com sucesso!'
      } catch (err) {
        throw new Error('Erro ao atualizar certificado')
      }
    })()

    toast.promise(promise, {
      loading: 'Atualizando certificado...',
      success: (message) => message,
      error: (err) => err.message
    })
  }

  const handleDeleteCertificate = async (certificate: Certificate) => {
    setDeletingCertificate(certificate)
  }

  const confirmDelete = async () => {
    if (!deletingCertificate) return

    const promise = (async () => {
      try {
        await certificateService.deleteCertificate(deletingCertificate.id)
        setCertificates(certificates.filter(c => c.id !== deletingCertificate.id))
        setDeletingCertificate(null)
        return 'Certificado excluído com sucesso!'
      } catch (err) {
        throw new Error('Erro ao excluir certificado')
      }
    })()

    toast.promise(promise, {
      loading: 'Excluindo certificado...',
      success: (message) => message,
      error: (err) => err.message
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <FaSpinner className="animate-spin text-4xl text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Formulário para novo certificado */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">Adicionar Novo Certificado</h2>
        <form onSubmit={handleCreateCertificate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              value={newCertificate.title}
              onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })}
              className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instituição
            </label>
            <input
              type="text"
              value={newCertificate.institution}
              onChange={(e) => setNewCertificate({ ...newCertificate, institution: e.target.value })}
              className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <input
              type="text"
              value={newCertificate.date}
              onChange={(e) => setNewCertificate({ ...newCertificate, date: e.target.value })}
              className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagem
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setNewCertificate({ ...newCertificate, image: file })
                  const reader = new FileReader()
                  reader.onloadend = () => {
                    setImagePreview(reader.result as string)
                  }
                  reader.readAsDataURL(file)
                }
              }}
              className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 h-32 object-cover rounded" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link da Credencial
            </label>
            <input
              type="url"
              value={newCertificate.link}
              onChange={(e) => setNewCertificate({ ...newCertificate, link: e.target.value })}
              className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="flex justify-end">
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
                <>
                  <FaPlus className="mr-2" />
                  Adicionar Certificado
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de certificados */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900">Certificados</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {certificates.map((certificate) => (
            <li key={certificate.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {certificate.image && (
                    <img 
                      src={certificate.image} 
                      alt={certificate.title} 
                      className="h-16 w-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">{certificate.title}</h4>
                    <p className="text-sm text-gray-500">{certificate.institution}</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setEditingCertificate(certificate)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteCertificate(certificate)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {editingCertificate && (
        <EditCertificateModal
          certificate={editingCertificate}
          onClose={() => setEditingCertificate(null)}
          onSave={handleUpdateCertificate}
        />
      )}

      <DeleteConfirmationModal
        isOpen={!!deletingCertificate}
        onClose={() => setDeletingCertificate(null)}
        onConfirm={confirmDelete}
        title="Excluir Certificado"
        message="Tem certeza que deseja excluir o certificado"
        itemName={deletingCertificate?.title || ''}
      />
    </div>
  )
}

export default AdminCertificates 