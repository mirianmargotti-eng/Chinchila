# Estrutura de Telas do Aplicativo - Chinchila

O aplicativo oferece telas de início, músicas, pastas, repertórios, agenda e configurações, além de uma interface de execução imersiva.

Na barra lateral, as telas são agrupadas por área: Principal, Módulo Música (Músicas, Pastas e Repertórios), Agenda e Preferências.

## 1. Tela de Início (Painel de Controle)
*   **Interruptor de Tema:** Pequeno botão discreto na barra superior com os símbolos gráficos do sol e da lua para alternar entre Modo Claro (padrão) e Modo Escuro.
*   **Botão de Ação Principal:** `[+] Novo Roteiro` (cria uma sequência de músicas em branco).
*   **Repertórios nesta semana:** Exibe os repertórios agendados para hoje ou para os próximos sete dias, com acesso direto para edição.
*   **Lembretes próximos:** Mostra anotações agendadas para os próximos sete dias.
*   **🚨 Bloco de Músicas Fixadas (Modo Pânico):** 
    *   Espaço reservado na interface para músicas genéricas/coringas.
    *   Acesso com 1 toque para abrir a cifra imediatamente caso haja uma mudança repentina no repertório.

## 2. Tela Agenda (Nova)
*   **Calendário mensal:** Navegação entre meses, indicação do dia atual e seleção de datas.
*   **Repertórios vinculados:** A data de cada repertório aparece automaticamente na agenda e pode ser aberta para edição.
*   **Criar repertório por data:** A ação no dia selecionado abre a criação do repertório com a data já preenchida.
*   **Lembretes e anotações:** Cadastro, edição e exclusão de lembretes locais com título, data e observação. Eles ficam visíveis no dia selecionado e, quando próximos, também aparecem no início.

## 3. Tela de Pastas (Nova)
*   **Biblioteca de Categorias:** A lista geral mostra a capa, o nome e a quantidade de músicas de cada pasta.
*   **Tela própria da pasta:** Exibe capa personalizada, nome, busca das músicas vinculadas e ações para renomear ou excluir a pasta.
*   **Adicionar músicas em lote:** Uma lista simples permite pesquisar e selecionar várias músicas do acervo para adicioná-las de uma só vez. Uma música pode pertencer a mais de uma pasta.
*   **Remover música da pasta:** Desvincula a música da pasta sem apagá-la do acervo ou de outras pastas.
*   **Excluir pasta:** Remove a pasta e somente seu vínculo com as músicas, sem excluir as músicas do acervo.

## 4. Tela de Músicas (O Grande Acervo)
*   **Lista Geral:** Exibição de todas as músicas salvas na memória local.
*   **Paginação:** Exibe até 6 músicas por página para manter a lista compacta e facilitar a navegação em acervos grandes.
*   **Filtros Rápidos:** 
    *   Busca por texto no título ou autor.
    *   Filtro rápido por pasta ativa.
    *   A busca e o filtro por pasta devem refletir as associações: uma música pode aparecer em várias pastas.
*   **Exclusão de música:** Remove a música e seus vínculos com pastas e repertórios. Nos repertórios, preserva o momento, a ordem e as observações, deixando o espaço sem música associada.
*   **Clonar música:** Cria uma cópia editável com os dados e o texto integral da cifra.
*   **Importar cifra:** Aceita um PDF local ou um link público de página/PDF. A importação reconstrói o espaçamento horizontal pelos posicionamentos no PDF para manter os acordes sobre a letra. PDF escaneado exige OCR (ainda indisponível), e a importação de links depende das permissões CORS do site.
*   **Consultar cifra:** Inclui metrônomo ajustável, controle visual de instrumento e afinador em breve (com comportamento que varia conforme o instrumento), impressão e exportação para PDF pela janela de impressão do navegador. Ao transpor, o sistema altera símbolos de acorde em linhas exclusivas de acordes e acordes marcados entre colchetes; o texto da letra permanece intacto.
*   **Interface de Cadastro `[+]`:**
    *   Editor de texto limpo com fonte monoespaçada (`Courier New`) para garantir que os acordes digitados fiquem alinhados com as palavras.
    *   Após importar, o conteúdo é aberto para revisão antes de ser salvo.

## 5. Tela de Configurações (Nova)
*   **Blocos recolhíveis:** Aparência, momentos padrão, reporte de bug, cores de cifra e conta/sincronização ficam em seções independentes que abrem e fecham ao selecionar o título.
*   **Gestão de Momentos Padrão:** Permite editar uma lista (um momento por linha) que é adicionada ao criar novos repertórios. Alterações não afetam repertórios existentes.
*   **Fonte da interface:** Opções Padrão Chinchila (Inter/ sistema), Arial e Times New Roman; a fonte atual é mantida como padrão inicial.
*   **Relato de problema:** Formulário com assunto, descrição e anexo de imagem. O envio por e-mail ainda não está configurado; o formulário não transmite nem armazena relatos.
*   **Cores e leitura das cifras:** Área reservada com alternativas futuras — destacar acordes, alternar o fundo das linhas ou separar estrofes. Também registra como possibilidade um editor por blocos para não intercalar acordes e letra manualmente. Ainda não altera a exibição nem o conteúdo das músicas.

## 6. Busca de repertórios
*   **Busca por título:** A lista de repertórios pode ser filtrada pelo nome do evento ou roteiro.
*   **Local do evento:** Campo opcional para distinguir locais com nomes de repertório iguais.
*   **Clonagem:** É possível duplicar um repertório com sua data, local, momentos, músicas e observações; a cópia recebe o sufixo “(cópia)”.
*   **Edição da sequência:** Os momentos podem ser reordenados arrastando a alça do cartão. A busca de músicas filtra por título ou autor. Na edição, uma indicação não bloqueante aparece quando a mesma música está associada a mais de um momento.
*   **Escopo da busca:** A busca em letras/cifras e observações não é prioridade definida para esta versão.

## 7. Interface: Modo Simular (Modo Imersivo)
Interface de ecrã inteiro acionada na hora de tocar, desenhada para evitar distrações.
*   **Navegação Lateral:** Sequência recolhida por padrão, com um botão amarelo de comentário ao lado dos momentos que possuem observações. A sequência pode ser aberta quando necessário.
*   **Painel Central:** Exibição da cifra em uma página ampliada, com informações do momento recolhíveis.
*   **Barra de Controle Inferior:**
    *   `[ ⏸️ Pausar / ▶️ Iniciar ]`: Controla o andamento da leitura.
    *   `[ ➖ Velocidade ➕ ]`: Ajusta a velocidade da **Rolagem Automática** contínua.
    *   `[ Tom: - / + ]` e controles de fonte: ajustam a leitura sem fechar a cifra.
