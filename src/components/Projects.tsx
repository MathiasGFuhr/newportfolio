import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { projectService, Project } from '../services/projectService'
import { FaSpinner, FaGithub, FaExternalLinkAlt } from 'react-icons/fa'

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  if (loading) {
    return (
      <section id="projetos" className="py-24 md:py-32 bg-black">
        <div className="container mx-auto px-6 md:px-8 flex justify-center items-center">
          <FaSpinner className="animate-spin text-4xl text-orange-500" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="projetos" className="py-24 md:py-32 bg-black">
        <div className="container mx-auto px-6 md:px-8">
          <p className="text-white text-center">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section id="projetos" className="py-24 md:py-32 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-6 md:px-8">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-white relative"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Meus Projetos
          <motion.span 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-orange-500"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          />
        </motion.h2>

        {projects.length === 0 ? (
          <p className="text-white text-center">Nenhum projeto cadastrado ainda.</p>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {projects.map((project) => (
              <motion.div 
                key={project.id}
                className="group bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl border border-white/10 hover:border-orange-500/50 transition-all duration-500"
                variants={item}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image || '/placeholder-project.jpg'} 
                    alt={project.title}
                    className="w-full h-48 sm:h-56 object-cover transform group-hover:scale-105 transition-all duration-1000 ease-out"
                  />
                  
                  {/* Overlay para desktop */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out backdrop-blur-[2px] hidden md:block">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700">
                      <div className="flex gap-4 transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 ease-out">
                        {project.github && (
                          <motion.a 
                            href={project.github}
                            className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-orange-500 transition-all duration-500 hover:shadow-lg hover:shadow-orange-500/25"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaGithub className="text-xl" />
                          </motion.a>
                        )}
                        {project.demo && (
                          <motion.a 
                            href={project.demo}
                            className="bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-orange-500 transition-all duration-500 hover:shadow-lg hover:shadow-orange-500/25"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaExternalLinkAlt className="text-xl" />
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-500 transition-colors duration-500">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  
                  {/* Botões para mobile */}
                  <div className="flex gap-3 mb-4 md:hidden">
                    {project.github && (
                      <a 
                        href={project.github}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-orange-500 transition-all duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaGithub className="text-lg" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {project.demo && (
                      <a 
                        href={project.demo}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-orange-500 transition-all duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaExternalLinkAlt className="text-lg" />
                        <span>Demo</span>
                      </a>
                    )}
                  </div>

                  {project.technologies && (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.split(',').map((tech, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 text-xs font-medium bg-orange-500/10 text-orange-500 rounded-full"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default Projects 