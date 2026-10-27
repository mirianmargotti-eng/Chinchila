/* Gerenciador de navegação entre as telas */

const App = {
  tela: "inicio",
  params: {},
  buscaMusicas: "",
  buscaPastas: "",
  buscaCelebracoes: "",
  pastaFiltro: "",
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

  iniciar() {
    this.agendaSelecionada = this.dataHojeISO();
    this.aplicarTema(Banco.obterTema());
    this.renderizar();
    document.getElementById("app").addEventListener("click", (evento) => this.tratarClique(evento));
    document.getElementById("app").addEventListener("submit", (evento) => this.tratarSubmit(evento));
    document.getElementById("app").addEventListener("change", (evento) => this.tratarChange(evento));
    document.getElementById("app").addEventListener("input", (evento) => this.tratarInput(evento));
    document.getElementById("app").addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && this.dialogo) this.fecharDialogo();
    });
  },

  irPara(tela, params = {}) {
    if (this.tela === "simular" && tela !== "simular") this.pararRolagem();
    this.tela = tela;
    this.params = params;
    this.renderizar();
  },

  aplicarTema(tema) {
    document.documentElement.dataset.tema = tema;
    Banco.definirTema(tema);
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

  dataISO(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  },

  dataHojeISO() {
    return this.dataISO(new Date());
  },

  proximosSeteDias(registros) {
    const inicio = this.dataHojeISO();
    const fim = new Date();
    fim.setDate(fim.getDate() + 7);
    const limite = this.dataISO(fim);
    return registros
      .filter((registro) => registro.data_evento >= inicio && registro.data_evento <= limite)
      .sort((a, b) => a.data_evento.localeCompare(b.data_evento));
  },

  diasDoMesAgenda() {
    const primeiroDia = new Date(this.agendaMes.getFullYear(), this.agendaMes.getMonth(), 1);
    const deslocamento = (primeiroDia.getDay() + 6) % 7;
    const inicio = new Date(primeiroDia);
    inicio.setDate(primeiroDia.getDate() - deslocamento);
    const repertoriosPorData = new Map();
    const lembretesPorData = new Map();

    Banco.listarCelebracoes().forEach((repertorio) => {
      if (!repertoriosPorData.has(repertorio.data_evento)) repertoriosPorData.set(repertorio.data_evento, []);
      repertoriosPorData.get(repertorio.data_evento).push(repertorio);
    });
    Banco.listarLembretes().forEach((lembrete) => {
      if (!lembretesPorData.has(lembrete.data_evento)) lembretesPorData.set(lembrete.data_evento, []);
      lembretesPorData.get(lembrete.data_evento).push(lembrete);
    });

    return Array.from({ length: 42 }, (_, indice) => {
      const data = new Date(inicio);
      data.setDate(inicio.getDate() + indice);
      const chave = this.dataISO(data);
      return {
        data: chave,
        numero: data.getDate(),
        noMes: data.getMonth() === this.agendaMes.getMonth(),
        hoje: chave === this.dataHojeISO(),
        repertorios: repertoriosPorData.get(chave) || [],
        lembretes: lembretesPorData.get(chave) || [],
      };
    });
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
      html = Componentes.telaMusicas({
        musicas: Banco.listarMusicas({ busca: this.buscaMusicas, pasta_id: this.pastaFiltro || null }),
        pastas: Banco.listarPastas(),
        busca: this.buscaMusicas,
        pastaId: this.pastaFiltro,
      });
    } else if (this.tela === "musica-form") {
      titulo = this.params.id ? "Editar música" : "Nova música";
      descricao = "Adicione ou atualize uma música do seu acervo.";
      telaAtiva = "musicas";
      html = Componentes.formularioMusica({
        musica: this.params.id ? Banco.obterMusica(this.params.id) : null,
        pastas: Banco.listarPastas(),
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
        pastaNome: (Banco.obterPasta(musica.pasta_id) || {}).nome,
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
      };
    } else if (this.tela === "pastas") {
      titulo = "Pastas";
      descricao = "Organize suas músicas por categorias ou gêneros.";
      acaoCriar = "criar-pasta";
      rotuloCriar = "Nova pasta";
      const contagens = {};
      Banco.listarMusicas().forEach((m) => {
        if (m.pasta_id) contagens[m.pasta_id] = (contagens[m.pasta_id] || 0) + 1;
      });
      html = Componentes.telaPastas({ pastas: Banco.listarPastas(), contagens, busca: this.buscaPastas });
    } else if (this.tela === "configuracoes") {
      titulo = "Configurações";
      descricao = "Preferências da sua experiência no Chinchila.";
      html = Componentes.telaConfiguracoes({
        perfil,
        tema: Banco.obterTema(),
        momentos: Banco.momentosPadrao(),
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
        (this.dialogo ? Componentes.dialogo(this.dialogo) : "");
    }
  },

  alternarRolagem() {
    if (this.rolagemAtiva) {
      this.pararRolagem();
      return;
    }
    const area = document.querySelector(".palco-scroll-area");
    if (!area) return;
    this.rolagemAtiva = true;
    this.atualizarControlesPalco();
    this.rolagemIntervalo = window.setInterval(() => {
      const scrollArea = document.querySelector(".palco-scroll-area");
      if (!scrollArea) {
        this.pararRolagem();
        return;
      }
      scrollArea.scrollTop += this.rolagemVelocidade;
      if (scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight) {
        this.pararRolagem();
      }
    }, 50);
  },

  pararRolagem() {
    this.rolagemAtiva = false;
    if (this.rolagemIntervalo !== null) {
      window.clearInterval(this.rolagemIntervalo);
      this.rolagemIntervalo = null;
    }
    this.atualizarControlesPalco();
  },

  atualizarControlesPalco() {
    const botao = document.querySelector('[data-acao="alternar-rolagem"]');
    if (botao) {
      botao.innerHTML = `${Componentes.icone(this.rolagemAtiva ? "pause" : "play")}<span>${this.rolagemAtiva ? "Pausar rolagem" : "Iniciar rolagem"}</span>`;
      botao.classList.toggle("rolagem-ativa", this.rolagemAtiva);
    }
    const velocidade = document.querySelector(".palco-velocidade");
    if (velocidade) velocidade.textContent = `${this.rolagemVelocidade}×`;
    const tamanhoFonte = document.querySelector(".palco-fonte-tamanho");
    if (tamanhoFonte) tamanhoFonte.textContent = `${this.tamanhoFontePalco}px`;
    const cifra = document.querySelector(".palco-cifra");
    if (cifra) cifra.style.fontSize = `${this.tamanhoFontePalco}px`;
  },

  tratarClique(evento) {
    if (evento.target.matches(".dialogo-fundo")) {
      this.fecharDialogo();
      return;
    }
    const alvo = evento.target.closest("[data-acao]");
    if (!alvo) return;
    const acao = alvo.dataset.acao;
    const id = alvo.dataset.id;

    const acoes = {
      "cancelar-dialogo": () => this.fecharDialogo(),
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
      "alternar-rolagem": () => this.alternarRolagem(),
      "velocidade-rolagem": () => {
        this.rolagemVelocidade = Math.max(
          1,
          Math.min(5, this.rolagemVelocidade + Number(alvo.dataset.delta))
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
      simular: () => {
        this.pararRolagem();
        const itens = Banco.listarItens(id);
        const primeiro = itens.find((i) => i.musica_id);
        const musica = primeiro ? Banco.obterMusica(primeiro.musica_id) : null;
        this.simularIndice = 0;
        this.tomAtual = musica ? musica.tom_original : "C";
        this.irPara("simular", { id });
      },
      "simular-ir": () => {
        this.pararRolagem();
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
      "renomear-pasta": () => {
        const pasta = Banco.obterPasta(id);
        this.abrirDialogo({
          titulo: "Renomear pasta",
          mensagem: "Digite o novo nome para esta pasta.",
          tipo: "entrada",
          valorInicial: pasta ? pasta.nome : "",
          placeholder: "Nome da pasta",
          confirmacao: "Salvar nome",
        }, (nome) => {
          if (nome.trim()) Banco.atualizarPasta(id, nome.trim());
          this.renderizar();
        });
      },
      "apagar-pasta": () => {
        this.abrirDialogo({
          titulo: "Apagar pasta",
          mensagem: "As músicas desta pasta não serão excluídas; elas ficarão sem pasta.",
          confirmacao: "Apagar pasta",
          perigo: true,
        }, () => {
          Banco.apagarPasta(id);
          this.renderizar();
        });
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

    if (form.dataset.acao === "confirmar-dialogo") {
      this.confirmarDialogo(String(dados.get("valor") || ""));
      return;
    }

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
      const retornoAgenda = dados.get("retorno_agenda") === "true";
      if (retornoAgenda) this.agendaSelecionada = salva.data_evento;
      this.irPara("celebracao-form", { id: salva.id, retornoAgenda });
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
      this.renderizar();
    }

    if (form.dataset.acao === "filtrar-pastas") {
      this.buscaPastas = String(dados.get("busca") || "");
      this.renderizar();
    }

    if (form.dataset.acao === "filtrar-celebracoes") {
      this.buscaCelebracoes = String(dados.get("busca") || "");
      this.renderizar();
    }
  },

  tratarChange(evento) {
    const select = evento.target;
    if (select.matches(".filtro-select")) {
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
