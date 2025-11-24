"use client";

import React, { useState } from "react";

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function formatCard(s: number, r: number) {
	return `${SUITS[s]}${RANKS[(r + 52) % 13]}`;
}

function randomInt(max: number) {
	return Math.floor(Math.random() * max);
}

export default function Page() {
	const [seed, setSeed] = useState(0);
	const [score, setScore] = useState(0);

	function makeQuestion() {
		// pattern: choose suit, start rank, step (1..3). Show 3 cards, ask next.
		const suit = randomInt(4);
		const start = randomInt(10); // 0..9 -> ensure space for 3 cards
		const step = 1 + randomInt(3);
		const seq = [start, start + step, start + step * 2];
		const correct = start + step * 3;
		const choices = new Set<number>([correct]);
		while (choices.size < 4) {
			choices.add(correct + (randomInt(7) - 3));
		}
		const arr = Array.from(choices).sort(() => Math.random() - 0.5).slice(0, 4);
		return { suit, seq, correct, choices: arr };
	}

	const [q, setQ] = useState(() => makeQuestion());

	function answer(choice: number) {
		if (choice === q.correct) {
			setScore((s) => s + 1);
			setQ(makeQuestion());
		} else {
			setScore(0);
			setQ(makeQuestion());
		}
	}

	return (
		<main className="p-4 sm:p-6 min-h-screen bg-gradient-to-b from-rose-50 to-rose-100 flex flex-col items-center text-slate-900">
			<div className="app-inner">
				<h1 className="text-2xl sm:text-3xl font-bold mb-2">¿Qué carta sigue?</h1>
				<p className="mb-4 text-sm text-rose-700">Observa la secuencia y elige la carta que sigue.</p>

				<div className="bg-white rounded-lg shadow-md p-4 sm:p-6 w-full max-w-xl text-slate-900 card">
					<div className="flex justify-center gap-3 mb-4">
						{q.seq.map((r, i) => (
							<div key={i} className="w-20 h-28 rounded-md border flex flex-col justify-between p-2 items-start text-xl bg-white">
								<div className="text-sm">{SUITS[q.suit]}</div>
								<div className="text-2xl font-semibold mt-4">{RANKS[(r + 52) % 13]}</div>
								<div className="text-sm self-end">{SUITS[q.suit]}</div>
							</div>
						))}
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{q.choices.map((c, i) => (
							<button key={i} onClick={() => answer(c)} className="touch-button btn-ghost p-3 text-lg">
								<div className="text-lg">{SUITS[q.suit]}{RANKS[(c + 52) % 13]}</div>
							</button>
						))}
					</div>

					<div className="mt-4 flex flex-col sm:flex-row sm:justify-between items-stretch sm:items-center gap-3">
						<div>Puntuación: <strong>{score}</strong></div>
						<div className="flex gap-2 w-full sm:w-auto">
							<button onClick={() => setQ(makeQuestion())} className="btn-primary">Siguiente</button>
							<button onClick={() => { setScore(0); setQ(makeQuestion()); }} className="btn-ghost">Reiniciar</button>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

