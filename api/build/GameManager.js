"use strict";
var GameRoom = require('./GameRoom');
var uuid = require('./helpers').uuid;
var GameManager = function GameManager(socket) {
  this.socket = socket;
  this.connectedClients = {};
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
  },
  removeClient: function(clientId) {
    delete this.connectedClients[clientId];
  },
  attachListeners: function(client) {
    client.on('new-game', this.startNewGame.bind(this, client));
  },
  startNewGame: function(client, data) {
    var gameId = uuid();
    var game = new GameRoom(this, gameId);
    this.games[gameId] = game;
    var hostClient = this.connectedClients[client.id];
    hostClient.game = game;
    hostClient.player = data;
    game.initialize(hostClient);
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
