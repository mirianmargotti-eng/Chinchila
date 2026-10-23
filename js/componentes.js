/* Renderização dinâmica das interfaces */

const Componentes = {
  iconeEditar() {
    return `<span class="icone-acao icone-editar" title="Editar">✎</span>`;
  },

  iconeLixeira() {
    return `<img class="icone-img" src="assets/icons/lixeira.svg" alt="Apagar">`;
  },

  iconeEstrela(ativa) {
    const classe = ativa ? "estrela ativa" : "estrela";
    return `<span class="${classe}" title="Favoritar">★</span>`;
  },

  layout({ telaAtiva, tituloBolha, criar, perfil, html }) {
    const links = [
      { id: "inicio", rotulo: "Início" },
      { id: "musicas", rotulo: "Músicas" },
      { id: "celebracoes", rotulo: "Celebrações" },
      { id: "pastas", rotulo: "Pastas" },
    ];

    const nav = links
      .map((link) => {
        const ativo = telaAtiva === link.id ? "ativo" : "";
        return `<button class="nav-link ${ativo}" data-acao="navegar" data-tela="${link.id}">${link.rotulo}</button>`;
      })
      .join("");

    const criarHtml = criar
      ? `<div class="trilho-criar">
           <span class="ponto"></span>
           <span class="ponto"></span>
           <button class="botao-criar" data-acao="${criar.acao}" ${criar.extra || ""}>Criar</button>
         </div>`
      : "";

    return `
      <aside class="sidebar">
        <div class="marca">
          <div class="logo-caixa">Logo +<br>nome do<br>app</div>
        </div>
        <nav class="menu">${nav}</nav>
        <div class="sidebar-base">
          <button class="tema-botao" data-acao="alternar-tema" title="Alternar tema">☀️ / 🌙</button>
          <button class="perfil" data-acao="editar-perfil">
            <span class="avatar"></span>
            <span>${this.escapar(perfil.nome || "Gmail")}</span>
          </button>
        </div>
      </aside>
      <main class="palco">
        <section class="quadro">
          <div class="bolha-titulo">${this.escapar(tituloBolha)}</div>
          ${criarHtml}
          <div class="quadro-interno">${html}</div>
        </section>
      </main>
    `;
  },

  telaInicio({ recentes, favoritas }) {
    const cards = recentes
      .map(
        (c) => `
        <button class="pilula" data-acao="abrir-celebracao" data-id="${c.id}">
          ${this.escapar(c.titulo)}
        </button>`
      )
      .join("");

    const favoritos = favoritas
      .map(
        (m) => `
        <button class="faixa-favorita" data-acao="abrir-cifra" data-id="${m.id}">
          ${this.escapar(m.titulo)}
        </button>`
      )
      .join("");

    return `
      <div class="bloco">
        <h2>Últimas alterações</h2>
        <div class="pilulas">${cards || "<p class='vazio'>Nenhum roteiro ainda.</p>"}</div>
      </div>
      <div class="bloco">
        <h2>Músicas Favoritas</h2>
        <p class="dica">Modo pânico: um clique abre a cifra.</p>
        <div class="grade-favoritas">${favoritos || "<p class='vazio'>Favorite músicas para acesso rápido.</p>"}</div>
      </div>
      <div class="atalho-linha">
        <button class="pilula atalho" data-acao="navegar" data-tela="celebracoes">atalho</button>
      </div>
    `;
  },

  telaMusicas({ musicas, pastas, busca, pastaId }) {
    const opcoes = [`<option value="">Todas as pastas</option>`]
      .concat(
        pastas.map(
          (p) =>
            `<option value="${p.id}" ${Number(pastaId) === p.id ? "selected" : ""}>${this.escapar(p.nome)}</option>`
        )
      )
      .join("");

    const linhas = musicas
      .map((m) => {
        const pasta = pastas.find((p) => p.id === m.pasta_id);
        const tipo = pasta ? pasta.nome : "sem pasta";
        return `
          <article class="linha-musica">
            <button class="fantasma" data-acao="favoritar" data-id="${m.id}">${this.iconeEstrela(m.is_fixada)}</button>
            <button class="fantasma" data-acao="editar-musica" data-id="${m.id}">${this.iconeEditar()}</button>
            <button class="nome-musica" data-acao="abrir-cifra" data-id="${m.id}">
              ${this.escapar(m.titulo)} - ${this.escapar(tipo)} - ${this.escapar(m.autor || "Autor")}
            </button>
            <button class="fantasma" data-acao="apagar-musica" data-id="${m.id}">${this.iconeLixeira()}</button>
          </article>`;
      })
      .join("");

    return `
      <form class="busca-barra" data-acao="filtrar-musicas">
        <input name="busca" type="search" placeholder="Pesquisar" value="${this.escapar(busca)}">
      </form>
      <div class="lista-cabecalho">
        <h2>Músicas</h2>
        <label class="filtro">
          Filtrar
          <select name="pasta_id">${opcoes}</select>
        </label>
      </div>
      <div class="lista-musicas">${linhas || "<p class='vazio'>Nenhuma música encontrada.</p>"}</div>
    `;
  },

  formularioMusica({ musica, pastas }) {
    const m = musica || { titulo: "", autor: "", tom_original: "C", pasta_id: "", corpo_cifra: "", is_fixada: false };
    const opcoes = [`<option value="">Sem pasta</option>`]
      .concat(
        pastas.map(
          (p) =>
            `<option value="${p.id}" ${Number(m.pasta_id) === p.id ? "selected" : ""}>${this.escapar(p.nome)}</option>`
        )
      )
      .join("");

    return `
      <form class="formulario" data-acao="salvar-musica">
        <input type="hidden" name="id" value="${m.id || ""}">
        <label>Título<input name="titulo" required value="${this.escapar(m.titulo)}"></label>
        <label>Autor<input name="autor" value="${this.escapar(m.autor || "")}"></label>
        <div class="dupla">
          <label>Tom original<input name="tom_original" value="${this.escapar(m.tom_original || "C")}"></label>
          <label>Pasta<select name="pasta_id">${opcoes}</select></label>
        </div>
        <label class="check">
          <input type="checkbox" name="is_fixada" ${m.is_fixada ? "checked" : ""}>
          Fixar no modo pânico (favorita)
        </label>
        <label>Cifra (fonte monoespaçada)
          <textarea name="corpo_cifra" rows="12" class="cifra-editor">${this.escapar(m.corpo_cifra || "")}</textarea>
        </label>
        <div class="acoes-form">
          <button type="button" class="secundario" data-acao="navegar" data-tela="musicas">Cancelar</button>
          <button type="submit" class="primario">Salvar</button>
        </div>
      </form>
    `;
  },

  telaCelebracoes({ celebracoes }) {
    const cards = celebracoes
      .map(
        (c) => `
        <article class="card-roteiro">
          <button class="fantasma" data-acao="abrir-celebracao" data-id="${c.id}">${this.iconeEditar()}</button>
          <button class="nome-roteiro" data-acao="abrir-celebracao" data-id="${c.id}">${this.escapar(c.titulo)}</button>
          <button class="fantasma" data-acao="apagar-celebracao" data-id="${c.id}">${this.iconeLixeira()}</button>
        </article>`
      )
      .join("");

    return `
      <form class="busca-barra">
        <input type="search" placeholder="Pesquisar" disabled>
      </form>
      <div class="lista-cabecalho">
        <h2>Celebrações</h2>
        <span class="filtro">Filtrar</span>
      </div>
      <div class="lista-roteiros">${cards || "<p class='vazio'>Crie um roteiro para começar.</p>"}</div>
      <p class="dica">Todo roteiro permanece aberto e editável para reutilização contínua.</p>
    `;
  },

  formularioCelebracao({ celebracao, itens, musicas, momentos }) {
    const c = celebracao || { titulo: "", data_evento: new Date().toISOString().slice(0, 10) };
    const sugestoes = momentos.map((nome) => `<option value="${this.escapar(nome)}"></option>`).join("");
    const musicasOpcoes = (selecionada) =>
      [`<option value="">Sem música</option>`]
        .concat(
          musicas.map(
            (m) =>
              `<option value="${m.id}" ${Number(selecionada) === m.id ? "selected" : ""}>${this.escapar(m.titulo)}</option>`
          )
        )
        .join("");

    const linhas = itens
      .map(
        (item) => `
        <article class="momento" data-id="${item.id}">
          <header>
            <strong>Momento ${item.posicao_ordem}</strong>
            <div>
              <button type="button" class="fantasma" data-acao="mover-item" data-id="${item.id}" data-dir="-1">↑</button>
              <button type="button" class="fantasma" data-acao="mover-item" data-id="${item.id}" data-dir="1">↓</button>
              <button type="button" class="fantasma" data-acao="apagar-item" data-id="${item.id}">${this.iconeLixeira()}</button>
            </div>
          </header>
          <label>Nome do momento (livre)
            <input list="momentos-padrao" data-campo="nome_momento" data-id="${item.id}" value="${this.escapar(item.nome_momento)}">
          </label>
          <label>Música
            <select data-campo="musica_id" data-id="${item.id}">${musicasOpcoes(item.musica_id)}</select>
          </label>
          <label>Nota adicional
            <input data-campo="nota_adicional" data-id="${item.id}" value="${this.escapar(item.nota_adicional || "")}">
          </label>
        </article>`
      )
      .join("");

    return `
      <form class="formulario" data-acao="salvar-celebracao">
        <input type="hidden" name="id" value="${c.id || ""}">
        <label>Título do roteiro<input name="titulo" required value="${this.escapar(c.titulo)}"></label>
        <label>Data<input type="date" name="data_evento" value="${this.escapar(c.data_evento)}"></label>
        <div class="acoes-form">
          <button type="submit" class="primario">Salvar roteiro</button>
          ${c.id ? `<button type="button" class="secundario" data-acao="simular" data-id="${c.id}">Modo simular</button>` : ""}
        </div>
      </form>
      <datalist id="momentos-padrao">${sugestoes}</datalist>
      <div class="bloco">
        <div class="lista-cabecalho">
          <h2>Momentos / blocos</h2>
          ${c.id ? `<button class="filtro" data-acao="adicionar-item" data-id="${c.id}">+ Momento</button>` : ""}
        </div>
        ${c.id ? linhas || "<p class='vazio'>Adicione momentos editáveis (Entrada da Bíblia, Bloco da Noite...).</p>" : "<p class='dica'>Salve o roteiro para incluir momentos.</p>"}
      </div>
    `;
  },

  telaPastas({ pastas, contagens }) {
    const cards = pastas
      .map((p) => {
        const qtd = contagens[p.id] || 0;
        return `
          <article class="card-pasta">
            <button class="nome-pasta" data-acao="abrir-pasta" data-id="${p.id}">${this.escapar(p.nome)}</button>
            <p>${qtd} música(s)</p>
            <div class="acoes-mini">
              <button class="fantasma" data-acao="renomear-pasta" data-id="${p.id}">${this.iconeEditar()}</button>
              <button class="fantasma" data-acao="apagar-pasta" data-id="${p.id}">${this.iconeLixeira()}</button>
            </div>
          </article>`;
      })
      .join("");

    return `
      <div class="lista-cabecalho">
        <h2>Pastas</h2>
        <button class="filtro" data-acao="criar-pasta">+ Pasta</button>
      </div>
      <p class="dica">Separe repertórios por gênero: Pop, Sertanejo, Internacional, Religioso...</p>
      <div class="grade-pastas">${cards || "<p class='vazio'>Crie a primeira pasta.</p>"}</div>
    `;
  },

  telaCifra({ musica, tomAtual, pastaNome }) {
    return `
      <div class="cifra-topo">
        <button class="secundario" data-acao="navegar" data-tela="musicas">Voltar</button>
        <div>
          <h2>${this.escapar(musica.titulo)}</h2>
          <p>${this.escapar(musica.autor || "")} · ${this.escapar(pastaNome || "sem pasta")}</p>
        </div>
      </div>
      <div class="tom-barra">
        <button data-acao="transpor" data-delta="-1">Tom −</button>
        <strong>${this.escapar(tomAtual)}</strong>
        <button data-acao="transpor" data-delta="1">Tom +</button>
      </div>
      <pre class="cifra-corpo">${this.escapar(this.transporCifra(musica.corpo_cifra, musica.tom_original, tomAtual))}</pre>
    `;
  },

  telaSimular({ celebracao, itens, musicas, indice, tomAtual }) {
    const item = itens[indice];
    const musica = item ? musicas.find((m) => m.id === item.musica_id) : null;
    const nav = itens
      .map((it, i) => {
        const ativo = i === indice ? "ativo" : "";
        return `<button class="sim-item ${ativo}" data-acao="simular-ir" data-indice="${i}">${this.escapar(it.nome_momento || "Momento")}</button>`;
      })
      .join("");

    const corpo = musica
      ? `<pre class="cifra-corpo">${this.escapar(this.transporCifra(musica.corpo_cifra, musica.tom_original, tomAtual))}</pre>`
      : "<p class='vazio'>Este momento ainda não tem música.</p>";

    return `
      <div class="simular">
        <aside class="sim-nav">
          <h3>${this.escapar(celebracao.titulo)}</h3>
          ${nav}
          <button class="secundario" data-acao="abrir-celebracao" data-id="${celebracao.id}">Sair</button>
        </aside>
        <div class="sim-centro">
          <h2>${this.escapar(item ? item.nome_momento : "Roteiro")}</h2>
          <p>${musica ? this.escapar(musica.titulo) : ""} ${item && item.nota_adicional ? "· " + this.escapar(item.nota_adicional) : ""}</p>
          ${musica ? `<div class="tom-barra">
            <button data-acao="transpor" data-delta="-1">Tom −</button>
            <strong>${this.escapar(tomAtual)}</strong>
            <button data-acao="transpor" data-delta="1">Tom +</button>
          </div>` : ""}
          ${corpo}
        </div>
      </div>
    `;
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
    return String(valor ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  },
};
