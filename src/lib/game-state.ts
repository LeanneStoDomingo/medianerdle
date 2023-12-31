import { z } from "zod";

export const gameStateSchema = z.object({
  players: z.array(z.string()),
  initialLabel: z.string(),
  media: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      links: z.array(z.object({ id: z.number(), name: z.string() })),
    }),
  ),
  currentCredits: z.array(z.number()),
});

export type GameState = z.infer<typeof gameStateSchema>;

export function createNewGameState(
  player: string,
  initialLabel: string,
  currentCredits: number[],
) {
  return {
    players: [player],
    initialLabel,
    media: [],
    currentCredits,
  } as GameState;
}

export function getIsPlayerTurn(
  gameState: GameState | undefined,
  player: string | undefined,
) {
  if (!gameState || !player) return false;

  return gameState.players[gameState.media.length % 2] === player;
}

export const endGameSchema = z.object({
  reason: z.string(),
  player: z.string(),
});

export type EndGame = z.infer<typeof endGameSchema>;

export const EndGameReason = {
  PlayerLeft: "PLAYER_LEFT",
  Timeout: "TIMEOUT",
} as const;
