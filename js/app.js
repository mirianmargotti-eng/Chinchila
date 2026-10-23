/* Gerenciador de navegação entre as telas */

const App = {
  telaAtual: "inicio",

  iniciar() {
    this.renderizar();
  },

  irPara(tela) {
    this.telaAtual = tela;
    this.renderizar();
  },

  renderizar() {
    const raiz = document.getElementById("app");
    if (!raiz) return;

    raiz.innerHTML = "";
    raiz.appendChild(Componentes.desenharTela(this.telaAtual));
  },
};

document.addEventListener("DOMContentLoaded", () => {
  Banco.iniciar();
  App.iniciar();
});
