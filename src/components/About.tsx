import { motion } from 'framer-motion'
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaGitAlt, FaMobile } from 'react-icons/fa'
import { SiTypescript, SiTailwindcss } from 'react-icons/si'

const About = () => {
  const skills = [
    {
      name: "HTML5",
      icon: FaHtml5,
      color: "hover:text-orange-500"
    },
    {
      name: "CSS3",
      icon: FaCss3Alt,
      color: "hover:text-blue-500"
    },
    {
      name: "JavaScript",
      icon: FaJs,
      color: "hover:text-yellow-400"
    },
    {
      name: "React.js",
      icon: FaReact,
      color: "hover:text-cyan-400"
    },
    {
      name: "TypeScript",
      icon: SiTypescript,
      color: "hover:text-blue-600"
    },
    {
      name: "Tailwind CSS",
      icon: SiTailwindcss,
      color: "hover:text-teal-500"
    },
    {
      name: "Git",
      icon: FaGitAlt,
      color: "hover:text-orange-600"
    },
    {
      name: "Responsive",
      icon: FaMobile,
      color: "hover:text-purple-500"
    }
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <section id="sobre" className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-6 md:px-8">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-black relative"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Sobre Mim
          <motion.span 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-orange-500"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          />
        </motion.h2>
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-700 leading-relaxed">
              Profissional em transição de carreira da área da saúde para o desenvolvimento web, 
              trazendo uma perspectiva única que combina habilidades analíticas, atenção aos detalhes 
              e foco no usuário final.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Atualmente, estou focado no desenvolvimento front-end, com ênfase em criar interfaces 
              intuitivas e responsivas utilizando tecnologias modernas como React.js e TypeScript. 
              Minha experiência anterior na área da saúde me proporcionou habilidades valiosas em 
              comunicação, trabalho em equipe e resolução de problemas complexos.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Busco constantemente aprimorar meus conhecimentos através de projetos práticos e estudos 
              contínuos, sempre com o objetivo de entregar soluções que combinem excelência técnica 
              com uma ótima experiência do usuário.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24"
          >
            <motion.h3 
              className="text-2xl md:text-3xl font-bold mb-12 text-black text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Habilidades Técnicas
            </motion.h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                >
                  <motion.div
                    className={`text-4xl md:text-5xl mb-2 text-gray-700 ${skill.color} transition-all duration-300`}
                    whileHover={{ 
                      scale: 1.2,
                      rotate: 360,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <skill.icon />
                  </motion.div>
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <h4 className="font-medium text-gray-800">{skill.name}</h4>
                    <motion.div
                      className="h-1 w-0 bg-orange-500 mt-1 mx-auto rounded-full"
                      whileInView={{
                        width: "100%",
                        transition: {
                          delay: index * 0.1 + 0.3,
                          duration: 0.5,
                          ease: "easeOut"
                        }
                      }}
                      viewport={{ once: true }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About 