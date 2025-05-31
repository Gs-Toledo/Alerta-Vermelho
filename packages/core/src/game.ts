import {
  RegiaoBrasil,
  CargoJogador,
  TipoAcao,
  TipoEvento,
  Localizacao,
  Jogador,
  EstadoQueimada,
  CartaEvento,
  EstadoJogo,
  MensagemLog,
} from './types';
import { GAME_CONSTANTS } from './constants';
import { Logger } from '../core/src/utils/Logger';
import { MapManager } from '../core/src/utils/MapManager';
import { CardManager } from '../core/src/utils/CardManager';
import { EventManager } from '../core/src/utils/EventManager';

export default class Game {
  private estado: EstadoJogo;
  private logger: Logger;
  private mapManager: MapManager;
  private cardManager: CardManager;
  private eventManager: EventManager;

  constructor() {
    this.logger = new Logger();
    this.mapManager = new MapManager();
    this.cardManager = new CardManager();
    // EventManager precisa de acesso ao logger e cardManager
    this.eventManager = new EventManager(this.logger, this.cardManager);
    this.estado = this.getInitialState();
  }

  private getInitialState(): EstadoJogo {
    return {
      jogadores: [],
      localizacoes: this.mapManager.getLocalizacoes(), // Obtido do MapManager
      estadosQueimadas: [],
      baralhoJogador: [],
      descarteJogador: [],
      baralhoEvento: [],
      descarteEvento: [],
      baralhoQueimada: [],
      descarteQueimada: [],
      trilhaQueimada: 0,
      trilhaFlora: GAME_CONSTANTS.MAX_TRILHA_FLORA,
      turnoAtual: 0,
      jogoAcabou: false,
      vitoria: null,
      mensagensLog: this.logger.getLogs(), // Sincroniza com o Logger
    };
  }

  /**
   * Inicia um novo jogo.
   * @param nomesJogadores - Uma lista dos nomes dos jogadores.
   */
  public iniciarJogo(nomesJogadores: string[]): void {
    this.logger.addLog('Iniciando novo jogo de Alerta Vermelho!', 0);

    const localizacoes = this.estado.localizacoes; // Já carregadas pelo MapManager

    const cargosDisponiveis = Object.values(CargoJogador);
    this.estado.jogadores = nomesJogadores.map((nome, index) => {
      const cargo = cargosDisponiveis[index % cargosDisponiveis.length];
      const localizacaoInicial = localizacoes[Math.floor(Math.random() * localizacoes.length)].id;
      return {
        id: `jogador-${index + 1}`,
        nome,
        cargo,
        mao: [],
        localizacaoAtual: localizacaoInicial,
        acoesRestantes: GAME_CONSTANTS.ACOES_POR_TURNO,
      };
    });
    this.logger.addLog(`Jogadores: ${this.estado.jogadores.map(j => `${j.nome} (${j.cargo})`).join(', ')}`, 0);

    // Inicializa baralhos
    this.estado.baralhoJogador = this.cardManager.shuffle(localizacoes.map(loc => loc.id));
    this.estado.baralhoQueimada = this.cardManager.shuffle(localizacoes.map(loc => loc.id));
    this.estado.baralhoEvento = this.cardManager.createShuffledEventDeck(); // Usa o CardManager

    this._distribuirCartasIniciaisJogadores();

    this.estado.estadosQueimadas = localizacoes.map(loc => ({
      id: loc.id,
      nivelQueimada: 0,
      protecaoAmbiental: 0,
      populacaoAfetada: 0,
    }));

    this._distribuirQueimadasIniciais();

    this.estado.turnoAtual = 1;
    this.estado.jogoAcabou = false;
    this.estado.vitoria = null;
    this.logger.addLog('Jogo iniciado! Que a batalha contra as queimadas comece!', this.estado.turnoAtual);
  }

  /**
   * Retorna o estado atual do jogo (cópia para evitar mutações externas).
   * @returns O estado atual do jogo.
   */
  public getEstadoAtual(): EstadoJogo {
    return JSON.parse(JSON.stringify(this.estado));
  }

  /**
   * Retorna as mensagens de log do jogo.
   * @returns Um array de MensagemLog.
   */
  public getMensagensLog(): MensagemLog[] {
    return this.logger.getLogs();
  }

  /**
   * Realiza uma ação para um jogador específico.
   * @param jogadorId - O ID do jogador.
   * @param acao - O tipo de ação a ser realizada.
   * @param args - Argumentos adicionais para a ação.
   * @returns True se a ação foi bem-sucedida, false caso contrário.
   */
  public realizarAcao(jogadorId: string, acao: TipoAcao, ...args: any[]): boolean {
    if (this.estado.jogoAcabou) {
      this.logger.addLog('O jogo já acabou. Nenhuma ação pode ser realizada.', this.estado.turnoAtual);
      return false;
    }

    const jogador = this.estado.jogadores.find(j => j.id === jogadorId);
    if (!jogador) {
      this.logger.addLog(`Erro: Jogador com ID ${jogadorId} não encontrado.`, this.estado.turnoAtual);
      return false;
    }

    if (jogador.acoesRestantes <= 0) {
      this.logger.addLog(`${jogador.nome} não tem mais ações restantes neste turno.`, this.estado.turnoAtual);
      return false;
    }

    let acaoBemSucedida = false;
    switch (acao) {
      case TipoAcao.MOVER:
        const destinoId = args[0];
        acaoBemSucedida = this._moverJogador(jogador, destinoId);
        break;
      case TipoAcao.COMBATER_QUEIMADA:
        acaoBemSucedida = this._combaterQueimada(jogador);
        break;
      case TipoAcao.COOPERAR:
        const outroJogadorId = args[0];
        const cartaId = args[1];
        acaoBemSucedida = this._cooperar(jogador, outroJogadorId, cartaId);
        break;
      case TipoAcao.PLANEJAMENTO:
        acaoBemSucedida = this._realizarPlanejamento(jogador);
        break;
      default:
        this.logger.addLog(`Ação desconhecida: ${acao}`, this.estado.turnoAtual);
        return false;
    }

    if (acaoBemSucedida) {
      jogador.acoesRestantes--;
      this.logger.addLog(`${jogador.nome} realizou a ação: ${acao}. Ações restantes: ${jogador.acoesRestantes}`, this.estado.turnoAtual);
      this._verificarCondicoesVitoria();
    }
    return acaoBemSucedida;
  }

  /**
   * Avança o jogo para o próximo turno, processando fases de queimadas e eventos.
   */
  public avancarTurno(): void {
    if (this.estado.jogoAcabou) {
      this.logger.addLog('O jogo já acabou. Não é possível avançar o turno.', this.estado.turnoAtual);
      return;
    }

    this.estado.turnoAtual++;
    this.logger.addLog(`--- Iniciando Turno ${this.estado.turnoAtual} ---`, this.estado.turnoAtual);

    this.estado.jogadores.forEach(jogador => {
      jogador.acoesRestantes = GAME_CONSTANTS.ACOES_POR_TURNO; // Reseta ações
      this._comprarCartasJogador(jogador); // Jogadores compram cartas no início do turno
    });


    this._processarFaseQueimada();
    this._processarFaseEvento();
    this._atualizarTrilhaFlora();

    this._verificarCondicoesVitoria();
    if (!this.estado.jogoAcabou) {
      this.logger.addLog(`Trilha de Queimada: ${this.estado.trilhaQueimada}, Trilha de Flora: ${this.estado.trilhaFlora}`, this.estado.turnoAtual);
    }
  }

  private _distribuirCartasIniciaisJogadores(): void {
    this.estado.jogadores.forEach(jogador => {
      for (let i = 0; i < GAME_CONSTANTS.CARTAS_INICIAIS_POR_JOGADOR; i++) {
        this._comprarCartaJogador(jogador);
      }
      this.logger.addLog(`${jogador.nome} recebeu suas cartas iniciais.`, this.estado.turnoAtual);
    });
  }

  private _distribuirQueimadasIniciais(): void {
    for (let i = 0; i < GAME_CONSTANTS.QUEIMADAS_INICIAIS; i++) {
      this._sortearNovaQueimada();
    }
  }

  private _comprarCartaJogador(jogador: Jogador): void {
    if (this.estado.baralhoJogador.length === 0) {
      this.logger.addLog('Baralho de Jogadores vazio, reembaralhando descarte.', this.estado.turnoAtual);
      if (this.estado.descarteJogador.length === 0) {
        // Se o descarte também estiver vazio, o baralho acabou completamente.
        this.logger.addLog('O baralho e descarte de jogadores estão vazios. Jogo pode acabar.', this.estado.turnoAtual);
        this.estado.vitoria = false; // Sinaliza possível derrota se não houver mais cartas
        this.estado.jogoAcabou = true;
        return;
      }
      this.estado.baralhoJogador = this.cardManager.shuffle(this.estado.descarteJogador);
      this.estado.descarteJogador = [];
    }

    const cartaId = this.estado.baralhoJogador.shift();
    if (cartaId) {
      jogador.mao.push(cartaId);
      this.logger.addLog(`${jogador.nome} comprou a carta: ${cartaId}.`, this.estado.turnoAtual);
    }
  }

  private _comprarCartasJogador(jogador: Jogador): void {
    // Exemplo: compra 2 cartas por turno
    for (let i = 0; i < 2; i++) {
      this._comprarCartaJogador(jogador);
    }
  }

  private _moverJogador(jogador: Jogador, destinoId: string): boolean {
    const localizacaoAtual = this.mapManager.findLocationById(jogador.localizacaoAtual);
    const destino = this.mapManager.findLocationById(destinoId);

    if (!localizacaoAtual || !destino) {
      this.logger.addLog(`Erro de movimento: Localização atual (${jogador.localizacaoAtual}) ou destino (${destinoId}) inválido para ${jogador.nome}.`, this.estado.turnoAtual);
      return false;
    }

    if (this.mapManager.areAdjacent(jogador.localizacaoAtual, destinoId)) {
      jogador.localizacaoAtual = destinoId;
      this.logger.addLog(`${jogador.nome} moveu-se para ${destino.estado}.`, this.estado.turnoAtual);
      return true;
    } else {
      this.logger.addLog(`Erro de movimento: ${jogador.nome} não pode se mover diretamente de ${localizacaoAtual.estado} para ${destino.estado}.`, this.estado.turnoAtual);
      return false;
    }
  }

  private _combaterQueimada(jogador: Jogador): boolean {
    const estadoQueimada = this.estado.estadosQueimadas.find(eq => eq.id === jogador.localizacaoAtual);

    if (!estadoQueimada || estadoQueimada.nivelQueimada === 0) {
      this.logger.addLog(`${jogador.nome} tentou combater queimada em ${jogador.localizacaoAtual}, mas não há queimada ativa.`, this.estado.turnoAtual);
      return false;
    }

    // A proteção ambiental pode dificultar o combate (futuro aprimoramento)
    // Por enquanto, apenas reduz o nível
    estadoQueimada.nivelQueimada = Math.max(0, estadoQueimada.nivelQueimada - 1);
    this.logger.addLog(`${jogador.nome} combateu queimada em ${estadoQueimada.id}. Nível atual: ${estadoQueimada.nivelQueimada}.`, this.estado.turnoAtual);
    return true;
  }

  private _cooperar(jogador1: Jogador, outroJogadorId: string, cartaId: string): boolean {
    const jogador2 = this.estado.jogadores.find(j => j.id === outroJogadorId);

    if (!jogador2 || jogador1.localizacaoAtual !== jogador2.localizacaoAtual) {
      this.logger.addLog(`Erro de cooperação: ${jogador1.nome} e ${jogador2?.nome || 'outro jogador'} não estão na mesma localização ou o jogador não existe.`, this.estado.turnoAtual);
      return false;
    }

    const cartaIndex = jogador1.mao.indexOf(cartaId);
    if (cartaIndex === -1) {
      this.logger.addLog(`Erro de cooperação: ${jogador1.nome} não possui a carta ${cartaId}.`, this.estado.turnoAtual);
      return false;
    }

    jogador1.mao.splice(cartaIndex, 1);
    jogador2.mao.push(cartaId);
    this.logger.addLog(`${jogador1.nome} cooperou com ${jogador2.nome}, trocando a carta ${cartaId}.`, this.estado.turnoAtual);
    return true;
  }

  private _realizarPlanejamento(jogador: Jogador): boolean {
    this.logger.addLog(`${jogador.nome} realizou uma ação de planejamento. (Funcionalidade a ser expandida: Ex: Comprar mais cartas, fortificar localização)`, this.estado.turnoAtual);
    // Exemplo: Um planejamento pode permitir comprar uma carta extra ou aumentar proteção ambiental em seu local.
    // jogador.mao.push(this.estado.baralhoJogador.shift()!); // Exemplo: compra uma carta
    // const estadoQueimada = this.estado.estadosQueimadas.find(eq => eq.id === jogador.localizacaoAtual);
    // if (estadoQueimada) {
    //   estadoQueimada.protecaoAmbiental = Math.min(100, estadoQueimada.protecaoAmbiental + 10);
    //   this.logger.addLog(`${jogador.nome} aumentou a proteção ambiental em ${estadoQueimada.id}.`, this.estado.turnoAtual);
    // }
    return true;
  }

  private _processarFaseQueimada(): void {
    this.logger.addLog('Iniciando Fase de Queimadas...', this.estado.turnoAtual);
    const numCartasQueimada = GAME_CONSTANTS.NUM_CARTAS_QUEIMADA_POR_FASE(this.estado.trilhaQueimada);

    for (let i = 0; i < numCartasQueimada; i++) {
      this._sortearNovaQueimada();
    }

    this.estado.estadosQueimadas.forEach(estado => {
      // Chance natural de queimada aumentar, influenciada pela proteção ambiental
      const chanceAumento = GAME_CONSTANTS.AUMENTO_CHANCE_QUEIMADA_NATURAL * (1 - estado.protecaoAmbiental / 100);
      if (estado.nivelQueimada > 0 && Math.random() < chanceAumento) {
        if (estado.nivelQueimada < GAME_CONSTANTS.MAX_NIVEL_QUEIMADA) {
          estado.nivelQueimada++;
          this.logger.addLog(`Queimada em ${estado.id} aumentou para nível ${estado.nivelQueimada} naturalmente.`, this.estado.turnoAtual);
        } else {
          this._propagarQueimada(estado.id);
        }
      }
    });

    const totalNivelQueimada = this.estado.estadosQueimadas.reduce((sum, eq) => sum + eq.nivelQueimada, 0);
    this.estado.trilhaQueimada = Math.min(GAME_CONSTANTS.MAX_TRILHA_QUEIMADA, totalNivelQueimada * 5); // Cada nível de queimada contribui para a trilha global
    this.logger.addLog(`Fase de Queimadas concluída. Trilha de Queimada atual: ${this.estado.trilhaQueimada}`, this.estado.turnoAtual);

    if (this.estado.trilhaQueimada >= GAME_CONSTANTS.MAX_TRILHA_QUEIMADA) {
      this._finalizarJogo(false);
      this.logger.addLog('O nível de queimadas atingiu o máximo! O jogo terminou em DERROTA.', this.estado.turnoAtual);
    }
  }

  private _sortearNovaQueimada(): void {
    if (this.estado.baralhoQueimada.length === 0) {
      this.logger.addLog('Baralho de Queimadas vazio, reembaralhando descarte.', this.estado.turnoAtual);
      this.estado.baralhoQueimada = this.cardManager.shuffle(this.estado.descarteQueimada);
      this.estado.descarteQueimada = [];
    }

    const estadoId = this.estado.baralhoQueimada.shift();
    if (estadoId) {
      this.estado.descarteQueimada.push(estadoId);
      const estadoQueimada = this.estado.estadosQueimadas.find(eq => eq.id === estadoId);
      if (estadoQueimada) {
        if (estadoQueimada.nivelQueimada < GAME_CONSTANTS.MAX_NIVEL_QUEIMADA) {
          estadoQueimada.nivelQueimada++;
          this.logger.addLog(`Nova queimada sorteada em ${estadoQueimada.id}. Nível: ${estadoQueimada.nivelQueimada}.`, this.estado.turnoAtual);
        } else {
          this._propagarQueimada(estadoQueimada.id);
        }
      }
    }
  }

  private _propagarQueimada(estadoId: string, estadosVisitados: Set<string> = new Set()): void {
    if (estadosVisitados.has(estadoId)) {
      return; // Evita loop infinito em caso de ciclos no mapa
    }
    estadosVisitados.add(estadoId);

    this.logger.addLog(`SURTO DE QUEIMADA em ${estadoId}!`, this.estado.turnoAtual);
    const localizacao = this.mapManager.findLocationById(estadoId);
    if (!localizacao) return;

    this.estado.trilhaQueimada = Math.min(GAME_CONSTANTS.MAX_TRILHA_QUEIMADA, this.estado.trilhaQueimada + GAME_CONSTANTS.AUMENTO_TRILHA_QUEIMADA_SURTO);

    localizacao.adjacentes.forEach(adjacenteId => {
      const estadoQueimadaAdjacente = this.estado.estadosQueimadas.find(eq => eq.id === adjacenteId);
      if (estadoQueimadaAdjacente) {
        if (estadoQueimadaAdjacente.nivelQueimada < GAME_CONSTANTS.MAX_NIVEL_QUEIMADA) {
          estadoQueimadaAdjacente.nivelQueimada++;
          this.logger.addLog(`Queimada se espalhou para ${estadoQueimadaAdjacente.id}. Nível: ${estadoQueimadaAdjacente.nivelQueimada}.`, this.estado.turnoAtual);
        } else {
          // Se atingiu o nível máximo, propaga novamente
          this._propagarQueimada(estadoQueimadaAdjacente.id, estadosVisitados);
        }
      }
    });
  }

  private _processarFaseEvento(): void {
    this.logger.addLog('Iniciando Fase de Eventos...', this.estado.turnoAtual);
    if (this.estado.baralhoEvento.length === 0) {
      this.logger.addLog('Baralho de Eventos vazio. Não há novos eventos.', this.estado.turnoAtual);
      return;
    }

    const cartaEvento = this.estado.baralhoEvento.shift();
    if (cartaEvento) {
      this.estado.descarteEvento.push(cartaEvento);
      this.eventManager.ativarCartaEvento(
        cartaEvento,
        this.estado,
        () => this._sortearNovaQueimada(),
        (id: string) => this.mapManager.findLocationById(id)
      );
    }
  }

  private _atualizarTrilhaFlora(): void {
    if (this.estado.trilhaQueimada < GAME_CONSTANTS.NIVEL_QUEIMADA_PARA_RECUPERACAO_FLORA) {
      this.estado.trilhaFlora = Math.min(GAME_CONSTANTS.MAX_TRILHA_FLORA, this.estado.trilhaFlora + GAME_CONSTANTS.RECUPERACAO_FLORA_TURNO_PADRAO);
      this.logger.addLog('A flora está se recuperando devido ao controle das queimadas.', this.estado.turnoAtual);
    } else {
      this.estado.trilhaFlora = Math.max(GAME_CONSTANTS.MIN_TRILHA_FLORA, this.estado.trilhaFlora - GAME_CONSTANTS.DEGRADACAO_FLORA_TURNO_PADRAO);
      this.logger.addLog('A flora está degradando devido ao alto nível de queimadas.', this.estado.turnoAtual);
    }
  }

  private _verificarCondicoesVitoria(): void {
    if (this.estado.jogoAcabou) return; // Já finalizado

    const todasQueimadasControladas = this.estado.estadosQueimadas.every(eq => eq.nivelQueimada === 0);
    const floraRecuperada = this.estado.trilhaFlora >= GAME_CONSTANTS.VITORIA_FLORA_LIMIAR;

    if (todasQueimadasControladas && floraRecuperada) {
      this._finalizarJogo(true);
      this.logger.addLog('Parabéns! Todas as queimadas controladas e a flora recuperada. VITÓRIA!', this.estado.turnoAtual);
      return;
    }

    if (this.estado.turnoAtual >= GAME_CONSTANTS.MAX_TURNOS) {
      this._finalizarJogo(false);
      this.logger.addLog(`Limite de ${GAME_CONSTANTS.MAX_TURNOS} turnos atingido. O jogo terminou em DERROTA.`, this.estado.turnoAtual);
      return;
    }

    if (this.estado.trilhaQueimada >= GAME_CONSTANTS.MAX_TRILHA_QUEIMADA) {
      this._finalizarJogo(false);
      this.logger.addLog('A trilha de queimada atingiu o máximo! O jogo terminou em DERROTA.', this.estado.turnoAtual);
      return;
    }

    if (this.estado.trilhaFlora <= GAME_CONSTANTS.MIN_TRILHA_FLORA) {
      this._finalizarJogo(false);
      this.logger.addLog('A flora foi completamente devastada! O jogo terminou em DERROTA.', this.estado.turnoAtual);
      return;
    }

    // Condição de derrota por falta de cartas no baralho de jogadores
    // Se o baralho de jogadores e o descarte estiverem vazios, e o jogo já tiver começado (turno > 1 para dar tempo de inicializar)
    if (this.estado.baralhoJogador.length === 0 && this.estado.descarteJogador.length === 0 && this.estado.turnoAtual > 1) {
      this._finalizarJogo(false);
      this.logger.addLog('O baralho de cartas dos jogadores acabou. Não há mais cartas para comprar. O jogo terminou em DERROTA.', this.estado.turnoAtual);
      return;
    }
  }

  private _finalizarJogo(vitoria: boolean): void {
    this.estado.jogoAcabou = true;
    this.estado.vitoria = vitoria;
    this.logger.addLog(`FIM DE JOGO! Resultado: ${vitoria ? 'VITÓRIA' : 'DERROTA'}`, this.estado.turnoAtual);
  }
}