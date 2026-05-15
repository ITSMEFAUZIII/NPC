function getSuspicionLabel(v) {
  if (v < 25) return 'All quiet'
  if (v < 50) return 'Uneasy'
  if (v < 75) return 'Noticed'
  return '⚠ DANGER'
}

function getMoraleEmoji(v) {
  if (v >= 70) return '😐'
  if (v >= 50) return '😶'
  if (v >= 30) return '🙁'
  return '😞'
}

function getInfluenceDesc(v) {
  if (v <= 20) return 'nothing'
  if (v <= 40) return 'a whisper'
  if (v <= 60) return 'a current'
  if (v <= 80) return 'a tide'
  return 'a force'
}

export function StatusPanel({ kael }) {
  const stats = kael?.stats || {}
  const suspicionColor = stats.suspicion >= 75 ? '#ef4444' : stats.suspicion >= 50 ? '#f59e0b' : '#6b7280'

  return (
    <div style={{
      position: 'absolute',
      bottom: 16, left: 16,
      background: 'rgba(45,27,14,0.88)',
      border: '1px solid rgba(245,158,11,0.2)',
      borderRadius: 4,
      padding: '10px 14px',
      backdropFilter: 'blur(4px)',
      minWidth: 160
    }}>
      <p style={{
        fontFamily: 'Cinzel, serif',
        fontSize: 9,
        color: '#f59e0b',
        letterSpacing: '0.2em',
        marginBottom: 8
      }}>KAEL</p>

      {/* Coins — only exact stat */}
      <Row label="Coins" value={`${stats.coins ?? 15}`} valueColor="#f5c842" mono />

      {/* Influence — vague */}
      <Row label="Influence" value={getInfluenceDesc(stats.influence || 0)} valueColor="#e8dcc8" italic />

      {/* Suspicion — vague warning */}
      <Row label="Suspicion" value={getSuspicionLabel(stats.suspicion || 0)} valueColor={suspicionColor} />

      {/* Morale — emoji */}
      <Row label="Morale" value={getMoraleEmoji(stats.morale || 50)} valueColor="#e8dcc8" />
    </div>
  )
}

function Row({ label, value, valueColor, mono, italic }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 5 }}>
      <span style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10,
        color: 'rgba(232,220,200,0.4)'
      }}>{label}</span>
      <span style={{
        fontFamily: mono ? 'JetBrains Mono, monospace' : italic ? 'Crimson Pro, serif' : 'Crimson Pro, serif',
        fontSize: mono ? 11 : 12,
        fontStyle: italic ? 'italic' : 'normal',
        color: valueColor || '#e8dcc8'
      }}>{value}</span>
    </div>
  )
}
