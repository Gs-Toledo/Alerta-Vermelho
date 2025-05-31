import { CartaEvento, EstadoJogo, EstadoQueimada, Jogador, Localizacao, TipoEvento } from './types';
import { GAME_CONSTANTS } from './constants';
import { Logger } from './Logger';
import { CardManager } from './CardManager';

/**
 * Classe responsável por ativar e aplicar os efeitos das cartas de evento.
 */
export class EventManager {
  private logger: Logger;
  private cardManager: CardManager;

  constructor(logger: Logger, cardManager: CardManager) {
    this.logger = logger;
    this.cardManager = cardManager;
  }

  /**
   * Ativa os efeitos de uma carta de evento no estado do jogo.
   * @param carta - A carta de evento a ser ativada.
   * @param estado - O estado atual do jogo.
   * @param sortearNovaQueimadaCb - Callback para sortear uma nova queimada (usado por QUEIMADA_INTENSA).
   * @param getLocalizacaoCb - Callback para obter uma localização por ID (usado por CHUVA_BENEFICA, CONSCIENTIZACAO).
   */
  public ativarCartaEvento(
    carta: CartaEvento,
    estado: EstadoJogo,
    sortearNovaQueimadaCb: () => void,
    getLocalizacaoCb: (id: string) => Localizacao | undefined
  ): void {
    this.logger.addLog(`Evento ativado: ${carta.descricao}`, estado.turnoAtual);

    switch (carta.tipo) {
      case TipoEvento.QUEIMADA_INTENSA:
        sortearNovaQueimadaCb();
        this.logger.addLog('Uma queimada intensa forçou o surgimento de uma nova queimada!', estado.turnoAtual);
        break;
      case TipoEvento.SECA_PROLONGADA:
        estado.trilhaQueimada = Math.min(
          GAME_CONSTANTS.MAX_TRILHA_QUEIMADA,
          estado.trilhaQueimada + GAME_CONSTANTS.FATORES_EVENTOS.SECA_PROLONGADA_AUMENTO_QUEIMADA
        );
        this.logger.addLog(`A seca prolongada intensificou as queimadas! Trilha de Queimada aumentou para ${estado.trilhaQueimada}.`, estado.turnoAtual);
        break;
      case TipoEvento.CHUVA_BENEFICA:
        const estadosComQueimada = estado.estadosQueimadas.filter(eq => eq.nivelQueimada > 0);
        if (estadosComQueimada.length > 0) {
          const estadoAlvo = estadosComQueimada[Math.floor(Math.random() * estadosComQueimada.length)];
          estadoAlvo.nivelQueimada = Math.max(0, estadoAlvo.nivelQueimada - GAME_CONSTANTS.FATORES_EVENTOS.CHUVA_BENEFICA_REDUCAO_QUEIMADA);
          estado.trilhaFlora = Math.min(
            GAME_CONSTANTS.MAX_TRILHA_FLORA,
            estado.trilhaFlora + GAME_CONSTANTS.FATORES_EVENTOS.CHUVA_BENEFICA_AUMENTO_FLORA
          );
          const locAlvo = getLocalizacaoCb(estadoAlvo.id);
          this.logger.addLog(`Chuva benéfica em ${locAlvo?.estado || estadoAlvo.id}. Nível de queimada reduzido para ${estadoAlvo.nivelQueimada} e flora recuperada para ${estado.trilhaFlora}.`, estado.turnoAtual);
        } else {
          estado.trilhaFlora = Math.min(
            GAME_CONSTANTS.MAX_TRILHA_FLORA,
            estado.trilhaFlora + GAME_CONSTANTS.FATORES_EVENTOS.CHUVA_BENEFICA_AUMENTO_FLORA_SEM_QUEIMADA
          );
          this.logger.addLog(`Chuva benéfica, mas não há queimadas ativas para reduzir. Flora recuperada para ${estado.trilhaFlora}.`, estado.turnoAtual);
        }
        break;
      case TipoEvento.CONSCIENTIZACAO:
        const estadoParaProteger = estado.estadosQueimadas[Math.floor(Math.random() * estado.estadosQueimadas.length)];
        estadoParaProteger.protecaoAmbiental = Math.min(
          100,
          estadoParaProteger.protecaoAmbiental + GAME_CONSTANTS.FATORES_EVENTOS.CONSCIENTIZACAO_AUMENTO_PROTECAO
        );
        const locProteger = getLocalizacaoCb(estadoParaProteger.id);
        this.logger.addLog(`Campanha de conscientização em ${locProteger?.estado || estadoParaProteger.id}. Proteção ambiental aumentada para ${estadoParaProteger.protecaoAmbiental}.`, estado.turnoAtual);
        break;
      case TipoEvento.VERBA_EMERGENCIAL:
        const jogadorAlvo = estado.jogadores[Math.floor(Math.random() * estado.jogadores.length)];
        jogadorAlvo.acoesRestantes += GAME_CONSTANTS.FATORES_EVENTOS.VERBA_EMERGENCIAL_ACOES_EXTRA;
        this.logger.addLog(`Verba emergencial concedida a ${jogadorAlvo.nome}. Ele(a) ganhou ${GAME_CONSTANTS.FATORES_EVENTOS.VERBA_EMERGENCIAL_ACOES_EXTRA} ação extra!`, estado.turnoAtual);
        break;
      default:
        this.logger.addLog(`Tipo de evento desconhecido: ${carta.tipo}.`, estado.turnoAtual);
    }
  }
}