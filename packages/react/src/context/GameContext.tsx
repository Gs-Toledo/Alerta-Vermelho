import {
    createContext,
    useState,
    useContext,
    type ReactNode,
    useCallback,
    useMemo,
} from "react";
import { Game, RegiaoBrasil, type Jogador } from "../../../core/src";
import { type EstadoJogo, TipoAcao, type MensagemLog } from "../../../core/src";

type ActionState =
    | { type: "IDLE" }
    | { type: "SELECTING_MOVE_TARGET"; validDestinations: string[] }
    | { type: "SELECTING_COOP_PLAYER"; validPlayers: string[] }
    | { type: "SELECTING_COOP_CARD"; targetPlayerId: string }
    | { type: "SELECTING_GOVERNOR_TARGET"; region: RegiaoBrasil }
    | { type: "COOPERATING_SELECT_PLAYER"; validPlayers: Jogador[] }
    | { type: "COOPERATING_SELECT_CARD"; targetPlayer: Jogador };

interface GameContextType {
    game: Game | null;
    gameState: EstadoJogo | null;
    logs: MensagemLog[];
    actionState: ActionState;
    initializeGame: (playerNames: string[]) => void;
    performAction: (
        playerId: string,
        action: TipoAcao,
        ...args: unknown[]
    ) => boolean;
    nextTurn: () => void;
    enterMoveMode: (originId: string) => void;
    enterGovernorAbilityMode: (region: RegiaoBrasil) => void;
    enterCooperateMode: () => void;
    resetActionState: () => void;
    resetGame: () => void;
}

// Criando o Context com um valor padrão
const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    // eslint-disable-next-line prefer-const
    let gameInstance = useMemo(() => new Game(), []);
    const [game, setGame] = useState(() => new Game());

    const [gameState, setGameState] = useState<EstadoJogo | null>(
        gameInstance.getEstadoAtual()
    );
    const [logs, setLogs] = useState<MensagemLog[]>(
        gameInstance.getMensagensLog()
    );
    const [actionState, setActionState] = useState<ActionState>({
        type: "IDLE",
    });

    const enterGovernorAbilityMode = useCallback((region: RegiaoBrasil) => {
        setActionState({ type: "SELECTING_GOVERNOR_TARGET", region });
    }, []);

    const enterCooperateMode = useCallback(() => {
        if (!gameState) return;
        const currentPlayerIndex =
            (gameState.turnoAtual - 1) % gameState.jogadores.length;
        const currentPlayer = gameState.jogadores[currentPlayerIndex];

        const playersAtSameLocation = gameState.jogadores.filter(
            (p) =>
                p.id !== currentPlayer.id &&
                p.localizacaoAtual === currentPlayer.localizacaoAtual
        );

        if (playersAtSameLocation.length > 0) {
            setActionState({
                type: "COOPERATING_SELECT_PLAYER",
                validPlayers: playersAtSameLocation,
            });
        } else {
            alert("Nenhum outro jogador na sua localização para cooperar.");
            resetActionState();
        }
    }, [gameState]);

    const updateState = useCallback((gameInstance: Game) => {
        setGameState(JSON.parse(JSON.stringify(gameInstance.getEstadoAtual())));
        setLogs([...gameInstance.getMensagensLog()]);
        setActionState({ type: "IDLE" });
    }, []);

    const initializeGame = useCallback(
        (playerNames: string[]) => {
            game.iniciarJogo(playerNames);
            updateState(game);
        },
        [game, updateState]
    );

    const performAction = useCallback(
        (playerId: string, action: TipoAcao, ...args: unknown[]): boolean => {
            const success = game.realizarAcao(playerId, action, ...args);
            if (success) {
                updateState(game);
            } else {
                setActionState({ type: "IDLE" });
            }
            return success;
        },
        [game, updateState]
    );

    const nextTurn = useCallback(() => {
        game.avancarTurno();
        updateState(game);
    }, [game, updateState]);

    // faz a UI entrar em modo de movimento
    const enterMoveMode = useCallback(
        (originId: string) => {
            const origin = game
                .getEstadoAtual()
                .localizacoes.find((l) => l.id === originId);
            if (origin) {
                setActionState({
                    type: "SELECTING_MOVE_TARGET",
                    validDestinations: origin.adjacentes,
                });
            }
        },
        [game]
    );

    const resetActionState = useCallback(() => {
        setActionState({ type: "IDLE" });
    }, []);

    const resetGame = useCallback(() => {
        const newGameInstance = new Game();
        setGame(newGameInstance);
        updateState(newGameInstance);
    }, [updateState]);

    const value = {
        game: gameInstance,
        gameState,
        logs,
        actionState,
        initializeGame,
        performAction,
        nextTurn,
        enterMoveMode,
        resetActionState,
        resetGame,
        enterGovernorAbilityMode,
        enterCooperateMode,
    };

    return (
        <GameContext.Provider value={value}>{children}</GameContext.Provider>
    );
};
// Hook customizado para ajudar no uso do contexto
export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
};
