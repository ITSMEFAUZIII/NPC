export function getBiome(x, z, y) {
  const dist = Math.sqrt(x * x + z * z)
  if (y > 80) return 'snow'
  if (z > 400) return 'mountain'
  if (dist < 300) return 'plains'
  return 'forest'
}

export const BIOME_COLORS = {
  plains: '#4a7c59',
  forest: '#2d5a27',
  mountain: '#8b7355',
  snow: '#e8e8e8'
}
