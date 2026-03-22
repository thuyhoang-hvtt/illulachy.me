export function CanvasFogOverlay() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{
        background: `
          radial-gradient(
            ellipse 80% 80% at center,
            transparent 30%,
            var(--canvas-fog) 100%
          )
        `,
        zIndex: 1,
      }}
    />
  )
}
