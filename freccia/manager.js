(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['freccia/touch_path', 'freccia/touch_point'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('./touch_path.js'), require('./touch_point.js'));
  } else {
    root.Freccia = (root.Freccia || {});
    root.Freccia.Manager = factory(Freccia.TouchPath, Freccia.TouchPoint);
  }
}(this, function(TouchPath, TouchPoint) {
    'use strict';
    
    function Manager(element) {
      if (typeof element === 'string') {
        element = document.querySelectorAll(element)[0];
      }

      this.element = element;
      this.activeTouchPaths = [];

      this.beginCallbacks = [];
      this.endCallbacks = [];
      this.moveCallbacks = [];
      
      this.listensForEvents = [];
    }

    function traceStart(event, manager) {
      event.preventDefault();

      var touches = event.changedTouches;
      for(var i=0; i < touches.length; i++) {
        var point = new TouchPoint(touches[i]),
            path = new TouchPath(touches[i].identifier, [point]);

        manager.activeTouchPaths.push(path);

        manager.beginCallbacks.forEach(function(callback) {
          callback.call(manager, path, point);
        });
      }
    }

    function traceMove(event, manager) {
      event.preventDefault();

      var touches = event.changedTouches;
      for(var i=0; i < touches.length; i++) {
        var point = new TouchPoint(touches[i]),
            path = manager.findActiveTouchPath(touches[i].identifier);

        if (path) {
          path.addPoint(point);
          manager.moveCallbacks.forEach(function(callback) {
            callback.call(manager, path, point);
          });
        }
      }
    }

    function traceEnd(event, manager) {
      event.preventDefault();

      var touches = event.changedTouches;
      for(var i=0; i < touches.length; i++) {
        var point = new TouchPoint(touches[i]),
            path = manager.findActiveTouchPath(touches[i].identifier);

        if (path) {
          path.addPoint(point);
          manager.removeActiveTouchPath(path.id);
          manager.endCallbacks.forEach(function(callback) {
            callback.call(manager, path, point);
          });
        }
      }
    }

    Manager.prototype = {
      listenAll: function() {
        this.listenFor('touchstart', traceStart);
        this.listenFor('touchend', traceEnd);
        this.listenFor('touchcancel', traceEnd);
        this.listenFor('touchmove', touchMove);
      },
      
      listenFor: function(eventName, handler) {
        var self = this;
        self.listensForEvents.push(eventName);
        
        this.element.addEventListener(eventName, function(event) {
          handler(event, self);
        }, false);
      },
      
      listensFor: function(eventName) {
        return this.listensForEvents.indexOf(eventName) > -1;
      },

      _findActiveTouchPathPos: function(id) {
        for (var i=0; i < this.activeTouchPaths.length; i++) {
          if (this.activeTouchPaths[i].id === id) {
            return i;
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
            if (! this.listensFor('touchstart')) {
              this.listenFor('touchstart', traceStart);
            }
            this.beginCallbacks.push(callback);
            break;
          case 'end':
            if (! this.listensFor('touchend')) {
              this.listenFor('touchend', traceEnd);
              this.listenFor('touchcancel', traceEnd);
            }
            this.endCallbacks.push(callback);
            break;
          case 'move':
            if (! this.listensFor('touchmove')) {
              this.listenFor('touchmove', traceMove);
            }
            this.moveCallbacks.push(callback);
        }
				
		return this;
      }
    };

    return Manager;
  }
));
