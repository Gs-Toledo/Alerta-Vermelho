import { useGame } from "../context/GameContext";
import { type Jogador, TipoAcao } from "../../../core/src";
interface ActionsPanelProps {
    currentPlayer: Jogador;
}

export default function ActionsPanel({ currentPlayer }: ActionsPanelProps) {
    const {
        performAction,
        nextTurn,
        enterMoveMode,
        actionState,
        resetActionState,
    } = useGame();

    const handleMoveClick = () => {
        // Se já estivermos no modo de movimento, cancelamos. Senão, entramos no modo.
        if (actionState.type === "SELECTING_MOVE_TARGET") {
            resetActionState();
        } else {
            enterMoveMode(currentPlayer.localizacaoAtual);
        }
    };

    const handleFightFireClick = () => {
        resetActionState(); // Garante que saímos de outros modos
        performAction(currentPlayer.id, TipoAcao.COMBATER_QUEIMADA);
    };

    const handleEndTurnClick = () => {
        resetActionState();
        nextTurn();
    };

    const hasActions = currentPlayer.acoesRestantes > 0;
    // Desativa os botões se o jogador não tiver ações OU se estiver no meio de outra ação
    const isBusy = actionState.type !== "IDLE";

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
                    disabled={!hasActions || isBusy}
                    className="p-2 bg-yellow-600 rounded disabled:bg-gray-500 hover:bg-yellow-700"
                >
                    Cooperar
                </button>
                <button
                    disabled={!hasActions || isBusy}
                    className="p-2 bg-purple-600 rounded disabled:bg-gray-500 hover:bg-purple-700"
                >
                    Planejamento
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
