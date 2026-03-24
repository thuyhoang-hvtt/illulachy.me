import { useEffect, useCallback } from 'react'
import type Konva from 'konva'

export function useArrowKeyNavigation(stage: Konva.Stage | null) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!stage) return
    
    const PAN_AMOUNT = 100
    const scale = stage.scaleX()
    const pos = stage.position()
    let newX = pos.x
    let newY = pos.y
    
    switch (e.key) {
      case 'ArrowUp':
        newY = pos.y + PAN_AMOUNT * scale
        break
      case 'ArrowDown':
        newY = pos.y - PAN_AMOUNT * scale
        break
      case 'ArrowLeft':
        newX = pos.x + PAN_AMOUNT * scale
        break
      case 'ArrowRight':
        newX = pos.x - PAN_AMOUNT * scale
        break
      default:
        return
    }
    
    e.preventDefault()
    
    // Animate position change
    stage.to({
      x: newX,
      y: newY,
      duration: 0.15,
    })
  }, [stage])
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
