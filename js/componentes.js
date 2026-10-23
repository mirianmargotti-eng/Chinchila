/* Funções que desenham os cards e listas na tela */

const Componentes = {
  desenharTela(nome) {
    const secao = document.createElement("section");
    secao.className = "tela";
    secao.dataset.tela = nome;

    const titulo = document.createElement("h1");
    titulo.textContent = "Chinchila";
    secao.appendChild(titulo);

    return secao;
  },

  desenharCard(titulo, descricao) {
    const card = document.createElement("article");
    card.className = "card";

    const h2 = document.createElement("h2");
    h2.textContent = titulo;
    card.appendChild(h2);

    if (descricao) {
      const p = document.createElement("p");
      p.textContent = descricao;
      card.appendChild(p);
    }

    return card;
  },

  desenharLista(itens) {
    const lista = document.createElement("ul");
    lista.className = "lista";

    itens.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      lista.appendChild(li);
    });

    return lista;
  },
};
