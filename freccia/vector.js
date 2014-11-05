(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.Freccia = (root.Freccia || {});
    root.Freccia.Vector = factory();
  }
}(this, function() {
    'use strict';

    function Vector(x,y) {
      this.x = x;
      this.y = y;
    }

    Vector.prototype = {
      magnitude: function() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
      },

      toUnit: function() {
        var mag = this.magnitude();
        return new Vector(this.x / mag, this.y / mag);
      },

      add: function(v2) {
        return new Vector(this.x + v2.x, this.y + v2.y);
      },

      sub: function(v2) {
        return new Vector(this.x - v2.x, this.y - v2.y);
      },

      scale: function(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
      }
    };

    return Vector;
  }
));

