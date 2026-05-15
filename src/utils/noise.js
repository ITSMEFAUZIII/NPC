// Simplex Noise implementation (no external dependency)
const F2 = 0.5 * (Math.sqrt(3.0) - 1.0)
const G2 = (3.0 - Math.sqrt(3.0)) / 6.0
const F3 = 1.0 / 3.0
const G3 = 1.0 / 6.0

function buildPermutation() {
  const p = new Uint8Array(256)
  for (let i = 0; i < 256; i++) p[i] = i
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]]
  }
  const perm = new Uint8Array(512)
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
  return perm
}

const perm = buildPermutation()

const grad3 = [
  [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
  [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
  [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
]

function dot2(g, x, y) { return g[0]*x + g[1]*y }
function dot3(g, x, y, z) { return g[0]*x + g[1]*y + g[2]*z }

export function noise2D(xin, yin) {
  const s = (xin + yin) * F2
  const i = Math.floor(xin + s)
  const j = Math.floor(yin + s)
  const t = (i + j) * G2
  const X0 = i - t
  const Y0 = j - t
  const x0 = xin - X0
  const y0 = yin - Y0
  const i1 = x0 > y0 ? 1 : 0
  const j1 = x0 > y0 ? 0 : 1
  const x1 = x0 - i1 + G2
  const y1 = y0 - j1 + G2
  const x2 = x0 - 1.0 + 2.0 * G2
  const y2 = y0 - 1.0 + 2.0 * G2
  const ii = i & 255
  const jj = j & 255
  const gi0 = perm[ii + perm[jj]] % 12
  const gi1 = perm[ii + i1 + perm[jj + j1]] % 12
  const gi2 = perm[ii + 1 + perm[jj + 1]] % 12
  let t0 = 0.5 - x0*x0 - y0*y0
  let n0 = 0
  if (t0 >= 0) { t0 *= t0; n0 = t0 * t0 * dot2(grad3[gi0], x0, y0) }
  let t1 = 0.5 - x1*x1 - y1*y1
  let n1 = 0
  if (t1 >= 0) { t1 *= t1; n1 = t1 * t1 * dot2(grad3[gi1], x1, y1) }
  let t2 = 0.5 - x2*x2 - y2*y2
  let n2 = 0
  if (t2 >= 0) { t2 *= t2; n2 = t2 * t2 * dot2(grad3[gi2], x2, y2) }
  return 70.0 * (n0 + n1 + n2)
}

export function noise3D(xin, yin, zin) {
  const s = (xin + yin + zin) * F3
  const i = Math.floor(xin + s)
  const j = Math.floor(yin + s)
  const k = Math.floor(zin + s)
  const t = (i + j + k) * G3
  const X0 = i - t, Y0 = j - t, Z0 = k - t
  const x0 = xin - X0, y0 = yin - Y0, z0 = zin - Z0
  let i1, j1, k1, i2, j2, k2
  if (x0 >= y0) {
    if (y0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=1;k2=0 }
    else if (x0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=0;k2=1 }
    else { i1=0;j1=0;k1=1;i2=1;j2=0;k2=1 }
  } else {
    if (y0 < z0) { i1=0;j1=0;k1=1;i2=0;j2=1;k2=1 }
    else if (x0 < z0) { i1=0;j1=1;k1=0;i2=0;j2=1;k2=1 }
    else { i1=0;j1=1;k1=0;i2=1;j2=1;k2=0 }
  }
  const x1=x0-i1+G3, y1=y0-j1+G3, z1=z0-k1+G3
  const x2=x0-i2+2*G3, y2=y0-j2+2*G3, z2=z0-k2+2*G3
  const x3=x0-1+3*G3, y3=y0-1+3*G3, z3=z0-1+3*G3
  const ii=i&255, jj=j&255, kk=k&255
  const gi0=perm[ii+perm[jj+perm[kk]]]%12
  const gi1=perm[ii+i1+perm[jj+j1+perm[kk+k1]]]%12
  const gi2=perm[ii+i2+perm[jj+j2+perm[kk+k2]]]%12
  const gi3=perm[ii+1+perm[jj+1+perm[kk+1]]]%12
  let t0=0.6-x0*x0-y0*y0-z0*z0; let n0=0
  if(t0>=0){t0*=t0;n0=t0*t0*dot3(grad3[gi0],x0,y0,z0)}
  let t1=0.6-x1*x1-y1*y1-z1*z1; let n1=0
  if(t1>=0){t1*=t1;n1=t1*t1*dot3(grad3[gi1],x1,y1,z1)}
  let t2=0.6-x2*x2-y2*y2-z2*z2; let n2=0
  if(t2>=0){t2*=t2;n2=t2*t2*dot3(grad3[gi2],x2,y2,z2)}
  let t3=0.6-x3*x3-y3*y3-z3*z3; let n3=0
  if(t3>=0){t3*=t3;n3=t3*t3*dot3(grad3[gi3],x3,y3,z3)}
  return 32*(n0+n1+n2+n3)
}
