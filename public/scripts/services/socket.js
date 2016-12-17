'use strict';

(function () {
	angular
		.module('chat.services')
		.factory('$socket', function () {

			return {

				s: null,

				initialize: function () {
					return this;
				},

				connect: function (nickname) {
					this._socket = io();
				},

				send: function (event, data) {
					this._socket.emit(event, data);
				},

				on: function (event, callback) {
					this._socket.on(event, callback);
				}
			};
		});

})();
