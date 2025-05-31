import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Game from './game';
import { TipoAcao, TipoEvento, CargoJogador, CartaEvento } from './utils/types';
import { GAME_CONSTANTS } from './constants';

describe('Game', () => {
  let game: Game;
  let mockMathRandom: vi.SpyInstance;

  beforeEach(() => {
    game = new Game();
    mockMathRandom = vi.spyOn(Math, 'random');
    // Mockar Math.random para testes determinísticos
    mockMathRandom.mockReturnValue(0.5); // Valor padrão
  });

  afterEach(() => {
    mockMathRandom.mockRestore();
  });

  describe('Inicialização do Jogo', () => {
    it('deve instanciar o jogo corretamente', () => {
      expect(game).toBeInstanceOf(Game);
      const estadoInicial = game.getEstadoAtual();
      expect(estadoInicial.jogoAcabou).toBe(false);
      expect(estadoInicial.turnoAtual).toBe(0);
      expect(estadoInicial.trilhaFlora).toBe(GAME_CONSTANTS.MAX_TRILHA_FLORA);
    });

    it('deve iniciar o jogo com jogadores, localizações e baralhos', () => {
      const nomesJogadores = ['Alice', 'Bob'];
      game.iniciarJogo(nomesJogadores);

      const estado = game.getEstadoAtual();
      expect(estado.jogadores.length).toBe(2);
      expect(estado.localizacoes.length).toBeGreaterThan(0);
      expect(estado.turnoAtual).toBe(1);
      expect(estado.baralhoJogador.length).toBeGreaterThan(0);
      expect(estado.baralhoEvento.length).toBeGreaterThan(0);
      expect(estado.baralhoQueimada.length).toBeGreaterThan(0);
      expect(estado.jogadores[0].mao.length).toBe(GAME_CONSTANTS.CARTAS_INICIAIS_POR_JOGADOR);
      expect(estado.jogadores[0].acoesRestantes).toBe(GAME_CONSTANTS.ACOES_POR_TURNO);
    });

    it('deve distribuir queimadas iniciais corretamente', () => {
      mockMathRandom.mockReturnValue(0.1); // Garante que o mesmo estado seja sorteado para queimada inicial
      game.iniciarJogo(['Jogador1']);
      const estado = game.getEstadoAtual();

      const estadosComQueimada = estado.estadosQueimadas.filter(eq => eq.nivelQueimada > 0);
      expect(estadosComQueimada.length).toBeGreaterThanOrEqual(GAME_CONSTANTS.QUEIMADAS_INICIAIS);
      // Verifica se o nível das queimadas iniciais é 1
      estadosComQueimada.forEach(eq => expect(eq.nivelQueimada).toBe(1));
    });
  });

  describe('Ações do Jogador', () => {
    let jogador1Id: string;
    let jogador2Id: string;
    let estadoInicial: any;

    beforeEach(() => {
      mockMathRandom.mockReturnValue(0.5); // Reset para cada teste de ação
      game.iniciarJogo(['Alice', 'Bob']);
      estadoInicial = game.getEstadoAtual();
      jogador1Id = estadoInicial.jogadores[0].id;
      jogador2Id = estadoInicial.jogadores[1].id;
    });

    it('deve permitir que um jogador se mova para uma localização adjacente', () => {
      const jogador = estadoInicial.jogadores.find((j: { id: string; }) => j.id === jogador1Id);
      const localizacaoAtual = game.getEstadoAtual().localizacoes.find(loc => loc.id === jogador.localizacaoAtual);
      const destinoId = localizacaoAtual?.adjacentes[0];

      if (!destinoId) throw new Error('Não há localização adjacente para teste.');

      const sucesso = game.realizarAcao(jogador1Id, TipoAcao.MOVER, destinoId);
      expect(sucesso).toBe(true);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador1Id)?.localizacaoAtual).toBe(destinoId);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador1Id)?.acoesRestantes).toBe(GAME_CONSTANTS.ACOES_POR_TURNO - 1);
    });

    it('não deve permitir que um jogador se mova para uma localização não adjacente', () => {
      const jogador = estadoInicial.jogadores.find((j: { id: string; }) => j.id === jogador1Id);
      const localizacaoAtual = game.getEstadoAtual().localizacoes.find(loc => loc.id === jogador.localizacaoAtual);
      // Tenta mover para uma localização que certamente não é adjacente (ex: um estado do sul para um do norte que não é adjacente ao atual)
      const destinoInvalidoId = game.getEstadoAtual().localizacoes.find(loc => !localizacaoAtual?.adjacentes.includes(loc.id) && loc.id !== localizacaoAtual?.id)?.id;
      if (!destinoInvalidoId) throw new Error('Não foi possível encontrar um destino inválido para teste.');

      const sucesso = game.realizarAcao(jogador1Id, TipoAcao.MOVER, destinoInvalidoId);
      expect(sucesso).toBe(false);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador1Id)?.localizacaoAtual).toBe(jogador.localizacaoAtual);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador1Id)?.acoesRestantes).toBe(GAME_CONSTANTS.ACOES_POR_TURNO); // Ações não devem ser consumidas
    });

    it('deve permitir que um jogador combata uma queimada', () => {
      // Força um estado com queimada para teste
      const estadoQueimadaAlvo = game.getEstadoAtual().estadosQueimadas[0];
      estadoQueimadaAlvo.nivelQueimada = 2;
      game.getEstadoAtual().jogadores[0].localizacaoAtual = estadoQueimadaAlvo.id;

      const sucesso = game.realizarAcao(jogador1Id, TipoAcao.COMBATER_QUEIMADA);
      expect(sucesso).toBe(true);
      expect(game.getEstadoAtual().estadosQueimadas.find(eq => eq.id === estadoQueimadaAlvo.id)?.nivelQueimada).toBe(1);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador1Id)?.acoesRestantes).toBe(GAME_CONSTANTS.ACOES_POR_TURNO - 1);
    });

    it('não deve permitir combater queimada se não houver queimada', () => {
      const estadoQueimadaAlvo = game.getEstadoAtual().estadosQueimadas[0];
      estadoQueimadaAlvo.nivelQueimada = 0; // Garante que não há queimada
      game.getEstadoAtual().jogadores[0].localizacaoAtual = estadoQueimadaAlvo.id;

      const sucesso = game.realizarAcao(jogador1Id, TipoAcao.COMBATER_QUEIMADA);
      expect(sucesso).toBe(false);
      expect(game.getEstadoAtual().estadosQueimadas.find(eq => eq.id === estadoQueimadaAlvo.id)?.nivelQueimada).toBe(0);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador1Id)?.acoesRestantes).toBe(GAME_CONSTANTS.ACOES_POR_TURNO); // Ações não devem ser consumidas
    });

    it('deve permitir que jogadores cooperem e troquem cartas', () => {
      const localizacaoComumId = estadoInicial.localizacoes[0].id;
      game.getEstadoAtual().jogadores[0].localizacaoAtual = localizacaoComumId;
      game.getEstadoAtual().jogadores[1].localizacaoAtual = localizacaoComumId;

      const cartaParaTrocar = 'AM'; // Assume que 'AM' é uma carta válida
      game.getEstadoAtual().jogadores[0].mao.push(cartaParaTrocar);

      const sucesso = game.realizarAcao(jogador1Id, TipoAcao.COOPERAR, jogador2Id, cartaParaTrocar);
      expect(sucesso).toBe(true);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador1Id)?.mao).not.toContain(cartaParaTrocar);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador2Id)?.mao).toContain(cartaParaTrocar);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador1Id)?.acoesRestantes).toBe(GAME_CONSTANTS.ACOES_POR_TURNO - 1);
    });

    it('não deve permitir cooperação se jogadores não estiverem no mesmo local', () => {
      const localizacao1Id = estadoInicial.localizacoes[0].id;
      const localizacao2Id = estadoInicial.localizacoes[1].id;
      game.getEstadoAtual().jogadores[0].localizacaoAtual = localizacao1Id;
      game.getEstadoAtual().jogadores[1].localizacaoAtual = localizacao2Id;

      const cartaParaTrocar = 'AM';
      game.getEstadoAtual().jogadores[0].mao.push(cartaParaTrocar);

      const sucesso = game.realizarAcao(jogador1Id, TipoAcao.COOPERAR, jogador2Id, cartaParaTrocar);
      expect(sucesso).toBe(false);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador1Id)?.mao).toContain(cartaParaTrocar);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador2Id)?.mao).not.toContain(cartaParaTrocar);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador1Id)?.acoesRestantes).toBe(GAME_CONSTANTS.ACOES_POR_TURNO);
    });

    it('deve permitir que um jogador realize uma ação de planejamento', () => {
      const sucesso = game.realizarAcao(jogador1Id, TipoAcao.PLANEJAMENTO);
      expect(sucesso).toBe(true);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador1Id)?.acoesRestantes).toBe(GAME_CONSTANTS.ACOES_POR_TURNO - 1);
    });

    it('não deve permitir ações se o jogador não tiver ações restantes', () => {
      game.getEstadoAtual().jogadores[0].acoesRestantes = 0;

      const sucesso = game.realizarAcao(jogador1Id, TipoAcao.PLANEJAMENTO);
      expect(sucesso).toBe(false);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador1Id)?.acoesRestantes).toBe(0);
    });
  });

  describe('Progressão de Turno', () => {
    beforeEach(() => {
      mockMathRandom.mockReturnValue(0.5);
      game.iniciarJogo(['Jogador1']);
      // Consumir algumas ações para testar o reset no próximo turno
      game.realizarAcao(game.getEstadoAtual().jogadores[0].id, TipoAcao.PLANEJAMENTO);
    });

    it('deve avançar o turno e resetar ações dos jogadores', () => {
      game.avancarTurno();
      const estado = game.getEstadoAtual();
      expect(estado.turnoAtual).toBe(2);
      expect(estado.jogadores[0].acoesRestantes).toBe(GAME_CONSTANTS.ACOES_POR_TURNO);
    });

    it('deve fazer os jogadores comprarem cartas no início do turno', () => {
      const jogador = game.getEstadoAtual().jogadores[0];
      const cartasAntes = jogador.mao.length;
      game.avancarTurno();
      expect(game.getEstadoAtual().jogadores[0].mao.length).toBe(cartasAntes + 2); // Assume que compra 2 cartas por turno
    });

    it('deve atualizar a trilha de flora com base na trilha de queimada', () => {
      game.getEstadoAtual().trilhaQueimada = 40; // Abaixo do limiar
      game.getEstadoAtual().trilhaFlora = 50;
      game.avancarTurno();
      let estado = game.getEstadoAtual();
      expect(estado.trilhaFlora).toBe(50 + GAME_CONSTANTS.RECUPERACAO_FLORA_TURNO_PADRAO);

      game.getEstadoAtual().trilhaQueimada = 60; // Acima do limiar
      game.getEstadoAtual().trilhaFlora = 50;
      game.avancarTurno();
      estado = game.getEstadoAtual();
      expect(estado.trilhaFlora).toBe(50 - GAME_CONSTANTS.DEGRADACAO_FLORA_TURNO_PADRAO);
    });
  });

  describe('Lógica de Queimadas', () => {
    beforeEach(() => {
      mockMathRandom.mockReturnValue(0.5);
      game.iniciarJogo(['Jogador1']);
    });

    it('deve sortear novas queimadas e aumentar o nível', () => {
      const estadoQueimadaAlvo = game.getEstadoAtual().estadosQueimadas[0];
      estadoQueimadaAlvo.nivelQueimada = 0;
      game.getEstadoAtual().baralhoQueimada = [estadoQueimadaAlvo.id]; // Garante que será sorteada
      game.getEstadoAtual().trilhaQueimada = 0; // Para NUM_CARTAS_QUEIMADA_POR_FASE ser 1

      // Força a fase de queimadas (simulando avanço de turno)
      (game as any)._processarFaseQueimada();

      expect(estadoQueimadaAlvo.nivelQueimada).toBe(1);
    });

    it('deve propagar queimada se o nível máximo for atingido ao sortear', () => {
      const estadoQueimadaAlvo = game.getEstadoAtual().estadosQueimadas[0];
      estadoQueimadaAlvo.nivelQueimada = GAME_CONSTANTS.MAX_NIVEL_QUEIMADA;
      game.getEstadoAtual().baralhoQueimada = [estadoQueimadaAlvo.id];
      game.getEstadoAtual().trilhaQueimada = 0;

      const propagarQueimadaSpy = vi.spyOn(game as any, '_propagarQueimada');

      (game as any)._processarFaseQueimada();

      expect(propagarQueimadaSpy).toHaveBeenCalledWith(estadoQueimadaAlvo.id, expect.any(Set));
    });

    it('deve propagar queimada para estados adjacentes e aumentar trilhaQueimada', () => {
      // Mocka o mapa para ter certeza das adjacências para o teste
      const loc1 = { id: 'A', estado: 'Estado A', regiao: CargoJogador.GOVERNADOR, adjacentes: ['B'] };
      const loc2 = { id: 'B', estado: 'Estado B', regiao: CargoJogador.GOVERNADOR, adjacentes: ['A'] };
      (game as any).mapManager.getLocalizacoes = vi.fn(() => [loc1, loc2]);
      (game as any).mapManager.findLocationById = vi.fn((id: string) => [loc1, loc2].find(l => l.id === id));
      (game as any).mapManager.areAdjacent = vi.fn((id1: string, id2: string) => (id1 === 'A' && id2 === 'B') || (id1 === 'B' && id2 === 'A'));

      // Re-inicializa os estados de queimada após mockar o mapa
      game.iniciarJogo(['Jogador1']);
      const estadoQueimadaAlvo = game.getEstadoAtual().estadosQueimadas.find(eq => eq.id === 'A');
      const estadoQueimadaAdjacente = game.getEstadoAtual().estadosQueimadas.find(eq => eq.id === 'B');

      if (!estadoQueimadaAlvo || !estadoQueimadaAdjacente) throw new Error('Estados para teste de propagação não encontrados.');

      estadoQueimadaAlvo.nivelQueimada = GAME_CONSTANTS.MAX_NIVEL_QUEIMADA;
      estadoQueimadaAdjacente.nivelQueimada = 0;
      game.getEstadoAtual().trilhaQueimada = 0; // Zera para verificar o aumento

      (game as any)._propagarQueimada('A');

      expect(estadoQueimadaAdjacente.nivelQueimada).toBe(1);
      expect(game.getEstadoAtual().trilhaQueimada).toBe(GAME_CONSTANTS.AUMENTO_TRILHA_QUEIMADA_SURTO);
    });

    it('deve reembaralhar o descarte de queimadas quando o baralho estiver vazio', () => {
      game.getEstadoAtual().baralhoQueimada = [];
      game.getEstadoAtual().descarteQueimada = ['AM', 'PA'];
      game.getEstadoAtual().trilhaQueimada = 0; // Para sortear apenas 1 carta

      const shuffleSpy = vi.spyOn((game as any).cardManager, 'shuffle');

      (game as any)._processarFaseQueimada();

      const estado = game.getEstadoAtual();
      expect(estado.baralhoQueimada.length).toBe(1);
      expect(estado.descarteQueimada.length).toBe(1); // Uma foi para o baralho e depois para o descarte
      expect(shuffleSpy).toHaveBeenCalled();
    });
  });

  describe('Cartas de Evento', () => {
    beforeEach(() => {
      mockMathRandom.mockReturnValue(0.5);
      game.iniciarJogo(['Jogador1']);
    });

    it('deve ativar o evento QUEIMADA_INTENSA', () => {
      const sortearNovaQueimadaSpy = vi.spyOn(game as any, '_sortearNovaQueimada');
      const evento: CartaEvento = { tipo: TipoEvento.QUEIMADA_INTENSA, descricao: '' };
      // Simula a ativação do evento pelo EventManager
      (game as any).eventManager.ativarCartaEvento(
        evento,
        game.getEstadoAtual(),
        () => (game as any)._sortearNovaQueimada(),
        (id: string) => (game as any).mapManager.findLocationById(id)
      );
      expect(sortearNovaQueimadaSpy).toHaveBeenCalled();
    });

    it('deve ativar o evento SECA_PROLONGADA', () => {
      const trilhaQueimadaAntes = game.getEstadoAtual().trilhaQueimada;
      const evento: CartaEvento = { tipo: TipoEvento.SECA_PROLONGADA, descricao: '' };
      (game as any).eventManager.ativarCartaEvento(
        evento,
        game.getEstadoAtual(),
        () => {}, // Não relevante para este evento
        () => undefined
      );
      expect(game.getEstadoAtual().trilhaQueimada).toBe(Math.min(GAME_CONSTANTS.MAX_TRILHA_QUEIMADA, trilhaQueimadaAntes + GAME_CONSTANTS.FATORES_EVENTOS.SECA_PROLONGADA_AUMENTO_QUEIMADA));
    });

    it('deve ativar o evento CHUVA_BENEFICA e reduzir queimada/aumentar flora', () => {
      const estadoComQueimada = game.getEstadoAtual().estadosQueimadas[0];
      estadoComQueimada.nivelQueimada = 2;
      game.getEstadoAtual().trilhaFlora = 50;

      const evento: CartaEvento = { tipo: TipoEvento.CHUVA_BENEFICA, descricao: '' };
      mockMathRandom.mockReturnValue(0); // Para selecionar o primeiro estado com queimada

      (game as any).eventManager.ativarCartaEvento(
        evento,
        game.getEstadoAtual(),
        () => {},
        (id: string) => (game as any).mapManager.findLocationById(id)
      );
      expect(estadoComQueimada.nivelQueimada).toBe(1);
      expect(game.getEstadoAtual().trilhaFlora).toBe(50 + GAME_CONSTANTS.FATORES_EVENTOS.CHUVA_BENEFICA_AUMENTO_FLORA);
    });

    it('deve ativar o evento CONSCIENTIZACAO e aumentar proteção ambiental', () => {
      const estadoParaProteger = game.getEstadoAtual().estadosQueimadas[0];
      estadoParaProteger.protecaoAmbiental = 0;

      const evento: CartaEvento = { tipo: TipoEvento.CONSCIENTIZACAO, descricao: '' };
      mockMathRandom.mockReturnValue(0); // Para selecionar o primeiro estado

      (game as any).eventManager.ativarCartaEvento(
        evento,
        game.getEstadoAtual(),
        () => {},
        (id: string) => (game as any).mapManager.findLocationById(id)
      );
      expect(estadoParaProteger.protecaoAmbiental).toBe(GAME_CONSTANTS.FATORES_EVENTOS.CONSCIENTIZACAO_AUMENTO_PROTECAO);
    });

    it('deve ativar o evento VERBA_EMERGENCIAL e conceder ação extra', () => {
      const jogadorAlvo = game.getEstadoAtual().jogadores[0];
      jogadorAlvo.acoesRestantes = 2;

      const evento: CartaEvento = { tipo: TipoEvento.VERBA_EMERGENCIAL, descricao: '' };
      mockMathRandom.mockReturnValue(0); // Para selecionar o primeiro jogador

      (game as any).eventManager.ativarCartaEvento(
        evento,
        game.getEstadoAtual(),
        () => {},
        () => undefined
      );
      expect(jogadorAlvo.acoesRestantes).toBe(2 + GAME_CONSTANTS.FATORES_EVENTOS.VERBA_EMERGENCIAL_ACOES_EXTRA);
    });
  });

  describe('Condições de Vitória/Derrota', () => {
    beforeEach(() => {
      mockMathRandom.mockReturnValue(0.5);
      game.iniciarJogo(['Jogador1']);
    });

    it('deve declarar vitória se todas as queimadas forem controladas e a flora estiver recuperada', () => {
      game.getEstadoAtual().estadosQueimadas.forEach(eq => (eq.nivelQueimada = 0));
      game.getEstadoAtual().trilhaFlora = GAME_CONSTANTS.VITORIA_FLORA_LIMIAR;

      (game as any)._verificarCondicoesVitoria();
      const estado = game.getEstadoAtual();
      expect(estado.jogoAcabou).toBe(true);
      expect(estado.vitoria).toBe(true);
    });

    it('deve declarar derrota se o limite de turnos for atingido', () => {
      game.getEstadoAtual().turnoAtual = GAME_CONSTANTS.MAX_TURNOS;
      (game as any)._verificarCondicoesVitoria();
      const estado = game.getEstadoAtual();
      expect(estado.jogoAcabou).toBe(true);
      expect(estado.vitoria).toBe(false);
    });

    it('deve declarar derrota se a trilha de queimada atingir o máximo', () => {
      game.getEstadoAtual().trilhaQueimada = GAME_CONSTANTS.MAX_TRILHA_QUEIMADA;
      (game as any)._verificarCondicoesVitoria();
      const estado = game.getEstadoAtual();
      expect(estado.jogoAcabou).toBe(true);
      expect(estado.vitoria).toBe(false);
    });

    it('deve declarar derrota se a trilha de flora atingir o mínimo', () => {
      game.getEstadoAtual().trilhaFlora = GAME_CONSTANTS.MIN_TRILHA_FLORA;
      (game as any)._verificarCondicoesVitoria();
      const estado = game.getEstadoAtual();
      expect(estado.jogoAcabou).toBe(true);
      expect(estado.vitoria).toBe(false);
    });

    it('deve declarar derrota se o baralho de jogadores acabar', () => {
      game.getEstadoAtual().baralhoJogador = [];
      game.getEstadoAtual().descarteJogador = [];
      game.getEstadoAtual().turnoAtual = 2; // Precisa ser > 1 para esta condição ser checada após inicialização

      (game as any)._verificarCondicoesVitoria();
      const estado = game.getEstadoAtual();
      expect(estado.jogoAcabou).toBe(true);
      expect(estado.vitoria).toBe(false);
    });
  });

  describe('Getters', () => {
    it('deve retornar o estado atual do jogo', () => {
      game.iniciarJogo(['TestPlayer']);
      const estado = game.getEstadoAtual();
      expect(estado).toBeDefined();
      expect(estado.jogadores.length).toBe(1);
    });

    it('deve retornar as mensagens de log', () => {
      game.iniciarJogo(['TestPlayer']);
      const logs = game.getMensagensLog();
      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0]).toHaveProperty('mensagem');
      expect(logs[0]).toHaveProperty('turno');
      expect(logs[0]).toHaveProperty('timestamp');
    });
  });
});