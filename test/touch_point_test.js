var should = require('chai').should(),
    Vector = require('../freccia/vector.js'),
    TouchPoint = require('../freccia/touch_point.js');

describe('TouchPoint', function() {
  describe('constructor', function() {
    it('should setup location as vector', function() {
      var touchData = { pageX: 347, pageY: 128 };

      var result = new TouchPoint(touchData);
      result.location.should.be.an.instanceOf(Vector);
      result.location.x.should.equal(touchData.pageX);
      result.location.y.should.equal(touchData.pageY);
    });

    it('should initialize with blank deltas', function() {
      var touchData = { pageX: 347, pageY: 128 };

      var result = new TouchPoint(touchData);
      should.not.exist(result.delta);
      should.not.exist(result.dt);
    });
  });
});
