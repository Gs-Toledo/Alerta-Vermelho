import { Localizacao, RegiaoBrasil } from './types';
import { INITIAL_BRAZIL_LOCATIONS } from '../constants/initial-brazil-locations';

/**
 * Classe para gerenciar as localizações do mapa do jogo.
 */
export class MapManager {
  private localizacoes: Localizacao[];

  constructor() {
    this.localizacoes = this._inicializarEstadosBrasileiros();
  }

  /**
   * Retorna a lista completa de localizações.
   * @returns Um array de objetos Localizacao.
   */
  public getLocalizacoes(): Localizacao[] {
    return [...this.localizacoes];
  }

  /**
   * Encontra uma localização pelo seu ID.
   * @param id - O ID da localização.
   * @returns O objeto Localizacao ou undefined se não encontrado.
   */
  public findLocationById(id: string): Localizacao | undefined {
    return this.localizacoes.find(loc => loc.id === id);
  }

  /**
   * Verifica se duas localizações são adjacentes.
   * @param loc1Id - O ID da primeira localização.
   * @param loc2Id - O ID da segunda localização.
   * @returns True se forem adjacentes, false caso contrário.
   */
  public areAdjacent(loc1Id: string, loc2Id: string): boolean {
    const loc1 = this.findLocationById(loc1Id);
    if (!loc1) return false;
    return loc1.adjacentes.includes(loc2Id);
  }

  /**
   * Inicializa os dados dos estados brasileiros como localizações do jogo.
   * @returns Um array de objetos Localizacao.
   */
  private _inicializarEstadosBrasileiros(): Localizacao[] {
    // Retorna uma cópia para evitar mutações diretas
    return JSON.parse(JSON.stringify(INITIAL_BRAZIL_LOCATIONS));
  }
}