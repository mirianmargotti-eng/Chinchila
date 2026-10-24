# Estrutura do Banco de Dados Local (SQLite)

## Decisão de arquitetura

O aplicativo Android será instalado e empacotará a interface existente usando Capacitor. O banco local do aplicativo será SQLite e manterá os dados necessários para consultar, editar e executar músicas e repertórios sem internet ou dependência de um servidor. A nuvem será opcional: servirá para sincronizar os dados entre dispositivos e recuperá-los em uma instalação nova.

O email identifica a conta, mas não armazena os dados. A conta deverá possuir um identificador interno permanente e independente do email, para que a atualização do endereço não crie uma conta vazia. Levar os dados para uma conta diferente exigirá uma transferência explícita e protegida.

Um novo dispositivo precisará de conexão e do serviço de nuvem disponível para acessar a conta e baixar o acervo; depois disso, os dados locais poderão ser usados off-line. Se o serviço deixar de existir, os dados já baixados continuarão disponíveis nos dispositivos existentes, mas a sincronização e a recuperação em novos dispositivos não estarão disponíveis. Alterações feitas off-line em mais de um dispositivo precisarão ser conciliadas na sincronização. A estratégia de resolução de conflitos e os detalhes técnicos do serviço de nuvem ainda serão definidos.

**Importante:** este é o esquema-alvo da arquitetura. O protótipo web atual ainda armazena os dados em `localStorage` (JSON sob a chave `chinchila.v1`); não há empacotamento Capacitor, implementação SQLite nem sincronização neste momento.

## Tabelas locais

## 1. Tabela: `pastas`
Permite segmentar as músicas em coleções separadas (ex: Religioso, Pop, Sertanejo, Internacional).

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Identificador único da pasta. |
| `nome` | TEXT | Nome descritivo da pasta. |

## 2. Tabela: `musicas`
Armazena o acervo completo de canções do usuário.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Identificador único da música. |
| `pasta_id` | INTEGER (FK) | Vínculo com a tabela `pastas` (pode ser nulo caso não esteja em nenhuma pasta). |
| `titulo` | TEXT | Nome da canção. |
| `autor` | TEXT | Compositor ou intérprete (opcional). |
| `tom_original` | TEXT | Tom padrão em que a cifra foi cadastrada (ex: G, Ebm). |
| `corpo_cifra` | TEXT | Letra estruturada junto com os acordes em texto limpo. |
| `is_fixada` | BOOLEAN | Define se a música aparece no "Modo Pânico" da Home (`0` ou `1`). |

## 3. Tabela: `celebracoes`
Armazena os roteiros criados. Todo roteiro é dinâmico e reutilizável por padrão; o usuário pode alterar músicas da semana passada para gerar a celebração ou show de hoje.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Identificador único do roteiro/evento. |
| `titulo` | TEXT | Nome dado ao evento (ex: "Missa de Ramos", "Setlist Acústico Bar"). |
| `data_evento` | DATE | Data agendada ou de realização do evento (pode herdar o dia de criação). |

## 4. Tabela: `itens_celebracao`
Tabela associativa que define a ordem das músicas e os momentos customizáveis de cada evento.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Identificador do item da linha. |
| `celebracao_id` | INTEGER (FK) | Vínculo com a tabela `celebracoes`. |
| `posicao_ordem` | INTEGER | Índice da ordem de execução (1, 2, 3...). |
| `nome_momento` | TEXT | Nome do momento ou bloco (totalmente editável, ex: "Entrada da Bíblia", "Setlist Noite"). |
| `musica_id` | INTEGER (FK) | Vínculo opcional com a tabela `musicas` (pode ser nulo se o momento estiver vazio). |
| `nota_adicional` | TEXT | Observações específicas para este dia (ex: "Entrar após o sino"). |

## Requisitos para a futura sincronização

- O uso e a gravação dos dados locais não podem depender da conexão ou da disponibilidade da nuvem.
- A sincronização deve permitir recuperar o acervo em outro dispositivo associado à mesma conta.
- A conta precisa ter um identificador estável, separado do email usado para entrar.
- A troca do email da mesma conta deve preservar o vínculo com os dados; a transferência para uma conta diferente deve ser uma ação explícita.
- A política para conflitos entre alterações feitas em dispositivos diferentes ainda está pendente de definição.
