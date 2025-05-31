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

                <span>
                    Flora: 100%
                </span>
            </div>

            <div>
                <span>
                    Norte
                </span>

                <span>
                    Sul
                </span>

                <span>
                    Nordeste
                </span>

                <span>
                    Sudeste
                </span>

                <span>
                    Centro-Oeste
                </span>
            </div>

            <button role="button" onClick={onExitButtonClick}>
                Sair
            </button>
        </div>
    );
}
