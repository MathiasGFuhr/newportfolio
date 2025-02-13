import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { projectService, Project } from '../services/projectService'
import { FaSpinner, FaTimes, FaPlus } from 'react-icons/fa'
import EditProjectModal from '../components/EditProjectModal'
import toast from 'react-hot-toast'
import { certificateService, Certificate } from '../services/certificateService'
import EditCertificateModal from '../components/EditCertificateModal'

const AdminDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    image: null as File | null,
    github: '',
    demo: '',
    technologies: ''
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)
  const [newCertificate, setNewCertificate] = useState({
    title: '',
    institution: '',
    date: '',
    description: '',
    image: null as File | null,
    link: ''
  })

  const availableTechnologies = [
    'React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind',
    'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Supabase',
    'Next.js', 'Vue.js', 'Angular', 'Firebase', 'AWS',
    'Docker', 'Git', 'REST API', 'GraphQL'
  ]

  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [techInput, setTechInput] = useState('')

  // Estado para controlar os modais de criação
  const [isAddingProject, setIsAddingProject] = useState(false)
  const [isAddingCertificate, setIsAddingCertificate] = useState(false)

  useEffect(() => {
    loadProjects()
    loadCertificates()
  }, [])

  const loadProjects = async () => {
    try {
      const data = await projectService.getProjects()
      setProjects(data)
    } catch (err) {
      setError('Erro ao carregar projetos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadCertificates = async () => {
    try {
      const data = await certificateService.getCertificates()
      setCertificates(data)
    } catch (err) {
      setError('Erro ao carregar certificados')
      console.error(err)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('A imagem deve ter no máximo 5MB')
        return
      }
      setNewProject({ ...newProject, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newProject.title.trim() || !newProject.description.trim()) {
      toast.error('Título e descrição são obrigatórios')
      return
    }

    const promise = (async () => {
      setSubmitting(true)
      try {
        const formData = new FormData()
        formData.append('title', newProject.title)
        formData.append('description', newProject.description)
        if (newProject.image) formData.append('image', newProject.image)
        formData.append('github', newProject.github)
        formData.append('demo', newProject.demo)
        formData.append('technologies', newProject.technologies)

        const project = await projectService.createProject(formData)
        setProjects([project, ...projects])
        
        // Reset form
        setNewProject({
          title: '',
          description: '',
          image: null,
          github: '',
          demo: '',
          technologies: ''
        })
        setImagePreview(null)
        setSelectedTechs([])
        return 'Projeto adicionado com sucesso!'
      } catch (err) {
        throw new Error('Erro ao criar projeto')
      } finally {
        setSubmitting(false)
      }
    })()

    toast.promise(promise, {
      loading: 'Salvando projeto...',
      success: (message) => message,
      error: (err) => err.message
    })
  }

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este projeto?')) return

    const promise = (async () => {
      try {
        await projectService.deleteProject(id)
        setProjects(projects.filter(p => p.id !== id))
        return 'Projeto excluído com sucesso!'
      } catch (err) {
        throw new Error('Erro ao excluir projeto')
      }
    })()

    toast.promise(promise, {
      loading: 'Excluindo projeto...',
      success: (message) => message,
      error: (err) => err.message
    })
  }

  const handleEditProject = async (project: Project) => {
    setEditingProject(project)
  }

  const handleUpdateProject = async (updatedData: Partial<Project>) => {
    if (!editingProject) return

    const promise = (async () => {
      try {
        const updatedProject = await projectService.updateProject(editingProject.id, updatedData)
        setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p))
        setEditingProject(null)
        return 'Projeto atualizado com sucesso!'
      } catch (err) {
        throw new Error('Erro ao atualizar projeto')
      }
    })()

    toast.promise(promise, {
      loading: 'Atualizando projeto...',
      success: (message) => message,
      error: (err) => err.message
    })
  }

  const handleTechSelect = (tech: string) => {
    if (!selectedTechs.includes(tech)) {
      const newTechs = [...selectedTechs, tech]
      setSelectedTechs(newTechs)
      setNewProject({ ...newProject, technologies: newTechs.join(', ') })
    }
    setTechInput('')
  }

  const removeTech = (techToRemove: string) => {
    const newTechs = selectedTechs.filter(tech => tech !== techToRemove)
    setSelectedTechs(newTechs)
    setNewProject({ ...newProject, technologies: newTechs.join(', ') })
  }

  const filteredTechs = availableTechnologies.filter(tech => 
    tech.toLowerCase().includes(techInput.toLowerCase()) &&
    !selectedTechs.includes(tech)
  )

  const handleCreateCertificate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newCertificate.title.trim() || !newCertificate.description.trim()) {
      toast.error('Título e descrição são obrigatórios')
      return
    }

    const promise = (async () => {
      setSubmitting(true)
      try {
        const formData = new FormData()
        formData.append('title', newCertificate.title)
        formData.append('institution', newCertificate.institution)
        formData.append('date', newCertificate.date)
        formData.append('description', newCertificate.description)
        if (newCertificate.image) formData.append('image', newCertificate.image)
        formData.append('link', newCertificate.link)

        const certificate = await certificateService.createCertificate(formData)
        setCertificates([certificate, ...certificates])
        
        setNewCertificate({
          title: '',
          institution: '',
          date: '',
          description: '',
          image: null,
          link: ''
        })
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

  const handleDeleteCertificate = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este certificado?')) return

    const promise = (async () => {
      try {
        await certificateService.deleteCertificate(id)
        setCertificates(certificates.filter(c => c.id !== id))
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

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <FaSpinner className="animate-spin text-4xl text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Projetos</h1>
        <p className="mt-1 text-sm text-gray-500">
          Adicione, edite ou remova projetos do seu portfólio.
        </p>
      </div>

      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {error && (
              <motion.div 
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div 
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {success}
              </motion.div>
            )}

            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold mb-6">Adicionar Novo Projeto</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tecnologias
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Digite para buscar tecnologias..."
                      />
                      {techInput && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto">
                          {filteredTechs.map(tech => (
                            <button
                              key={tech}
                              onClick={() => handleTechSelect(tech)}
                              className="w-full px-4 py-2 text-left hover:bg-orange-50 text-sm"
                            >
                              {tech}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTechs.map(tech => (
                        <span 
                          key={tech}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full"
                        >
                          {tech}
                          <button
                            onClick={() => removeTech(tech)}
                            className="hover:text-orange-600"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição *
                    </label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link do GitHub
                    </label>
                    <input
                      type="url"
                      value={newProject.github}
                      onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link do Deploy
                    </label>
                    <input
                      type="url"
                      value={newProject.demo}
                      onChange={(e) => setNewProject({ ...newProject, demo: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Imagem do Projeto
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
                    />
                    {imagePreview && (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="mt-2 h-32 object-cover rounded"
                      />
                    )}
                  </div>
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
                      'Adicionar Projeto'
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Projetos</h3>
                <button
                  onClick={() => setIsAddingProject(true)}
                  className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <FaPlus className="mr-2" />
                  Novo Projeto
                </button>
              </div>
              <ul className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <li key={project.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {project.image && (
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="h-16 w-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">{project.title}</h4>
                          <p className="text-sm text-gray-500">{project.technologies}</p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
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

            <div className="bg-white shadow rounded-lg overflow-hidden mt-8">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Certificados</h3>
                <button
                  onClick={() => setIsAddingCertificate(true)}
                  className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <FaPlus className="mr-2" />
                  Novo Certificado
                </button>
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
                          onClick={() => handleDeleteCertificate(certificate.id)}
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
          </div>
        </div>
      </div>

      {/* Modal para Adicionar Projeto */}
      {isAddingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Novo Projeto</h2>
              <button
                onClick={() => setIsAddingProject(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
                  rows={3}
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
                      setNewProject({ ...newProject, image: file })
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
                  Link do GitHub
                </label>
                <input
                  type="url"
                  value={newProject.github}
                  onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link do Deploy
                </label>
                <input
                  type="url"
                  value={newProject.demo}
                  onChange={(e) => setNewProject({ ...newProject, demo: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tecnologias
                </label>
                <input
                  type="text"
                  value={newProject.technologies}
                  onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
                  placeholder="React, TypeScript, Tailwind..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddingProject(false)}
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
      )}

      {/* Modal para Adicionar Certificado */}
      {isAddingCertificate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Novo Certificado</h2>
              <button
                onClick={() => setIsAddingCertificate(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
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
                  Descrição
                </label>
                <textarea
                  value={newCertificate.description}
                  onChange={(e) => setNewCertificate({ ...newCertificate, description: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
                  rows={3}
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
                    }
                  }}
                  className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
                />
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

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddingCertificate(false)}
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
      )}

      {/* Modais de Edição */}
      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleUpdateProject}
        />
      )}

      {editingCertificate && (
        <EditCertificateModal
          certificate={editingCertificate}
          onClose={() => setEditingCertificate(null)}
          onSave={handleUpdateCertificate}
        />
      )}
    </div>
  )
}

export default AdminDashboard
