/**
 * Custom shape type constants
 * Defines shape types for timeline nodes and portfolio hub
 */

// Shape type constants (kept for consistency, though not used by Konva)
export const SHAPE_TYPES = {
  HUB: 'hub-shape',
  YOUTUBE: 'youtube-node',
  BLOG: 'blog-node',
  PROJECT: 'project-node',
  MILESTONE: 'milestone-node',
} as const

// Type for shape type values
export type ShapeType = typeof SHAPE_TYPES[keyof typeof SHAPE_TYPES]
