CREATE TABLE configuracao_usuarios (
    configuracao_usuario_id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL UNIQUE,
    tema_padrao INTEGER NOT NULL DEFAULT 0 CHECK (tema_padrao IN (0, 1)),
    fonte_texto TEXT NOT NULL DEFAULT 'chinchila'
        CHECK (fonte_texto IN ('chinchila', 'arial', 'times_new_roman')),
    data_criacao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_configuracao_usuarios_usuarios
        FOREIGN KEY (usuario_id) REFERENCES usuarios (usuario_id) ON DELETE CASCADE
);