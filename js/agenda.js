(() => {
  const search = document.getElementById("ev-search");
  const filter = document.getElementById("ev-filter");
  const count = document.getElementById("ev-count");
  const share = document.getElementById("share-agenda");
  const cards = [...document.querySelectorAll(".event-card")];
  const grids = [...document.querySelectorAll(".events-grid")];
  if (!search || !filter) return;

  // ignore majuscules et accents pour la recherche
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  function update() {
    const q = norm(search.value.trim());
    const f = filter.value;
    let shown = 0;

    cards.forEach((c) => {
      const okText = norm(c.textContent).includes(q);
      const okFilter = f === "all" || c.dataset.price === f;
      c.hidden = !(okText && okFilter);
      if (!c.hidden) shown++;
    });

    grids.forEach((g) => {
      const visible = g.querySelectorAll(".event-card:not([hidden])").length;
      g.nextElementSibling.hidden = visible > 0;
    });

    count.textContent = shown + (shown > 1 ? " évènements affichés." : " évènement affiché.");
  }

  search.addEventListener("input", update);
  filter.addEventListener("change", update);
  update();

  share?.addEventListener("click", async () => {
    const url = location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        const old = share.textContent;
        share.textContent = "Lien copié ✓";
        setTimeout(() => (share.textContent = old), 2000);
      }
    } catch (e) { /* partage annulé */ }
  });
})();