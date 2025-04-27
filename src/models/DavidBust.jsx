import { Float, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three'

function DavidBust({ assetsMap }) {
  const obj = assetsMap['rapid.obj']
  const material = new THREE.MeshStandardMaterial({
    normalMap: assetsMap['material0_normal.jpg'],
    aoMap: assetsMap['material0_occlusion.jpg'],
  });
  obj.children[0].material = material;

  const ref = useRef(null)

  useEffect(() => {
    ref.current.children[0].geometry.center()
  }, [ref.current])

  return (
    <Float
      speed={5}
      rotationIntensity={0.05}
      floatIntensity={0.05}
      floatingRange={[0.01, 0.02]}
    >
      <primitive position={[0, 0, -2]} ref={ref} object={obj} />

    </Float>
  )
}


export default DavidBust