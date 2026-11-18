import { dbService } from './banco/DataBaseService.js';

window.dbService = dbService;

async function iniciarAplicacao() {
  try {
    await Banco.iniciar();
    App.iniciar();
  } catch (error) {
    document.getElementById('app').innerHTML = `
      <main style="padding: 2rem; max-width: 42rem; margin: 0 auto;">
        <h1>Não foi possível iniciar o Chinchila</h1>
        <p>O banco local não pôde ser aberto.</p>
        <pre>${String(error && error.message ? error.message : error)}</pre>
      </main>
    `;
  }
}

document.addEventListener('DOMContentLoaded', iniciarAplicacao);
