import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { projectService, Project } from '../services/projectService'
import { FaSpinner, FaTimes, FaPlus } from 'react-icons/fa'
import EditProjectModal from '../components/EditProjectModal'
import toast from 'react-hot-toast'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    image: null as File | null,
    github: '',
    demo: '',
    technologies: ''
  })
  const [imagePreview, setImagePreview] = useState<string>('')
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)

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

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newProject.title.trim()) {
      toast.error('Título é obrigatório')
      return
    }

    const promise = (async () => {
      setSubmitting(true)
      try {
        const formData = new FormData()
        formData.append('title', newProject.title)
        formData.append('description', newProject.description || '')
        if (newProject.image) formData.append('image', newProject.image)
        formData.append('github', newProject.github)
        formData.append('demo', newProject.demo)
        formData.append('technologies', newProject.technologies)

        const project = await projectService.createProject(formData)
        setProjects([project, ...projects])
        
        setNewProject({
          title: '',
          description: '',
          image: null,
          github: '',
          demo: '',
          technologies: ''
        })
        setImagePreview('')
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

  const handleUpdateProject = async (updatedData: Partial<Project>) => {
    if (!editingProject) return

    const promise = (async () => {
      try {
        const updatedProject = await projectService.updateProject(
          editingProject.id,
          updatedData
        )
        setProjects(projects.map(p => 
          p.id === updatedProject.id ? updatedProject : p
        ))
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

  const handleDeleteProject = async (project: Project) => {
    setDeletingProject(project)
  }

  const confirmDelete = async () => {
    if (!deletingProject) return

    const promise = (async () => {
      try {
        await projectService.deleteProject(deletingProject.id)
        setProjects(projects.filter(p => p.id !== deletingProject.id))
        setDeletingProject(null)
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

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <FaSpinner className="animate-spin text-4xl text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Formulário para novo projeto */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">Adicionar Novo Projeto</h2>
        <form onSubmit={handleCreateProject} className="space-y-4">
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
              Descrição (opcional)
            </label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
              rows={3}
              placeholder="Descrição do projeto (opcional)"
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
                  Adicionar Projeto
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de projetos */}
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
                    <p className="text-sm text-gray-500">{project.description}</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project)}
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

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleUpdateProject}
        />
      )}

      <DeleteConfirmationModal
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={confirmDelete}
        title="Excluir Projeto"
        message="Tem certeza que deseja excluir o projeto"
        itemName={deletingProject?.title || ''}
      />
    </div>
  )
}

export default AdminProjects 