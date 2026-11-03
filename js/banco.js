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
