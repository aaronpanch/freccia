(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.Freccia = factory();
  }
}(this, function() {
    'use strict';
    
    function Freccia(element) {
      var self = Object.create(Freccia.prototype);
      
      if (typeof element === 'string') {
        element = document.querySelectorAll(element)[0];
      }

      self.element = element;
      self.beginCallbacks = [];
      self.endCallbacks = [];
      self.moveCallbacks = [];

      return self;
    }

    Freccia.prototype = {
      trace: function() {
        this.element.addEventListener('touchstart', this.traceStart.bind(this), false);
      },
      traceStart: function(event) {
        event.preventDefault();

        var touches = event.changedTouches;
        for(var i=0; i < touches.length; i++) {
          var data = [touches[i].pageX, touches[i].pageY],
              self = this;
          this.beginCallbacks.forEach(function(callback) {
            callback.call(self, data);
          });
        }
      },
      on: function(event, callback) {
        switch(event) {
          case 'start':
            this.beginCallbacks.push(callback);
            break;
          case 'end':
            this.endCallbacks.push(callback);
            break;
          case 'move':
            this.moveCallbacks.push(callback);
        }
      }
    }

    return Freccia;
  }
));
