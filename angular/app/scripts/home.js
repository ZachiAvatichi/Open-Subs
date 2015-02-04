'use strict';

angular
  .module('app')
  .controller('HomeController', function($scope, USER, OPEN_KNESSET, $location, $window, $q) {
    $scope.loading = true;
    $scope.chairs = [];
    $q.all({
      candidates: OPEN_KNESSET.get_candidates(),
      committees: OPEN_KNESSET.get_committees()
    }).then(function(res) {
      for (var i=0; i < res.committees.length; i++) {
        var c = res.committees[i];
        var electedId = $window.sessionStorage.getItem('chair'+c.id);
        $scope.chairs.push ({
          name: c.name, absolute_url: c.absolute_url,
          chosen: res.candidates[electedId]
        });
      }
      $scope.loading = false;
    });
  })
;
