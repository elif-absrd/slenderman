import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StandbyScreen from "./StandbyScreen";
import GameSelector from "./GameSelector";
import type { GameId } from "./GameSelector";
import Snake from "./games/Snake";
import Tetris from "./games/Tetris";
import FlappyBird from "./games/FlappyBird";

type Screen = "standby" | "selector" | "game";

export default function GamePortal() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("standby");
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  const handleEnterFromStandby = () => setScreen("selector");

  const handleGameSelect = (id: GameId) => {
    setActiveGame(id);
    setScreen("game");
  };

  const handleBackToSelector = () => {
    setActiveGame(null);
    setScreen("selector");
  };

  const handleExitToPortfolio = () => {
    setActiveGame(null);
    navigate("/");
  };

  if (screen === "standby") {
    return <StandbyScreen onEnter={handleEnterFromStandby} />;
  }

  if (screen === "selector") {
    return (
      <GameSelector
        onSelect={handleGameSelect}
        onBack={handleExitToPortfolio}
      />
    );
  }

  // game screen — wrap the active game with a back button
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0a0a",
        fontFamily: "'Courier New', Courier, monospace",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          borderBottom: "1px solid #222",
          padding: "0.4rem 1.2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span
          style={{ color: "#555", fontSize: "0.7rem", letterSpacing: "0.1em" }}
        >
          VINAY_OS — {activeGame?.toUpperCase()}.EXE
        </span>
        <button
          onClick={handleBackToSelector}
          style={{
            background: "none",
            border: "1px solid #333",
            color: "#555",
            padding: "0.2rem 0.8rem",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
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
          ← GAMES
        </button>
      </div>

      {/* Game content */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {activeGame === "snake" && <Snake onExit={handleBackToSelector} />}
        {activeGame === "tetris" && <Tetris onExit={handleBackToSelector} />}
        {activeGame === "flappy" && <FlappyBird onExit={handleBackToSelector} />}
      </div>
    </div>
  );
}
