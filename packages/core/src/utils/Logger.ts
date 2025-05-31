import { MensagemLog } from './types';
import { GAME_CONSTANTS } from './constants';

/**
 * Classe utilitária para gerenciar o log de mensagens do jogo.
 */
export class Logger {
  private logs: MensagemLog[];

  constructor() {
    this.logs = [];
  }

  /**
   * Adiciona uma mensagem ao log.
   * @param mensagem - A mensagem a ser logada.
   * @param turno - O turno atual do jogo.
   */
  public addLog(mensagem: string, turno: number): void {
    const newLog: MensagemLog = {
      turno: turno,
      mensagem: mensagem,
      timestamp: new Date(),
    };
    this.logs.push(newLog);
    if (this.logs.length > GAME_CONSTANTS.MAX_LOG_MESSAGES) {
      this.logs.shift(); // Remove a mensagem mais antiga se exceder o limite
    }
  }

  /**
   * Retorna todas as mensagens de log.
   * @returns Um array de objetos MensagemLog.
   */
  public getLogs(): MensagemLog[] {
    return [...this.logs];
  }

  /**
   * Limpa todas as mensagens de log.
   */
  public clearLogs(): void {
    this.logs = [];
  }
}