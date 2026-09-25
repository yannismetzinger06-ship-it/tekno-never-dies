const membres = {
  yannis: {
    name: "Yannis",
    role: "Président de l'association",
    tags: ["Organisation générale", "Baron", "Supervision", "Gestion & coordination"],
    extra: { "Âge": "", "Rôle précis": "" }
  },
  "jonathan-axel": {
    name: "Jonathan & Axel",
    role: "Responsables sonorisation/lumières",
    tags: ["Gestion & installation", "Réglages & tests", "Entretien du matériel"],
    extra: { "Âge": "", "Rôle précis": "" }
  },
  estebane: {
    name: "Estebane",
    role: "Bras & mains de l'association",
    tags: ["Montage/installation", "Polyvalent"],
    extra: { "Âge": "", "Rôle précis": "" }
  },
  ricky: {
    name: "Ricky",
    role: "Organisation du bar",
    tags: ["Gestion des stocks", "Organisation du bar"],
    extra: { "Âge": "", "Rôle précis": "" }
  },
  "celeste-yelena": {
    name: "Céleste & Yelena",
    role: "Communication / événementiel",
    tags: ["Réseaux sociaux", "Création de contenus", "Stratégie & image"],
    extra: { "Âge": "", "Rôle précis": "" }
  },
  remi: {
    name: "Rémi",
    role: "Nouveau membre",
    tags: ["Montage & démontage", "Organisation du bar"],
    extra: { "Âge": "", "Rôle précis": "" }
  },
  "elena-yanniv": {
    name: "Elena & Yanniv",
    role: "Bénévoles",
    tags: ["Bons commerciaux", "Entrée & billeterie"],
    extra: { "Âge": "", "Rôle précis": "" }
  },
  noah: {
    name: "Noah",
    role: "Artiste bénévole",
    tags: ["Graffitis", "Créations visuelles"],
    extra: { "Âge": "", "Rôle précis": "" }
  }
};

const modal = document.getElementById("team-modal");

if (modal) {
  const img = document.getElementById("team-modal-img");
  const nameEl = document.getElementById("team-modal-name");
  const roleEl = document.getElementById("team-modal-role");
  const tagsEl = document.getElementById("team-modal-tags");
  const extraEl = document.getElementById("team-modal-extra");

  function openModal(key, src) {
    const data = membres[key];
    if (!data) return;
    img.src = src;
    img.alt = data.name;
    nameEl.textContent = data.name;
    roleEl.textContent = data.role;
    tagsEl.innerHTML = data.tags.map(t => `<span>${t}</span>`).join("");
    extraEl.innerHTML = Object.entries(data.extra)
      .map(([label, value]) => `<div><dt>${label}</dt><dd>${value || "À venir"}</dd></div>`)
      .join("");
    modal.classList.add("is-open");
  }

  function closeModal() {
    modal.classList.remove("is-open");
  }

  document.querySelectorAll('.team-track > li:not([aria-hidden="true"]) .team-card[data-member]')
    .forEach(card => {
      card.addEventListener("click", () => {
        const key = card.dataset.member;
        const src = card.querySelector("img").src;
        openModal(key, src);
      });
    });

  modal.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });
}