import { useGame } from "../context/GameContext";

export default function GameStatus() {
    const { gameState } = useGame();
    if (!gameState) return null;

    return (
        <div className="bg-gray-900 p-3 rounded-lg shadow-inner">
            <h3 className="text-lg font-bold border-b border-gray-700 pb-2 mb-2">
                Status Global
            </h3>
            <p>Turno: {gameState.turnoAtual}</p>
            <p>
                Trilha de Queimada:{" "}
                <span className="font-bold text-red-400">
                    {gameState.trilhaQueimada}
                </span>
            </p>
            <p>
                Trilha de Flora:{" "}
                <span className="font-bold text-green-400">
                    {gameState.trilhaFlora}
                </span>
            </p>
            <p>Baralho Jogador: {gameState.baralhoJogador.length} cartas</p>
        </div>
    );
}
