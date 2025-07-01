import React from "react";
import ReactDOM from "react-dom/client";
import Game from "./Game.tsx";
import { GameProvider } from "./context/GameContext.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <GameProvider>
            <Game />
        </GameProvider>
    </React.StrictMode>
);
