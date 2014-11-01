(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.Freccia = (root.Freccia || {});
    root.Freccia.TouchPoint = factory();
  }
}(this, function() {
    'use strict';

    function TouchPoint(touch) {
      var self = Object.create(TouchPoint.prototype);

      self.moment = new Date();
      self.x = touch.pageX;
      self.y = touch.pageY;

      return self;
    }

    TouchPoint.prototype = {

    };

    return TouchPoint;
  }
));
