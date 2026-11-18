Object.assign(Componentes, {
  telaMusicas({ musicas, pastas, busca, pastaId, total, pagina, totalPaginas, paginaTamanho }) {
    const opcoes = [`<option value="">Todas as pastas</option>`]
      .concat(
        pastas.map(
          (pasta) =>
            `<option value="${pasta.id}" ${String(pastaId) === String(pasta.id) ? "selected" : ""}>${this.escapar(pasta.nome)}</option>`
        )
      )
      .join("");
    const inicioPagina = total ? (pagina - 1) * paginaTamanho + 1 : 0;
    const fimPagina = Math.min(pagina * paginaTamanho, total);
    const paginacao = totalPaginas > 1 ? `
      <nav class="paginacao-musicas" aria-label="Paginação das músicas">
        <button class="botao contorno" data-acao="pagina-musicas" data-delta="-1" ${pagina === 1 ? "disabled" : ""}>${this.icone("arrowLeft")} Anterior</button>
        <span>Mostrando ${inicioPagina}–${fimPagina} de ${total} músicas · Página ${pagina} de ${totalPaginas}</span>
        <button class="botao contorno" data-acao="pagina-musicas" data-delta="1" ${pagina === totalPaginas ? "disabled" : ""}>Próxima ${this.icone("chevron")}</button>
      </nav>` : "";
    const linhas = musicas
      .map((musica) => {
        return `
          <tr>
            <td><button class="botao-icone favorito-botao ${musica.is_fixada ? "favorito-ativo" : ""}" data-acao="favoritar" data-id="${musica.id}" aria-label="${musica.is_fixada ? "Remover dos favoritos" : "Adicionar aos favoritos"}" title="${musica.is_fixada ? "Remover dos favoritos" : "Adicionar aos favoritos"}">${this.icone("star")}</button></td>
            <td><button class="musica-titulo" data-acao="abrir-cifra" data-id="${musica.id}"><span class="mini-icone">${this.icone("music")}</span><span><strong>${this.escapar(musica.titulo)}</strong><small>${this.escapar(musica.tom_original || "C")}</small></span></button></td>
            <td>${this.escapar(musica.autor || "—")}</td>
            <td><span class="tom-etiqueta">${this.escapar(musica.tom_original || "C")}</span></td>
            <td>${this.escapar((Banco.idsPastasDaMusica(musica).map((id) => Banco.obterPasta(id)?.nome).filter(Boolean).join(", ")) || "Sem pasta")}</td>
            <td><div class="acoes-linha">
              <button class="botao-icone" data-acao="editar-musica" data-id="${musica.id}" aria-label="Editar ${this.escapar(musica.titulo)}" title="Editar">${this.icone("edit")}</button>
              <button class="botao-icone" data-acao="clonar-musica" data-id="${musica.id}" aria-label="Clonar ${this.escapar(musica.titulo)}" title="Clonar música">${this.icone("copy")}</button>
              <button class="botao-icone perigo" data-acao="apagar-musica" data-id="${musica.id}" aria-label="Apagar ${this.escapar(musica.titulo)}" title="Apagar">${this.icone("trash")}</button>
            </div></td>
          </tr>`;
      })
      .join("");

    return `
      <section class="filtros-linha">
        <form class="busca-form" data-acao="filtrar-musicas">
          ${this.icone("search")}
          <input name="busca" type="search" placeholder="Buscar música ou artista..." value="${this.escapar(busca)}" aria-label="Buscar música ou artista">
        </form>
        <label class="filtro-pasta"><span>Filtrar por pasta</span><select class="filtro-select" aria-label="Filtrar músicas por pasta">${opcoes}</select></label>
      </section>
      <div class="musicas-acoes-topo">
        <p>Importe uma cifra de um PDF ou de um link público.</p>
        <button class="botao contorno" data-acao="abrir-importacao-cifra">${this.icone("download")} Importar cifra</button>
      </div>
      <section class="painel tabela-painel">
        <div class="tabela-resumo"><span>${total} ${total === 1 ? "música encontrada" : "músicas encontradas"}</span><span>Seu acervo pessoal</span></div>
        ${musicas.length ? `
          <div class="tabela-scroll"><table class="tabela-musicas">
            <thead><tr><th aria-label="Favorita"></th><th>Título</th><th>Artista / autor</th><th>Tom</th><th>Pasta</th><th class="coluna-acoes">Ações</th></tr></thead>
            <tbody>${linhas}</tbody>
          </table></div>
        ` : this.estadoVazio("music", busca || pastaId ? "Nenhuma música encontrada" : "Sua biblioteca começa aqui", busca || pastaId ? "Tente mudar a busca ou o filtro de pasta." : "Adicione suas próprias músicas e cifras. Elas aparecerão nesta lista.", { acao: "nova-musica", rotulo: "Adicionar primeira música" })}
      </section>
      ${paginacao}
    `;
  },

  modalImportarCifra() {
    return `
      <div class="dialogo-fundo">
        <section class="dialogo-painel importacao-painel" role="dialog" aria-modal="true" aria-labelledby="importacao-titulo" aria-describedby="importacao-descricao">
          <div class="dialogo-icone">${this.icone("download")}</div>
          <h2 id="importacao-titulo">Importar cifra</h2>
          <p id="importacao-descricao">Escolha um PDF com texto selecionável ou informe o link público de uma página/PDF. A importação será aberta para revisão antes de salvar.</p>
          <form data-acao="importar-cifra">
            <label class="dialogo-campo"><span>Link da cifra (opcional)</span><input name="url" type="url" placeholder="https://..."></label>
            <label class="dialogo-campo"><span>Ou selecione um arquivo PDF</span><input name="arquivo" type="file" accept="application/pdf,.pdf"></label>
            <p class="importacao-nota">O site precisa permitir acesso pelo navegador. PDFs digitalizados sem texto selecionável precisam de OCR, que ainda não está disponível.</p>
            <div class="dialogo-acoes">
              <button type="button" class="botao contorno" data-acao="cancelar-importacao">Cancelar</button>
              <button type="submit" class="botao primario">Importar</button>
            </div>
          </form>
        </section>
      </div>
    `;
  },

  formularioMusica({ musica, pastas, importacao = false }) {
    const m = musica || { titulo: "", autor: "", tom_original: "C", pasta_id: "", corpo_cifra: "", is_fixada: false };
    const opcoes = [`<option value="">Sem pasta</option>`]
      .concat(
        pastas.map(
          (pasta) =>
            `<option value="${pasta.id}" ${String(m.pasta_id) === String(pasta.id) ? "selected" : ""}>${this.escapar(pasta.nome)}</option>`
        )
      )
      .join("");

    return `
      <section class="painel formulario-painel">
        <form class="formulario" data-acao="salvar-musica">
          <input type="hidden" name="id" value="${m.id || ""}">
          <div class="formulario-intro"><span class="resumo-icone azul">${this.icone("music")}</span><div><h2>Detalhes da música</h2><p>${importacao ? "Revise os dados importados e ajuste o texto da cifra antes de salvar." : "Preencha as informações que ajudam você a encontrar e tocar esta cifra."}</p></div></div>
          <div class="campos-duplos">
            <label>Título da música<input name="titulo" required maxlength="160" value="${this.escapar(m.titulo)}" placeholder="Ex.: nome da música"></label>
            <label>Artista ou autor<input name="autor" maxlength="120" value="${this.escapar(m.autor || "")}" placeholder="Quem interpreta ou compôs?"></label>
            <label>Tom original<input name="tom_original" maxlength="8" value="${this.escapar(m.tom_original || "C")}" placeholder="Ex.: C, G ou Am"></label>
            <label>Pasta<select name="pasta_id">${opcoes}</select></label>
          </div>
          <label>Cifra<textarea name="corpo_cifra" rows="16" class="cifra-editor" placeholder="Cole ou escreva a cifra aqui...">${this.escapar(m.corpo_cifra || "")}</textarea><small class="campo-ajuda">A cifra fica salva localmente neste dispositivo.</small></label>
          <label class="check-favorito"><input type="checkbox" name="is_fixada" ${m.is_fixada ? "checked" : ""}><span>${this.icone("star")} Fixar entre as favoritas</span></label>
          <div class="acoes-form">
            <button type="button" class="botao secundario" data-acao="navegar" data-tela="musicas">Cancelar</button>
            <button type="submit" class="botao primario">Salvar música</button>
          </div>
        </form>
      </section>
    `;
  },

  telaCifra({ musica, tomAtual, pastaNome, metronomoAtivo, bpm }) {
    return `
      <button class="link-botao voltar-link" data-acao="navegar" data-tela="musicas">${this.icone("arrowLeft")} Voltar às músicas</button>
      <section class="painel cifra-painel">
        <div class="cifra-topo"><span class="resumo-icone azul">${this.icone("music")}</span><div class="item-detalhe"><h2>${this.escapar(musica.titulo)}</h2><p>${this.escapar(musica.autor || "Autor não informado")} · ${this.escapar(pastaNome || "Sem pasta")}</p></div><div class="cifra-acoes-topo nao-imprimir"><button class="botao contorno" data-acao="editar-musica" data-id="${musica.id}">${this.icone("edit")} Editar</button><button class="botao contorno" data-acao="imprimir-cifra">${this.icone("printer")} Imprimir</button><button class="botao contorno" data-acao="exportar-pdf">${this.icone("download")} Salvar como PDF</button></div></div>
        <div class="cifra-ferramentas nao-imprimir">
          <div class="cifra-controles">
            <div class="tom-barra"><span>Tom da cifra</span><div><button class="botao secundario" data-acao="transpor" data-delta="-1" aria-label="Baixar tom">−</button><strong>${this.escapar(tomAtual)}</strong><button class="botao secundario" data-acao="transpor" data-delta="1" aria-label="Subir tom">+</button></div></div>
            <div class="instrumento-afinador">
              <div class="instrumento-barra"><label for="instrumento-cifra">Instrumento</label><select id="instrumento-cifra" disabled aria-describedby="instrumento-ajuda"><option selected>Violão</option><option>Ukulele</option><option>Teclado</option><option>Baixo</option></select><small id="instrumento-ajuda"></small></div>
              <div class="afinador-barra" aria-label="Afinador em breve">
                <span class="afinador-icone">${this.icone("tuner")}</span>
                <span class="afinador-texto"><strong>Afinador</strong><small>Em breve · varia conforme o instrumento</small></span>
                <span class="afinador-status">Em breve</span>
              </div>
            </div>
            <div class="metronomo">
              <label for="metronomo-bpm">${this.icone("metronome")} Metrônomo</label>
              <input id="metronomo-bpm" class="metronomo-bpm" type="number" min="40" max="240" step="1" value="${bpm}" aria-label="Batidas por minuto">
              <span>BPM</span>
              <button class="botao ${metronomoAtivo ? "secundario" : "contorno"}" data-acao="metronomo-toggle">${metronomoAtivo ? "Parar" : "Iniciar"}</button>
            </div>
          </div>
        </div>
        <pre class="cifra-corpo">${this.escapar(this.transporCifra(musica.corpo_cifra, musica.tom_original, tomAtual) || "Esta música ainda não tem cifra cadastrada.")}</pre>
      </section>
    `;
  },
});
