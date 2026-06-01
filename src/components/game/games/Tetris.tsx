import { useCallback, useEffect, useRef, useState } from "react";
import { GameShell, Overlay } from "./Snake";

const COLS = 10;
const ROWS = 20;
const CELL = 28;
const W = COLS * CELL;
const H = ROWS * CELL;

type Board = (string | null)[][];
type PieceShape = number[][];

const PIECES: { shape: PieceShape; color: string }[] = [
  { shape: [[1, 1, 1, 1]], color: "#5ecfef" },                          // I - cyan
  { shape: [[1, 0], [1, 0], [1, 1]], color: "#f0a500" },               // J - amber
  { shape: [[0, 1], [0, 1], [1, 1]], color: "#4a90d9" },               // L - blue
  { shape: [[1, 1], [1, 1]], color: "#f5e642" },                       // O - yellow
  { shape: [[0, 1, 1], [1, 1, 0]], color: "#5ed45e" },                 // S - green
  { shape: [[0, 1, 0], [1, 1, 1]], color: "#b05ef0" },                 // T - purple
  { shape: [[1, 1, 0], [0, 1, 1]], color: "#f05e5e" },                 // Z - red
];

function rotate(shape: PieceShape): PieceShape {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: PieceShape = Array.from({ length: cols }, () =>
    Array(rows).fill(0)
  );
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c];
    }
  }
  return rotated;
}

function randomPiece() {
  const p = PIECES[Math.floor(Math.random() * PIECES.length)];
  return { shape: p.shape, color: p.color };
}

function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function isValid(board: Board, shape: PieceShape, px: number, py: number) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nx = px + c;
      const ny = py + r;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
      if (ny >= 0 && board[ny][nx]) return false;
    }
  }
  return true;
}

function lockPiece(
  board: Board,
  shape: PieceShape,
  px: number,
  py: number,
  color: string
): Board {
  const b = board.map((r) => [...r]);
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] && py + r >= 0) {
        b[py + r][px + c] = color;
      }
    }
  }
  return b;
}

function clearLines(board: Board): { board: Board; cleared: number } {
  const newBoard = board.filter((row) => row.some((c) => !c));
  const cleared = ROWS - newBoard.length;
  const empty = Array.from({ length: cleared }, () => Array(COLS).fill(null));
  return { board: [...empty, ...newBoard], cleared };
}

const SCORE_TABLE = [0, 100, 300, 500, 800];

interface Props {
  onExit: () => void;
}

type GameState = "idle" | "playing" | "dead";

export default function Tetris({ onExit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextCanvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [hiScore, setHiScore] = useState(
    () => parseInt(localStorage.getItem("tetris_hi") ?? "0")
  );
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<GameState>("idle");

  const stateRef = useRef({
    board: emptyBoard(),
    piece: randomPiece(),
    next: randomPiece(),
    px: 3,
    py: -1,
    score: 0,
    level: 1,
    gameState: "idle" as GameState,
    dropInterval: 600,
  });

  const drawBoard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = "#141414";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, H);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(W, y * CELL);
      ctx.stroke();
    }

    // Ghost piece
    let ghostY = s.py;
    while (isValid(s.board, s.piece.shape, s.px, ghostY + 1)) ghostY++;
    if (ghostY !== s.py && s.gameState === "playing") {
      for (let r = 0; r < s.piece.shape.length; r++) {
        for (let c = 0; c < s.piece.shape[r].length; c++) {
          if (!s.piece.shape[r][c]) continue;
          const gx = (s.px + c) * CELL;
          const gy = (ghostY + r) * CELL;
          if (ghostY + r >= 0) {
            ctx.strokeStyle = s.piece.color + "40";
            ctx.lineWidth = 1;
            ctx.strokeRect(gx + 1, gy + 1, CELL - 2, CELL - 2);
          }
        }
      }
    }

    // Locked board
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const color = s.board[r][c];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
          ctx.fillStyle = "rgba(255,255,255,0.1)";
          ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, 3);
        }
      }
    }

    // Active piece
    if (s.gameState === "playing") {
      for (let r = 0; r < s.piece.shape.length; r++) {
        for (let c = 0; c < s.piece.shape[r].length; c++) {
          if (!s.piece.shape[r][c]) continue;
          const px = (s.px + c) * CELL;
          const py = (s.py + r) * CELL;
          if (s.py + r >= 0) {
            ctx.fillStyle = s.piece.color;
            ctx.fillRect(px + 1, py + 1, CELL - 2, CELL - 2);
            ctx.fillStyle = "rgba(255,255,255,0.15)";
            ctx.fillRect(px + 1, py + 1, CELL - 2, 3);
          }
        }
      }
    }
  }, []);

  const drawNext = useCallback(() => {
    const canvas = nextCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const { next } = stateRef.current;
    const size = 4;
    const cs = 18;

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, size * cs, size * cs);

    const offX = Math.floor((size - next.shape[0].length) / 2);
    const offY = Math.floor((size - next.shape.length) / 2);

    for (let r = 0; r < next.shape.length; r++) {
      for (let c = 0; c < next.shape[r].length; c++) {
        if (!next.shape[r][c]) continue;
        ctx.fillStyle = next.color;
        ctx.fillRect(
          (offX + c) * cs + 1,
          (offY + r) * cs + 1,
          cs - 2,
          cs - 2
        );
      }
    }
  }, []);

  const spawnPiece = useCallback(() => {
    const s = stateRef.current;
    s.piece = s.next;
    s.next = randomPiece();
    s.px = 3;
    s.py = -1;
    drawNext();

    if (!isValid(s.board, s.piece.shape, s.px, s.py)) {
      s.gameState = "dead";
      setGameState("dead");
      if (s.score > parseInt(localStorage.getItem("tetris_hi") ?? "0")) {
        localStorage.setItem("tetris_hi", String(s.score));
        setHiScore(s.score);
      }
    }
  }, [drawNext]);

  const lockAndSpawn = useCallback(() => {
    const s = stateRef.current;
    s.board = lockPiece(s.board, s.piece.shape, s.px, s.py, s.piece.color);
    const { board: newBoard, cleared } = clearLines(s.board);
    s.board = newBoard;
    s.score += SCORE_TABLE[cleared] * s.level;
    s.level = Math.floor(s.score / 500) + 1;
    s.dropInterval = Math.max(80, 600 - (s.level - 1) * 50);
    setScore(s.score);
    setLevel(s.level);
    spawnPiece();
  }, [spawnPiece]);

  const dropRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleDrop = useCallback(() => {
    if (dropRef.current) clearTimeout(dropRef.current);
    const s = stateRef.current;
    if (s.gameState !== "playing") return;
    dropRef.current = setTimeout(() => {
      if (isValid(s.board, s.piece.shape, s.px, s.py + 1)) {
        s.py += 1;
      } else {
        lockAndSpawn();
      }
      drawBoard();
      scheduleDrop();
    }, s.dropInterval);
  }, [drawBoard, lockAndSpawn]);

  function startGame() {
    if (dropRef.current) clearTimeout(dropRef.current);
    const s = stateRef.current;
    s.board = emptyBoard();
    s.piece = randomPiece();
    s.next = randomPiece();
    s.px = 3;
    s.py = -1;
    s.score = 0;
    s.level = 1;
    s.dropInterval = 600;
    s.gameState = "playing";
    setScore(0);
    setLevel(1);
    setGameState("playing");
    drawNext();
    drawBoard();
    scheduleDrop();
  }

  useEffect(() => {
    drawBoard();
    drawNext();
  }, [drawBoard, drawNext]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const s = stateRef.current;
      if (e.key === "Escape") {
        if (dropRef.current) clearTimeout(dropRef.current);
        onExit();
        return;
      }
      if (e.key === "r" || e.key === "R") { startGame(); return; }
      if ((e.key === " " || e.key === "Enter") && s.gameState !== "playing") {
        startGame();
        return;
      }
      if (s.gameState !== "playing") return;

      if (e.key === "ArrowLeft") {
        if (isValid(s.board, s.piece.shape, s.px - 1, s.py)) s.px -= 1;
      } else if (e.key === "ArrowRight") {
        if (isValid(s.board, s.piece.shape, s.px + 1, s.py)) s.px += 1;
      } else if (e.key === "ArrowDown") {
        if (isValid(s.board, s.piece.shape, s.px, s.py + 1)) s.py += 1;
        else { lockAndSpawn(); }
        if (dropRef.current) clearTimeout(dropRef.current);
        scheduleDrop();
      } else if (e.key === "ArrowUp" || e.key === "z" || e.key === "Z") {
        const rotated = rotate(s.piece.shape);
        if (isValid(s.board, rotated, s.px, s.py)) {
          s.piece = { ...s.piece, shape: rotated };
        } else if (isValid(s.board, rotated, s.px - 1, s.py)) {
          s.piece = { ...s.piece, shape: rotated };
          s.px -= 1;
        } else if (isValid(s.board, rotated, s.px + 1, s.py)) {
          s.piece = { ...s.piece, shape: rotated };
          s.px += 1;
        }
      } else if (e.key === " ") {
        // Hard drop
        while (isValid(s.board, s.piece.shape, s.px, s.py + 1)) s.py += 1;
        lockAndSpawn();
        if (dropRef.current) clearTimeout(dropRef.current);
        scheduleDrop();
        e.preventDefault();
        return;
      } else {
        return;
      }
      drawBoard();
      e.preventDefault();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (dropRef.current) clearTimeout(dropRef.current);
    };
  }, [onExit, scheduleDrop, lockAndSpawn, drawBoard]);

  return (
    <GameShell
      title="tetris.exe"
      score={score}
      hiScore={hiScore}
      controls="← → move · ↑/Z rotate · ↓ soft drop · SPACE hard drop · R restart · ESC exit"
      onExit={onExit}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ position: "relative" }}>
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            style={{ display: "block" }}
          />
          {gameState !== "playing" && (
            <Overlay
              title={gameState === "dead" ? "STACK OVERFLOW" : "TETRIS.EXE"}
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

        {/* Side panel */}
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            color: "#444",
            fontSize: 11,
            paddingTop: 4,
            width: 76,
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 6, letterSpacing: 1 }}>NEXT</div>
            <div
              style={{
                border: "1px solid #1a1a1a",
                borderRadius: 3,
                padding: 4,
                background: "#0a0a0a",
              }}
            >
              <canvas
                ref={nextCanvasRef}
                width={4 * 18}
                height={4 * 18}
                style={{ display: "block" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ marginBottom: 4, letterSpacing: 1 }}>LEVEL</div>
            <div style={{ color: "#f0a500", fontSize: 20 }}>
              {String(level).padStart(2, "0")}
            </div>
          </div>

          <div>
            <div style={{ marginBottom: 4, letterSpacing: 1 }}>LINES</div>
            <div style={{ color: "#c8c8c8", fontSize: 14 }}>
              {String(Math.floor(score / 100)).padStart(3, "0")}
            </div>
          </div>
        </div>
      </div>
    </GameShell>
  );
}