"use strict";
var GameRoom = function GameRoom(games, gameId) {
  this.games = games;
  this.id = gameId;
  this.isStarted = false;
  this.players = {};
};
($traceurRuntime.createClass)(GameRoom, {
  initialize: function(host) {
    this.addPlayer(host);
  },
  addPlayer: function(player) {
    this.players[player.player.id] = player;
    this.joinPlayer(player.client);
    this.games.tell(this.id, 'player-joined', player.player);
  },
  joinPlayer: function(client) {
    client.join(this.id);
    this.games.tell(client.id, 'game-joined', {
      id: this.id,
      players: this.getPlayers()
    });
  },
  getPlayers: function() {
    var players = {};
    for (var player in this.players) {
      players[player] = this.players[player].player;
    }
    return players;
  }
}, {});
module.exports = GameRoom;
