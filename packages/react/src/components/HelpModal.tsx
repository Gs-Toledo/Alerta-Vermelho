import React from "react";
import { FaBuilding, FaShieldAlt } from "react-icons/fa";

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
                className="bg-gray-800 text-white rounded-lg shadow-xl w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto p-6"
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

                <div className="space-y-6 text-gray-300">
                    {" "}
                    <section>
                        <h3 className="font-bold text-lg text-yellow-300">
                            Objetivo do Jogo
                        </h3>
                        <p>
                            O objetivo principal é decretar uma **Moratória
                            Regional** em todas as 5 regiões do Brasil para
                            vencer. Secundariamente, se todas as queimadas forem
                            apagadas e a flora atingir 80, vocês também vencem.
                            O trabalho em equipe é essencial!
                        </p>
                    </section>
                    <section>
                        <h3 className="font-bold text-lg text-yellow-300">
                            Ações Básicas (Custo: 1 Ação)
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
                        </ul>
                    </section>
                    <section className="p-4 bg-black bg-opacity-20 rounded-lg">
                        <h3 className="font-bold text-xl text-yellow-300 mb-2">
                            O Poder das Cartas: Ações Estratégicas
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                            As cartas de estado são o recurso mais importante do
                            jogo. Elas não servem apenas para viajar, mas para
                            executar as duas ações mais poderosas que levarão à
                            vitória.
                        </p>

                        <div className="space-y-4">
                            <article>
                                <h4 className="flex items-center text-lg font-semibold text-cyan-400">
                                    <FaBuilding className="mr-2" />
                                    1. Construir Centro de Prevenção
                                </h4>
                                <ul className="list-disc list-inside pl-5 mt-1 space-y-1">
                                    <li>
                                        <strong>Custo:</strong> 1 Ação +
                                        Descartar 1 carta do estado em que você
                                        está.
                                    </li>
                                    <li>
                                        <strong>O que faz:</strong> Cria uma
                                        edificação permanente no mapa.
                                    </li>
                                    <li>
                                        <strong>Para que serve:</strong> Centros
                                        são a base para a ação mais importante
                                        do jogo: a Moratória. Pense neles como
                                        sua base de operações naquela região.
                                    </li>
                                </ul>
                            </article>
                            <article>
                                <h4 className="flex items-center text-lg font-semibold text-green-400">
                                    <FaShieldAlt className="mr-2" />
                                    2. Decretar Moratória Regional
                                </h4>
                                <ul className="list-disc list-inside pl-5 mt-1 space-y-1">
                                    <li>
                                        <strong>Custo:</strong> 1 Ação +
                                        Descartar 4 cartas da mesma região.
                                    </li>
                                    <li>
                                        <strong>Requisito:</strong> Você precisa
                                        estar em um{" "}
                                        <strong className="text-cyan-400">
                                            Centro de Prevenção
                                        </strong>{" "}
                                        localizado na região que deseja
                                        proteger.
                                    </li>
                                    <li>
                                        <strong>O que faz:</strong> É a ação
                                        mais poderosa. Ao ser decretada, a
                                        região inteira fica{" "}
                                        <strong className="text-green-400">
                                            permanentemente imune a novas
                                            queimadas
                                        </strong>
                                        .
                                    </li>
                                    <li>
                                        <strong>Bônus:</strong> A Trilha de
                                        Flora do planeta se recupera
                                        significativamente!
                                    </li>
                                </ul>
                            </article>
                        </div>
                        <p className="mt-4 p-3 bg-gray-900 rounded">
                            <strong>Ciclo Estratégico:</strong> Junte cartas →
                            Troque com aliados → Construa Centros → Use os
                            Centros para decretar Moratórias e vencer!
                        </p>
                    </section>
                    <section>
                        <h3 className="font-bold text-lg text-yellow-300">
                            Cargos e Habilidades Especiais
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">
                            Cada jogador tem uma habilidade única, ativada com a
                            ação de <strong>Planejamento</strong> (custo: 1
                            Ação).
                        </p>
                        <div className="space-y-3 mt-2 pl-2">
                            <article>
                                <h4 className="font-semibold text-blue-300">
                                    Ministro do Meio Ambiente
                                </h4>
                                <p className="mt-1">
                                    <strong>Habilidade:</strong> Gasta 1 ação
                                    para aumentar a{" "}
                                    <span className="font-semibold">
                                        Proteção Ambiental
                                    </span>{" "}
                                    do seu local atual em +30%.
                                </p>
                            </article>
                            <article>
                                <h4 className="font-semibold text-green-300">
                                    Governador
                                </h4>
                                <p className="mt-1">
                                    <strong>Habilidade:</strong> Gasta 1 ação
                                    para combater uma queimada em{" "}
                                    <span className="font-semibold">
                                        qualquer estado da sua região atual
                                    </span>
                                    , sem precisar se mover.
                                </p>
                            </article>
                            <article>
                                <h4 className="font-semibold text-purple-300">
                                    Parlamentar
                                </h4>
                                <p className="mt-1">
                                    <strong>Habilidade:</strong> Gasta 1 ação
                                    para{" "}
                                    <span className="font-semibold">
                                        comprar 1 carta extra
                                    </span>{" "}
                                    do Baralho de Jogador.
                                </p>
                            </article>
                        </div>
                    </section>
                    <section>
                        <h3 className="font-bold text-lg text-yellow-300">
                            Condições de Derrota
                        </h3>
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
