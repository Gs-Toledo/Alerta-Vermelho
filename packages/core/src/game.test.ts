import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Game from './game';
import { TipoAcao, TipoEvento, CargoJogador, CartaEvento, RegiaoBrasil } from './utils/types';
import { GAME_CONSTANTS } from './constants/game-config';
import { MapManager } from './utils/MapManager'; // Importe MapManager para mockar

describe('Game', () => {
  let game: Game;
  let mockMathRandom: vi.SpyInstance;

  beforeEach(() => {
    game = new Game();
    mockMathRandom = vi.spyOn(Math, 'random');
    mockMathRandom.mockReturnValue(0.5);
  });

  afterEach(() => {
    mockMathRandom.mockRestore();
    vi.clearAllMocks();
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
      mockMathRandom.mockReturnValue(0.1);
      game.iniciarJogo(['Jogador1']);
      const estado = game.getEstadoAtual();

      const estadosComQueimada = estado.estadosQueimadas.filter(eq => eq.nivelQueimada > 0);
      expect(estadosComQueimada.length).toBeGreaterThanOrEqual(GAME_CONSTANTS.QUEIMADAS_INICIAIS);
      estadosComQueimada.forEach(eq => expect(eq.nivelQueimada).toBe(1));
    });
  });

  describe('Ações do Jogador', () => {
    let jogador1Id: string;
    let jogador2Id: string;

    beforeEach(() => {
      mockMathRandom.mockReturnValue(0.5);
      game.iniciarJogo(['Alice', 'Bob']);
      jogador1Id = game.getEstadoAtual().jogadores[0].id;
      jogador2Id = game.getEstadoAtual().jogadores[1].id;
    });

    it('deve permitir que um jogador se mova para uma localização adjacente', () => {
      const jogador = (game as any).estado.jogadores.find((j: { id: string; }) => j.id === jogador1Id);
      const localizacaoAtual = (game as any).estado.localizacoes.find((loc: { id: string; }) => loc.id === jogador.localizacaoAtual);
      const destinoId = localizacaoAtual?.adjacentes[0];

      if (!destinoId) throw new Error('Não há localização adjacente para teste.');

      const sucesso = game.realizarAcao(jogador1Id, TipoAcao.MOVER, destinoId);
      expect(sucesso).toBe(true);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador1Id)?.localizacaoAtual).toBe(destinoId);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador1Id)?.acoesRestantes).toBe(GAME_CONSTANTS.ACOES_POR_TURNO - 1);
    });

    it('não deve permitir que um jogador se mova para uma localização não adjacente', () => {
      const jogador = (game as any).estado.jogadores.find((j: { id: string; }) => j.id === jogador1Id);
      const localizacaoAtual = (game as any).estado.localizacoes.find((loc: { id: string; }) => loc.id === jogador.localizacaoAtual);
      const destinoInvalidoId = (game as any).estado.localizacoes.find((loc: { adjacentes: string | string[]; id: string; }) => !localizacaoAtual?.adjacentes.includes(loc.id) && loc.id !== localizacaoAtual?.id)?.id;
      if (!destinoInvalidoId) throw new Error('Não foi possível encontrar um destino inválido para teste.');

      const sucesso = game.realizarAcao(jogador1Id, TipoAcao.MOVER, destinoInvalidoId);
      expect(sucesso).toBe(false);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador1Id)?.localizacaoAtual).toBe(jogador.localizacaoAtual);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador1Id)?.acoesRestantes).toBe(GAME_CONSTANTS.ACOES_POR_TURNO);
    });

    it('deve permitir que um jogador combata uma queimada', () => {
      const estadoQueimadaAlvo = (game as any).estado.estadosQueimadas[0];
      estadoQueimadaAlvo.nivelQueimada = 2;
      (game as any).estado.jogadores[0].localizacaoAtual = estadoQueimadaAlvo.id;

      const sucesso = game.realizarAcao(jogador1Id, TipoAcao.COMBATER_QUEIMADA);
      expect(sucesso).toBe(true);
      expect(game.getEstadoAtual().estadosQueimadas.find(eq => eq.id === estadoQueimadaAlvo.id)?.nivelQueimada).toBe(1);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador1Id)?.acoesRestantes).toBe(GAME_CONSTANTS.ACOES_POR_TURNO - 1);
    });

    it('não deve permitir combater queimada se não houver queimada', () => {
      const estadoQueimadaAlvo = (game as any).estado.estadosQueimadas[0];
      estadoQueimadaAlvo.nivelQueimada = 0;
      (game as any).estado.jogadores[0].localizacaoAtual = estadoQueimadaAlvo.id;

      const sucesso = game.realizarAcao(jogador1Id, TipoAcao.COMBATER_QUEIMADA);
      expect(sucesso).toBe(false);
      expect(game.getEstadoAtual().estadosQueimadas.find(eq => eq.id === estadoQueimadaAlvo.id)?.nivelQueimada).toBe(0);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador1Id)?.acoesRestantes).toBe(GAME_CONSTANTS.ACOES_POR_TURNO);
    });

    it('deve permitir que jogadores cooperem e troquem cartas', () => {
      const localizacaoComumId = (game as any).estado.localizacoes[0].id;
      (game as any).estado.jogadores[0].localizacaoAtual = localizacaoComumId;
      (game as any).estado.jogadores[1].localizacaoAtual = localizacaoComumId;

      const jogador1Real = (game as any).estado.jogadores.find((j: { id: string; }) => j.id === jogador1Id);
      if (jogador1Real.mao.length === 0) {
        jogador1Real.mao.push('TEST_CARD_A'); // Garante que há uma carta para trocar
      }
      const cartaParaTrocar = jogador1Real.mao[0];

      const sucesso = game.realizarAcao(jogador1Id, TipoAcao.COOPERAR, jogador2Id, cartaParaTrocar);
      expect(sucesso).toBe(true);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador1Id)?.mao).not.toContain(cartaParaTrocar);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador2Id)?.mao).toContain(cartaParaTrocar);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador1Id)?.acoesRestantes).toBe(GAME_CONSTANTS.ACOES_POR_TURNO - 1);
    });

    it('não deve permitir cooperação se jogadores não estiverem no mesmo local', () => {
      const localizacao1Id = (game as any).estado.localizacoes[0].id;
      const allLocs = (game as any).estado.localizacoes;
      const differentLocs = allLocs.filter((loc: { id: string; }) => loc.id !== localizacao1Id);
      if (differentLocs.length === 0) throw new Error("Não há localizações suficientes para testar não-adjacência para cooperação.");
      
      (game as any).estado.jogadores[0].localizacaoAtual = localizacao1Id;
      (game as any).estado.jogadores[1].localizacaoAtual = differentLocs[0].id; // Garante que estão em locais diferentes

      const cartaParaTrocar = 'AM';
      (game as any).estado.jogadores[0].mao.push(cartaParaTrocar);

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
      (game as any).estado.jogadores[0].acoesRestantes = 0;

      const sucesso = game.realizarAcao(jogador1Id, TipoAcao.PLANEJAMENTO);
      expect(sucesso).toBe(false);
      expect(game.getEstadoAtual().jogadores.find(j => j.id === jogador1Id)?.acoesRestantes).toBe(0);
    });
  });

  describe('Progressão de Turno', () => {
    // Não precisa de beforeEach aqui, pois cada 'it' reinicia o jogo
    // ou manipula o estado explicitamente.

    it('deve avançar o turno e resetar ações dos jogadores', () => {
      game = new Game(); // Garante um estado limpo
      game.iniciarJogo(['Jogador1']);
      (game as any).estado.jogadores[0].acoesRestantes = 0; // Garante que as ações são resetadas
      game.avancarTurno();
      const estado = game.getEstadoAtual();
      expect(estado.turnoAtual).toBe(2);
      expect(estado.jogadores[0].acoesRestantes).toBe(GAME_CONSTANTS.ACOES_POR_TURNO);
    });

    it('deve fazer os jogadores comprarem cartas no início do turno', () => {
      game = new Game(); // Garante um estado limpo
      game.iniciarJogo(['Jogador1']);
      const jogador = (game as any).estado.jogadores[0];
      const cartasAntes = jogador.mao.length;
      game.avancarTurno();
      expect(game.getEstadoAtual().jogadores[0].mao.length).toBe(cartasAntes + 2);
    });

    it('deve recuperar a trilha de flora se a trilha de queimada estiver baixa', () => {
      game = new Game(); // Garante um estado limpo
      game.iniciarJogo(['Jogador1']); // Inicia para ter o estado base
      (game as any).estado.trilhaQueimada = 40; // Abaixo do limiar (50)
      (game as any).estado.trilhaFlora = 50;
      game.avancarTurno();
      const estado = game.getEstadoAtual();
      expect(estado.trilhaFlora).toBe(50 + GAME_CONSTANTS.RECUPERACAO_FLORA_TURNO_PADRAO); // Espera 55
    });

    it('deve degradar a trilha de flora se a trilha de queimada estiver alta', () => {
      game = new Game(); // Garante um estado limpo para este cenário
      game.iniciarJogo(['Jogador1']); // Inicia para ter o estado base
      (game as any).estado.trilhaQueimada = 60; // Acima do limiar (50)
      (game as any).estado.trilhaFlora = 50;
      game.avancarTurno();
      const estado = game.getEstadoAtual();
      expect(estado.trilhaFlora).toBe(50 - GAME_CONSTANTS.DEGRADACAO_FLORA_TURNO_PADRAO); // Espera 45
    });
  });

  describe('Lógica de Queimadas', () => {
    // Mocks para o MapManager para este bloco de testes
    const mockLocations = [
      { id: 'LOC_A', estado: 'Estado A', regiao: RegiaoBrasil.NORTE, adjacentes: ['LOC_B'] },
      { id: 'LOC_B', estado: 'Estado B', regiao: RegiaoBrasil.NORTE, adjacentes: ['LOC_A', 'LOC_C'] },
      { id: 'LOC_C', estado: 'Estado C', regiao: RegiaoBrasil.NORTE, adjacentes: ['LOC_B'] }
    ];

    let MapManagerConstructorSpy: vi.SpyInstance;

    beforeEach(() => {
      mockMathRandom = vi.spyOn(Math, 'random');
      mockMathRandom.mockReturnValue(0.5); // Padrão para random

      // Spy no construtor da classe MapManager
      // Quando MapManager é instanciado dentro de Game, ele usará esta implementação mockada
      MapManagerConstructorSpy = vi.spyOn(MapManager.prototype, 'constructor' as any)
                                  .mockImplementation(function (this: MapManager) {
                                      // Inicializa as propriedades do MapManager mockado
                                      (this as any).localizacoes = JSON.parse(JSON.stringify(mockLocations));
                                      // Sobrescreve os métodos essenciais com vi.fn para que possamos espionar/controlar
                                      this.getLocalizacoes = vi.fn(() => JSON.parse(JSON.stringify(mockLocations)));
                                      this.findLocationById = vi.fn((id: string) => (this as any).localizacoes.find((loc: { id: string; }) => loc.id === id));
                                      this.areAdjacent = vi.fn((loc1Id: string, loc2Id: string) => {
                                          const loc1 = (this as any).localizacoes.find((loc: { id: string; }) => loc.id === loc1Id);
                                          return loc1 ? loc1.adjacentes.includes(loc2Id) : false;
                                      });
                                  });

      game = new Game(); // Game agora instancia o MapManager mockado
      game.iniciarJogo(['Jogador1']); // inicarJogo vai usar as localizações mockadas
    });

    afterEach(() => {
      mockMathRandom.mockRestore();
      MapManagerConstructorSpy.mockRestore(); // Restaura o construtor original do MapManager
      vi.clearAllMocks();
    });

    it('deve sortear novas queimadas e aumentar o nível', () => {
      // estadosQueimadas agora conterá LOC_A, LOC_B, LOC_C
      const estadoQueimadaAlvo = (game as any).estado.estadosQueimadas.find((eq: { id: string; }) => eq.id === 'LOC_A');
      if (!estadoQueimadaAlvo) throw new Error("LOC_A não encontrado nos estadosQueimadas após iniciarJogo.");

      estadoQueimadaAlvo.nivelQueimada = 0;
      // Garante que o baralho da queimada contém o ID do alvo para ser sorteado
      (game as any).estado.baralhoQueimada = [estadoQueimadaAlvo.id];
      (game as any).estado.trilhaQueimada = 0;

      (game as any)._processarFaseQueimada();

      expect(estadoQueimadaAlvo.nivelQueimada).toBe(1);
    });

    it('deve propagar queimada se o nível máximo for atingido ao sortear', () => {
      const estadoQueimadaAlvo = (game as any).estado.estadosQueimadas.find((eq: { id: string; }) => eq.id === 'LOC_A');
      if (!estadoQueimadaAlvo) throw new Error("LOC_A não encontrado nos estadosQueimadas após iniciarJogo.");

      estadoQueimadaAlvo.nivelQueimada = GAME_CONSTANTS.MAX_NIVEL_QUEIMADA;
      (game as any).estado.baralhoQueimada = [estadoQueimadaAlvo.id];
      (game as any).estado.trilhaQueimada = 0;

      const propagarQueimadaSpy = vi.spyOn(game as any, '_propagarQueimada');

      (game as any)._processarFaseQueimada();

      expect(propagarQueimadaSpy).toHaveBeenCalledWith(estadoQueimadaAlvo.id, expect.anything());
      propagarQueimadaSpy.mockRestore();
    });

    it('deve propagar queimada para estados adjacentes e aumentar trilhaQueimada', () => {
      const estadoQueimadaAlvo = (game as any).estado.estadosQueimadas.find((eq: { id: string; }) => eq.id === 'LOC_A');
      const estadoQueimadaAdjacente = (game as any).estado.estadosQueimadas.find((eq: { id: string; }) => eq.id === 'LOC_B');

      if (!estadoQueimadaAlvo || !estadoQueimadaAdjacente) {
        throw new Error('Estados para teste de propagação não encontrados APÓS MOCK.');
      }

      estadoQueimadaAlvo.nivelQueimada = GAME_CONSTANTS.MAX_NIVEL_QUEIMADA;
      estadoQueimadaAdjacente.nivelQueimada = 0;
      (game as any).estado.trilhaQueimada = 0;

      (game as any)._propagarQueimada('LOC_A');

      expect(estadoQueimadaAdjacente.nivelQueimada).toBe(1);
      expect(game.getEstadoAtual().trilhaQueimada).toBe(GAME_CONSTANTS.AUMENTO_TRILHA_QUEIMADA_SURTO);
    });

    it('deve reembaralhar o descarte de queimadas quando o baralho estiver vazio', () => {
      (game as any).estado.baralhoQueimada = [];
      (game as any).estado.descarteQueimada = ['LOC_A', 'LOC_B']; // Usando IDs mockados
      (game as any).estado.trilhaQueimada = 0;

      const shuffleSpy = vi.spyOn((game as any).cardManager, 'shuffle');

      (game as any)._processarFaseQueimada();

      const estado = game.getEstadoAtual();
      expect(shuffleSpy).toHaveBeenCalled();
      expect(estado.baralhoQueimada.length).toBe(1);
      expect(estado.descarteQueimada.length).toBe(1);
      shuffleSpy.mockRestore();
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
      (game as any).eventManager.ativarCartaEvento(
        evento,
        (game as any).estado,
        () => (game as any)._sortearNovaQueimada(),
        (id: string) => (game as any).mapManager.findLocationById(id)
      );
      expect(sortearNovaQueimadaSpy).toHaveBeenCalled();
      sortearNovaQueimadaSpy.mockRestore();
    });

    it('deve ativar o evento SECA_PROLONGADA', () => {
      (game as any).estado.trilhaQueimada = 0;
      const trilhaQueimadaAntes = (game as any).estado.trilhaQueimada;

      const evento: CartaEvento = { tipo: TipoEvento.SECA_PROLONGADA, descricao: '' };
      (game as any).eventManager.ativarCartaEvento(
        evento,
        (game as any).estado,
        () => {},
        () => undefined
      );
      expect(game.getEstadoAtual().trilhaQueimada).toBe(Math.min(GAME_CONSTANTS.MAX_TRILHA_QUEIMADA, trilhaQueimadaAntes + GAME_CONSTANTS.FATORES_EVENTOS.SECA_PROLONGADA_AUMENTO_QUEIMADA));
    });

    it('deve ativar o evento CHUVA_BENEFICA e reduzir queimada/aumentar flora', () => {
      const estadoComQueimada = (game as any).estado.estadosQueimadas[0];
      estadoComQueimada.nivelQueimada = 2;
      (game as any).estado.trilhaFlora = 50;

      const evento: CartaEvento = { tipo: TipoEvento.CHUVA_BENEFICA, descricao: '' };
      mockMathRandom.mockReturnValue(0);

      (game as any).eventManager.ativarCartaEvento(
        evento,
        (game as any).estado,
        () => {},
        (id: string) => (game as any).mapManager.findLocationById(id)
      );
      expect(estadoComQueimada.nivelQueimada).toBe(1);
      expect(game.getEstadoAtual().trilhaFlora).toBe(50 + GAME_CONSTANTS.FATORES_EVENTOS.CHUVA_BENEFICA_AUMENTO_FLORA);
    });

    it('deve ativar o evento CONSCIENTIZACAO e aumentar proteção ambiental', () => {
      const estadoParaProteger = (game as any).estado.estadosQueimadas[0];
      estadoParaProteger.protecaoAmbiental = 0;

      const evento: CartaEvento = { tipo: TipoEvento.CONSCIENTIZACAO, descricao: '' };
      mockMathRandom.mockReturnValue(0);

      (game as any).eventManager.ativarCartaEvento(
        evento,
        (game as any).estado,
        () => {},
        (id: string) => (game as any).mapManager.findLocationById(id)
      );
      expect(estadoParaProteger.protecaoAmbiental).toBe(GAME_CONSTANTS.FATORES_EVENTOS.CONSCIENTIZACAO_AUMENTO_PROTECAO);
    });

    it('deve ativar o evento VERBA_EMERGENCIAL e conceder ação extra', () => {
      const jogadorAlvo = (game as any).estado.jogadores[0];
      jogadorAlvo.acoesRestantes = 2;

      const evento: CartaEvento = { tipo: TipoEvento.VERBA_EMERGENCIAL, descricao: '' };
      mockMathRandom.mockReturnValue(0);

      (game as any).eventManager.ativarCartaEvento(
        evento,
        (game as any).estado,
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
      (game as any).estado.estadosQueimadas.forEach((eq: any) => (eq.nivelQueimada = 0));
      (game as any).estado.trilhaFlora = GAME_CONSTANTS.VITORIA_FLORA_LIMIAR;

      (game as any)._verificarCondicoesVitoria();
      const estado = game.getEstadoAtual();
      expect(estado.jogoAcabou).toBe(true);
      expect(estado.vitoria).toBe(true);
    });

    it('deve declarar derrota se o limite de turnos for atingido', () => {
      (game as any).estado.turnoAtual = GAME_CONSTANTS.MAX_TURNOS;
      (game as any)._verificarCondicoesVitoria();
      const estado = game.getEstadoAtual();
      expect(estado.jogoAcabou).toBe(true);
      expect(estado.vitoria).toBe(false);
    });

    it('deve declarar derrota se a trilha de queimada atingir o máximo', () => {
      (game as any).estado.trilhaQueimada = GAME_CONSTANTS.MAX_TRILHA_QUEIMADA;
      (game as any)._verificarCondicoesVitoria();
      const estado = game.getEstadoAtual();
      expect(estado.jogoAcabou).toBe(true);
      expect(estado.vitoria).toBe(false);
    });

    it('deve declarar derrota se a trilha de flora atingir o mínimo', () => {
      (game as any).estado.trilhaFlora = GAME_CONSTANTS.MIN_TRILHA_FLORA;
      (game as any)._verificarCondicoesVitoria();
      const estado = game.getEstadoAtual();
      expect(estado.jogoAcabou).toBe(true);
      expect(estado.vitoria).toBe(false);
    });

    it('deve declarar derrota se o baralho de jogadores acabar', () => {
      (game as any).estado.baralhoJogador = [];
      (game as any).estado.descarteJogador = [];
      (game as any).estado.turnoAtual = 2;

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