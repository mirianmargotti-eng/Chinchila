Object.assign(App, {
  dataISO(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  },

  dataHojeISO() {
    return this.dataISO(new Date());
  },

  proximosSeteDias(registros) {
    const inicio = this.dataHojeISO();
    const fim = new Date();
    fim.setDate(fim.getDate() + 7);
    const limite = this.dataISO(fim);
    return registros
      .filter((registro) => registro.data_evento >= inicio && registro.data_evento <= limite)
      .sort((a, b) => a.data_evento.localeCompare(b.data_evento));
  },

  diasDoMesAgenda() {
    const primeiroDia = new Date(this.agendaMes.getFullYear(), this.agendaMes.getMonth(), 1);
    const deslocamento = (primeiroDia.getDay() + 6) % 7;
    const inicio = new Date(primeiroDia);
    inicio.setDate(primeiroDia.getDate() - deslocamento);
    const repertoriosPorData = new Map();
    const lembretesPorData = new Map();

    Banco.listarCelebracoes().forEach((repertorio) => {
      if (!repertoriosPorData.has(repertorio.data_evento)) repertoriosPorData.set(repertorio.data_evento, []);
      repertoriosPorData.get(repertorio.data_evento).push(repertorio);
    });
    Banco.listarLembretes().forEach((lembrete) => {
      if (!lembretesPorData.has(lembrete.data_evento)) lembretesPorData.set(lembrete.data_evento, []);
      lembretesPorData.get(lembrete.data_evento).push(lembrete);
    });

    return Array.from({ length: 42 }, (_, indice) => {
      const data = new Date(inicio);
      data.setDate(inicio.getDate() + indice);
      const chave = this.dataISO(data);
      return {
        data: chave,
        numero: data.getDate(),
        noMes: data.getMonth() === this.agendaMes.getMonth(),
        hoje: chave === this.dataHojeISO(),
        repertorios: repertoriosPorData.get(chave) || [],
        lembretes: lembretesPorData.get(chave) || [],
      };
    });
  },
});
