(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['freccia/touch_path', 'freccia/touch_point'], factory);
  } else {
    root.Freccia = (root.Freccia || {});
    root.Freccia.Manager = factory(Freccia.TouchPath, Freccia.TouchPoint);
  }
}(this, function(TouchPath, TouchPoint) {
    'use strict';
    
    function Manager(element) {
      var self = Object.create(Manager.prototype);
      
      if (typeof element === 'string') {
        element = document.querySelectorAll(element)[0];
      }

      self.element = element;
      self.activeTouchPaths = [];

      self.beginCallbacks = [];
      self.endCallbacks = [];
      self.moveCallbacks = [];

      return self;
    }

    function traceStart(event, manager) {
      event.preventDefault();

      var touches = event.changedTouches;
      for(var i=0; i < touches.length; i++) {
        var point = new TouchPoint(touches[i]),
            path = new TouchPath(touches[i].identifier, [point]);

        //manager.activeTouchPaths.push(path);
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
        var touchData = manager.findActiveTouchPath(touches[i].identifier);

        if (touchData) {
          touchData.endMoment = new Date();
          touchData.endX = touches[i].pageX;
          touchData.endY = touches[i].pageY;
          manager.removeActiveTouchPath(touchData.identifier);
          manager.endCallbacks.forEach(function(callback) {
            callback.call(manager, touchData);
          });
        }
      }
    }

    Manager.prototype = {
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
        this.activeTouchPaths.push(data);
        return data;
      },

      _findActiveTouchPathPos: function(id) {
        for (var i=0; i < this.activeTouchPaths.length; i++) {
          if (this.activeTouchPaths[i].identifier === id) {
            return i
          } 
        }
      },

      findActiveTouchPath: function(id) {
        return this.activeTouchPaths[this._findActiveTouchPathPos(id)];
      },

      removeActiveTouchPath: function(id) {
        return this.activeTouchPaths.splice(this._findActiveTouchPathPos(id), 1);
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

    return Manager;
  }
));