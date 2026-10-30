Object.assign(App, {
  atualizarControlesMetronomo() {
    const botao = document.querySelector('[data-acao="metronomo-toggle"]');
    if (botao) {
      botao.textContent = this.metronomoAtivo ? "Parar" : "Iniciar";
      botao.classList.toggle("secundario", this.metronomoAtivo);
      botao.classList.toggle("contorno", !this.metronomoAtivo);
    }
  },

  tocarBatida() {
    if (!this.audioContext) return;
    const oscilador = this.audioContext.createOscillator();
    const volume = this.audioContext.createGain();
    oscilador.frequency.value = 1000;
    volume.gain.setValueAtTime(0.14, this.audioContext.currentTime);
    volume.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.08);
    oscilador.connect(volume);
    volume.connect(this.audioContext.destination);
    oscilador.start();
    oscilador.stop(this.audioContext.currentTime + 0.08);
  },

  atualizarIntervaloMetronomo() {
    if (!this.metronomoAtivo) return;
    if (this.metronomoIntervalo !== null) window.clearInterval(this.metronomoIntervalo);
    this.metronomoIntervalo = window.setInterval(
      () => this.tocarBatida(),
      60000 / this.metronomoBpm
    );
  },

  definirMetronomoBpm(bpm) {
    this.metronomoBpm = Math.min(240, Math.max(40, Math.round(bpm)));
    this.atualizarIntervaloMetronomo();
  },

  async alternarMetronomo() {
    if (this.metronomoAtivo) {
      this.pararMetronomo();
      return;
    }
    const AudioContextDisponivel = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextDisponivel) {
      this.abrirDialogo({
        titulo: "Metrônomo indisponível",
        mensagem: "Este navegador não oferece suporte à reprodução de áudio necessária para o metrônomo.",
        confirmacao: "Entendi",
      });
      return;
    }
    try {
      this.audioContext = this.audioContext || new AudioContextDisponivel();
      await this.audioContext.resume();
      this.metronomoAtivo = true;
      this.tocarBatida();
      this.atualizarIntervaloMetronomo();
      this.atualizarControlesMetronomo();
    } catch (erro) {
      this.pararMetronomo();
      this.abrirDialogo({
        titulo: "Não foi possível iniciar o metrônomo",
        mensagem: erro.message || "O navegador não conseguiu iniciar o áudio.",
        confirmacao: "Fechar",
      });
    }
  },

  pararMetronomo() {
    this.metronomoAtivo = false;
    if (this.metronomoIntervalo !== null) {
      window.clearInterval(this.metronomoIntervalo);
      this.metronomoIntervalo = null;
    }
    if (this.audioContext && this.audioContext.state === "running") this.audioContext.suspend();
    this.atualizarControlesMetronomo();
  },

  async extrairTextoPdf(dados) {
    const versaoPdfJs = "4.10.38";
    const baseCdn = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${versaoPdfJs}`;
    let pdfjs;
    try {
      pdfjs = await import(`${baseCdn}/pdf.min.mjs`);
    } catch {
      throw new Error("Não foi possível carregar o leitor de PDF. Verifique sua conexão com a internet e tente novamente.");
    }
    pdfjs.GlobalWorkerOptions.workerSrc = `${baseCdn}/pdf.worker.min.mjs`;
    const documento = await pdfjs.getDocument({ data: new Uint8Array(dados) }).promise;
    const paginas = [];
    const colunaPdf = 11 * 72 / 96 * 0.6;

    for (let numero = 1; numero <= documento.numPages; numero += 1) {
      const pagina = await documento.getPage(numero);
      const conteudo = await pagina.getTextContent();
      const itens = conteudo.items
        .filter((item) => item.str && item.str.trim())
        .map((item) => ({
          x: item.transform[4],
          y: item.transform[5],
          texto: item.str,
        }))
        .sort((a, b) => b.y - a.y || a.x - b.x);
      const linhas = [];

      itens.forEach((item) => {
        let linha = linhas[linhas.length - 1];
        if (!linha || Math.abs(linha.y - item.y) > 2) {
          linha = { y: item.y, itens: [] };
          linhas.push(linha);
        }
        linha.itens.push(item);
      });

      const xBase = Math.min(...linhas.map((linha) => linha.itens[0].x));

      paginas.push(
        linhas
          .map((linha) => {
              let texto = "";
              let proximaColuna = 0;
              linha.itens.forEach((item, indice) => {
                const coluna = Math.max(
                  proximaColuna,
                  Math.round((item.x - xBase) / colunaPdf)
                );
                texto += " ".repeat(coluna - proximaColuna);
                texto += item.texto;
                proximaColuna = coluna + Array.from(item.texto).length;
              });
            return texto.replace(/[ \t]+$/g, "");
          })
          .join("\n")
      );
    }
    const texto = paginas.join("\n\n").replace(/^\n+|\n+$/g, "");
    if (!texto.trim()) {
      throw new Error("O PDF não contém texto selecionável. Arquivos digitalizados precisam de OCR, que ainda não está disponível.");
    }
    return texto;
  },

  async lerImportacaoCifra(url, arquivo) {
    let dados;
    let titulo = "";
    if (arquivo) {
      if (arquivo.type !== "application/pdf" && !arquivo.name.toLowerCase().endsWith(".pdf")) {
        throw new Error("Selecione um arquivo PDF para importar a cifra.");
      }
      dados = await arquivo.arrayBuffer();
      titulo = arquivo.name.replace(/\.pdf$/i, "").replace(/[_-]+/g, " ").trim();
    } else {
      let endereco;
      try {
        endereco = new URL(url);
      } catch {
        throw new Error("Informe um link válido ou selecione um arquivo PDF.");
      }
      if (!["http:", "https:"].includes(endereco.protocol)) {
        throw new Error("Use um endereço público iniciado com http:// ou https://.");
      }
      titulo = decodeURIComponent(endereco.pathname.split("/").pop() || "")
        .replace(/\.pdf$/i, "")
        .replace(/[_-]+/g, " ")
        .trim();
      let resposta;
      try {
        resposta = await fetch(endereco.href);
      } catch {
        throw new Error("Não foi possível acessar este link. O site pode bloquear importações pelo navegador (CORS).");
      }
      if (!resposta.ok) throw new Error(`O link respondeu com erro ${resposta.status}. Confira o endereço e tente novamente.`);
      const tipoConteudo = resposta.headers.get("content-type") || "";
      const possivelPdf = tipoConteudo.includes("application/pdf") || /\.pdf(?:$|[?#])/i.test(endereco.href);
      if (possivelPdf) {
        dados = await resposta.arrayBuffer();
      } else {
        const copiaResposta = resposta.clone();
        const bytes = await copiaResposta.arrayBuffer();
        const cabecalho = new TextDecoder().decode(bytes.slice(0, 5));
        if (cabecalho === "%PDF-") {
          dados = bytes;
          return { titulo, corpo_cifra: await this.extrairTextoPdf(dados) };
        }
        const html = await resposta.text();
        const documento = new DOMParser().parseFromString(html, "text/html");
        documento.querySelectorAll("script, style, noscript, nav, footer, header").forEach((item) => item.remove());
        titulo = documento.title.trim();
        const texto = (documento.body.innerText || documento.body.textContent || "").trim();
        if (!texto) throw new Error("Não encontramos texto de cifra nesta página.");
        return { titulo, corpo_cifra: texto };
      }
    }
    return { titulo, corpo_cifra: await this.extrairTextoPdf(dados) };
  },
});
