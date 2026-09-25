import { startStars } from "./stars/stars.js";
import { STARS_CONFIG } from "./stars/config.js";
import { startSpiral } from "./spiral/spiral.js";
import { SPIRAL_CONFIG } from "./spiral/config.js";
 
// 1) La spirale chrome (voir #spiral-stage dans css/style.css)
//    Elle ne s'affiche que sur les pages qui contiennent <canvas id="spiral-stage">.
const spiralCanvas = document.getElementById("spiral-stage");
let spiral = null;
 
if (spiralCanvas && SPIRAL_CONFIG.enabled) {
  spiral = startSpiral(spiralCanvas, SPIRAL_CONFIG);
  if (!spiral) spiralCanvas.remove();
}
 
// 2) Les étoiles 3D (voir #stage dans css/style.css)
//    Si la spirale est affichée, on donne ses réglages aux étoiles
//    pour qu'elles la contournent au lieu de passer dessus.
const canvas = document.getElementById("stage");
let stars = null;
 
if (canvas && STARS_CONFIG.enabled) {
  stars = startStars(canvas, STARS_CONFIG, spiral ? SPIRAL_CONFIG : null);
  if (!stars) canvas.remove();
}
 
// pratique pour bidouiller depuis la console du navigateur
window.TND = { stars, spiral };
 