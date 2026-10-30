Object.assign(Componentes, {
  layoutPalco({ celebracao, item, musica, itens, indice, tomAtual, corpo, sidebarAberta, infoAberta, comentarioId }) {
    const sequencia = itens
      .map((linha, i) => {
        const faixa = linha.musica_id ? Banco.obterMusica(linha.musica_id) : null;
        return `
          <div class="palco-sequencia-linha">
            <button class="palco-sequencia-item ${i === indice ? "ativo" : ""}" data-acao="simular-ir" data-indice="${i}">
              <span class="palco-sequencia-numero">${i + 1}</span>
              <span class="palco-sequencia-detalhe"><strong>${this.escapar(linha.nome_momento || "Momento")}</strong><small>${this.escapar(faixa ? faixa.titulo : "Sem música associada")}</small></span>
              ${faixa ? `<span class="palco-tom-mini">${this.escapar(faixa.tom_original || "C")}</span>` : ""}
            </button>
            ${linha.nota_adicional ? `<button type="button" class="palco-comentario-botao ${Number(comentarioId) === linha.id ? "ativo" : ""}" data-acao="abrir-comentario-palco" data-id="${linha.id}" aria-label="Abrir comentário do momento ${i + 1}" title="Ver comentário">${this.icone("message")}</button>` : ""}
            ${Number(comentarioId) === linha.id ? `<aside class="palco-comentario"><button type="button" class="palco-comentario-fechar" data-acao="fechar-comentario-palco" aria-label="Fechar comentário">${this.icone("close")}</button><strong>Comentário</strong><p>${this.escapar(linha.nota_adicional)}</p></aside>` : ""}
          </div>`;
      })
      .join("");
    const nomeMomento = item ? item.nome_momento || "Momento" : "Repertório sem momentos";
    const autor = musica ? musica.autor || "" : "";

    return `
      <div class="palco-app ${sidebarAberta ? "palco-menu-aberto" : ""} ${infoAberta ? "palco-info-aberta" : ""}">
        <header class="palco-topbar">
          <div class="palco-topbar-esquerda">
            <button class="botao-icone palco-menu-botao" data-acao="alternar-menu-palco" aria-label="${sidebarAberta ? "Fechar sequência" : "Abrir sequência"}" aria-expanded="${sidebarAberta}">${this.icone("menu")}</button>
            <button class="botao-icone palco-info-botao" data-acao="alternar-info-palco" aria-label="${infoAberta ? "Ocultar informações" : "Mostrar informações"}" aria-expanded="${infoAberta}">${this.icone("info")}</button>
            <div class="palco-topbar-titulo"><span><i class="palco-status-ponto"></i>${this.escapar(celebracao.titulo)}</span><strong>${item ? `${indice + 1}. ${this.escapar(nomeMomento)}${musica ? ` — ${this.escapar(musica.titulo)}` : ""}` : "Nenhum momento na sequência"}</strong></div>
          </div>
          <div class="palco-topbar-acoes">
            ${musica && autor ? `<span class="palco-autor">${this.icone("user")}${this.escapar(autor)}</span>` : ""}
            <span class="palco-tom-etiqueta">Tom: <strong>${this.escapar(tomAtual)}</strong></span>
            <button class="botao-icone tema-botao" data-acao="alternar-tema" aria-label="Alternar tema" title="Alternar tema claro ou escuro">${this.icone("sun")}<span>/</span>${this.icone("moon")}</button>
            <button class="botao-icone palco-sair-botao" data-acao="sair-palco" aria-label="Sair do modo palco" title="Sair do modo palco">${this.icone("arrowLeft")}</button>
          </div>
        </header>
        <div class="palco-layout">
          ${sidebarAberta ? `<button type="button" class="palco-menu-fundo" data-acao="alternar-menu-palco" aria-label="Fechar sequência"></button>` : ""}
          <aside class="palco-sequencia">
            <div class="palco-sequencia-titulo"><strong>${this.icone("list")} Sequência do repertório</strong><span>${itens.length} ${itens.length === 1 ? "momento" : "momentos"}</span></div>
            <nav class="palco-sequencia-lista">${sequencia || `<p class="texto-apoio">Este repertório ainda não tem momentos. Volte ao editor para adicionar momentos e músicas.</p>`}</nav>
            <p class="palco-sequencia-ajuda">${this.icone("sparkle")} Selecione um momento para abrir sua cifra.</p>
          </aside>
          <main class="palco-scroll-area">
            <article class="palco-cifra-conteudo">
              <header class="palco-cifra-titulo"><span class="sobrelinha">${item ? `MOMENTO ${indice + 1} DE ${itens.length}` : "MODO PALCO"}</span><h1>${this.escapar(musica ? musica.titulo : nomeMomento)}</h1><p>${musica ? `${this.escapar(autor || "Autor não informado")} · Tom original: ${this.escapar(musica.tom_original || "C")}` : "Associe uma música no editor do repertório para exibir a cifra aqui."}</p></header>
              <pre class="cifra-corpo palco-cifra">${corpo}</pre>
            </article>
          </main>
        </div>
        <div class="palco-controles" role="toolbar" aria-label="Controles de apresentação">
          <div class="palco-controle-grupo palco-controle-rolagem">
            <button class="botao primario" data-acao="alternar-rolagem">${this.icone("play")}<span>Iniciar rolagem</span></button>
            <div class="palco-controle-ajuste">
              <button class="botao-icone" data-acao="velocidade-rolagem" data-delta="-1" aria-label="Diminuir velocidade" title="Diminuir velocidade">−</button>
              <strong class="palco-velocidade">1×</strong>
              <button class="botao-icone" data-acao="velocidade-rolagem" data-delta="1" aria-label="Aumentar velocidade" title="Aumentar velocidade">+</button>
            </div>
          </div>
          <div class="palco-controle-grupo">
            <span class="palco-controle-label">Tom</span>
            <div class="palco-controle-ajuste">
              <button class="botao-icone" data-acao="transpor" data-delta="-1" aria-label="Baixar tom">−</button>
              <strong>${this.escapar(tomAtual)}</strong>
              <button class="botao-icone" data-acao="transpor" data-delta="1" aria-label="Subir tom">+</button>
            </div>
          </div>
          <div class="palco-controle-grupo palco-controle-fonte">
            <span class="palco-controle-label">Fonte</span>
            <div class="palco-controle-ajuste">
              <button class="palco-fonte-botao" data-acao="tamanho-fonte" data-delta="-1" aria-label="Diminuir tamanho da fonte">A−</button>
              <strong class="palco-fonte-tamanho">16px</strong>
              <button class="palco-fonte-botao" data-acao="tamanho-fonte" data-delta="1" aria-label="Aumentar tamanho da fonte">A+</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },
});
