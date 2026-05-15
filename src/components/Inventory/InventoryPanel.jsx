import { motion } from 'framer-motion'
import { useState } from 'react'

export function InventoryPanel({ kael, onClose }) {
  const [activeTab, setActiveTab] = useState('inventory')
  const inventory = kael?.inventory || []
  const secrets = kael?.knownSecrets || []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 40,
        backdropFilter: 'blur(3px)',
        pointerEvents: 'all'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(45,27,14,0.98)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 4,
          width: 620,
          minHeight: 420,
          padding: 0,
          overflow: 'hidden',
          pointerEvents: 'all'
        }}
      >
        {/* Header */}
        <div style={{
          borderBottom: '1px solid rgba(245,158,11,0.15)',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 14, color: '#f59e0b', letterSpacing: '0.2em' }}>
            KAEL'S JOURNAL
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#e8dcc8', cursor: 'pointer', fontSize: 16, opacity: 0.6 }}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(245,158,11,0.1)' }}>
          {['inventory', 'notes', 'map'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '10px',
                background: activeTab === tab ? 'rgba(245,158,11,0.1)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #f59e0b' : '2px solid transparent',
                color: activeTab === tab ? '#f5c842' : '#6b7280',
                fontFamily: 'Cinzel, serif',
                fontSize: 11,
                letterSpacing: '0.15em',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: 24, minHeight: 320 }}>
          {activeTab === 'inventory' && (
            <div>
              {inventory.length === 0 ? (
                <p style={{ fontFamily: 'Crimson Pro, serif', fontStyle: 'italic', fontSize: 14, color: '#6b7280' }}>
                  Nothing in your pockets. Just lint and regrets.
                </p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {inventory.map(item => (
                    <div
                      key={item.id}
                      style={{
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(245,158,11,0.2)',
                        borderRadius: 3,
                        padding: '10px',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: 22, marginBottom: 4 }}>{item.icon || '📦'}</div>
                      <p style={{ fontFamily: 'Crimson Pro, serif', fontSize: 11, color: '#e8dcc8' }}>{item.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div style={{ overflowY: 'auto', maxHeight: 300 }}>
              {secrets.length === 0 ? (
                <p style={{ fontFamily: 'Crimson Pro, serif', fontStyle: 'italic', fontSize: 14, color: '#6b7280' }}>
                  You haven't written anything down yet. You should start.
                </p>
              ) : (
                secrets.map((secret, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <p style={{
                      fontFamily: 'Crimson Pro, serif',
                      fontStyle: 'italic',
                      fontSize: 14,
                      color: '#c4b08a',
                      lineHeight: 1.6,
                      borderLeft: '2px solid rgba(245,158,11,0.2)',
                      paddingLeft: 12
                    }}>
                      {secret}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'map' && (
            <MapView kael={kael} />
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function MapView({ kael }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: 280 }}>
      <canvas
        id="inventory-map"
        width={560}
        height={280}
        style={{ width: '100%', height: '100%', borderRadius: 3 }}
        ref={canvas => {
          if (!canvas) return
          const ctx = canvas.getContext('2d')
          ctx.fillStyle = '#1a1008'
          ctx.fillRect(0, 0, 560, 280)
          const scale = 560 / 600
          const ox = 280, oy = 140

          // Draw locations
          const locs = [
            { label: 'The Grey Flagon', x: -50, z: 10, color: '#f59e0b' },
            { label: 'Town Well', x: 0, z: 0, color: '#88aacc' },
            { label: 'Blacksmith', x: 20, z: -15, color: '#aa8844' },
            { label: 'Market', x: 30, z: 20, color: '#44aa66' },
            { label: 'Church', x: -30, z: -40, color: '#aa44aa' },
            { label: 'Dungeon', x: 200, z: 350, color: '#444466' },
            { label: 'Castle', x: 300, z: 250, color: '#8855aa' },
          ]

          locs.forEach(loc => {
            const mx = ox + loc.x * scale
            const my = oy + loc.z * scale * 0.5
            if (mx < 0 || mx > 560 || my < 0 || my > 280) return

            ctx.beginPath()
            ctx.arc(mx, my, 4, 0, Math.PI * 2)
            ctx.fillStyle = loc.color
            ctx.fill()

            ctx.fillStyle = 'rgba(232,220,200,0.6)'
            ctx.font = '9px Crimson Pro, serif'
            ctx.fillText(loc.label, mx + 6, my + 3)
          })

          // Kael position
          if (kael?.position) {
            const mx = ox + kael.position.x * scale
            const my = oy + kael.position.z * scale * 0.5
            if (mx >= 0 && mx <= 560) {
              ctx.beginPath()
              ctx.arc(mx, my, 5, 0, Math.PI * 2)
              ctx.fillStyle = '#22cc55'
              ctx.fill()
            }
          }

          ctx.strokeStyle = 'rgba(245,158,11,0.2)'
          ctx.strokeRect(0, 0, 560, 280)
        }}
      />
    </div>
  )
}
