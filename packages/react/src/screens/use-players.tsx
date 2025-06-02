import { useState } from 'react';

function adjustPlayerNames (currentPlayerNames: string[], newAmountOfPlayers: number): string[] {
    if (newAmountOfPlayers > currentPlayerNames.length) {
        const newPlayerNames = [];

        for (let i = currentPlayerNames.length; i < newAmountOfPlayers; i++) {
            newPlayerNames.push('');
        }

        return [
            ...currentPlayerNames,
            ...newPlayerNames,
        ];
    } else {
        return currentPlayerNames.slice(0, newAmountOfPlayers);
    }
}

export default function usePlayers (initialAmountOfPlayers: number) {
    const initialPlayerNames = adjustPlayerNames([], initialAmountOfPlayers);

    const [playerNames, setPlayerNames] = useState(initialPlayerNames);

    const changePlayerName = (playerIndexToChange: number, newPlayerName: string) => {
        setPlayerNames(currentPlayerNames => {
            return currentPlayerNames.map((currentPlayerName, currentIndex) => {
                if (currentIndex === playerIndexToChange) {
                    return newPlayerName;
                } else {
                    return currentPlayerName;
                }
            });
        });
    }

    const setAmountOfPlayers = (newAmount: number) => {
        setPlayerNames(currentPlayerNames => {
            return adjustPlayerNames(currentPlayerNames, newAmount);
        });
    };

    return {
        playerNames,
        changePlayerName,
        setAmountOfPlayers,
    };
}