var assert = require("assert");
var sinon  = require("sinon");

var fastdom = require("fastdom");
var raf     = require("./raf");
var Fastdom = require("../");


describe("instantiable-fastdom", function() {

  beforeEach(function() {
    this.origFastdom = new fastdom.constructor;
    this.fastdom = new Fastdom(this.origFastdom);
  });

  it("after #read completes jobs should be removed from queue", function(done) {
    var spy = sinon.spy();
    var fd = this.fastdom;

    fd.read(spy);
    assert.equal(fd._jobs.read.length, 1);

    raf(function() {
      assert(spy.called);
      assert.equal(fd._jobs.read.length, 0);
      done();
    });
  });

  it("after #write completes jobs should be removed from queue", function(done) {
    var spy = sinon.spy();
    var fd = this.fastdom;

    fd.write(spy);
    assert.equal(fd._jobs.write.length, 1);

    raf(function() {
      assert(spy.called);
      assert.equal(fd._jobs.write.length, 0);
      done();
    });
  });

  it("after #defer completes jobs should be removed from queue", function(done) {
    var spy = sinon.spy();
    var fd = this.fastdom;

    fd.defer(spy);
    assert.equal(fd._jobs.defer.length, 1);

    raf(function() {
      assert(spy.called);
      assert.equal(fd._jobs.defer.length, 0);
      done();
    });
  });

  it("clear should only remove items scheduled via the fastdom instance", function(done) {
    var origSpy = sinon.spy();
    var spy = sinon.spy();
    var fd = this.fastdom;
    var oFd = this.origFastdom;

    oFd.read(origSpy);
    oFd.write(origSpy);
    oFd.defer(origSpy);

    fd.read(spy);
    fd.write(spy);
    fd.defer(spy);

    fd.clear();

    raf(function() {
      raf(function() {
        assert.equal(origSpy.callCount, 3);
        assert(!spy.called);
        done();
      });
    });
  });

});
