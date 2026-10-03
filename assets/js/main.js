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

// Triagem antes do WhatsApp: abre a janela, monta a mensagem e só então leva à conversa
const triagem = document.getElementById("triagem");
const form = triagem?.querySelector("form");
const pular = document.getElementById("triagem-pular");
if (triagem && form && pular && typeof triagem.showModal === "function" && window.Triagem) {
  let servicoAtual = "";

  document.querySelectorAll(".js-wa").forEach((a) => {
    if (triagem.contains(a)) return;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      form.reset();
      const msg = a.dataset.msg || "";
      servicoAtual = (msg.match(/agendar: (.+)$/) || [])[1] || "";
      if (/domicílio/i.test(msg)) servicoAtual = "Atendimento em domicílio";
      const opcao = window.Triagem.opcaoPorServico(servicoAtual);
      const radio = opcao && form.querySelector(`input[name="q1"][value="${opcao}"]`);
      if (radio) radio.checked = true;
      pular.href = a.href;
      triagem.showModal();
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const msg = window.Triagem.montarMensagem({
      nome: d.get("nome"),
      q1: d.get("q1"),
      q2: d.getAll("q2"),
      q3: d.get("q3"),
      q4: d.get("q4"),
      servico: servicoAtual,
    });
    triagem.close();
    window.open(WA + encodeURIComponent(msg), "_blank", "noopener");
  });

  triagem.querySelector("[data-fechar]")?.addEventListener("click", () => triagem.close());
  // Clique fora da janela fecha
  triagem.addEventListener("click", (e) => { if (e.target === triagem) triagem.close(); });
}
