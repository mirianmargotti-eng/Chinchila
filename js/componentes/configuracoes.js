/* Componentes da tela de configuracoes. */

Object.assign(Componentes, {
  telaConfiguracoes({ perfil, tema, momentos, fonteTexto, mensagem, blocosAbertos = [] }) {
    const temaRotulo = tema === "escuro" ? "Escuro" : "Claro";
    const momentosTexto = momentos.join("\n");
    return `
      <details class="painel configuracoes-painel configuracoes-bloco" data-bloco-config="aparencia" ${blocosAbertos.includes("aparencia") ? "open" : ""}>
        <summary class="configuracoes-bloco-titulo"><span><strong>Aparência</strong><small>Personalize o visual e os textos do Chinchila.</small></span></summary>
        <div class="preferencia-linha"><span class="preferencia-icone">${this.icone("sun")}</span><span class="item-detalhe"><strong>Aparência</strong><small>Tema atual: ${temaRotulo}</small></span><button class="botao contorno" data-acao="alternar-tema">Alternar tema</button></div>
        <label class="preferencia-fonte"><span><strong>Fonte dos textos</strong><small>Escolha a tipografia usada na interface.</small></span><select data-acao="selecionar-fonte-texto" aria-label="Fonte dos textos"><option value="padrao" ${fonteTexto === "padrao" ? "selected" : ""}>Padrão Chinchila (Inter / sistema)</option><option value="arial" ${fonteTexto === "arial" ? "selected" : ""}>Arial</option><option value="times" ${fonteTexto === "times" ? "selected" : ""}>Times New Roman</option></select></label>
        <div class="preferencia-linha"><span class="preferencia-icone">${this.icone("user")}</span><span class="item-detalhe"><strong>Perfil local</strong><small>${this.escapar(perfil.nome || "Meu perfil")}</small></span><button class="botao contorno" data-acao="editar-perfil">Editar nome</button></div>
      </details>
      <details class="painel configuracoes-painel configuracoes-bloco" data-bloco-config="momentos" ${blocosAbertos.includes("momentos") ? "open" : ""}>
        <summary class="configuracoes-bloco-titulo"><span><strong>Momentos padrão</strong><small>Defina a sequência inicial dos novos repertórios.</small></span></summary>
        <form class="formulario formulario-momentos-padrao" data-acao="salvar-momentos-padrao">
          <label for="momentos-padrao-config">Sequência inicial de momentos</label>
          <textarea id="momentos-padrao-config" name="momentos" rows="8" placeholder="Entrada&#10;Ofertório&#10;Comunhão&#10;Final">${this.escapar(momentosTexto)}</textarea>
          <small class="campo-ajuda">Deixe uma linha vazia para remover um momento. Essa alteração não modifica repertórios existentes.</small>
          <button type="submit" class="botao primario">Salvar momentos padrão</button>
          ${mensagem ? `<p class="configuracoes-mensagem" role="status">${this.escapar(mensagem)}</p>` : ""}
        </form>
      </details>
      <details class="painel configuracoes-painel configuracoes-bloco" data-bloco-config="reporte" ${blocosAbertos.includes("reporte") ? "open" : ""}>
        <summary class="configuracoes-bloco-titulo"><span><strong>Reporte de bug</strong><small>Descreva o problema e anexe uma captura de tela, se quiser.</small></span></summary>
        <form class="formulario formulario-relato" data-acao="relatar-bug">
          <label>Assunto<input name="assunto" maxlength="120" placeholder="Resumo do problema"></label>
          <label>Descrição<textarea name="descricao" rows="4" placeholder="O que você esperava e o que aconteceu?"></textarea></label>
          <label>Captura de tela<input class="relato-arquivo" name="captura" type="file" accept="image/*"><small class="relato-arquivo-nome" aria-live="polite">Nenhuma imagem selecionada.</small></label>
          <p class="aviso-info">O envio por e-mail ainda não está configurado. Este formulário não envia nem armazena o relato.</p>
          <button type="button" class="botao primario" disabled>Enviar relato (em breve)</button>
        </form>
      </details>
      <details class="painel configuracoes-painel configuracoes-bloco" data-bloco-config="cores" ${blocosAbertos.includes("cores") ? "open" : ""}>
        <summary class="configuracoes-bloco-titulo"><span><strong>Cores de cifra</strong><small>Opções futuras para diferenciar partes da cifra.</small></span></summary>
        <div class="opcoes-cor-cifra">
          <article><span class="amostra-cor-cifra acordes"></span><strong>Destacar acordes</strong><small>Colorir acordes e manter a letra como está.</small></article>
          <article><span class="amostra-cor-cifra linhas"></span><strong>Alternar linhas</strong><small>Variar o fundo entre linhas para facilitar o acompanhamento.</small></article>
          <article><span class="amostra-cor-cifra estrofe"></span><strong>Separar estrofes</strong><small>Usar tons suaves para distinguir partes da música.</small></article>
          <article><span class="amostra-cor-cifra editor"></span><strong>Editor por blocos</strong><small>Separar acordes e letra durante a edição e montar a cifra sem intercalar linhas manualmente.</small></article>
        </div>
        <p class="aviso-info">Estas opções e a ideia de edição por blocos são sugestões para uma próxima etapa. Não alteram a exibição nem o conteúdo das cifras atuais.</p>
      </details>
      <details class="painel configuracoes-painel configuracoes-bloco" data-bloco-config="conta" ${blocosAbertos.includes("conta") ? "open" : ""}>
        <summary class="configuracoes-bloco-titulo"><span><strong>Conta e sincronização</strong><small>Seus dados ficam somente neste dispositivo.</small></span></summary>
        <button class="botao contorno" data-acao="navegar" data-tela="acesso">Ver prévia da tela de acesso</button>
        <p class="aviso-info">Login e sincronização ainda não estão conectados. A prévia abaixo é apenas visual e não envia seus dados.</p>
      </details>
    `;
  },

  telaAcesso() {
    return `
      <section class="acesso-preview">
        <span class="resumo-icone azul">${this.icone("music")}</span>
        <span class="sobrelinha">PRÉVIA VISUAL</span>
        <h2>Sua música em qualquer lugar</h2>
        <p>Sincronize seu repertório, cifras e momentos.</p>
        <div class="acesso-abas"><button class="ativo" type="button" disabled>Entrar</button><button type="button" disabled>Criar conta</button></div>
        <label>Nome completo<input type="text" placeholder="Seu nome" disabled></label>
        <label>E-mail<input type="email" placeholder="seuemail@exemplo.com" disabled></label>
        <label>Senha<input type="password" placeholder="••••••••" disabled></label>
        <button class="botao primario acesso-submit" type="button" disabled>Entrar</button>
        <p class="aviso-info">Autenticação ainda não disponível. Os campos estão desativados e nenhum dado será enviado.</p>
        <button class="link-botao" data-acao="navegar" data-tela="configuracoes">${this.icone("arrowLeft")} Voltar às configurações</button>
      </section>
    `;
  },
});
