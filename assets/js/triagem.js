// Monta a mensagem do WhatsApp a partir das respostas da triagem.
// Função pura: também é testada pelo tools/check.mjs em Node.
(function (root) {
  function limpar(v) { return (v == null ? "" : String(v)).trim(); }

  function montarMensagem(r) {
    r = r || {};
    const nome = limpar(r.nome);
    const q1 = limpar(r.q1);
    const q2 = (Array.isArray(r.q2) ? r.q2 : [r.q2]).map(limpar).filter(Boolean);
    const q3 = limpar(r.q3);
    const q4 = limpar(r.q4);
    const servico = limpar(r.servico);

    const partes = ["Olá, vim do site."];
    if (nome) partes.push("Me chamo " + nome + ".");
    if (servico) partes.push("Serviço de interesse: " + servico + ".");

    const queixa = [];
    if (q1) queixa.push(q1.charAt(0).toLowerCase() + q1.slice(1));
    if (q2.length) queixa.push("em: " + q2.join(", ").toLowerCase());
    if (q3) queixa.push(q3.charAt(0).toLowerCase() + q3.slice(1));
    if (queixa.length) partes.push("Minha queixa: " + queixa.join(", ") + ".");

    if (q4) partes.push("O que espero: " + q4.charAt(0).toLowerCase() + q4.slice(1) + ".");
    partes.push("Pode me ajudar a agendar?");
    return partes.join(" ");
  }

  // Qual opção da pergunta 1 corresponde ao serviço clicado no card
  function opcaoPorServico(servico) {
    const s = limpar(servico).toLowerCase();
    if (!s) return "";
    if (s.includes("encravada")) return "Unha encravada";
    if (s.includes("calo") || s.includes("rachadura")) return "Calos ou rachaduras";
    if (s.includes("micose") || s.includes("onic")) return "Micose ou unha com aparência diferente";
    if (s.includes("verruga")) return "Outro assunto";
    return "Quero cuidar dos meus pés (prevenção / estética)";
  }

  const api = { montarMensagem, opcaoPorServico };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.Triagem = api;
})(typeof window !== "undefined" ? window : globalThis);
