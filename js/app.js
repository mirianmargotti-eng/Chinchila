/* Gerenciador de navegação entre as telas */

const App = {
  tela: "inicio",
  params: {},
  buscaMusicas: "",
  pastaFiltro: "",
  tomAtual: "C",
  simularIndice: 0,

  iniciar() {
    this.aplicarTema(Banco.obterTema());
    this.renderizar();
    document.getElementById("app").addEventListener("click", (evento) => this.tratarClique(evento));
    document.getElementById("app").addEventListener("submit", (evento) => this.tratarSubmit(evento));
    document.getElementById("app").addEventListener("change", (evento) => this.tratarChange(evento));
    document.getElementById("app").addEventListener("input", (evento) => this.tratarInput(evento));
  },

  irPara(tela, params = {}) {
    this.tela = tela;
    this.params = params;
    this.renderizar();
  },

  aplicarTema(tema) {
    document.documentElement.dataset.tema = tema;
    Banco.definirTema(tema);
  },

  renderizar() {
    const raiz = document.getElementById("app");
    const perfil = Banco.obterPerfil();
    let titulo = "Início";
    let criar = null;
    let html = "";
    let telaAtiva = this.tela;

    if (this.tela === "inicio") {
      html = Componentes.telaInicio({
        recentes: Banco.listarCelebracoes().slice(0, 3),
        favoritas: Banco.listarMusicas({ apenasFixadas: true }),
      });
    } else if (this.tela === "musicas") {
      titulo = "Música";
      criar = { acao: "nova-musica" };
      html = Componentes.telaMusicas({
        musicas: Banco.listarMusicas({ busca: this.buscaMusicas, pasta_id: this.pastaFiltro || null }),
        pastas: Banco.listarPastas(),
        busca: this.buscaMusicas,
        pastaId: this.pastaFiltro,
      });
    } else if (this.tela === "musica-form") {
      titulo = "Música";
      telaAtiva = "musicas";
      html = Componentes.formularioMusica({
        musica: this.params.id ? Banco.obterMusica(this.params.id) : null,
        pastas: Banco.listarPastas(),
      });
    } else if (this.tela === "cifra") {
      const musica = Banco.obterMusica(this.params.id);
      if (!musica) return this.irPara("musicas");
      titulo = "Música";
      telaAtiva = "musicas";
      html = Componentes.telaCifra({
        musica,
        tomAtual: this.tomAtual,
        pastaNome: (Banco.obterPasta(musica.pasta_id) || {}).nome,
      });
    } else if (this.tela === "celebracoes") {
      titulo = "Celebração";
      criar = { acao: "nova-celebracao" };
      telaAtiva = "celebracoes";
      html = Componentes.telaCelebracoes({ celebracoes: Banco.listarCelebracoes() });
    } else if (this.tela === "celebracao-form") {
      titulo = "Celebração";
      telaAtiva = "celebracoes";
      criar = this.params.id ? { acao: "adicionar-item", extra: `data-id="${this.params.id}"` } : { acao: "nova-celebracao" };
      const celebracao = this.params.id ? Banco.obterCelebracao(this.params.id) : null;
      html = Componentes.formularioCelebracao({
        celebracao,
        itens: celebracao ? Banco.listarItens(celebracao.id) : [],
        musicas: Banco.listarMusicas(),
        momentos: Banco.momentosPadrao(),
      });
    } else if (this.tela === "simular") {
      const celebracao = Banco.obterCelebracao(this.params.id);
      if (!celebracao) return this.irPara("celebracoes");
      titulo = "Celebração";
      telaAtiva = "celebracoes";
      html = Componentes.telaSimular({
        celebracao,
        itens: Banco.listarItens(celebracao.id),
        musicas: Banco.listarMusicas(),
        indice: this.simularIndice,
        tomAtual: this.tomAtual,
      });
    } else if (this.tela === "pastas") {
      titulo = "Pastas";
      criar = { acao: "criar-pasta" };
      const contagens = {};
      Banco.listarMusicas().forEach((m) => {
        if (m.pasta_id) contagens[m.pasta_id] = (contagens[m.pasta_id] || 0) + 1;
      });
      html = Componentes.telaPastas({ pastas: Banco.listarPastas(), contagens });
    }

    raiz.innerHTML = Componentes.layout({ telaAtiva, tituloBolha: titulo, criar, perfil, html });
  },

  tratarClique(evento) {
    const alvo = evento.target.closest("[data-acao]");
    if (!alvo) return;
    const acao = alvo.dataset.acao;
    const id = alvo.dataset.id;

    const acoes = {
      navegar: () => this.irPara(alvo.dataset.tela),
      "alternar-tema": () => {
        this.aplicarTema(Banco.obterTema() === "claro" ? "escuro" : "claro");
        this.renderizar();
      },
      "editar-perfil": () => {
        const nome = prompt("Nome do perfil local:", Banco.obterPerfil().nome || "Gmail");
        if (nome) Banco.definirPerfil({ nome });
        this.renderizar();
      },
      "abrir-celebracao": () => this.irPara("celebracao-form", { id }),
      "abrir-cifra": () => {
        const musica = Banco.obterMusica(id);
        this.tomAtual = musica ? musica.tom_original : "C";
        this.irPara("cifra", { id });
      },
      "nova-musica": () => this.irPara("musica-form"),
      "editar-musica": () => this.irPara("musica-form", { id }),
      favoritar: () => {
        Banco.alternarFavorita(id);
        this.renderizar();
      },
      "apagar-musica": () => {
        if (confirm("Apagar esta música do acervo local?")) {
          Banco.apagarMusica(id);
          this.renderizar();
        }
      },
      "nova-celebracao": () => this.irPara("celebracao-form"),
      "apagar-celebracao": () => {
        if (confirm("Apagar este roteiro? Ele deixa de ficar disponível para reutilização.")) {
          Banco.apagarCelebracao(id);
          this.renderizar();
        }
      },
      "adicionar-item": () => {
        const celebracaoId = id || this.params.id;
        if (!celebracaoId) return;
        const ordem = Banco.listarItens(celebracaoId).length + 1;
        Banco.salvarItem({
          celebracao_id: celebracaoId,
          posicao_ordem: ordem,
          nome_momento: "Novo momento",
          musica_id: null,
          nota_adicional: "",
        });
        this.irPara("celebracao-form", { id: celebracaoId });
      },
      "apagar-item": () => {
        Banco.apagarItem(id);
        this.renderizar();
      },
      "mover-item": () => {
        const dir = Number(alvo.dataset.dir);
        const itens = Banco.listarItens(this.params.id);
        const indice = itens.findIndex((i) => i.id === Number(id));
        const alvoIndice = indice + dir;
        if (indice < 0 || alvoIndice < 0 || alvoIndice >= itens.length) return;
        const ids = itens.map((i) => i.id);
        const [movido] = ids.splice(indice, 1);
        ids.splice(alvoIndice, 0, movido);
        Banco.reordenarItens(this.params.id, ids);
        this.renderizar();
      },
      simular: () => {
        const itens = Banco.listarItens(id);
        const primeiro = itens.find((i) => i.musica_id);
        const musica = primeiro ? Banco.obterMusica(primeiro.musica_id) : null;
        this.simularIndice = 0;
        this.tomAtual = musica ? musica.tom_original : "C";
        this.irPara("simular", { id });
      },
      "simular-ir": () => {
        this.simularIndice = Number(alvo.dataset.indice);
        const item = Banco.listarItens(this.params.id)[this.simularIndice];
        const musica = item ? Banco.obterMusica(item.musica_id) : null;
        this.tomAtual = musica ? musica.tom_original : this.tomAtual;
        this.renderizar();
      },
      transpor: () => {
        const delta = Number(alvo.dataset.delta);
        const notas = Componentes.notas;
        const idx = Componentes.indiceNota(this.tomAtual);
        this.tomAtual = notas[(idx + delta + 12) % 12];
        this.renderizar();
      },
      "criar-pasta": () => {
        const nome = prompt("Nome da pasta (ex: Pop, Sertanejo, Internacional):");
        if (nome && nome.trim()) Banco.criarPasta(nome);
        this.irPara("pastas");
      },
      "renomear-pasta": () => {
        const pasta = Banco.obterPasta(id);
        const nome = prompt("Novo nome da pasta:", pasta ? pasta.nome : "");
        if (nome && nome.trim()) Banco.atualizarPasta(id, nome);
        this.renderizar();
      },
      "apagar-pasta": () => {
        if (confirm("Apagar pasta? As músicas ficam sem pasta, não são excluídas.")) {
          Banco.apagarPasta(id);
          this.renderizar();
        }
      },
      "abrir-pasta": () => {
        this.pastaFiltro = String(id);
        this.irPara("musicas");
      },
    };

    if (acoes[acao]) {
      evento.preventDefault();
      acoes[acao]();
    }
  },

  tratarSubmit(evento) {
    const form = evento.target.closest("form[data-acao]");
    if (!form) return;
    evento.preventDefault();
    const dados = new FormData(form);

    if (form.dataset.acao === "salvar-musica") {
      Banco.salvarMusica({
        id: dados.get("id"),
        titulo: dados.get("titulo"),
        autor: dados.get("autor"),
        tom_original: dados.get("tom_original"),
        pasta_id: dados.get("pasta_id"),
        corpo_cifra: dados.get("corpo_cifra"),
        is_fixada: dados.get("is_fixada") === "on",
      });
      this.irPara("musicas");
    }

    if (form.dataset.acao === "salvar-celebracao") {
      const salva = Banco.salvarCelebracao({
        id: dados.get("id"),
        titulo: dados.get("titulo"),
        data_evento: dados.get("data_evento"),
      });
      this.irPara("celebracao-form", { id: salva.id });
    }

    if (form.dataset.acao === "filtrar-musicas") {
      this.buscaMusicas = String(dados.get("busca") || "");
      this.renderizar();
    }
  },

  tratarChange(evento) {
    const select = evento.target;
    if (select.matches(".filtro select")) {
      this.pastaFiltro = select.value;
      this.renderizar();
    }
  },

  tratarInput(evento) {
    const campo = evento.target.dataset.campo;
    if (!campo) return;
    const id = evento.target.dataset.id;
    const item = Banco.listarItens(this.params.id).find((i) => i.id === Number(id));
    if (!item) return;
    Banco.salvarItem({
      ...item,
      [campo]: campo === "musica_id" ? evento.target.value || null : evento.target.value,
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  Banco.iniciar();
  App.iniciar();
});
