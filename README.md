# Chinchila - Sistema de Organização Musical 🎵

O **Chinchila** é um aplicativo focado na organização e execução de repertórios musicais, projetado especificamente para rodar de forma **Off-line First**. Inicialmente concebido para ajudar a transição de pastas físicas e livros de música para o digital de forma simples e intuitiva (ideal para utilizadores com pouca familiaridade tecnológica), o sistema expandiu-se para permitir também uma gestão flexível por pastas de géneros musicais (Pop, Sertanejo, Internacional, etc.) e roteiros totalmente editáveis para apresentações ou celebrações litúrgicas.

## 🚀 Funcionalidades Principais
*   **Aplicativo Android local-first:** A direção definida é empacotar a interface atual com Capacitor e usar SQLite local. O app deverá funcionar sem internet ou dependência de servidor; a sincronização em nuvem será opcional para compartilhar e recuperar o acervo entre dispositivos. A implementação ainda está pendente.
*   **Conta identificada por email:** O email dará acesso à conta, mas não será o armazenamento dos dados. A conta deverá manter um identificador próprio para permitir trocar o email sem perder o acervo.
*   **Organização por Pastas:** Separação limpa de músicas por géneros, categorias ou preferências para evitar misturar repertórios distintos.
*   **Módulo Música:** Biblioteca paginada, clonagem de músicas com suas cifras, importação de PDF/texto público, impressão e exportação para PDF pelo navegador.
*   **Metrônomo e instrumentos:** Metrônomo ajustável na consulta da cifra; seletor de instrumento visível como prévia para uma futura consulta específica.
*   **Roteiros Flexíveis e Reutilizáveis:** Criação de sequências de execução onde qualquer evento pode ser editado, adaptado ou duplicado para a semana seguinte.
*   **Agenda mensal:** Calendário local com repertórios vinculados às datas dos eventos, anotações e lembretes; os repertórios dos próximos sete dias aparecem no início.
*   **Momentos Customizáveis:** Blocos de execução totalmente editáveis pelo utilizador para se adaptar tanto a missas (Entrada da Bíblia) quanto a shows (Bloco Noite, Bloco Tarde).
*   **Modo Simular (Imersivo):** Interface limpa em ecrã inteiro para o momento da execução, com rolagem automática inteligente e transposição de tom.
*   **Tema Claro e Escuro:** Interface clara por padrão, com alternância para o Modo Escuro disponível nas telas principais.
*   **Acervo pessoal sem exemplos:** A primeira abertura começa sem músicas, pastas ou roteiros de demonstração. Ao atualizar uma instalação anterior, os exemplos conhecidos são removidos sem apagar os demais dados locais.
*   **Interface responsiva:** Navegação adaptada para celular e computador, mantendo as ações de músicas, pastas, repertórios e cifras conectadas ao armazenamento local.

> A importação de PDFs usa um leitor carregado sob demanda e precisa de conexão com a internet para carregar essa biblioteca. O PDF deve conter texto selecionável; OCR de páginas digitalizadas ainda não está disponível. A importação de links depende das permissões CORS do site de origem. A opção “Salvar como PDF” abre a janela de impressão do navegador, onde é possível escolher “Salvar como PDF”.

## 📁 Estrutura da Documentação
Consulte os arquivos gerados para obter os detalhes técnicos do projeto:
*   `arquitetura_regras.md`: Diretrizes de funcionamento off-line/on-line, interface e regras de negócio.
*   `estrutura_telas.md`: Mapeamento detalhado de cada tela, navegação por pastas e Modo Imersivo.
*   `banco_dados.md`: Estrutura-alvo do banco SQLite local e requisitos da sincronização entre dispositivos.

## 🧩 Organização do código
*   `js/app.js`: estado, navegação, renderização e coordenação das ações.
*   `js/app/musicas.js`: metrônomo e importação de cifras.
*   `js/app/agenda.js`: datas e montagem do calendário.
*   `js/app/pastas.js`: leitura e preparação de capas.
*   `js/app/palco.js`: rolagem, controles e reordenação no modo palco.
*   `js/app/inicializacao.js`: inicialização após o carregamento da página.
*   `js/banco.js`: estado, persistência local, migração e dados de demonstração.
*   `js/banco/configuracoes.js`: preferências e perfil.
*   `js/banco/pastas.js`: operações das pastas e vínculos com músicas.
*   `js/banco/musicas.js`: operações do acervo musical.
*   `js/banco/repertorios.js`: repertórios, momentos e ordenação.
*   `js/banco/agenda.js`: operações de lembretes.
*   `js/componentes.js`: ícones, layout, escape de texto, datas e transposição compartilhados.
*   `js/componentes/inicio.js`: painel inicial.
*   `js/componentes/agenda.js`: calendário e lembretes.
*   `js/componentes/musicas.js`: biblioteca, cadastro, importação e consulta de cifras.
*   `js/componentes/repertorios.js`: listagem, edição e simulação de repertórios.
*   `js/componentes/pastas.js`: listagem e detalhe das pastas.
*   `js/componentes/configuracoes.js`: preferências e prévia de acesso.
*   `js/componentes/palco.js`: interface de apresentação imersiva.
*   `css/styles.css`: entrada dos estilos, que importa os módulos temáticos na ordem da cascata.
*   `css/`: estilos separados para base, início, músicas, repertórios, pastas, configurações, palco, agenda, diálogos e responsividade.

O `index.html` carrega primeiro o banco e seus domínios, depois os componentes e o controlador; a inicialização fica por último para garantir que todas as funções estejam registradas.
