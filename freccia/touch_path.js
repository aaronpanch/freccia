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

      net: function() {
        var start = this.start(),
            end   = this.end();

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
