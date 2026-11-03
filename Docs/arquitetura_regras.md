# Arquitetura e Regras de Negócio - Chinchila

Este documento descreve a estratégia de conectividade do aplicativo Chinchila, regras de interface e as permissões de ações com e sem internet.

## 🌍 Estratégia local-first e funcionamento off-line
O produto final será um aplicativo Android instalável, distribuído de gratuito acesso, usando Capacitor para empacotar a interface HTML/JavaScript existente. O aplicativo não deve exigir navegador, conexão ou servidor para abrir e usar os dados que já estão no dispositivo.

SQLite no dispositivo será a fonte local de dados para músicas, pastas e roteiros. A nuvem será opcional e servirá para sincronizar e recuperar os dados em outros dispositivos, não será requisito para usar o aplicativo durante uma missa ou apresentação. Depois que os dados estiverem no dispositivo, uma queda do servidor ou da conexão não deve interromper o uso local.

Para sincronizar em um aparelho novo, será necessário ter conexão e o serviço de nuvem disponível; depois do download, o dispositivo também poderá funcionar off-line. Se o serviço de nuvem deixar de existir, os dados já guardados localmente continuarão utilizáveis, mas a sincronização e a recuperação em novos aparelhos deixarão de funcionar.

O email será usado para identificar e acessar a conta de sincronização, mas não é o local de armazenamento dos dados. A conta deve ter um identificador interno permanente, independente do endereço de email, permitindo atualizar o email sem perder o acervo. A transferência para uma conta diferente deve ser explícita e protegida.

Quando vários dispositivos fizerem alterações off-line nos mesmos dados, será necessário sincronizá-las quando a conexão voltar. A regra para resolver conflitos ainda precisa ser definida antes da implementação da sincronização.

**Estado atual do projeto:** o protótipo ainda é uma aplicação web e usa `localStorage`. O empacotamento com Capacitor, o SQLite local e a sincronização opcional são decisões de arquitetura e ainda não estão implementados.

---

## 🌓 Modos de Visualização e Interface
*   **Tema Padrão:** Modo Claro (otimizado para leitura simples e rápida).
*   **Alternância de Tema:** Através de um botão leve, pequeno e discreto contendo apenas os símbolos gráficos do sol e da lua.
*   **Foco na Usabilidade:** Interface extremamente simples na camada principal para utilizadores com dificuldades tecnológicas, escondendo configurações avançadas em menus secundários.

---

## 🔐 Matriz de Ações por Conectividade

### 🟢 Modo On-line (Em Casa / Preparação)
Fase em que recursos que dependem de conexão podem ser usados.
*   **Importação por Link:** Busca e estruturação automática de cifras de portais externos (ex: Cifra Club), quando disponível.
*   **Sincronização:** Envio e recebimento de alterações entre o banco local e a nuvem.
*   **Recuperação em novo dispositivo:** Acesso à conta e download do acervo sincronizado exigem conexão.

### 🔴 Modo Off-line (No Evento / Execução)
O banco local deve continuar disponível mesmo sem conexão ou com o servidor indisponível.
*   **Flexibilidade de Roteiros:** Nenhuma celebração ou roteiro é finalizado de forma permanente. O utilizador pode alterar, trocar músicas no roteiro ou reutilizar um modelo antigo a qualquer momento.
*   **Transposição de Tom:** Cálculo matemático em tempo real para subir ou descer o tom da cifra na tela.
*   **Edição de Notas Rápidas:** Inclusão ou alteração de pequenas observações textuais na cifra (ex: *Repetir refrão 2x*).
*   **Cadastro local:** Criação e edição manual de músicas e repertórios devem funcionar off-line e ser gravadas no dispositivo.
*   **Recursos indisponíveis sem conexão:** Importação por serviços externos e sincronização ficam pendentes até a internet voltar; isso não deve bloquear o uso dos dados locais.
