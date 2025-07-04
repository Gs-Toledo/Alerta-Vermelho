import { RegiaoBrasil } from '../utils/types';

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