var should = require('chai').should(),
    Vector = require('../freccia/vector.js'),
    TouchPoint = require('../freccia/touch_point.js');

describe('TouchPoint', function() {
  describe('.constructor()', function() {
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

  describe('#setPrevPoint(TouchPoint)', function() {
    it('should set deltas properly', function() {
      var touchData1 = { pageX: 347, pageY: 128 },
          touchData2 = { pageX: 400, pageY: 100 };

      var point1 = new TouchPoint(touchData1),
          point2 = new TouchPoint(touchData2);

      point2.setPrevPoint(point1);
      point2.delta.should.be.an.instanceOf(Vector);
      point2.delta.x.should.equal(53);
      point2.delta.y.should.equal(-28);
      point2.dt.should.exist;
      should.not.exist(point1.delta);
      should.not.exist(point1.dt);
    });
  });
});
