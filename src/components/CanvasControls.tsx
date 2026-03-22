import { useCallback } from 'react'
import type { Editor } from 'tldraw'
import { ZOOM_MIN, ZOOM_MAX } from '@/types'
import { calculateInitialZoom, getViewportDimensions } from '@/lib/cameraUtils'

interface CanvasControlsProps {
  editor: Editor | null
  visible: boolean
}

export function CanvasControls({ editor, visible }: CanvasControlsProps) {
  const zoomIn = useCallback(() => {
    if (!editor) return
    const camera = editor.getCamera()
    const newZoom = Math.min(camera.z * 1.25, ZOOM_MAX)
    editor.setCamera({ x: camera.x, y: camera.y, z: newZoom }, { animation: { duration: 150 } })
  }, [editor])
  
  const zoomOut = useCallback(() => {
    if (!editor) return
    const camera = editor.getCamera()
    const newZoom = Math.max(camera.z / 1.25, ZOOM_MIN)
    editor.setCamera({ x: camera.x, y: camera.y, z: newZoom }, { animation: { duration: 150 } })
  }, [editor])
  
  const resetToHub = useCallback(() => {
    if (!editor) return
    const viewport = getViewportDimensions(editor)
    const zoom = calculateInitialZoom(viewport)
    editor.setCamera({ x: 0, y: 0, z: zoom }, { animation: { duration: 300 } })
  }, [editor])
  
  const fitToScreen = useCallback(() => {
    if (!editor) return
    // Fit entire bounds in view
    editor.zoomToFit({ animation: { duration: 300 } })
  }, [editor])
  
  return (
    <div 
      className="fixed bottom-4 right-4 flex gap-2 p-3 rounded-xl"
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(var(--glass-blur))',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shadow)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 200ms var(--ease-out)',
      }}
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
      className="w-10 h-10 flex items-center justify-center rounded-lg text-lg font-medium"
      style={{
        background: 'transparent',
        color: 'var(--text-secondary)',
        transition: 'color 150ms, background 150ms',
        border: 'none',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--interactive-hover)'
        e.currentTarget.style.background = 'var(--interactive-bg-subtle)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-secondary)'
        e.currentTarget.style.background = 'transparent'
      }}
    >
      {children}
    </button>
  )
}
