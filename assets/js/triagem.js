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

    // Formato do WhatsApp: *negrito* e quebras de linha
    const linhas = ["Olá, Bruna! Vim pelo site e quero agendar uma avaliação. 👣", ""];
    const campo = (rotulo, valor) => { if (valor) linhas.push("*" + rotulo + ":* " + valor); };
    campo("Nome", nome);
    campo("Serviço de interesse", servico);
    campo("O que incomoda", q1);
    campo("Onde", q2.join(", "));
    campo("Há quanto tempo", q3);
    campo("O que espero", q4);
    if (linhas.length === 2) linhas.pop();
    linhas.push("", "Pode me ajudar a agendar?");
    return linhas.join("\n");
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
