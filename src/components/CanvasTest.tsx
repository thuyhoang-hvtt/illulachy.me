import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import type { CameraState } from '@/types'
import { ZOOM_MIN, ZOOM_MAX, HUB_WIDTH } from '@/types'

export function CanvasTest() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw
        hideUi
        onMount={(editor) => {
          console.log('Editor mounted:', editor)
          console.log('Camera:', editor.getCamera())
          console.log('Camera constants:', { ZOOM_MIN, ZOOM_MAX, HUB_WIDTH })
          
          const cameraState: CameraState = {
            x: 0,
            y: 0,
            z: 1,
            version: 1
          }
          
          editor.setCamera({ x: cameraState.x, y: cameraState.y, z: cameraState.z })
          console.log('Camera after setCamera:', editor.getCamera())
        }}
      />
    </div>
  )
}
