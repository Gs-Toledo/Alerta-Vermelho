// Tipos base do jogo

// Enums
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
}

export enum TipoEvento {
  QUEIMADA_INTENSA = "Queimada Intensa",
  SECA_PROLONGADA = "Seca Prolongada",
  CHUVA_BENEFICA = "Chuva Benéfica",
  CONSCIENTIZACAO = "Campanha de Conscientização",
  VERBA_EMERGENCIAL = "Verba Emergencial",
}

// Interfaces
export interface Localizacao {
  regiao: RegiaoBrasil
  estado: string
  adjacentes: string[] // IDs dos estados adjacentes
}

export interface Jogador {
  id: string
  nome: string
  cargo: CargoJogador
  localizacaoAtual: string // ID do estado
  acoesPorTurno: number
  acoesRestantes: number
  habilidadeEspecial: string
  recursos: number
}

export interface EstadoQueimada {
  id: string
  estado: string
  regiao: RegiaoBrasil
  nivelQueimada: number // 0-3 (0: sem queimada, 3: crítico)
  protecaoAmbiental: number // 0-3 (medidas preventivas implementadas)
}

export interface Evento {
  tipo: TipoEvento
  descricao: string
  efeito: (jogo: EstadoJogo) => void
}

export interface EstadoJogo {
  jogadores: Jogador[]
  estadosQueimadas: EstadoQueimada[]
  mapaCompleto: Localizacao[]
  jogadorAtual: number // índice do jogador atual no array de jogadores
  trilhaFlora: number // 0-100% (0: desmatamento total, 100: flora saudável)
  contadorSurtos: number
  baralhoEventos: Evento[]
  turnoAtual: number
  eventosAtivos: Evento[]
}

// Funções do jogo

// Inicialização
export function inicializarJogo(nomesJogadores: string[]): EstadoJogo {
  if (nomesJogadores.length !== 3) {
    throw new Error("O jogo requer exatamente 3 jogadores")
  }

  // Criar jogadores com cargos aleatórios
  const cargosDisponiveis = [CargoJogador.MINISTRO_MEIO_AMBIENTE, CargoJogador.GOVERNADOR, CargoJogador.PARLAMENTAR]

  const jogadores: Jogador[] = nomesJogadores.map((nome, index) => {
    const cargoIndex = Math.floor(Math.random() * cargosDisponiveis.length)
    const cargo = cargosDisponiveis.splice(cargoIndex, 1)[0]

    return {
      id: `jogador-${index + 1}`,
      nome,
      cargo,
      localizacaoAtual: "DF", // Todos começam em Brasília
      acoesPorTurno: 4,
      acoesRestantes: 4,
      habilidadeEspecial: obterHabilidadeEspecial(cargo),
      recursos: 3,
    }
  })

  // Inicializar o mapa com estados brasileiros
  const mapaCompleto = criarMapaBrasil()

  // Inicializar estados de queimada
  const estadosQueimadas = inicializarEstadosQueimada(mapaCompleto)

  // Inicializar baralho de eventos
  const baralhoEventos = criarBaralhoEventos()

  return {
    jogadores,
    estadosQueimadas,
    mapaCompleto,
    jogadorAtual: 0,
    trilhaFlora: 70, // Começa com 70% da flora saudável
    contadorSurtos: 0,
    baralhoEventos,
    turnoAtual: 1,
    eventosAtivos: [],
  }
}

// Função auxiliar para obter habilidade especial baseada no cargo
function obterHabilidadeEspecial(cargo: CargoJogador): string {
  switch (cargo) {
    case CargoJogador.MINISTRO_MEIO_AMBIENTE:
      return "Pode implementar medidas preventivas com custo reduzido"
    case CargoJogador.GOVERNADOR:
      return "Pode mover-se para qualquer estado da sua região atual sem custo de ação"
    case CargoJogador.PARLAMENTAR:
      return "Pode gerar recursos adicionais uma vez por rodada"
    default:
      return ""
  }
}

// Função para criar o mapa do Brasil
function criarMapaBrasil(): Localizacao[] {
  // Esta seria uma implementação mais complexa com todos os estados
  // Para exemplo, vou incluir alguns estados com suas adjacências
  return [
    {
      regiao: RegiaoBrasil.CENTRO_OESTE,
      estado: "DF",
      adjacentes: ["GO", "MG"],
    },
    {
      regiao: RegiaoBrasil.CENTRO_OESTE,
      estado: "GO",
      adjacentes: ["DF", "MT", "MS", "MG", "BA", "TO"],
    },
    {
      regiao: RegiaoBrasil.SUDESTE,
      estado: "SP",
      adjacentes: ["RJ", "MG", "MS", "PR"],
    },
    // Adicionar outros estados...
  ]
}

// Inicializa estados de queimada com níveis aleatórios em algumas regiões
function inicializarEstadosQueimada(mapa: Localizacao[]): EstadoQueimada[] {
  return mapa.map((local) => ({
    id: local.estado,
    estado: local.estado,
    regiao: local.regiao,
    nivelQueimada: Math.random() < 0.3 ? Math.floor(Math.random() * 2) + 1 : 0,
    protecaoAmbiental: 0,
  }))
}

// Cria baralho de eventos aleatórios
function criarBaralhoEventos(): Evento[] {
  const eventos: Evento[] = [
    {
      tipo: TipoEvento.QUEIMADA_INTENSA,
      descricao: "Queimada intensa atinge uma região aleatória",
      efeito: (jogo) => {
        const regiaoAleatoria = Object.values(RegiaoBrasil)[Math.floor(Math.random() * 5)]
        const estadosRegiao = jogo.estadosQueimadas.filter((eq) => eq.regiao === regiaoAleatoria)

        estadosRegiao.forEach((estado) => {
          if (estado.nivelQueimada < 3) {
            estado.nivelQueimada += 1
          } else {
            // Surto de queimada
            propagarQueimada(jogo, estado.id)
          }
        })
      },
    },
    {
      tipo: TipoEvento.SECA_PROLONGADA,
      descricao: "Seca prolongada aumenta risco de queimadas",
      efeito: (jogo) => {
        jogo.trilhaFlora = Math.max(0, jogo.trilhaFlora - 5)
      },
    },
    {
      tipo: TipoEvento.CHUVA_BENEFICA,
      descricao: "Chuvas beneficiam o combate às queimadas",
      efeito: (jogo) => {
        const estadosComQueimada = jogo.estadosQueimadas.filter((eq) => eq.nivelQueimada > 0)
        const estadoAleatorio = estadosComQueimada[Math.floor(Math.random() * estadosComQueimada.length)]

        if (estadoAleatorio) {
          estadoAleatorio.nivelQueimada = Math.max(0, estadoAleatorio.nivelQueimada - 1)
        }

        jogo.trilhaFlora = Math.min(100, jogo.trilhaFlora + 3)
      },
    },
    // Adicionar mais eventos...
  ]

  // Embaralhar eventos
  return eventos.sort(() => Math.random() - 0.5)
}

// Propagação de queimada em caso de surto
function propagarQueimada(jogo: EstadoJogo, estadoId: string): void {
  const estado = jogo.estadosQueimadas.find((eq) => eq.id === estadoId)
  if (!estado) return

  jogo.contadorSurtos += 1

  const estadoNoMapa = jogo.mapaCompleto.find((loc) => loc.estado === estadoId)
  if (!estadoNoMapa) return

  // Propagar para estados adjacentes
  estadoNoMapa.adjacentes.forEach((adjId) => {
    const estadoAdj = jogo.estadosQueimadas.find((eq) => eq.id === adjId)
    if (estadoAdj && estadoAdj.nivelQueimada < 3) {
      estadoAdj.nivelQueimada += 1
    }
  })

  // Reduzir trilha de flora
  jogo.trilhaFlora = Math.max(0, jogo.trilhaFlora - 3)

  // Verificar condição de derrota
  if (jogo.contadorSurtos >= 8 || jogo.trilhaFlora <= 0) {
    finalizarJogo(jogo, false)
  }
}

// Ações dos jogadores

// Mover para outro estado
export function moverJogador(jogo: EstadoJogo, estadoDestino: string): boolean {
  const jogadorAtual = jogo.jogadores[jogo.jogadorAtual]

  // Verificar se jogador tem ações restantes
  if (jogadorAtual.acoesRestantes <= 0) {
    return false
  }

  // Verificar se o destino é adjacente ou se o jogador é governador da região
  const estadoAtual = jogo.mapaCompleto.find((loc) => loc.estado === jogadorAtual.localizacaoAtual)
  const isAdjacente = estadoAtual?.adjacentes.includes(estadoDestino)

  const estadoDestinoObj = jogo.mapaCompleto.find((loc) => loc.estado === estadoDestino)
  const mesmaRegiao = estadoAtual?.regiao === estadoDestinoObj?.regiao

  // Governador pode se mover sem custo dentro da sua região
  const isGovernadoMesmaRegiao = jogadorAtual.cargo === CargoJogador.GOVERNADOR && mesmaRegiao

  if (!isAdjacente && !isGovernadoMesmaRegiao) {
    return false
  }

  // Executar movimento
  jogadorAtual.localizacaoAtual = estadoDestino

  // Diminuir ações restantes (exceto para governador na mesma região)
  if (!isGovernadoMesmaRegiao) {
    jogadorAtual.acoesRestantes -= 1
  }

  return true
}

// Combater queimada no estado atual
export function combaterQueimada(jogo: EstadoJogo): boolean {
  const jogadorAtual = jogo.jogadores[jogo.jogadorAtual]

  // Verificar se jogador tem ações restantes
  if (jogadorAtual.acoesRestantes <= 0) {
    return false
  }

  const estadoAtual = jogo.estadosQueimadas.find((eq) => eq.id === jogadorAtual.localizacaoAtual)

  if (!estadoAtual || estadoAtual.nivelQueimada <= 0) {
    return false // Não há queimada para combater
  }

  // Reduzir nível de queimada
  estadoAtual.nivelQueimada -= 1
  jogadorAtual.acoesRestantes -= 1

  // Se o jogador é Ministro do Meio Ambiente, tem chance de reduzir um nível adicional
  if (jogadorAtual.cargo === CargoJogador.MINISTRO_MEIO_AMBIENTE && Math.random() < 0.3) {
    estadoAtual.nivelQueimada = Math.max(0, estadoAtual.nivelQueimada - 1)
  }

  return true
}

// Cooperar com outro jogador
export function cooperarComJogador(jogo: EstadoJogo, jogadorAlvoId: string): boolean {
  const jogadorAtual = jogo.jogadores[jogo.jogadorAtual]
  const jogadorAlvo = jogo.jogadores.find((j) => j.id === jogadorAlvoId)

  // Verificar se jogador tem ações restantes
  if (jogadorAtual.acoesRestantes <= 0) {
    return false
  }

  // Verificar se jogadores estão no mesmo local
  if (!jogadorAlvo || jogadorAtual.localizacaoAtual !== jogadorAlvo.localizacaoAtual) {
    return false
  }

  // Transferir um recurso
  if (jogadorAtual.recursos > 0) {
    jogadorAtual.recursos -= 1
    jogadorAlvo.recursos += 1
    jogadorAtual.acoesRestantes -= 1
    return true
  }

  return false
}

// Realizar ação de planejamento (aumentar proteção ambiental)
export function realizarPlanejamento(jogo: EstadoJogo): boolean {
  const jogadorAtual = jogo.jogadores[jogo.jogadorAtual]

  // Verificar se jogador tem ações e recursos suficientes
  if (jogadorAtual.acoesRestantes <= 0 || jogadorAtual.recursos < 1) {
    return false
  }

  const estadoAtual = jogo.estadosQueimadas.find((eq) => eq.id === jogadorAtual.localizacaoAtual)

  if (!estadoAtual || estadoAtual.protecaoAmbiental >= 3) {
    return false // Já tem proteção máxima
  }

  // Custo reduzido para o Ministro do Meio Ambiente
  const custoRecursos = jogadorAtual.cargo === CargoJogador.MINISTRO_MEIO_AMBIENTE ? 1 : 2

  if (jogadorAtual.recursos < custoRecursos) {
    return false
  }

  // Implementar proteção
  estadoAtual.protecaoAmbiental += 1
  jogadorAtual.recursos -= custoRecursos
  jogadorAtual.acoesRestantes -= 1

  return true
}

// Função para parlamentar gerar recursos (habilidade especial)
export function gerarRecursos(jogo: EstadoJogo): boolean {
  const jogadorAtual = jogo.jogadores[jogo.jogadorAtual]

  if (jogadorAtual.cargo !== CargoJogador.PARLAMENTAR) {
    return false
  }

  if (jogadorAtual.acoesRestantes <= 0) {
    return false
  }

  jogadorAtual.recursos += 2
  jogadorAtual.acoesRestantes -= 1

  return true
}

// Final de turno e processamento de eventos
export function finalizarTurnoJogador(jogo: EstadoJogo): void {
  const jogadorAtual = jogo.jogadores[jogo.jogadorAtual]

  // Resetar ações restantes
  jogadorAtual.acoesRestantes = jogadorAtual.acoesPorTurno

  // Avançar para o próximo jogador
  jogo.jogadorAtual = (jogo.jogadorAtual + 1) % jogo.jogadores.length

  // Se voltamos ao primeiro jogador, incrementar o turno e processar eventos
  if (jogo.jogadorAtual === 0) {
    jogo.turnoAtual += 1
    processarEventoFimRodada(jogo)
    verificarCondicoesVitoria(jogo)
  }
}

// Processar evento ao final da rodada
function processarEventoFimRodada(jogo: EstadoJogo): void {
  if (jogo.baralhoEventos.length === 0) {
    // Se acabaram os eventos, reciclar o baralho
    jogo.baralhoEventos = criarBaralhoEventos()
  }

  // Puxar um evento e aplicar seu efeito
  const evento = jogo.baralhoEventos.pop()
  if (evento) {
    evento.efeito(jogo)
    jogo.eventosAtivos.push(evento)

    // Limitar o número de eventos ativos para não sobrecarregar a interface
    if (jogo.eventosAtivos.length > 3) {
      jogo.eventosAtivos.shift()
    }
  }

  // Processar propagação automática de queimadas
  processarPropagacaoQueimadas(jogo)
}

// Processar propagação automática de queimadas
function processarPropagacaoQueimadas(jogo: EstadoJogo): void {
  // Chance de novas queimadas baseada na trilha de flora
  const chancePropagacao = Math.max(0.1, 0.4 - jogo.trilhaFlora / 200) // 0.1 a 0.4

  jogo.estadosQueimadas.forEach((estado) => {
    // Estados com proteção têm menos chance de queimada
    const chanceAjustada = Math.max(0, chancePropagacao - estado.protecaoAmbiental * 0.05)

    if (Math.random() < chanceAjustada) {
      if (estado.nivelQueimada < 3) {
        estado.nivelQueimada += 1
      } else {
        // Surto de queimada
        propagarQueimada(jogo, estado.id)
      }
    }
  })
}

// Verificar condições de vitória
function verificarCondicoesVitoria(jogo: EstadoJogo): void {
  // Condição de vitória: Todas as queimadas controladas e flora acima de 80%
  const todasQueimadasControladas = jogo.estadosQueimadas.every((eq) => eq.nivelQueimada === 0)
  const floraRecuperada = jogo.trilhaFlora >= 80

  if (todasQueimadasControladas && floraRecuperada) {
    finalizarJogo(jogo, true)
  }

  // Limite de turnos como condição alternativa de derrota
  if (jogo.turnoAtual >= 30) {
    finalizarJogo(jogo, false)
  }
}

// Finalizar o jogo com vitória ou derrota
function finalizarJogo(jogo: EstadoJogo, vitoria: boolean): void {
  // Esta função pode enviar um evento para a UI indicando o fim de jogo
  // e mostrar estatísticas, pontuação etc.
  console.log(`Jogo finalizado com ${vitoria ? "vitória" : "derrota"}!`)
  console.log(`Turnos jogados: ${jogo.turnoAtual}`)
  console.log(`Flora restante: ${jogo.trilhaFlora}%`)
  console.log(`Surtos ocorridos: ${jogo.contadorSurtos}`)
}