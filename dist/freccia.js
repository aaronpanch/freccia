(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
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


(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['freccia/vector'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('./vector.js'));
  } else {
    root.Freccia = (root.Freccia || {});
    root.Freccia.TouchPoint = factory(Freccia.Vector);
  }
}(this, function(Vector) {
    'use strict';

    function TouchPoint(touch) {
      this.moment = new Date();
      this.location = new Vector(touch.pageX, touch.pageY);
      this.delta = null;
      this.dt = null;
    }

    TouchPoint.prototype = {
      setPrevPoint: function(prevPoint) {
        this.delta = this.location.sub(prevPoint.location);
        this.dt = this.moment - prevPoint.moment;
        return this;
      }
    };

    return TouchPoint;
  }
));

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['freccia/vector'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('./vector.js'));
  } else {
    root.Freccia = (root.Freccia || {});
    root.Freccia.TouchPath = factory();
  }
}(this, function() {
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
