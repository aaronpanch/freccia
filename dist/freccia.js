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


(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.Freccia = (root.Freccia || {});
    root.Freccia.TouchPoint = factory();
  }
}(this, function() {
    'use strict';

    function TouchPoint(touch) {
      this.moment = new Date();
      this.x = touch.pageX;
      this.y = touch.pageY;
      this.dx = null;
      this.dy = null;
      this.dt = null;
    }

    TouchPoint.prototype = {
      setPrevPoint: function(prevPoint) {
        this.dx = this.x - prevPoint.x;
        this.dy = this.y - prevPoint.y;
        this.dt = this.moment - prevPoint.moment;
        return this;
      }
    };

    return TouchPoint;
  }
));

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
      if (typeof element === 'string') {
        element = document.querySelectorAll(element)[0];
      }

      this.element = element;
      this.activeTouchPaths = [];

      this.beginCallbacks = [];
      this.endCallbacks = [];
      this.moveCallbacks = [];
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

        this.element.addEventListener('touchmove', function(event) {
          traceMove(event, self);
        }, false);
      },

      _findActiveTouchPathPos: function(id) {
        for (var i=0; i < this.activeTouchPaths.length; i++) {
          if (this.activeTouchPaths[i].id === id) {
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
