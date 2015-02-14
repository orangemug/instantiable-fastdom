/* jshint node:true */

/**
 * Ensures only jobs created via the instance cleaned up when #clear is called
 */

'use strict';

/**
 * Module Dependencies
 */
var fastdom = require('fastdom');

// uid for jobs
var uid = 0;


/**
 * constructor
 */
function Fastdom(_fastdom) {
  // Mainly used for testing.
  this._fastdom = _fastdom || fastdom;
  this._jobs = {
    read: {},
    write: {},
    defer: {}
  };
}


/**
 * Wraps the fastdom.read API.
 *
 * Keeps track of the job and then removes the refernece when the job is run.
 *
 * @param  {Function} fn
 * @param  {Object}   ctx
 * @api public
 */
Fastdom.prototype.read = function(fn, ctx) {
  var self = this;
  var id = uid++;

  var job = this._fastdom.read(function() {
    delete self._jobs.read[id];
    fn.call(ctx);
  });

  this._jobs.read[id] = job;
};

/**
 * Wraps the fastdom.write API.
 *
 * Keeps track of the job and then removes the reference when the job is run.
 *
 * @param  {Function} fn
 * @param  {Object}   ctx
 * @api public
 */
Fastdom.prototype.write = function(fn, ctx) {
  var self = this;
  var id = uid++;

  var job = this._fastdom.write(function() {
    delete self._jobs.write[id];
    fn.call(ctx);
  });

  this._jobs.write[id] = job;
};


/**
 * Wraps the fastdom.defer API.
 *
 * Keeps track of the job and then removes the reference when the job is run.
 *
 * @param  {Function} fn
 * @param  {Object}   ctx
 * @api public
 */
Fastdom.prototype.defer = function(frames, fn, ctx) {
  var self = this;
  var id = uid++;

  // Frames argument is optional
  if (typeof frames === 'function') {
    ctx = fn;
    fn = frames;
    frames = 1;
  }

  var job = this._fastdom.defer(frames, function() {
    delete self._jobs.defer[id];
    fn.call(ctx);
  });

  this._jobs.defer[id] = job;
};


/**
 * Wraps the fastdom.clear API.
 */
Fastdom.prototype.clear = function() {
  var self = this;
  var clearItems = function(queue) {
    for (var key in queue) {
      if (queue.hasOwnProperty(key)) {
        self._fastdom.clear(queue[key]);
      }
    }
  };

  clearItems(this._jobs.read);
  clearItems(this._jobs.write);
  clearItems(this._jobs.defer);

  // Clear the queues
  this._jobs.read  = {};
  this._jobs.write = {};
  this._jobs.defer = {};
};


module.exports = Fastdom;
