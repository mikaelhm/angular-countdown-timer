function countdownTimerDirective() {
    return {
        restrict: 'EAC',
        replace: false,
        scope: {
            countdown: "=",
            interval: "=",
            active: "=",
            onZeroCallback: "="
        },
        controller: function ($scope, $attrs, $timeout) {
            $scope.format = $attrs.outputFormat;

            var queueTick = function () {
                $scope.timer = $timeout(function () {
                    if ($scope.countdown > 0) {
                        $scope.countdown -= 1;
                        updateFormatted();

                        if ($scope.countdown > 0) {
                            queueTick();
                        } else {
                            $scope.countdown = 0;
                            $scope.active = false;
                            $scope.onZeroCallback();
                        }
                    }
                }, $scope.interval);
            };

            if ($scope.active) {
                queueTick();
            }

            $scope.$watch('active', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    if (newValue === true) {
                        queueTick();
                    } else {
                        $timeout.cancel($scope.timer);
                    }
                }
            });

            var updateFormatted = function () {
                $scope.formatted = moment($scope.countdown * $scope.interval).format($scope.format);
            };
            updateFormatted();

        }
    };
}

angular.module('angularCountdownTimer', []).directive('timer', countdownTimerDirective);