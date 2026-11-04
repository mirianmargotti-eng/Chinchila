CREATE TABLE itens_repertorio (
item_repertorio_id INTEGER PRIMARY KEY AUTOINCREMENT,
repertorio_id INTEGER NOT NULL,
posicao_ordem INTEGER NOT NULL,
nome_momento TEXT,
    musica_id INTEGER,
nota_adicional TEXT,
data_criacao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT uk_itens_repertorio_posicao UNIQUE (repertorio_id, posicao_ordem),
CONSTRAINT fk_itens_repertorio_repertorios
    FOREIGN KEY (repertorio_id) REFERENCES repertorios (repertorio_id) ON DELETE CASCADE,
CONSTRAINT fk_itens_repertorio_musicas
    FOREIGN KEY (musica_id) REFERENCES musicas (musica_id) ON DELETE SET NULL
);