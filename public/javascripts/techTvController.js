"use strict";
angular.module('app', ['module']);

angular.module('module', [])
.controller('appCtrl', function($scope, $http, $interval) {

    $interval(function() {
        $scope.date = new Date();    
    }, 1000);
    

    $interval(function() {
        var date = new Date();
        var startTime = 18 // 6pm
        if (date.getDay() < 4) {
            var endTime = 2.3 //3:30am;
        } else {
            var endTime = 3.3 //2:30am;
        }

        $scope.predictions_time = [];

        // saferide is running
        if (date.getHours() >= startTime  || (date.getHours() + date.getMinutes()/100.0) < endTime) {
            $scope.busName = 'Boston East';

            $http.get( "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=mit&r=saferidebostone&s=comm478")
            .then(function( res ) {
                var data = $.parseXML(res.data);
                var predictions_raw = data.getElementsByTagName("prediction");
                // $scope.predictions_time = [];
                for(var i=0; i<predictions_raw.length; i++) {
                    var pred = predictions_raw[i];
                    $scope.predictions_time.push({
                        "minutes": pred.getAttribute("minutes"),
                        "seconds": pred.getAttribute("seconds")
                    });
                }
                console.log($scope.predictions_time);

            });

            // $http.get("http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=mit&r=saferidebostone&t=0")
            // .then(function( res ) {
            //     var data = $.parseXML(res.data);
            //     var vehicle = data.getElementsByTagName("vehicle")[0];
            //     var latitude = vehicle.getAttribute("lat");
            //     var longitude = vehicle.getAttribute("lon");
            //     console.log(latitude);
            //     console.log(longitude);
            // });

        } else {
            // daytime is running
            $scope.busName = 'Daytime';
            $http.get( "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=mit&r=boston&s=comm478")
            .then(function( res ) {
                var data = $.parseXML(res.data);
                var predictions_raw = data.getElementsByTagName("prediction");
                $scope.predictions_time = [];
                for(var i=0; i<predictions_raw.length; i++) {
                    var pred = predictions_raw[i];
                    $scope.predictions_time.push({
                        "minutes": pred.getAttribute("minutes"),
                        "seconds": pred.getAttribute("seconds")
                    });
                }
                console.log($scope.predictions_time);
            });

            // $http.get("http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=mit&r=boston&t=0")
            // .then(function( res ) {
            //     var data = $.parseXML(res.data);
            //     var vehicle = data.getElementsByTagName("vehicle")[0];
            //     var latitude = vehicle.getAttribute("lat");
            //     var longitude = vehicle.getAttribute("lon");
            //     console.log(latitude);
            //     console.log(longitude);
            // });
        }

    }, 10000);
});

