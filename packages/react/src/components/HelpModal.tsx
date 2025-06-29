import React from "react";

interface HelpModalProps {
    onClose: () => void;
}

export default function HelpModal({ onClose }: HelpModalProps) {
    // Impede que o clique dentro do modal o feche
    const handleModalContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        // Backdrop
        <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={onClose}
        >
            {/* Conteúdo do Modal */}
            <div
                className="bg-gray-800 text-white rounded-lg shadow-xl w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto p-6"
                onClick={handleModalContentClick}
            >
                <div className="flex justify-between items-center border-b border-gray-600 pb-3 mb-4">
                    <h2 className="text-2xl font-bold">
                        Regras do Jogo - Alerta Vermelho
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-2xl font-bold hover:text-red-500"
                    >
                        &times;
                    </button>
                </div>

                <div className="space-y-4 text-gray-300">
                    <section>
                        <h3 className="font-bold text-lg text-yellow-300">
                            Objetivo
                        </h3>
                        <p>
                            Os jogadores trabalham em equipe para combater as
                            queimadas no Brasil. Para vencer, vocês precisam
                            controlar **TODAS as queimadas** (deixar o nível de
                            todas em 0) e garantir que a **Trilha de Flora
                            atinja o limiar de vitória (80)**.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-lg text-yellow-300">
                            Estrutura do Turno
                        </h3>
                        <p>O turno de cada jogador é dividido em 3 fases:</p>
                        <ol className="list-decimal list-inside pl-4">
                            <li>
                                <strong>Fase de Ações:</strong> O jogador
                                realiza até 4 ações.
                            </li>
                            <li>
                                <strong>Fase de Comprar Cartas:</strong> O
                                jogador compra 2 cartas do Baralho de Jogador.
                            </li>
                            <li>
                                <strong>Fase de Queimadas:</strong> Novas
                                queimadas surgem no mapa de acordo com a Trilha
                                de Queimada.
                            </li>
                        </ol>
                    </section>

                    <section>
                        <h3 className="font-bold text-lg text-yellow-300">
                            Ações do Jogador (Custo: 1 Ação)
                        </h3>
                        <ul className="list-disc list-inside pl-4">
                            <li>
                                <strong>Mover:</strong> Mova seu peão para um
                                estado adjacente.
                            </li>
                            <li>
                                <strong>Combater Queimada:</strong> Reduza em 1
                                o nível de queimada no estado onde você está.
                            </li>
                            <li>
                                <strong>Cooperar:</strong> Se outro jogador
                                estiver no mesmo estado, você pode dar ou
                                receber uma carta daquele estado.
                            </li>
                            <li>
                                <strong>Planejamento:</strong> Ações especiais
                                dependendo do seu cargo.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-bold text-lg text-yellow-300">
                            Condições de Derrota
                        </h3>
                        <p>
                            O time perde imediatamente se qualquer uma destas
                            condições ocorrer:
                        </p>
                        <ul className="list-disc list-inside pl-4">
                            <li>
                                A Trilha de Queimada atingir o máximo (100).
                            </li>
                            <li>A Trilha de Flora chegar a zero (0).</li>
                            <li>O tempo acabar (30 turnos).</li>
                            <li>
                                Não for possível comprar cartas do Baralho de
                                Jogador.
                            </li>
                        </ul>
                    </section>
                </div>

                <div className="text-right mt-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Entendido!
                    </button>
                </div>
            </div>
        </div>
    );
}
