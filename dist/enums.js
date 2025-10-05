export var MessageId;
(function (MessageId) {
    MessageId[MessageId["WELCOME"] = 0] = "WELCOME";
    MessageId[MessageId["NEW_GAME"] = 1] = "NEW_GAME";
    MessageId[MessageId["PLAYED"] = 2] = "PLAYED";
    MessageId[MessageId["CHANGE_PLAYER"] = 3] = "CHANGE_PLAYER";
    MessageId[MessageId["FINISH_GAME"] = 4] = "FINISH_GAME";
    MessageId[MessageId["RESTART"] = 5] = "RESTART";
})(MessageId || (MessageId = {}));
export var StartOption;
(function (StartOption) {
    StartOption[StartOption["SINGLE"] = 0] = "SINGLE";
    StartOption[StartOption["MULTI"] = 1] = "MULTI";
    StartOption[StartOption["JOIN_GAME"] = 2] = "JOIN_GAME";
})(StartOption || (StartOption = {}));
export var GameState;
(function (GameState) {
    GameState["UNINITIALIZED"] = "uninitialized";
    GameState["WAITING"] = "waiting";
    GameState["PLAYING"] = "playing";
    GameState["FINISHED"] = "finished";
    GameState["ABORTED"] = "aborted";
})(GameState || (GameState = {}));
//# sourceMappingURL=enums.js.map