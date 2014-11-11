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
        template:"{{formatted}}",
        controller: function ($scope, $attrs, $timeout) {
            $scope.format = $attrs.outputFormat;

            var queueTick = function () {
                $scope.timer = $timeout(function () {
                    if ($scope.countdown > 0) {
                        $scope.countdown -= 1;

                        if ($scope.countdown > 0) {
                            queueTick();
                        } else {
                            $scope.countdown = 0;
                            $scope.active = false;
                            if (!_.isUndefined($scope.onZeroCallback)) {
                                $scope.onZeroCallback();
                            }
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
            $scope.$watch('countdown', function () {
                updateFormatted();
            });

            var updateFormatted = function () {
                $scope.formatted = moment($scope.countdown * $scope.interval).format($scope.format);
            };
            updateFormatted();


            $scope.$on('$destroy', function () {
                $timeout.cancel($scope.timer);
            });

        }
    };
}

angular.module('angularCountdownTimer', []).directive('timer', countdownTimerDirective);