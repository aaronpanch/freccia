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
      this.moment = new Date();
      this.x = touch.pageX;
      this.y = touch.pageY;
      this.dx = null;
      this.dy = null;
      this.dt = null;
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
