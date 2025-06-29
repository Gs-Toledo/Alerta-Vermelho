import { useState } from "react";
import { useGame } from "./context/GameContext";
import GameBoard from "./components/GameBoard";
import PlayerDashboard from "./components/PlayerDashboard";
import LogPanel from "./components/LogPanel";
import GameStatus from "./components/GameStatus";
import HelpModal from "./components/HelpModal";
import { CargoJogador } from "../../core/src";
import CooperationModal from "./components/CooperationModal";

const ROLES_ASSIGNMENT = [
    CargoJogador.MINISTRO_MEIO_AMBIENTE,
    CargoJogador.GOVERNADOR,
    CargoJogador.PARLAMENTAR,
];

export default function Game() {
    const { gameState, initializeGame, resetGame } = useGame();
    const [playerNames, setPlayerNames] = useState([
        "Jogador 1",
        "Jogador 2",
        "Jogador 3",
    ]);
    const [isHelpModalOpen, setHelpModalOpen] = useState(false); // <--  modal -->

    const handleStartGame = () => {
        if (playerNames.every((name) => name.trim() !== "")) {
            initializeGame(playerNames);
        } else {
            alert("Por favor, insira o nome de todos os jogadores.");
        }
    };

    const handlePlayerNameChange = (index: number, name: string) => {
        const newPlayerNames = [...playerNames];
        newPlayerNames[index] = name;
        setPlayerNames(newPlayerNames);
    };

    const renderGameContent = () => {
        // 1. Tela de Fim de Jogo
        if (gameState?.jogoAcabou) {
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
                    <span role="heading" className="font-bold text-6xl mb-4">
                        Fim de Jogo!
                    </span>
                    <p
                        className={`text-4xl font-bold ${
                            gameState.vitoria
                                ? "text-green-400"
                                : "text-red-500"
                        }`}
                    >
                        {gameState.vitoria ? "VITÓRIA!" : "DERROTA!"}
                    </p>
                    <p className="mt-4 text-lg max-w-md text-center">
                        {gameState.vitoria
                            ? "Parabéns! Vocês controlaram as queimadas e salvaram a flora brasileira!"
                            : "Infelizmente, as queimadas devastaram o país. Não desista, o Brasil precisa de você."}
                    </p>
                    <button
                        onClick={resetGame}
                        className="mt-8 px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl"
                    >
                        Jogar Novamente
                    </button>
                </div>
            );
        }

        // 2. Tela do Jogo Principal (Tabuleiro)
        if (gameState && gameState.turnoAtual > 0) {
            return (
                <main className="flex h-screen bg-gray-700 text-white font-sans">
                    <div className="w-3/4 p-4">
                        <GameBoard />
                    </div>
                    <aside className="w-1/4 bg-gray-800 p-4 flex flex-col space-y-4 overflow-y-auto">
                        <GameStatus />
                        <PlayerDashboard />
                        <LogPanel />
                    </aside>
                </main>
            );
        }

        // 3. Tela de Início (Padrão)
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
                <span role="heading" className="font-bold text-5xl mb-8">
                    Alerta Vermelho
                </span>

                <div className="mb-8 w-1/4">
                    {ROLES_ASSIGNMENT.map((role, index) => (
                        <div key={role} className="mb-4">
                            <label className="block mb-1 text-sm text-gray-400">
                                Jogador {index + 1} -{" "}
                                <span className="font-bold text-yellow-300">
                                    {role}
                                </span>
                            </label>
                            <input
                                type="text"
                                value={playerNames[index]}
                                onChange={(e) =>
                                    handlePlayerNameChange(
                                        index,
                                        e.target.value
                                    )
                                }
                                className="w-full p-2 rounded bg-gray-700 text-white"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={handleStartGame}
                        role="button"
                        className="px-8 py-3 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-xl"
                    >
                        Iniciar Jogo
                    </button>
                    <button
                        onClick={() => setHelpModalOpen(true)}
                        role="button"
                        className="px-8 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 text-xl"
                    >
                        Regras
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            {isHelpModalOpen && (
                <HelpModal onClose={() => setHelpModalOpen(false)} />
            )}
            <CooperationModal />

            {renderGameContent()}
        </>
    );
}
