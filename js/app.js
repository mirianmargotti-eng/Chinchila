const App = {
  tela: "inicio",
  params: {},
  buscaMusicas: "",
  buscaPastas: "",
  buscaCelebracoes: "",
  pastaFiltro: "",
  paginaMusicas: 1,
  musicasPorPagina: 6,
  buscaMusicasPasta: "",
  buscaAdicionarPasta: "",
  adicaoPastaAberta: false,
  musicasSelecionadasPasta: [],
  importacaoAberta: false,
  metronomoAtivo: false,
  metronomoBpm: 80,
  metronomoIntervalo: null,
  audioContext: null,
  tomAtual: "C",
  agendaMes: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  agendaSelecionada: "",
  dialogo: null,
  executarDialogo: null,
  simularIndice: 0,
  rolagemAtiva: false,
  rolagemVelocidade: 1,
  rolagemIntervalo: null,
  tamanhoFontePalco: 16,
  sidebarPalcoAberta: false,
  infoPalcoAberta: false,
  comentarioPalcoId: null,
  arrastoPonteiro: null,
  mensagemConfiguracoes: "",
  blocosConfiguracoesAbertos: [],

  iniciar() {
    this.agendaSelecionada = this.dataHojeISO();
    this.aplicarTema(Banco.obterTema());
    this.aplicarFonteTexto(Banco.obterFonteTexto());
    this.renderizar();
    document.getElementById("app").addEventListener("click", (evento) => this.tratarClique(evento));
    document.getElementById("app").addEventListener("submit", (evento) => this.tratarSubmit(evento));
    document.getElementById("app").addEventListener("change", (evento) => this.tratarChange(evento));
    document.getElementById("app").addEventListener("input", (evento) => this.tratarInput(evento));
    document.getElementById("app").addEventListener("toggle", (evento) => {
      const bloco = evento.target.closest("details[data-bloco-config]");
      if (!bloco) return;
      const abertos = new Set(this.blocosConfiguracoesAbertos);
      if (bloco.open) abertos.add(bloco.dataset.blocoConfig);
      else abertos.delete(bloco.dataset.blocoConfig);
      this.blocosConfiguracoesAbertos = Array.from(abertos);
    }, true);
    document.getElementById("app").addEventListener("pointerdown", (evento) => this.iniciarArrastoMomento(evento));
    document.getElementById("app").addEventListener("pointermove", (evento) => this.moverArrastoMomento(evento));
    document.getElementById("app").addEventListener("pointerup", (evento) => this.finalizarArrastoMomento(evento));
    document.getElementById("app").addEventListener("pointercancel", () => this.limparArrastoMomentos());
    document.getElementById("app").addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && this.dialogo) this.fecharDialogo();
      else if (evento.key === "Escape" && this.comentarioPalcoId !== null) {
        this.comentarioPalcoId = null;
        this.renderizar();
      } else if (evento.key === "Escape" && this.sidebarPalcoAberta) {
        this.sidebarPalcoAberta = false;
        this.renderizar();
      } else if (
        evento.target.matches(".momento-arrastar") &&
        (evento.key === "ArrowUp" || evento.key === "ArrowDown")
      ) {
        evento.preventDefault();
        const id = Number(evento.target.closest(".momento-card").dataset.itemId);
        const itens = Banco.listarItens(this.params.id);
        const indice = itens.findIndex((item) => item.id === id);
        const destino = indice + (evento.key === "ArrowUp" ? -1 : 1);
        if (indice < 0 || destino < 0 || destino >= itens.length) return;
        const ids = itens.map((item) => item.id);
        ids.splice(destino, 0, ids.splice(indice, 1)[0]);
        Banco.reordenarItens(this.params.id, ids);
        this.renderizar();
        document.querySelector(`.momento-card[data-item-id="${id}"] .momento-arrastar`)?.focus();
      }
    });
  },

  irPara(tela, params = {}) {
    if (this.tela === "simular" && tela !== "simular") this.pararRolagem();
    if (tela !== "configuracoes") this.mensagemConfiguracoes = "";
    this.tela = tela;
    this.params = params;
    this.renderizar();
  },

  aplicarTema(tema) {
    document.documentElement.dataset.tema = tema;
    Banco.definirTema(tema);
  },

  aplicarFonteTexto(fonte) {
    document.documentElement.dataset.fonte = fonte;
  },

  abrirDialogo(opcoes, executar) {
    this.dialogo = opcoes;
    this.executarDialogo = executar;
    this.renderizar();
    const entrada = document.querySelector(".dialogo-campo input");
    const confirmar = document.querySelector(".dialogo-acoes button[type='submit']");
    (entrada || confirmar)?.focus();
  },

  fecharDialogo() {
    this.dialogo = null;
    this.executarDialogo = null;
    this.renderizar();
  },

  confirmarDialogo(valor) {
    const executar = this.executarDialogo;
    this.dialogo = null;
    this.executarDialogo = null;
    if (executar) executar(valor);
    else this.renderizar();
  },

  renderizar() {
    const raiz = document.getElementById("app");
    const perfil = Banco.obterPerfil();
    let titulo = "Início";
    let descricao = "Seu espaço para organizar músicas, cifras e repertórios.";
    let acaoCriar = null;
    let rotuloCriar = "";
    let html = "";
    let telaAtiva = this.tela;
    let dadosPalco = null;

    if (this.tela === "inicio") {
      const repertoriosProximos = this.proximosSeteDias(Banco.listarCelebracoes());
      const lembretesProximos = this.proximosSeteDias(Banco.listarLembretes());
      html = Componentes.telaInicio({
        proximosRepertorios: repertoriosProximos,
        proximosLembretes: lembretesProximos,
        favoritas: Banco.listarMusicas({ apenasFixadas: true }),
        totalMusicas: Banco.listarMusicas().length,
        totalPastas: Banco.listarPastas().length,
        totalCelebracoes: Banco.listarCelebracoes().length,
      });
    } else if (this.tela === "musicas") {
      titulo = "Músicas";
      descricao = "Seu acervo pessoal de músicas e cifras.";
      acaoCriar = "nova-musica";
      rotuloCriar = "Nova música";
      const musicasEncontradas = Banco.listarMusicas({
        busca: this.buscaMusicas,
        pasta_id: this.pastaFiltro || null,
      });
      const totalPaginas = Math.max(1, Math.ceil(musicasEncontradas.length / this.musicasPorPagina));
      this.paginaMusicas = Math.min(this.paginaMusicas, totalPaginas);
      const inicioPagina = (this.paginaMusicas - 1) * this.musicasPorPagina;
      html = Componentes.telaMusicas({
        musicas: musicasEncontradas.slice(inicioPagina, inicioPagina + this.musicasPorPagina),
        pastas: Banco.listarPastas(),
        busca: this.buscaMusicas,
        pastaId: this.pastaFiltro,
        total: musicasEncontradas.length,
        pagina: this.paginaMusicas,
        totalPaginas,
        paginaTamanho: this.musicasPorPagina,
      });
    } else if (this.tela === "musica-form") {
      titulo = this.params.id ? "Editar música" : "Nova música";
      descricao = "Adicione ou atualize uma música do seu acervo.";
      telaAtiva = "musicas";
      html = Componentes.formularioMusica({
        musica: this.params.id ? Banco.obterMusica(this.params.id) : this.params.importacao || null,
        pastas: Banco.listarPastas(),
        importacao: Boolean(this.params.importacao),
      });
    } else if (this.tela === "cifra") {
      const musica = Banco.obterMusica(this.params.id);
      if (!musica) return this.irPara("musicas");
      titulo = "Cifra";
      descricao = "Consulte e ajuste o tom da música.";
      telaAtiva = "musicas";
      html = Componentes.telaCifra({
        musica,
        tomAtual: this.tomAtual,
        pastaNome: Banco.idsPastasDaMusica(musica)
          .map((id) => Banco.obterPasta(id)?.nome)
          .filter(Boolean)
          .join(", ") || "Sem pasta",
        metronomoAtivo: this.metronomoAtivo,
        bpm: this.metronomoBpm,
      });
    } else if (this.tela === "celebracoes") {
      titulo = "Repertórios";
      descricao = "Monte sequências flexíveis para apresentações e eventos.";
      acaoCriar = "nova-celebracao";
      rotuloCriar = "Novo repertório";
      telaAtiva = "celebracoes";
      html = Componentes.telaCelebracoes({
        celebracoes: Banco.listarCelebracoes().filter((celebracao) =>
          celebracao.titulo.toLowerCase().includes(this.buscaCelebracoes.trim().toLowerCase())
        ),
        busca: this.buscaCelebracoes,
      });
    } else if (this.tela === "celebracao-form") {
      titulo = this.params.id ? "Editar repertório" : "Novo repertório";
      descricao = "Organize os momentos e as músicas da sua sequência.";
      telaAtiva = "celebracoes";
      const celebracao = this.params.id ? Banco.obterCelebracao(this.params.id) : null;
      html = Componentes.formularioCelebracao({
        celebracao,
        itens: celebracao ? Banco.listarItens(celebracao.id) : [],
        musicas: Banco.listarMusicas(),
        momentos: Banco.momentosPadrao(),
        dataInicial: this.params.data_evento,
        retornoAgenda: Boolean(this.params.retornoAgenda),
      });
    } else if (this.tela === "simular") {
      const celebracao = Banco.obterCelebracao(this.params.id);
      if (!celebracao) return this.irPara("celebracoes");
      const itens = Banco.listarItens(celebracao.id);
      const item = itens[this.simularIndice] || null;
      const musica = item ? Banco.obterMusica(item.musica_id) : null;
      titulo = "Modo palco";
      descricao = celebracao.titulo;
      telaAtiva = "celebracoes";
      const cifra = musica
        ? Componentes.transporCifra(musica.corpo_cifra, musica.tom_original, this.tomAtual) ||
          "Esta música ainda não tem cifra cadastrada."
        : "";
      dadosPalco = {
        celebracao,
        item,
        itens,
        musica,
        indice: this.simularIndice,
        tomAtual: this.tomAtual,
        corpo: Componentes.escapar(cifra),
        sidebarAberta: this.sidebarPalcoAberta,
        infoAberta: this.infoPalcoAberta,
        comentarioId: this.comentarioPalcoId,
      };
    } else if (this.tela === "pastas") {
      titulo = "Pastas";
      descricao = "Organize suas músicas por categorias ou gêneros.";
      acaoCriar = "criar-pasta";
      rotuloCriar = "Nova pasta";
      const contagens = {};
      Banco.listarMusicas().forEach((m) => {
        Banco.idsPastasDaMusica(m).forEach((id) => {
          contagens[id] = (contagens[id] || 0) + 1;
        });
      });
      html = Componentes.telaPastas({ pastas: Banco.listarPastas(), contagens, busca: this.buscaPastas });
    } else if (this.tela === "pasta-detalhe") {
      const pasta = Banco.obterPasta(this.params.id);
      if (!pasta) return this.irPara("pastas");
      titulo = pasta.nome;
      descricao = "Gerencie a capa, as músicas e os detalhes desta pasta.";
      telaAtiva = "pastas";
      const musicasDaPasta = Banco.listarMusicas({
        busca: this.buscaMusicasPasta,
        pasta_id: pasta.id,
      });
      const musicasSelecionadas = this.musicasSelecionadasPasta.map(Number);
      html = Componentes.telaDetalhePasta({
        pasta,
        musicas: musicasDaPasta,
        totalMusicas: Banco.listarMusicas({ pasta_id: pasta.id }).length,
        musicasDisponiveis: Banco.listarMusicas({ busca: this.buscaAdicionarPasta })
          .filter((musica) => !Banco.idsPastasDaMusica(musica).includes(pasta.id)),
        buscaMusicas: this.buscaMusicasPasta,
        buscaAdicionar: this.buscaAdicionarPasta,
        musicasSelecionadas,
        adicaoAberta: this.adicaoPastaAberta,
      });
    } else if (this.tela === "configuracoes") {
      titulo = "Configurações";
      descricao = "Preferências da sua experiência no Chinchila.";
      html = Componentes.telaConfiguracoes({
        perfil,
        tema: Banco.obterTema(),
        momentos: Banco.momentosPadrao(),
        fonteTexto: Banco.obterFonteTexto(),
        mensagem: this.mensagemConfiguracoes,
        blocosAbertos: this.blocosConfiguracoesAbertos,
      });
    } else if (this.tela === "acesso") {
      titulo = "Acesso à conta";
      descricao = "Prévia visual — autenticação ainda não disponível.";
      telaAtiva = "configuracoes";
      html = Componentes.telaAcesso();
    } else if (this.tela === "agenda") {
      titulo = "Agenda";
      descricao = "Acompanhe repertórios, eventos e lembretes em um só lugar.";
      const ano = this.agendaMes.getFullYear();
      const mes = this.agendaMes.getMonth();
      const editorId = this.params.lembreteId;
      html = Componentes.telaAgenda({
        mes: {
          rotulo: new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(this.agendaMes),
        },
        dias: this.diasDoMesAgenda(),
        selecionada: this.agendaSelecionada,
        repertorios: Banco.listarCelebracoes().filter((repertorio) => repertorio.data_evento === this.agendaSelecionada),
        lembretes: Banco.listarLembretes().filter((lembrete) => lembrete.data_evento === this.agendaSelecionada),
        editorLembrete: this.params.novoLembrete
          ? {
              ...(editorId ? Banco.obterLembrete(editorId) || {} : {}),
              data_evento: editorId && Banco.obterLembrete(editorId)
                ? Banco.obterLembrete(editorId).data_evento
                : this.agendaSelecionada,
            }
          : null,
      });
    }

    if (dadosPalco) {
      raiz.innerHTML = Componentes.layoutPalco(dadosPalco);
      this.atualizarControlesPalco();
    } else {
      raiz.innerHTML =
        Componentes.layout({ telaAtiva, titulo, descricao, acaoCriar, rotuloCriar, perfil, html }) +
        (this.dialogo ? Componentes.dialogo(this.dialogo) : "") +
        (this.importacaoAberta ? Componentes.modalImportarCifra() : "");
    }
  },

  tratarClique(evento) {
    if (evento.target.matches(".dialogo-fundo")) {
      if (this.dialogo) this.fecharDialogo();
      else if (this.importacaoAberta) {
        this.importacaoAberta = false;
        this.renderizar();
      }
      return;
    }
    const alvo = evento.target.closest("[data-acao]");
    if (!alvo) return;
    const acao = alvo.dataset.acao;
    const id = alvo.dataset.id;

    const acoes = {
      "cancelar-dialogo": () => this.fecharDialogo(),
      "abrir-importacao-cifra": () => {
        this.importacaoAberta = true;
        this.renderizar();
        document.querySelector('.importacao-painel input[name="url"]')?.focus();
      },
      "cancelar-importacao": () => {
        this.importacaoAberta = false;
        this.renderizar();
      },
      "pagina-musicas": () => {
        const total = Banco.listarMusicas({
          busca: this.buscaMusicas,
          pasta_id: this.pastaFiltro || null,
        }).length;
        const totalPaginas = Math.max(1, Math.ceil(total / this.musicasPorPagina));
        this.paginaMusicas = Math.max(
          1,
          Math.min(totalPaginas, this.paginaMusicas + Number(alvo.dataset.delta))
        );
        this.renderizar();
      },
      navegar: () => this.irPara(alvo.dataset.tela),
      "navegar-agenda-data": () => {
        this.agendaSelecionada = alvo.dataset.data;
        const [ano, mes] = this.agendaSelecionada.split("-").map(Number);
        this.agendaMes = new Date(ano, mes - 1, 1);
        this.irPara("agenda");
      },
      "agenda-selecionar-data": () => {
        this.agendaSelecionada = alvo.dataset.data;
        const [ano, mes] = this.agendaSelecionada.split("-").map(Number);
        this.agendaMes = new Date(ano, mes - 1, 1);
        this.irPara("agenda");
      },
      "agenda-mudar-mes": () => {
        this.agendaMes = new Date(
          this.agendaMes.getFullYear(),
          this.agendaMes.getMonth() + Number(alvo.dataset.delta),
          1
        );
        this.irPara("agenda");
      },
      "agenda-hoje": () => {
        const hoje = new Date();
        this.agendaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        this.agendaSelecionada = this.dataHojeISO();
        this.irPara("agenda");
      },
      "agenda-criar-repertorio": () => {
        this.irPara("celebracao-form", {
          data_evento: this.agendaSelecionada,
          retornoAgenda: true,
        });
      },
      "agenda-novo-lembrete": () => this.irPara("agenda", { novoLembrete: true }),
      "agenda-editar-lembrete": () => {
        const lembrete = Banco.obterLembrete(id);
        if (!lembrete) return;
        this.agendaSelecionada = lembrete.data_evento;
        const [ano, mes] = lembrete.data_evento.split("-").map(Number);
        this.agendaMes = new Date(ano, mes - 1, 1);
        this.irPara("agenda", { novoLembrete: true, lembreteId: lembrete.id });
      },
      "agenda-cancelar-lembrete": () => this.irPara("agenda"),
      "agenda-apagar-lembrete": () => {
        this.abrirDialogo({
          titulo: "Apagar lembrete",
          mensagem: "Este lembrete será removido permanentemente da sua agenda.",
          confirmacao: "Apagar lembrete",
          perigo: true,
        }, () => {
          Banco.apagarLembrete(id);
          this.irPara("agenda");
        });
      },
      "voltar-agenda": () => {
        const repertorio = this.params.id ? Banco.obterCelebracao(this.params.id) : null;
        this.agendaSelecionada = repertorio
          ? repertorio.data_evento
          : this.params.data_evento || this.agendaSelecionada;
        const [ano, mes] = this.agendaSelecionada.split("-").map(Number);
        this.agendaMes = new Date(ano, mes - 1, 1);
        this.irPara("agenda");
      },
      "alternar-tema": () => {
        this.aplicarTema(Banco.obterTema() === "claro" ? "escuro" : "claro");
        this.renderizar();
      },
      "sair-palco": () => this.irPara("celebracao-form", { id: this.params.id }),
      "alternar-menu-palco": () => {
        this.sidebarPalcoAberta = !this.sidebarPalcoAberta;
        this.renderizar();
      },
      "alternar-info-palco": () => {
        this.infoPalcoAberta = !this.infoPalcoAberta;
        this.renderizar();
      },
      "abrir-comentario-palco": () => {
        this.comentarioPalcoId = Number(id);
        this.sidebarPalcoAberta = true;
        this.renderizar();
      },
      "fechar-comentario-palco": () => {
        this.comentarioPalcoId = null;
        this.renderizar();
      },
      "alternar-rolagem": () => this.alternarRolagem(),
      "velocidade-rolagem": () => {
        this.rolagemVelocidade = Math.max(
          1,
          Math.min(20, this.rolagemVelocidade + Number(alvo.dataset.delta))
        );
        this.atualizarControlesPalco();
      },
      "tamanho-fonte": () => {
        this.tamanhoFontePalco = Math.max(
          12,
          Math.min(28, this.tamanhoFontePalco + Number(alvo.dataset.delta))
        );
        this.atualizarControlesPalco();
      },
      "editar-perfil": () => {
        this.abrirDialogo({
          titulo: "Editar perfil",
          mensagem: "Escolha o nome que será exibido no seu perfil local.",
          tipo: "entrada",
          valorInicial: Banco.obterPerfil().nome || "",
          placeholder: "Seu nome",
          confirmacao: "Salvar nome",
        }, (nome) => {
          if (nome.trim()) Banco.definirPerfil({ nome: nome.trim() });
          this.renderizar();
        });
      },
      "abrir-celebracao": () => this.irPara("celebracao-form", { id }),
      "abrir-cifra": () => {
        const musica = Banco.obterMusica(id);
        this.tomAtual = musica ? musica.tom_original : "C";
        this.irPara("cifra", { id });
      },
      "clonar-musica": () => {
        const musica = Banco.obterMusica(id);
        if (!musica) return;
        const copia = Banco.salvarMusica({
          ...musica,
          id: null,
          titulo: `${musica.titulo} (cópia)`,
          is_fixada: false,
        });
        this.irPara("musica-form", { id: copia.id });
      },
      "metronomo-toggle": () => this.alternarMetronomo(),
      "imprimir-cifra": () => window.print(),
      "exportar-pdf": () => window.print(),
      "nova-musica": () => this.irPara("musica-form"),
      "editar-musica": () => this.irPara("musica-form", { id }),
      favoritar: () => {
        Banco.alternarFavorita(id);
        this.renderizar();
      },
      "apagar-musica": () => {
        const musica = Banco.obterMusica(id);
        this.abrirDialogo({
          titulo: "Apagar música",
          mensagem: `A música “${musica ? musica.titulo : "selecionada"}” será removida do acervo local.`,
          confirmacao: "Apagar música",
          perigo: true,
        }, () => {
          Banco.apagarMusica(id);
          this.renderizar();
        });
      },
      "nova-celebracao": () => this.irPara("celebracao-form"),
      "apagar-celebracao": () => {
        this.abrirDialogo({
          titulo: "Apagar repertório",
          mensagem: "Este repertório e sua sequência deixarão de ficar disponíveis.",
          confirmacao: "Apagar repertório",
          perigo: true,
        }, () => {
          Banco.apagarCelebracao(id);
          this.renderizar();
        });
      },
      "clonar-celebracao": () => {
        const copia = Banco.clonarCelebracao(id);
        if (copia) this.irPara("celebracao-form", { id: copia.id });
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
        this.abrirDialogo({
          titulo: "Apagar momento",
          mensagem: "Este momento será removido da sequência do repertório.",
          confirmacao: "Apagar momento",
          perigo: true,
        }, () => {
          Banco.apagarItem(id);
          this.irPara("celebracao-form", { id: this.params.id });
        });
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
      "selecionar-musica-momento": () => {
        const item = Banco.listarItens(this.params.id).find((linha) => linha.id === Number(id));
        if (!item) return;
        Banco.salvarItem({
          ...item,
          musica_id: alvo.dataset.musicaId || null,
        });
        this.renderizar();
      },
      simular: () => {
        this.pararRolagem();
        this.sidebarPalcoAberta = false;
        this.infoPalcoAberta = false;
        this.comentarioPalcoId = null;
        const itens = Banco.listarItens(id);
        const primeiro = itens.find((i) => i.musica_id);
        const musica = primeiro ? Banco.obterMusica(primeiro.musica_id) : null;
        this.simularIndice = 0;
        this.tomAtual = musica ? musica.tom_original : "C";
        this.irPara("simular", { id });
      },
      "simular-ir": () => {
        this.pararRolagem();
        this.comentarioPalcoId = null;
        this.simularIndice = Number(alvo.dataset.indice);
        const areaPalco = document.querySelector(".palco-scroll-area");
        if (areaPalco) areaPalco.scrollTop = 0;
        const item = Banco.listarItens(this.params.id)[this.simularIndice];
        const musica = item ? Banco.obterMusica(item.musica_id) : null;
        this.tomAtual = musica ? musica.tom_original : "C";
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
        this.abrirDialogo({
          titulo: "Criar pasta",
          mensagem: "Dê um nome para organizar suas músicas.",
          tipo: "entrada",
          placeholder: "Ex.: Pop, Sertanejo",
          confirmacao: "Criar pasta",
        }, (nome) => {
          if (nome.trim()) Banco.criarPasta(nome.trim());
          this.irPara("pastas");
        });
      },
      "apagar-pasta": () => {
        this.abrirDialogo({
          titulo: "Apagar pasta",
          mensagem: "A pasta e seus vínculos serão removidos. As músicas continuarão no acervo e em quaisquer outras pastas.",
          confirmacao: "Apagar pasta",
          perigo: true,
        }, () => {
          Banco.apagarPasta(id);
          this.adicaoPastaAberta = false;
          this.musicasSelecionadasPasta = [];
          this.irPara("pastas");
        });
      },
      "abrir-pasta": () => {
        this.buscaMusicasPasta = "";
        this.buscaAdicionarPasta = "";
        this.adicaoPastaAberta = false;
        this.musicasSelecionadasPasta = [];
        this.irPara("pasta-detalhe", { id });
      },
      "voltar-pastas": () => this.irPara("pastas"),
      "alternar-adicao-pasta": () => {
        this.adicaoPastaAberta = !this.adicaoPastaAberta;
        this.buscaAdicionarPasta = "";
        this.musicasSelecionadasPasta = [];
        this.renderizar();
      },
      "remover-musica-pasta": () => {
        Banco.removerMusicaDaPasta(this.params.id, id);
        this.renderizar();
      },
      "remover-capa-pasta": () => {
        Banco.atualizarPasta(this.params.id, { capa: "" });
        this.renderizar();
      },
    };

    if (acoes[acao]) {
      evento.preventDefault();
      acoes[acao]();
    }
  },

  async tratarSubmit(evento) {
    const form = evento.target.closest("form[data-acao]");
    if (!form) return;
    evento.preventDefault();
    const dados = new FormData(form);

    if (form.dataset.acao === "confirmar-dialogo") {
      this.confirmarDialogo(String(dados.get("valor") || ""));
      return;
    }

    if (form.dataset.acao === "salvar-pasta-detalhe") {
      const arquivo = dados.get("capa");
      try {
        const capa = arquivo instanceof File && arquivo.size ? await this.lerCapaPasta(arquivo) : undefined;
        const alteracoes = { nome: String(dados.get("nome") || "").trim() };
        if (capa !== undefined) alteracoes.capa = capa;
        Banco.atualizarPasta(dados.get("id"), alteracoes);
        this.renderizar();
      } catch (erro) {
        const envioDeCapa = arquivo instanceof File && arquivo.size;
        this.abrirDialogo({
          titulo: envioDeCapa ? "Não foi possível salvar a capa" : "Não foi possível salvar a pasta",
          mensagem: erro.message || "Ocorreu um erro ao salvar as alterações.",
          confirmacao: "Entendi",
        });
      }
      return;
    }

    if (form.dataset.acao === "adicionar-musicas-pasta") {
      Banco.adicionarMusicasNaPasta(this.params.id, this.musicasSelecionadasPasta);
      this.musicasSelecionadasPasta = [];
      this.adicaoPastaAberta = false;
      this.buscaAdicionarPasta = "";
      this.renderizar();
      return;
    }

    if (form.dataset.acao === "importar-cifra") {
      const url = String(dados.get("url") || "").trim();
      const arquivo = dados.get("arquivo");
      const botao = form.querySelector('button[type="submit"]');
      if (!url && !(arquivo instanceof File && arquivo.size)) {
        this.importacaoAberta = false;
        this.abrirDialogo({
          titulo: "Falta escolher a cifra",
          mensagem: "Informe um link público ou selecione um arquivo PDF para importar.",
          confirmacao: "Entendi",
        });
        return;
      }
      botao.disabled = true;
      botao.textContent = "Importando...";
      try {
        const importacao = await this.lerImportacaoCifra(
          url,
          arquivo instanceof File && arquivo.size ? arquivo : null
        );
        this.irPara("musica-form", { importacao });
      } catch (erro) {
        this.importacaoAberta = false;
        this.abrirDialogo({
          titulo: "Não foi possível importar",
          mensagem: erro.message || "Ocorreu um erro ao ler a cifra.",
          confirmacao: "Fechar",
        });
      }
      return;
    }

    if (form.dataset.acao === "salvar-musica") {
      const novaMusica = !dados.get("id");
      Banco.salvarMusica({
        id: dados.get("id"),
        titulo: dados.get("titulo"),
        autor: dados.get("autor"),
        tom_original: dados.get("tom_original"),
        pasta_id: dados.get("pasta_id"),
        corpo_cifra: dados.get("corpo_cifra"),
        is_fixada: dados.get("is_fixada") === "on",
      });
      if (novaMusica) this.paginaMusicas = 1;
      this.irPara("musicas");
    }

    if (form.dataset.acao === "salvar-celebracao") {
      const salva = Banco.salvarCelebracao({
        id: dados.get("id"),
        titulo: dados.get("titulo"),
        data_evento: dados.get("data_evento"),
        local: dados.get("local"),
      });
      if (!dados.get("id")) {
        Banco.momentosPadrao().forEach((nome_momento, indice) => {
          Banco.salvarItem({
            celebracao_id: salva.id,
            posicao_ordem: indice + 1,
            nome_momento,
            musica_id: null,
            nota_adicional: "",
          });
        });
      }
      const retornoAgenda = dados.get("retorno_agenda") === "true";
      if (retornoAgenda) this.agendaSelecionada = salva.data_evento;
      this.irPara("celebracao-form", { id: salva.id, retornoAgenda });
    }

    if (form.dataset.acao === "salvar-momentos-padrao") {
      const momentos = String(dados.get("momentos") || "").split(/\r?\n/);
      Banco.definirMomentosPadrao(momentos);
      this.mensagemConfiguracoes = "Momentos padrão salvos.";
      this.renderizar();
      return;
    }

    if (form.dataset.acao === "agenda-salvar-lembrete") {
      const lembrete = Banco.salvarLembrete({
        id: dados.get("id"),
        titulo: dados.get("titulo"),
        descricao: dados.get("descricao"),
        data_evento: dados.get("data_evento"),
      });
      this.agendaSelecionada = lembrete.data_evento;
      const [ano, mes] = this.agendaSelecionada.split("-").map(Number);
      this.agendaMes = new Date(ano, mes - 1, 1);
      this.irPara("agenda");
    }

    if (form.dataset.acao === "filtrar-musicas") {
      this.buscaMusicas = String(dados.get("busca") || "");
      this.paginaMusicas = 1;
      this.renderizar();
    }

    if (form.dataset.acao === "filtrar-pastas") {
      this.buscaPastas = String(dados.get("busca") || "");
      this.renderizar();
    }

    if (form.dataset.acao === "filtrar-musicas-pasta") {
      this.buscaMusicasPasta = String(dados.get("busca_musicas") || "");
      this.renderizar();
    }

    if (form.dataset.acao === "filtrar-adicao-pasta") {
      this.buscaAdicionarPasta = String(dados.get("busca_adicionar") || "");
      this.renderizar();
    }

    if (form.dataset.acao === "filtrar-celebracoes") {
      this.buscaCelebracoes = String(dados.get("busca") || "");
      this.renderizar();
    }
  },

  tratarChange(evento) {
    if (evento.target.matches(".metronomo-bpm")) {
      const valor = Number(evento.target.value);
      if (evento.target.value && Number.isFinite(valor)) {
        this.definirMetronomoBpm(valor);
      }
      evento.target.value = String(this.metronomoBpm);
      return;
    }
    if (evento.target.matches("[data-selecao-pasta]")) {
      const id = Number(evento.target.value);
      const selecionadas = new Set(this.musicasSelecionadasPasta.map(Number));
      if (evento.target.checked) selecionadas.add(id);
      else selecionadas.delete(id);
      this.musicasSelecionadasPasta = [...selecionadas];
      const resumo = document.querySelector(".pasta-selecao-acoes span");
      const botao = document.querySelector('.pasta-selecao-acoes button[type="submit"]');
      if (resumo) resumo.textContent = `${selecionadas.size} selecionada(s)`;
      if (botao) botao.disabled = selecionadas.size === 0;
      return;
    }
    const select = evento.target;
    if (select.matches('[data-acao="selecionar-fonte-texto"]')) {
      Banco.definirFonteTexto(select.value);
      this.aplicarFonteTexto(select.value);
      this.mensagemConfiguracoes = "Fonte atualizada.";
      this.renderizar();
      return;
    }
    if (select.matches(".relato-arquivo")) {
      const nome = select.files && select.files[0] ? select.files[0].name : "";
      const status = document.querySelector(".relato-arquivo-nome");
      if (status) status.textContent = nome ? `Imagem selecionada: ${nome}` : "Nenhuma imagem selecionada.";
      return;
    }
    if (select.matches(".filtro-select")) {
      this.pastaFiltro = select.value;
      this.paginaMusicas = 1;
      this.renderizar();
    }
  },

  tratarInput(evento) {
    if (evento.target.matches(".metronomo-bpm")) {
      const valor = Number(evento.target.value);
      if (
        evento.target.value &&
        Number.isInteger(valor) &&
        valor >= 40 &&
        valor <= 240
      ) {
        this.definirMetronomoBpm(valor);
      }
      return;
    }
    if (evento.target.matches('[data-acao="buscar-musica-momento"]')) {
      const campo = evento.target.closest(".campo-musica").querySelector(".momento-busca-resultados");
      const busca = evento.target.value.trim();
      campo.innerHTML = Componentes.resultadosBuscaMusica(Banco.listarMusicas(), evento.target.dataset.id, busca);
      campo.hidden = !busca;
      return;
    }
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
