import { supabase } from '../lib/supabase'

export interface Project {
  id: number
  title: string
  description: string
  image: string
  github: string
  demo: string
  technologies?: string
  created_at?: string
}

export const projectService = {
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async createProject(formData: FormData) {
    try {
      let imageUrl = ''
      const image = formData.get('image') as File

      if (image && image instanceof File) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `project-images/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, image)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(filePath)

        imageUrl = data.publicUrl
      }

      const projectData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        image: imageUrl,
        github: formData.get('github') as string || '',
        demo: formData.get('demo') as string || '',
        ...(formData.get('technologies') && {
          technologies: formData.get('technologies') as string
        })
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Erro ao criar projeto:', error)
      throw error
    }
  },

  async updateProject(id: number, project: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  async deleteProject(id: number) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async uploadImage(file: File) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `project-images/${fileName}`

    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (error) throw error

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return data.publicUrl
  }
} 