import { Box, Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import Dissolve from '../shaders/Dissolve'

function DavidBust({ assetsMap }) {
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      normalMap: assetsMap['material0_normal.jpg'],
      aoMap: assetsMap['material0_occlusion.jpg'],
    })
  }, [assetsMap])
  const dissolveRef = useRef(null)
  const geometry = useMemo(() => {
    return assetsMap['rapid.obj'].children[0].geometry
  }, [assetsMap])

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

      gsap.to(dissolveRef.current.uProgress, { value: 1, duration: 1, overwrite: true, ease: 'power2.out'})

    }
  }, [pointerDown])

  useEffect(() => { gsap.to(dissolveRef.current.uProgress, { value: 1, duration: 3, overwrite: true, ease: 'power2.out'})}, [dissolveRef])

  useFrame(state => {
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

      gsap.to(dissolveRef.current.uProgress, { value: Math.max(0.45, 1 - Math.abs(state.pointer.x)), duration: 1, overwrite: true, ease: 'power2.out'})
    }
  })

  useEffect(() => {
    ref.current.geometry.center()
  }, [ref])

  return (
    <Float
      speed={5}
      rotationIntensity={0.05}
      floatIntensity={0.05}
      floatingRange={[0.01, 0.02]}
    >
      <mesh
        position={[0, 0, -2]}
        ref={ref}
        geometry={geometry}
        material={material}
      >
        <Dissolve
          progress={1}
          ref={dissolveRef}
          baseMaterial={material}
        />
      </mesh>
    </Float>
  )
}

export default DavidBust
