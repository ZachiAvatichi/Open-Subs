'use strict';

angular
  .module('app', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angular-jwt',
    'app.settings',
    'angucomplete',
    'ezfb',
    'timer',
    'infinite-scroll'
  ])

  .config(function ($routeProvider, $resourceProvider, ezfbProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
    ezfbProvider.setInitParams({
      appId      : window.OPEN_SUBS_FB_APP_ID,
      xfbml      : true,
      version    : 'v2.2'
    });
    $routeProvider
      .when('/splash', {
        templateUrl: 'views/splash.html',
        controller: function($scope, USER, $location) {
          $scope.go = function() {
            USER.login(function(status) {
              if (status) {
                $location.path('/home');
              } else {
                alert('please login');
              }
            });
          }
        }
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeController'
      })
      .when('/committee/:id', {
        templateUrl: 'views/committee.html',
        controller: 'CommitteeController'
      })
      // TODO: refactor to /person/:id
      .when('/candidate/:id', {
        templateUrl: 'views/candidate-feed.html',
        controller: 'CandidateController'
      })
      .otherwise({
        redirectTo: '/splash'
      })
    ;
  })

  .factory('USER', function(ezfb, $q, SETTINGS) {
    return {
      login: function(callback) {
        if (SETTINGS.noFacebook) {
          callback(true);
        } else {
          ezfb.getLoginStatus(function (res) {
            if (res.status == 'connected') {
              callback(true, res);
            } else {
              ezfb.login(function(res) {
                callback(res.status == 'connected', res);
              }, {scope: 'public_profile,email'});
            }
          });
        }
      },
      fbapi: function(url) {
        var self = this;
        return $q(function(resolve, reject) {
          self.login(function(status, res) {
            if (status) {
              ezfb.api(url, {access_token: res.authResponse.accessToken}, function(response) {
                resolve(response);
              });
            } else {
              reject();
            }
          });
        });
      }
    };
  })

  .controller('AppController', function($scope, ezfb) {

  })
  .directive('ngReallyClick', [function() {
    /**
     * A generic confirmation for risky actions.
     * Usage: Add attributes: ng-really-message="Are you sure"? ng-really-click="takeAction()" function
     */
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    }
  }])


;
