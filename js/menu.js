// Menu Tekno Never Dies : ouvre / ferme le menu plein écran
(function () {
  var btn = document.querySelector('.tnd-toggle');
  var menu = document.getElementById('tnd-menu');
  if (!btn || !menu) return;
  var label = btn.querySelector('.tnd-toggle-label');

  function setOpen(open) {
    btn.setAttribute('aria-expanded', open);
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('tnd-lock', open);
    label.textContent = open ? 'Fermer' : 'Menu';
    if (open) menu.querySelector('.tnd-links a').focus({ preventScroll: true });
  }

  btn.addEventListener('click', function () {
    setOpen(btn.getAttribute('aria-expanded') !== 'true');
  });

  // Échap ferme le menu
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      btn.focus();
    }
  });

  // Repère la page actuelle et lui ajoute l'égaliseur animé
  var page = location.pathname.split('/').pop() || 'index.html';
  menu.querySelectorAll('.tnd-links a').forEach(function (a) {
    if (a.getAttribute('href') === page) {
      a.setAttribute('aria-current', 'page');
      a.insertAdjacentHTML('beforeend',
        '<span class="tnd-eq" aria-hidden="true"><span></span><span></span><span></span><span></span></span>');
    }
  });
})();