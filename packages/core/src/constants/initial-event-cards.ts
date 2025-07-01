import { TipoEvento } from '../utils/types';

export const INITIAL_EVENT_CARDS = [
  { tipo: TipoEvento.QUEIMADA_INTENSA, descricao: 'Uma queimada inesperada surge em uma nova localização.' },
  { tipo: TipoEvento.SECA_PROLONGADA, descricao: 'Aumenta o risco de novas queimadas em todas as regiões.' },
  { tipo: TipoEvento.CHUVA_BENEFICA, descricao: 'Diminui o nível de queimada em uma localização e aumenta a flora.' },
  { tipo: TipoEvento.CONSCIENTIZACAO, descricao: 'Aumenta a proteção ambiental em uma localização.' },
  { tipo: TipoEvento.VERBA_EMERGENCIAL, descricao: 'Permite uma ação extra para qualquer jogador neste turno.' },
  { tipo: TipoEvento.CHUVA_BENEFICA, descricao: 'Diminui o nível de queimada em uma localização e aumenta a flora.' },
  { tipo: TipoEvento.CONSCIENTIZACAO, descricao: 'Aumenta a proteção ambiental em uma localização.' },
  { tipo: TipoEvento.VERBA_EMERGENCIAL, descricao: 'Uma verba inesperada acelera o combate às queimadas.' },
  { tipo: TipoEvento.SECA_PROLONGADA, descricao: 'Condições climáticas adversas intensificam a seca.' },
];