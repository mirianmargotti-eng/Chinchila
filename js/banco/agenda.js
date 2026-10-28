/* Operações de dados: agenda. */

Object.assign(Banco, {
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
});
