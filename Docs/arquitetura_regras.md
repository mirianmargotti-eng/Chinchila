# Arquitetura e Regras de Negócio - Chinchila

Este documento descreve a estratégia de conectividade do aplicativo Chinchila, regras de interface e as permissões de ações com e sem internet.

## 🌍 Estratégia Off-line First
O aplicativo armazena toda a estrutura de dados essencial diretamente no armazenamento interno do dispositivo. O servidor em nuvem serve prioritariamente para backup opcional, sincronização entre dispositivos e importações externas. A estabilidade e a velocidade local são prioridades absolutas.

---

## 🌓 Modos de Visualização e Interface
*   **Tema Padrão:** Modo Claro (otimizado para leitura simples e rápida).
*   **Alternância de Tema:** Através de um botão leve, pequeno e discreto contendo apenas os símbolos gráficos do sol e da lua.
*   **Foco na Usabilidade:** Interface extremamente simples na camada principal para utilizadores com dificuldades tecnológicas, escondendo configurações avançadas em menus secundários.

---

## 🔐 Matriz de Ações por Conectividade

### 🟢 Modo On-line (Em Casa / Preparação)
Fase destinada à alimentação do acervo de músicas e planeamento estruturado.
*   **Importação por Link:** Busca e estruturação automática de cifras de portais externos (ex: Cifra Club).
*   **Cadastro Manual Avançado:** Digitação de letras longas e upload de arquivos.
*   **Sincronização:** Atualização e salvamento do acervo local com a nuvem.

### 🔴 Modo Off-line (No Evento / Execução)
Fase de foco total na estabilidade, velocidade e ajustes rápidos de última hora.
*   **Flexibilidade de Roteiros:** Nenhuma celebração ou roteiro é finalizado de forma permanente. O utilizador pode alterar, trocar músicas no roteiro ou reutilizar um modelo antigo a qualquer momento.
*   **Transposição de Tom:** Cálculo matemático em tempo real para subir ou descer o tom da cifra na tela.
*   **Edição de Notas Rápidas:** Inclusão ou alteração de pequenas observações textuais na cifra (ex: *Repetir refrão 2x*).
*   **Bloqueio de Cadastros Longos:** Criação de músicas complexas via link ou uploads fica desabilitada em modo off-line para evitar falhas locais sem validação de rede.
