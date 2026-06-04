import { useCallback, useEffect, useRef, useState } from "react";
import { GameShell, MobileControls, Overlay, TouchButton } from "./Snake";

const COLS = 10;
const ROWS = 20;
const CELL = 28;
const W = COLS * CELL;
const H = ROWS * CELL;
const SCREEN = "#050705";
const PHOSPHOR = "#4ade80";
const PHOSPHOR_DIM = "#1d6135";
const PHOSPHOR_FAINT = "#12351f";
const AMBER = "#E8A020";

type Board = (string | null)[][];
type PieceShape = number[][];

const PIECES: { shape: PieceShape; color: string }[] = [
  { shape: [[1, 1, 1, 1]], color: PHOSPHOR },
  { shape: [[1, 0], [1, 0], [1, 1]], color: PHOSPHOR },
  { shape: [[0, 1], [0, 1], [1, 1]], color: PHOSPHOR },
  { shape: [[1, 1], [1, 1]], color: PHOSPHOR },
  { shape: [[0, 1, 1], [1, 1, 0]], color: PHOSPHOR },
  { shape: [[0, 1, 0], [1, 1, 1]], color: PHOSPHOR },
  { shape: [[1, 1, 0], [0, 1, 1]], color: PHOSPHOR },
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

    ctx.fillStyle = SCREEN;
    ctx.fillRect(0, 0, W, H);

    // The old terminal version printed the well as a character matrix.
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        drawTerminalCell(ctx, c, r, ".", PHOSPHOR_FAINT);
      }
    }

    // Ghost piece
    let ghostY = s.py;
    while (isValid(s.board, s.piece.shape, s.px, ghostY + 1)) ghostY++;
    if (ghostY !== s.py && s.gameState === "playing") {
      for (let r = 0; r < s.piece.shape.length; r++) {
        for (let c = 0; c < s.piece.shape[r].length; c++) {
          if (!s.piece.shape[r][c]) continue;
          if (ghostY + r >= 0) {
            drawTerminalCell(ctx, s.px + c, ghostY + r, "·", PHOSPHOR_DIM);
          }
        }
      }
    }

    // Locked board
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const color = s.board[r][c];
        if (color) {
          drawTerminalCell(ctx, c, r, "[]", color);
        }
      }
    }

    // Active piece
    if (s.gameState === "playing") {
      for (let r = 0; r < s.piece.shape.length; r++) {
        for (let c = 0; c < s.piece.shape[r].length; c++) {
          if (!s.piece.shape[r][c]) continue;
          if (s.py + r >= 0) {
            drawTerminalCell(ctx, s.px + c, s.py + r, "[]", AMBER);
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

    ctx.fillStyle = SCREEN;
    ctx.fillRect(0, 0, size * cs, size * cs);

    const offX = Math.floor((size - next.shape[0].length) / 2);
    const offY = Math.floor((size - next.shape.length) / 2);

    for (let r = 0; r < next.shape.length; r++) {
      for (let c = 0; c < next.shape[r].length; c++) {
        if (!next.shape[r][c]) continue;
        ctx.fillStyle = PHOSPHOR;
        ctx.font = "bold 16px 'Courier New', monospace";
        ctx.textBaseline = "middle";
        ctx.fillText("[]", (offX + c) * cs, (offY + r) * cs + cs / 2);
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
  const scheduleDropCallbackRef = useRef<() => void>(() => undefined);

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
      scheduleDropCallbackRef.current();
    }, s.dropInterval);
  }, [drawBoard, lockAndSpawn]);

  useEffect(() => {
    scheduleDropCallbackRef.current = scheduleDrop;
  }, [scheduleDrop]);

  const moveHorizontal = useCallback((offset: -1 | 1) => {
    const s = stateRef.current;
    if (s.gameState !== "playing") return;
    if (isValid(s.board, s.piece.shape, s.px + offset, s.py)) s.px += offset;
    drawBoard();
  }, [drawBoard]);

  const rotateCurrent = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState !== "playing") return;
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
    drawBoard();
  }, [drawBoard]);

  const softDrop = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState !== "playing") return;
    if (isValid(s.board, s.piece.shape, s.px, s.py + 1)) s.py += 1;
    else lockAndSpawn();
    if (dropRef.current) clearTimeout(dropRef.current);
    scheduleDrop();
    drawBoard();
  }, [drawBoard, lockAndSpawn, scheduleDrop]);

  const hardDrop = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState !== "playing") return;
    while (isValid(s.board, s.piece.shape, s.px, s.py + 1)) s.py += 1;
    lockAndSpawn();
    if (dropRef.current) clearTimeout(dropRef.current);
    scheduleDrop();
    drawBoard();
  }, [drawBoard, lockAndSpawn, scheduleDrop]);

  const startGame = useCallback(() => {
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
  }, [drawBoard, drawNext, scheduleDrop]);

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
        moveHorizontal(-1);
      } else if (e.key === "ArrowRight") {
        moveHorizontal(1);
      } else if (e.key === "ArrowDown") {
        softDrop();
      } else if (e.key === "ArrowUp" || e.key === "z" || e.key === "Z") {
        rotateCurrent();
      } else if (e.key === " ") {
        // Hard drop
        hardDrop();
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
  }, [drawBoard, hardDrop, moveHorizontal, onExit, rotateCurrent, softDrop, startGame]);

  return (
    <GameShell
      title="tetris.exe"
      score={score}
      hiScore={hiScore}
      controls="← → move · ↑/Z rotate · ↓ soft drop · SPACE hard drop · R restart · ESC exit"
      onExit={onExit}
      mobileControls={
        <MobileControls label="Tetris touch controls">
          <div style={{ display: "flex", gap: 6 }}>
            <TouchButton label="Move left" onPress={() => moveHorizontal(-1)} terminal>←</TouchButton>
            <TouchButton label="Rotate" onPress={rotateCurrent} terminal>↻</TouchButton>
            <TouchButton label="Move right" onPress={() => moveHorizontal(1)} terminal>→</TouchButton>
            <TouchButton label="Soft drop" onPress={softDrop} terminal>↓</TouchButton>
            <TouchButton label="Hard drop" onPress={hardDrop} terminal accent>⇊</TouchButton>
          </div>
        </MobileControls>
      }
    >
      <div
        style={{
          display: "flex",
          width: "min(368px, 94vw)",
          gap: "clamp(6px, 2vw, 12px)",
          alignItems: "flex-start",
          background: SCREEN,
        }}
      >
        <div style={{ position: "relative", flex: "1 1 auto", minWidth: 0 }}>
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            style={{
              display: "block",
              width: "min(280px, calc(94vw - 82px))",
              height: "auto",
              imageRendering: "pixelated",
              border: `1px solid ${PHOSPHOR_DIM}`,
              boxShadow: `0 0 18px ${PHOSPHOR_FAINT}`,
            }}
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
            color: PHOSPHOR_DIM,
            fontSize: 11,
            paddingTop: 4,
            width: "clamp(62px, 20vw, 76px)",
            flexShrink: 0,
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 6, letterSpacing: 1 }}>NEXT:</div>
            <div
              style={{
                border: `1px solid ${PHOSPHOR_DIM}`,
                padding: 4,
                background: SCREEN,
              }}
            >
              <canvas
                ref={nextCanvasRef}
                width={4 * 18}
                height={4 * 18}
                style={{ display: "block", width: "100%", height: "auto" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ marginBottom: 4, letterSpacing: 1 }}>LEVEL:</div>
            <div style={{ color: AMBER, fontSize: 20, textShadow: `0 0 8px ${AMBER}` }}>
              {String(level).padStart(2, "0")}
            </div>
          </div>

          <div>
            <div style={{ marginBottom: 4, letterSpacing: 1 }}>LINES:</div>
            <div style={{ color: PHOSPHOR, fontSize: 14 }}>
              {String(Math.floor(score / 100)).padStart(3, "0")}
            </div>
          </div>

          <div
            style={{
              marginTop: 18,
              color: PHOSPHOR_DIM,
              fontSize: 9,
              lineHeight: 1.55,
            }}
          >
            <div>STATUS:</div>
            <div style={{ color: PHOSPHOR }}>ONLINE</div>
          </div>
        </div>
      </div>
    </GameShell>
  );
}

function drawTerminalCell(
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number,
  glyph: string,
  color: string
) {
  ctx.fillStyle = color;
  ctx.font = `bold ${glyph === "." ? 16 : 20}px "Courier New", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(glyph, col * CELL + CELL / 2, row * CELL + CELL / 2 + 1);
  ctx.textAlign = "start";
}
