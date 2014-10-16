"use strict";
var PlayersManager = function PlayersManager(game) {
  this.game = game;
  this.players = {};
};
($traceurRuntime.createClass)(PlayersManager, {
  initialize: function() {},
  addPlayer: function(clientId, player) {
    this.players[clientId] = player;
    console.log("Player added");
  },
  removePlayer: function(clientId) {
    if (typeof this.players[clientId] !== "undefined") {
      return delete this.players[clientId];
    } else {
      return false;
    }
  },
  getPlayer: function(clientId) {
    return this.players[clientId];
  },
  getAllPlayers: function() {
    return this.players;
  }
}, {});
module.exports = PlayersManager;
