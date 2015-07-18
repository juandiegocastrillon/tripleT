angular.module('tripleT.election', ['ngResource', 'ngRoute'])

.factory('Elections', function($http) {

   return {
      getElections: function(callback) {
         $http.get('/voting')
            .success(function(elections) {
               callback(elections);
            })
      }
   }

})