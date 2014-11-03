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
      self.dx = null;
      self.dy = null;
      self.dt = null;

      return self;
    }

    TouchPoint.prototype = {
      setPrevPoint: function(prevPoint) {
        this.dx = this.x - prevPoint.x;
        this.dy = this.y - prevPoint.y;
        this.dt = this.moment - prevPoint.moment;
        return this;
      }
    };

    return TouchPoint;
  }
));
