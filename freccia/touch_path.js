(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['freccia/touch_point'], factory);
  } else {
    root.Freccia = (root.Freccia || {});
    root.Freccia.TouchPath = factory(Freccia.TouchPoint);
  }
}(this, function(TouchPoint) {
    'use strict';

    function TouchPath(id, touches) {
      var self = Object.create(TouchPath.prototype);

      self.id = id;
      self.moment = new Date();
      self.points = (touches || []);

      return self;
    }

    TouchPath.prototype = {
      start: function() {
        return this.points[0];
      },

      end: function() {
        return this.points[this.points.length - 1];
      },

      addPoint: function(touchPoint) {
        return this.points.push(touchPoint);
      }
    };

    return TouchPath;
  }
));
