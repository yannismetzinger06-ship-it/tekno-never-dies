import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// ---- Réglages ----
const VITESSE = 3;       // vitesse de l'onde (négatif = l'onde part dans l'autre sens)
const TOURS = 2;       // nombre d'ondulations
const EPAISSEUR = 0.4;   // épaisseur du tube (rayon)
const AMPLITUDE = 1;   // hauteur des vagues
const LONGUEUR = 7;      // longueur du tube
const INCLINAISON = 0.12;

const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;

class Vague extends THREE.Curve {
  constructor() {
    super();
    this.phase = 0;
  }
  getPoint(t, target = new THREE.Vector3()) {
    const a = t * TOURS * Math.PI * 2;
    return target.set((t - 0.5) * LONGUEUR, Math.sin(a - this.phase) * AMPLITUDE, 0);
  }
}

function initSquiggle(el) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  const chrome = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.07 });
  const courbe = new Vague();

  const groupe = new THREE.Group();
  groupe.rotation.z = INCLINAISON;
  scene.add(groupe);

  const boutGeo = new THREE.SphereGeometry(EPAISSEUR, 24, 12);
  const bout1 = new THREE.Mesh(boutGeo, chrome);
  const bout2 = new THREE.Mesh(boutGeo, chrome);
  groupe.add(bout1, bout2);

  let tube = null;
  function construire() {
    if (tube) {
      groupe.remove(tube);
      tube.geometry.dispose();
    }
    tube = new THREE.Mesh(new THREE.TubeGeometry(courbe, 120, EPAISSEUR, 16, false), chrome);
    groupe.add(tube);
    bout1.position.copy(courbe.getPoint(0));
    bout2.position.copy(courbe.getPoint(1));
  }
  construire();

  function taille() {
    const w = el.clientWidth, h = el.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  // Tout est prêt : on affiche la 3D et on masque l'image
  el.appendChild(renderer.domElement);
  el.classList.add('is-3d');
  new ResizeObserver(taille).observe(el);
  taille();

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(el);

  let avant = performance.now();
  renderer.setAnimationLoop((maintenant) => {
    const dt = Math.min((maintenant - avant) / 1000, 0.05);
    avant = maintenant;
    if (!visible) return;
    if (!reduit) {
      courbe.phase += dt * VITESSE;
      construire();
    }
    renderer.render(scene, camera);
  });
}

document.querySelectorAll('.squiggle').forEach((el) => {
  try {
    initSquiggle(el);
  } catch (err) {
    console.error('Spirale 3D :', err);
  }
}); 