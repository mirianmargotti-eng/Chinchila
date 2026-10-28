/* Operações de dados: configuracoes. */

Object.assign(Banco, {
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
});
