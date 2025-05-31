export default function Game () {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <span role="heading" className="font-bold text-2xl">
                Alerta Vermelho
            </span>

            <button role="button" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                Start
            </button>

            <button role="button" className="mt-2 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
                Help
            </button>
        </div>
    );
};
