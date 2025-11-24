"use client";

import React, { useState, useEffect } from "react";

const COLORS = ["green", "red", "yellow", "blue"];
const COLOR_CLASSES: Record<string, string> = {
	green: "bg-emerald-400 hover:brightness-110",
	red: "bg-red-400 hover:brightness-110",
	yellow: "bg-yellow-300 hover:brightness-110",
	blue: "bg-sky-400 hover:brightness-110",
};

export default function Page() {
	const [sequence, setSequence] = useState<number[]>([]);
	const [playback, setPlayback] = useState(false);
	const [highlight, setHighlight] = useState<number | null>(null);
	const [userIndex, setUserIndex] = useState(0);
	const [message, setMessage] = useState("Pulsa empezar para jugar");
	const [level, setLevel] = useState(0);

	const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

	async function playSequence(seq: number[]) {
		setPlayback(true);
		setMessage("Observa la secuencia...");
		for (let i = 0; i < seq.length; i++) {
			setHighlight(seq[i]);
			await sleep(600);
			setHighlight(null);
			await sleep(200);
		}
		setPlayback(false);
		setUserIndex(0);
		setMessage("Tu turno");
	}

	function nextRound() {
		const next = [...sequence, Math.floor(Math.random() * 4)];
		setSequence(next);
		setLevel(next.length);
		// play after state updates
		setTimeout(() => playSequence(next), 120);
	}

	function startGame() {
		setSequence([]);
		setLevel(0);
		setUserIndex(0);
		setMessage("Preparando...");
		setTimeout(() => nextRound(), 300);
	}

	function press(idx: number) {
		if (playback || sequence.length === 0) return;
		const expected = sequence[userIndex];
		if (idx === expected) {
			// correct
			setHighlight(idx);
			setTimeout(() => setHighlight(null), 200);
			if (userIndex === sequence.length - 1) {
				setMessage("¡Correcto! Siguiente nivel...");
				setTimeout(() => nextRound(), 700);
			} else {
				setUserIndex((u) => u + 1);
			}
		} else {
			setMessage("Fallaste. Reinicia para intentarlo otra vez.");
			setSequence([]);
			setPlayback(false);
			setUserIndex(0);
			setLevel(0);
		}
	}

	return (
		<main className="p-6 min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100 flex flex-col items-center text-slate-900">
			<h1 className="text-3xl font-bold mb-2">Simon Dice</h1>
			<p className="mb-4 text-sm text-indigo-700">Repite la secuencia de colores.</p>

			<div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-slate-900">
				<div className="grid grid-cols-2 gap-4 w-64 h-64">
					{COLORS.map((c, i) => (
						<button
							key={c}
							onClick={() => press(i)}
							disabled={playback}
							className={`rounded-lg ${COLOR_CLASSES[c]} shadow-lg transform transition-transform active:scale-95 ${highlight === i ? "ring-4 ring-white/60 scale-105" : ""}`}
						/>
					))}
				</div>

				<div className="mt-4 w-full flex justify-between items-center">
					<div>Nivel: <strong>{level}</strong></div>
					<div className="text-sm text-gray-600">{message}</div>
					<div className="flex gap-2">
						<button onClick={startGame} className="px-3 py-1 bg-green-300 rounded">Empezar</button>
						<button onClick={() => { setSequence([]); setPlayback(false); setLevel(0); setMessage("Reiniciado"); }} className="px-3 py-1 bg-red-200 rounded">Reiniciar</button>
					</div>
				</div>
			</div>
		</main>
	);
}

