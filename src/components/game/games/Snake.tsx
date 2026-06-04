import { useCallback, useEffect, useRef, useState } from "react";

const CELL = 20;
const COLS = 25;
const ROWS = 20;
const W = COLS * CELL;
const H = ROWS * CELL;

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Point = { x: number; y: number };

function rand(max: number) {
  return Math.floor(Math.random() * max);
}

function newFood(snake: Point[]): Point {
  let food: Point;
  do {
    food = { x: rand(COLS), y: rand(ROWS) };
  } while (snake.some((s) => s.x === food.x && s.y === food.y));
  return food;
}

interface Props {
  onExit: () => void;
}

type GameState = "idle" | "playing" | "dead";

export default function Snake({ onExit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tickCallbackRef = useRef<() => void>(() => undefined);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const stateRef = useRef({
    snake: [{ x: 12, y: 10 }],
    dir: "RIGHT" as Dir,
    nextDir: "RIGHT" as Dir,
    food: { x: 18, y: 10 },
    score: 0,
    gameState: "idle" as GameState,
    speed: 130,
  });
  const [score, setScore] = useState(0);
  const [hiScore, setHiScore] = useState(
    () => parseInt(localStorage.getItem("snake_hi") ?? "0")
  );
  const [gameState, setGameState] = useState<GameState>("idle");
  const loopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const changeDirection = useCallback((newDir: Dir) => {
    const s = stateRef.current;
    const opposite: Record<Dir, Dir> = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };
    if (newDir !== opposite[s.dir]) s.nextDir = newDir;
  }, []);

  const handleSwipe = useCallback((x: number, y: number) => {
    const start = swipeStartRef.current;
    if (!start) return;
    const dx = x - start.x;
    const dy = y - start.y;
    const minSwipeDistance = 18;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < minSwipeDistance) return;

    changeDirection(
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? "RIGHT"
          : "LEFT"
        : dy > 0
        ? "DOWN"
        : "UP"
    );
    swipeStartRef.current = { x, y };
  }, [changeDirection]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const { snake, food } = stateRef.current;

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, W, H);

    // Grid dots
    ctx.fillStyle = "#141414";
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);
      }
    }

    // Food
    ctx.fillStyle = "#f0a500";
    ctx.fillRect(food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6);
    // Food glow
    ctx.shadowColor = "#f0a500";
    ctx.shadowBlur = 8;
    ctx.fillRect(food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6);
    ctx.shadowBlur = 0;

    // Snake
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      const alpha = isHead ? 1 : Math.max(0.3, 1 - i * 0.04);
      ctx.fillStyle = isHead
        ? `rgba(240, 165, 0, ${alpha})`
        : `rgba(180, 120, 0, ${alpha})`;
      const pad = isHead ? 2 : 3;
      ctx.fillRect(
        seg.x * CELL + pad,
        seg.y * CELL + pad,
        CELL - pad * 2,
        CELL - pad * 2
      );

      if (isHead) {
        ctx.fillStyle = "#0a0a0a";
        const eyeSize = 2;
        ctx.fillRect(
          seg.x * CELL + CELL - 6,
          seg.y * CELL + 5,
          eyeSize,
          eyeSize
        );
        ctx.fillRect(
          seg.x * CELL + CELL - 6,
          seg.y * CELL + CELL - 7,
          eyeSize,
          eyeSize
        );
      }
    });
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState !== "playing") return;

    s.dir = s.nextDir;
    const head = s.snake[0];
    const next: Point = { x: head.x, y: head.y };

    if (s.dir === "UP") next.y -= 1;
    if (s.dir === "DOWN") next.y += 1;
    if (s.dir === "LEFT") next.x -= 1;
    if (s.dir === "RIGHT") next.x += 1;

    // Wall collision
    if (next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS) {
      s.gameState = "dead";
      setGameState("dead");
      if (s.score > hiScore) {
        localStorage.setItem("snake_hi", String(s.score));
        setHiScore(s.score);
      }
      draw();
      return;
    }

    // Self collision
    if (s.snake.some((seg) => seg.x === next.x && seg.y === next.y)) {
      s.gameState = "dead";
      setGameState("dead");
      if (s.score > hiScore) {
        localStorage.setItem("snake_hi", String(s.score));
        setHiScore(s.score);
      }
      draw();
      return;
    }

    const ate = next.x === s.food.x && next.y === s.food.y;
    s.snake = [next, ...s.snake];
    if (!ate) s.snake.pop();
    else {
      s.food = newFood(s.snake);
      s.score += 10;
      setScore(s.score);
      if (s.score % 50 === 0) s.speed = Math.max(60, s.speed - 5);
    }

    draw();
    loopRef.current = setTimeout(() => tickCallbackRef.current(), s.speed);
  }, [draw, hiScore]);

  useEffect(() => {
    tickCallbackRef.current = tick;
  }, [tick]);

  const startGame = useCallback(() => {
    if (loopRef.current) clearTimeout(loopRef.current);
    const s = stateRef.current;
    s.snake = [{ x: 12, y: 10 }];
    s.dir = "RIGHT";
    s.nextDir = "RIGHT";
    s.food = newFood(s.snake);
    s.score = 0;
    s.gameState = "playing";
    s.speed = 130;
    setScore(0);
    setGameState("playing");
    loopRef.current = setTimeout(() => tickCallbackRef.current(), s.speed);
  }, []);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const s = stateRef.current;
      if (e.key === "Escape") {
        if (loopRef.current) clearTimeout(loopRef.current);
        onExit();
        return;
      }
      if (e.key === "r" || e.key === "R") {
        startGame();
        return;
      }
      if (
        (e.key === " " || e.key === "Enter") &&
        s.gameState !== "playing"
      ) {
        startGame();
        return;
      }
      const map: Record<string, Dir> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        w: "UP",
        s: "DOWN",
        a: "LEFT",
        d: "RIGHT",
        W: "UP",
        S: "DOWN",
        A: "LEFT",
        D: "RIGHT",
      };
      const newDir = map[e.key];
      if (!newDir) return;
      changeDirection(newDir);
      e.preventDefault();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (loopRef.current) clearTimeout(loopRef.current);
    };
  }, [changeDirection, onExit, startGame]);

  return (
    <GameShell
      title="snake.exe"
      score={score}
      hiScore={hiScore}
      controls="WASD / Arrows · R restart · ESC exit"
      onExit={onExit}
      mobileControls={
        <MobileControls label="Snake touch controls">
          <div
            style={{
              color: "#777",
              fontSize: 11,
              letterSpacing: "0.12em",
              padding: "6px 0 2px",
            }}
          >
            SWIPE ON THE BOARD TO STEER
          </div>
        </MobileControls>
      }
    >
      <div
        style={{
          position: "relative",
          touchAction: "none",
          userSelect: "none",
        }}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") return;
          e.currentTarget.setPointerCapture(e.pointerId);
          swipeStartRef.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerMove={(e) => {
          if (e.pointerType === "mouse") return;
          e.preventDefault();
          handleSwipe(e.clientX, e.clientY);
        }}
        onPointerUp={(e) => {
          if (e.pointerType === "mouse") return;
          handleSwipe(e.clientX, e.clientY);
          swipeStartRef.current = null;
        }}
        onPointerCancel={() => {
          swipeStartRef.current = null;
        }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{
            display: "block",
            width: "min(500px, 94vw)",
            height: "auto",
            borderRadius: 2,
            imageRendering: "pixelated",
          }}
        />
        {gameState !== "playing" && (
          <Overlay
            title={gameState === "dead" ? "SEGFAULT" : "SNAKE.EXE"}
            subtitle={
              gameState === "dead"
                ? `Core dumped. Score: ${score}`
                : "Press SPACE or ENTER to execute"
            }
            showCrash={gameState === "dead"}
            onStart={startGame}
          />
        )}
      </div>
    </GameShell>
  );
}

// ─── Tetris ────────────────────────────────────────────────────────────────
// (see Tetris.tsx)

// ─── Shared overlay ────────────────────────────────────────────────────────
interface OverlayProps {
  title: string;
  subtitle: string;
  showCrash: boolean;
  onStart: () => void;
}

export function Overlay({ title, subtitle, showCrash, onStart }: OverlayProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.82)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        fontFamily: "'Courier New', monospace",
      }}
    >
      {showCrash && (
        <div style={{ color: "#ff4444", fontSize: 11, marginBottom: 4 }}>
          Segmentation fault (core dumped)
        </div>
      )}
      <div
        style={{
          color: "#f0a500",
          fontSize: 22,
          fontWeight: "bold",
          letterSpacing: 3,
        }}
      >
        {title}
      </div>
      <div style={{ color: "#555", fontSize: 12 }}>{subtitle}</div>
      <button
        onClick={onStart}
        style={{
          marginTop: 8,
          background: "transparent",
          border: "1px solid #f0a500",
          color: "#f0a500",
          fontFamily: "'Courier New', monospace",
          fontSize: 12,
          padding: "7px 20px",
          borderRadius: 3,
          cursor: "pointer",
          letterSpacing: 1,
        }}
      >
        {showCrash ? "> ./restart.sh" : "> ./start.sh"}
      </button>
    </div>
  );
}

// ─── Game shell wrapper ─────────────────────────────────────────────────────
interface ShellProps {
  title: string;
  score: number;
  hiScore: number;
  controls: string;
  onExit: () => void;
  mobileControls?: React.ReactNode;
  children: React.ReactNode;
}

export function GameShell({
  title,
  score,
  hiScore,
  controls,
  onExit,
  mobileControls,
  children,
}: ShellProps) {
  return (
    <div
      className="game-shell-root"
      style={{
        position: "fixed",
        inset: 0,
        background: "#080808",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 9997,
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      {/* Scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)",
          pointerEvents: "none",
        }}
      />

      {/* Top bar */}
      <div
        className="game-shell-frame"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
          position: "relative",
          zIndex: 1,
        }}
      >
        <span style={{ color: "#f0a500", fontSize: 13 }}>$ ./{title}</span>
        <div style={{ display: "flex", gap: 16, fontSize: 12, alignItems: "center" }}>
          <span style={{ color: "#444" }}>
            score:{" "}
            <span style={{ color: "#fff" }}>{String(score).padStart(4, "0")}</span>
          </span>
          <span style={{ color: "#444" }}>
            hi:{" "}
            <span style={{ color: "#f0a500" }}>{String(hiScore).padStart(4, "0")}</span>
          </span>
          <button
            onClick={onExit}
            style={{
              background: "transparent",
              border: "1px solid #222",
              color: "#555",
              padding: "0.15rem 0.6rem",
              fontSize: 10,
              letterSpacing: "0.08em",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#aaa";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#555";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#555";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#222";
            }}
            aria-label="Exit game"
          >
            ESC EXIT
          </button>
        </div>
      </div>

      {/* Game canvas area */}
      <div
        className="game-shell-canvas"
        style={{
          border: "1px solid #1e1e1e",
          borderRadius: 4,
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </div>

      {mobileControls}

      {/* Bottom controls */}
      <div
        className="desktop-controls-hint"
        style={{
          marginTop: 12,
          color: "#252525",
          fontSize: 11,
          letterSpacing: 0.5,
          position: "relative",
          zIndex: 1,
        }}
      >
        {controls}
      </div>

      <style>{`
        .game-shell-root {
          justify-content: center;
          box-sizing: border-box;
          overflow-y: auto;
          padding: 16px 0;
          overscroll-behavior: contain;
        }
        .game-shell-frame {
          width: min(560px, 96vw);
        }
        .game-shell-canvas {
          max-width: 96vw;
          flex-shrink: 0;
        }
        .mobile-game-controls {
          display: none;
        }
        @media (max-width: 768px), (max-height: 760px), (pointer: coarse) {
          .game-shell-root {
            justify-content: flex-start;
            padding-top: max(12px, env(safe-area-inset-top));
            padding-bottom: max(12px, env(safe-area-inset-bottom));
          }
          .mobile-game-controls {
            display: flex;
          }
          .desktop-controls-hint {
            max-width: 94vw;
            text-align: center;
            font-size: 9px !important;
          }
        }
        @media (max-width: 420px) {
          .game-shell-frame {
            box-sizing: border-box;
            flex-wrap: wrap;
            gap: 7px;
            padding: 0 2px;
          }
          .game-shell-frame > div {
            gap: 8px !important;
          }
        }
      `}</style>
    </div>
  );
}

interface MobileControlsProps {
  label: string;
  children: React.ReactNode;
}

export function MobileControls({ label, children }: MobileControlsProps) {
  return (
    <div
      className="mobile-game-controls"
      aria-label={label}
      style={{
        marginTop: 12,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 2,
        touchAction: "manipulation",
      }}
    >
      {children}
    </div>
  );
}

interface TouchButtonProps {
  label: string;
  onPress: () => void;
  children: React.ReactNode;
  accent?: boolean;
  terminal?: boolean;
}

export function TouchButton({
  label,
  onPress,
  children,
  accent = false,
  terminal = false,
}: TouchButtonProps) {
  const borderColor = accent ? "#E8A020" : terminal ? "#1d6135" : "#3b3b3b";
  const background = accent ? "#2a210d" : terminal ? "#07130a" : "#151515";
  const color = accent ? "#E8A020" : terminal ? "#4ade80" : "#c8c8c8";

  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(e) => {
        e.preventDefault();
        onPress();
      }}
      style={{
        minWidth: 48,
        minHeight: 44,
        border: `1px solid ${borderColor}`,
        borderRadius: 5,
        background,
        color,
        fontFamily: "'Courier New', monospace",
        fontSize: 20,
        cursor: "pointer",
        touchAction: "manipulation",
        userSelect: "none",
      }}
    >
      {children}
    </button>
  );
}
