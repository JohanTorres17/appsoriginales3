
"use client";

import React, { useEffect, useRef, useState } from "react";

export default function Page() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const shipRef = useRef({ x: 0, y: 0, w: 40, h: 18 });
	const [running, setRunning] = useState(false);
	const [score, setScore] = useState(0);
	const [gameOver, setGameOver] = useState(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		let raf = 0;
		let ctx = canvas.getContext("2d");

		function resize() {
			const c = canvasRef.current;
			if (!c) return;
			c.width = Math.min(600, window.innerWidth - 40);
			c.height = 480;
			shipRef.current.x = c.width / 2;
			shipRef.current.y = c.height - 32;
		}

		resize();
		window.addEventListener("resize", resize);

		type Ast = { x: number; y: number; r: number; speed: number };
		let asts: Ast[] = [];
		let lastSpawn = 0;
		let startTime = performance.now();
		let scoreInterval: number | undefined;

		function spawn(now: number) {
			const c = canvasRef.current;
			if (!c) return;
			const difficulty = Math.max(400 - Math.floor((now - startTime) / 2000), 120);
			if (now - lastSpawn > difficulty) {
				asts.push({ x: Math.random() * (c.width - 20) + 10, y: -20, r: 8 + Math.random() * 18, speed: 1 + Math.random() * 2 + score / 200 });
				lastSpawn = now;
			}
		}

		function draw() {
			const c = canvasRef.current;
			if (!c) return;
			if (!ctx) ctx = c.getContext("2d");
			if (!ctx) return;
			ctx.clearRect(0, 0, c.width, c.height);
			// background
			ctx.fillStyle = "#081229";
			ctx.fillRect(0, 0, c.width, c.height);

			// ship (triangle)
			const ship = shipRef.current;
			ctx.fillStyle = "#f8e71c";
			ctx.beginPath();
			ctx.moveTo(ship.x, ship.y - ship.h);
			ctx.lineTo(ship.x - ship.w / 2, ship.y + ship.h);
			ctx.lineTo(ship.x + ship.w / 2, ship.y + ship.h);
			ctx.closePath();
			ctx.fill();

			// asteroids
			ctx.fillStyle = "#b33a3a";
			for (const a of asts) {
				ctx.beginPath();
				ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
				ctx.fill();
			}

			// score
			ctx.fillStyle = "#ffffff";
			ctx.font = "18px Arial";
			ctx.fillText(`Puntuación: ${score}`, 12, 24);
		}

		function checkCollision(a: Ast) {
			const ship = shipRef.current;
			const dx = a.x - ship.x;
			const dy = a.y - ship.y;
			// approximate triangle as rectangle for simplicity
			const halfW = ship.w / 2;
			if (Math.abs(dx) < a.r + halfW && Math.abs(dy) < a.r + ship.h) return true;
			return false;
		}

		function update(now: number) {
			if (gameOver) return;
			const c = canvasRef.current;
			if (!c) return;
			spawn(now);
			for (const a of asts) a.y += a.speed;
			asts = asts.filter((a) => a.y - a.r < c.height + 40);
			for (const a of asts) {
				if (checkCollision(a)) {
					setGameOver(true);
					setRunning(false);
					break;
				}
			}
			draw();
			raf = requestAnimationFrame(update);
		}

		if (running) {
			asts = [];
			lastSpawn = 0;
			startTime = performance.now();
			setScore(0);
			raf = requestAnimationFrame(update);
			scoreInterval = window.setInterval(() => setScore((s) => s + 1), 450);
		}

		return () => {
			if (raf) cancelAnimationFrame(raf);
			if (scoreInterval) clearInterval(scoreInterval);
			window.removeEventListener("resize", resize);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [running, gameOver]);

	useEffect(() => {
		const onPointer = (clientX: number) => {
			const canvas = canvasRef.current;
			if (!canvas) return;
			const rect = canvas.getBoundingClientRect();
			const x = clientX - rect.left;
			const clamped = Math.max(20, Math.min(canvas.width - 20, x));
			shipRef.current.x = clamped;
		};

		const onMove = (e: MouseEvent) => onPointer(e.clientX);
		const onPointerMove = (e: PointerEvent) => onPointer(e.clientX);
		const onTouch = (e: TouchEvent) => {
			if (e.touches && e.touches[0]) onPointer(e.touches[0].clientX);
		};

		window.addEventListener("mousemove", onMove);
		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("touchmove", onTouch, { passive: true });

		return () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("touchmove", onTouch);
		};
	}, []);

	function startGame() {
		setGameOver(false);
		setRunning(true);
		setScore(0);
	}

	return (
		<main className="p-6 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col items-center">
			<h1 className="text-3xl font-bold mb-4">Esquivar el Asteroide</h1>
			<p className="mb-4 text-sm text-slate-300">Mueve el ratón (o toca) para desplazar la nave. Evita los asteroides.</p>
			<canvas ref={canvasRef} className="rounded-md shadow-lg border border-slate-700" />

			<div className="mt-4 flex gap-3">
				{!running && !gameOver && (
					<button onClick={startGame} className="bg-yellow-400 text-slate-900 px-4 py-2 rounded-md font-semibold">Empezar</button>
				)}
				{running && (
					<button onClick={() => setRunning(false)} className="bg-red-500 px-4 py-2 rounded-md">Pausar</button>
				)}
				{gameOver && (
					<div className="flex items-center gap-3">
						<span className="text-lg">¡Juego terminado! Puntuación: {score}</span>
						<button onClick={startGame} className="bg-green-500 px-3 py-1 rounded-md">Reintentar</button>
					</div>
				)}
			</div>
		</main>
	);
}

