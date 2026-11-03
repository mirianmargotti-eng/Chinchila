Object.assign(Banco, {
  listarRepertorios() {
    return this.estado.repertorios.slice().sort((a, b) => {
      return String(b.atualizado_em).localeCompare(String(a.atualizado_em));
    });
  },

  obterRepertorio(id) {
    return this.estado.repertorios.find((c) => c.id === Number(id)) || null;
  },

  salvarRepertorio(dados) {
    const payload = {
      titulo: String(dados.titulo || "").trim(),
      data_evento: dados.data_evento || this._agora().slice(0, 10),
      local: String(dados.local || "").trim(),
      atualizado_em: this._agora(),
    };

    if (dados.id) {
      const atual = this.obterRepertorio(dados.id);
      if (!atual) return null;
      Object.assign(atual, payload);
      this.gravar();
      return atual;
    }

    const nova = { id: this._id("repertorios"), ...payload };
    this.estado.repertorios.push(nova);
    this.gravar();
    return nova;
  },

  clonarRepertorio(id) {
    const original = this.obterRepertorio(id);
    if (!original) return null;
    const copia = this.salvarRepertorio({
      titulo: `${original.titulo} (cópia)`,
      data_evento: original.data_evento,
      local: original.local || "",
    });
    this.listarItens(original.id).forEach((item) => {
      this.salvarItem({
        repertorio_id: copia.id,
        posicao_ordem: item.posicao_ordem,
        nome_momento: item.nome_momento,
        musica_id: item.musica_id,
        nota_adicional: item.nota_adicional,
      });
    });
    return copia;
  },

  tocarRepertorio(id) {
    const repertorio = this.obterRepertorio(id);
    if (!repertorio) return null;
    repertorio.atualizado_em = this._agora();
    this.gravar();
    return repertorio;
  },

  apagarRepertorio(id) {
    const num = Number(id);
    this.estado.repertorios = this.estado.repertorios.filter((c) => c.id !== num);
    this.estado.itens_repertorio = this.estado.itens_repertorio.filter((i) => i.repertorio_id !== num);
    this.gravar();
  },

  listarItens(repertorioId) {
    return this.estado.itens_repertorio
      .filter((i) => i.repertorio_id === Number(repertorioId))
      .sort((a, b) => a.posicao_ordem - b.posicao_ordem);
  },

  salvarItem(dados) {
    const payload = {
      repertorio_id: Number(dados.repertorio_id),
      posicao_ordem: Number(dados.posicao_ordem) || 1,
      nome_momento: String(dados.nome_momento || "").trim(),
      musica_id: dados.musica_id ? Number(dados.musica_id) : null,
      nota_adicional: String(dados.nota_adicional || ""),
    };

    if (dados.id) {
      const atual = this.estado.itens_repertorio.find((i) => i.id === Number(dados.id));
      if (!atual) return null;
      Object.assign(atual, payload);
      this.tocarRepertorio(payload.repertorio_id);
      this.gravar();
      return atual;
    }

    const novo = { id: this._id("itens_repertorio"), ...payload };
    this.estado.itens_repertorio.push(novo);
    this.tocarRepertorio(payload.repertorio_id);
    this.gravar();
    return novo;
  },

  apagarItem(id) {
    const item = this.estado.itens_repertorio.find((i) => i.id === Number(id));
    this.estado.itens_repertorio = this.estado.itens_repertorio.filter((i) => i.id !== Number(id));
    if (item) this.tocarRepertorio(item.repertorio_id);
    this.gravar();
  },

  reordenarItens(repertorioId, ids) {
    ids.forEach((id, indice) => {
      const item = this.estado.itens_repertorio.find((i) => i.id === Number(id));
      if (item && item.repertorio_id === Number(repertorioId)) {
        item.posicao_ordem = indice + 1;
      }
    });
    this.tocarRepertorio(repertorioId);
    this.gravar();
  },
});
