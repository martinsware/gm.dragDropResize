(function () {
	'use strict';

	// Based on myDraggable - https://docs.angularjs.org/guide/directive

	angular
		.module('gm.dragDrop', [])
		.directive('gmDraggable', ['$window', '$document', gmDraggable])
		.directive('gmOnHover', gmOnHover)
		.directive('gmOnDrop', gmOnDrop)
		.directive('resizable', resizable);

	var dragOb = null;

	function apply(scope, attr, event) {
		scope.$apply(function () {
			scope.$eval(attr)(dragOb, event);
		});
	}

	function gmDraggable($window, $document) {
		return function (scope, element, attrs) {

			var startX = 0,
				startY = 0,
				clone = null,
				absParent = angular.element('<div></div>');

			var cancelWatch = null;

			// Handle will become a regular element, so if anything is returned,
			// we need to wrap that in angular.element(...) to bind events to it
			var handle = element[0].querySelectorAll('gm-drag-handle, [gm-drag-handle], .gm-drag-handle');
			(handle.length ? angular.element(handle) : element).on('mousedown', function (event) {
				// Prevent default dragging of selected content
				event.preventDefault();

				cancelWatch = scope.$watch(function () {
					return element.prop('innerHTML');
				}, function (val) {
					if (clone)
						clone.prop('innerHTML', val);
				});

				dragOb = scope.$eval(attrs.gmDraggable);
				dragOb.$$gmDropZone = attrs.gmDropZone;

				clone = element.clone();
				element.addClass('gm-drag-element').after(clone);



				var elBoundingRect = element[0].getBoundingClientRect();

				clone.css({
					top: '0px',
					left: '0px',
					position: 'relative',
					pointerEvents: 'none',
					opacity: 0
				}).addClass('gm-dragging');

				absParent.css({
					position: 'absolute',
					zIndex: '2000',
					top: elBoundingRect.top + $window.scrollY + 'px',
					left: elBoundingRect.left + 'px',
					width: elBoundingRect.width + 'px'
				});
				$document.find('body').append(absParent);
				absParent.append(clone);

				startX = event.pageX;
				startY = event.pageY;
				$document.on('mousemove', mousemove);
				$document.on('mouseup', mouseup);
			});

			function mousemove(event) {
				clone.css({
					top: event.pageY - startY + 'px',
					left: event.pageX - startX + 'px'
				});
			}

			function mouseup() {
				if (dragOb) {
					if (attrs.gmOnInvalidDrop) {
						apply(scope, attrs.gmOnInvalidDrop);
					}
					dragOb = null;
				}

				cancelWatch();

				element.removeClass('gm-drag-element');

				clone.remove();
				absParent.remove();
				$document.off('mousemove', mousemove);
				$document.off('mouseup', mouseup);
			}
		};
	}

	function gmOnHover() {
		return function (scope, element, attr) {

			element.on('mouseover', function (e) {
				if (!dragOb)
					return;

				if (dragOb.$$gmDropZone == attr.gmDropZone) {
					apply(scope, attr.gmOnHover, e);
				}
			});
		}
	}

	function gmOnDrop() {

		return function (scope, element, attr) {

			element.on('mouseover', function () {
				if (!dragOb)
					return;

				if (dragOb.$$gmDropZone == attr.gmDropZone) {
					element.addClass('gm-dropping');
				}
			});

			element.on('mouseout', function () {
				if (!dragOb)
					return;

				element.removeClass('gm-dropping');
			});

			element.on('mouseup', function () {
				if (!dragOb)
					return;

				if (dragOb.$$gmDropZone == attr.gmDropZone) {
					apply(scope, attr.gmOnDrop);
					dragOb = null;
				}

				element.removeClass('gm-dropping');
			});

		}
	}

	function resizable() {
		return {
			restrict: 'A',

			link: function postLink(scope, elem, attrs) {
				elem.resizable({ handles: "se", containment: "parent", disabled: scope.formAction !== "edit" });
				elem.on('resizestop', function (evt, ui) {
				});
				elem.on('resizestart', function (evt, ui) {
				});
				elem.on('resizecreate', function (evt, ui) {
				});
				elem.on('resize', function (evt, ui) {

				});
				elem.on('mouseover', function () {
					elem.addClass('enter');
				});
				elem.on('mouseleave', function () {
					elem.removeClass('enter');
				});

				elem.on('dblclick', function (el) {
					console.log(el);
				});

				elem.on('dragstop', function (event, ui) {
					var posOff = scope.offset(),
						newPosX = ui.offset.left - posOff.left,
						newPosY = ui.offset.top - posOff.top
				});
				elem.draggable({ containment: "#mainDrag", disabled: scope.formAction !== "edit" });
			}
		};
	}
})();
