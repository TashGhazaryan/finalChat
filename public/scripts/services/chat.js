'use strict';

(function () {
	angular
		.module('chat.services')
		.factory('ChatService', function ($socket, $rootScope) {

			return {

				messages: [],

				initialize: function () {
					$socket.on("room.message", this._handleRoomMessage.bind(this));
					return this;
				},

				sendMessage: function (message) {
					$socket.send("room.message.send", {message: message})
				},

				_handleRoomMessage: function (data) {
					$rootScope.$apply(function () {
						console.info("Room Message", data);
						this.messages.push(data);
					}.bind(this));
				}
			};
		});
})();
