import { useEffect, useRef, useState } from "react";

export type GameId = "snake" | "tetris" | "flappy";

interface GameEntry {
  id: GameId;
  label: string;
  exe: string;
  desc: string;
}

const GAMES: GameEntry[] = [
  { id: "snake", exe: "snake.exe", label: "SNAKE", desc: "" },
  { id: "tetris", exe: "tetris.exe", label: "TETRIS", desc: "" },
  { id: "flappy", exe: "flappy.exe", label: "FLAPPY BIRD", desc: "" },
];

interface GameSelectorProps {
  onSelect: (id: GameId) => void;
  onBack: () => void;
}

type Phase = "boot" | "awaiting" | "running";

const PROMPT = "slenderman:~/games$";

export default function GameSelector({ onSelect, onBack }: GameSelectorProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("boot");
  const [cursorOn, setCursorOn] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Blinking cursor
  useEffect(() => {
    const t = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(t);
  }, []);

  // Scroll to bottom whenever lines change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, phase]);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, [phase]);

  // Boot sequence
  useEffect(() => {
    const seq = [
      { text: "elif_absrd GNU/Linux 1.0.0 (tty1)", delay: 0 },
      { text: "Loading /usr/local/games registry...", delay: 300 },
      { text: "[OK] mounted arcade drive: /dev/fun0", delay: 700 },
      { text: "", delay: 900 },
      { text: `${PROMPT} ls -l ./`, delay: 1100 },
    ];

    const timers: ReturnType<typeof setTimeout>[] = [];

    seq.forEach(({ text, delay }) => {
      timers.push(
        setTimeout(() => {
          setLines((prev) => [...prev, text]);
        }, delay)
      );
    });

    timers.push(
      setTimeout(() => {
        setLines((prev) => [
          ...prev,
          "",
          "  [1]  ./snake       ",
          "  [2]  ./tetris      ",
          "  [3]  ./flappy-bird  ",
          "",
        ]);
        setPhase("awaiting");
      }, 1500)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleSelect = (raw: string) => {
    const trimmed = raw.trim().toLowerCase();

    const byIndex: Record<string, GameId> = {
      "1": "snake",
      "2": "tetris",
      "3": "flappy",
    };

    const byName: Record<string, GameId> = {
      snake: "snake",
      "snake.exe": "snake",
      "./snake": "snake",
      tetris: "tetris",
      "tetris.exe": "tetris",
      "./tetris": "tetris",
      flappy: "flappy",
      "flappy.exe": "flappy",
      "flappy bird": "flappy",
      "flappy-bird": "flappy",
      "./flappy-bird": "flappy",
    };

    const gameId = byIndex[trimmed] ?? byName[trimmed];

    if (gameId) {
      const entry = GAMES.find((g) => g.id === gameId)!;
      setLines((prev) => [
        ...prev,
        `${PROMPT} ./${entry.id === "flappy" ? "flappy-bird" : entry.id}`,
        "",
        `  Launching ${entry.exe}...`,
        `  [OK] Process started`,
        "",
      ]);
      setPhase("running");
      setTimeout(() => onSelect(gameId), 900);
    } else {
      setLines((prev) => [
        ...prev,
        `${PROMPT} ${raw}`,
        `bash: ${raw}: command not found`,
        `hint: type 1, 2, or 3 to launch a game`,
        "",
      ]);
      setPhase("awaiting");
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && phase === "awaiting") {
      const val = input.trim();
      setInput("");
      if (val === "") return;
      setPhase("running");
      handleSelect(val);
    }
  };

  const handleClickNumber = (n: number) => {
    if (phase !== "awaiting") return;
    handleSelect(String(n));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#080b0a",
        fontFamily: "'Courier New', Courier, monospace",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        touchAction: "manipulation",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Linux terminal title bar */}
      <div
        style={{
          background: "#202421",
          borderBottom: "1px solid #111",
          padding: "0.55rem 0.85rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {["#e06c75", "#e5c07b", "#98c379"].map((color) => (
              <span
                key={color}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: color,
                  display: "block",
                }}
              />
            ))}
          </div>
          <span style={{ color: "#b7c0b8", fontSize: "0.72rem" }}>
            slenderman:~/games
          </span>
        </div>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "1px solid #424842",
            color: "#aab2aa",
            padding: "0.2rem 0.8rem",
            fontSize: "0.65rem",
            letterSpacing: "0.06em",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.color = "#aaa";
            (e.target as HTMLButtonElement).style.borderColor = "#555";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.color = "#555";
            (e.target as HTMLButtonElement).style.borderColor = "#333";
          }}
        >
          exit
        </button>
      </div>

      {/* Terminal output */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "auto",
          padding: "clamp(1rem, 4vw, 2.5rem) clamp(1rem, 5vw, 4rem) 0.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0",
        }}
      >
        {lines.map((line, i) => {
          // Clickable game lines
          const clickMatch = line.match(/^\s+\[(\d)\]\s+(\S+)/);
          if (clickMatch && phase === "awaiting") {
            const num = parseInt(clickMatch[1]);
            return (
              <div
                key={i}
                onClick={() => handleClickNumber(num)}
                style={{
                  color: "#d0d7d0",
                  fontSize: "clamp(0.75rem, 1.8vw, 0.9rem)",
                  lineHeight: "1.7",
                  cursor: "pointer",
                  padding: "0 0.2rem",
                  borderRadius: "2px",
                  transition: "background 0.1s",
                  minHeight: 36,
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.background = "#15251c")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.background = "transparent")
                }
              >
                {line}
              </div>
            );
          }

          // Styled lines
          const isCmd = line.startsWith(PROMPT);
          const isOk = line.includes("[OK]");
          const isError = line.includes("command not found") || line.startsWith("bash:");
          const isHint = line.startsWith("hint:");

          return (
            <div
              key={i}
              style={{
                color: isCmd
                  ? "#98c379"
                  : isOk
                  ? "#56b875"
                  : isError
                  ? "#e06c75"
                  : isHint
                  ? "#7f897f"
                  : line === ""
                  ? undefined
                  : "#b7c0b8",
                fontSize: "clamp(0.75rem, 1.8vw, 0.9rem)",
                lineHeight: "1.7",
                whiteSpace: "pre",
              }}
            >
              {line || "\u00a0"}
            </div>
          );
        })}

        {/* Input line */}
        {phase === "awaiting" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              marginTop: "0.1rem",
            }}
          >
            <span style={{ color: "#98c379", fontSize: "clamp(0.75rem, 1.8vw, 0.9rem)" }}>
              {PROMPT}
            </span>
            <span
              style={{
                color: "#e5e9e5",
                fontSize: "clamp(0.75rem, 1.8vw, 0.9rem)",
                whiteSpace: "pre",
              }}
            >
              {input}
            </span>
            <span
              style={{
                display: "inline-block",
                width: "0.55em",
                height: "1.1em",
                background: cursorOn ? "#98c379" : "transparent",
                verticalAlign: "middle",
              }}
            />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              style={{
                position: "absolute",
                opacity: 0,
                pointerEvents: "none",
                width: 0,
                height: 0,
              }}
              aria-label="Terminal input"
            />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Hint bar */}
      {phase === "awaiting" && (
        <div
          style={{
            borderTop: "1px solid #182019",
            padding: "0.5rem 1.5rem",
            color: "#667066",
            fontSize: "0.65rem",
            letterSpacing: "0.08em",
            flexShrink: 0,
          }}
        >
          TYPE 1-3 OR CLICK A COMMAND TO LAUNCH &nbsp;·&nbsp; ENTER TO CONFIRM
        </div>
      )}
    </div>
  );
}
