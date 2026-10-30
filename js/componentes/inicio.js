Object.assign(Componentes, {
  telaInicio({ proximosRepertorios, proximosLembretes, favoritas, totalMusicas, totalPastas, totalCelebracoes }) {
    const agendaProxima = [
      ...proximosRepertorios.map((roteiro) => ({ ...roteiro, tipo: "repertorio" })),
      ...proximosLembretes.map((lembrete) => ({ ...lembrete, tipo: "lembrete" })),
    ]
      .sort((a, b) => a.data_evento.localeCompare(b.data_evento))
      .map(
        (evento) => `
          <button class="agenda-resumo-item ${evento.tipo}" data-acao="${evento.tipo === "repertorio" ? "abrir-celebracao" : "navegar-agenda-data"}" ${evento.tipo === "repertorio" ? `data-id="${evento.id}"` : `data-data="${this.escapar(evento.data_evento)}"`}>
            <span class="agenda-resumo-icone">${this.icone(evento.tipo === "repertorio" ? "list" : "sparkle")}</span>
            <span class="item-detalhe"><strong>${this.escapar(evento.titulo)}</strong><small>${this.formatarData(evento.data_evento)}${evento.tipo === "repertorio" ? ` · ${this.contagemRegressiva(evento.data_evento)}` : evento.descricao ? ` · ${this.escapar(evento.descricao)}` : " · Lembrete"}</small></span>
            ${this.icone("chevron")}
          </button>`
      )
      .join("");
    const favoritosHtml = favoritas
      .map(
        (musica) => `
          <button class="favorita-item" data-acao="abrir-cifra" data-id="${musica.id}">
            <span class="item-icone azul">${this.icone("music")}</span>
            <span class="item-detalhe"><strong>${this.escapar(musica.titulo)}</strong><small>${this.escapar(musica.autor || "Autor não informado")}</small></span>
            ${this.icone("chevron")}
          </button>`
      )
      .join("");

    return `
      <section class="boas-vindas">
        <div class="boas-vindas-mensagem"><h2>Um abraça bem apertado viu :D</h2></div>
        <img class="boas-vindas-imagem" src="assets/chinchila-boas-vindas.png" alt="Ilustração de uma chinchila usando chapéu e segurando uma flor.">
      </section>
      <section class="resumo-cards" aria-label="Resumo do acervo">
        <article class="resumo-card"><span class="resumo-icone azul">${this.icone("music")}</span><span><small>Músicas cadastradas</small><strong>${totalMusicas}</strong></span></article>
        <article class="resumo-card"><span class="resumo-icone violeta">${this.icone("folder")}</span><span><small>Pastas</small><strong>${totalPastas}</strong></span></article>
        <article class="resumo-card"><span class="resumo-icone verde">${this.icone("list")}</span><span><small>Repertórios</small><strong>${totalCelebracoes}</strong></span></article>
      </section>
      <section class="painel">
        <div class="secao-cabecalho"><div><h2>Agenda desta semana</h2><p>Seus repertórios e lembretes nos próximos 7 dias.</p></div><button class="link-botao" data-acao="navegar" data-tela="agenda">Abrir agenda ${this.icone("chevron")}</button></div>
        <div class="itens-lista agenda-resumo-lista">${agendaProxima || this.estadoVazio("calendar", "Nenhum evento nos próximos 7 dias", "Seus repertórios e lembretes próximos aparecerão aqui.")}</div>
      </section>
      <section class="painel">
        <div class="secao-cabecalho"><div><h2>Músicas favoritas</h2><p>Acesse rapidamente as cifras que você marcou.</p></div><button class="link-botao" data-acao="navegar" data-tela="musicas">Abrir biblioteca ${this.icone("chevron")}</button></div>
        <div class="itens-lista">${favoritosHtml || this.estadoVazio("star", "Suas favoritas aparecerão aqui", "Marque uma música com a estrela para encontrá-la rapidamente.")}</div>
      </section>
    `;
  },

  contagemRegressiva(data) {
    const hoje = new Date();
    const hojeUTC = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const partes = String(data).split("-").map(Number);
    const diaUTC = Date.UTC(partes[0], partes[1] - 1, partes[2]);
    const dias = Math.round((diaUTC - hojeUTC) / 86400000);
    if (dias === 0) return "Hoje";
    if (dias === 1) return "Amanhã";
    return `Faltam ${dias} dias`;
  },
});
