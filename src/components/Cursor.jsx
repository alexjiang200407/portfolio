import { useCallback, useEffect, useRef, useState } from 'react'

const CURSOR_SPEED = 0.08

let mouseX = -10
let mouseY = -10
let outlineX = 0
let outlineY = 0

export function Cursor() {
  const cursorOutline = useRef()
  const [hoverButton, setHoverButton] = useState(false)

  const animate = useCallback(() => {
    const distX = mouseX - outlineX
    const distY = mouseY - outlineY

    outlineX = outlineX + distX * CURSOR_SPEED
    outlineY = outlineY + distY * CURSOR_SPEED

    cursorOutline.current.style.left = `${outlineX}px`
    cursorOutline.current.style.top = `${outlineY}px`
    requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouseX = event.pageX
      mouseY = event.pageY
    }

    document.addEventListener(
      'mousemove',
      handleMouseMove,
    )
    const animateEvent = requestAnimationFrame(animate)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animateEvent)
    }
  }, [animate])

  useEffect(() => {
    const handleMouseOver = (e) => {
      if (
        e.target.tagName.toLowerCase() === 'button'
        // check parent is button
        || e.target.parentElement.tagName.toLowerCase() === 'button'
        // check is input or textarea
        || e.target.tagName.toLowerCase() === 'input'
        || e.target.tagName.toLowerCase() === 'textarea'
      ) {
        setHoverButton(true)
      }
      else {
        setHoverButton(false)
      }
    }

    document.addEventListener(
      'mouseover',
      handleMouseOver,
    )
    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  return (
    <>
      <div
        className={`invisible md:visible  z-50 fixed -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-transform
        ${
    hoverButton
      ? 'bg-transparent border-2 border-indigo-900 w-5 h-5'
      : 'bg-indigo-500 w-3 h-3'
    }`}
        ref={cursorOutline}
      >
      </div>
    </>
  )
}
