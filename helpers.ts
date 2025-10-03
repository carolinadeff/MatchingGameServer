import { GameState } from "./enums.js";
import type { GameDetails, MyWebSocket, Player, PlayerId } from "./types.js";

export function getScrambledOrder(length = 20): number[] {
  return Array(length)
    .fill(0)
    .map((_, i) => i)
    .sort(() => Math.random() - 0.5);
}

export function getGameId(ws: WebSocket) {
  const clientId = (ws as unknown as MyWebSocket).clientId;

  return clientId?.split("-").map(Number)[0] ?? ``;
}

export function getPlayerId(ws: WebSocket) {
  const clientId = (ws as unknown as MyWebSocket).clientId;

  return clientId?.split("-").map(Number)[1] ?? ``;
}

export function formatNewGameMulti(
  newGameId: number,
  playerName: string
): GameDetails {
  const newPlayer = { id: 1 as PlayerId, name: playerName, matchedCards: [] };

  return {
    id: newGameId,
    players: [newPlayer],
    state: GameState.WAITING,
    numberOfCards: 20,
    scrambleOrder: getScrambledOrder(),
    singlePlayer: false,
    currentPlayerId: newPlayer.id,
  };
}

export function formatJoinGameMulti(game: GameDetails, playerName: string) {
  const newPlayer = { id: 2 as PlayerId, name: playerName, matchedCards: [] };
  game.state = GameState.PLAYING;
  game.players.push(newPlayer);
  game.currentPlayerId = 1;

  return game;
}

export function formatNewGameSingle(
  newGameId: number,
  playerName: string
): GameDetails {
  const newPlayer = { id: 1 as PlayerId, name: playerName, matchedCards: [] };
  return {
    id: newGameId,
    players: [newPlayer],
    state: GameState.PLAYING,
    numberOfCards: 20,
    scrambleOrder: getScrambledOrder(),
    singlePlayer: true,
    currentPlayerId: newPlayer.id,
  };
}

export function getWaitingGames(games: GameDetails[]) {
  return games
    .filter((gameEl) => gameEl.state === GameState.WAITING)
    .map((gameEl) => ({
      playerName: gameEl.players[0]!.name,
      gameId: gameEl.id,
    }));
}
