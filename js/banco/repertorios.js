/* Operações de dados: repertorios. */

Object.assign(Banco, {
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
});
