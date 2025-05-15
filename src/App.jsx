import { Environment, Scroll, ScrollControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { MotionConfig } from 'framer-motion'
import { Leva } from 'leva'
import { Suspense, useEffect, useState } from 'react'
import { Experience } from './components/Experience'
import Interface from './components/Interface'
import { LoadingScreen } from './components/LoadingScreen'
import { Menu } from './components/Menu'
import { ScrollManager } from './components/ScrollManager'
import { framerMotionConfig } from './config'

function App() {
  const [section, setSection] = useState(0)
  const [started, setStarted] = useState(false)
  const [menuOpened, setMenuOpened] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setMenuOpened(false))
  }, [section])

  return (
    <>
      <LoadingScreen started={started} setStarted={setStarted} />
      <MotionConfig
        transition={{
          ...framerMotionConfig,
        }}
      >
        <Canvas shadows camera={{ position: [0, 3, 10], fov: 42 }}>
          <color attach="background" args={['#e6e7ff']} />
          <Environment preset="sunset" />
          <ScrollControls pages={4} damping={0.1}>
            <ScrollManager section={section} onSectionChange={setSection} />
            <Scroll>
              <Suspense>
                {started && (
                  <Experience section={section} menuOpened={menuOpened} />
                )}
              </Suspense>
            </Scroll>
          </ScrollControls>
        </Canvas>
        <Menu
          onSectionChange={setSection}
          menuOpened={menuOpened}
          setMenuOpened={setMenuOpened}
        />
        {started && <Interface />}
      </MotionConfig>
      <Leva hidden />
    </>
  )
}

export default App
