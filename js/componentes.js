/* Renderização das telas e componentes visuais do Chinchila. */

const Componentes = {
  icone(nome, classe = "") {
    const caminhos = {
      home: '<path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/>',
      music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
      folder: '<path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
      list: '<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>',
      settings: '<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2z"/>',
      search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
      moon: '<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13z"/>',
      user: '<circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/>',
      edit: '<path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z"/>',
      trash: '<path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6"/>',
      star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>',
      chevron: '<path d="m9 18 6-6-6-6"/>',
      arrowLeft: '<path d="m12 19-7-7 7-7"/><path d="M5 12h14"/>',
      play: '<path d="m8 5 12 7-12 7z"/>',
      pause: '<path d="M8 5h3v14H8zM15 5h3v14h-3z"/>',
      calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
      sparkle: '<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/><path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1z"/>',
      more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
      close: '<path d="m18 6-12 12M6 6l12 12"/>',
    };
    return `<svg class="icone ${classe}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${caminhos[nome] || ""}</svg>`;
  },

  layout({ telaAtiva, titulo, descricao, perfil, html, acaoCriar, rotuloCriar }) {
    const links = [
      { id: "inicio", rotulo: "Início", icone: "home" },
      { id: "musicas", rotulo: "Músicas", icone: "music" },
      { id: "pastas", rotulo: "Pastas", icone: "folder" },
      { id: "celebracoes", rotulo: "Repertórios", icone: "list" },
      { id: "configuracoes", rotulo: "Configurações", icone: "settings" },
    ];
    const nav = links
      .map(
        (link) => `
          <button class="nav-link ${telaAtiva === link.id ? "ativo" : ""}" data-acao="navegar" data-tela="${link.id}">
            ${this.icone(link.icone)}<span>${link.rotulo}</span>
          </button>`
      )
      .join("");
    const iniciais = String(perfil.nome || "Meu perfil")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((parte) => parte[0])
      .join("")
      .toUpperCase();

    return `
      <div class="app-shell">
        <aside class="sidebar">
          <button class="marca" data-acao="navegar" data-tela="inicio" aria-label="Chinchila — início">
            <span class="marca-icone">${this.icone("music")}</span>
            <span class="marca-texto"><strong>Chinchila</strong><small>Sua música organizada</small></span>
          </button>
          <div class="menu-titulo">MENU PRINCIPAL</div>
          <nav class="menu">${nav}</nav>
          <div class="sidebar-rodape">
            <div class="offline-card">
              <span class="status-ponto"></span>
              <span><strong>Disponível offline</strong><small>Seus dados ficam neste dispositivo.</small></span>
            </div>
            <button class="perfil" data-acao="editar-perfil">
              <span class="avatar">${this.escapar(iniciais || "U")}</span>
              <span class="perfil-info"><strong>${this.escapar(perfil.nome || "Meu perfil")}</strong><small>Perfil local</small></span>
              ${this.icone("more")}
            </button>
          </div>
        </aside>
        <main class="conteudo">
          <header class="topbar">
            <div class="topbar-titulo">
              <h1>${this.escapar(titulo)}</h1>
              <p>${this.escapar(descricao)}</p>
            </div>
            <div class="topbar-acoes">
              <button class="botao-icone tema-botao" data-acao="alternar-tema" aria-label="Alternar tema" title="Alternar tema claro ou escuro">
                ${this.icone("sun")}<span>/</span>${this.icone("moon")}
              </button>
              ${acaoCriar ? `<button class="botao primario" data-acao="${acaoCriar}">${this.icone("plus")}<span>${this.escapar(rotuloCriar)}</span></button>` : ""}
            </div>
          </header>
          <div class="pagina">${html}</div>
        </main>
      </div>
    `;
  },

  layoutPalco({ celebracao, item, musica, itens, indice, tomAtual, corpo }) {
    const sequencia = itens
      .map((linha, i) => {
        const faixa = linha.musica_id ? Banco.obterMusica(linha.musica_id) : null;
        return `
          <button class="palco-sequencia-item ${i === indice ? "ativo" : ""}" data-acao="simular-ir" data-indice="${i}">
            <span class="palco-sequencia-numero">${i + 1}</span>
            <span class="palco-sequencia-detalhe"><strong>${this.escapar(linha.nome_momento || "Momento")}</strong><small>${this.escapar(faixa ? faixa.titulo : "Sem música associada")}</small></span>
            ${faixa ? `<span class="palco-tom-mini">${this.escapar(faixa.tom_original || "C")}</span>` : ""}
          </button>`;
      })
      .join("");
    const nomeMomento = item ? item.nome_momento || "Momento" : "Repertório sem momentos";
    const autor = musica ? musica.autor || "" : "";
    const observacao = item && item.nota_adicional ? `
      <aside class="palco-observacao"><strong>Observação</strong><p>${this.escapar(item.nota_adicional)}</p></aside>` : "";

    return `
      <div class="palco-app">
        <header class="palco-topbar">
          <div class="palco-topbar-esquerda">
            <button class="botao contorno" data-acao="sair-palco">${this.icone("arrowLeft")}<span>Sair do modo palco</span></button>
            <span class="palco-divisor"></span>
            <div class="palco-topbar-titulo"><span><i class="palco-status-ponto"></i>${this.escapar(celebracao.titulo)}</span><strong>${item ? `${indice + 1}. ${this.escapar(nomeMomento)}${musica ? ` — ${this.escapar(musica.titulo)}` : ""}` : "Nenhum momento na sequência"}</strong></div>
          </div>
          <div class="palco-topbar-acoes">
            ${musica && autor ? `<span class="palco-autor">${this.icone("user")}${this.escapar(autor)}</span>` : ""}
            <span class="palco-tom-etiqueta">Tom: <strong>${this.escapar(tomAtual)}</strong></span>
            <button class="botao-icone tema-botao" data-acao="alternar-tema" aria-label="Alternar tema" title="Alternar tema claro ou escuro">${this.icone("sun")}<span>/</span>${this.icone("moon")}</button>
          </div>
        </header>
        <div class="palco-layout">
          <aside class="palco-sequencia">
            <div class="palco-sequencia-titulo"><strong>${this.icone("list")} Sequência do repertório</strong><span>${itens.length} ${itens.length === 1 ? "momento" : "momentos"}</span></div>
            <nav class="palco-sequencia-lista">${sequencia || `<p class="texto-apoio">Este repertório ainda não tem momentos. Volte ao editor para adicionar momentos e músicas.</p>`}</nav>
            <p class="palco-sequencia-ajuda">${this.icone("sparkle")} Selecione um momento para abrir sua cifra.</p>
          </aside>
          <main class="palco-scroll-area">
            <article class="palco-cifra-conteudo">
              ${observacao}
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

  telaInicio({ recentes, favoritas, totalMusicas, totalPastas, totalCelebracoes }) {
    const ultimos = recentes
      .map(
        (roteiro) => `
          <button class="recente-item" data-acao="abrir-celebracao" data-id="${roteiro.id}">
            <span class="item-icone">${this.icone("list")}</span>
            <span class="item-detalhe"><strong>${this.escapar(roteiro.titulo)}</strong><small>${this.formatarData(roteiro.data_evento)}</small></span>
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
        <div><span class="sobrelinha">SEU ESPAÇO MUSICAL</span><h2>Organize suas músicas com tranquilidade.</h2><p>Suas cifras, pastas e roteiros em um só lugar — prontos mesmo sem internet.</p></div>
        <span class="boas-vindas-icone">${this.icone("music")}</span>
      </section>
      <section class="resumo-cards" aria-label="Resumo do acervo">
        <article class="resumo-card"><span class="resumo-icone azul">${this.icone("music")}</span><span><small>Músicas cadastradas</small><strong>${totalMusicas}</strong></span></article>
        <article class="resumo-card"><span class="resumo-icone violeta">${this.icone("folder")}</span><span><small>Pastas</small><strong>${totalPastas}</strong></span></article>
        <article class="resumo-card"><span class="resumo-icone verde">${this.icone("list")}</span><span><small>Repertórios</small><strong>${totalCelebracoes}</strong></span></article>
      </section>
      <section class="painel">
        <div class="secao-cabecalho"><div><h2>Repertórios recentes</h2><p>Continue de onde você parou.</p></div><button class="link-botao" data-acao="navegar" data-tela="celebracoes">Ver repertórios ${this.icone("chevron")}</button></div>
        <div class="itens-lista">${ultimos || this.estadoVazio("calendar", "Nenhum repertório por aqui", "Crie um repertório para organizar as músicas de uma apresentação.")}</div>
      </section>
      <section class="painel">
        <div class="secao-cabecalho"><div><h2>Músicas favoritas</h2><p>Acesse rapidamente as cifras que você marcou.</p></div><button class="link-botao" data-acao="navegar" data-tela="musicas">Abrir biblioteca ${this.icone("chevron")}</button></div>
        <div class="itens-lista">${favoritosHtml || this.estadoVazio("star", "Suas favoritas aparecerão aqui", "Marque uma música com a estrela para encontrá-la rapidamente.")}</div>
      </section>
    `;
  },

  telaMusicas({ musicas, pastas, busca, pastaId }) {
    const opcoes = [`<option value="">Todas as pastas</option>`]
      .concat(
        pastas.map(
          (pasta) =>
            `<option value="${pasta.id}" ${String(pastaId) === String(pasta.id) ? "selected" : ""}>${this.escapar(pasta.nome)}</option>`
        )
      )
      .join("");
    const linhas = musicas
      .map((musica) => {
        const pasta = pastas.find((item) => item.id === musica.pasta_id);
        return `
          <tr>
            <td><button class="botao-icone favorito-botao ${musica.is_fixada ? "favorito-ativo" : ""}" data-acao="favoritar" data-id="${musica.id}" aria-label="${musica.is_fixada ? "Remover dos favoritos" : "Adicionar aos favoritos"}" title="${musica.is_fixada ? "Remover dos favoritos" : "Adicionar aos favoritos"}">${this.icone("star")}</button></td>
            <td><button class="musica-titulo" data-acao="abrir-cifra" data-id="${musica.id}"><span class="mini-icone">${this.icone("music")}</span><span><strong>${this.escapar(musica.titulo)}</strong><small>${this.escapar(musica.tom_original || "C")}</small></span></button></td>
            <td>${this.escapar(musica.autor || "—")}</td>
            <td><span class="tom-etiqueta">${this.escapar(musica.tom_original || "C")}</span></td>
            <td>${this.escapar(pasta ? pasta.nome : "Sem pasta")}</td>
            <td><div class="acoes-linha">
              <button class="botao-icone" data-acao="editar-musica" data-id="${musica.id}" aria-label="Editar ${this.escapar(musica.titulo)}" title="Editar">${this.icone("edit")}</button>
              <button class="botao-icone perigo" data-acao="apagar-musica" data-id="${musica.id}" aria-label="Apagar ${this.escapar(musica.titulo)}" title="Apagar">${this.icone("trash")}</button>
            </div></td>
          </tr>`;
      })
      .join("");

    return `
      <section class="filtros-linha">
        <form class="busca-form" data-acao="filtrar-musicas">
          ${this.icone("search")}
          <input name="busca" type="search" placeholder="Buscar música ou artista..." value="${this.escapar(busca)}" aria-label="Buscar música ou artista">
        </form>
        <label class="filtro-pasta"><span>Filtrar por pasta</span><select class="filtro-select" aria-label="Filtrar músicas por pasta">${opcoes}</select></label>
      </section>
      <section class="painel tabela-painel">
        <div class="tabela-resumo"><span>${musicas.length} ${musicas.length === 1 ? "música encontrada" : "músicas encontradas"}</span><span>Seu acervo pessoal</span></div>
        ${musicas.length ? `
          <div class="tabela-scroll"><table class="tabela-musicas">
            <thead><tr><th aria-label="Favorita"></th><th>Título</th><th>Artista / autor</th><th>Tom</th><th>Pasta</th><th class="coluna-acoes">Ações</th></tr></thead>
            <tbody>${linhas}</tbody>
          </table></div>
        ` : this.estadoVazio("music", busca || pastaId ? "Nenhuma música encontrada" : "Sua biblioteca começa aqui", busca || pastaId ? "Tente mudar a busca ou o filtro de pasta." : "Adicione suas próprias músicas e cifras. Elas aparecerão nesta lista.", { acao: "nova-musica", rotulo: "Adicionar primeira música" })}
      </section>
    `;
  },

  formularioMusica({ musica, pastas }) {
    const m = musica || { titulo: "", autor: "", tom_original: "C", pasta_id: "", corpo_cifra: "", is_fixada: false };
    const opcoes = [`<option value="">Sem pasta</option>`]
      .concat(
        pastas.map(
          (pasta) =>
            `<option value="${pasta.id}" ${String(m.pasta_id) === String(pasta.id) ? "selected" : ""}>${this.escapar(pasta.nome)}</option>`
        )
      )
      .join("");

    return `
      <section class="painel formulario-painel">
        <form class="formulario" data-acao="salvar-musica">
          <input type="hidden" name="id" value="${m.id || ""}">
          <div class="formulario-intro"><span class="resumo-icone azul">${this.icone("music")}</span><div><h2>Detalhes da música</h2><p>Preencha as informações que ajudam você a encontrar e tocar esta cifra.</p></div></div>
          <div class="campos-duplos">
            <label>Título da música<input name="titulo" required maxlength="160" value="${this.escapar(m.titulo)}" placeholder="Ex.: nome da música"></label>
            <label>Artista ou autor<input name="autor" maxlength="120" value="${this.escapar(m.autor || "")}" placeholder="Quem interpreta ou compôs?"></label>
            <label>Tom original<input name="tom_original" maxlength="8" value="${this.escapar(m.tom_original || "C")}" placeholder="Ex.: C, G ou Am"></label>
            <label>Pasta<select name="pasta_id">${opcoes}</select></label>
          </div>
          <label>Cifra<textarea name="corpo_cifra" rows="16" class="cifra-editor" placeholder="Cole ou escreva a cifra aqui...">${this.escapar(m.corpo_cifra || "")}</textarea><small class="campo-ajuda">A cifra fica salva localmente neste dispositivo.</small></label>
          <label class="check-favorito"><input type="checkbox" name="is_fixada" ${m.is_fixada ? "checked" : ""}><span>${this.icone("star")} Fixar entre as favoritas</span></label>
          <div class="acoes-form">
            <button type="button" class="botao secundario" data-acao="navegar" data-tela="musicas">Cancelar</button>
            <button type="submit" class="botao primario">Salvar música</button>
          </div>
        </form>
      </section>
    `;
  },

  telaCelebracoes({ celebracoes, busca }) {
    const cards = celebracoes
      .map(
        (celebracao) => `
          <article class="roteiro-card">
            <button class="roteiro-abre" data-acao="abrir-celebracao" data-id="${celebracao.id}">
              <span class="item-icone violeta">${this.icone("list")}</span>
              <span class="item-detalhe"><strong>${this.escapar(celebracao.titulo)}</strong><small>${this.icone("calendar")} ${this.formatarData(celebracao.data_evento)}</small></span>
              ${this.icone("chevron")}
            </button>
            <div class="acoes-linha">
              <button class="botao-icone" data-acao="simular" data-id="${celebracao.id}" aria-label="Simular ${this.escapar(celebracao.titulo)}" title="Modo palco">${this.icone("play")}</button>
              <button class="botao-icone" data-acao="abrir-celebracao" data-id="${celebracao.id}" aria-label="Editar ${this.escapar(celebracao.titulo)}" title="Editar">${this.icone("edit")}</button>
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

  formularioCelebracao({ celebracao, itens, musicas, momentos }) {
    const c = celebracao || { titulo: "", data_evento: new Date().toISOString().slice(0, 10) };
    const sugestoes = momentos.map((nome) => `<option value="${this.escapar(nome)}"></option>`).join("");
    const musicasOpcoes = (selecionada) =>
      [`<option value="">Sem música</option>`]
        .concat(
          musicas.map(
            (musica) =>
              `<option value="${musica.id}" ${Number(selecionada) === musica.id ? "selected" : ""}>${this.escapar(musica.titulo)}</option>`
          )
        )
        .join("");
    const linhas = itens
      .map(
        (item) => `
          <article class="momento-card">
            <div class="momento-topo"><strong>Momento ${item.posicao_ordem}</strong><div class="acoes-linha">
              <button type="button" class="botao-icone" data-acao="mover-item" data-id="${item.id}" data-dir="-1" aria-label="Mover momento para cima">${this.icone("arrowLeft", "icone-girar")}</button>
              <button type="button" class="botao-icone" data-acao="mover-item" data-id="${item.id}" data-dir="1" aria-label="Mover momento para baixo">${this.icone("arrowLeft", "icone-girar-baixo")}</button>
              <button type="button" class="botao-icone perigo" data-acao="apagar-item" data-id="${item.id}" aria-label="Apagar momento">${this.icone("trash")}</button>
            </div></div>
            <div class="campos-duplos">
              <label>Nome do momento<input list="momentos-padrao" data-campo="nome_momento" data-id="${item.id}" value="${this.escapar(item.nome_momento)}" placeholder="Ex.: Entrada"></label>
              <label>Música<select data-campo="musica_id" data-id="${item.id}">${musicasOpcoes(item.musica_id)}</select></label>
              <label class="campo-largo">Observação<input data-campo="nota_adicional" data-id="${item.id}" value="${this.escapar(item.nota_adicional || "")}" placeholder="Uma observação para este momento (opcional)"></label>
            </div>
          </article>`
      )
      .join("");

    return `
      <section class="painel formulario-painel">
        <form class="formulario" data-acao="salvar-celebracao">
          <input type="hidden" name="id" value="${c.id || ""}">
          <div class="campos-duplos">
            <label class="campo-largo">Nome do repertório<input name="titulo" required maxlength="160" value="${this.escapar(c.titulo)}" placeholder="Ex.: Apresentação de sábado"></label>
            <label>Data do evento<input type="date" name="data_evento" value="${this.escapar(c.data_evento)}"></label>
          </div>
          <div class="acoes-form">
            <button type="button" class="botao secundario" data-acao="navegar" data-tela="celebracoes">Voltar</button>
            <button type="submit" class="botao primario">Salvar repertório</button>
            ${c.id ? `<button type="button" class="botao contorno" data-acao="simular" data-id="${c.id}">${this.icone("play")} Modo palco</button>` : ""}
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

  telaPastas({ pastas, contagens, busca }) {
    const cards = pastas
      .filter((pasta) => pasta.nome.toLowerCase().includes(String(busca || "").trim().toLowerCase()))
      .map(
        (pasta) => `
          <article class="pasta-card">
            <div class="pasta-card-topo"><span class="pasta-icone">${this.icone("folder")}</span><div class="acoes-linha">
              <button class="botao-icone" data-acao="renomear-pasta" data-id="${pasta.id}" aria-label="Renomear ${this.escapar(pasta.nome)}" title="Renomear">${this.icone("edit")}</button>
              <button class="botao-icone perigo" data-acao="apagar-pasta" data-id="${pasta.id}" aria-label="Apagar ${this.escapar(pasta.nome)}" title="Apagar">${this.icone("trash")}</button>
            </div></div>
            <button class="pasta-abre" data-acao="abrir-pasta" data-id="${pasta.id}"><strong>${this.escapar(pasta.nome)}</strong><span>${contagens[pasta.id] || 0} ${(contagens[pasta.id] || 0) === 1 ? "música" : "músicas"}</span></button>
            <button class="pasta-link" data-acao="abrir-pasta" data-id="${pasta.id}">Ver músicas ${this.icone("chevron")}</button>
          </article>`
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

  telaConfiguracoes({ perfil, tema, momentos }) {
    const temaRotulo = tema === "escuro" ? "Escuro" : "Claro";
    return `
      <section class="painel configuracoes-painel">
        <div class="secao-cabecalho"><div><h2>Preferências</h2><p>Personalize a aparência do Chinchila neste dispositivo.</p></div></div>
        <div class="preferencia-linha"><span class="preferencia-icone">${this.icone("sun")}</span><span class="item-detalhe"><strong>Aparência</strong><small>Tema atual: ${temaRotulo}</small></span><button class="botao contorno" data-acao="alternar-tema">Alternar tema</button></div>
        <div class="preferencia-linha"><span class="preferencia-icone">${this.icone("user")}</span><span class="item-detalhe"><strong>Perfil local</strong><small>${this.escapar(perfil.nome || "Meu perfil")}</small></span><button class="botao contorno" data-acao="editar-perfil">Editar nome</button></div>
      </section>
      <section class="painel configuracoes-painel">
        <div class="secao-cabecalho"><div><h2>Sugestões de momentos</h2><p>Opções iniciais para ajudar a montar repertórios. Você também pode escrever nomes livres.</p></div></div>
        <div class="etiquetas-momentos">${momentos.map((momento) => `<span>${this.escapar(momento)}</span>`).join("")}</div>
        <p class="aviso-info">A edição destas sugestões ainda não está disponível. Os nomes dos momentos nos seus repertórios podem ser alterados normalmente.</p>
      </section>
      <section class="painel configuracoes-painel">
        <div class="secao-cabecalho"><div><h2>Conta e sincronização</h2><p>Esta versão salva os dados somente neste dispositivo.</p></div><button class="botao contorno" data-acao="navegar" data-tela="acesso">Ver prévia da tela de acesso</button></div>
        <p class="aviso-info">Login e sincronização ainda não estão conectados. A prévia abaixo é apenas visual e não envia seus dados.</p>
      </section>
    `;
  },

  telaAcesso() {
    return `
      <section class="acesso-preview">
        <span class="resumo-icone azul">${this.icone("music")}</span>
        <span class="sobrelinha">PRÉVIA VISUAL</span>
        <h2>Sua música em qualquer lugar</h2>
        <p>Sincronize seu repertório, cifras e momentos.</p>
        <div class="acesso-abas"><button class="ativo" type="button" disabled>Entrar</button><button type="button" disabled>Criar conta</button></div>
        <label>Nome completo<input type="text" placeholder="Seu nome" disabled></label>
        <label>E-mail<input type="email" placeholder="seuemail@exemplo.com" disabled></label>
        <label>Senha<input type="password" placeholder="••••••••" disabled></label>
        <button class="botao primario acesso-submit" type="button" disabled>Entrar</button>
        <p class="aviso-info">Autenticação ainda não disponível. Os campos estão desativados e nenhum dado será enviado.</p>
        <button class="link-botao" data-acao="navegar" data-tela="configuracoes">${this.icone("arrowLeft")} Voltar às configurações</button>
      </section>
    `;
  },

  telaCifra({ musica, tomAtual, pastaNome }) {
    return `
      <button class="link-botao voltar-link" data-acao="navegar" data-tela="musicas">${this.icone("arrowLeft")} Voltar às músicas</button>
      <section class="painel cifra-painel">
        <div class="cifra-topo"><span class="resumo-icone azul">${this.icone("music")}</span><div class="item-detalhe"><h2>${this.escapar(musica.titulo)}</h2><p>${this.escapar(musica.autor || "Autor não informado")} · ${this.escapar(pastaNome || "Sem pasta")}</p></div><button class="botao contorno" data-acao="editar-musica" data-id="${musica.id}">${this.icone("edit")} Editar</button></div>
        <div class="tom-barra"><span>Tom da cifra</span><div><button class="botao secundario" data-acao="transpor" data-delta="-1" aria-label="Baixar tom">−</button><strong>${this.escapar(tomAtual)}</strong><button class="botao secundario" data-acao="transpor" data-delta="1" aria-label="Subir tom">+</button></div></div>
        <pre class="cifra-corpo">${this.escapar(this.transporCifra(musica.corpo_cifra, musica.tom_original, tomAtual) || "Esta música ainda não tem cifra cadastrada.")}</pre>
      </section>
    `;
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

  estadoVazio(icone, titulo, descricao, acao = null) {
    return `
      <div class="estado-vazio">
        <span class="vazio-icone">${this.icone(icone)}</span>
        <h3>${this.escapar(titulo)}</h3><p>${this.escapar(descricao)}</p>
        ${acao ? `<button class="botao primario" data-acao="${acao.acao}">${this.icone("plus")} ${this.escapar(acao.rotulo)}</button>` : ""}
      </div>
    `;
  },

  formatarData(data) {
    if (!data) return "Data não definida";
    const valor = new Date(`${data}T00:00:00`);
    return Number.isNaN(valor.getTime())
      ? this.escapar(data)
      : new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", year: "numeric" }).format(valor);
  },

  notas: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
  aliases: { Db: "C#", Eb: "D#", Gb: "F#", Ab: "G#", Bb: "A#" },

  indiceNota(tom) {
    const limpo = String(tom || "C").trim();
    const base = limpo.replace("m", "").replace("M", "");
    const normal = this.aliases[base] || base;
    const idx = this.notas.indexOf(normal);
    return idx < 0 ? 0 : idx;
  },

  transporCifra(texto, origem, destino) {
    const delta = this.indiceNota(destino) - this.indiceNota(origem);
    if (!delta || !texto) return texto || "";
    return texto.replace(/([A-G](?:#|b)?)(m|M|maj|min|dim|aug|sus|add|º|°)?(\d*)/g, (acorde, nota, sufixo = "", extra = "") => {
      const idx = this.indiceNota(nota);
      const nova = this.notas[(idx + delta + 12) % 12];
      return nova + sufixo + extra;
    });
  },

  escapar(valor) {
    return String(valor == null ? "" : valor)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  },
};
