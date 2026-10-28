/* Componentes da tela de repertorios. */

Object.assign(Componentes, {
  telaCelebracoes({ celebracoes, busca }) {
    const cards = celebracoes
      .map(
        (celebracao) => `
          <article class="roteiro-card">
            <button class="roteiro-abre" data-acao="abrir-celebracao" data-id="${celebracao.id}">
              <span class="item-icone violeta">${this.icone("list")}</span>
              <span class="item-detalhe"><strong>${this.escapar(celebracao.titulo)}</strong><small>${this.icone("calendar")} ${this.formatarData(celebracao.data_evento)}${celebracao.local ? ` · ${this.escapar(celebracao.local)}` : ""}</small></span>
              ${this.icone("chevron")}
            </button>
            <div class="acoes-linha">
              <button class="botao-icone" data-acao="simular" data-id="${celebracao.id}" aria-label="Simular ${this.escapar(celebracao.titulo)}" title="Modo palco">${this.icone("play")}</button>
              <button class="botao-icone" data-acao="abrir-celebracao" data-id="${celebracao.id}" aria-label="Editar ${this.escapar(celebracao.titulo)}" title="Editar">${this.icone("edit")}</button>
              <button class="botao-icone" data-acao="clonar-celebracao" data-id="${celebracao.id}" aria-label="Clonar ${this.escapar(celebracao.titulo)}" title="Clonar repertório">${this.icone("list")}</button>
              <button class="botao-icone perigo" data-acao="apagar-celebracao" data-id="${celebracao.id}" aria-label="Apagar ${this.escapar(celebracao.titulo)}" title="Apagar">${this.icone("trash")}</button>
            </div>
          </article>`
      )
      .join("");

    return `
      <form class="busca-form busca-rota" data-acao="filtrar-celebracoes">
        ${this.icone("search")}<input name="busca" type="search" placeholder="Buscar repertório..." value="${this.escapar(busca)}" aria-label="Buscar repertório">
      </form>
      <section class="painel roteiro-painel">
        <div class="tabela-resumo"><span>${celebracoes.length} ${celebracoes.length === 1 ? "repertório" : "repertórios"}</span><span>Apresentações e eventos</span></div>
        <div class="roteiros-lista">${cards || this.estadoVazio("list", busca ? "Nenhum repertório encontrado" : "Nenhum repertório cadastrado", busca ? "Tente buscar por outro nome." : "Monte uma sequência para sua próxima apresentação.", busca ? null : { acao: "nova-celebracao", rotulo: "Criar repertório" })}</div>
      </section>
    `;
  },

  formularioCelebracao({ celebracao, itens, musicas, momentos, dataInicial, retornoAgenda }) {
    const hoje = new Date();
    const hojeISO = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
    const c = celebracao || { titulo: "", data_evento: dataInicial || hojeISO };
    const sugestoes = momentos.map((nome) => `<option value="${this.escapar(nome)}"></option>`).join("");
    const linhas = itens
      .map(
        (item) => {
          const musicaSelecionada = item.musica_id ? Banco.obterMusica(item.musica_id) : null;
          const repeticoes = item.musica_id
            ? itens.filter((outro) => Number(outro.musica_id) === Number(item.musica_id)).length
            : 0;
          return `
          <article class="momento-card" data-item-id="${item.id}">
            <div class="momento-topo"><strong><span class="momento-arrastar" tabindex="0" role="button" aria-label="Reordenar momento com arrastar ou pelas setas do teclado" title="Arraste ou use as setas para reordenar">${this.icone("menu")}</span> Momento ${item.posicao_ordem}</strong><div class="acoes-linha">
              <button type="button" class="botao-icone perigo" data-acao="apagar-item" data-id="${item.id}" aria-label="Apagar momento">${this.icone("trash")}</button>
            </div></div>
            <div class="campos-duplos">
              <label>Nome do momento<input list="momentos-padrao" data-campo="nome_momento" data-id="${item.id}" value="${this.escapar(item.nome_momento)}" placeholder="Ex.: Entrada"></label>
              <div class="campo-musica"><label>Música</label><span class="momento-musica-selecionada" data-musica-selecionada="${item.id}">${this.escapar(musicaSelecionada ? musicaSelecionada.titulo : "Nenhuma música selecionada")}</span>${repeticoes > 1 && celebracao ? `<small class="momento-musica-aviso">${this.icone("info")} Música em ${repeticoes} momentos.</small>` : ""}<input type="search" class="momento-busca-musica" data-acao="buscar-musica-momento" data-id="${item.id}" autocomplete="off" placeholder="Buscar por título ou autor..." aria-label="Buscar música para o momento ${item.posicao_ordem}"><div class="momento-busca-resultados" hidden></div></div>
              <label class="campo-largo">Observação<input data-campo="nota_adicional" data-id="${item.id}" value="${this.escapar(item.nota_adicional || "")}" placeholder="Uma observação para este momento (opcional)"></label>
            </div>
          </article>`;
        }
      )
      .join("");

    return `
      <section class="painel formulario-painel">
        <form class="formulario" data-acao="salvar-celebracao">
          <input type="hidden" name="id" value="${c.id || ""}">
          <input type="hidden" name="retorno_agenda" value="${retornoAgenda ? "true" : "false"}">
          <div class="campos-duplos">
            <label>Nome do repertório<input name="titulo" required maxlength="160" value="${this.escapar(c.titulo)}" placeholder="Ex.: Apresentação de sábado"></label>
            <label>Data do evento<input type="date" name="data_evento" value="${this.escapar(c.data_evento)}"></label>
            <label class="campo-local"><span>Local <small>(opcional)</small></span><input name="local" maxlength="80" value="${this.escapar(c.local || "")}" placeholder="Ex.: Igreja do Centro"></label>
          </div>
          <div class="acoes-form">
            ${retornoAgenda ? `<button type="button" class="botao secundario" data-acao="voltar-agenda">${this.icone("arrowLeft")} Voltar à agenda</button>` : `<button type="button" class="botao secundario" data-acao="navegar" data-tela="celebracoes">Voltar</button>`}
            <button type="submit" class="botao primario">Salvar repertório</button>
            ${c.id ? `<button type="button" class="botao contorno" data-acao="simular" data-id="${c.id}">${this.icone("play")} Modo palco</button>` : ""}
            ${c.id ? `<button type="button" class="botao contorno" data-acao="clonar-celebracao" data-id="${c.id}">${this.icone("list")} Clonar repertório</button>` : ""}
          </div>
        </form>
      </section>
      <datalist id="momentos-padrao">${sugestoes}</datalist>
      <section class="painel momentos-painel">
        <div class="secao-cabecalho"><div><h2>Sequência do repertório</h2><p>Organize os momentos e associe as músicas cadastradas.</p></div>${c.id ? `<button class="botao secundario" data-acao="adicionar-item" data-id="${c.id}">${this.icone("plus")} Adicionar momento</button>` : ""}</div>
        ${c.id ? linhas || this.estadoVazio("list", "Nenhum momento adicionado", "Adicione um momento para começar a montar a sequência.", { acao: "adicionar-item", rotulo: "Adicionar momento" }) : `<p class="aviso-info">Salve o repertório para começar a adicionar momentos.</p>`}
      </section>
    `;
  },

  resultadosBuscaMusica(musicas, itemId, busca) {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    const encontrados = musicas
      .filter((musica) => `${musica.titulo} ${musica.autor || ""}`.toLocaleLowerCase("pt-BR").includes(termo))
      .slice(0, 20);
    const opcaoSemMusica = `<button type="button" class="momento-busca-opcao" data-acao="selecionar-musica-momento" data-id="${itemId}" data-musica-id=""><strong>Sem música associada</strong></button>`;
    if (!encontrados.length) return `${opcaoSemMusica}<p class="momento-busca-vazio">Nenhuma música encontrada.</p>`;
    return opcaoSemMusica + encontrados.map((musica) => `
      <button type="button" class="momento-busca-opcao" data-acao="selecionar-musica-momento" data-id="${itemId}" data-musica-id="${musica.id}">
        <strong>${this.escapar(musica.titulo)}</strong>${musica.autor ? `<small>${this.escapar(musica.autor)}</small>` : ""}
      </button>`).join("");
  },

  telaSimular({ celebracao, itens, musicas, indice, tomAtual }) {
    const item = itens[indice];
    const musica = item ? musicas.find((m) => m.id === item.musica_id) : null;
    const nav = itens
      .map(
        (linha, i) => `
          <button class="sim-item ${i === indice ? "ativo" : ""}" data-acao="simular-ir" data-indice="${i}">
            <span class="sim-numero">${i + 1}</span><span>${this.escapar(linha.nome_momento || "Momento")}</span>
          </button>`
      )
      .join("");
    const corpo = musica
      ? `<pre class="cifra-corpo">${this.escapar(this.transporCifra(musica.corpo_cifra, musica.tom_original, tomAtual) || "Esta música ainda não tem cifra cadastrada.")}</pre>`
      : this.estadoVazio("music", "Nenhuma música neste momento", "Edite o repertório para associar uma música cadastrada.");

    return `
      <section class="modo-palco">
        <aside class="palco-lateral"><button class="link-botao" data-acao="abrir-celebracao" data-id="${celebracao.id}">${this.icone("arrowLeft")} Voltar ao repertório</button><h2>${this.escapar(celebracao.titulo)}</h2><p>SEQUÊNCIA</p><nav>${nav || `<span class="texto-apoio">Adicione momentos ao repertório para usar o modo palco.</span>`}</nav></aside>
        <div class="palco-conteudo"><div class="palco-cabecalho"><div><span class="sobrelinha">${item ? `MOMENTO ${indice + 1} DE ${itens.length}` : "MODO PALCO"}</span><h2>${this.escapar(item ? item.nome_momento : celebracao.titulo)}</h2><p>${this.escapar(musica ? musica.titulo : item && item.nota_adicional ? item.nota_adicional : "")}</p></div>${musica ? `<div class="tom-barra"><span>Tom</span><div><button class="botao secundario" data-acao="transpor" data-delta="-1" aria-label="Baixar tom">−</button><strong>${this.escapar(tomAtual)}</strong><button class="botao secundario" data-acao="transpor" data-delta="1" aria-label="Subir tom">+</button></div></div>` : ""}</div>${corpo}</div>
      </section>
    `;
  },
});
