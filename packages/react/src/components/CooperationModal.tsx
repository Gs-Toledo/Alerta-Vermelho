import { useState } from "react";
import { useGame } from "../context/GameContext";
import { type Jogador, TipoAcao } from "../../../core/src";

export default function CooperationModal() {
    const { gameState, actionState, resetActionState, performAction } =
        useGame();
    const [selectedPlayer, setSelectedPlayer] = useState<Jogador | null>(null);

    if (
        actionState.type !== "COOPERATING_SELECT_PLAYER" &&
        actionState.type !== "COOPERATING_SELECT_CARD"
    ) {
        return null;
    }

    const currentPlayer =
        gameState!.jogadores[
            (gameState!.turnoAtual - 1) % gameState!.jogadores.length
        ];

    const handlePlayerSelect = (player: Jogador) => {
        setSelectedPlayer(player);
    };

    const handleCardSelect = (cardId: string) => {
        if (selectedPlayer) {
            performAction(
                currentPlayer.id,
                TipoAcao.COOPERAR,
                selectedPlayer.id,
                cardId
            );
        }
    };

    const closeModal = () => {
        setSelectedPlayer(null);
        resetActionState();
    };

    const renderContent = () => {
        //  Selecionar a carta para dar ao jogador escolhido
        if (selectedPlayer) {
            return (
                <>
                    <h3 className="text-lg font-bold mb-4">
                        Escolha uma carta para dar a {selectedPlayer.nome}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {currentPlayer.mao.map((cardId) => (
                            <button
                                key={cardId}
                                onClick={() => handleCardSelect(cardId)}
                                className="p-3 bg-gray-600 rounded hover:bg-blue-600 transition-colors"
                            >
                                {gameState?.localizacoes.find(
                                    (l) => l.id === cardId
                                )?.estado || cardId}
                            </button>
                        ))}
                    </div>
                </>
            );
        }

        // Selecionar com qual jogador cooperar
        if (actionState.type === "COOPERATING_SELECT_PLAYER") {
            return (
                <>
                    <h3 className="text-lg font-bold mb-4">
                        Cooperar com qual jogador?
                    </h3>
                    <div className="space-y-2">
                        {actionState.validPlayers.map((player) => (
                            <button
                                key={player.id}
                                onClick={() => handlePlayerSelect(player)}
                                className="w-full text-left p-3 bg-gray-600 rounded hover:bg-gray-700 transition-colors"
                            >
                                {player.nome} ({player.cargo})
                            </button>
                        ))}
                    </div>
                </>
            );
        }

        return null;
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={closeModal}
        >
            <div
                className="bg-gray-800 text-white rounded-lg shadow-xl w-11/12 max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b border-gray-600 pb-3 mb-4">
                    <h2 className="text-xl font-bold">Ação de Cooperação</h2>
                    <button
                        onClick={closeModal}
                        className="text-2xl font-bold hover:text-red-500"
                    >
                        &times;
                    </button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
}
