import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { ContentNode } from '@/types/content'

interface MilestoneModalProps {
  node: ContentNode
  onClose: () => void
}

export function MilestoneModal({ node, onClose }: MilestoneModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  // Format date nicely
  const formattedDate = new Date(node.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500, // Above canvas (tldraw uses 200-300)
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 200ms ease-out',
      }}
      onClick={onClose} // Backdrop dismiss
    >
      <div
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: '500px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(var(--glass-blur))',
          border: '1px solid var(--glass-border)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-2xl)',
          padding: '32px',
          animation: 'slideUp 200ms ease-out',
        }}
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '24px',
            cursor: 'pointer',
            lineHeight: 1,
            padding: '4px',
          }}
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Achievement icon */}
        <div style={{
          fontSize: '48px',
          marginBottom: '16px',
        }}>
          🏆
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-2xl)',
          color: 'var(--text-primary)',
          marginBottom: '8px',
          paddingRight: '32px', // Space for close button
        }}>
          {node.title}
        </h2>

        {/* Date */}
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-tertiary)',
          marginBottom: '8px',
        }}>
          {formattedDate}
        </p>

        {/* Institution */}
        {node.institution && (
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--interactive-default)',
            marginBottom: '16px',
          }}>
            {node.institution}
          </p>
        )}

        {/* Description */}
        {node.description && (
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}>
            {node.description}
          </p>
        )}
      </div>
    </div>,
    document.body
  )
}
