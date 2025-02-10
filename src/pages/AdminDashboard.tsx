import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { projectService, Project } from '../services/projectService'
import { FaSpinner, FaTimes } from 'react-icons/fa'
import EditProjectModal from '../components/EditProjectModal'
import toast from 'react-hot-toast'

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

  const availableTechnologies = [
    'React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind',
    'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Supabase',
    'Next.js', 'Vue.js', 'Angular', 'Firebase', 'AWS',
    'Docker', 'Git', 'REST API', 'GraphQL'
  ]

  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [techInput, setTechInput] = useState('')

  useEffect(() => {
    loadProjects()
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

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <FaSpinner className="animate-spin text-4xl text-orange-500" />
      </div>
    )
  }

  return (
    <div>
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
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">Projetos</h3>
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
          </div>
        </div>
      </div>

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleUpdateProject}
        />
      )}
    </div>
  )
}

export default AdminDashboard
