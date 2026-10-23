# Estrutura de Telas do Aplicativo - Chinchila

O aplicativo é composto por quatro módulos principais de navegação, uma tela de configurações e uma interface de execução imersiva.

## 1. Tela de Início (Painel de Controle)
*   **Interruptor de Tema:** Pequeno botão discreto na barra superior com os símbolos gráficos do sol e da lua para alternar entre Modo Claro (padrão) e Modo Escuro.
*   **Botão de Ação Principal:** `[+] Novo Roteiro` (cria uma sequência de músicas em branco).
*   **Histórico Recente:** Lista das últimas celebrações ou shows criados para acesso imediato e edição contínua.
*   **🚨 Bloco de Músicas Fixadas (Modo Pânico):** 
    *   Espaço reservado na interface para músicas genéricas/coringas.
    *   Acesso com 1 toque para abrir a cifra imediatamente caso haja uma mudança repentina no repertório.

## 2. Tela de Pastas (Nova)
*   **Biblioteca de Categorias:** Lista ou grelha visual exibindo as pastas criadas pelo utilizador (ex: "Igreja da Mãe", "Pop Rock", "Sertanejo Antigo").
*   **Navegação:** Ao clicar em uma pasta, o utilizador é levado para a listagem filtrada contendo apenas as músicas pertencentes àquela categoria.

## 3. Tela de Músicas (O Grande Acervo)
*   **Lista Geral:** Exibição de todas as músicas salvas na memória local.
*   **Filtros Rápidos:** 
    *   Busca por texto (Título ou Autor).
    *   Filtro rápido por pasta ativa.
*   **Interface de Cadastro `[+]`:**
    *   *Aba Importar:* Campo para colar o link externo e extrair a cifra de forma automatizada (apenas online).
    *   *Aba Manual:* Editor de texto limpo com fonte monoespaçada (`Courier New`) para garantir que os acordes digitados fiquem alinhados com as palavras.

## 4. Tela de Configurações (Nova)
*   **Gestão de Momentos Padrão:** Permite ao utilizador registar e editar novos nomes de momentos recorrentes (ex: adicionar "Entrada da Bíblia", "Momento de Oração", "Bloco da Tarde") para estarem sempre disponíveis ao montar um roteiro.

## 5. Interface: Modo Simular (Modo Imersivo)
Interface de ecrã inteiro acionada na hora de tocar, desenhada para evitar distrações.
*   **Navegação Lateral:** Menu discreto mostrando a sequência de blocos configurada para o dia (ex: *Entrada ➔ Entrada da Bíblia ➔ Glória* ou *Bloco 1 ➔ Intervalo ➔ Bloco 2*).
*   **Painel Central:** Exibição da cifra em tamanho expandido.
*   **Barra de Controle Inferior:**
    *   `[ ⏸️ Pausar / ▶️ Iniciar ]`: Controla o andamento da leitura.
    *   `[ ➖ Velocidade ➕ ]`: Ajusta a velocidade da **Rolagem Automática** contínua.
    *   `[ Tom: - / + ]`: Altera a tonalidade dos acordes matematicamente sem fechar a cifra.
