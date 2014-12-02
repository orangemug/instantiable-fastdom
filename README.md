# instantiable-fastdom [![Build Status](https://travis-ci.org/orangemug/instantiable-fastdom.svg?branch=master)](https://travis-ci.org/orangemug/instantiable-fastdom)
Allow fastdom to be instantiable so you can clear groups of jobs.

Code adapted from [fruitmachine-fastdom](https://github.com/ftlabs/fruitmachine-fastdom).

## Installation

    npm install instantiable-fastdom


## Example

    var Fastdom = require("instantiable-fastdom");
    var fd1 = new Fastdom();
    var fd2 = new Fastdom();

    fd1.write(fn);  // Never gets called
    fd2.write(fn);  // Gets called
    fd1.clear();
