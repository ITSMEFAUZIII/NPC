import { useEffect, useRef } from 'react'

export function Minimap({ gameState }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height
    const scale = w / 400 // 400 world units = full minimap

    ctx.clearRect(0, 0, w, h)

    // Background
    ctx.fillStyle = 'rgba(13,10,7,0.85)'
    ctx.fillRect(0, 0, w, h)

    // Grid
    ctx.strokeStyle = 'rgba(245,158,11,0.05)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath(); ctx.moveTo(i * w / 4, 0); ctx.lineTo(i * w / 4, h); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, i * h / 4); ctx.lineTo(w, i * h / 4); ctx.stroke()
    }

    const toMapX = (wx) => (wx + 200) * scale
    const toMapZ = (wz) => (wz + 200) * scale

    // Buildings (simplified)
    const buildings = [
      { x: -50, z: 10, w: 12, d: 9, color: '#5c3010' },   // Tavern
      { x: 0, z: 0, w: 6, d: 6, color: '#4a4040' },       // Well area
      { x: 20, z: -15, w: 8, d: 7, color: '#444444' },     // Blacksmith
      { x: 30, z: 20, w: 12, d: 6, color: '#3a3020' },     // Market
      { x: -30, z: -40, w: 8, d: 10, color: '#4a4050' },   // Church
    ]
    buildings.forEach(b => {
      ctx.fillStyle = b.color
      ctx.fillRect(
        toMapX(b.x - b.w / 2), toMapZ(b.z - b.d / 2),
        b.w * scale, b.d * scale
      )
    })

    // Kael (green dot)
    if (gameState?.kael?.position) {
      const { x, z } = gameState.kael.position
      ctx.beginPath()
      ctx.arc(toMapX(x), toMapZ(z), 3, 0, Math.PI * 2)
      ctx.fillStyle = '#22cc55'
      ctx.fill()
    }

    // Aldric (gold dot)
    if (gameState?.hero?.position) {
      const { x, z } = gameState.hero.position
      const mx = toMapX(x)
      const mz = toMapZ(z)
      if (mx >= 0 && mx <= w && mz >= 0 && mz <= h) {
        ctx.beginPath()
        ctx.arc(mx, mz, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#ffd700'
        ctx.fill()
      }
    }

    // Border
    ctx.strokeStyle = 'rgba(245,158,11,0.25)'
    ctx.lineWidth = 1
    ctx.strokeRect(0, 0, w, h)
  })

  return (
    <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
      <canvas
        ref={canvasRef}
        width={150} height={150}
        style={{ borderRadius: 3, display: 'block' }}
      />
    </div>
  )
}
