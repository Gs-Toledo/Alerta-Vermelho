import { CartaEvento } from './types';
import { INITIAL_EVENT_CARDS } from './constants';

/**
 * Classe para gerenciar os baralhos do jogo (jogador, evento, queimada).
 */
export class CardManager {
  constructor() {}

  /**
   * Embaralha um array.
   * @param array - O array a ser embaralhado.
   * @returns O array embaralhado.
   */
  public shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Cria e embaralha o baralho de cartas de evento.
   * @returns Um array de CartaEvento embaralhado.
   */
  public createShuffledEventDeck(): CartaEvento[] {
    return this.shuffle(JSON.parse(JSON.stringify(INITIAL_EVENT_CARDS)));
  }
}