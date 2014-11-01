(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.Gesture = factory();
  }
}(this, function() {
    'use strict';

    function Gesture(id, touches) {
      var self = Object.create(Gesture.prototype);

      self.id = id;
      self.moment = new Date();
      self.touches = (touches || []);

      return self;
    }

    Gesture.prototype = {
      start: function() {
        return this.touches[0];
      },

      end: function() {
        return this.touches[this.touches.length - 1];
      }
    };

    return Gesture;
  }
));
