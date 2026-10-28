/* Recursos de aplicação: pastas. */

Object.assign(App, {
  async lerCapaPasta(arquivo) {
    if (!arquivo || !arquivo.type.startsWith("image/")) {
      throw new Error("Selecione um arquivo de imagem válido para a capa.");
    }
    if (arquivo.size > 12 * 1024 * 1024) {
      throw new Error("A imagem deve ter no máximo 12 MB.");
    }
    const origem = await new Promise((resolve, reject) => {
      const leitor = new FileReader();
      leitor.onload = () => resolve(leitor.result);
      leitor.onerror = () => reject(new Error("Não foi possível ler a imagem selecionada."));
      leitor.readAsDataURL(arquivo);
    });
    const imagem = await new Promise((resolve, reject) => {
      const elemento = new Image();
      elemento.onload = () => resolve(elemento);
      elemento.onerror = () => reject(new Error("O arquivo selecionado não contém uma imagem válida."));
      elemento.src = origem;
    });
    const escala = Math.min(1, 720 / Math.max(imagem.width, imagem.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(imagem.width * escala));
    canvas.height = Math.max(1, Math.round(imagem.height * escala));
    const contexto = canvas.getContext("2d");
    if (!contexto) throw new Error("Não foi possível preparar a imagem da capa.");
    contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  },
});
