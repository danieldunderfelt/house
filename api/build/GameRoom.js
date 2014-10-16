"use strict";
var GameRoom = function GameRoom(games, gameId) {
  this.games = games;
  this.id = gameId;
  this.isStarted = false;
  this.players = {};
  this.host = {};
};
($traceurRuntime.createClass)(GameRoom, {
  initialize: function(host) {
    this.addPlayer(host);
    this.host = {
      name: host.player.name,
      id: host.player.id
    };
  },
  addPlayer: function(player) {
    this.players[player.player.id] = player;
    this.joinPlayer(this.games.connectedClients[player.client].client);
    this.tell('player-joined', player.player);
  },
  joinPlayer: function(client) {
    client.join(this.id);
    this.games.tell(client.id, 'game-joined', {
      id: this.id,
      players: this.getPlayers()
    });
  },
  getPlayers: function() {
    return this.players;
  },
  tell: function(eventId, data) {
    this.games.tell(this.id, eventId, data);
  }
}, {});
module.exports = GameRoom;
