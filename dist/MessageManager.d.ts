import type { WebSocketServer } from "ws";
import type { GameDetails, MyWebSocket, TCard } from "./types.js";
declare class MessageManager {
    wss: WebSocketServer;
    gameId: number;
    games: Map<number, GameDetails>;
    constructor(wss: WebSocketServer);
    getNewGameId(): number;
    handleMessage(ws: any, data: any): void;
    handleNewGame(parsedData: [string, string, string], ws: any): void;
    private processStartMultiGame;
    private processJoinGame;
    private processStartSingle;
    handlePlayed(parsedData: [TCard], ws: any): void;
    handleChangePlayer(ws: any): void;
    handleWelcome(ws: any): void;
    handleClose(ws: any): void;
    iterateOverClients(callback: (client: MyWebSocket) => void): void;
    handleFinishGame(parsedData: [string], ws: any): void;
}
export default MessageManager;
//# sourceMappingURL=MessageManager.d.ts.map