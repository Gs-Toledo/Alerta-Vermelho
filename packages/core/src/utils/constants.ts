import { RegiaoBrasil, TipoEvento } from './types';

export const GAME_CONSTANTS = {
  MAX_NIVEL_QUEIMADA: 3,
  MAX_TRILHA_QUEIMADA: 100,
  MAX_TRILHA_FLORA: 100,
  MIN_TRILHA_FLORA: 0,
  MAX_TURNOS: 30,
  ACOES_POR_TURNO: 4,
  CARTAS_INICIAIS_POR_JOGADOR: 2,
  QUEIMADAS_INICIAIS: 3,
  AUMENTO_CHANCE_QUEIMADA_NATURAL: 0.2, // 20% de chance de queimada aumentar de nível naturalmente
  AUMENTO_TRILHA_QUEIMADA_SURTO: 10,
  RECUPERACAO_FLORA_TURNO_PADRAO: 5,
  DEGRADACAO_FLORA_TURNO_PADRAO: 5,
  NIVEL_QUEIMADA_PARA_RECUPERACAO_FLORA: 50, // Se trilhaQueimada < 50, flora recupera
  FATORES_EVENTOS: {
    SECA_PROLONGADA_AUMENTO_QUEIMADA: 15,
    CHUVA_BENEFICA_REDUCAO_QUEIMADA: 1,
    CHUVA_BENEFICA_AUMENTO_FLORA: 10,
    CHUVA_BENEFICA_AUMENTO_FLORA_SEM_QUEIMADA: 5,
    CONSCIENTIZACAO_AUMENTO_PROTECAO: 20,
    VERBA_EMERGENCIAL_ACOES_EXTRA: 1,
  },
  VITORIA_FLORA_LIMIAR: 80, // Nível de flora para vitória
  NUM_CARTAS_QUEIMADA_POR_FASE: (trilhaQueimada: number) => Math.floor(trilhaQueimada / 20) + 1, // Ex: 0-19: 1 carta, 20-39: 2 cartas, etc.
  MAX_LOG_MESSAGES: 100,
};

export const INITIAL_BRAZIL_LOCATIONS = [
  { id: 'AM', estado: 'Amazonas', regiao: RegiaoBrasil.NORTE, adjacentes: ['PA', 'RO', 'RR'] },
  { id: 'PA', estado: 'Pará', regiao: RegiaoBrasil.NORTE, adjacentes: ['AM', 'MA', 'TO'] },
  { id: 'MA', estado: 'Maranhão', regiao: RegiaoBrasil.NORDESTE, adjacentes: ['PA', 'PI', 'TO'] },
  { id: 'PI', estado: 'Piauí', regiao: RegiaoBrasil.NORDESTE, adjacentes: ['MA', 'CE', 'PE'] },
  { id: 'CE', estado: 'Ceará', regiao: RegiaoBrasil.NORDESTE, adjacentes: ['PI', 'RN', 'PB'] },
  { id: 'RN', estado: 'Rio Grande do Norte', regiao: RegiaoBrasil.NORDESTE, adjacentes: ['CE', 'PB'] },
  { id: 'PB', estado: 'Paraíba', regiao: RegiaoBrasil.NORDESTE, adjacentes: ['CE', 'RN', 'PE'] },
  { id: 'PE', estado: 'Pernambuco', regiao: RegiaoBrasil.NORDESTE, adjacentes: ['PI', 'PB', 'AL', 'BA'] },
  { id: 'AL', estado: 'Alagoas', regiao: RegiaoBrasil.NORDESTE, adjacentes: ['PE', 'SE'] },
  { id: 'SE', estado: 'Sergipe', regiao: RegiaoBrasil.NORDESTE, adjacentes: ['AL', 'BA'] },
  { id: 'BA', estado: 'Bahia', regiao: RegiaoBrasil.NORDESTE, adjacentes: ['PE', 'SE', 'MG', 'GO', 'TO'] },
  { id: 'TO', estado: 'Tocantins', regiao: RegiaoBrasil.NORTE, adjacentes: ['PA', 'MA', 'BA', 'GO', 'MT'] },
  { id: 'MT', estado: 'Mato Grosso', regiao: RegiaoBrasil.CENTRO_OESTE, adjacentes: ['RO', 'AM', 'PA', 'TO', 'GO', 'MS'] },
  { id: 'GO', estado: 'Goiás', regiao: RegiaoBrasil.CENTRO_OESTE, adjacentes: ['DF', 'MT', 'TO', 'BA', 'MG', 'MS'] },
  { id: 'DF', estado: 'Distrito Federal', regiao: RegiaoBrasil.CENTRO_OESTE, adjacentes: ['GO'] },
  { id: 'MS', estado: 'Mato Grosso do Sul', regiao: RegiaoBrasil.CENTRO_OESTE, adjacentes: ['MT', 'GO', 'MG', 'PR'] },
  { id: 'MG', estado: 'Minas Gerais', regiao: RegiaoBrasil.SUDESTE, adjacentes: ['BA', 'GO', 'MS', 'SP', 'RJ', 'ES'] },
  { id: 'ES', estado: 'Espírito Santo', regiao: RegiaoBrasil.SUDESTE, adjacentes: ['MG', 'RJ'] },
  { id: 'RJ', estado: 'Rio de Janeiro', regiao: RegiaoBrasil.SUDESTE, adjacentes: ['MG', 'ES', 'SP'] },
  { id: 'SP', estado: 'São Paulo', regiao: RegiaoBrasil.SUDESTE, adjacentes: ['MG', 'RJ', 'PR', 'MS'] },
  { id: 'PR', estado: 'Paraná', regiao: RegiaoBrasil.SUL, adjacentes: ['MS', 'SP', 'SC'] },
  { id: 'SC', estado: 'Santa Catarina', regiao: RegiaoBrasil.SUL, adjacentes: ['PR', 'RS'] },
  { id: 'RS', estado: 'Rio Grande do Sul', regiao: RegiaoBrasil.SUL, adjacentes: ['SC'] },
  { id: 'RO', estado: 'Rondônia', regiao: RegiaoBrasil.NORTE, adjacentes: ['AM', 'MT', 'AC'] },
  { id: 'RR', estado: 'Roraima', regiao: RegiaoBrasil.NORTE, adjacentes: ['AM'] },
  { id: 'AC', estado: 'Acre', regiao: RegiaoBrasil.NORTE, adjacentes: ['RO', 'AM'] },
];

export const INITIAL_EVENT_CARDS = [
  { tipo: TipoEvento.QUEIMADA_INTENSA, descricao: 'Uma queimada inesperada surge em uma nova localização.' },
  { tipo: TipoEvento.SECA_PROLONGADA, descricao: 'Aumenta o risco de novas queimadas em todas as regiões.' },
  { tipo: TipoEvento.CHUVA_BENEFICA, descricao: 'Diminui o nível de queimada em uma localização e aumenta a flora.' },
  { tipo: TipoEvento.CONSCIENTIZACAO, descricao: 'Aumenta a proteção ambiental em uma localização.' },
  { tipo: TipoEvento.VERBA_EMERGENCIAL, descricao: 'Permite uma ação extra para qualquer jogador neste turno.' },
  { tipo: TipoEvento.CHUVA_BENEFICA, descricao: 'Diminui o nível de queimada em uma localização e aumenta a flora.' },
  { tipo: TipoEvento.CONSCIENTIZACAO, descricao: 'Aumenta a proteção ambiental em uma localização.' },
  // Adicione mais cartas de evento para variedade
  { tipo: TipoEvento.VERBA_EMERGENCIAL, descricao: 'Uma verba inesperada acelera o combate às queimadas.' },
  { tipo: TipoEvento.SECA_PROLONGADA, descricao: 'Condições climáticas adversas intensificam a seca.' },
];