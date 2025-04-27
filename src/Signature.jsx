import { Float, Text, useScroll } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import gsap from "gsap"
import { useLayoutEffect, useRef } from "react"

function Signature({ time, ...props }) {
  const textRef = useRef(null)
  const tl = useRef(null)
  const scroll = useScroll()

  useFrame(() => {
    if (tl.current) tl.current.seek(scroll.offset * 10 * tl.current.duration())
  })

  useLayoutEffect(() => {
    tl.current = gsap.timeline()
    textRef.current.material.transparent = true
    textRef.current.material.alphaTest = 0.1
    tl.current.fromTo(
      textRef.current.material, {
        opacity: 1,
      },
      {
        opacity: 0,
        duration: 0.5,
      },
      0
    )
  }, [])

  return (
    <Text
      ref={textRef}
      color={'white'}
      {...props}
    />
  )
}

export default Signature
