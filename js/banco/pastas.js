/* Operações de dados: pastas. */

Object.assign(Banco, {
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
});
