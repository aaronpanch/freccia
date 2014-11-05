(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['freccia/vector'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('./vector.js'));
  } else {
    root.Freccia = (root.Freccia || {});
    root.Freccia.TouchPoint = factory(Freccia.Vector);
  }
}(this, function(Vector) {
    'use strict';

    function TouchPoint(touch) {
      this.moment = new Date();
      this.location = new Vector(touch.pageX, touch.pageY);
      this.delta = null;
      this.dt = null;
    }

    TouchPoint.prototype = {
      setPrevPoint: function(prevPoint) {
        this.delta = this.location.sub(prevPoint.location);
        this.dt = this.moment - prevPoint.moment;
        return this;
      }
    };

    return TouchPoint;
  }
));
