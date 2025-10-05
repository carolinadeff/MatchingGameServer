import { GameState } from "./enums.js";
export function getScrambledOrder(length = 20) {
    return Array(length)
        .fill(0)
        .map((_, i) => i)
        .sort(() => Math.random() - 0.5);
}
export function getGameId(ws) {
    const clientId = ws.clientId;
    return clientId?.split("-").map(Number)[0] ?? ``;
}
export function getPlayerId(ws) {
    const clientId = ws.clientId;
    return clientId?.split("-").map(Number)[1] ?? ``;
}
export function formatNewGameMulti(newGameId, playerName) {
    const newPlayer = { id: 1, name: playerName, matchedCards: [] };
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
export function formatJoinGameMulti(game, playerName) {
    const newPlayer = { id: 2, name: playerName, matchedCards: [] };
    game.state = GameState.PLAYING;
    game.players.push(newPlayer);
    game.currentPlayerId = 1;
    return game;
}
export function formatNewGameSingle(newGameId, playerName) {
    const newPlayer = { id: 1, name: playerName, matchedCards: [] };
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
export function getWaitingGames(games) {
    return games
        .filter((gameEl) => gameEl.state === GameState.WAITING)
        .map((gameEl) => ({
        playerName: gameEl.players[0].name,
        gameId: gameEl.id,
    }));
}
//# sourceMappingURL=helpers.js.map