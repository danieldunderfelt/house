global.$traceurRuntime = require('traceur-runtime');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var GameManager = require('./GameManager');

var masterChannel = io.of('/house');

var games = new GameManager(masterChannel);
games.initialize()

masterChannel.on('connection', function(socket) {
	console.log("A user connected :D yayyy");
	games.attachClient(socket);
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});