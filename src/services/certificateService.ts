import { supabase } from '../lib/supabase'

export interface Certificate {
  id: number
  title: string
  institution: string
  date: string
  image: string
  link?: string
  created_at?: string
}

export const certificateService = {
  async getCertificates() {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async createCertificate(formData: FormData) {
    try {
      let imageUrl = ''
      const image = formData.get('image') as File

      if (image && image instanceof File) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `certificate-images/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, image)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(filePath)

        imageUrl = data.publicUrl
      }

      const certificateData = {
        title: formData.get('title') as string,
        institution: formData.get('institution') as string,
        date: formData.get('date') as string,
        image: imageUrl,
        link: formData.get('link') as string || ''
      }

      const { data, error } = await supabase
        .from('certificates')
        .insert([certificateData])
        .select()

      if (error) {
        console.error('Erro detalhado:', error)
        throw error
      }
      return data[0]
    } catch (error) {
      console.error('Erro completo:', error)
      throw error
    }
  },

  async updateCertificate(id: number, certificate: Partial<Certificate>) {
    const { data, error } = await supabase
      .from('certificates')
      .update(certificate)
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  async deleteCertificate(id: number) {
    const { error } = await supabase
      .from('certificates')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
} 