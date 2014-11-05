var should = require('chai').should(),
    Vector = require('../freccia/vector.js').Freccia.Vector;

describe('Vector', function() {
  describe('#magnitude()', function() {
    it('should properly use distance formula', function() {
      var v1 = new Vector(3,4);
      v1.magnitude().should.equal(5);
    });
  });

  describe('#toUnit()', function() {
    it('should return a new Vector', function() {
      var vec = new Vector(10, 5);
      vec.toUnit().should.be.an.instanceOf(Vector);
    });

    it('should have magnitude 1', function() {
      var vec = new Vector(11, -7);
      vec.toUnit().magnitude().should.equal(1);
    });
  });

});

