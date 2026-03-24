import { useEffect, useState } from 'react'
import type Konva from 'konva'

export interface ViewportTransform {
  x: number
  y: number
  zoom: number
}

/**
 * Hook to track Konva viewport transform for SVG overlay synchronization
 * 
 * Listens to camera changes and provides current x, y, zoom for SVG viewBox calculation.
 * 
 * @param stage - Konva stage instance
 * @returns Current viewport transform { x, y, zoom }
 */
export function useViewportTransform(stage: Konva.Stage | null): ViewportTransform {
  const [transform, setTransform] = useState<ViewportTransform>(() => {
    if (!stage) return { x: 0, y: 0, zoom: 1 }
    
    const scale = stage.scaleX()
    const pos = stage.position()
    
    // Convert Konva position to viewport coordinates
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    
    return {
      x: (centerX - pos.x) / scale,
      y: (centerY - pos.y) / scale,
      zoom: scale
    }
  })
  
  useEffect(() => {
    if (!stage) return
    
    const updateTransform = () => {
      const scale = stage.scaleX()
      const pos = stage.position()
      
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      setTransform({
        x: (centerX - pos.x) / scale,
        y: (centerY - pos.y) / scale,
        zoom: scale
      })
    }
    
    stage.on('dragmove', updateTransform)
    stage.on('zoom', updateTransform)
    
    return () => {
      stage.off('dragmove', updateTransform)
      stage.off('zoom', updateTransform)
    }
  }, [stage])
  
  return transform
}
