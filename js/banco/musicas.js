Object.assign(Banco, {
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
});
