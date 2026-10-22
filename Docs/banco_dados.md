# Estrutura do Banco de Dados Local (SQLite/FlutterFlow)

Para garantir o funcionamento off-line, o esquema de dados é simples, relacional e indexado localmente.

## 1. Tabela: `musicas`
Armazena o acervo completo de canções do usuário.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Identificador único da música. |
| `titulo` | TEXT | Nome da canção. |
| `autor` | TEXT | Compositor ou intérprete (opcional). |
| `tom_original` | TEXT | Tom padrão em que a cifra foi cadastrada (ex: G, Ebm). |
| `corpo_cifra` | TEXT | Letra estruturada junto com os acordes em texto limpo. |
| `tempo_liturgico`| TEXT | Categoria de tempo (Comum, Advento, Quaresma, Páscoa, Natal). |
| `momento_padrao` | TEXT | Sugestão de momento (Entrada, Comunhão, etc.). |
| `is_fixada` | BOOLEAN | Define se a música aparece no "Modo Pânico" da Home (`0` ou `1`). |

## 2. Tabela: `celebracoes`
Armazena os cabeçalhos dos roteiros criados (ou modelos).

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Identificador único da celebração. |
| `titulo` | TEXT | Nome dado ao evento (ex: "Missa de Ramos", "Modelo: Velório"). |
| `data_evento` | TEXT | Data agendada ou de criação (YYYY-MM-DD). |
| `is_modelo` | BOOLEAN | Identifica se é um modelo reutilizável (`0` ou `1`). |

## 3. Tabela: `itens_celebracao`
Tabela associativa que define a ordem das músicas e os momentos de cada celebração.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | INTEGER (PK) | Identificador do item da linha. |
| `celebracao_id` | INTEGER (FK) | Vínculo com a tabela `celebracoes`. |
| `posicao_ordem` | INTEGER | Índice da ordem de execução (1, 2, 3...). |
| `nome_momento` | TEXT | Nome do momento litúrgico (pode ser renomeado pelo usuário). |
| `musica_id` | INTEGER (FK) | Vínculo opcional com a tabela `musicas` (pode ser nulo se o momento estiver vazio). |
| `nota_adicional` | TEXT | Observações específicas para este dia (ex: "Entrar após o sino"). |
