import { useGame } from "../context/GameContext";
import ActionsPanel from "./ActionPanel";

export default function PlayerDashboard() {
    const { gameState } = useGame();

    if (!gameState || gameState.jogadores.length === 0) return null;

    const currentPlayerIndex =
        (gameState.turnoAtual - 1) % gameState.jogadores.length;
    const currentPlayer = gameState.jogadores[currentPlayerIndex];

    if (!currentPlayer) return <div>Aguardando jogador...</div>;

    // Função para pegar o nome completo do estado a partir do ID
    const getLocationName = (id: string) => {
        return (
            gameState.localizacoes.find((loc) => loc.id === id)?.estado || id
        );
    };

    return (
        <div className="bg-gray-900 p-3 rounded-lg shadow-inner">
            <h3 className="text-lg font-bold border-b border-gray-700 pb-2 mb-2">
                Turno de: {currentPlayer.nome}
            </h3>
            <div className="space-y-2 text-sm">
                <p>
                    <span className="font-semibold text-gray-400">Cargo:</span>{" "}
                    {currentPlayer.cargo}
                </p>
                <p>
                    <span className="font-semibold text-gray-400">
                        Localização:
                    </span>{" "}
                    {getLocationName(currentPlayer.localizacaoAtual)}
                </p>
                <p>
                    <span className="font-semibold text-gray-400">
                        Ações Restantes:
                    </span>{" "}
                    {currentPlayer.acoesRestantes}
                </p>
                <div>
                    <span className="font-semibold text-gray-400">
                        Cartas na Mão:
                    </span>
                    {currentPlayer.mao.length > 0 ? (
                        <ul className="list-disc list-inside pl-2">
                            {currentPlayer.mao.map((cardId) => (
                                <li key={cardId}>{getLocationName(cardId)}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-xs italic">
                            Nenhuma carta na mão.
                        </p>
                    )}
                </div>
            </div>
            <ActionsPanel currentPlayer={currentPlayer} />
        </div>
    );
}
