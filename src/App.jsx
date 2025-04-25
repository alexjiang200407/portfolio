import { OrbitControls } from '@react-three/drei';
import './App.css'
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

function Model(props) {
  let [obj, setObj] = useState(null)

  useEffect(() => {
    new OBJLoader().load('Untitled.obj', obj => {
      // obj.rotation.x = -Math.PI / 2;
      // obj.rotation.z = Math.PI / 2;
      // obj.rotation.y = Math.PI;
      // obj.scale.set(0.001, 0.001, 0.001)
      setObj(obj)
    });
  }, [])

  useFrame(() => {
    if (obj) {
      // obj.rotation.x += 0.02
    }

  })


  if (obj) {
    return <primitive
      object={obj} position={[0, 0, 0]} {...props} />;
  }
  if (!obj) return null

  return <primitive object={obj} {...props} />
}

function App() {
  return (
    <Canvas
      dpr={[1, 2]} style={{ height: '100vh', width: '100vw' }}
      camera={{ position: [0, 0, 0] }}
    >
      <color attach="background" args={['black']} />
      <Model />
      <directionalLight position={[-5, 0, -5]} intensity={2} />
      {/* <directionalLight position={[5, 2, 5]} intensity={1} /> */}
    </Canvas>
  );
}

export default App
