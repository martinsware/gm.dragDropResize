
(function () {
  'use strict';

  // Based on myDraggable - https://docs.angularjs.org/guide/directive

  angular
    .module('app', ['gm.dragDrop'])
    .controller('myCtrl', function ($rootScope) {
      $rootScope.formAction = "edit"
      $rootScope.categories = [
        {
          items: [
            { element: 'video', width: 100, height: 100},
            { element: 'banana', width: 100, height: 100},
            { element: 'apple', width: 100, height: 100},
            { element: 'things', width: 100, height: 100},
            { element: 'potato', width: 100, height: 100},
            { element: 'hope', width: 100, height: 100},
            { element: 'bottle', width: 100, height: 100},
            { element: 'water', width: 100, height: 100},
            { element: 'glasses', width: 100, height: 100},
            { element: 'nothings', width: 100, height: 100}
          ]
        }, {
          items: [
            { element: 'nono', width: 500, height: 300, pos_x: 0, pos_y: 0 }
          ]
        }
      ];
      $rootScope.offset = function () {
        var rec = document.getElementById('mainDrag').getBoundingClientRect(), bodyElt = document.body;
        return {
          top: rec.top + bodyElt.scrollTop,
          left: rec.left + bodyElt.scrollLeft
        }
      };

    })
    .run(run);

  function run($rootScope, $filter) {
    $rootScope.onHover = function (item) {
      return function (dragItem, mouseEvent) {
        if (item != dragItem)
          dragItem.order = item.order + ((mouseEvent.offsetY || -1) > 0 ? 0.5 : -0.5)
      }
    }

    $rootScope.reset = function reset(droppedItem) {
      droppedItem.order = droppedItem.number;
    }

    $rootScope.getDropHandler = function (category) {
      return function (dragOb) {
        if (category.items.indexOf(dragOb.item) < 0) {
          dragOb.category.items.splice(dragOb.category.items.indexOf(dragOb.item), 1);
          category.items.push(dragOb.item);
          return true;  // Returning truthy value since we're modifying the view model
        }
      }
    }
  }

})();