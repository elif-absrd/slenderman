import { useEffect, useRef, useState } from "react";

interface StandbyScreenProps {
  onEnter: () => void;
}

export default function StandbyScreen({ onEnter }: StandbyScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [visible, setVisible] = useState(false);

  // CRT static noise on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() > 0.5 ? Math.floor(Math.random() * 80) : 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }

      // scanlines
      for (let y = 0; y < h; y += 2) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          data[idx] = Math.floor(data[idx] * 0.6);
          data[idx + 1] = Math.floor(data[idx + 1] * 0.6);
          data[idx + 2] = Math.floor(data[idx + 2] * 0.6);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    const t = setTimeout(() => setVisible(true), 100);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      clearTimeout(t);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        cursor: "pointer",
        overflow: "hidden",
        fontFamily: "'Courier New', Courier, monospace",
      }}
      onClick={onEnter}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onEnter()}
      tabIndex={0}
      role="button"
      aria-label="Press to enter game terminal"
    >
      {/* Static noise canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, opacity: 0.35 }}
      />

      {/* TV color bars — thin strip at top like a real standby screen */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "6px",
          display: "flex",
        }}
      >
        {["#fff", "#ff0", "#0ff", "#0f0", "#f0f", "#f00", "#00f"].map(
          (c, i) => (
            <div key={i} style={{ flex: 1, background: c }} />
          )
        )}
      </div>

      {/* Center content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s",
        }}
      >
        {/* PLEASE STAND BY box */}
        <div
          style={{
            border: "3px solid #fff",
            padding: "0.6rem 2.4rem",
            background: "#000",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "3px",
              border: "1px solid #555",
              pointerEvents: "none",
            }}
          />
          <span
            style={{
              fontSize: "clamp(1rem, 3vw, 1.6rem)",
              fontWeight: "bold",
              letterSpacing: "0.25em",
              color: "#fff",
              textTransform: "uppercase",
            }}
          >
            PLEASE STAND BY
          </span>
        </div>

        {/* Game boy style channel info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.4rem",
            color: "#888",
            fontSize: "clamp(0.65rem, 1.5vw, 0.8rem)",
            letterSpacing: "0.15em",
          }}
        >
          <span>VINAY_OS v1.0.0</span>
          <span>GAME MODULE // CH 02</span>
        </div>

        {/* Blinking prompt */}
        <div
          style={{
            marginTop: "1rem",
            color: "#aaa",
            fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
            letterSpacing: "0.1em",
            animation: "blink 1.2s step-end infinite",
          }}
        >
          [ PRESS ANY KEY TO CONTINUE ]
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: "1.2rem",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          color: "#444",
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
        }}
      >
        <span>SIG: ANALOG</span>
        <span>RES: 1920x1080</span>
        <span>BAUD: 115200</span>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
