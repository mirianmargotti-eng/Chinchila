# Estrutura do Banco de Dados Local (SQLite/FlutterFlow)

Para garantir o funcionamento off-line e a nova organização flexível, o esquema de dados é relacional, indexado localmente e expandido para suportar pastas e momentos dinâmicos.

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
