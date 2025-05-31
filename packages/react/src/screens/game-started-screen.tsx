type GameStartedProps = {
    onExitButtonClick: () => void;
};

export default function GameStarted ({
    onExitButtonClick
}: GameStartedProps) {
    return (
        <div>
            <div>
                <span>
                    Alerta Vermelho
                </span>

                <span>
                    Jogador 1
                </span>

                <span>
                    Rodada 1
                </span>
            </div>

            <button role="button" onClick={onExitButtonClick}>
                Sair
            </button>
        </div>
    );
}
