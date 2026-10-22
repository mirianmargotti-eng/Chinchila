# Estrutura de Telas do Aplicativo

O aplicativo é composto por três módulos principais de navegação e uma interface de execução imersiva.

## 1. Tela de Início (Painel de Controle)
*   **Botão de Ação Principal:** `[+] Nova Celebração` (cria um roteiro em branco com os campos padrão).
*   **Histórico Recente:** Lista das últimas 3 ou 4 celebrações criadas para acesso imediato.
*   **🚨 Bloco de Músicas Fixadas (Modo Pânico):** 
    *   Espaço reservado na interface para músicas genéricas/comuns.
    *   Acesso com 1 toque para abrir a cifra imediatamente caso o padre mude o canto de surpresa.

## 2. Tela de Músicas (O Grande Acervo)
*   **Lista Geral:** Exibição de todas as centenas de músicas salvas na memória do aparelho.
*   **Filtros Rápidos:** 
    *   Busca por texto (Título ou Autor).
    *   Filtro por *Tempo Litúrgico* (Tempo Comum, Advento, Quaresma, Páscoa, Natal).
    *   Filtro por *Momento da Celebração* (Entrada, Glória, Ofertório, Comunhão, etc.).
*   **Interface de Cadastro `[+]`:**
    *   *Aba Importar:* Campo para colar o link externo e extrair a cifra.
    *   *Aba Manual:* Editor de texto limpo com fonte monoespaçada (`Courier New`) para garantir que os acordes digitados fiquem perfeitamente alinhados em cima das palavras.

## 3. Tela de Celebrações (Modelos e Histórico)
*   **Biblioteca de Roteiros:** Histórico completo de todas as celebrações salvas.
*   **Modelos Prontos:** Capacidade de criar e salvar roteiros permanentes como `Modelo: Velório / Exéquias` ou `Modelo: Casamento`.
*   **Ações da Lista:** Cada item possui os botões `✏️ Editar` (alterar músicas/ordem) e `▶️ Simular` (entrar no modo de jogo).

## 4. Interface: Modo Simular (Modo Imersivo)
Interface de tela cheia acionada na hora de tocar, desenhada para evitar distrações.
*   **Navegação Lateral:** Menu discreto mostrando a sequência litúrgica ativa:
    *   *Entrada ➔ Perdão ➔ Glória ➔ Salmo ➔ Evangelho ➔ Ofertório ➔ Comunhão ➔ Saída*
*   **Painel Central:** Exibição da cifra em tamanho expandido.
*   **Barra de Controle Inferior:**
    *   `[ ⏸️ Pausar / ▶️ Iniciar ]`: Controla o andamento da leitura.
    *   `[ ➖ Velocidade: 1x ➕ ]`: Ajusta a velocidade da **Rolagem Automática** contínua (pixel por pixel).
    *   `[ Tom: - / + ]`: Altera a tonalidade dos acordes sem sair da tela.
