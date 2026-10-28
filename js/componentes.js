/* Renderização das telas e componentes visuais do Chinchila. */

const Componentes = {
  icone(nome, classe = "") {
    const caminhos = {
      home: '<path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/>',
      music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
      folder: '<path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
      image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
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
      info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
      copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
      printer: '<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6zM18 12h.01"/>',
      download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
      metronome: '<path d="m12 3 7 18H5z"/><path d="m12 3-2 12m2-4 5-4"/>',
      tuner: '<path d="M12 22v-8"/><path d="M9 14a3 3 0 1 1 6 0"/><path d="M12 3v3m-7 1 2 2m12-2-2 2"/><path d="M5 4 3 2m16 2 2-2"/>',
      more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
      close: '<path d="m18 6-12 12M6 6l12 12"/>',
      menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
      message: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
    };
    return `<svg class="icone ${classe}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${caminhos[nome] || ""}</svg>`;
  },

  layout({ telaAtiva, titulo, descricao, perfil, html, acaoCriar, rotuloCriar }) {
    const gruposMenu = [
      { titulo: "PRINCIPAL", links: [{ id: "inicio", rotulo: "Início", icone: "home" }] },
      {
        titulo: "MÓDULO MÚSICA",
        links: [
          { id: "musicas", rotulo: "Músicas", icone: "music" },
          { id: "pastas", rotulo: "Pastas", icone: "folder" },
          { id: "celebracoes", rotulo: "Repertórios", icone: "list" },
        ],
      },
      { titulo: "AGENDA", links: [{ id: "agenda", rotulo: "Agenda", icone: "calendar" }] },
      { titulo: "PREFERÊNCIAS", links: [{ id: "configuracoes", rotulo: "Configurações", icone: "settings" }] },
    ];
    const nav = gruposMenu
      .map(
        (grupo) => `
          <section class="menu-grupo">
            <div class="menu-titulo">${grupo.titulo}</div>
            ${grupo.links
              .map(
                (link) => `
                  <button class="nav-link ${telaAtiva === link.id ? "ativo" : ""}" data-acao="navegar" data-tela="${link.id}">
                    ${this.icone(link.icone)}<span>${link.rotulo}</span>
                  </button>`
              )
              .join("")}
          </section>`
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
            <span class="marca-icone"><img src="assets/icons/logo_chinchila.svg" alt=""></span>
            <span class="marca-texto"><strong>Chinchila</strong><small>Sua música organizada</small></span>
          </button>
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

  dialogo({ titulo, mensagem, tipo, valorInicial, placeholder, confirmacao, perigo }) {
    const entrada = tipo === "entrada";
    return `
      <div class="dialogo-fundo">
        <section class="dialogo-painel" role="dialog" aria-modal="true" aria-labelledby="dialogo-titulo" aria-describedby="dialogo-mensagem">
          <div class="dialogo-icone ${perigo ? "perigo" : ""}">${this.icone(perigo ? "trash" : entrada ? "edit" : "info")}</div>
          <h2 id="dialogo-titulo">${this.escapar(titulo)}</h2>
          <p id="dialogo-mensagem">${this.escapar(mensagem)}</p>
          <form data-acao="confirmar-dialogo">
            ${entrada ? `<label class="dialogo-campo"><span>Nome</span><input name="valor" required maxlength="160" value="${this.escapar(valorInicial || "")}" placeholder="${this.escapar(placeholder || "")}"></label>` : ""}
            <div class="dialogo-acoes">
              <button type="button" class="botao contorno" data-acao="cancelar-dialogo">Cancelar</button>
              <button type="submit" class="botao ${perigo ? "perigo" : "primario"}">${this.escapar(confirmacao || (entrada ? "Salvar" : "Confirmar"))}</button>
            </div>
          </form>
        </section>
      </div>
    `;
  },

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

  telaMusicas({ musicas, pastas, busca, pastaId, total, pagina, totalPaginas, paginaTamanho }) {
    const opcoes = [`<option value="">Todas as pastas</option>`]
      .concat(
        pastas.map(
          (pasta) =>
            `<option value="${pasta.id}" ${String(pastaId) === String(pasta.id) ? "selected" : ""}>${this.escapar(pasta.nome)}</option>`
        )
      )
      .join("");
    const inicioPagina = total ? (pagina - 1) * paginaTamanho + 1 : 0;
    const fimPagina = Math.min(pagina * paginaTamanho, total);
    const paginacao = totalPaginas > 1 ? `
      <nav class="paginacao-musicas" aria-label="Paginação das músicas">
        <button class="botao contorno" data-acao="pagina-musicas" data-delta="-1" ${pagina === 1 ? "disabled" : ""}>${this.icone("arrowLeft")} Anterior</button>
        <span>Mostrando ${inicioPagina}–${fimPagina} de ${total} músicas · Página ${pagina} de ${totalPaginas}</span>
        <button class="botao contorno" data-acao="pagina-musicas" data-delta="1" ${pagina === totalPaginas ? "disabled" : ""}>Próxima ${this.icone("chevron")}</button>
      </nav>` : "";
    const linhas = musicas
      .map((musica) => {
        return `
          <tr>
            <td><button class="botao-icone favorito-botao ${musica.is_fixada ? "favorito-ativo" : ""}" data-acao="favoritar" data-id="${musica.id}" aria-label="${musica.is_fixada ? "Remover dos favoritos" : "Adicionar aos favoritos"}" title="${musica.is_fixada ? "Remover dos favoritos" : "Adicionar aos favoritos"}">${this.icone("star")}</button></td>
            <td><button class="musica-titulo" data-acao="abrir-cifra" data-id="${musica.id}"><span class="mini-icone">${this.icone("music")}</span><span><strong>${this.escapar(musica.titulo)}</strong><small>${this.escapar(musica.tom_original || "C")}</small></span></button></td>
            <td>${this.escapar(musica.autor || "—")}</td>
            <td><span class="tom-etiqueta">${this.escapar(musica.tom_original || "C")}</span></td>
            <td>${this.escapar((Banco.idsPastasDaMusica(musica).map((id) => Banco.obterPasta(id)?.nome).filter(Boolean).join(", ")) || "Sem pasta")}</td>
            <td><div class="acoes-linha">
              <button class="botao-icone" data-acao="editar-musica" data-id="${musica.id}" aria-label="Editar ${this.escapar(musica.titulo)}" title="Editar">${this.icone("edit")}</button>
              <button class="botao-icone" data-acao="clonar-musica" data-id="${musica.id}" aria-label="Clonar ${this.escapar(musica.titulo)}" title="Clonar música">${this.icone("copy")}</button>
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
      <div class="musicas-acoes-topo">
        <p>Importe uma cifra de um PDF ou de um link público.</p>
        <button class="botao contorno" data-acao="abrir-importacao-cifra">${this.icone("download")} Importar cifra</button>
      </div>
      <section class="painel tabela-painel">
        <div class="tabela-resumo"><span>${total} ${total === 1 ? "música encontrada" : "músicas encontradas"}</span><span>Seu acervo pessoal</span></div>
        ${musicas.length ? `
          <div class="tabela-scroll"><table class="tabela-musicas">
            <thead><tr><th aria-label="Favorita"></th><th>Título</th><th>Artista / autor</th><th>Tom</th><th>Pasta</th><th class="coluna-acoes">Ações</th></tr></thead>
            <tbody>${linhas}</tbody>
          </table></div>
        ` : this.estadoVazio("music", busca || pastaId ? "Nenhuma música encontrada" : "Sua biblioteca começa aqui", busca || pastaId ? "Tente mudar a busca ou o filtro de pasta." : "Adicione suas próprias músicas e cifras. Elas aparecerão nesta lista.", { acao: "nova-musica", rotulo: "Adicionar primeira música" })}
      </section>
      ${paginacao}
    `;
  },

  modalImportarCifra() {
    return `
      <div class="dialogo-fundo">
        <section class="dialogo-painel importacao-painel" role="dialog" aria-modal="true" aria-labelledby="importacao-titulo" aria-describedby="importacao-descricao">
          <div class="dialogo-icone">${this.icone("download")}</div>
          <h2 id="importacao-titulo">Importar cifra</h2>
          <p id="importacao-descricao">Escolha um PDF com texto selecionável ou informe o link público de uma página/PDF. A importação será aberta para revisão antes de salvar.</p>
          <form data-acao="importar-cifra">
            <label class="dialogo-campo"><span>Link da cifra (opcional)</span><input name="url" type="url" placeholder="https://..."></label>
            <label class="dialogo-campo"><span>Ou selecione um arquivo PDF</span><input name="arquivo" type="file" accept="application/pdf,.pdf"></label>
            <p class="importacao-nota">O site precisa permitir acesso pelo navegador. PDFs digitalizados sem texto selecionável precisam de OCR, que ainda não está disponível.</p>
            <div class="dialogo-acoes">
              <button type="button" class="botao contorno" data-acao="cancelar-importacao">Cancelar</button>
              <button type="submit" class="botao primario">Importar</button>
            </div>
          </form>
        </section>
      </div>
    `;
  },

  formularioMusica({ musica, pastas, importacao = false }) {
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
          <div class="formulario-intro"><span class="resumo-icone azul">${this.icone("music")}</span><div><h2>Detalhes da música</h2><p>${importacao ? "Revise os dados importados e ajuste o texto da cifra antes de salvar." : "Preencha as informações que ajudam você a encontrar e tocar esta cifra."}</p></div></div>
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

  telaConfiguracoes({ perfil, tema, momentos, fonteTexto, mensagem, blocosAbertos = [] }) {
    const temaRotulo = tema === "escuro" ? "Escuro" : "Claro";
    const momentosTexto = momentos.join("\n");
    return `
      <details class="painel configuracoes-painel configuracoes-bloco" data-bloco-config="aparencia" ${blocosAbertos.includes("aparencia") ? "open" : ""}>
        <summary class="configuracoes-bloco-titulo"><span><strong>Aparência</strong><small>Personalize o visual e os textos do Chinchila.</small></span></summary>
        <div class="preferencia-linha"><span class="preferencia-icone">${this.icone("sun")}</span><span class="item-detalhe"><strong>Aparência</strong><small>Tema atual: ${temaRotulo}</small></span><button class="botao contorno" data-acao="alternar-tema">Alternar tema</button></div>
        <label class="preferencia-fonte"><span><strong>Fonte dos textos</strong><small>Escolha a tipografia usada na interface.</small></span><select data-acao="selecionar-fonte-texto" aria-label="Fonte dos textos"><option value="padrao" ${fonteTexto === "padrao" ? "selected" : ""}>Padrão Chinchila (Inter / sistema)</option><option value="arial" ${fonteTexto === "arial" ? "selected" : ""}>Arial</option><option value="times" ${fonteTexto === "times" ? "selected" : ""}>Times New Roman</option></select></label>
        <div class="preferencia-linha"><span class="preferencia-icone">${this.icone("user")}</span><span class="item-detalhe"><strong>Perfil local</strong><small>${this.escapar(perfil.nome || "Meu perfil")}</small></span><button class="botao contorno" data-acao="editar-perfil">Editar nome</button></div>
      </details>
      <details class="painel configuracoes-painel configuracoes-bloco" data-bloco-config="momentos" ${blocosAbertos.includes("momentos") ? "open" : ""}>
        <summary class="configuracoes-bloco-titulo"><span><strong>Momentos padrão</strong><small>Defina a sequência inicial dos novos repertórios.</small></span></summary>
        <form class="formulario formulario-momentos-padrao" data-acao="salvar-momentos-padrao">
          <label for="momentos-padrao-config">Sequência inicial de momentos</label>
          <textarea id="momentos-padrao-config" name="momentos" rows="8" placeholder="Entrada&#10;Ofertório&#10;Comunhão&#10;Final">${this.escapar(momentosTexto)}</textarea>
          <small class="campo-ajuda">Deixe uma linha vazia para remover um momento. Essa alteração não modifica repertórios existentes.</small>
          <button type="submit" class="botao primario">Salvar momentos padrão</button>
          ${mensagem ? `<p class="configuracoes-mensagem" role="status">${this.escapar(mensagem)}</p>` : ""}
        </form>
      </details>
      <details class="painel configuracoes-painel configuracoes-bloco" data-bloco-config="reporte" ${blocosAbertos.includes("reporte") ? "open" : ""}>
        <summary class="configuracoes-bloco-titulo"><span><strong>Reporte de bug</strong><small>Descreva o problema e anexe uma captura de tela, se quiser.</small></span></summary>
        <form class="formulario formulario-relato" data-acao="relatar-bug">
          <label>Assunto<input name="assunto" maxlength="120" placeholder="Resumo do problema"></label>
          <label>Descrição<textarea name="descricao" rows="4" placeholder="O que você esperava e o que aconteceu?"></textarea></label>
          <label>Captura de tela<input class="relato-arquivo" name="captura" type="file" accept="image/*"><small class="relato-arquivo-nome" aria-live="polite">Nenhuma imagem selecionada.</small></label>
          <p class="aviso-info">O envio por e-mail ainda não está configurado. Este formulário não envia nem armazena o relato.</p>
          <button type="button" class="botao primario" disabled>Enviar relato (em breve)</button>
        </form>
      </details>
      <details class="painel configuracoes-painel configuracoes-bloco" data-bloco-config="cores" ${blocosAbertos.includes("cores") ? "open" : ""}>
        <summary class="configuracoes-bloco-titulo"><span><strong>Cores de cifra</strong><small>Opções futuras para diferenciar partes da cifra.</small></span></summary>
        <div class="opcoes-cor-cifra">
          <article><span class="amostra-cor-cifra acordes"></span><strong>Destacar acordes</strong><small>Colorir acordes e manter a letra como está.</small></article>
          <article><span class="amostra-cor-cifra linhas"></span><strong>Alternar linhas</strong><small>Variar o fundo entre linhas para facilitar o acompanhamento.</small></article>
          <article><span class="amostra-cor-cifra estrofe"></span><strong>Separar estrofes</strong><small>Usar tons suaves para distinguir partes da música.</small></article>
          <article><span class="amostra-cor-cifra editor"></span><strong>Editor por blocos</strong><small>Separar acordes e letra durante a edição e montar a cifra sem intercalar linhas manualmente.</small></article>
        </div>
        <p class="aviso-info">Estas opções e a ideia de edição por blocos são sugestões para uma próxima etapa. Não alteram a exibição nem o conteúdo das cifras atuais.</p>
      </details>
      <details class="painel configuracoes-painel configuracoes-bloco" data-bloco-config="conta" ${blocosAbertos.includes("conta") ? "open" : ""}>
        <summary class="configuracoes-bloco-titulo"><span><strong>Conta e sincronização</strong><small>Seus dados ficam somente neste dispositivo.</small></span></summary>
        <button class="botao contorno" data-acao="navegar" data-tela="acesso">Ver prévia da tela de acesso</button>
        <p class="aviso-info">Login e sincronização ainda não estão conectados. A prévia abaixo é apenas visual e não envia seus dados.</p>
      </details>
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

  telaCifra({ musica, tomAtual, pastaNome, metronomoAtivo, bpm }) {
    return `
      <button class="link-botao voltar-link" data-acao="navegar" data-tela="musicas">${this.icone("arrowLeft")} Voltar às músicas</button>
      <section class="painel cifra-painel">
        <div class="cifra-topo"><span class="resumo-icone azul">${this.icone("music")}</span><div class="item-detalhe"><h2>${this.escapar(musica.titulo)}</h2><p>${this.escapar(musica.autor || "Autor não informado")} · ${this.escapar(pastaNome || "Sem pasta")}</p></div><div class="cifra-acoes-topo nao-imprimir"><button class="botao contorno" data-acao="editar-musica" data-id="${musica.id}">${this.icone("edit")} Editar</button><button class="botao contorno" data-acao="imprimir-cifra">${this.icone("printer")} Imprimir</button><button class="botao contorno" data-acao="exportar-pdf">${this.icone("download")} Salvar como PDF</button></div></div>
        <div class="cifra-ferramentas nao-imprimir">
          <div class="cifra-controles">
            <div class="tom-barra"><span>Tom da cifra</span><div><button class="botao secundario" data-acao="transpor" data-delta="-1" aria-label="Baixar tom">−</button><strong>${this.escapar(tomAtual)}</strong><button class="botao secundario" data-acao="transpor" data-delta="1" aria-label="Subir tom">+</button></div></div>
            <div class="instrumento-afinador">
              <div class="instrumento-barra"><label for="instrumento-cifra">Instrumento</label><select id="instrumento-cifra" disabled aria-describedby="instrumento-ajuda"><option selected>Violão</option><option>Ukulele</option><option>Teclado</option><option>Baixo</option></select><small id="instrumento-ajuda"></small></div>
              <div class="afinador-barra" aria-label="Afinador em breve">
                <span class="afinador-icone">${this.icone("tuner")}</span>
                <span class="afinador-texto"><strong>Afinador</strong><small>Em breve · varia conforme o instrumento</small></span>
                <span class="afinador-status">Em breve</span>
              </div>
            </div>
            <div class="metronomo">
              <label for="metronomo-bpm">${this.icone("metronome")} Metrônomo</label>
              <input id="metronomo-bpm" class="metronomo-bpm" type="number" min="40" max="240" step="1" value="${bpm}" aria-label="Batidas por minuto">
              <span>BPM</span>
              <button class="botao ${metronomoAtivo ? "secundario" : "contorno"}" data-acao="metronomo-toggle">${metronomoAtivo ? "Parar" : "Iniciar"}</button>
            </div>
          </div>
        </div>
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
