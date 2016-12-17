'use strict';

(function () {
	angular
		.module('chat.services')
		.factory('RoomsService', function ($socket, $rootScope) {

			return {

				rooms: [],

				initialize: function () {
					$socket.on('rooms.load', this._handleRoomsList.bind(this)); //function in bottom
					$socket.on('rooms.enter.success', this._handleRoomsEnterSuccess.bind(this));
					return this;
				},

				load: function () {
					$socket.send('rooms.load');
				},

				enterRoom: function (room, nickName) {
					$socket.send('rooms.enter', {room: room.id, nickname: nickName});
				},

				_handleRoomsList: function (data) { // ???????????????
					$rootScope.$apply(function () {
						console.log("Rooms Loaded", data);
						this.rooms.splice.apply(this.rooms, [0, data.length].concat(data));
					}.bind(this));
				},

				_handleRoomsEnterSuccess: function (data) {
					$rootScope.$emit('rooms.enter.success');
				}
			};
		});

})();
