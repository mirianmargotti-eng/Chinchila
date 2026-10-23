/* Lógica do banco de dados local (LocalStorage/IndexedDB) */

const Banco = {
  chave: "chinchila",

  iniciar() {
    if (!localStorage.getItem(this.chave)) {
      localStorage.setItem(this.chave, JSON.stringify({ musicas: [], roteiros: [], pastas: [] }));
    }
  },

  ler() {
    try {
      return JSON.parse(localStorage.getItem(this.chave)) || { musicas: [], roteiros: [], pastas: [] };
    } catch {
      return { musicas: [], roteiros: [], pastas: [] };
    }
  },

  gravar(dados) {
    localStorage.setItem(this.chave, JSON.stringify(dados));
  },
};
