export enum RegiaoBrasil {
  NORTE = "Norte",
  NORDESTE = "Nordeste",
  CENTRO_OESTE = "Centro-Oeste",
  SUDESTE = "Sudeste",
  SUL = "Sul",
}

export enum CargoJogador {
  MINISTRO_MEIO_AMBIENTE = "Ministro do Meio Ambiente",
  GOVERNADOR = "Governador",
  PARLAMENTAR = "Parlamentar",
}

export enum TipoAcao {
  MOVER = "Mover",
  COMBATER_QUEIMADA = "Combater Queimada",
  COOPERAR = "Cooperar com outro jogador",
  PLANEJAMENTO = "Realizar ações de planejamento",
  CONSTRUIR_CENTRO = "Construir Centro de Prevenção",
  DECRETAR_MORATORIA = "Decretar Moratória Regional",
}

export enum TipoEvento {
  QUEIMADA_INTENSA = "Queimada Intensa",
  SECA_PROLONGADA = "Seca Prolongada",
  CHUVA_BENEFICA = "Chuva Benéfica",
  CONSCIENTIZACAO = "Campanha de Conscientização",
  VERBA_EMERGENCIAL = "Verba Emergencial",
}

export interface Localizacao {
  id: string;
  regiao: RegiaoBrasil;
  estado: string;
  adjacentes: string[];
}

export interface Jogador {
  id: string;
  nome: string;
  cargo: CargoJogador;
  mao: string[];
  localizacaoAtual: string;
  acoesRestantes: number;
}

export interface EstadoQueimada {
  id: string;
  nivelQueimada: number; // 0: sem queimada, 1-3: níveis de queimada
  protecaoAmbiental: number; // 0-100, maior valor = mais protegido
  populacaoAfetada: number; // 0-100%
}

export interface CartaEvento {
  tipo: TipoEvento;
  descricao: string;
}

export interface CartaEstado {
  estadoId: string;
  regiao: RegiaoBrasil;
}

export interface MensagemLog {
  turno: number;
  mensagem: string;
  timestamp: Date;
}

export interface EstadoJogo {
  jogadores: Jogador[];
  localizacoes: Localizacao[];
  estadosQueimadas: EstadoQueimada[];
  baralhoJogador: string[];
  descarteJogador: string[];
  baralhoEvento: CartaEvento[];
  descarteEvento: CartaEvento[];
  baralhoQueimada: string[];
  descarteQueimada: string[];
  trilhaQueimada: number; // 0-100, maior valor = mais queimadas
  trilhaFlora: number; // 0-100, maior valor = flora saudável
  turnoAtual: number;
  jogoAcabou: boolean;
  vitoria: boolean | null;
  mensagensLog: MensagemLog[];
  centrosDePrevencao: string[];
  moratoriasDecretadas: RegiaoBrasil[];
}
