'use strict';

(function () {
	angular
		.module("chat.controllers")
		.controller(
			'ChatScreenController', function ($scope, ChatService) {

				$scope.messages = ChatService.messages;
				$scope.message = '';

				$scope.sendMessage = function(){
					ChatService.sendMessage($scope.message);
					$scope.message = '';
				};
			});
})();
