Object.assign(App, {
  alternarRolagem() {
    if (this.rolagemAtiva) {
      this.pararRolagem();
      return;
    }
    const area = document.querySelector(".palco-scroll-area");
    if (!area) return;
    this.rolagemAtiva = true;
    this.atualizarControlesPalco();
    this.rolagemIntervalo = window.setInterval(() => {
      const scrollArea = document.querySelector(".palco-scroll-area");
      if (!scrollArea) {
        this.pararRolagem();
        return;
      }
      scrollArea.scrollTop += this.rolagemVelocidade;
      if (scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight) {
        this.pararRolagem();
      }
    }, 50);
  },

  pararRolagem() {
    this.rolagemAtiva = false;
    if (this.rolagemIntervalo !== null) {
      window.clearInterval(this.rolagemIntervalo);
      this.rolagemIntervalo = null;
    }
    this.atualizarControlesPalco();
  },

  atualizarControlesPalco() {
    const botao = document.querySelector('[data-acao="alternar-rolagem"]');
    if (botao) {
      botao.innerHTML = `${Componentes.icone(this.rolagemAtiva ? "pause" : "play")}<span>${this.rolagemAtiva ? "Pausar rolagem" : "Iniciar rolagem"}</span>`;
      botao.classList.toggle("rolagem-ativa", this.rolagemAtiva);
    }
    const velocidade = document.querySelector(".palco-velocidade");
    if (velocidade) velocidade.textContent = `${this.rolagemVelocidade}×`;
    const tamanhoFonte = document.querySelector(".palco-fonte-tamanho");
    if (tamanhoFonte) tamanhoFonte.textContent = `${this.tamanhoFontePalco}px`;
    const cifra = document.querySelector(".palco-cifra");
    if (cifra) cifra.style.fontSize = `${this.tamanhoFontePalco}px`;
  },

  iniciarArrastoMomento(evento) {
    const alca = evento.target.closest(".momento-arrastar");
    if (!alca || !evento.isPrimary) return;
    const card = alca.closest(".momento-card");
    evento.preventDefault();
    this.arrastoPonteiro = {
      id: Number(card.dataset.itemId),
      pointerId: evento.pointerId,
      x: evento.clientX,
      y: evento.clientY,
      ativo: false,
    };
    if (alca.setPointerCapture) alca.setPointerCapture(evento.pointerId);
  },

  moverArrastoMomento(evento) {
    const arrasto = this.arrastoPonteiro;
    if (!arrasto || arrasto.pointerId !== evento.pointerId) return;
    if (!arrasto.ativo && Math.hypot(evento.clientX - arrasto.x, evento.clientY - arrasto.y) < 6) return;
    arrasto.ativo = true;
    evento.preventDefault();
    document.querySelectorAll(".momento-arrastando").forEach((origem) => origem.classList.remove("momento-arrastando"));
    document.querySelectorAll(".momento-alvo-arrasto").forEach((alvo) => alvo.classList.remove("momento-alvo-arrasto"));
    document.querySelector(`.momento-card[data-item-id="${arrasto.id}"]`)?.classList.add("momento-arrastando");
    document.elementFromPoint(evento.clientX, evento.clientY)?.closest(".momento-card")?.classList.add("momento-alvo-arrasto");
  },

  finalizarArrastoMomento(evento) {
    const arrasto = this.arrastoPonteiro;
    if (!arrasto || arrasto.pointerId !== evento.pointerId) return;
    const destino = arrasto.ativo
      ? document.elementFromPoint(evento.clientX, evento.clientY)?.closest(".momento-card")
      : null;
    this.arrastoPonteiro = null;
    if (destino) this.reordenarMomentos(arrasto.id, Number(destino.dataset.itemId));
    this.limparArrastoMomentos();
  },

  reordenarMomentos(idOrigem, idDestino) {
    const itens = Banco.listarItens(this.params.id);
    const ids = itens.map((item) => item.id);
    const origem = ids.indexOf(idOrigem);
    const destino = ids.indexOf(idDestino);
    if (origem !== -1 && destino !== -1 && origem !== destino) {
      ids.splice(destino, 0, ids.splice(origem, 1)[0]);
      Banco.reordenarItens(this.params.id, ids);
      this.renderizar();
    }
  },

  limparArrastoMomentos() {
    this.arrastoPonteiro = null;
    document.querySelectorAll(".momento-arrastando, .momento-alvo-arrasto").forEach((card) => {
      card.classList.remove("momento-arrastando", "momento-alvo-arrasto");
    });
  },
});
