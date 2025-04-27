import { Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

function DavidBust({ assetsMap }) {
  const obj = assetsMap['rapid.obj']
  const material = new THREE.MeshStandardMaterial({
    normalMap: assetsMap['material0_normal.jpg'],
    aoMap: assetsMap['material0_occlusion.jpg'],
  })
  obj.children[0].material = material

  const ref = useRef(null)
  const [pointerDown, setPointerDown] = useState(false)

  const onPointerDown = () => setPointerDown(true)

  const onPointerUp = () => setPointerDown(false)

  useEffect(() => {
    document.addEventListener('pointerdown', onPointerDown)

    document.addEventListener('pointerup', onPointerUp)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)

      document.removeEventListener('pointerup', onPointerUp)
    }
  }, [])

  useEffect(() => {
    if (!pointerDown) {
      gsap.to(ref.current.rotation, {
        x: 0,
        y: 0,
        overwrite: true,
        duration: 2,
        ease: 'back.out',
      })
      gsap.to(ref.current.position, {
        z: -2.0,
        overwrite: true,
        duration: 1,
        ease: 'back.out',
      })
    }
  }, [pointerDown])

  useFrame((state) => {
    if (pointerDown) {
      gsap.to(ref.current.rotation, {
        x: -state.pointer.y * Math.PI / 8,
        y: state.pointer.x * Math.PI / 8,
        overwrite: true,
        duration: 1,
        ease: 'back.out',
      })

      gsap.to(ref.current.position, {
        z: -2.0 + 0.2 * state.pointer.y,
        overwrite: true,
        duration: 1,
        ease: 'back.out',
      })
    }
  })

  useEffect(() => {
    ref.current.children[0].geometry.center()
  }, [ref])

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
