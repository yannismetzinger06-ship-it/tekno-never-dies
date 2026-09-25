/**
 * Réglages de la spirale chrome. Modifie une valeur, enregistre :
 * la page se recharge toute seule (Live Server).
 */
export const SPIRAL_CONFIG = {
  enabled: true,

  camera: { fov: 40, distance: 10 },
  pixelRatioMax: 1.75,

  chrome: {
    roughness: 0.045,
    envMapIntensity: 1.4,
    clearcoat: 0.6,
    color: 0xf4f4f6
  },

  // --- forme de la spirale -----------------------------------------------
  shape: {
    turns: 3.2,          // nombre de tours
    startRadius: 0.18,   // rayon au centre
    endRadius: 1.5,       // rayon à l'extérieur
    tubeRadius: 0.06,    // épaisseur du tube (chrome)
    tailStretch: 1.6,     // longueur de la "queue" qui sort du dernier tour
    segments: 400,
    radialSegments: 16
  },

  // --- position et échelle ---------------------------------------------
  position: { x: 2.2, y: 0.2, z: -2.6 },
  scale: 1,

  // --- mouvement (rotation autour de son axe, à plat face caméra) --------
  motion: {
    rotZ: 0.12,              // vitesse de rotation (rad/s), sur elle-même
    tiltX: 0.08,             // léger basculement pour un effet 3D
    tiltSpeed: 0.25,
    reducedMotionSpeed: 0.15,
    parallax: 0.2
  },

  kick: { bpm: 0, amount: 0 }
};