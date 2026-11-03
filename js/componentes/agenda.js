Object.assign(Componentes, {
  telaAgenda({ mes, dias, selecionada, repertorios, lembretes, editorLembrete }) {
    const nomesDias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
    const cabecalho = nomesDias.map((nome) => `<span>${nome}</span>`).join("");
    const celulas = dias
      .map((dia) => {
        const marcadores = [
          ...dia.repertorios.slice(0, 3).map(() => '<i class="agenda-marcador repertorio"></i>'),
          ...dia.lembretes.slice(0, 3).map(() => '<i class="agenda-marcador lembrete"></i>'),
        ].join("");
        const classes = [
          "agenda-dia",
          dia.noMes ? "" : "fora-mes",
          dia.data === selecionada ? "selecionado" : "",
          dia.hoje ? "hoje" : "",
          dia.repertorios.length || dia.lembretes.length ? "com-eventos" : "",
        ].filter(Boolean).join(" ");
        return `
          <button class="${classes}" data-acao="agenda-selecionar-data" data-data="${dia.data}" aria-label="${this.formatarData(dia.data)}${dia.repertorios.length ? `, ${dia.repertorios.length} ${dia.repertorios.length === 1 ? "repertório" : "repertórios"}` : ""}${dia.lembretes.length ? `, ${dia.lembretes.length} ${dia.lembretes.length === 1 ? "lembrete" : "lembretes"}` : ""}" aria-pressed="${dia.data === selecionada}">
            <span class="agenda-dia-numero">${dia.numero}</span><span class="agenda-marcadores">${marcadores}</span>
          </button>`;
      })
      .join("");
    const repertoriosHtml = repertorios
      .map(
        (repertorio) => `
          <article class="agenda-evento repertorio">
            <span class="agenda-evento-icone">${this.icone("list")}</span>
            <button class="agenda-evento-detalhe" data-acao="abrir-celebracao" data-id="${repertorio.id}"><strong>${this.escapar(repertorio.titulo)}</strong><small>Repertório agendado</small></button>
            <button class="botao-icone" data-acao="abrir-celebracao" data-id="${repertorio.id}" aria-label="Abrir repertório ${this.escapar(repertorio.titulo)}">${this.icone("chevron")}</button>
          </article>`
      )
      .join("");
    const lembretesHtml = lembretes
      .map(
        (lembrete) => `
          <article class="agenda-evento lembrete">
            <span class="agenda-evento-icone">${this.icone("sparkle")}</span>
            <button class="agenda-evento-detalhe" data-acao="agenda-editar-lembrete" data-id="${lembrete.id}"><strong>${this.escapar(lembrete.titulo)}</strong><small>${this.escapar(lembrete.descricao || "Lembrete")}</small></button>
            <button class="botao-icone" data-acao="agenda-editar-lembrete" data-id="${lembrete.id}" aria-label="Editar lembrete ${this.escapar(lembrete.titulo)}">${this.icone("edit")}</button>
            <button class="botao-icone perigo" data-acao="agenda-apagar-lembrete" data-id="${lembrete.id}" aria-label="Apagar lembrete ${this.escapar(lembrete.titulo)}">${this.icone("trash")}</button>
          </article>`
      )
      .join("");
    const formLembrete = editorLembrete
      ? `
        <form class="agenda-form-lembrete" data-acao="agenda-salvar-lembrete">
          <input type="hidden" name="id" value="${editorLembrete.id || ""}">
          <label>Título do lembrete<input name="titulo" required maxlength="160" value="${this.escapar(editorLembrete.titulo || "")}" placeholder="Ex.: Revisar cifra"></label>
          <label>Data<input name="data_evento" type="date" required value="${this.escapar(editorLembrete.data_evento || selecionada)}"></label>
          <label>Observação (opcional)<textarea name="descricao" rows="3" maxlength="500" placeholder="Anote um detalhe importante...">${this.escapar(editorLembrete.descricao || "")}</textarea></label>
          <div class="acoes-form"><button type="button" class="botao secundario" data-acao="agenda-cancelar-lembrete">Cancelar</button><button type="submit" class="botao primario">Salvar lembrete</button></div>
        </form>`
      : "";

    return `
      <section class="agenda-layout">
        <div class="painel agenda-calendario">
          <header class="agenda-calendario-topo">
            <div><span class="sobrelinha">CALENDÁRIO MENSAL</span><h2>${this.escapar(mes.rotulo)}</h2></div>
            <div class="agenda-navegacao">
              <button class="botao contorno agenda-hoje" data-acao="agenda-hoje">Hoje</button>
              <button class="botao-icone contorno" data-acao="agenda-mudar-mes" data-delta="-1" aria-label="Mês anterior" title="Mês anterior">${this.icone("arrowLeft")}</button>
              <button class="botao-icone contorno agenda-proximo-mes" data-acao="agenda-mudar-mes" data-delta="1" aria-label="Próximo mês" title="Próximo mês">${this.icone("arrowLeft")}</button>
            </div>
          </header>
          <div class="agenda-grade">
            <div class="agenda-dias-semana">${cabecalho}</div>
            <div class="agenda-dias">${celulas}</div>
          </div>
          <div class="agenda-legenda"><span><i class="agenda-marcador repertorio"></i> Repertório</span><span><i class="agenda-marcador lembrete"></i> Lembrete</span></div>
        </div>
        <aside class="painel agenda-dia-painel">
          <header class="agenda-selecionada-topo"><span class="sobrelinha">DIA SELECIONADO</span><h2>${this.escapar(this.formatarData(selecionada))}</h2><p>Os repertórios são sincronizados automaticamente com a data marcada.</p></header>
          <div class="agenda-acoes">
            <button class="botao primario" data-acao="agenda-criar-repertorio">${this.icone("plus")} Criar repertório</button>
            <button class="botao contorno" data-acao="agenda-novo-lembrete">${this.icone("sparkle")} Novo lembrete</button>
          </div>
          ${formLembrete}
          <div class="agenda-eventos">
            <h3>Repertórios</h3>
            ${repertoriosHtml || `<p class="agenda-vazio">Nenhum repertório nesta data.</p>`}
            <h3>Lembretes e anotações</h3>
            ${lembretesHtml || (editorLembrete ? "" : `<p class="agenda-vazio">Nenhum lembrete nesta data.</p>`)}
          </div>
        </aside>
      </section>
    `;
  },
});
