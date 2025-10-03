export enum MessageId {
  WELCOME = 0,
  NEW_GAME = 1,
  PLAYED = 2,
  CHANGE_PLAYER = 3,
  FINISH_GAME = 4,
}

export enum StartOption {
  SINGLE = 0,
  MULTI = 1,
  JOIN_GAME = 2,
}

export enum GameState {
  UNINITIALIZED = "uninitialized",
  WAITING = "waiting",
  PLAYING = "playing",
  FINISHED = "finished",
  ABORTED = "aborted",
}
