import { useGame } from "../context/GameContext";
import LocationMarker from "./LocationMarker";
import { RegiaoBrasil } from "../../../core/src";

const regionOrder: RegiaoBrasil[] = [
    RegiaoBrasil.NORTE,
    RegiaoBrasil.NORDESTE,
    RegiaoBrasil.CENTRO_OESTE,
    RegiaoBrasil.SUDESTE,
    RegiaoBrasil.SUL,
];

export default function GameBoard() {
    const { gameState } = useGame();

    if (!gameState) return <div>Carregando mapa...</div>;

    const locationsByRegion = gameState.localizacoes.reduce((acc, loc) => {
        (acc[loc.regiao] = acc[loc.regiao] || []).push(loc);
        return acc;
    }, {} as Record<RegiaoBrasil, typeof gameState.localizacoes>);

    return (
        <div className="w-full h-full bg-gray-600 rounded-lg shadow-lg p-4 flex flex-col space-y-4">
            <h2 className="text-2xl font-bold text-center">
                Mapa de Operações
            </h2>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {regionOrder.map((region) => (
                    <div
                        key={region}
                        className="bg-black bg-opacity-20 p-2 rounded-lg flex flex-col items-center"
                    >
                        <h3 className="font-bold text-lg mb-4 text-yellow-300">
                            {region}
                        </h3>
                        <div className="space-y-3">
                            {(locationsByRegion[region] || []).map((loc) => {
                                const fireState =
                                    gameState.estadosQueimadas.find(
                                        (eq) => eq.id === loc.id
                                    );
                                const playersOnLocation =
                                    gameState.jogadores.filter(
                                        (p) => p.localizacaoAtual === loc.id
                                    );

                                return (
                                    <LocationMarker
                                        key={loc.id}
                                        location={loc}
                                        fireState={fireState}
                                        players={playersOnLocation}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
