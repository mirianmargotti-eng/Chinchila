# Arquitetura e Regras de Negócio

Este documento descreve a estratégia de conectividade do aplicativo e as permissões de ações com e sem internet.

## 🌍 Estratégia Off-line First
O aplicativo armazena toda a estrutura de dados essencial diretamente no armazenamento interno do dispositivo. O servidor em nuvem (quando ativo) serve prioritariamente para backup, sincronização entre dispositivos e importações externas.

---

## 🔐 Matriz de Ações por Conectividade

### 🟢 Modo On-line (Em Casa / Preparação)
Fase destinada à alimentação pesada do banco de dados e planejamento estruturado.
*   **Importação por Link:** Busca e estruturação de cifras de portais externos (ex: Cifra Club).
*   **Cadastro Manual Avançado:** Digitação de letras longas e upload de arquivos.
*   **Sincronização:** Atualização do acervo local com a nuvem.

### 🔴 Modo Off-line (Na Igreja / Execução)
Fase de foco total na estabilidade, velocidade e ajustes rápidos de última hora.
*   **Troca de Músicas no Roteiro:** Substituição instantânea de uma música por outra já existente no acervo local.
*   **Transposição de Tom:** Cálculo matemático em tempo real para subir ou descer o tom da cifra na tela.
*   **Edição de Notas Rápidas:** Inclusão ou alteração de pequenas observações textuais na cifra (ex: *Repetir refrão 2x*).
*   **Bloqueio de Cadastros Longos:** Criação de músicas complexas via link ou uploads fica desabilitada para evitar corrupção de dados locais sem validação de rede.
