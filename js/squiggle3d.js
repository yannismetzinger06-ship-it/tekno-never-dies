import * as THREE from 'three';

// ---- Réglages ----
const VITESSE = 3;       // vitesse de l'onde (négatif = l'onde part dans l'autre sens)
const TOURS = 2;       // nombre d'ondulations
const EPAISSEUR = 0.4;   // épaisseur du tube (rayon)
const AMPLITUDE = 0.9;   // hauteur des vagues
const LONGUEUR = 7;      // longueur du tube
const INCLINAISON = 0.12;
const LUMINOSITE = 1.2;  // plus haut = chrome plus clair

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

// Studio photo : murs clairs, grands panneaux lumineux et bandes noires
// pour les reflets contrastés du chrome
function creerStudio() {
  const studio = new THREE.Scene();

  studio.add(new THREE.Mesh(
    new THREE.BoxGeometry(30, 30, 30),
    new THREE.MeshBasicMaterial({ color: 0xb0b0b0, side: THREE.BackSide })
  ));

  function panneau(x, y, z, largeur, hauteur, intensite) {
    const couleur = new THREE.Color().setScalar(intensite);
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(largeur, hauteur),
      new THREE.MeshBasicMaterial({ color: couleur, side: THREE.DoubleSide })
    );
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    studio.add(m);
  }

  // lumières (valeurs > 1 = très brillant)
  panneau(0, 10, 2, 24, 5, 6);      // grande lumière du dessus
  panneau(0, -6, 10, 26, 3, 3);     // bande claire devant, en bas
  panneau(-12, 2, 6, 3, 14, 4);     // lumière latérale gauche
  panneau(12, 2, 6, 3, 14, 4);      // lumière latérale droite

  // bandes noires (donnent les traits sombres du chrome)
  panneau(0, 4, 11, 30, 2.5, 0.02);
  panneau(0, -1, 12, 30, 1.2, 0.02);
  panneau(0, -12, 0, 30, 30, 0.05); // sol sombre

  return studio;
}

function initSquiggle(el) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.toneMappingExposure = LUMINOSITE;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(creerStudio(), 0.02).texture;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  const chrome = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.04 });
  const courbe = new Vague();

  const groupe = new THREE.Group();
  groupe.rotation.z = INCLINAISON;
  scene.add(groupe);

  const boutGeo = new THREE.SphereGeometry(EPAISSEUR, 32, 16);
  const bout1 = new THREE.Mesh(boutGeo, chrome);
  const bout2 = new THREE.Mesh(boutGeo, chrome);
  groupe.add(bout1, bout2);

  let tube = null;
  function construire() {
    if (tube) {
      groupe.remove(tube);
      tube.geometry.dispose();
    }
    tube = new THREE.Mesh(new THREE.TubeGeometry(courbe, 120, EPAISSEUR, 24, false), chrome);
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