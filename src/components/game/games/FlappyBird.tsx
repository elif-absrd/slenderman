import { useCallback, useEffect, useRef, useState } from "react";
import { GameShell, Overlay } from "./Snake";

const W = 360;
const H = 512;
const GROUND_Y = 448;
const GRAVITY = 0.3;
const FLAP_VELOCITY = -5.6;
const PIPE_W = 56;
const PIPE_GAP = 160;
const PIPE_SPEED = 1.8;
const PIPE_INTERVAL = 120;
const BIRD_X = 82;
const BIRD_W = 28;
const BIRD_H = 20;

interface Pipe {
  x: number;
  topH: number;
  passed: boolean;
}

interface Props {
  onExit: () => void;
}

type GameState = "idle" | "playing" | "dead";

export default function FlappyBird({ onExit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loopCallbackRef = useRef<FrameRequestCallback>(() => undefined);
  const [score, setScore] = useState(0);
  const [hiScore, setHiScore] = useState(
    () => parseInt(localStorage.getItem("flappy_hi") ?? "0")
  );
  const [gameState, setGameState] = useState<GameState>("idle");

  const stateRef = useRef({
    birdY: H / 2,
    birdVY: 0,
    pipes: [] as Pipe[],
    score: 0,
    frame: 0,
    gameState: "idle" as GameState,
    rafId: 0,
  });

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    ctx.imageSmoothingEnabled = false;

    // Sky and distant clouds
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, W, GROUND_Y);
    const cloudOffset = -((s.frame * 0.25) % 180);
    for (let x = cloudOffset - 80; x < W + 80; x += 180) {
      ctx.fillStyle = "#e8f6df";
      ctx.fillRect(x, 330, 94, 34);
      ctx.fillRect(x + 14, 318, 56, 46);
      ctx.fillStyle = "#c4e5c4";
      ctx.fillRect(x, 359, 94, 8);
      ctx.fillRect(x + 70, 340, 24, 19);
    }

    // City-like bushes at the horizon
    const bushOffset = -((s.frame * 0.55) % 96);
    for (let x = bushOffset - 48; x < W + 48; x += 48) {
      ctx.fillStyle = "#9de36c";
      ctx.fillRect(x, 395, 54, 53);
      ctx.fillRect(x + 8, 384, 22, 64);
      ctx.fillStyle = "#73c952";
      ctx.fillRect(x + 36, 406, 18, 42);
      ctx.fillStyle = "#d6f49c";
      ctx.fillRect(x + 12, 391, 8, 8);
    }

    // Pipes
    s.pipes.forEach((pipe) => {
      const bottomY = pipe.topH + PIPE_GAP;
      drawPipe(ctx, pipe.x, 0, pipe.topH, false);
      drawPipe(ctx, pipe.x, bottomY, GROUND_Y - bottomY, true);
    });

    // Grass and tiled ground
    ctx.fillStyle = "#73bf2e";
    ctx.fillRect(0, GROUND_Y, W, 8);
    ctx.fillStyle = "#d8e45a";
    ctx.fillRect(0, GROUND_Y + 8, W, H - GROUND_Y - 8);
    ctx.fillStyle = "#9ebf3d";
    ctx.fillRect(0, GROUND_Y + 12, W, 4);
    const tileOffset = -((s.frame * PIPE_SPEED) % 24);
    for (let x = tileOffset - 24; x < W + 24; x += 24) {
      ctx.fillStyle = "#c3cf4e";
      ctx.fillRect(x, GROUND_Y + 20, 13, 5);
      ctx.fillRect(x + 12, GROUND_Y + 39, 13, 5);
    }

    drawBird(ctx, s.birdY, s.birdVY, s.frame);

    if (s.gameState === "playing") {
      drawPixelText(ctx, String(s.score), W / 2, 62, 34, "center");
    }
  }, []);

  const killBird = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState !== "playing") return;
    s.gameState = "dead";
    setGameState("dead");
    cancelAnimationFrame(s.rafId);
    const savedHiScore = parseInt(localStorage.getItem("flappy_hi") ?? "0");
    if (s.score > savedHiScore) {
      localStorage.setItem("flappy_hi", String(s.score));
      setHiScore(s.score);
    }
    drawFrame();
  }, [drawFrame]);

  const gameLoop = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState !== "playing") return;

    s.frame += 1;
    s.birdVY += GRAVITY;
    s.birdY += s.birdVY;

    if (s.frame % PIPE_INTERVAL === 0 || s.pipes.length === 0) {
      const minH = 56;
      const maxH = GROUND_Y - PIPE_GAP - minH;
      s.pipes.push({
        x: W + 12,
        topH: minH + Math.floor(Math.random() * (maxH - minH)),
        passed: false,
      });
    }

    s.pipes.forEach((pipe) => {
      pipe.x -= PIPE_SPEED;
      if (!pipe.passed && pipe.x + PIPE_W < BIRD_X) {
        pipe.passed = true;
        s.score += 1;
        setScore(s.score);
      }
    });
    s.pipes = s.pipes.filter((pipe) => pipe.x > -PIPE_W - 8);

    const birdLeft = BIRD_X - BIRD_W / 2 + 3;
    const birdRight = BIRD_X + BIRD_W / 2 - 3;
    const birdTop = s.birdY - BIRD_H / 2 + 3;
    const birdBottom = s.birdY + BIRD_H / 2 - 3;

    if (birdTop < 0 || birdBottom > GROUND_Y) {
      killBird();
      return;
    }

    const hitPipe = s.pipes.some((pipe) => {
      const overlapsX = birdRight > pipe.x && birdLeft < pipe.x + PIPE_W;
      return overlapsX && (birdTop < pipe.topH || birdBottom > pipe.topH + PIPE_GAP);
    });
    if (hitPipe) {
      killBird();
      return;
    }

    drawFrame();
    s.rafId = requestAnimationFrame(loopCallbackRef.current);
  }, [drawFrame, killBird]);

  useEffect(() => {
    loopCallbackRef.current = gameLoop;
  }, [gameLoop]);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    cancelAnimationFrame(s.rafId);
    s.birdY = H / 2;
    s.birdVY = FLAP_VELOCITY;
    s.pipes = [];
    s.score = 0;
    s.frame = 0;
    s.gameState = "playing";
    setScore(0);
    setGameState("playing");
    s.rafId = requestAnimationFrame(loopCallbackRef.current);
  }, []);

  const flap = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState !== "playing") {
      startGame();
      return;
    }
    s.birdVY = FLAP_VELOCITY;
  }, [startGame]);

  useEffect(() => {
    const s = stateRef.current;
    drawFrame();
    return () => cancelAnimationFrame(s.rafId);
  }, [drawFrame]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        cancelAnimationFrame(stateRef.current.rafId);
        onExit();
        return;
      }
      if (e.key === "r" || e.key === "R") {
        startGame();
        return;
      }
      const isFlapKey =
        e.code === "Space" ||
        e.key === " " ||
        e.key === "Spacebar" ||
        e.key === "ArrowUp" ||
        e.key === "w" ||
        e.key === "W";
      if (isFlapKey) {
        e.preventDefault();
        flap();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flap, onExit, startGame]);

  return (
    <GameShell
      title="flappy-bird"
      score={score}
      hiScore={hiScore}
      controls="SPACE / W / ↑ / Click to flap · R restart · ESC exit"
      onExit={onExit}
    >
      <div
        style={{ position: "relative", background: "#70c5ce", touchAction: "none", userSelect: "none" }}
        onPointerDown={(e) => {
          e.preventDefault();
          flap();
        }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{
            display: "block",
            width: "min(360px, 92vw)",
            height: "auto",
            cursor: "pointer",
            imageRendering: "pixelated",
          }}
        />
        {gameState !== "playing" && (
          <Overlay
            title={gameState === "dead" ? "GAME OVER" : "FLAPPY BIRD"}
            subtitle={
              gameState === "dead"
                ? `Final score: ${score}. Press R to fly again.`
                : "Press SPACE or tap to flap"
            }
            showCrash={false}
            onStart={startGame}
          />
        )}
      </div>
    </GameShell>
  );
}

function drawPipe(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  height: number,
  capAtTop: boolean
) {
  const capY = capAtTop ? y : y + height - 24;
  ctx.fillStyle = "#558c26";
  ctx.fillRect(x + 5, y, PIPE_W - 10, height);
  ctx.fillStyle = "#73bf2e";
  ctx.fillRect(x + 10, y, 11, height);
  ctx.fillStyle = "#a7e34b";
  ctx.fillRect(x + 13, y, 5, height);
  ctx.fillStyle = "#37691d";
  ctx.fillRect(x + PIPE_W - 14, y, 9, height);
  ctx.fillStyle = "#31551e";
  ctx.fillRect(x + 5, y, 4, height);

  ctx.fillStyle = "#31551e";
  ctx.fillRect(x, capY, PIPE_W, 24);
  ctx.fillStyle = "#73bf2e";
  ctx.fillRect(x + 4, capY + 4, PIPE_W - 8, 16);
  ctx.fillStyle = "#a7e34b";
  ctx.fillRect(x + 9, capY + 4, 8, 16);
  ctx.fillStyle = "#37691d";
  ctx.fillRect(x + PIPE_W - 12, capY + 4, 8, 16);
}

function drawBird(
  ctx: CanvasRenderingContext2D,
  y: number,
  velocity: number,
  frame: number
) {
  const wingUp = Math.floor(frame / 5) % 2 === 0;
  const tilt = Math.max(-0.32, Math.min(0.62, velocity * 0.065));

  ctx.save();
  ctx.translate(BIRD_X, y);
  ctx.rotate(tilt);
  ctx.fillStyle = "#24211d";
  ctx.fillRect(-14, -7, 23, 17);
  ctx.fillRect(-10, -11, 16, 25);
  ctx.fillStyle = "#f4d43c";
  ctx.fillRect(-12, -7, 19, 17);
  ctx.fillRect(-8, -10, 13, 22);
  ctx.fillStyle = "#fff7dc";
  ctx.fillRect(2, -9, 9, 9);
  ctx.fillStyle = "#24211d";
  ctx.fillRect(7, -6, 4, 5);
  ctx.fillStyle = "#f05a28";
  ctx.fillRect(8, 1, 13, 6);
  ctx.fillStyle = "#fff0a4";
  ctx.fillRect(8, 1, 13, 3);
  ctx.fillStyle = "#e59a25";
  ctx.fillRect(-15, wingUp ? 0 : 5, 13, 7);
  ctx.fillStyle = "#fff0a4";
  ctx.fillRect(-13, wingUp ? 0 : 5, 9, 3);
  ctx.restore();
}

function drawPixelText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  align: CanvasTextAlign
) {
  ctx.font = `bold ${size}px "Courier New", monospace`;
  ctx.textAlign = align;
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#303030";
  ctx.strokeText(text, x, y);
  ctx.fillStyle = "#fff";
  ctx.fillText(text, x, y);
  ctx.textAlign = "start";
}
