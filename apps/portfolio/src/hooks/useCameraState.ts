import { useEffect, useRef } from 'react'
import type Konva from 'konva'
import { saveCameraState, loadCameraState } from '@/lib/localStorageUtils'
import { calculateInitialZoom } from '@/lib/cameraUtils'

export function useCameraState(stage: Konva.Stage | null) {
  const saveTimeoutRef = useRef<number | undefined>(undefined)
  
  // Restore camera on mount
  useEffect(() => {
    if (!stage) return

    const saved = loadCameraState()
    if (saved) {
      // Convert tldraw camera format (x, y, z) to Konva format (position, scale)
      // tldraw camera x,y is viewport top-left in world space
      // Konva position x,y is stage offset (inverse of camera)
      const zoom = saved.z
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      stage.position({
        x: centerX - saved.x * zoom,
        y: centerY - saved.y * zoom,
      })
      stage.scale({ x: zoom, y: zoom })
    } else {
      // First-time: calculate initial zoom and center on hub
      const zoom = calculateInitialZoom({
        width: window.innerWidth,
        height: window.innerHeight
      })

      // Hub is centered at world position (0, 0)
      // Center stage on hub
      stage.position({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      })
      stage.scale({ x: zoom, y: zoom })
    }
    
    stage.batchDraw()
  }, [stage])
  
  // Save camera on change (debounced)
  useEffect(() => {
    if (!stage) return
    
    const handleChange = () => {
      window.clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = window.setTimeout(() => {
        const scale = stage.scaleX()
        const pos = stage.position()
        
        // Convert Konva format to tldraw-compatible format for localStorage
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        
        saveCameraState({
          x: (centerX - pos.x) / scale,
          y: (centerY - pos.y) / scale,
          z: scale
        })
      }, 500)
    }
    
    stage.on('dragmove', handleChange)
    stage.on('zoom', handleChange)
    
    return () => {
      stage.off('dragmove', handleChange)
      stage.off('zoom', handleChange)
      window.clearTimeout(saveTimeoutRef.current)
    }
  }, [stage])
}
