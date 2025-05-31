"use client";

import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";

export default function BattlePage() {
  const board = useQuery(api.games.getBoard);

  return (
    <main>
      <div>Battle</div>
      <div>
        {board?.map((turn) => {
          return (
            <div key={turn.key}>
              {turn.turnNumber} - {turn.movie}
            </div>
          );
        })}
      </div>
    </main>
  );
}
