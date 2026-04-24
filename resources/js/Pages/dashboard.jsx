import MatrixBackground from "@/components/ui/matrix-background";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";


export default function Dashboard() {
    const [active, setActive] = useState(0);

    const GAMES = [
        {
            name: "SEQUIZ",
            desc: "Cyber Security Quiz",
            url: "/quiz",
            color: "text-purple-400 border-purple-400"
        },
        {
            name: "ARCHEGO",
            desc: "Programming Puzzle",
            url: "/play/archego",
            color: "text-green-400 border-green-400"
        },
        {
            name: "OBSCURUM",
            desc: "CTF Cybersecurity Game",
            url: "/play/obscurum",
            color: "text-red-400 border-red-400"
        }
    ];

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "ArrowRight") {
                setActive((prev) => (prev + 1) % GAMES.length);
            }
            if (e.key === "ArrowLeft") {
                setActive((prev) => (prev - 1 + GAMES.length) % GAMES.length);
            }
            if (e.key === "Enter") {
                window.location.href = GAMES[active].url;
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [active]);

    return (
        <div className="relative w-screen h-screen bg-transparent text-white overflow-hidden">

            {/* MATRIX */}
            <MatrixBackground />

            {/* CONTENT */}
            <div className="relative z-10 flex flex-col h-full">

                {/* HEADER */}
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h1 className="text-xl font-bold tracking-widest">
                        SEQUIZ <span className="opacity-50">HUB</span>
                    </h1>

                    <form method="POST" action="/logout">
                        <input type="hidden" name="_token" value={window.Laravel?.csrfToken || ''} />
                        <button
                            onClick={() => router.post('/logout')}
                            className="border px-4 py-1 rounded text-sm hover:bg-white hover:text-black transition"
                        >
                            Logout
                        </button>
                    </form>
                </div>

                {/* MAIN */}
                <div className="flex flex-1 flex-col justify-center items-center gap-10">

                    {/* TITLE */}
                    <div className="text-center">
                        <h2 className="text-5xl font-bold mb-2">
                            {GAMES[active].name}
                        </h2>
                        <p className="text-white/60">
                            {GAMES[active].desc}
                        </p>
                    </div>

                    {/* BUTTON */}
                    <button
                        onClick={() => window.location.href = GAMES[active].url}
                        className={`px-8 py-3 border rounded-lg transition hover:scale-105 ${GAMES[active].color}`}
                    >
                        PLAY NOW
                    </button>

                    {/* CAROUSEL */}
                    <div className="flex gap-6 mt-6">
                        {GAMES.map((game, i) => (
                            <div
                                key={i}
                                onClick={() => setActive(i)}
                                className={`
                                    w-40 h-24 flex items-center justify-center border rounded-lg cursor-pointer transition
                                    ${i === active ? "scale-110 border-white" : "opacity-50"}
                                `}
                            >
                                {game.name}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}