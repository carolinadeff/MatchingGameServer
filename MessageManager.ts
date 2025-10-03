import type { WebSocketServer } from "ws";
import type {
  Count,
  GameDetails,
  MyWebSocket,
  PlayerId,
  TCard,
} from "./types.js";
import { GameState, MessageId, StartOption } from "./enums.js";
import {
  formatJoinGameMulti,
  formatNewGameMulti,
  formatNewGameSingle,
  getGameId,
  getPlayerId,
  getWaitingGames,
} from "./helpers.js";

class MessageManager {
  gameId = 0;
  games = new Map<Count, GameDetails>();

  constructor(public wss: WebSocketServer) {}

  getNewGameId() {
    if (this.gameId >= 1000) {
      this.gameId = 0;
    }
    return this.gameId++;
  }

  handleMessage(ws: any, data: any) {
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
      default:
        break;
    }
  }

  handleNewGame(parsedData: [string, string, string], ws: any) {
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

  private processStartMultiGame(ws: MyWebSocket, playerName: string) {
    const newGameId = this.getNewGameId();

    const newGame = formatNewGameMulti(newGameId, playerName);

    ws.clientId = `${newGameId}-${newGame.players[0]!.id}`;
    this.games.set(newGame.id, newGame);

    ws.send(
      JSON.stringify({
        messageId: MessageId.NEW_GAME,
        gameDetails: newGame,
        myPlayerId: newGame.players[0]!.id,
      })
    );
  }

  private processJoinGame(ws: MyWebSocket, playerName: string, gameId: number) {
    const game = this.games.get(gameId);
    if (!game || game.players.length !== 1) {
      //enviar mensagem de erro
      return;
    }

    const updatedGame = formatJoinGameMulti(game, playerName);
    const newPlayer = updatedGame.players[1]!;
    this.games.set(gameId, updatedGame);
    ws.clientId = `${game.id}-${newPlayer.id}`;

    this.iterateOverClients((client) => {
      const playerId = getPlayerId(client);

      if (getGameId(client) === game.id) {
        client.send(
          JSON.stringify({
            messageId: MessageId.NEW_GAME,
            gameDetails: game,
            myPlayerId: playerId,
          })
        );
      }
    });
  }

  private processStartSingle(ws: MyWebSocket, playerName: string) {
    const newGameId = this.getNewGameId();
    const newGame = formatNewGameSingle(newGameId, playerName);
    const newPlayer = newGame.players[0]!;
    ws.clientId = `${newGameId}-${newPlayer.id}`;

    this.games.set(newGame.id, newGame);

    ws.send(
      JSON.stringify({
        messageId: MessageId.NEW_GAME,
        gameDetails: newGame,
        myPlayerId: newPlayer.id,
      })
    );
  }

  handlePlayed(parsedData: [TCard], ws: any) {
    const gameId = getGameId(ws as unknown as WebSocket);
    const [card] = parsedData;

    this.iterateOverClients((client) => {
      const playerId = getPlayerId(client);

      if (getGameId(client) === gameId) {
        client.send(
          JSON.stringify({
            messageId: MessageId.PLAYED,
            card,
          })
        );
      }
    });
  }

  handleChangePlayer(ws: any) {
    const gameId = getGameId(ws as unknown as WebSocket);
    const playerId = getPlayerId(ws as unknown as WebSocket);
    const game = this.games.get(gameId as number);
    if (game?.singlePlayer) {
      // Handle game not found
      return;
    }

    const newPlayerId = playerId === 1 ? 2 : 1;

    this.iterateOverClients((client) => {
      if (getGameId(client) === gameId) {
        client.send(
          JSON.stringify({
            messageId: MessageId.CHANGE_PLAYER,
            playerId: newPlayerId,
          })
        );
      }
    });
  }

  handleAfterConnection(ws: any) {
    const waiting = getWaitingGames([...this.games.values()]);

    ws.send(
      JSON.stringify({ messageId: MessageId.WELCOME, currentGames: waiting })
    );
  }

  handleClose(ws: any) {
    const gameId = getGameId(ws as unknown as WebSocket);
    const game = this.games.get(gameId as number);
    if (!game) {
      //console.log("Client disconnected");
      return;
    }

    this.iterateOverClients((client) => {
      if (getGameId(client) === gameId) {
        client.send(
          JSON.stringify({
            messageId: MessageId.FINISH_GAME,
            gameState: GameState.ABORTED,
          })
        );
      }
    });

    this.games.delete(gameId as number);
    //console.log("Client disconnected");
  }

  iterateOverClients(callback: (client: MyWebSocket) => void) {
    (this.wss.clients as unknown as Set<MyWebSocket>).forEach(callback);
  }
}

export default MessageManager;
