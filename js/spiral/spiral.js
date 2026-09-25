import * as THREE from "three";
import { buildEnvironment } from "../stars/environment.js";

/**
 * Courbe en spirale d'Archimède (à plat dans le plan XY), avec une petite
 * "queue" qui continue au-delà du dernier tour, comme un ressort qu'on déroule.
 */
class SpiralCurve extends THREE.Curve {
  constructor(o) {
    super();
    this.o = o;
  }
  getPoint(t) {
    const o = this.o;
    const totalTurns = o.turns + o.tailStretch * 0.15;
    const angle = t * totalTurns * Math.PI * 2;
    const r = THREE.MathUtils.lerp(o.startRadius, o.endRadius, Math.min(1, t * (totalTurns / o.turns)));
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    return new THREE.Vector3(x, y, 0);
  }
}

export function startSpiral(canvas, cfg) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) {
    console.warn("WebGL indisponible, spirale désactivée.", e);
    return null;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, cfg.pixelRatioMax));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  scene.environment = buildEnvironment(renderer);

  const { fov, distance } = cfg.camera;
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
  camera.position.set(0, 0, distance);

  const key = new THREE.DirectionalLight(0xffffff, 3);
  key.position.set(-3.5, 4.5, 7);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xbfd8ff, 1.4);
  fill.position.set(5, -2, 4);
  scene.add(fill);

  // --- la spirale ---------------------------------------------------------
  const s = cfg.shape;
  const curve = new SpiralCurve(s);
  const geometry = new THREE.TubeGeometry(curve, s.segments, s.tubeRadius, s.radialSegments, false);
  const material = new THREE.MeshPhysicalMaterial({
    color: cfg.chrome.color,
    metalness: 1,
    roughness: cfg.chrome.roughness,
    envMapIntensity: cfg.chrome.envMapIntensity,
    clearcoat: cfg.chrome.clearcoat,
    clearcoatRoughness: 0.03
  });
  const spiral = new THREE.Mesh(geometry, material);
  const { x, y, z } = cfg.position;
  spiral.position.set(x, y, z);
  scene.add(spiral);

  // --- cadrage adaptatif ---------------------------------------------------
  let unit = 1;
  function layout() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const portrait = camera.aspect < 0.8;
    unit = THREE.MathUtils.clamp(portrait ? 0.75 : 1, 0.6, 1.3) * cfg.scale;
  }
  layout();
  addEventListener("resize", layout);

  let px = 0, py = 0;
  addEventListener("pointermove", (e) => {
    px = (e.clientX / innerWidth) * 2 - 1;
    py = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });

  // --- boucle --------------------------------------------------------------
  const m = cfg.motion;
  const speed = reduce ? m.reducedMotionSpeed : 1;
  let real = 0;

  function tick(dt) {
    real += dt;
    const beat = ((real * cfg.kick.bpm) / 60) % 1;
    const kick = reduce ? 0 : cfg.kick.amount * Math.exp(-beat * 7);

    spiral.rotation.z += dt * m.rotZ * speed;
    spiral.rotation.x = Math.sin(real * m.tiltSpeed) * m.tiltX;
    spiral.scale.setScalar(unit * (1 + kick));

    camera.position.x += (px * m.parallax - camera.position.x) * 0.03;
    camera.position.y += (-py * m.parallax * 0.6 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => tick(Math.min(clock.getDelta(), 0.05)));

  return { renderer, scene, camera, spiral, tick };
}