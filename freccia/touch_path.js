(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['freccia/vector'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('./vector.js'));
  } else {
    root.Freccia = (root.Freccia || {});
    root.Freccia.TouchPath = factory(Freccia.Vector);
  }
}(this, function(Vector) {
    'use strict';

    function TouchPath(id, touches) {
      this.id = id;
      this.moment = new Date();
      this.points = (touches || []);
    }

    TouchPath.prototype = {
      start: function() {
        return this.points[0];
      },

      end: function() {
        return this.points[this.points.length - 1];
      },

      net: function() {
        return this.end().location.sub(this.start().location);
      },

      time: function() {
        var start = this.start(),
            end   = this.end();

        return (end.moment - start.moment) / 1000;
      },

      netDistance: function() {
        return this.net().magnitude();
      },

      netSpeed: function() {
        return this.netDistance() / this.time();
      },

      velocity: function() {
        var speed = this.netSpeed();
        
        return this.net().toUnit().scale(speed);
      },

      addPoint: function(touchPoint) {
        touchPoint.setPrevPoint(this.end());
        return this.points.push(touchPoint);
      }
    };

    return TouchPath;
  }
));
