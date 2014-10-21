(function() {
  var app = angular.module('foodApp', []);

  var app = angular.module('foodApp', [
    'ngRoute'
  ]);

  app.factory('dataFactory', function($http, $q) {
    return {
      get: function(url) {
        var deferred = $q.defer();

         $http.get(url).then(function(resp) {
          deferred.resolve(resp.data); // success callback returns this
        },function() {
          deferred.reject();
        });
         return deferred.promise;
      }
    };
  });

  app.controller('TypeAheadController', function($scope,
    dataFactory) {

     // DI in action
    $scope.likeFoodItemsArray = [];
    dataFactory.get('fooditems.json').then(function(data) {
      $scope.foodItems = data.foodItems;
      console.log($scope.foodItems);
    }, function() {
      console.log('Cannot reach API');
    });
    $scope.name = ''; // This will hold the selected item
    $scope.onItemSelected = function() {
    // this gets executed when an item is selected
      console.log('selected=' + $scope.name);
    };
    $scope.saveItems = function() {
      $scope.likeFoodItemsArray.push($scope.name);
      $scope.name = '';
      console.log($scope.likeFoodItemsArray);
    };
  });


  app.directive('parentdirective', function() {
    return{
      restrict: 'E',
      controller: function($scope) {
        $scope.allFoodTypes = [];
       this.scopeArray = function(scopeVal) {
        $scope.allFoodTypes.push(scopeVal);
       };
       $scope.submitResponse = function() {
        console.log($scope.allFoodTypes);
       };
      }
  };

  });

  app.directive('typeahead', function($timeout) {
    return {
      restrict: 'AEC',
      require: '^parentdirective',
      scope: {
        foodItems: '=items',
        prompt: '@',
        title: '@',
        model: '=',
        saveItems: '&',
        // onSelect: '&',
        likeItems: '=likes'
      },
      link: function(scope, elem, attrs, parentdirective) {
        parentdirective.scopeArray(scope);
        scope.handleSelection = function(selectedItem) {
          scope.model = selectedItem;
          scope.current = 0;
          scope.selected = true;
          // $timeout(function() {
          //   scope.onSelect();
          // }, 200);
        };
        scope.current = 0;
        scope.selected = true; // hides the list initially
        scope.isCurrent = function(index) {
          return scope.current == index;
        };
        scope.setCurrent = function(index) {
          scope.current = index;
        };
      },
      templateUrl: 'partials/templateurl.html'
    };
  });
})();
