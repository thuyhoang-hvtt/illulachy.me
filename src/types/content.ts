// Phase 2+ content types (defined now for forward compatibility)
export type ContentType = 'youtube' | 'blog' | 'project' | 'milestone'

export interface ContentNode {
  id: string
  type: ContentType
  title: string
  date: string  // ISO 8601
  url?: string
  thumbnail?: string
  description?: string
}

export interface TimelineData {
  nodes: ContentNode[]
  lastUpdated: string
}
