export interface CameraState {
  x: number
  y: number
  z: number  // zoom level (0.1 = 10%, 4.0 = 400%)
  version: number  // schema version for migration
}

export interface ViewportDimensions {
  width: number
  height: number
}

export const CAMERA_SCHEMA_VERSION = 1
export const ZOOM_MIN = 0.1  // 10%
export const ZOOM_MAX = 4.0  // 400%
export const HUB_WIDTH = 640
export const HUB_HEIGHT = 360
export const HUB_VIEWPORT_FILL = 0.4  // 40% of viewport
