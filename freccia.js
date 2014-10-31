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
      self.activeTouches = [];

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
        var touchData = manager.findActiveTouch(touches[i].identifier);

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
        this.activeTouches.push(data);
        return data;
      },

      _findActiveTouchPos: function(id) {
        for (var i=0; i < this.activeTouches.length; i++) {
          if (this.activeTouches[i].identifier === id) {
            return i
          } 
        }
      },

      findActiveTouch: function(id) {
        return this.activeTouches[this._findActiveTouchPos(id)];
      },

      removeActiveTouch: function(id) {
        return this.activeTouches.splice(this._findActiveTouchPos(id), 1);
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
