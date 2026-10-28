/* Componentes da tela de pastas. */

Object.assign(Componentes, {
  telaPastas({ pastas, contagens, busca }) {
    const cards = pastas
      .filter((pasta) => pasta.nome.toLowerCase().includes(String(busca || "").trim().toLowerCase()))
      .map(
        (pasta) => `
          <button class="pasta-card" data-acao="abrir-pasta" data-id="${pasta.id}">
            <span class="pasta-capa-mini">${pasta.capa ? `<img src="${this.escapar(pasta.capa)}" alt="">` : this.icone("folder")}</span>
            <span class="pasta-abre"><strong>${this.escapar(pasta.nome)}</strong><span>${contagens[pasta.id] || 0} ${(contagens[pasta.id] || 0) === 1 ? "música" : "músicas"}</span></span>
          </button>`
      )
      .join("");
    const encontrouPastas = pastas.some((pasta) =>
      pasta.nome.toLowerCase().includes(String(busca || "").trim().toLowerCase())
    );

    return `
      <section class="filtros-linha"><form class="busca-form" data-acao="filtrar-pastas">${this.icone("search")}<input name="busca" type="search" placeholder="Buscar pasta..." value="${this.escapar(busca || "")}" aria-label="Buscar pasta"></form><p class="texto-apoio">Organize suas músicas por categoria ou gênero.</p></section>
      <section class="grade-pastas">${cards || this.estadoVazio("folder", busca && pastas.length ? "Nenhuma pasta encontrada" : "Você ainda não criou pastas", busca && pastas.length ? "Tente buscar por outro nome." : "Crie pastas para agrupar músicas do seu jeito.", busca ? null : { acao: "criar-pasta", rotulo: "Criar primeira pasta" })}</section>
    `;
  },

  telaDetalhePasta({ pasta, musicas, totalMusicas, musicasDisponiveis, buscaMusicas, buscaAdicionar, musicasSelecionadas, adicaoAberta }) {
    const musicasHtml = musicas.map((musica) => `
      <article class="pasta-musica-item">
        <button class="pasta-musica-detalhe" data-acao="abrir-cifra" data-id="${musica.id}">
          <span class="mini-icone">${this.icone("music")}</span>
          <span><strong>${this.escapar(musica.titulo)}</strong><small>${this.escapar(musica.autor || "Autor não informado")} · ${this.escapar(musica.tom_original || "C")}</small></span>
        </button>
        <button class="botao contorno pasta-remover-musica" data-acao="remover-musica-pasta" data-id="${musica.id}" aria-label="Remover ${this.escapar(musica.titulo)} desta pasta">Remover</button>
      </article>`).join("");
    const disponiveisHtml = musicasDisponiveis.map((musica) => `
      <label class="pasta-selecao-musica">
        <input type="checkbox" name="musicas" value="${musica.id}" data-selecao-pasta ${musicasSelecionadas.includes(musica.id) ? "checked" : ""}>
        <span>${this.escapar(musica.titulo)}</span>
      </label>`).join("");

    return `
      <button class="link-botao voltar-link" data-acao="voltar-pastas">${this.icone("arrowLeft")} Voltar às pastas</button>
      <section class="painel pasta-detalhe">
        <header class="pasta-detalhe-cabecalho">
          <div class="pasta-capa-grande">${pasta.capa ? `<img src="${this.escapar(pasta.capa)}" alt="Capa da pasta ${this.escapar(pasta.nome)}">` : this.icone("folder")}</div>
          <div class="pasta-detalhe-titulo"><span class="sobrelinha">PASTA</span><h2>${this.escapar(pasta.nome)}</h2><p>${totalMusicas} ${totalMusicas === 1 ? "música" : "músicas"} nesta pasta</p></div>
          <button class="botao contorno perigo" data-acao="apagar-pasta" data-id="${pasta.id}">${this.icone("trash")} Excluir pasta</button>
        </header>
        <form class="pasta-edicao" data-acao="salvar-pasta-detalhe">
          <input type="hidden" name="id" value="${pasta.id}">
          <label>Nome da pasta<input name="nome" required maxlength="80" value="${this.escapar(pasta.nome)}"></label>
          <label class="pasta-capa-campo"><span>Capa personalizada</span><input type="file" name="capa" accept="image/*"><small>Escolha uma imagem do seu dispositivo.</small></label>
          <div class="pasta-edicao-acoes"><button type="submit" class="botao primario">${this.icone("edit")} Salvar pasta</button>${pasta.capa ? `<button type="button" class="botao contorno" data-acao="remover-capa-pasta" data-id="${pasta.id}">Remover capa</button>` : ""}</div>
        </form>
      </section>
      <section class="painel pasta-conteudo">
        <header class="secao-cabecalho"><div><h2>Músicas da pasta</h2><p>Pesquise no acervo ou adicione músicas em grupo.</p></div><button class="botao primario" data-acao="alternar-adicao-pasta">${this.icone("plus")} ${adicaoAberta ? "Fechar seleção" : "Adicionar músicas"}</button></header>
        ${adicaoAberta ? `
          <div class="pasta-selecao">
            <form class="busca-form pasta-busca-adicionar" data-acao="filtrar-adicao-pasta">${this.icone("search")}<input name="busca_adicionar" type="search" value="${this.escapar(buscaAdicionar)}" placeholder="Buscar música para adicionar..." aria-label="Buscar músicas para adicionar"></form>
            <form data-acao="adicionar-musicas-pasta">
              <div class="pasta-selecao-lista">${disponiveisHtml || `<p class="texto-apoio">${buscaAdicionar ? "Nenhuma música disponível com esse nome." : "Todas as músicas cadastradas já estão nesta pasta."}</p>`}</div>
              <div class="pasta-selecao-acoes"><span>${musicasSelecionadas.length} selecionada(s)</span><button type="submit" class="botao primario" ${musicasSelecionadas.length ? "" : "disabled"}>Adicionar selecionadas</button></div>
            </form>
          </div>` : ""}
        <form class="busca-form pasta-busca-musicas" data-acao="filtrar-musicas-pasta">
          ${this.icone("search")}<input name="busca_musicas" type="search" value="${this.escapar(buscaMusicas)}" placeholder="Pesquisar música nesta pasta..." aria-label="Pesquisar músicas nesta pasta">
        </form>
        <div class="pasta-musicas-lista">${musicasHtml || `<p class="texto-apoio">${buscaMusicas ? "Nenhuma música encontrada nesta pasta." : "Esta pasta ainda não tem músicas. Use “Adicionar músicas” para começar."}</p>`}</div>
      </section>
    `;
  },
});
