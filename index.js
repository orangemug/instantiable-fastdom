/* jshint node:true */

/**
 * Ensures only jobs created via the instance cleaned up when #clear is called
 */

'use strict';

/**
 * Module Dependencies
 */
var fastdom = require('fastdom');


/**
 * Removes an item from a list.
 *
 * @param  {*} item
 * @param  {Array} list
 */
function remove(item, list) {
  var i = list.indexOf(item);
  if (~i) {
    list.splice(i,1);
  }
}


/**
 * constructor
 */
function Fastdom(_fastdom) {
	// Mainly used for testing.
	this._fastdom = _fastdom || fastdom;
  this._jobs = {
    read: [],
    write: [],
    defer: []
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
  var job = this._fastdom.read(function() {
    remove(job, self._jobs.read);
    fn.call(ctx);
  });

  this._jobs.read.push(job);
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
  var job = this._fastdom.write(function() {
    remove(job, self._jobs.write);
    fn.call(ctx);
  });

  this._jobs.write.push(job);
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

  // Frames argument is optional
  if (typeof frames === 'function') {
    ctx = fn;
    fn = frames;
    frames = 1;
  }

  var job = this._fastdom.defer(frames, function() {
    remove(job, self._jobs.defer);
    fn.call(ctx);
  });

  this._jobs.defer.push(job);
};


/**
 * Wraps the fastdom.clear API.
 */
Fastdom.prototype.clear = function() {
  var clear = this._fastdom.clear.bind(this._fastdom);
  this._jobs.read.forEach(clear);
  this._jobs.write.forEach(clear);
  this._jobs.defer.forEach(clear);
};


module.exports = Fastdom;
