import { useState } from 'react';
import usePlayers from './use-players';

type StartGameModalProps = {
    onClose: () => void;
    onFinish: () => void;
};

function useSteps (amountOfSteps) {
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => {
        if (currentStep < amountOfSteps - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const previousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return {
        currentStep,
        nextStep,
        previousStep,
    };
}

export default function StartGameModal ({
    onClose,
    onFinish,
}) {
    const { playerNames, setAmountOfPlayers, changePlayerName } = usePlayers(2);
    const { currentStep, nextStep, previousStep } = useSteps(2);

    const handleAmountOfPlayersChange = (newAmountOfPlayers: number) => {
        setAmountOfPlayers(newAmountOfPlayers);
    };

    const handlePlayerNameChange = (playerIndexToChange: number, newPlayerName: string) => {
        changePlayerName(playerIndexToChange, newPlayerName);
    };

    const handleNextStep = () => {
        if (currentStep < steps.length - 1) {
            nextStep();
        } else {
            onFinish();
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 0) {
            previousStep();
        } else {
            onClose();
        }
    };

    const steps = [
        <FillAmountOfPlayersStep
            amountOfPlayers={playerNames.length}
            onAmountOfPlayersChange={handleAmountOfPlayersChange}
            onPreviousButtonClick={handlePreviousStep}
            onNextButtonClick={handleNextStep}
        />,

        <FillPlayerNamesStep
            playerNames={playerNames}
            onPlayerNameChange={handlePlayerNameChange}
            onPreviousButtonClick={handlePreviousStep}
            onNextButtonClick={handleNextStep}
        />
    ];

    return (
        <>
            <div className="fixed inset-0 bg-black/50" />

            <div className="fixed inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-4 gap-4">

                { steps[currentStep] }
                </div>
            </div>
        </>
    );
}

type FillAmountOfPlayersStepProps = {
    amountOfPlayers: number;
    onAmountOfPlayersChange: (amountOfPlayers: number) => void;
    onPreviousButtonClick: () => void;
    onNextButtonClick: () => void;
};

function FillAmountOfPlayersStep ({
    amountOfPlayers,
    onAmountOfPlayersChange,
    onPreviousButtonClick,
    onNextButtonClick,
}: FillAmountOfPlayersStepProps) {
    const handlePlayerSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmountOfPlayers = Number(event.target.value);

        onAmountOfPlayersChange(newAmountOfPlayers);
    };

    return (
        <>
            <span>
                Quantos jogadores?
            </span>

            <div className="flex flex-col space-y-2 p-2 w-80">
                <input type="range" className="w-full" min="1" max="6" step="1" value={amountOfPlayers} onChange={handlePlayerSliderChange} />

                <ul className="flex justify-between w-full px-[10px]">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <li key={i} className="flex justify-center relative">
                            <span className="absolute">{i}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <ButtonGroup>
                <Button
                    onClick={onPreviousButtonClick}>
                    Cancelar
                </Button>

                <Button
                    onClick={onNextButtonClick}>
                    Próximo
                </Button>
            </ButtonGroup>
        </>
    );
}

type FillPlayerNamesStepProps = {
    playerNames: string[];
    onPlayerNameChange: (index: number, newName: string) => void;
    onPreviousButtonClick: () => void;
    onNextButtonClick: () => void;
};

function FillPlayerNamesStep ({
    playerNames,
    onPlayerNameChange,
    onPreviousButtonClick,
    onNextButtonClick,
}: FillPlayerNamesStepProps) {
    const handlePlayerNameInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newName = event.target.value;

        onPlayerNameChange(index, newName);
    };

    return (
        <>
            <span>Qual o nome dos jogadores?</span>

            <div className="flex flex-col space-y-2 p-2 w-80">
                {playerNames.map((name, index) => (
                    <input
                        key={index}
                        type="text"
                        className="w-full px-2 py-1 border rounded"
                        value={name}
                        placeholder={`Jogador ${index + 1}`}
                        onChange={event => handlePlayerNameInputChange(event, index)}
                    />
                ))}
            </div>

            <ButtonGroup>
                <Button
                    onClick={onPreviousButtonClick}>
                    Voltar
                </Button>

                <Button
                    onClick={onNextButtonClick}>
                    Iniciar Jogo
                </Button>
            </ButtonGroup>
        </>
    );
}

function ButtonGroup ({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-row items-center justify-center gap-4 mt-4">
            {children}
        </div>
    );
}

function Button ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
    return (
        <button
            className="text-lg px-6 py-2 bg-fiery-3 text-white rounded-full transition-colors cursor-pointer"
            onClick={onClick}
        >
            {children}
        </button>
    );
}