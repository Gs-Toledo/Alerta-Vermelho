import { useEffect, useRef } from "react";
import { useGame } from "../context/GameContext";

export default function LogPanel() {
    const { logs } = useGame();
    const logContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll para a última mensagem
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop =
                logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="bg-gray-900 p-3 rounded-lg shadow-inner flex-grow flex flex-col min-h-0">
            <h3 className="text-lg font-bold border-b border-gray-700 pb-2 mb-2 flex-shrink-0">
                Log de Eventos
            </h3>

            <div
                ref={logContainerRef}
                className="overflow-y-auto text-sm space-y-1 pr-2"
            >
                {logs.map((log, index) => (
                    <p key={index} className="text-gray-300 break-words">
                        <span className="font-semibold text-gray-500 mr-2">
                            [T{log.turno}]
                        </span>
                        {log.mensagem}
                    </p>
                ))}
            </div>
        </div>
    );
}
