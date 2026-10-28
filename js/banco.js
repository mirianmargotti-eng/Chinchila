  
const Banco = {
  chave: "chinchila.v1",

  estado: {
    sequencias: { pastas: 1, musicas: 1, celebracoes: 1, itens_celebracao: 1, lembretes: 1 },
    pastas: [],
    musicas: [],
    celebracoes: [],
    itens_celebracao: [],
    lembretes: [],
    config: {
      tema: "claro",
      fonteTexto: "padrao",
      perfil: { nome: "Meu perfil", email: "" },
      momentosPadrao: [
        "Entrada",
        "Entrada da Bíblia",
        "Glória",
        "Ofertório",
        "Comunhão",
        "Final",
        "Bloco da Tarde",
        "Bloco da Noite",
      ],
    },
  },

  iniciar() {
    const salvo = localStorage.getItem(this.chave);
    if (salvo) {
      let dados;
      try {
        dados = JSON.parse(salvo);
      } catch (erro) {
        throw new Error("Não foi possível ler os dados locais do Chinchila. Os dados foram preservados.", { cause: erro });
      }
      this.estado = { ...this.estado, ...dados };
      this.estado.sequencias = { ...this.estado.sequencias, ...(dados.sequencias || {}) };
      this.estado.lembretes = Array.isArray(dados.lembretes) ? dados.lembretes : [];
      if (!dados.sequencias || !dados.sequencias.lembretes) {
        this.estado.sequencias.lembretes =
          this.estado.lembretes.reduce((proximoId, lembrete) => Math.max(proximoId, lembrete.id + 1), 1);
      }
      this.estado.config = { ...this.estado.config, ...(dados.config || {}) };
      this.estado.config.momentosPadrao = Array.isArray(this.estado.config.momentosPadrao)
        ? this.estado.config.momentosPadrao.map((momento) => String(momento || "").trim()).filter(Boolean)
        : [];
      if (!["padrao", "arial", "times"].includes(this.estado.config.fonteTexto)) {
        this.estado.config.fonteTexto = "padrao";
      }
      this.estado.config.perfil = {
        ...this.estado.config.perfil,
        ...(dados.config && dados.config.perfil ? dados.config.perfil : {}),
      };
      this._removerDadosDemonstracao();
      this.gravar();
      return;
    }
    this._seed();
    this.gravar();
  },

  gravar() {
    localStorage.setItem(this.chave, JSON.stringify(this.estado));
  },

  _id(tabela) {
    const id = this.estado.sequencias[tabela]++;
    this.gravar();
    return id;
  },

  _agora() {
    return new Date().toISOString();
  },

  obterTema() {
    return this.estado.config.tema || "claro";
  },

  definirTema(tema) {
    this.estado.config.tema = tema;
    this.gravar();
  },

  obterPerfil() {
    return this.estado.config.perfil;
  },

  definirPerfil(perfil) {
    this.estado.config.perfil = { ...this.estado.config.perfil, ...perfil };
    this.gravar();
  },

  momentosPadrao() {
    return this.estado.config.momentosPadrao.slice();
  },

  definirMomentosPadrao(momentos) {
    this.estado.config.momentosPadrao = momentos
      .map((momento) => String(momento || "").trim())
      .filter(Boolean);
    this.gravar();
    return this.momentosPadrao();
  },

  obterFonteTexto() {
    return ["padrao", "arial", "times"].includes(this.estado.config.fonteTexto)
      ? this.estado.config.fonteTexto
      : "padrao";
  },

  definirFonteTexto(fonte) {
    if (!["padrao", "arial", "times"].includes(fonte)) {
      throw new Error("A fonte de texto selecionada não é válida.");
    }
    this.estado.config.fonteTexto = fonte;
    this.gravar();
    return fonte;
  },

  listarPastas() {
    return this.estado.pastas.slice().sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  },

  obterPasta(id) {
    return this.estado.pastas.find((p) => p.id === Number(id)) || null;
  },

  criarPasta(nome) {
    const pasta = { id: this._id("pastas"), nome: String(nome || "").trim(), capa: "" };
    this.estado.pastas.push(pasta);
    this.gravar();
    return pasta;
  },

  atualizarPasta(id, dados) {
    const pasta = this.obterPasta(id);
    if (!pasta) return null;
    if (typeof dados === "string") {
      pasta.nome = dados.trim();
    } else {
      if (typeof dados.nome === "string") pasta.nome = dados.nome.trim();
      if (typeof dados.capa === "string") pasta.capa = dados.capa;
    }
    this.gravar();
    return pasta;
  },

  apagarPasta(id) {
    const num = Number(id);
    this.estado.pastas = this.estado.pastas.filter((p) => p.id !== num);
    this.estado.musicas.forEach((m) => {
      const pastas = this.idsPastasDaMusica(m).filter((pastaId) => pastaId !== num);
      m.pasta_ids = pastas;
      m.pasta_id = pastas[0] || null;
    });
    this.gravar();
  },

  idsPastasDaMusica(musica) {
    const ids = Array.isArray(musica.pasta_ids) ? musica.pasta_ids : [musica.pasta_id];
    return [...new Set(ids.map(Number).filter((id) => Number.isInteger(id) && id > 0))];
  },

  listarMusicas({ busca = "", pasta_id = null, apenasFixadas = false } = {}) {
    const termo = busca.trim().toLowerCase();
    return this.estado.musicas
      .filter((m) => {
        if (apenasFixadas && !m.is_fixada) return false;
        const idsPastas = this.idsPastasDaMusica(m);
        if (pasta_id && !idsPastas.includes(Number(pasta_id))) return false;
        if (!termo) return true;
        const nomesPastas = idsPastas.map((id) => this.obterPasta(id)?.nome || "");
        return [m.titulo, m.autor, ...nomesPastas].join(" ").toLowerCase().includes(termo);
      })
      .sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));
  },

  adicionarMusicasNaPasta(pastaId, musicasIds) {
    const pasta = this.obterPasta(pastaId);
    if (!pasta) return 0;
    let adicionadas = 0;
    musicasIds.map(Number).forEach((musicaId) => {
      const musica = this.obterMusica(musicaId);
      if (!musica) return;
      const pastas = this.idsPastasDaMusica(musica);
      if (!pastas.includes(pasta.id)) {
        pastas.push(pasta.id);
        adicionadas += 1;
      }
      musica.pasta_ids = pastas;
      musica.pasta_id = musica.pasta_id || pasta.id;
    });
    this.gravar();
    return adicionadas;
  },

  removerMusicaDaPasta(pastaId, musicaId) {
    const musica = this.obterMusica(musicaId);
    if (!musica) return false;
    const pastas = this.idsPastasDaMusica(musica).filter((id) => id !== Number(pastaId));
    musica.pasta_ids = pastas;
    musica.pasta_id = pastas[0] || null;
    this.gravar();
    return true;
  },

  obterMusica(id) {
    return this.estado.musicas.find((m) => m.id === Number(id)) || null;
  },

  salvarMusica(dados) {
    const existente = dados.id ? this.obterMusica(dados.id) : null;
    const pastaEscolhida = dados.pasta_id ? Number(dados.pasta_id) : null;
    const pastas = Array.isArray(dados.pasta_ids)
      ? dados.pasta_ids.map(Number).filter((id) => id > 0)
      : [
          ...(pastaEscolhida ? [pastaEscolhida] : []),
          ...this.idsPastasDaMusica(existente || {}).filter(
            (id) => id !== Number(existente && existente.pasta_id) && id !== pastaEscolhida
          ),
        ];
    const pastasUnicas = [...new Set(pastas)];
    const payload = {
      pasta_id: pastasUnicas[0] || null,
      pasta_ids: pastasUnicas,
      titulo: String(dados.titulo || "").trim(),
      autor: String(dados.autor || "").trim(),
      tom_original: String(dados.tom_original || "C").trim() || "C",
      corpo_cifra: String(dados.corpo_cifra || ""),
      is_fixada: Boolean(dados.is_fixada),
      atualizado_em: this._agora(),
    };

    if (dados.id) {
      const atual = this.obterMusica(dados.id);
      if (!atual) return null;
      Object.assign(atual, payload);
      this.gravar();
      return atual;
    }

    const nova = { id: this._id("musicas"), ...payload };
    this.estado.musicas.push(nova);
    this.gravar();
    return nova;
  },

  alternarFavorita(id) {
    const musica = this.obterMusica(id);
    if (!musica) return null;
    musica.is_fixada = !musica.is_fixada;
    musica.atualizado_em = this._agora();
    this.gravar();
    return musica;
  },

  apagarMusica(id) {
    const num = Number(id);
    this.estado.musicas = this.estado.musicas.filter((m) => m.id !== num);
    this.estado.itens_celebracao.forEach((item) => {
      if (item.musica_id === num) item.musica_id = null;
    });
    this.gravar();
  },

  listarCelebracoes() {
    return this.estado.celebracoes.slice().sort((a, b) => {
      return String(b.atualizado_em).localeCompare(String(a.atualizado_em));
    });
  },

  obterCelebracao(id) {
    return this.estado.celebracoes.find((c) => c.id === Number(id)) || null;
  },

  salvarCelebracao(dados) {
    const payload = {
      titulo: String(dados.titulo || "").trim(),
      data_evento: dados.data_evento || this._agora().slice(0, 10),
      local: String(dados.local || "").trim(),
      atualizado_em: this._agora(),
    };

    if (dados.id) {
      const atual = this.obterCelebracao(dados.id);
      if (!atual) return null;
      Object.assign(atual, payload);
      this.gravar();
      return atual;
    }

    const nova = { id: this._id("celebracoes"), ...payload };
    this.estado.celebracoes.push(nova);
    this.gravar();
    return nova;
  },

  clonarCelebracao(id) {
    const original = this.obterCelebracao(id);
    if (!original) return null;
    const copia = this.salvarCelebracao({
      titulo: `${original.titulo} (cópia)`,
      data_evento: original.data_evento,
      local: original.local || "",
    });
    this.listarItens(original.id).forEach((item) => {
      this.salvarItem({
        celebracao_id: copia.id,
        posicao_ordem: item.posicao_ordem,
        nome_momento: item.nome_momento,
        musica_id: item.musica_id,
        nota_adicional: item.nota_adicional,
      });
    });
    return copia;
  },

  listarLembretes() {
    return this.estado.lembretes.slice().sort((a, b) => {
      const porData = String(a.data_evento).localeCompare(String(b.data_evento));
      return porData || a.titulo.localeCompare(b.titulo, "pt-BR");
    });
  },

  obterLembrete(id) {
    return this.estado.lembretes.find((lembrete) => lembrete.id === Number(id)) || null;
  },

  salvarLembrete(dados) {
    const payload = {
      titulo: String(dados.titulo || "").trim(),
      descricao: String(dados.descricao || "").trim(),
      data_evento: String(dados.data_evento || "").trim(),
      atualizado_em: this._agora(),
    };

    if (dados.id) {
      const atual = this.obterLembrete(dados.id);
      if (!atual) return null;
      Object.assign(atual, payload);
      this.gravar();
      return atual;
    }

    const novo = { id: this._id("lembretes"), ...payload };
    this.estado.lembretes.push(novo);
    this.gravar();
    return novo;
  },

  apagarLembrete(id) {
    const num = Number(id);
    this.estado.lembretes = this.estado.lembretes.filter((lembrete) => lembrete.id !== num);
    this.gravar();
  },

  tocarCelebracao(id) {
    const celebracao = this.obterCelebracao(id);
    if (!celebracao) return null;
    celebracao.atualizado_em = this._agora();
    this.gravar();
    return celebracao;
  },

  apagarCelebracao(id) {
    const num = Number(id);
    this.estado.celebracoes = this.estado.celebracoes.filter((c) => c.id !== num);
    this.estado.itens_celebracao = this.estado.itens_celebracao.filter((i) => i.celebracao_id !== num);
    this.gravar();
  },

  listarItens(celebracaoId) {
    return this.estado.itens_celebracao
      .filter((i) => i.celebracao_id === Number(celebracaoId))
      .sort((a, b) => a.posicao_ordem - b.posicao_ordem);
  },

  salvarItem(dados) {
    const payload = {
      celebracao_id: Number(dados.celebracao_id),
      posicao_ordem: Number(dados.posicao_ordem) || 1,
      nome_momento: String(dados.nome_momento || "").trim(),
      musica_id: dados.musica_id ? Number(dados.musica_id) : null,
      nota_adicional: String(dados.nota_adicional || ""),
    };

    if (dados.id) {
      const atual = this.estado.itens_celebracao.find((i) => i.id === Number(dados.id));
      if (!atual) return null;
      Object.assign(atual, payload);
      this.tocarCelebracao(payload.celebracao_id);
      this.gravar();
      return atual;
    }

    const novo = { id: this._id("itens_celebracao"), ...payload };
    this.estado.itens_celebracao.push(novo);
    this.tocarCelebracao(payload.celebracao_id);
    this.gravar();
    return novo;
  },

  apagarItem(id) {
    const item = this.estado.itens_celebracao.find((i) => i.id === Number(id));
    this.estado.itens_celebracao = this.estado.itens_celebracao.filter((i) => i.id !== Number(id));
    if (item) this.tocarCelebracao(item.celebracao_id);
    this.gravar();
  },

  reordenarItens(celebracaoId, ids) {
    ids.forEach((id, indice) => {
      const item = this.estado.itens_celebracao.find((i) => i.id === Number(id));
      if (item && item.celebracao_id === Number(celebracaoId)) {
        item.posicao_ordem = indice + 1;
      }
    });
    this.tocarCelebracao(celebracaoId);
    this.gravar();
  },

  _seed() {
    this.estado.sequencias = { pastas: 1, musicas: 1, celebracoes: 1, itens_celebracao: 1, lembretes: 1 };
    this.estado.pastas = [];
    this.estado.musicas = [];
    this.estado.celebracoes = [];
    this.estado.itens_celebracao = [];
    this.estado.lembretes = [];
  },

  _removerDadosDemonstracao() {
    const musicasDemo = [
      {
        id: 1,
        pasta_id: 1,
        titulo: "Vocações",
        autor: "Pe. Zezinho",
        tom_original: "G",
        corpo_cifra: "G                D\nSenhor, que as vocações\nC               G\nsejam um sinal do teu amor",
      },
      {
        id: 2,
        pasta_id: 1,
        titulo: "A Barca",
        autor: "Cesáreo Gabaráin",
        tom_original: "D",
        corpo_cifra: "D           A\nTu tens palavras\nG              D\nde vida eterna, Senhor",
      },
      {
        id: 3,
        pasta_id: 2,
        titulo: "exemplo",
        autor: "Artista",
        tom_original: "C",
        corpo_cifra: "C   G   Am  F\nExemplo de cifra local",
      },
      {
        id: 4,
        pasta_id: 3,
        titulo: "Nome m",
        autor: "Autor",
        tom_original: "A",
        corpo_cifra: "A  D  E\nNome da música",
      },
    ];
    const idsMusicasRemovidas = new Set(
      musicasDemo
        .filter((demo) =>
          this.estado.musicas.some((musica) =>
            musica.id === demo.id &&
            this.idsPastasDaMusica(musica).includes(demo.pasta_id) &&
            musica.titulo === demo.titulo &&
            musica.autor === demo.autor &&
            musica.tom_original === demo.tom_original &&
            musica.is_fixada === true &&
            musica.corpo_cifra === demo.corpo_cifra
          )
        )
        .map((demo) => demo.id)
    );

    const celebracoesDemo = [
      {
        id: 1,
        titulo: "Celebração 1",
        itens: [
          { id: 1, posicao_ordem: 1, nome_momento: "Entrada", musica_id: 2, nota_adicional: "" },
          { id: 2, posicao_ordem: 2, nome_momento: "Entrada da Bíblia", musica_id: 1, nota_adicional: "Após o sino" },
        ],
      },
      {
        id: 2,
        titulo: "casamento",
        itens: [
          { id: 3, posicao_ordem: 1, nome_momento: "Entrada", musica_id: 3, nota_adicional: "" },
        ],
      },
      {
        id: 3,
        titulo: "Funeral",
        itens: [
          { id: 4, posicao_ordem: 1, nome_momento: "Comunhão", musica_id: 1, nota_adicional: "" },
        ],
      },
    ];
    const idsCelebracoesRemovidas = new Set(
      celebracoesDemo
        .filter((demo) =>
          this.estado.celebracoes.some((celebracao) => {
            if (
              celebracao.id !== demo.id ||
              celebracao.titulo !== demo.titulo ||
              !celebracao.atualizado_em ||
              !String(celebracao.atualizado_em).startsWith(celebracao.data_evento)
            ) {
              return false;
            }
            const itens = this.estado.itens_celebracao
              .filter((item) => item.celebracao_id === demo.id)
              .sort((a, b) => a.id - b.id);
            return (
              itens.length === demo.itens.length &&
              demo.itens.every((esperado, indice) => {
                const item = itens[indice];
                return (
                  item.id === esperado.id &&
                  item.posicao_ordem === esperado.posicao_ordem &&
                  item.nome_momento === esperado.nome_momento &&
                  item.musica_id === esperado.musica_id &&
                  item.nota_adicional === esperado.nota_adicional
                );
              })
            );
          })
        )
        .map((demo) => demo.id)
    );
    this.estado.celebracoes = this.estado.celebracoes.filter(
      (celebracao) => !idsCelebracoesRemovidas.has(celebracao.id)
    );
    this.estado.itens_celebracao = this.estado.itens_celebracao.filter(
      (item) => !idsCelebracoesRemovidas.has(item.celebracao_id)
    );
    this.estado.musicas = this.estado.musicas.filter(
      (musica) => !idsMusicasRemovidas.has(musica.id)
    );
    this.estado.itens_celebracao.forEach((item) => {
      if (idsMusicasRemovidas.has(item.musica_id)) item.musica_id = null;
    });

    const pastasDemo = [
      { id: 1, nome: "Religioso" },
      { id: 2, nome: "Pop" },
      { id: 3, nome: "Sertanejo" },
      { id: 4, nome: "Internacional" },
    ];
    this.estado.pastas = this.estado.pastas.filter(
      (pasta) =>
        !pastasDemo.some(
          (demo) =>
            demo.id === pasta.id &&
            demo.nome === pasta.nome &&
            !this.estado.musicas.some((musica) => this.idsPastasDaMusica(musica).includes(pasta.id))
        )
    );
  },
};
