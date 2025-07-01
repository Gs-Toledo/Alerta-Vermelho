import { useGame } from "../context/GameContext";
import { CargoJogador, type Jogador, TipoAcao } from "../../../core/src";
interface ActionsPanelProps {
    currentPlayer: Jogador;
}

const HABILIDADE_MAP = {
    [CargoJogador.MINISTRO_MEIO_AMBIENTE]: "Fortalecer Proteção",
    [CargoJogador.GOVERNADOR]: "Mobilizar Forças",
    [CargoJogador.PARLAMENTAR]: "Articular Apoio",
};

export default function ActionsPanel({ currentPlayer }: ActionsPanelProps) {
    const {
        gameState,
        performAction,
        nextTurn,
        enterMoveMode,
        actionState,
        resetActionState,
        enterGovernorAbilityMode,
        enterCooperateMode,
    } = useGame();

    const habilidadeNome =
        HABILIDADE_MAP[currentPlayer.cargo] || "Planejamento";

    const handlePlanejamentoClick = () => {
        // Ação dependendo do cargo
        switch (currentPlayer.cargo) {
            case CargoJogador.MINISTRO_MEIO_AMBIENTE:
            case CargoJogador.PARLAMENTAR:
                // Ações de um passo só
                performAction(currentPlayer.id, TipoAcao.PLANEJAMENTO);
                break;
            case CargoJogador.GOVERNADOR:
                // Ação de dois passos
                if (actionState.type === "SELECTING_GOVERNOR_TARGET") {
                    resetActionState();
                } else {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const jogadorLocal = useGame().gameState?.localizacoes.find(
                        (l) => l.id === currentPlayer.localizacaoAtual
                    );
                    if (jogadorLocal) {
                        enterGovernorAbilityMode(jogadorLocal.regiao);
                    }
                }
                break;
        }
    };

    const handleMoveClick = () => {
        // Se já estivermos no modo de movimento, cancelamos. Senão, entramos no modo.
        if (actionState.type === "SELECTING_MOVE_TARGET") {
            resetActionState();
        } else {
            enterMoveMode(currentPlayer.localizacaoAtual);
        }
    };

    const handleCooperateClick = () => {
        enterCooperateMode();
    };

    const handleFightFireClick = () => {
        resetActionState(); // Garante que saímos de outros modos
        performAction(currentPlayer.id, TipoAcao.COMBATER_QUEIMADA);
    };

    const handleEndTurnClick = () => {
        resetActionState();
        nextTurn();
    };

    const podeConstruirCentro =
        currentPlayer.mao.includes(currentPlayer.localizacaoAtual) &&
        !gameState?.centrosDePrevencao.includes(currentPlayer.localizacaoAtual);

    const localAtual = gameState?.localizacoes.find(
        (l) => l.id === currentPlayer.localizacaoAtual
    );

    const estaEmCentro = gameState?.centrosDePrevencao.includes(
        currentPlayer.localizacaoAtual
    );

    const regiaoNaoProtegida =
        localAtual &&
        !gameState?.moratoriasDecretadas.includes(localAtual.regiao);

    const temCartasSuficientesParaMoratoria =
        localAtual &&
        currentPlayer.mao.filter(
            (c) =>
                gameState?.localizacoes.find((l) => l.id === c)?.regiao ===
                localAtual.regiao
        ).length >= 4;

    const podeDecretarMoratoria =
        estaEmCentro && regiaoNaoProtegida && temCartasSuficientesParaMoratoria;

    const handleConstruirCentro = () => {
        performAction(currentPlayer.id, TipoAcao.CONSTRUIR_CENTRO);
    };

    const handleDecretarMoratoria = () => {
        const localAtual = gameState!.localizacoes.find(
            (l) => l.id === currentPlayer.localizacaoAtual
        );
        const cartasDaRegiao = currentPlayer.mao.filter(
            (c) =>
                gameState?.localizacoes.find((l) => l.id === c)?.regiao ===
                localAtual?.regiao
        );
        const cartasParaUsar = cartasDaRegiao.slice(0, 4);
        performAction(
            currentPlayer.id,
            TipoAcao.DECRETAR_MORATORIA,
            cartasParaUsar
        );
    };

    const hasActions = currentPlayer.acoesRestantes > 0;
    // Desativa os botões se o jogador não tiver ações OU se estiver no meio de outra ação
    const isBusy = actionState.type !== "IDLE";

    const canCooperate =
        useGame().gameState?.jogadores.some(
            (p) =>
                p.id !== currentPlayer.id &&
                p.localizacaoAtual === currentPlayer.localizacaoAtual
        ) ?? false;

    return (
        <div className="mt-4 border-t border-gray-700 pt-3">
            <h4 className="font-bold mb-2">Ações</h4>
            {isBusy && (
                <div className="text-center p-2 bg-blue-900 rounded-md mb-2">
                    <p className="text-sm">
                        {actionState.type === "SELECTING_MOVE_TARGET"
                            ? "Selecione um estado adjacente no mapa para mover."
                            : "Conclua a ação..."}
                    </p>
                    <button
                        onClick={resetActionState}
                        className="text-xs text-red-300 hover:underline"
                    >
                        Cancelar Ação
                    </button>
                </div>
            )}
            <div className="grid grid-cols-2 gap-2 text-sm">
                <button
                    onClick={handleMoveClick}
                    disabled={
                        !hasActions ||
                        (isBusy && actionState.type !== "SELECTING_MOVE_TARGET")
                    }
                    className="p-2 bg-blue-600 rounded disabled:bg-gray-500 hover:bg-blue-700"
                >
                    {actionState.type === "SELECTING_MOVE_TARGET"
                        ? "Cancel. Mover"
                        : "Mover"}
                </button>
                <button
                    onClick={handleFightFireClick}
                    disabled={!hasActions || isBusy}
                    className="p-2 bg-red-600 rounded disabled:bg-gray-500 hover:bg-red-700"
                >
                    Combater Queimada
                </button>
                <button
                    onClick={handleCooperateClick}
                    disabled={!hasActions || isBusy || !canCooperate}
                    className="p-2 bg-yellow-600 rounded disabled:bg-gray-500 hover:bg-yellow-700 w-full mt-2"
                >
                    Cooperar
                </button>
                <button
                    onClick={handlePlanejamentoClick}
                    disabled={
                        !hasActions ||
                        (isBusy &&
                            actionState.type !== "SELECTING_GOVERNOR_TARGET")
                    }
                    className="p-2 bg-purple-600 rounded disabled:bg-gray-500 hover:bg-purple-700 w-full mt-2"
                >
                    {actionState.type === "SELECTING_GOVERNOR_TARGET"
                        ? `Cancelar Habilidade`
                        : habilidadeNome}
                </button>
                <button
                    onClick={handleConstruirCentro}
                    disabled={!hasActions || isBusy || !podeConstruirCentro}
                    className="w-full mt-2 p-2 bg-cyan-600 rounded disabled:bg-gray-500 hover:bg-cyan-700"
                >
                    Construir Centro
                </button>
                <button
                    onClick={handleDecretarMoratoria}
                    disabled={!hasActions || isBusy || !podeDecretarMoratoria}
                    className="w-full mt-2 p-2 bg-green-600 rounded disabled:bg-gray-500 hover:bg-green-700"
                >
                    Decretar Moratória
                </button>
            </div>
            <button
                onClick={handleEndTurnClick}
                disabled={isBusy}
                className="w-full mt-4 p-2 bg-gray-600 rounded hover:bg-gray-500 disabled:bg-gray-500"
            >
                Finalizar Turno
            </button>
        </div>
    );
}
