var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var chat = new ChatManager();

app.use(express.static("public"));

app.get('/', function (req, res) {
	res.sendfile('public/index.html');
});
app.get('/chat', function (req, res) {
	res.sendfile('public/chat.html');
});

io.on('connection', function (socket) {
	chat.addUser(socket);
});

http.listen(3000, function () {
	console.log('listening on *:3000');
});


function ChatManager() {

	this._init = function () {
		this._incr = 0; // id of users
		this._users = {};
		this._rooms = {};
		// addRoom function and Room class
		this.addRoom(new Room("Calculus", 1));
		this.addRoom(new Room("Discrete Math", 2));
		this.addRoom(new Room("Intro to CS", 3));
		this.addRoom(new Room("Freshman English", 4));
		this.addRoom(new Room("Linear Algebra", 5));
		this.addRoom(new Room("Probability", 6));
	};

	this.addUser = function (socket) {
		var user = new User((++this._incr), socket, this); //User class // this -> chat
		this._users[user.id] = user;
		console.log("Connected User " + user.id);
		socket.on('disconnect', function () {
			console.log("User " + user.id + " disconnected");
			if (user.room) {
				user.room.removeUser(user); // function removeUser
			}
			delete this._users[user.id];
		}.bind(this));
	};

	this.addRoom = function (room) {
		this._rooms[room.id] = room;
	};

	this.getRooms = function () {
		return this._rooms;
	};

	this.addRoomUser = function (user, roomId) {
		var success = this._rooms[roomId].addUser(user);
		return success;
	};

	this._init();
}

function User(id, socket, chat) {

	this._init = function () {
		this._socket = socket;
		this._chat = chat;
		this.room = null;
		this.id = id;
		this.name = null;
		this._initializeListeners();
	};

	this._initializeListeners = function () {
		this._socket.on('rooms.load', this._handleLoadRoomsEvent.bind(this)); //handleLoadRoomsEvent function
		this._socket.on('rooms.enter', this._handleRoomEnter.bind(this)); // handleRoomEnter function
		this._socket.on('room.message.send', this._handleRoomMessage.bind(this)); // handleRoomMessage function
	};

	this.sendChatMessage = function (user, message) {
		this._socket.emit("room.message", {
			user: {
				id: user.id, nickname: user.nickname, me: (user.id == this.id)
			}, message: message
		});
	};

	this._handleLoadRoomsEvent = function (msg) {
		console.log("Load Rooms");
		var rooms = this._chat.getRooms();
		var ret = [];
		for (var id in rooms) {
			var room = rooms[id];
			ret.push({id: room.id, name: room.name, membersCount: room.membersCount});
		}
		socket.emit('rooms.load', ret);
	};

	this._handleRoomEnter = function (msg) {
		if(!this.nickname){
			this.nickname = msg.nickname;
		}
		if (this._chat.addRoomUser(this, msg.room)) {
			this._socket.emit("rooms.enter.success");
		} else {
			this._socket.emit("rooms.enter.fail");
		}
	};

	this._handleRoomMessage = function (msg) {
		if (this.room) { // if user is in room
			this.room.sendMessage(this, msg.message); //user
		}
	};

	this._init();
}

function Room(name, id) {

	this._init = function () {
		this.name = name;
		this.id = id;
		this.membersCount = 0;
		this._users = {};
	};

	this.addUser = function (user) {
		if (!this._users.hasOwnProperty(user.id)) {
			this._users[user.id] = user;
			user.room = this;
			this.membersCount++;
			return true;
		}
		return false;
	};

	this.removeUser = function (user) {
		if (this._users.hasOwnProperty(user.id)) {
			delete this._users[user.id];
			user.room = null;
			this.membersCount = Math.max(this.membersCount - 1, 0);
		}
	};

	this.sendMessage = function (user, message) {
		for (var id in this._users) {
			if (message !== '') {
				this._users[id].sendChatMessage(user, message);
			} else {
				console.log('wrong message')
			}
		}
	};

	this._init();

}
