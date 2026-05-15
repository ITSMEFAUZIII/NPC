import * as THREE from 'three'

export class WaterSystem {
  constructor(scene) {
    this.scene = scene
    this.waterMesh = null
    this._time = 0
  }

  create() {
    const geo = new THREE.PlaneGeometry(12, 800, 8, 60)
    geo.rotateX(-Math.PI / 2)

    const vertexShader = `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vWorldPos;
      void main() {
        vUv = uv;
        vec3 pos = position;
        pos.y += sin(time + pos.x * 0.5) * 0.3 + sin(time * 0.7 + pos.z * 0.3) * 0.2;
        vWorldPos = pos;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `

    const fragmentShader = `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vWorldPos;
      void main() {
        vec2 uv = vUv;
        uv.x += time * 0.02;
        uv.y += time * 0.01;
        float foam = smoothstep(0.3, 0.8, sin(uv.x * 20.0 + time) * sin(uv.y * 15.0 + time * 0.8));
        vec3 deepColor = vec3(0.1, 0.22, 0.36);
        vec3 shallowColor = vec3(0.15, 0.35, 0.55);
        vec3 foamColor = vec3(0.8, 0.9, 1.0);
        float fresnel = pow(1.0 - abs(dot(normalize(vWorldPos), vec3(0.0,1.0,0.0))), 2.0);
        vec3 color = mix(deepColor, shallowColor, fresnel);
        color = mix(color, foamColor, foam * 0.15);
        gl_FragColor = vec4(color, 0.85);
      }
    `

    const mat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    })

    this.waterMesh = new THREE.Mesh(geo, mat)
    this.waterMesh.position.set(0, 0.1, -100)
    this.scene.add(this.waterMesh)

    // River rocks
    for (let i = 0; i < 20; i++) {
      const rock = new THREE.Mesh(
        new THREE.SphereGeometry(0.3 + Math.random() * 0.5, 5, 4),
        new THREE.MeshLambertMaterial({ color: 0x888888 })
      )
      rock.position.set(
        (Math.random() - 0.5) * 10,
        0.1,
        -100 + (Math.random() - 0.5) * 700
      )
      rock.scale.y = 0.4
      this.scene.add(rock)
    }

    return this.waterMesh
  }

  update(delta) {
    this._time += delta
    if (this.waterMesh) {
      this.waterMesh.material.uniforms.time.value = this._time
    }
  }

  dispose() {
    if (this.waterMesh) {
      this.scene.remove(this.waterMesh)
      this.waterMesh.geometry.dispose()
      this.waterMesh.material.dispose()
    }
  }
}
