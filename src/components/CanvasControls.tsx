import { useCallback } from 'react'
import type Konva from 'konva'
import { ZOOM_MIN, ZOOM_MAX } from '@/types'
import { calculateInitialZoom, getViewportDimensions } from '@/lib/cameraUtils'
import { cn } from '@/lib/utils'

interface CanvasControlsProps {
  stage: Konva.Stage | null
  visible: boolean
}

export function CanvasControls({ stage, visible }: CanvasControlsProps) {
  const zoomIn = useCallback(() => {
    if (!stage) return
    const scale = stage.scaleX()
    const newZoom = Math.min(scale * 1.25, ZOOM_MAX)
    stage.scale({ x: newZoom, y: newZoom })
    stage.batchDraw()
  }, [stage])
  
  const zoomOut = useCallback(() => {
    if (!stage) return
    const scale = stage.scaleX()
    const newZoom = Math.max(scale / 1.25, ZOOM_MIN)
    stage.scale({ x: newZoom, y: newZoom })
    stage.batchDraw()
  }, [stage])
  
  const resetToHub = useCallback(() => {
    if (!stage) return
    const viewport = getViewportDimensions()
    const zoom = calculateInitialZoom(viewport)
    stage.to({
      x: viewport.width / 2,
      y: viewport.height / 2,
      scaleX: zoom,
      scaleY: zoom,
      duration: 0.3,
    })
  }, [stage])
  
  const fitToScreen = useCallback(() => {
    if (!stage) return
    // Reset to initial view (hub centered)
    resetToHub()
  }, [stage, resetToHub])
  
  return (
    <div 
      className={cn(
        'fixed bottom-4 right-4 flex gap-2 p-3 rounded-xl glass',
        'transition-opacity duration-200',
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}
    >
      <ControlButton onClick={zoomOut} title="Zoom out">−</ControlButton>
      <ControlButton onClick={zoomIn} title="Zoom in">+</ControlButton>
      <ControlButton onClick={resetToHub} title="Reset to hub">⌂</ControlButton>
      <ControlButton onClick={fitToScreen} title="Fit to screen">◻</ControlButton>
    </div>
  )
}

function ControlButton({ 
  onClick, 
  title, 
  children 
}: { 
  onClick: () => void
  title: string
  children: React.ReactNode 
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'w-10 h-10 flex items-center justify-center rounded-lg',
        'text-lg font-medium text-secondary',
        'hover:text-interactive-hover hover:bg-interactive-subtle',
        'transition-all duration-150',
        'border-none cursor-pointer bg-transparent'
      )}
    >
      {children}
    </button>
  )
}
