"use client";

import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";

export default function BattlePage() {
  return (
    <main>
      <div>Battle</div>
      <GameBoard />
    </main>
  );
}

function GameBoard() {
  const board = useQuery(api.games.getBoard);

  if (!board) return <div>Loading board...</div>;

  if (board.length === 0) return <div>No turns yet</div>;

  return (
    <div>
      {board.map((turn) => (
        <div key={turn.key}>
          {turn.turnNumber} - {turn.movie}
        </div>
      ))}
    </div>
  );
}
