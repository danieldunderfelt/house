"use strict";
var GameRoom = require('./GameRoom');
var uuid = require('./helpers').uuid;
var GameManager = function GameManager(socket) {
  this.socket = socket;
  this.connectedClients = {};
  this.players = {};
  this.games = {};
};
($traceurRuntime.createClass)(GameManager, {
  initialize: function() {},
  attachClient: function(client) {
    this.connectedClients[client.id] = {
      client: client,
      game: null,
      player: null
    };
    this.attachListeners(client);
    this.socket.emit('games-list', this.getGamesList());
  },
  getGamesList: function() {
    var games = {};
    for (var game in this.games) {
      if (!this.games[game].isStarted) {
        games["id"] = {
          id: this.games[game].id,
          host: this.games[game].host
        };
      }
    }
    console.log(games);
    return games;
  },
  removeClient: function(client) {
    console.log(client.id + " disconnected :(");
    if (Object.keys(this.players).length !== 0 && typeof this.connectedClients[client.id] !== "undefined" && this.connectedClients[client.id].player !== null) {
      delete this.players[this.connectedClients[client.id].player.id];
    }
    if (typeof this.connectedClients[client.id] !== "undefined")
      delete this.connectedClients[client.id];
  },
  attachListeners: function(client) {
    client.on('new-game', this.startNewGame.bind(this, client));
    client.on('join-game', this.joinGame.bind(this, client));
    client.on('disconnect', this.removeClient.bind(this, client));
  },
  startNewGame: function(client, data) {
    var gameId = uuid();
    var game = new GameRoom(this, gameId);
    this.games[gameId] = game;
    var hostClient = this.connectedClients[client.id];
    hostClient.game = gameId;
    hostClient.player = data.id;
    var player = {
      client: client.id,
      game: gameId,
      player: data
    };
    this.players[data.id] = player;
    game.initialize(player);
  },
  joinGame: function(client, data) {
    var player = {
      client: client.id,
      game: data.game,
      player: data.player
    };
    this.players[data.player.id] = player;
    this.games[data.game].addPlayer(player);
  },
  ping: function(clientId, eventName) {
    var callback = arguments[2] !== (void 0) ? arguments[2] : function() {};
    this.socket.to(clientId).emit(eventName);
    callback();
  },
  tell: function(clientId, eventName, data) {
    var callback = arguments[3] !== (void 0) ? arguments[3] : function() {};
    this.socket.to(clientId).emit(eventName, data);
    callback();
  }
}, {});
module.exports = GameManager;
