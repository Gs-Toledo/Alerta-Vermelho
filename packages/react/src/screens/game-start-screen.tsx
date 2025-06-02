import { useState } from 'react';

import StartGameModal from './start-game-modal';

type GameStartScreenProps = {
    onStartButtonClick: () => void;
};

export default function GameStartScreen ({
    onStartButtonClick
}: GameStartScreenProps) {
    const [isStartGameModalOpen, setIsStartGameModalOpen] = useState(false);

    const handleStartButtonClick = () => {
        setIsStartGameModalOpen(true);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-earthy-1">
            <span role="heading" className="font-epilogue font-bold text-6xl animate-game-title-gradiant">
                Alerta Vermelho
            </span>

            <div className="flex flex-row items-center justify-center gap-4 mt-4">
                <button
                    role="button"
                    className="text-lg px-6 py-2 bg-fiery-3 text-white rounded-full transition-colors cursor-pointer"
                    onClick={handleStartButtonClick}
                >
                    Iniciar
                </button>

                <button role="button" className="text-lg px-6 py-2 bg-earthy-5 text-white rounded-full transition-colors cursor-pointer">
                    Ajuda
                </button>
            </div>

            {isStartGameModalOpen && (
                <StartGameModal />
            )}
        </div>
    );
}