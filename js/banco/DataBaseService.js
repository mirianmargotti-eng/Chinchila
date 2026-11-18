import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { defineCustomElements } from 'jeep-sqlite/loader';

import usuariosSQL from '../../assets/Tabelas/Usuario.SQL?raw';
import configuracaoUsuariosSQL from '../../assets/Tabelas/ConfiguracaoUsuarios.SQL?raw';
import pastasSQL from '../../assets/Tabelas/CriarPasta.SQL?raw';
import musicasSQL from '../../assets/Tabelas/CriarMusica.SQL?raw';
import repertoriosSQL from '../../assets/Tabelas/CriarRepertorio.SQL?raw';
import lembretesSQL from '../../assets/Tabelas/CriarLembretes.SQL?raw';
import musicasPastasSQL from '../../assets/Tabelas/MusicaPasta.SQL?raw';
import itensRepertorioSQL from '../../assets/Tabelas/ItensRepertorio.SQL?raw';

const NOME_BANCO = 'chinchila';
const VERSAO_BANCO = 3;
const ENTIDADES_SINCRONIZAVEIS = new Set([
  'configuracao_usuarios',
  'itens_repertorio',
  'lembretes',
  'musicas',
  'musicas_pastas',
  'pastas',
  'repertorios',
  'usuarios',
]);

const MIGRACOES = [
  {
    toVersion: 1,
    statements: [
      usuariosSQL,
      configuracaoUsuariosSQL,
      pastasSQL,
      musicasSQL,
      repertoriosSQL,
      lembretesSQL,
      musicasPastasSQL,
      itensRepertorioSQL,
    ],
  },
  {
    toVersion: 2,
    statements: [
      `CREATE TABLE fila_sincronizacao (
        fila_sincronizacao_id INTEGER PRIMARY KEY AUTOINCREMENT,
        entidade TEXT NOT NULL,
        registro_id TEXT NOT NULL,
        operacao TEXT NOT NULL CHECK (operacao IN ('criar', 'atualizar', 'excluir')),
        payload TEXT,
        enfileirado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        tentativas INTEGER NOT NULL DEFAULT 0,
        ultimo_erro TEXT,
        CONSTRAINT uk_fila_sincronizacao_registro UNIQUE (entidade, registro_id)
      );`,
      `CREATE INDEX idx_fila_sincronizacao_enfileirado_em
        ON fila_sincronizacao (enfileirado_em);`,
    ],
  },
  {
    toVersion: 3,
    statements: [
      `ALTER TABLE pastas ADD COLUMN capa TEXT NOT NULL DEFAULT '';`,
      `ALTER TABLE repertorios ADD COLUMN local TEXT;`,
      `ALTER TABLE usuarios ADD COLUMN email TEXT;`,
      `ALTER TABLE configuracao_usuarios ADD COLUMN momentos_padrao TEXT;`,
    ],
  },
];

class DatabaseService {
  constructor() {
    this.sqliteConnection = null;
    this.db = null;
    this.initializationPromise = null;
    this.transacaoAtiva = false;
  }

  iniciar() {
    if (this.db) return Promise.resolve(this.db);
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = this._iniciar().catch((error) => {
      this.initializationPromise = null;
      this.sqliteConnection = null;
      this.db = null;
      throw new Error(`Falha ao inicializar o SQLite do Chinchila: ${error.message || error}`, {
        cause: error,
      });
    });

    return this.initializationPromise;
  }

  async _iniciar() {
    this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);

    if (Capacitor.getPlatform() === 'web') {
      await defineCustomElements(window);

      if (!document.querySelector('jeep-sqlite')) {
        document.body.appendChild(document.createElement('jeep-sqlite'));
      }

      await customElements.whenDefined('jeep-sqlite');
      await this.sqliteConnection.initWebStore();
    }

    await this.sqliteConnection.addUpgradeStatement(NOME_BANCO, MIGRACOES);
    this.db = await this.sqliteConnection.createConnection(
      NOME_BANCO,
      false,
      'no-encryption',
      VERSAO_BANCO,
      false
    );
    await this.db.open();

    return this.db;
  }

  _verificarConexao() {
    if (!this.db) {
      throw new Error('O banco SQLite ainda não foi inicializado. Aguarde dbService.iniciar().');
    }
  }

  async consultar(sql, valores = []) {
    this._verificarConexao();
    const resultado = await this.db.query(sql, valores);
    return resultado.values || [];
  }

  async executar(sql, valores = []) {
    this._verificarConexao();
    return this.db.run(sql, valores, !this.transacaoAtiva);
  }

  async executarTransacao(operacao) {
    this._verificarConexao();
    if (typeof operacao !== 'function') {
      throw new TypeError('A transação precisa receber uma função.');
    }

    await this.db.beginTransaction();
    this.transacaoAtiva = true;
    try {
      const resultado = await operacao(this);
      await this.db.commitTransaction();
      this.transacaoAtiva = false;
      return resultado;
    } catch (error) {
      try {
        await this.db.rollbackTransaction();
      } catch (erroRollback) {
        throw new AggregateError(
          [error, erroRollback],
          'A operação e o rollback da transação falharam.'
        );
      } finally {
        this.transacaoAtiva = false;
      }
      throw error;
    }
  }

  async listarPastas() {
    return this.consultar('SELECT * FROM pastas ORDER BY nome COLLATE NOCASE;');
  }

  async enfileirarAlteracao({ entidade, registroId, operacao, payload = null }) {
    this._verificarConexao();

    if (!ENTIDADES_SINCRONIZAVEIS.has(entidade)) {
      throw new TypeError(`Entidade não permitida para sincronização: ${entidade}`);
    }
    if (registroId == null || String(registroId).trim() === '') {
      throw new TypeError('A alteração precisa de um identificador local do registro.');
    }
    if (!['criar', 'atualizar', 'excluir'].includes(operacao)) {
      throw new TypeError(`Operação de sincronização inválida: ${operacao}`);
    }

    await this.db.run(
      `INSERT INTO fila_sincronizacao (entidade, registro_id, operacao, payload)
       VALUES (?, ?, ?, ?)
       ON CONFLICT (entidade, registro_id) DO UPDATE SET
         operacao = excluded.operacao,
         payload = excluded.payload,
         enfileirado_em = CURRENT_TIMESTAMP,
         tentativas = 0,
         ultimo_erro = NULL;`,
      [entidade, String(registroId), operacao, payload == null ? null : JSON.stringify(payload)]
    );
  }

  async listarAlteracoesPendentes(limite = 50) {
    this._verificarConexao();
    if (!Number.isInteger(limite) || limite < 1) {
      throw new RangeError('O limite da fila deve ser um inteiro positivo.');
    }

    return this.consultar(
      `SELECT * FROM fila_sincronizacao
       ORDER BY enfileirado_em, fila_sincronizacao_id
       LIMIT ?;`,
      [limite]
    );
  }

  async registrarFalhaDeSincronizacao(id, erro) {
    this._verificarConexao();
    const mensagem = erro instanceof Error ? erro.message : String(erro);
    await this.db.run(
      `UPDATE fila_sincronizacao
       SET tentativas = tentativas + 1, ultimo_erro = ?
       WHERE fila_sincronizacao_id = ?;`,
      [mensagem, id]
    );
  }

  async removerAlteracaoPendente(id) {
    this._verificarConexao();
    await this.db.run(
      'DELETE FROM fila_sincronizacao WHERE fila_sincronizacao_id = ?;',
      [id]
    );
  }

  async sincronizarEstadoCompleto(estado) {
    this._verificarConexao();

    await this.executarTransacao(async (servico) => {
      await servico.executar('DELETE FROM itens_repertorio;');
      await servico.executar('DELETE FROM musicas_pastas;');
      await servico.executar('DELETE FROM lembretes;');
      await servico.executar('DELETE FROM repertorios;');
      await servico.executar('DELETE FROM musicas;');
      await servico.executar('DELETE FROM pastas;');

      for (const pasta of estado.pastas || []) {
        await servico.executar(
          `INSERT INTO pastas (pasta_id, nome, capa)
           VALUES (?, ?, ?);`,
          [pasta.id, pasta.nome, pasta.capa || '']
        );
      }

      for (const musica of estado.musicas || []) {
        await servico.executar(
          `INSERT INTO musicas
           (musica_id, titulo, autor, tom_original, corpo_cifra, is_fixada)
           VALUES (?, ?, ?, ?, ?, ?);`,
          [
            musica.id,
            musica.titulo,
            musica.autor || null,
            musica.tom_original || null,
            musica.corpo_cifra || null,
            musica.is_fixada ? 1 : 0,
          ]
        );
        for (const pastaId of new Set(musica.pasta_ids || (musica.pasta_id ? [musica.pasta_id] : []))) {
          await servico.executar(
            `INSERT OR IGNORE INTO musicas_pastas (musica_id, pasta_id)
             VALUES (?, ?);`,
            [musica.id, Number(pastaId)]
          );
        }
      }

      for (const repertorio of estado.repertorios || []) {
        await servico.executar(
          `INSERT INTO repertorios (repertorio_id, titulo, data_evento, local)
           VALUES (?, ?, ?, ?);`,
          [
            repertorio.id,
            repertorio.titulo,
            repertorio.data_evento || null,
            repertorio.local || null,
          ]
        );
      }

      for (const item of estado.itens_repertorio || []) {
        await servico.executar(
          `INSERT INTO itens_repertorio
           (item_repertorio_id, repertorio_id, posicao_ordem, nome_momento, musica_id, nota_adicional)
           VALUES (?, ?, ?, ?, ?, ?);`,
          [
            item.id,
            item.repertorio_id,
            item.posicao_ordem,
            item.nome_momento || null,
            item.musica_id || null,
            item.nota_adicional || null,
          ]
        );
      }

      for (const lembrete of estado.lembretes || []) {
        await servico.executar(
          `INSERT INTO lembretes
           (lembrete_id, titulo, descricao, data_evento)
           VALUES (?, ?, ?, ?);`,
          [lembrete.id, lembrete.titulo, lembrete.descricao || null, lembrete.data_evento]
        );
      }

      await servico.executar(
        `INSERT OR REPLACE INTO usuarios (usuario_id, nome, email)
         VALUES (1, ?, ?);`,
        [estado.config?.perfil?.nome || 'Meu perfil', estado.config?.perfil?.email || null]
      );

      await servico.executar(
        `INSERT OR REPLACE INTO configuracao_usuarios
         (configuracao_usuario_id, usuario_id, tema_padrao, fonte_texto, momentos_padrao)
         VALUES (1, 1, ?, ?, ?);`,
        [
          estado.config?.tema === 'escuro' ? 1 : 0,
          estado.config?.fonteTexto === 'times'
            ? 'times_new_roman'
            : estado.config?.fonteTexto === 'arial'
              ? 'arial'
              : 'chinchila',
          JSON.stringify(estado.config?.momentosPadrao || []),
        ]
      );
    });
  }

  async carregarEstadoCompleto() {
    this._verificarConexao();

    const pastas = await this.consultar(
      'SELECT pasta_id AS id, nome, capa FROM pastas ORDER BY pasta_id;'
    );
    const musicas = await this.consultar(
      'SELECT musica_id AS id, titulo, autor, tom_original, corpo_cifra, is_fixada FROM musicas ORDER BY musica_id;'
    );
    const vinculos = await this.consultar(
      'SELECT musica_id, pasta_id FROM musicas_pastas ORDER BY musica_pasta_id;'
    );
    const repertorios = await this.consultar(
      'SELECT repertorio_id AS id, titulo, data_evento, local FROM repertorios ORDER BY repertorio_id;'
    );
    const itensRepertorio = await this.consultar(
      `SELECT item_repertorio_id AS id, repertorio_id, posicao_ordem,
              nome_momento, musica_id, nota_adicional
       FROM itens_repertorio ORDER BY repertorio_id, posicao_ordem;`
    );
    const lembretes = await this.consultar(
      `SELECT lembrete_id AS id, titulo, descricao, data_evento
       FROM lembretes ORDER BY data_evento, lembrete_id;`
    );
    const usuarios = await this.consultar(
      'SELECT usuario_id, nome, email FROM usuarios WHERE usuario_id = 1;'
    );
    const configuracoes = await this.consultar(
      'SELECT tema_padrao, fonte_texto, momentos_padrao FROM configuracao_usuarios WHERE usuario_id = 1;'
    );

    const estadoMusicas = musicas.map((musica) => {
      const pastaIds = vinculos
        .filter((vinculo) => vinculo.musica_id === musica.id)
        .map((vinculo) => vinculo.pasta_id);
      return {
        ...musica,
        is_fixada: Boolean(musica.is_fixada),
        pasta_ids: pastaIds,
        pasta_id: pastaIds[0] || null,
        atualizado_em: null,
      };
    });

    let config = null;
    if (configuracoes.length > 0) {
      let momentosPadrao = [];
      try {
        momentosPadrao = JSON.parse(configuracoes[0].momentos_padrao || '[]');
      } catch {
        momentosPadrao = [];
      }
      const usuario = usuarios[0] || {};
      const fonte = configuracoes[0].fonte_texto;
      config = {
        tema: configuracoes[0].tema_padrao ? 'escuro' : 'claro',
        fonteTexto: fonte === 'times_new_roman'
          ? 'times'
          : fonte === 'arial'
            ? 'arial'
            : 'padrao',
        perfil: {
          nome: usuario.nome || 'Meu perfil',
          email: usuario.email || '',
        },
        momentosPadrao,
      };
    }

    return {
      pastas,
      musicas: estadoMusicas,
      repertorios,
      itens_repertorio: itensRepertorio,
      lembretes,
      config,
    };
  }
}

export const dbService = new DatabaseService();
