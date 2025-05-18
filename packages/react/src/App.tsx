import { Game } from '@alerta-vermelho/core';

const game = new Game();

function App() {
    return (
        <p>
            Alerta vermelho! Round {game.getRound()}
        </p>
    )
}

export default App
