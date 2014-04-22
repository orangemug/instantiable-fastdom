/**
 * nodejs safe raf.
 */
var _global = typeof(window) === 'undefined' ? global : window;

// RequestAnimationFrame Polyfill
module.exports = _global.requestAnimationFrame
  || _global.webkitRequestAnimationFrame
  || _global.mozRequestAnimationFrame
  || function(cb) { _global.setTimeout(cb, 1000 / 60); };
