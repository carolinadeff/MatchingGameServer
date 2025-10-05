import { GameState, MessageId, StartOption } from "./enums.js";
import { formatJoinGameMulti, formatNewGameMulti, formatNewGameSingle, getGameId, getPlayerId, getWaitingGames, } from "./helpers.js";
class MessageManager {
    wss;
    gameId = 0;
    games = new Map();
    constructor(wss) {
        this.wss = wss;
    }
    getNewGameId() {
        if (this.gameId >= 1000) {
            this.gameId = 0;
        }
        return this.gameId++;
    }
    handleMessage(ws, data) {
        const parsedData = JSON.parse(data.toString());
        switch (parseInt(parsedData.messageId)) {
            case MessageId.NEW_GAME: {
                this.handleNewGame(parsedData.args, ws);
                break;
            }
            case MessageId.PLAYED: {
                this.handlePlayed(parsedData.args, ws);
                break;
            }
            case MessageId.CHANGE_PLAYER: {
                this.handleChangePlayer(ws);
                break;
            }
            case MessageId.FINISH_GAME: {
                this.handleFinishGame(parsedData.args, ws);
                break;
            }
            case MessageId.RESTART: {
                this.handleWelcome(ws);
                break;
            }
            default:
                break;
        }
    }
    handleNewGame(parsedData, ws) {
        const [startOption, playerName, runningGameId] = parsedData;
        const gameIdParsed = parseInt(runningGameId);
        switch (parseInt(startOption)) {
            case StartOption.JOIN_GAME: {
                this.processJoinGame(ws, playerName, gameIdParsed);
                break;
            }
            case StartOption.MULTI: {
                this.processStartMultiGame(ws, playerName);
                break;
            }
            case StartOption.SINGLE: {
                this.processStartSingle(ws, playerName);
                break;
            }
            default:
                break;
        }
    }
    processStartMultiGame(ws, playerName) {
        const newGameId = this.getNewGameId();
        const newGame = formatNewGameMulti(newGameId, playerName);
        ws.clientId = `${newGameId}-${newGame.players[0].id}`;
        this.games.set(newGame.id, newGame);
        ws.send(JSON.stringify({
            messageId: MessageId.NEW_GAME,
            gameDetails: newGame,
            myPlayerId: newGame.players[0].id,
        }));
    }
    processJoinGame(ws, playerName, gameId) {
        const game = this.games.get(gameId);
        if (!game || game.players.length !== 1) {
            //enviar mensagem de erro
            return;
        }
        const updatedGame = formatJoinGameMulti(game, playerName);
        const newPlayer = updatedGame.players[1];
        this.games.set(gameId, updatedGame);
        ws.clientId = `${game.id}-${newPlayer.id}`;
        this.iterateOverClients((client) => {
            const playerId = getPlayerId(client);
            if (getGameId(client) === game.id) {
                client.send(JSON.stringify({
                    messageId: MessageId.NEW_GAME,
                    gameDetails: game,
                    myPlayerId: playerId,
                }));
            }
        });
    }
    processStartSingle(ws, playerName) {
        const newGameId = this.getNewGameId();
        const newGame = formatNewGameSingle(newGameId, playerName);
        const newPlayer = newGame.players[0];
        ws.clientId = `${newGameId}-${newPlayer.id}`;
        this.games.set(newGame.id, newGame);
        ws.send(JSON.stringify({
            messageId: MessageId.NEW_GAME,
            gameDetails: newGame,
            myPlayerId: newPlayer.id,
        }));
    }
    handlePlayed(parsedData, ws) {
        const gameId = getGameId(ws);
        const [card] = parsedData;
        this.iterateOverClients((client) => {
            const playerId = getPlayerId(client);
            if (getGameId(client) === gameId) {
                client.send(JSON.stringify({
                    messageId: MessageId.PLAYED,
                    card,
                }));
            }
        });
    }
    handleChangePlayer(ws) {
        const gameId = getGameId(ws);
        const playerId = getPlayerId(ws);
        const game = this.games.get(gameId);
        if (game?.singlePlayer) {
            // Handle game not found
            return;
        }
        const newPlayerId = playerId === 1 ? 2 : 1;
        this.iterateOverClients((client) => {
            if (getGameId(client) === gameId) {
                client.send(JSON.stringify({
                    messageId: MessageId.CHANGE_PLAYER,
                    playerId: newPlayerId,
                }));
            }
        });
    }
    handleWelcome(ws) {
        const waiting = getWaitingGames([...this.games.values()]);
        ws.send(JSON.stringify({ messageId: MessageId.WELCOME, currentGames: waiting }));
    }
    handleClose(ws) {
        const gameId = getGameId(ws);
        const game = this.games.get(gameId);
        if (!game) {
            //console.log("Client disconnected");
            return;
        }
        this.iterateOverClients((client) => {
            if (getGameId(client) === gameId) {
                client.send(JSON.stringify({
                    messageId: MessageId.FINISH_GAME,
                    gameState: GameState.ABORTED,
                }));
            }
        });
        this.games.delete(gameId);
        //console.log("Client disconnected");
    }
    iterateOverClients(callback) {
        this.wss.clients.forEach(callback);
    }
    handleFinishGame(parsedData, ws) {
        const gameId = getGameId(ws);
        const game = this.games.get(gameId);
        if (!game) {
            // Handle game not found
            return;
        }
        const [winnerPlayerId] = parsedData;
        this.iterateOverClients((client) => {
            if (getGameId(client) === gameId) {
                client.send(JSON.stringify({
                    messageId: MessageId.FINISH_GAME,
                    gameState: GameState.FINISHED,
                    winnerPlayerId,
                }));
            }
        });
        this.games.delete(gameId);
    }
}
export default MessageManager;
//# sourceMappingURL=MessageManager.js.map