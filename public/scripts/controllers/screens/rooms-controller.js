'use strict';

(function () {
	angular
		.module("chat.controllers")
		.controller(
			'RoomsScreenController', function ($scope, $uibModal, RoomsService) {

				$scope.rooms = RoomsService.rooms;
				RoomsService.load();

				$scope.enterRoom = function (room) {
					console.info("Entering Room ", room.name);
					var modal = $uibModal.open({
						templateUrl: 'nickname-popup-template',
						backdrop: 'static',
						controller: function ($scope) {

							$scope.nickname = "";
							$scope.working = false;

							$scope.submitNickname = function () {
								$scope.working = true;
								modal.close();
								RoomsService.enterRoom(room, $scope.nickname);
							}

							$scope.close = function () {
								modal.close();
							}
						}
					});
				}
			});
})();
