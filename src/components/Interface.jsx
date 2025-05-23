import { useForm, ValidationError } from '@formspree/react'
import { motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { links, pageAtom, pages, sectionAtom } from '../globals'

function Section({ children, mobileTop, idx }) {
  const [section] = useAtom(sectionAtom)
  const [visible, setVisible] = useState(section === idx)
  const ANIMATION_TIME = 200

  useEffect(() => {
    let timeout = null

    if (section === idx) {
      requestAnimationFrame(() => setVisible(true))
    }
    else {
      timeout = setTimeout(() => setVisible(false), ANIMATION_TIME)
    }

    return () => {
      if (timeout)
        clearTimeout(timeout)
    }
  }, [section, idx])

  return (
    <motion.section
      className={`
        h-screen w-screen p-8 mx-auto
        flex flex-col items-start section
        ${mobileTop ? 'justify-start md:justify-center' : 'justify-center'}
        absolute
        transition-all duration-${ANIMATION_TIME} ease-in-out
      `}
      initial={{ opacity: 0, display: 'none' }}
      animate={{
        opacity: section === idx ? 1 : 0,
        display: visible ? 'flex' : 'none',
      }}
    >
      {children}
    </motion.section>
  )
};

import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiNexusmods } from "react-icons/si";

function SocialLinks() {
  return (
    <div className="flex space-x-4 text-white text-2xl fixed bottom-0 left-0 p-4 sm:left-auto sm:right-0 sm:text-2xl bg-indigo-600 rounded-tr-2xl sm:rounded-tl-2xl sm:rounded-tr-none">
      <a href="https://github.com/alexjiang200407" target="_blank" rel="noopener noreferrer">
        <FaGithub />
      </a>
      <a href="https://www.linkedin.com/in/alex-jiang-5abb5a310/" target="_blank" rel="noopener noreferrer">
        <FaLinkedin />
      </a>
      <a href="https://next.nexusmods.com/profile/Shdowraithe101/mods" target="_blank" rel="noopener noreferrer">
        <SiNexusmods />
      </a>
    </div>
  );
}

function AboutSection() {
  return (
    <Section mobileTop idx={0}>
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold leading-snug mt-8 md:mt-2"
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
          delay: 1.5,
        }}
      >
        Hi, I'm
        <br />
        <span className="px-1 italic text-white">Alex Jiang</span>
      </motion.h1>
      <motion.p
        className="text-lg text-gray-600 mt-4"
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
          delay: 1.5,
        }}
      >
        I am a programmer, designer
        <br />
        and student based in Sydney, Australia
      </motion.p>
      <div className="flex gap-2">
        <motion.button
          onClick={() => window.open('https://drive.google.com/file/d/1kgpOlDDb8wTEcExFH0w2ebiE8G3R5NZp/view?usp=sharing', '_blank')}
          className={`bg-indigo-600 text-white 
            py-1 px-2 sm:py-4 sm:px-8
            rounded-lg font-bold text-md sm:text-lg mt-6 md:mt-8`}
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
            delay: 2,
          }}
        >
          Resume
        </motion.button>
        <motion.button
          onClick={() => window.open('https://drive.google.com/file/d/1hMo7SQ0e5HLX8vTaL8ippgeo1TThUzfs/view?usp=sharing', '_blank')}
          className={`bg-indigo-600 text-white 
            py-1 px-2 sm:py-4 sm:px-8
            rounded-lg font-bold text-md sm:text-lg mt-6 md:mt-8`}
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
            delay: 2,
          }}
        >
          Academic Statement
        </motion.button>
      </div>
      <SocialLinks />
    </Section>
  )
}

const skills = [
  {
    title: 'C/C++ System Dev.',
    level: 90,
  },
  {
    title: 'React / React Native',
    level: 100,
  },
  {
    title: 'Nodejs',
    level: 100,
  },
  {
    title: 'Typescript',
    level: 100,
  },
  {
    title: 'SQL/MySQL/PostgreSQL',
    level: 80,
  },
  {
    title: 'PHP Laravel',
    level: 60,
  },
  {
    title: 'Java',
    level: 60,
  },
  {
    title: 'Reverse Engineering',
    level: 40,
  },
  {
    title: 'Rust',
    level: 40,
  },
]
const languages = [
  {
    title: 'English',
    level: 100,
  },
  {
    title: 'Mandarin Chinese',
    level: 80,
  },
]

function SkillsSection() {
  return (
    <Section idx={1}>
      <motion.div className="w-full" whileInView="visible">
        <h2 className="text-3xl md:text-5xl font-bold text-white">Skills</h2>
        <div className="mt-1 sm:mt-8 space-y-4">
          {skills.map((skill, index) => (
            <div className="w-full md:w-64 mt-0 !mt-0" key={skill.title}>
              <motion.h3
                className="text-xl sm:text-lg md:text-xl font-bold text-gray-100"
                initial={{
                  opacity: 0,
                }}
                variants={{
                  visible: {
                    opacity: 1,
                    transition: {
                      duration: 1,
                      delay: 1 + index * 0.2,
                    },
                  },
                }}
              >
                {skill.title}
              </motion.h3>
              <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                <motion.div
                  className="h-full bg-indigo-500 rounded-full "
                  style={{ width: `${skill.level}%` }}
                  initial={{
                    scaleX: 0,
                    originX: 0,
                  }}
                  variants={{
                    visible: {
                      scaleX: 1,
                      transition: {
                        duration: 1,
                        delay: 1 + index * 0.2,
                      },
                    },
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 sm:mt-10 text-white">
            Languages
          </h2>
          <div className="mt-1 sm:mt-8 space-y-4">
            {languages.map((lng, index) => (
              <div className="w-full md:w-64" key={lng.title}>
                <motion.h3
                  className="text-lg md:text-xl font-bold text-gray-100"
                  initial={{
                    opacity: 0,
                  }}
                  variants={{
                    visible: {
                      opacity: 1,
                      transition: {
                        duration: 1,
                        delay: 2 + index * 0.2,
                      },
                    },
                  }}
                >
                  {lng.title}
                </motion.h3>
                <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                  <motion.div
                    className="h-full bg-indigo-500 rounded-full "
                    style={{ width: `${lng.level}%` }}
                    initial={{
                      scaleX: 0,
                      originX: 0,
                    }}
                    variants={{
                      visible: {
                        scaleX: 1,
                        transition: {
                          duration: 1,
                          delay: 2 + index * 0.2,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </Section>
  )
}

function ProjectsSection() {
  const [currentProject, setCurrentProject] = useAtom(pageAtom)

  const getCurrentProject = () => {
    if (!links[currentProject] || links[currentProject] === '')
      return

    window.open(links[currentProject], '_blank')
  }

  return (
    <Section idx={2}>
      <div className="flex w-full h-full gap-8 items-center justify-center">
        <button
          type="button"
          className="bg-indigo-600 text-white py-4 px-8 rounded-lg font-bold text-lg mt-2 md:mt-16 translate-y-[40vh]"
          onClick={() => setCurrentProject(0)}
        >
          Start
        </button>
        <button
          type="button"
          className="bg-indigo-600 text-white py-4 px-8 rounded-lg font-bold text-lg mt-2 md:mt-16 translate-y-[40vh]"
          onClick={() => getCurrentProject()}
          style={{
            opacity: !links[currentProject] || links[currentProject] === '' ? 0.3 : 1,
            pointerEvents: !links[currentProject] || links[currentProject] === '' ? 'none' : 'auto',
          }}
        >
          Visit
        </button>
        <button
          type="button"
          className="bg-indigo-600 text-white py-4 px-8 rounded-lg font-bold text-lg mt-2 md:mt-16 translate-y-[40vh]"
          onClick={() => setCurrentProject(pages.length)}
        >
          End
        </button>
      </div>
    </Section>
  )
}

function ContactSection() {
  const [state, handleSubmit] = useForm('mayzgjbd')
  return (
    <Section idx={3}>
      <h2 className="text-3xl md:text-5xl font-bold">Contact me</h2>
      <div className="mt-8 p-8 rounded-md bg-white bg-opacity-50 w-96 max-w-full">
        {state.succeeded
          ? (
              <p className="text-gray-900 text-center">Thanks for your message !</p>
            )
          : (
              <form onSubmit={handleSubmit}>
                <label for="name" className="font-medium text-gray-900 block mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3"
                />
                <label
                  for="email"
                  className="font-medium text-gray-900 block mb-1 mt-8"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3"
                />
                <ValidationError
                  className="mt-1 text-red-500"
                  prefix="Email"
                  field="email"
                  errors={state.errors}
                />
                <label
                  for="email"
                  className="font-medium text-gray-900 block mb-1 mt-8"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  className="h-32 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3"
                />
                <ValidationError
                  className="mt-1 text-red-500"
                  errors={state.errors}
                />
                <button
                  type="button"
                  disabled={state.submitting}
                  className="bg-indigo-600 text-white py-4 px-8 rounded-lg font-bold text-lg mt-16 "
                >
                  Submit
                </button>
              </form>
            )}
      </div>
    </Section>
  )
}

function Interface({ setSection }) {
  return (
    <div className="h-screen w-screen fixed top-0 left-0 pointer-events-none">
      <AboutSection setSection={setSection} />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  )
}

export default Interface
