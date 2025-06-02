import Brazil from "./brazil";

type GameStartedProps = {
    onExitButtonClick: () => void;
};

export default function GameStarted ({
    onExitButtonClick
}: GameStartedProps) {
    return (
        <div>
            <div className="flex flex-col items-center justify-between">
                <span>
                    Alerta Vermelho
                </span>

                <span>
                    Jogador 1
                </span>

                <span>
                    Rodada 1
                </span>

                <span>
                    Flora: 100%
                </span>
            </div>

            <div className="flex flex-row items-center justify-center">
                <div className="w-200 h-200">
                    <Brazil />
                </div>
            </div>

            <button role="button" onClick={onExitButtonClick}>
                Sair
            </button>
        </div>
    );
}
