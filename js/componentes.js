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

  analisarAcorde(token) {
    const partes = token.match(/^([([{]*)([A-G](?:#|b)?)(.*?)([)\]},;:]*)$/);
    if (!partes) return null;
    const sufixo = partes[3];
    if (!/^(?:(?:maj|min|m|M|dim|aug|sus|add|º|°|ø|o|\+|-)?\d*(?:[#b]\d{1,2})*(?:M)?(?:\/[A-G](?:#|b)?)?)$/.test(sufixo)) {
      return null;
    }
    return { abertura: partes[1], nota: partes[2], sufixo, fechamento: partes[4] };
  },

  transporAcorde(token, delta) {
    const acorde = this.analisarAcorde(token);
    if (!acorde) return token;
    const baixo = acorde.sufixo.match(/^(.*)\/([A-G](?:#|b)?)$/);
    const sufixo = baixo
      ? `${baixo[1]}/${this.notas[(this.indiceNota(baixo[2]) + delta + 12) % 12]}`
      : acorde.sufixo;
    const nota = this.notas[(this.indiceNota(acorde.nota) + delta + 12) % 12];
    return `${acorde.abertura}${nota}${sufixo}${acorde.fechamento}`;
  },

  transporCifra(texto, origem, destino) {
    const delta = this.indiceNota(destino) - this.indiceNota(origem);
    if (!delta || !texto) return texto || "";
    const separadores = /^[()[\]{}.,;:]+$/;
    return texto
      .split(/(\r?\n)/)
      .map((parte, indice) => {
        if (indice % 2 === 1) return parte;
        const tokens = parte.match(/\S+/g) || [];
        const linhaDeAcordes =
          tokens.length > 0 &&
          tokens.every((token) => this.analisarAcorde(token) || separadores.test(token));
        if (!linhaDeAcordes) {
          return parte.replace(/[\[{][^\]}\s]+[\]}]/g, (marcado) => {
            const abertura = marcado[0];
            const fechamento = marcado[marcado.length - 1];
            const acorde = marcado.slice(1, -1);
            return `${abertura}${this.transporAcorde(acorde, delta)}${fechamento}`;
          });
        }
        return parte.replace(/\S+/g, (token) => {
          return this.transporAcorde(token, delta);
        });
      })
      .join("");
  },

  escapar(valor) {
    return String(valor == null ? "" : valor)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  },
};
