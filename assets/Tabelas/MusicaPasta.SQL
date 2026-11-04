CREATE TABLE musicas_pastas (
musica_pasta_id INTEGER PRIMARY KEY AUTOINCREMENT,
    pasta_id INTEGER NOT NULL,
musica_id INTEGER NOT NULL,
data_criacao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT uk_musicas_pastas UNIQUE (pasta_id, musica_id),
CONSTRAINT fk_musicas_pastas_pastas
    FOREIGN KEY (pasta_id) REFERENCES pastas (pasta_id) ON DELETE CASCADE,
CONSTRAINT fk_musicas_pastas_musicas
    FOREIGN KEY (musica_id) REFERENCES musicas (musica_id) ON DELETE CASCADE
);
