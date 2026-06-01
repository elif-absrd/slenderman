import GamePortal from "../components/game/GamePortal";

/**
 * Route: /game
 * Renders the full-screen game portal (standby → terminal selector → game).
 * Add this to your router:
 *
 *   import { BrowserRouter, Routes, Route } from "react-router-dom";
 *   import GamePage from "./pages/GamePage";
 *   import App from "./App";   // your main portfolio page
 *
 *   <BrowserRouter>
 *     <Routes>
 *       <Route path="/" element={<App />} />
 *       <Route path="/game" element={<GamePage />} />
 *     </Routes>
 *   </BrowserRouter>
 */
export default function GamePage() {
  return <GamePortal />;
}