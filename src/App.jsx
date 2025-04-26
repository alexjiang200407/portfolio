import { Stats } from '@react-three/drei';
import './App.css'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { EffectComposer, N8AO, Noise } from "@react-three/postprocessing"
import { OBJLoader } from 'three-stdlib'
import LoadingScreen from './Loader';
import { Physics } from '@react-three/cannon';
import UI from './UI/UI';

function Model({ assetsMap }) {
  const obj = assetsMap['rapid.obj']
  const material = new THREE.MeshStandardMaterial({
    normalMap: assetsMap['material0_normal.jpg'],
    aoMap: assetsMap['material0_occlusion.jpg'],
  });
  obj.children[0].material = material;

  return <primitive object={obj} />
}

const showStats = process.env.NODE_ENV !== 'production' && false;
const cursor = {
  x: 0,
  y: 0
};

function FillLight() {
  const fillLight = useRef();

  useFrame((state, delta) => {
    const parallaxY = cursor.y
    fillLight.current.position.y -= (parallaxY * 9 + fillLight.current.position.y - 2) * delta

    const parallaxX = cursor.x
    fillLight.current.position.x += (parallaxX * 8 - fillLight.current.position.x) * 2 * delta

    state.camera.position.z -= (parallaxY / 3 + state.camera.position.z) * 2 * delta
    state.camera.position.x += (parallaxX / 3 - state.camera.position.x) * 2 * delta
  })

  return <pointLight
    color={0xffffff}
    intensity={5}
    distance={4}
    decay={3}
    ref={fillLight}
  />
}

const assets = {
  'rapid.obj': OBJLoader,
  'material0_normal.jpg': THREE.TextureLoader,
  'material0_occlusion.jpg': THREE.TextureLoader,
}



function Movie({ assetsMap }) {
  return (
    <group>
      <Physics gravity={[0, 0, 0]}>
        <Model assetsMap={assetsMap} />
        <FillLight />
        <spotLight
          position={[-5, 0, -5]}
          angle={0.3}
          penumbra={0.5}
          intensity={3.5}
          castShadow
        />
        {/* <InteractiveText mouse={cursor} text={"AlexJiang"} positions={[0, 0.7, 0.9, 1.5, 4, 4.7, 4.9, 5.4, 5.9]}/> */}
      </Physics>
    </group>
  )
}


function App() {
  const [assetsMap, setAssetMap] = useState(null);

  useEffect(() => {
    Promise.all(Object.entries(assets).map(([key, loader]) => new Promise(resolve => new loader()
      .load(key, asset => resolve({ [key]: asset }))))
    )
      .then(data => new Promise(resolve => setTimeout(() => resolve(data), 1000)))
      .then(data => {
        setAssetMap(data.reduce((acc, obj) => {
          Object.entries(obj).forEach(([a, b]) => {
            acc[a] = b;
          });
          return acc;
        }, {}))
      })
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', (event) => {
      event.preventDefault()
      cursor.x = event.clientX / window.innerWidth - 0.5
      cursor.y = event.clientY / window.innerHeight - 0.5
    })

    document.addEventListener('focus', () => {
      cursor.x = 0
      cursor.y = 0
    })

  }, [])

  return (
    <div>
      <LoadingScreen hidden={assetsMap !== null}>
        <UI />
        <Canvas
          dpr={[1, 2]}
          style={{
            height: '100vh',
            width: '100%',
            position: 'fixed',
            top: 0, left: 0, zIndex: 0,
            pointerEvents: 'none',
          }}
          camera={{ position: [0, 0, 5] }}
          gl={{
            physicallyCorrectLights: true,
            outputEncoding: THREE.sRGBEncoding,
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
        >
          {showStats && <Stats />}
          <color attach="background" args={[0x080808]} />
          <Movie assetsMap={assetsMap} />
          <EffectComposer>
            <N8AO color="black" aoRadius={2} intensity={1.15} />
            <Noise opacity={0.03}/>
          </EffectComposer>
        </Canvas>

      </LoadingScreen>
    </div>
  );
}

export default App
