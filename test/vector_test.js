var should = require('chai').should(),
    Vector = require('../freccia/vector.js').Freccia.Vector;

describe('Vector', function() {
  describe('magnitude()', function() {
    it('should properly use distance formula', function() {
      var v1 = new Vector(3, 4);
      v1.magnitude().should.equal(5);
      var v2 = new Vector(1, 0);
      v2.magnitude().should.equal(1);
    });
  });

  describe('toUnit()', function() {
    it('should return a new Vector', function() {
      var vec = new Vector(10, 5);
      vec.toUnit().should.be.an.instanceOf(Vector);
    });

    it('should have magnitude 1', function() {
      var vec = new Vector(11, -7);
      vec.toUnit().magnitude().should.equal(1);
    });

    it('should return a vector in the same direction', function() {
      var vec = new Vector(3, 10);
      var unit = vec.toUnit();
      Math.atan(unit.y / unit.x).should.equal(Math.atan(vec.y / vec.x));
    });
  });

  describe('add(Vector)', function() {
    it('should add properly with another Vector', function() {
      var v1 = new Vector(7, 2.9),
          v2 = new Vector(8, 3.1);
      
      var result = v1.add(v2);
      result.should.be.an.instanceOf(Vector);
      result.x.should.equal(15);
      result.y.should.equal(6);
    });
  });

  describe('sub(Vector)', function() {
    it('should subtract properly with another Vector', function() {
      var v1 = new Vector(10, 5),
          v2 = new Vector(4, 9);

      var result = v1.sub(v2);
      result.should.be.an.instanceOf(Vector);
      result.x.should.equal(6);
      result.y.should.equal(-4);
    });
  });

  describe('scale(Number)', function() {
    it('should return an instance of Vector', function() {
      var v1 = new Vector(7, 2);

      v1.scale(2).should.be.an.instanceOf(Vector);
    });

    it('should properly multiply by a scalar', function() {
      var v1 = new Vector(7, 2);

      var result = v1.scale(3);
      result.x.should.equal(21);
      result.y.should.equal(6);
    });
  });

});

