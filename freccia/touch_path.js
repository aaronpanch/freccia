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
        var start = this.start().location,
            end   = this.end().location;

        return { x: end.x - start.x, y: end.y - start.y };
      },

      time: function() {
        var start = this.start(),
            end   = this.end();

        return (end.moment - start.moment) / 100;
      },

      netDistance: function() {
        var net = this.net();
        return Math.sqrt(Math.pow(net.x, 2) + Math.pow(net.y, 2));
      },

      netSpeed: function() {
        return this.netDistance() / this.time();
      },

      unit: function() {
        var net = this.net(),
            distance = this.netDistance();

        return { x: net.x / distance, y: net.y / distance };
      },

      velocity: function() {
        var unit = this.unit(),
            speed = this.netSpeed();
        
        return { x: unit.x * speed, y: unit.y * speed };
      },

      addPoint: function(touchPoint) {
        touchPoint.setPrevPoint(this.end());
        return this.points.push(touchPoint);
      }
    };

    return TouchPath;
  }
));
