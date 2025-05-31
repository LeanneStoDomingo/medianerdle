"use client";

import { api } from "../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";

export default function BattlePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const join = useMutation(api.games.join);
  const board = useQuery(api.games.getBoard);

  useEffect(() => {
    void join().then((gameId) => {
      setIsLoggedIn(!!gameId);
    });
  }, [join, setIsLoggedIn]);

  return (
    <main>
      <div>Battle</div>
      <div>{!isLoggedIn && <div>You need to log in</div>}</div>
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
