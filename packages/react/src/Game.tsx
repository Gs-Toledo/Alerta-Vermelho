import { useState } from 'react';

import GameStartScreen from './screens/game-start-screen';
import GameStartedScreen from './screens/game-started-screen';

export default function Game () {
    const [isStarted, setIsStarted] = useState(false);

    if (isStarted) {
        return (
            <GameStartedScreen
                onExitButtonClick={() => setIsStarted(false)}
            />
        );
    } else {
        return (
            <GameStartScreen
                onStartButtonClick={() => setIsStarted(true)}
            />
        );
    }
};


