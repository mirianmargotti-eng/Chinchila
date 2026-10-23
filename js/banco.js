/* Simulação das tabelas SQLite locais (LocalStorage) */

const Banco = {
  chave: "chinchila.v1",

  estado: {
    sequencias: { pastas: 1, musicas: 1, celebracoes: 1, itens_celebracao: 1 },
    pastas: [],
    musicas: [],
    celebracoes: [],
    itens_celebracao: [],
    config: {
      tema: "claro",
      perfil: { nome: "Gmail", email: "local@chinchila" },
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
      try {
        const dados = JSON.parse(salvo);
        this.estado = { ...this.estado, ...dados };
        this.estado.config = { ...this.estado.config, ...(dados.config || {}) };
        return;
      } catch {
        /* recarrega seed se o JSON estiver corrompido */
      }
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

  listarPastas() {
    return this.estado.pastas.slice().sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  },

  obterPasta(id) {
    return this.estado.pastas.find((p) => p.id === Number(id)) || null;
  },

  criarPasta(nome) {
    const pasta = { id: this._id("pastas"), nome: String(nome || "").trim() };
    this.estado.pastas.push(pasta);
    this.gravar();
    return pasta;
  },

  atualizarPasta(id, nome) {
    const pasta = this.obterPasta(id);
    if (!pasta) return null;
    pasta.nome = String(nome || "").trim();
    this.gravar();
    return pasta;
  },

  apagarPasta(id) {
    const num = Number(id);
    this.estado.pastas = this.estado.pastas.filter((p) => p.id !== num);
    this.estado.musicas.forEach((m) => {
      if (m.pasta_id === num) m.pasta_id = null;
    });
    this.gravar();
  },

  listarMusicas({ busca = "", pasta_id = null, apenasFixadas = false } = {}) {
    const termo = busca.trim().toLowerCase();
    return this.estado.musicas
      .filter((m) => {
        if (apenasFixadas && !m.is_fixada) return false;
        if (pasta_id && m.pasta_id !== Number(pasta_id)) return false;
        if (!termo) return true;
        const pasta = this.obterPasta(m.pasta_id);
        const tipo = pasta ? pasta.nome : "";
        return [m.titulo, m.autor, tipo].join(" ").toLowerCase().includes(termo);
      })
      .sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));
  },

  obterMusica(id) {
    return this.estado.musicas.find((m) => m.id === Number(id)) || null;
  },

  salvarMusica(dados) {
    const payload = {
      pasta_id: dados.pasta_id ? Number(dados.pasta_id) : null,
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
    const agora = this._agora();
    this.estado.pastas = [
      { id: 1, nome: "Religioso" },
      { id: 2, nome: "Pop" },
      { id: 3, nome: "Sertanejo" },
      { id: 4, nome: "Internacional" },
    ];
    this.estado.musicas = [
      {
        id: 1,
        pasta_id: 1,
        titulo: "Vocações",
        autor: "Pe. Zezinho",
        tom_original: "G",
        is_fixada: true,
        atualizado_em: agora,
        corpo_cifra:
          "G                D\nSenhor, que as vocações\nC               G\nsejam um sinal do teu amor",
      },
      {
        id: 2,
        pasta_id: 1,
        titulo: "A Barca",
        autor: "Cesáreo Gabaráin",
        tom_original: "D",
        is_fixada: true,
        atualizado_em: agora,
        corpo_cifra:
          "D           A\nTu tens palavras\nG              D\nde vida eterna, Senhor",
      },
      {
        id: 3,
        pasta_id: 2,
        titulo: "exemplo",
        autor: "Artista",
        tom_original: "C",
        is_fixada: true,
        atualizado_em: agora,
        corpo_cifra: "C   G   Am  F\nExemplo de cifra local",
      },
      {
        id: 4,
        pasta_id: 3,
        titulo: "Nome m",
        autor: "Autor",
        tom_original: "A",
        is_fixada: true,
        atualizado_em: agora,
        corpo_cifra: "A  D  E\nNome da música",
      },
    ];
    this.estado.celebracoes = [
      { id: 1, titulo: "Celebração 1", data_evento: agora.slice(0, 10), atualizado_em: agora },
      { id: 2, titulo: "casamento", data_evento: agora.slice(0, 10), atualizado_em: agora },
      { id: 3, titulo: "Funeral", data_evento: agora.slice(0, 10), atualizado_em: agora },
    ];
    this.estado.itens_celebracao = [
      { id: 1, celebracao_id: 1, posicao_ordem: 1, nome_momento: "Entrada", musica_id: 2, nota_adicional: "" },
      { id: 2, celebracao_id: 1, posicao_ordem: 2, nome_momento: "Entrada da Bíblia", musica_id: 1, nota_adicional: "Após o sino" },
      { id: 3, celebracao_id: 2, posicao_ordem: 1, nome_momento: "Entrada", musica_id: 3, nota_adicional: "" },
      { id: 4, celebracao_id: 3, posicao_ordem: 1, nome_momento: "Comunhão", musica_id: 1, nota_adicional: "" },
    ];
    this.estado.sequencias = { pastas: 5, musicas: 5, celebracoes: 4, itens_celebracao: 5 };
  },
};
