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
| `nome` | TEXT NOT NULL | Nome descritivo da pasta; único campo obrigatório. |

## 2. Tabela: `musicas`
Armazena o acervo completo de canções do usuário.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Identificador único da música. |
| `titulo` | TEXT NOT NULL | Nome da canção; único campo obrigatório. |
| `autor` | TEXT NULL | Compositor ou intérprete (opcional). |
| `tom_original` | TEXT NULL | Tom padrão da cifra (ex: G, Ebm); opcional. |
| `corpo_cifra` | TEXT NULL | Letra e acordes; opcional, inclusive para cadastrar uma música para cifrar depois. |
| `is_fixada` | BOOLEAN NOT NULL DEFAULT 0 | Define se aparece no "Modo Pânico" da Home (`0` ou `1`); opcional no cadastro. |

## 3. Tabela: `musicas_pastas`
Tabela associativa que permite organizar a mesma música em várias pastas.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `musica_id` | INTEGER (parte da PK composta, FK) | Vínculo com `musicas`. |
| `pasta_id` | INTEGER (parte da PK composta, FK) | Vínculo com `pastas`. |

A chave primária composta (`musica_id`, `pasta_id`) evita repetir a mesma associação. A exclusão de uma pasta remove somente seus vínculos nesta tabela; não exclui as músicas. A exclusão de uma música remove seus vínculos com todas as pastas.

## 4. Tabela: `celebracoes`
Armazena os roteiros criados. Todo roteiro é dinâmico e reutilizável por padrão; o usuário pode alterar músicas da semana passada para gerar a celebração ou show de hoje.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Identificador único do roteiro/evento. |
| `titulo` | TEXT NOT NULL | Nome dado ao evento (ex: "Missa de Ramos", "Setlist Acústico Bar"); único campo obrigatório. |
| `data_evento` | DATE NULL | Data agendada ou de realização do evento; opcional. |

## 5. Tabela: `itens_celebracao`
Tabela associativa que define a ordem das músicas e os momentos customizáveis de cada evento.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Identificador do item da linha. |
| `celebracao_id` | INTEGER (FK) | Vínculo com a tabela `celebracoes`. |
| `posicao_ordem` | INTEGER | Índice da ordem de execução (1, 2, 3...). |
| `nome_momento` | TEXT | Nome do momento ou bloco (totalmente editável, ex: "Entrada da Bíblia", "Setlist Noite"). |
| `musica_id` | INTEGER (FK, NULL) | Vínculo opcional com `musicas`; a música não é obrigatória. |
| `nota_adicional` | TEXT NULL | Observações específicas para este dia (ex: "Entrar após o sino"); opcional. |

Se uma música for excluída, os itens de repertório deixam de apontar para ela (`musica_id` fica nulo), mas o momento, a ordem e as observações são preservados. Assim, excluir a música não apaga nem desestrutura o repertório.

## 6. Tabela: `lembretes`
Armazena anotações e lembretes associados a uma data da agenda. Repertórios não são duplicados nesta tabela: sua própria `data_evento` os vincula automaticamente ao calendário.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Identificador único do lembrete. |
| `titulo` | TEXT NOT NULL | Título ou anotação curta do lembrete. |
| `descricao` | TEXT NULL | Observação opcional. |
| `data_evento` | DATE NOT NULL | Data em que o lembrete aparece na agenda. |

## Campos obrigatórios

- Música: somente `titulo`.
- Pasta: somente `nome`.
- Repertório (`celebracoes`): somente `titulo`.
- O vínculo de uma música a uma pasta e a associação de uma música a um momento do repertório são opcionais.

Os demais campos da música podem ficar vazios no cadastro, permitindo registrar uma música como lembrete para completar a cifra depois.

## Buscas prioritárias

- Músicas por título e autor, no acervo geral.
- Pastas por nome e listagem de músicas associadas a uma pasta.
- Repertórios por título.

Busca dentro da letra/cifra e das observações dos momentos não faz parte do escopo prioritário definido. Os índices devem priorizar título/autor de música, nome da pasta, título do repertório e as colunas de relacionamento usadas para listar músicas por pasta ou localizar vínculos ao excluir registros. Como buscas por trecho de texto nem sempre são aceleradas por índices SQLite comuns, a estratégia de consulta deve ser validada na implementação; se necessário, avaliar uma tabela de busca textual (FTS), sem indexar letras/cifras neste escopo.

## Requisitos para a futura sincronização

- O uso e a gravação dos dados locais não podem depender da conexão ou da disponibilidade da nuvem.
- A sincronização deve permitir recuperar o acervo em outro dispositivo associado à mesma conta.
- A conta precisa ter um identificador estável, separado do email usado para entrar.
- A troca do email da mesma conta deve preservar o vínculo com os dados; a transferência para uma conta diferente deve ser uma ação explícita.
- A política para conflitos entre alterações feitas em dispositivos diferentes ainda está pendente de definição.
