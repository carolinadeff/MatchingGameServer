import type { GameDetails } from "./types.js";
export declare function getScrambledOrder(length?: number): number[];
export declare function getGameId(ws: WebSocket): number | "";
export declare function getPlayerId(ws: WebSocket): number | "";
export declare function formatNewGameMulti(newGameId: number, playerName: string): GameDetails;
export declare function formatJoinGameMulti(game: GameDetails, playerName: string): GameDetails;
export declare function formatNewGameSingle(newGameId: number, playerName: string): GameDetails;
export declare function getWaitingGames(games: GameDetails[]): {
    playerName: string;
    gameId: number;
}[];
//# sourceMappingURL=helpers.d.ts.map