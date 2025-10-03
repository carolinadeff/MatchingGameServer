import type { GameState, MessageId, StartOption } from "./enums.ts";

export type MyWebSocket = WebSocket & { clientId?: string };

export type WaitingGame = { playerName: string; gameId: string };
export type Timeout = ReturnType<typeof setTimeout>;
export type TCard = { src: string; pairId: number; key: number };
export type Count = number;
export type Player = { id: PlayerId; name: string; matchedCards: TCard[] };

export interface GameDetails {
  id: Count;
  players: Array<Player>;
  state: GameState;
  numberOfCards: number;
  scrambleOrder: number[];
  singlePlayer: boolean;
  currentPlayerId: PlayerId;
}

export type PlayerId = 1 | 2;
export type PlayerName = string;
export type GameId = string;

export type ClientServerMsg =
  | { messageId: MessageId.NEW_GAME; args: [StartOption, PlayerName, GameId?] }
  | { messageId: MessageId.PLAYED; args: [TCard] }
  | { messageId: MessageId.CHANGE_PLAYER }
  | { messageId: MessageId.FINISH_GAME };

export type ServerClientMsg =
  | { messageId: MessageId.WELCOME; currentGames: WaitingGame[] }
  | {
      messageId: MessageId.NEW_GAME;
      myPlayerId: PlayerId;
      gameDetails: GameDetails;
    }
  | { messageId: MessageId.PLAYED; currentPlayerId: PlayerId; card: TCard }
  | {
      messageId: MessageId.CHANGE_PLAYER;
      playerName: PlayerName;
      gameId: GameId;
    };
