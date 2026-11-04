CREATE TABLE musicas (
    musica_id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    autor TEXT,
    tom_original TEXT NULL,
    corpo_cifra TEXT NULL,
    is_fixada INTEGER NOT NULL DEFAULT 0 CHECK (is_fixada IN (0, 1)),
    data_criacao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);