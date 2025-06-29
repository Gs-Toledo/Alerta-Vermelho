import { useGame } from "../context/GameContext";
import {
    TipoAcao,
    type Localizacao,
    type Jogador,
    type EstadoQueimada,
} from "../../../core/src";
import { PLAYER_COLORS } from "@/config/ui-config";

interface LocationMarkerProps {
    location: Localizacao;
    fireState?: EstadoQueimada;
    players: Jogador[];
}

const fireColors = [
    "bg-transparent",
    "bg-yellow-500",
    "bg-orange-600",
    "bg-red-700",
];

const getPlayerIndex = (player: Jogador): number => {
    return parseInt(player.id.split("-")[1], 10) - 1;
};

export default function LocationMarker({
    location,
    fireState,
    players,
}: LocationMarkerProps) {
    const {
        gameState,
        actionState,
        performAction,
        inspectedLocationId,
        setInspectedLocationId,
    } = useGame();

    let isTarget = false;
    let isAdjacent = false;

    if (actionState.type === "SELECTING_MOVE_TARGET") {
        isAdjacent = actionState.validDestinations.includes(location.id);

        const currentPlayerLocation = gameState?.jogadores.find(
            (p) =>
                p.id ===
                `jogador-${
                    ((gameState.turnoAtual - 1) % gameState.jogadores.length) +
                    1
                }`
        )?.localizacaoAtual;
        if (currentPlayerLocation !== location.id) {
            isTarget = isAdjacent;
        }
    } else if (actionState.type === "SELECTING_GOVERNOR_TARGET") {
        // habilidade do Governador
        const temQueimada = (fireState?.nivelQueimada ?? 0) > 0;
        const estaNaRegiaoCerta = location.regiao === actionState.region;
        isTarget = temQueimada && estaNaRegiaoCerta;
    }

    const handleClick = () => {
        // A ação só é executada se este marcador for um alvo válido.
        if (!isTarget) {
            console.log(
                `Click em ${location.estado} ignorado (não é um alvo válido)`
            );
            return;
        }

        const currentPlayerIndex =
            (gameState!.turnoAtual - 1) % gameState!.jogadores.length;
        const currentPlayer = gameState!.jogadores[currentPlayerIndex];

        if (actionState.type === "SELECTING_MOVE_TARGET") {
            performAction(currentPlayer.id, TipoAcao.MOVER, location.id);
        } else if (actionState.type === "SELECTING_GOVERNOR_TARGET") {
            performAction(currentPlayer.id, TipoAcao.PLANEJAMENTO, location.id);
        }
        console.log(`Tentando mover para ${location.estado}`);
    };

    const fireLevel = fireState?.nivelQueimada ?? 0;
    const protectionLevel = fireState?.protecaoAmbiental ?? 0;
    let isActionTarget = false;
    if (actionState.type === "SELECTING_MOVE_TARGET") {
        isActionTarget = actionState.validDestinations.includes(location.id);
    } else if (actionState.type === "SELECTING_GOVERNOR_TARGET") {
        const temQueimada = (fireState?.nivelQueimada ?? 0) > 0;
        const estaNaRegiaoCerta = location.regiao === actionState.region;
        isActionTarget = temQueimada && estaNaRegiaoCerta;
    }

    // 2. Lógica de inspeção (só se aplica se não houver uma ação em andamento)
    const isBeingInspected = location.id === inspectedLocationId;
    let isAdjacentToInspected = false;
    if (inspectedLocationId && gameState) {
        const inspectedLocationData = gameState.localizacoes.find(
            (l) => l.id === inspectedLocationId
        );
        if (inspectedLocationData?.adjacentes.includes(location.id)) {
            isAdjacentToInspected = true;
        }
    }

    // A ordem de prioridade dos estilos é: Alvo da Ação > Inspecionado > Adjacente
    const containerClasses = [
        "p-2 rounded-md shadow-md flex items-center space-x-3 w-48",
        "transition-all duration-200",
        isActionTarget
            ? "ring-2 ring-blue-400 cursor-pointer scale-105 animate-pulse" // Alvo de Ação
            : isBeingInspected
            ? "ring-2 ring-white scale-105" // Local inspecionado
            : isAdjacentToInspected
            ? "ring-2 ring-green-400" // Adjacente ao inspecionado
            : "ring-1 ring-gray-600",
        // Mantém a opacidade para ações
        !isActionTarget && actionState.type !== "IDLE"
            ? "opacity-40"
            : "opacity-100",
    ].join(" ");

    return (
        <div
            className={containerClasses}
            onClick={handleClick}
            onMouseEnter={() => setInspectedLocationId(location.id)}
            onMouseLeave={() => setInspectedLocationId(null)}
        >
            {/* Indicador de Queimada */}
            <div
                className={`w-8 h-8 rounded-full border-2 border-white flex-shrink-0 flex items-center justify-center ${fireColors[fireLevel]}`}
            >
                <span className="text-white font-bold text-sm">
                    {fireLevel > 0 ? fireLevel : ""}
                </span>
            </div>

            {/* Informações do Local */}
            <div className="flex-grow">
                <div className="font-bold text-white">{location.estado}</div>
                <div className="text-xs text-green-300">
                    Proteção: {protectionLevel}%
                </div>
            </div>

            {/* Tokens dos Jogadores */}
            <div className="flex space-x-1">
                {players.map((player) => {
                    const playerIndex = getPlayerIndex(player);
                    const playerColor = PLAYER_COLORS[playerIndex];
                    return (
                        <div
                            key={player.id}
                            className={`w-4 h-4 rounded-full border-2 border-white ${playerColor.bg}`}
                            title={player.nome}
                        ></div>
                    );
                })}
            </div>
        </div>
    );
}
