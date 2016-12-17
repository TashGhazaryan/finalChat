'use strict';

(function () {

	angular.module('chat.controllers', []);
	angular.module('chat.services', []);

	angular
		.module('chat', [
			'chat.controllers',
			'chat.services',

			'ui.bootstrap'
		])
		.run(function ($rootScope, $socket, ChatService, RoomsService) {

			$rootScope.currentView = "rooms";

			$socket
				.initialize()
				.connect();

			$rootScope.$on("rooms.enter.success", function(){
				$rootScope.currentView = "chat";
			});

			RoomsService.initialize();
			ChatService.initialize();

		});
	$(function () {
		angular.resumeBootstrap(["chat"]);
	});
})();