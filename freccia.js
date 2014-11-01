(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['gesture'], factory);
  } else {
    root.Freccia = factory(Gesture);
  }
}(this, function(Gesture) {
    'use strict';
    
    function Freccia(element) {
      var self = Object.create(Freccia.prototype);
      
      if (typeof element === 'string') {
        element = document.querySelectorAll(element)[0];
      }

      self.element = element;
      self.activeGestures = [];

      self.beginCallbacks = [];
      self.endCallbacks = [];
      self.moveCallbacks = [];

      return self;
    }

    function traceStart(event, manager) {
      event.preventDefault();

      var touches = event.changedTouches;
      for(var i=0; i < touches.length; i++) {
        var data = manager.logTouch(touches[i]);

        manager.beginCallbacks.forEach(function(callback) {
          callback.call(manager, data);
        });
      }
    }

    function traceEnd(event, manager) {
      event.preventDefault();

      var touches = event.changedTouches;
      for(var i=0; i < touches.length; i++) {
        var touchData = manager.findActiveGesture(touches[i].identifier);

        if (touchData) {
          touchData.endMoment = new Date();
          touchData.endX = touches[i].pageX;
          touchData.endY = touches[i].pageY;
          manager.removeActiveTouch(touchData.identifier);
          manager.endCallbacks.forEach(function(callback) {
            callback.call(manager, touchData);
          });
        }
      }
    }

    Freccia.prototype = {
      trace: function() {
	var self = this;
				
        this.element.addEventListener('touchstart', function(event) {
          traceStart(event, self);
        }, false);

        this.element.addEventListener('touchend', function(event) {
          traceEnd(event, self);
        }, false);

        this.element.addEventListener('touchcancel', function(event) {
          traceEnd(event, self);
        }, false);
      },

      logTouch: function(touch) {
        var data = { identifier: touch.identifier, startX: touch.pageX, startY: touch.pageY, startMoment: new Date() };
        this.activeGestures.push(data);
        return data;
      },

      _findActiveGesturePos: function(id) {
        for (var i=0; i < this.activeGestures.length; i++) {
          if (this.activeGestures[i].identifier === id) {
            return i
          } 
        }
      },

      findActiveGesture: function(id) {
        return this.activeGestures[this._findActiveGesturePos(id)];
      },

      removeActiveTouch: function(id) {
        return this.activeGestures.splice(this._findActiveGesturePos(id), 1);
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
    };

    return Freccia;
  }
));
