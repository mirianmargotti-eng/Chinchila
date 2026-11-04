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
const VERSAO_BANCO = 2;
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
];

class DatabaseService {
  constructor() {
    this.sqliteConnection = null;
    this.db = null;
    this.initializationPromise = null;
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
    return this.db.run(sql, valores);
  }

  async executarTransacao(operacao) {
    this._verificarConexao();
    if (typeof operacao !== 'function') {
      throw new TypeError('A transação precisa receber uma função.');
    }

    await this.db.beginTransaction();
    try {
      const resultado = await operacao(this);
      await this.db.commitTransaction();
      return resultado;
    } catch (error) {
      try {
        await this.db.rollbackTransaction();
      } catch (erroRollback) {
        throw new AggregateError(
          [error, erroRollback],
          'A operação e o rollback da transação falharam.'
        );
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
}

export const dbService = new DatabaseService();
