const WA = "https://wa.me/553182773351?text=";
const PADRAO = "Olá, vim do site e quero agendar uma avaliação";

// Links de WhatsApp: garante mensagem certa e abre em nova aba
document.querySelectorAll(".js-wa").forEach((a) => {
  a.href = WA + encodeURIComponent(a.dataset.msg || PADRAO);
  a.target = "_blank";
  a.rel = "noopener";
});

// Menu do celular
const btn = document.getElementById("menu-btn");
const menu = document.getElementById("menu-mobile");
if (btn && menu) {
  const set = (open) => {
    menu.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  btn.addEventListener("click", () => set(menu.hidden));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => set(false)));
}

// Sombra no topo ao rolar
const header = document.querySelector("header");
addEventListener("scroll", () => header?.classList.toggle("shadow-md", scrollY > 8), { passive: true });

// Mapa só carrega quando chega perto da seção
const mapa = document.querySelector("iframe[data-src]");
if (mapa) {
  new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) {
      mapa.src = mapa.dataset.src;
      obs.disconnect();
    }
  }, { rootMargin: "300px" }).observe(mapa);
}
