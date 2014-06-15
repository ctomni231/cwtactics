(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());

//===================================================================================================

// javascript-astar
// http://github.com/bgrins/javascript-astar
// Freely distributable under the MIT License.
// Includes Binary Heap (with modifications) from Marijn Haverbeke.
// http://eloquentjavascript.net/appendix2.dom

var GraphNodeType = {
  OPEN: 1,
  WALL: -1
};

// Creates a Graph class used in the astar search algorithm.
function Graph(grid) {
  var nodes = [];

  for (var x = 0; x < grid.length; x++) {
    nodes[x] = [];

    for (var y = 0, row = grid[x]; y < row.length; y++) {
      nodes[x][y] = new GraphNode(x, y, row[y]);
    }
  }

  this.input = grid;
  this.nodes = nodes;
}

Graph.prototype.toString = function() {
  var graphString = "\n";
  var nodes = this.nodes;
  var rowDebug, row, y, l;
  for (var x = 0, len = nodes.length; x < len; x++) {
    rowDebug = "";
    row = nodes[x];
    for (y = 0, l = row.length; y < l; y++) {
      rowDebug += row[y].type + " ";
    }
    graphString = graphString + rowDebug + "\n";
  }
  return graphString;
};

function GraphNode(x,y,type) {
  this.data = { };
  this.x = x;
  this.y = y;
  this.pos = {
    x: x,
    y: y
  };
  this.type = type;
}

GraphNode.prototype.toString = function() {
  return "[" + this.x + " " + this.y + "]";
};

GraphNode.prototype.isWall = function() {
  return this.type == GraphNodeType.WALL;
};

function BinaryHeap(scoreFunction){
  this.content = [];
  this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
  push: function(element) {
    // Add the new element to the end of the array.
    this.content.push(element);

    // Allow it to sink down.
    this.sinkDown(this.content.length - 1);
  },
  pop: function() {
    // Store the first element so we can return it later.
    var result = this.content[0];
    // Get the element at the end of the array.
    var end = this.content.pop();
    // If there are any elements left, put the end element at the
    // start, and let it bubble up.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.bubbleUp(0);
    }
    return result;
  },
  remove: function(node) {
    var i = this.content.indexOf(node);

    // When it is found, the process seen in 'pop' is repeated
    // to fill up the hole.
    var end = this.content.pop();

    if (i !== this.content.length - 1) {
      this.content[i] = end;

      if (this.scoreFunction(end) < this.scoreFunction(node)) {
        this.sinkDown(i);
      }
      else {
        this.bubbleUp(i);
      }
    }
  },
  size: function() {
    return this.content.length;
  },
  rescoreElement: function(node) {
    this.sinkDown(this.content.indexOf(node));
  },
  sinkDown: function(n) {
    // Fetch the element that has to be sunk.
    var element = this.content[n];

    // When at 0, an element can not sink any further.
    while (n > 0) {

      // Compute the parent element's index, and fetch it.
      var parentN = ((n + 1) >> 1) - 1,
        parent = this.content[parentN];
      // Swap the elements if the parent is greater.
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        // Update 'n' to continue at the new position.
        n = parentN;
      }

      // Found a parent that is less, no need to sink any further.
      else {
        break;
      }
    }
  },
  bubbleUp: function(n) {
    // Look up the target element and its score.
    var length = this.content.length,
      element = this.content[n],
      elemScore = this.scoreFunction(element);

    while(true) {
      // Compute the indices of the child elements.
      var child2N = (n + 1) << 1, child1N = child2N - 1;
      // This is used to store the new position of the element,
      // if any.
      var swap = null;
      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        var child1 = this.content[child1N],
          child1Score = this.scoreFunction(child1);

        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore)
          swap = child1N;
      }

      // Do the same checks for the other child.
      if (child2N < length) {
        var child2 = this.content[child2N],
          child2Score = this.scoreFunction(child2);
        if (child2Score < (swap === null ? elemScore : child1Score)) {
          swap = child2N;
        }
      }

      // If the element needs to be moved, swap it, and continue.
      if (swap !== null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }

      // Otherwise, we are done.
      else {
        break;
      }
    }
  }
};

// javascript-astar
// http://github.com/bgrins/javascript-astar
// Freely distributable under the MIT License.
// Implements the astar search algorithm in javascript using a binary heap.

var astar = {
  init: function(grid) {
    for(var x = 0, xl = grid.length; x < xl; x++) {
      for(var y = 0, yl = grid[x].length; y < yl; y++) {
        var node = grid[x][y];
        node.f = 0;
        node.g = 0;
        node.h = 0;
        node.cost = node.type;
        node.visited = false;
        node.closed = false;
        node.parent = null;
      }
    }
  },
  heap: function() {
    return new BinaryHeap(function(node) {
      return node.f;
    });
  },
  search: function(grid, start, end, diagonal, heuristic) {
    astar.init(grid);
    heuristic = heuristic || astar.manhattan;
    diagonal = !!diagonal;

    var openHeap = astar.heap();

    openHeap.push(start);

    while(openHeap.size() > 0) {

      // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
      var currentNode = openHeap.pop();

      // End case -- result has been found, return the traced path.
      if(currentNode === end) {
        var curr = currentNode;
        var ret = [];
        while(curr.parent) {
          ret.push(curr);
          curr = curr.parent;
        }
        return ret.reverse();
      }

      // Normal case -- move currentNode from open to closed, process each of its neighbors.
      currentNode.closed = true;

      // Find all neighbors for the current node. Optionally find diagonal neighbors as well (false by default).
      var neighbors = astar.neighbors(grid, currentNode, diagonal);

      for(var i=0, il = neighbors.length; i < il; i++) {
        var neighbor = neighbors[i];

        if(neighbor.closed || neighbor.isWall()) {
          // Not a valid node to process, skip to next neighbor.
          continue;
        }

        // The g score is the shortest distance from start to current node.
        // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
        var gScore = currentNode.g + neighbor.cost;
        var beenVisited = neighbor.visited;

        if(!beenVisited || gScore < neighbor.g) {

          // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
          neighbor.visited = true;
          neighbor.parent = currentNode;
          neighbor.h = neighbor.h || heuristic(neighbor.pos, end.pos);
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;

          if (!beenVisited) {
            // Pushing to heap will put it in proper place based on the 'f' value.
            openHeap.push(neighbor);
          }
          else {
            // Already seen the node, but since it has been rescored we need to reorder it in the heap
            openHeap.rescoreElement(neighbor);
          }
        }
      }
    }

    // No result was found - empty array signifies failure to find path.
    return [];
  },
  manhattan: function(pos0, pos1) {
    // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.dom

    var d1 = Math.abs (pos1.x - pos0.x);
    var d2 = Math.abs (pos1.y - pos0.y);
    return d1 + d2;
  },
  neighbors: function(grid, node, diagonals) {
    var ret = [];
    var x = node.x;
    var y = node.y;

    // West
    if(grid[x-1] && grid[x-1][y]) {
      ret.push(grid[x-1][y]);
    }

    // East
    if(grid[x+1] && grid[x+1][y]) {
      ret.push(grid[x+1][y]);
    }

    // South
    if(grid[x] && grid[x][y-1]) {
      ret.push(grid[x][y-1]);
    }

    // North
    if(grid[x] && grid[x][y+1]) {
      ret.push(grid[x][y+1]);
    }

    if (diagonals) {

      // Southwest
      if(grid[x-1] && grid[x-1][y-1]) {
        ret.push(grid[x-1][y-1]);
      }

      // Southeast
      if(grid[x+1] && grid[x+1][y-1]) {
        ret.push(grid[x+1][y-1]);
      }

      // Northwest
      if(grid[x-1] && grid[x-1][y+1]) {
        ret.push(grid[x-1][y+1]);
      }

      // Northeast
      if(grid[x+1] && grid[x+1][y+1]) {
        ret.push(grid[x+1][y+1]);
      }

    }

    return ret;
  }
};

//===================================================================================================

/**
 * @namespace
 */
var Base64Helper = {};

/**
 *
 * @param {String} data
 */
Base64Helper.base64ToImage = function (data) {
  var img = new Image();
  img.src = "data:image/png;base64,"+data;
  return img;
};

/**
 *
 * @param {Image} img
 */
Base64Helper.canvasToBase64 = function (img) {
  var dataURL;

  if (img instanceof Image) {

    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the assets contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the aw2-URL formatted assets
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "assets/jpg"
    // will re-encode the assets.
    dataURL = canvas.toDataURL("assets/png");
  } else if (img instanceof HTMLCanvasElement) {
    dataURL = (/** @type {HTMLCanvasElement}*/ img).toDataURL("assets/png");
  }

  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
};

/*
 * Based on base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function (chars) {
  var encodings = chars;

  Base64Helper.encodeBuffer = function (arrayBuffer) {
    var base64 = '';

    var bytes = new Uint8Array(arrayBuffer);
    var byteLength = bytes.byteLength;
    var byteRemainder = byteLength % 3;
    var mainLength = byteLength - byteRemainder;

    var a, b, c, d;
    var chunk;

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
      // Combine the three bytes into a single integer
      chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

      // Use bitmasks to extract 6-bit segments from the triplet
      a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
      b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
      c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
      d = chunk & 63;               // 63       = 2^6 - 1

      // Convert the raw binary segments to the appropriate ASCII encoding
      base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
      chunk = bytes[mainLength];

      a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

      // Set the 4 least significant bits to zero
      b = (chunk & 3) << 4; // 3   = 2^2 - 1

      base64 += encodings[a] + encodings[b] + '==';
    } else if (byteRemainder == 2) {
      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

      a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
      b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

      // Set the 2 least significant bits to zero
      c = (chunk & 15) << 2; // 15    = 2^4 - 1

      base64 += encodings[a] + encodings[b] + encodings[c] + '=';
    }

    return base64;
  };

  Base64Helper.decodeBuffer = function (base64) {
    var bufferLength = base64.length * 0.75,
      len = base64.length, i, p = 0,
      encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
      bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i += 4) {
      encoded1 = chars.indexOf(base64[i]);
      encoded2 = chars.indexOf(base64[i + 1]);
      encoded3 = chars.indexOf(base64[i + 2]);
      encoded4 = chars.indexOf(base64[i + 3]);

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };
})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");

//===================================================================================================

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      fNOP = function () {},
      fBound = function () {
        return fToBind.apply(this instanceof fNOP && oThis
          ? this
          : oThis,
          aArgs.concat(Array.prototype.slice.call(arguments)));
      };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

//===================================================================================================

/* Browser Detection, taken from HeadJS. */
(function(){
  "use strict";
  
  // browser type & version
  var ua     = window.navigator.userAgent.toLowerCase(),
      mobile = /mobile|android|kindle|silk|midp|(windows nt 6\.2.+arm|touch)/.test(ua);
  
  // http://www.zytrax.com/tech/web/browser_ids.htm
  // http://www.zytrax.com/tech/web/mobile_ids.dom
  ua = /(chrome|firefox)[ \/]([\w.]+)/.exec(ua) ||               // Chrome & Firefox
    /(iphone|ipad|ipod)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||  // Mobile IOS
    /(android)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||           // Mobile Webkit
    /(webkit|opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||      // Safari & Opera
    /(msie) ([\w.]+)/.exec(ua) || [];                            // Internet Explorer
  
  var browser = ua[1],
      version = parseFloat(ua[2]);    
  
  switch (browser) {
    case 'msie':
      browser = 'ie';
      version = doc.documentMode || version;
      break;
      
    case 'firefox':
      browser = 'ff';
      break;
      
    case 'ipod':
    case 'ipad':
    case 'iphone':
      browser = 'ios';
      break;
      
    case 'webkit':
      browser = 'safari';
      break;
  }
  
  // Browser vendor and version
  window.Browser = {
    name   : browser,
    mobile : mobile,
    version: version
  };
  
  // Shortcut
  Browser[browser] = true;
  
})();

//===================================================================================================

/*globals define:true, window:true, module:true*/
(function () {
  // Namespace object
  var my = {};
  // Return as AMD module or attach to head object
  if (typeof define !== 'undefined')
    define([], function () {
      return my;
    });
  else if (typeof window !== 'undefined')
    window.my = my;
  else
    module.exports = my;

  //============================================================================
  // @method my.Class
  // @params body:Object
  // @params SuperClass:function, ImplementClasses:function..., body:Object
  // @return function
  my.Class = function () {

    var len = arguments.length;
    var body = arguments[len - 1];
    var SuperClass = len > 1 ? arguments[0] : null;
    var hasImplementClasses = len > 2;
    var Class, SuperClassEmpty;

    if (body.constructor === Object) {
      Class = function() {};
    } else {
      Class = body.constructor;
      delete body.constructor;
    }

    if (SuperClass) {
      SuperClassEmpty = function() {};
      SuperClassEmpty.prototype = SuperClass.prototype;
      Class.prototype = new SuperClassEmpty();
      Class.prototype.constructor = Class;
      Class.Super = SuperClass;
      extend(Class, SuperClass, false);
    }

    if (hasImplementClasses)
      for (var i = 1; i < len - 1; i++)
        extend(Class.prototype, arguments[i].prototype, false);

    extendClass(Class, body);

    return Class;

  };

  //============================================================================
  // @method my.extendClass
  // @params Class:function, extension:Object, ?override:boolean=true
  var extendClass = my.extendClass = function (Class, extension, override) {
    if (extension.STATIC) {
      extend(Class, extension.STATIC, override);
      delete extension.STATIC;
    }
    extend(Class.prototype, extension, override);
  };

  //============================================================================
  var extend = function (obj, extension, override) {
    var prop;
    if (override === false) {
      for (prop in extension)
        if (!(prop in obj))
          obj[prop] = extension[prop];
    } else {
      for (prop in extension)
        obj[prop] = extension[prop];
      if (extension.toString !== Object.prototype.toString)
        obj.toString = extension.toString;
    }
  };

})();

//===================================================================================================

if (window.console) window.console = {};
(function (console) {
  var container = document.createElement("div");

  container.id = "customLogPanel";

  container.style.position = "absolute";
  container.style.display = "block";
  container.style.left = "5px";
  container.style.top = "5px";
  container.style.width = "50%";
  container.style.height = "50%";
  container.style.overflow = "hidden";
  container.style.color = "white";
  container.style.fontWeight = "bold";
  container.style.backgroundColor = "rgba(0,0,0,0.3)";
  container.style.border = "1px solid black";
  container.style.padding = "2px";
  container.style.pointerEvents = "none";
  container.style.zIndex = "9999";

  document.getElementsByTagName("body")[0].appendChild(container);

  window.console.toggle = function () {
    container.style.display = (container.style.display === "block")? "none" : "block";
  };

  window.console.log = function (msg) {
    var el = document.createElement("p");
    el.innerHTML = " INFO:: "+msg;

    el.style.margin = "0";

    container.insertBefore(el,container.children[0]);

  };

  window.console.error = function (msg, where) {
    var el = document.createElement("p");
    el.innerHTML = "ERROR:: "+msg+((where)? "<br/>[at: "+where+"]" : "");

    el.style.color = "red";
    el.style.margin = "2";

    container.insertBefore(el,container.children[0]);
  };

})(window.console);/* jshint proto: true */

//===================================================================================================

/**
 * jjv.js -- A javascript library to validate json input through a json-schema.
 *
 * Copyright (c) 2013 Alex Cornejo.
 *
 * Redistributable under a MIT-style open source license.
 */
(function () {
  var clone = function (obj) {
    // Handle the 3 simple types (string, number, function), and null or undefined
    if (obj === null || typeof obj !== 'object') return obj;
    var copy;

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // handle RegExp
    if (obj instanceof RegExp) {
      copy = new RegExp(obj);
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++)
        copy[i] = clone(obj[i]);
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      //           copy = Object.create(Object.getPrototypeOf(obj));
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr))
          copy[attr] = clone(obj[attr]);
      }
      return copy;
    }

    throw new Error("Unable to clone object!");
  };

  var clone_stack = function (stack) {
    var stack_last = stack.length-1, key = stack[stack_last].key;
    var new_stack = stack.slice(0);
    new_stack[stack_last].object[key] = clone(new_stack[stack_last].object[key]);
    return new_stack;
  };

  var copy_stack = function (new_stack, old_stack) {
    var stack_last = new_stack.length-1, key = new_stack[stack_last].key;
    old_stack[stack_last].object[key] = new_stack[stack_last].object[key];
  };

  var handled = {
    'type': true,
    'not': true,
    'anyOf': true,
    'allOf': true,
    'oneOf': true,
    '$ref': true,
    '$schema': true,
    'id': true,
    'exclusiveMaximum': true,
    'exclusiveMininum': true,
    'properties': true,
    'patternProperties': true,
    'additionalProperties': true,
    'items': true,
    'additionalItems': true,
    'required': true,
    'default': true,
    'title': true,
    'description': true,
    'definitions': true,
    'dependencies': true
  };

  var fieldType = {
    'null': function (x) {
      return x === null;
    },
    'string': function (x) {
      return typeof x === 'string';
    },
    'boolean': function (x) {
      return typeof x === 'boolean';
    },
    'number': function (x) {
      // Use x === x instead of !isNaN(x) for speed
      return typeof x === 'number' && x === x;
    },
    'integer': function (x) {
      return typeof x === 'number' && x%1 === 0;
    },
    'object': function (x) {
      return x && typeof x === 'object' && !Array.isArray(x);
    },
    'array': function (x) {
      return Array.isArray(x);
    },
    'date': function (x) {
      return x instanceof Date;
    }
  };

  // missing: uri, date-time, ipv4, ipv6
  var fieldFormat = {
    'alpha': function (v) {
      return (/^[a-zA-Z]+$/).test(v);
    },
    'alphanumeric': function (v) {
      return (/^[a-zA-Z0-9]+$/).test(v);
    },
    'identifier': function (v) {
      return (/^[-_a-zA-Z0-9]+$/).test(v);
    },
    'hexadecimal': function (v) {
      return (/^[a-fA-F0-9]+$/).test(v);
    },
    'numeric': function (v) {
      return (/^[0-9]+$/).test(v);
    },
    'date-time': function (v) {
      return !isNaN(Date.parse(v)) && v.indexOf('/') === -1;
    },
    'uppercase': function (v) {
      return v === v.toUpperCase();
    },
    'lowercase': function (v) {
      return v === v.toLowerCase();
    },
    'hostname': function (v) {
      return v.length < 256 && (/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9]))*$/).test(v);
    },
    'uri': function (v) {
      return (/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/).test(v);
    },
    'email': function (v) { // email, ipv4 and ipv6 adapted from node-validator_
      return (/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/).test(v);
    },
    'ipv4': function (v) {
      if ((/^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/).test(v)) {
        var parts = v.split('.').sort();
        if (parts[3] <= 255)
          return true;
      }
      return false;
    },
    'ipv6': function(v) {
      return (/^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/).test(v);
      /*  return (/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/).test(v); */
    }
  };

  var fieldValidate = {
    'readOnly': function (v, p) {
      return false;
    },
    // ****** numeric validation ********
    'minimum': function (v, p, schema) {
      return !(v < p || schema.exclusiveMinimum && v <= p);
    },
    'maximum': function (v, p, schema) {
      return !(v > p || schema.exclusiveMaximum && v >= p);
    },
    'multipleOf': function (v, p) {
      return (v/p)%1 === 0 || typeof v !== 'number';
    },
    // ****** string validation ******
    'pattern': function (v, p) {
      if (typeof v !== 'string')
        return true;
      var pattern, modifiers;
      if (typeof p === 'string')
        pattern=p;
      else {
        pattern=p[0];
        modifiers=p[1];
      }
      var regex = new RegExp(pattern, modifiers);
      return regex.test(v);
    },
    'minLength': function (v, p) {
      return v.length >= p || typeof v !== 'string';
    },
    'maxLength': function (v, p) {
      return v.length <= p || typeof v !== 'string';
    },
    // ***** array validation *****
    'minItems': function (v, p) {
      return v.length >= p || !Array.isArray(v);
    },
    'maxItems': function (v, p) {
      return v.length <= p || !Array.isArray(v);
    },
    'uniqueItems': function (v, p) {
      var hash = {}, key;
      for (var i = 0, len = v.length; i < len; i++) {
        key = JSON.stringify(v[i]);
        if (hash.hasOwnProperty(key))
          return false;
        else
          hash[key] = true;
      }
      return true;
    },
    // ***** object validation ****
    'minProperties': function (v, p) {
      if (typeof v !== 'object')
        return true;
      var count = 0;
      for (var attr in v) if (v.hasOwnProperty(attr)) count = count + 1;
      return count >= p;
    },
    'maxProperties': function (v, p) {
      if (typeof v !== 'object')
        return true;
      var count = 0;
      for (var attr in v) if (v.hasOwnProperty(attr)) count = count + 1;
      return count <= p;
    },
    // ****** all *****
    'enum': function (v, p) {
      var i, len, vs;
      if (typeof v === 'object') {
        vs = JSON.stringify(v);
        for (i = 0, len = p.length; i < len; i++)
          if (vs === JSON.stringify(p[i]))
            return true;
      } else {
        for (i = 0, len = p.length; i < len; i++)
          if (v === p[i])
            return true;
      }
      return false;
    }
  };

  var normalizeID = function (id) {
    return id.indexOf("://") === -1 ? id : id.split("#")[0];
  };

  var resolveURI = function (env, schema_stack, uri) {
    var curschema, components, hash_idx, name;

    hash_idx = uri.indexOf('#');

    if (hash_idx === -1) {
      if (!env.schema.hasOwnProperty(uri))
        return null;
      return [env.schema[uri]];
    }

    if (hash_idx > 0) {
      name = uri.substr(0, hash_idx);
      uri = uri.substr(hash_idx+1);
      if (!env.schema.hasOwnProperty(name)) {
        if (schema_stack && schema_stack[0].id === name)
          schema_stack = [schema_stack[0]];
        else
          return null;
      } else
        schema_stack = [env.schema[name]];
    } else {
      if (!schema_stack)
        return null;
      uri = uri.substr(1);
    }

    if (uri === '')
      return [schema_stack[0]];

    if (uri.charAt(0) === '/') {
      uri = uri.substr(1);
      curschema = schema_stack[0];
      components = uri.split('/');
      while (components.length > 0) {
        if (!curschema.hasOwnProperty(components[0]))
          return null;
        curschema = curschema[components[0]];
        schema_stack.push(curschema);
        components.shift();
      }
      return schema_stack;
    } else // FIX: should look for subschemas whose id matches uri
      return null;
  };

  var resolveObjectRef = function (object_stack, uri) {
    var components, object, last_frame = object_stack.length-1, skip_frames, frame, m = /^(\d+)/.exec(uri);

    if (m) {
      uri = uri.substr(m[0].length);
      skip_frames = parseInt(m[1], 10);
      if (skip_frames < 0 || skip_frames > last_frame)
        return;
      frame = object_stack[last_frame-skip_frames];
      if (uri === '#')
        return frame.key;
    } else
      frame = object_stack[0];

    object = frame.object[frame.key];

    if (uri === '')
      return object;

    if (uri.charAt(0) === '/') {
      uri = uri.substr(1);
      components = uri.split('/');
      while (components.length > 0) {
        components[0] = components[0].replace(/~1/g, '/').replace(/~0/g, '~');
        if (!object.hasOwnProperty(components[0]))
          return;
        object = object[components[0]];
        components.shift();
      }
      return object;
    } else
      return;
  };

  var checkValidity = function (env, schema_stack, object_stack, options) {
    var i, len, count, hasProp, hasPattern;
    var p, v, malformed = false, objerrs = {}, objerr, props, matched;
    var sl = schema_stack.length-1, schema = schema_stack[sl], new_stack;
    var ol = object_stack.length-1, object = object_stack[ol].object, name = object_stack[ol].key, prop = object[name];

    if (schema.hasOwnProperty('$ref')) {
      schema_stack= resolveURI(env, schema_stack, schema.$ref);
      if (!schema_stack)
        return {'$ref': schema.$ref};
      else
        return checkValidity(env, schema_stack, object_stack, options);
    }

    if (schema.hasOwnProperty('type')) {
      if (typeof schema.type === 'string') {
        if (options.useCoerce && env.coerceType.hasOwnProperty(schema.type))
          prop = object[name] = env.coerceType[schema.type](prop);
        if (!env.fieldType[schema.type](prop))
          return {'type': schema.type};
      } else {
        malformed = true;
        for (i = 0, len = schema.type.length; i < len && malformed; i++)
          if (env.fieldType[schema.type[i]](prop))
            malformed = false;
        if (malformed)
          return {'type': schema.type};
      }
    }

    if (schema.hasOwnProperty('allOf')) {
      for (i = 0, len = schema.allOf.length; i < len; i++) {
        objerr = checkValidity(env, schema_stack.concat(schema.allOf[i]), object_stack, options);
        if (objerr)
          return objerr;
      }
    }

    if (!options.useCoerce && !options.useDefault && !options.removeAdditional) {
      if (schema.hasOwnProperty('oneOf')) {
        for (i = 0, len = schema.oneOf.length, count = 0; i < len; i++) {
          objerr = checkValidity(env, schema_stack.concat(schema.oneOf[i]), object_stack, options);
          if (!objerr) {
            count = count + 1;
            if (count > 1)
              break;
          } else {
            objerrs = objerr;
          }
        }
        if (count > 1)
          return {'oneOf': true};
        else if (count < 1)
          return objerrs;
        objerrs = {};
      }

      if (schema.hasOwnProperty('anyOf')) {
        for (i = 0, len = schema.anyOf.length; i < len; i++) {
          objerr = checkValidity(env, schema_stack.concat(schema.anyOf[i]), object_stack, options);
          if (!objerr)
            break;
        }
        if (objerr)
          return objerr;
      }

      if (schema.hasOwnProperty('not')) {
        objerr = checkValidity(env, schema_stack.concat(schema.not), object_stack, options);
        if (!objerr)
          return {'not': true};
      }
    } else {
      if (schema.hasOwnProperty('oneOf')) {
        for (i = 0, len = schema.oneOf.length, count = 0; i < len; i++) {
          new_stack = clone_stack(object_stack);
          objerr = checkValidity(env, schema_stack.concat(schema.oneOf[i]), new_stack, options);
          if (!objerr) {
            count = count + 1;
            if (count > 1)
              break;
            else
              copy_stack(new_stack, object_stack);
          } else {
            objerrs = objerr;
          }
        }
        if (count > 1)
          return {'oneOf': true};
        else if (count < 1)
          return objerrs;
        objerrs = {};
      }

      if (schema.hasOwnProperty('anyOf')) {
        for (i = 0, len = schema.anyOf.length; i < len; i++) {
          new_stack = clone_stack(object_stack);
          objerr = checkValidity(env, schema_stack.concat(schema.anyOf[i]), new_stack, options);
          if (!objerr) {
            copy_stack(new_stack, object_stack);
            break;
          }
        }
        if (objerr)
          return objerr;
      }

      if (schema.hasOwnProperty('not')) {
        objerr = checkValidity(env, schema_stack.concat(schema.not), clone_stack(object_stack), options);
        if (!objerr)
          return {'not': true};
      }
    }

    if (schema.hasOwnProperty('dependencies')) {
      for (p in schema.dependencies)
        if (schema.dependencies.hasOwnProperty(p) && prop.hasOwnProperty(p)) {
          if (Array.isArray(schema.dependencies[p])) {
            for (i = 0, len = schema.dependencies[p].length; i < len; i++)
              if (!prop.hasOwnProperty(schema.dependencies[p][i])) {
                return {'dependencies': true};
              }
          } else {
            objerr = checkValidity(env, schema_stack.concat(schema.dependencies[p]), object_stack, options);
            if (objerr)
              return objerr;
          }
        }
    }

    if (!Array.isArray(prop)) {
      props = [];
      objerrs = {};
      for (p in prop)
        if (prop.hasOwnProperty(p))
          props.push(p);

      if (options.checkRequired && schema.required) {
        for (i = 0, len = schema.required.length; i < len; i++)
          if (!prop.hasOwnProperty(schema.required[i])) {
            objerrs[schema.required[i]] = {'required': true};
            malformed = true;
          }
      }

      hasProp = schema.hasOwnProperty('properties');
      hasPattern = schema.hasOwnProperty('patternProperties');
      if (hasProp || hasPattern) {
        i = props.length;
        while (i--) {
          matched = false;
          if (hasProp && schema.properties.hasOwnProperty(props[i])) {
            matched = true;
            objerr = checkValidity(env, schema_stack.concat(schema.properties[props[i]]), object_stack.concat({object: prop, key: props[i]}), options);
            if (objerr !== null) {
              objerrs[props[i]] = objerr;
              malformed = true;
            }
          }
          if (hasPattern) {
            for (p in schema.patternProperties)
              if (schema.patternProperties.hasOwnProperty(p) && props[i].match(p)) {
                matched = true;
                objerr = checkValidity(env, schema_stack.concat(schema.patternProperties[p]), object_stack.concat({object: prop, key: props[i]}), options);
                if (objerr !== null) {
                  objerrs[props[i]] = objerr;
                  malformed = true;
                }
              }
          }
          if (matched)
            props.splice(i, 1);
        }
      }

      if (options.useDefault && hasProp && !malformed) {
        for (p in schema.properties)
          if (schema.properties.hasOwnProperty(p) && !prop.hasOwnProperty(p) && schema.properties[p].hasOwnProperty('default'))
            prop[p] = schema.properties[p]['default'];
      }

      if (options.removeAdditional && hasProp && schema.additionalProperties !== true && typeof schema.additionalProperties !== 'object') {
        for (i = 0, len = props.length; i < len; i++)
          delete prop[props[i]];
      } else {
        if (schema.hasOwnProperty('additionalProperties')) {
          if (typeof schema.additionalProperties === 'boolean') {
            if (!schema.additionalProperties) {
              for (i = 0, len = props.length; i < len; i++) {
                objerrs[props[i]] = {'additional': true};
                malformed = true;
              }
            }
          } else {
            for (i = 0, len = props.length; i < len; i++) {
              objerr = checkValidity(env, schema_stack.concat(schema.additionalProperties), object_stack.concat({object: prop, key: props[i]}), options);
              if (objerr !== null) {
                objerrs[props[i]] = objerr;
                malformed = true;
              }
            }
          }
        }
      }
      if (malformed)
        return {'schema': objerrs};
    } else {
      if (schema.hasOwnProperty('items')) {
        if (Array.isArray(schema.items)) {
          for (i = 0, len = schema.items.length; i < len; i++) {
            objerr = checkValidity(env, schema_stack.concat(schema.items[i]), object_stack.concat({object: prop, key: i}), options);
            if (objerr !== null) {
              objerrs[i] = objerr;
              malformed = true;
            }
          }
          if (prop.length > len && schema.hasOwnProperty('additionalItems')) {
            if (typeof schema.additionalItems === 'boolean') {
              if (!schema.additionalItems)
                return {'additionalItems': true};
            } else {
              for (i = len, len = prop.length; i < len; i++) {
                objerr = checkValidity(env, schema_stack.concat(schema.additionalItems), object_stack.concat({object: prop, key: i}), options);
                if (objerr !== null) {
                  objerrs[i] = objerr;
                  malformed = true;
                }
              }
            }
          }
        } else {
          for (i = 0, len = prop.length; i < len; i++) {
            objerr = checkValidity(env, schema_stack.concat(schema.items), object_stack.concat({object: prop, key: i}), options);
            if (objerr !== null) {
              objerrs[i] = objerr;
              malformed = true;
            }
          }
        }
      } else if (schema.hasOwnProperty('additionalItems')) {
        if (typeof schema.additionalItems !== 'boolean') {
          for (i = 0, len = prop.length; i < len; i++) {
            objerr = checkValidity(env, schema_stack.concat(schema.additionalItems), object_stack.concat({object: prop, key: i}), options);
            if (objerr !== null) {
              objerrs[i] = objerr;
              malformed = true;
            }
          }
        }
      }
      if (malformed)
        return {'schema': objerrs};
    }

    for (v in schema) {
      if (schema.hasOwnProperty(v) && !handled.hasOwnProperty(v)) {
        if (v === 'format') {
          if (env.fieldFormat.hasOwnProperty(schema[v]) && !env.fieldFormat[schema[v]](prop, schema, object_stack, options)) {
            objerrs[v] = true;
            malformed = true;
          }
        } else {
          if (env.fieldValidate.hasOwnProperty(v) && !env.fieldValidate[v](prop, schema[v].hasOwnProperty('$data') ? resolveObjectRef(object_stack, schema[v].$data) : schema[v], schema, object_stack, options)) {
            objerrs[v] = true;
            malformed = true;
          }
        }
      }
    }

    if (malformed)
      return objerrs;
    else
      return null;
  };

  var defaultOptions = {
    useDefault: false,
    useCoerce: false,
    checkRequired: true,
    removeAdditional: false
  };

  function Environment() {
    if (!(this instanceof Environment))
      return new Environment();

    this.coerceType = {};
    this.fieldType = clone(fieldType);
    this.fieldValidate = clone(fieldValidate);
    this.fieldFormat = clone(fieldFormat);
    this.defaultOptions = clone(defaultOptions);
    this.schema = {};
  }

  Environment.prototype = {
    validate: function (name, object, options) {
      var schema_stack = [name], errors = null, object_stack = [{object: {'__root__': object}, key: '__root__'}];

      if (typeof name === 'string') {
        schema_stack = resolveURI(this, null, name);
        if (!schema_stack)
          throw new Error('jjv: could not find schema \'' + name + '\'.');
      }

      if (!options) {
        options = this.defaultOptions;
      } else {
        for (var p in this.defaultOptions)
          if (this.defaultOptions.hasOwnProperty(p) && !options.hasOwnProperty(p))
            options[p] = this.defaultOptions[p];
      }

      errors = checkValidity(this, schema_stack, object_stack, options);

      if (errors)
        return {validation: errors.hasOwnProperty('schema') ? errors.schema : errors};
      else
        return null;
    },

    resolveRef: function (schema_stack, $ref) {
      return resolveURI(this, schema_stack, $ref);
    },

    addType: function (name, func) {
      this.fieldType[name] = func;
    },

    addTypeCoercion: function (type, func) {
      this.coerceType[type] = func;
    },

    addCheck: function (name, func) {
      this.fieldValidate[name] = func;
    },

    addFormat: function (name, func) {
      this.fieldFormat[name] = func;
    },

    addSchema: function (name, schema) {
      if (!schema && name) {
        schema = name;
        name = undefined;
      }
      if (schema.hasOwnProperty('id') && typeof schema.id === 'string' && schema.id !== name) {
        if (schema.id.charAt(0) === '/')
          throw new Error('jjv: schema id\'s starting with / are invalid.');
        this.schema[normalizeID(schema.id)] = schema;
      } else if (!name) {
        throw new Error('jjv: schema needs either a name or id attribute.');
      }
      if (name)
        this.schema[normalizeID(name)] = schema;
    }
  };

  // Export for use in server and client.
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Environment;
  else if (typeof define === 'function' && define.amd)
    define(function () {return Environment;});
  else
    this.jjv = Environment;
}).call(this);

//===================================================================================================

/**
 * Lawnchair!
 * ---
 * clientside json store
 *
 */
var Lawnchair = function (options, callback) {
  // ensure Lawnchair was called as a constructor
  if (!(this instanceof Lawnchair)) return new Lawnchair(options, callback);

  // lawnchair requires json
  if (!JSON) throw 'JSON unavailable! Include http://www.json.org/json2.js to fix.'
  // options are optional; callback is not
  if (arguments.length <= 2) {
    callback = (typeof arguments[0] === 'function') ? arguments[0] : arguments[1];
    options  = (typeof arguments[0] === 'function') ? {} : arguments[0] || {};
  } else {
    throw 'Incorrect # of ctor args!'
  }

  // default configuration
  this.record = options.record || 'record'  // default for records
  this.name   = options.name   || 'records' // default name for underlying store

  // mixin first valid  adapter
  var adapter
  // if the adapter is passed in we try to load that only
  if (options.adapter) {

    // the argument passed should be an array of prefered adapters
    // if it is not, we convert it
    if(typeof(options.adapter) === 'string'){
      options.adapter = [options.adapter];
    }

    // iterates over the array of passed adapters
    for(var j = 0, k = options.adapter.length; j < k; j++){

      // itirates over the array of available adapters
      for (var i = Lawnchair.adapters.length-1; i >= 0; i--) {
        if (Lawnchair.adapters[i].adapter === options.adapter[j]) {
          adapter = Lawnchair.adapters[i].valid() ? Lawnchair.adapters[i] : undefined;
          if (adapter) break
        }
      }
      if (adapter) break
    }

    // otherwise find the first valid adapter for this env
  }
  else {
    for (var i = 0, l = Lawnchair.adapters.length; i < l; i++) {
      adapter = Lawnchair.adapters[i].valid() ? Lawnchair.adapters[i] : undefined
      if (adapter) break
    }
  }

  // we have failed
  if (!adapter) throw 'No valid adapter.'

  // yay! mixin the adapter
  for (var j in adapter)
    this[j] = adapter[j]

  // call init for each mixed in plugin
  for (var i = 0, l = Lawnchair.plugins.length; i < l; i++)
    Lawnchair.plugins[i].call(this)

  // init the adapter
  this.init(options, callback)
}

Lawnchair.adapters = []

/**
 * queues an adapter for mixin
 * ===
 * - ensures an adapter conforms to a specific interface
 *
 */
Lawnchair.adapter = function (id, obj) {
  // add the adapter id to the adapter obj
  // ugly here for a  cleaner dsl for implementing adapters
  obj['adapter'] = id
  // methods required to implement a lawnchair adapter
  var implementing = 'adapter valid init keys save batch get exists all remove nuke'.split(' ')
    ,   indexOf = this.prototype.indexOf
  // mix in the adapter
  for (var i in obj) {
    if (indexOf(implementing, i) === -1) throw 'Invalid adapter! Nonstandard method: ' + i
  }
  // if we made it this far the adapter interface is valid
  // insert the new adapter as the preferred adapter
  Lawnchair.adapters.splice(0,0,obj)
}

Lawnchair.plugins = []

/**
 * generic shallow extension for plugins
 * ===
 * - if an init method is found it registers it to be called when the lawnchair is inited
 * - yes we could use hasOwnProp but nobody here is an asshole
 */
Lawnchair.plugin = function (obj) {
  for (var i in obj)
    i === 'init' ? Lawnchair.plugins.push(obj[i]) : this.prototype[i] = obj[i]
}

/**
 * helpers
 *
 */
Lawnchair.prototype = {

  isArray: Array.isArray || function(o) { return Object.prototype.toString.call(o) === '[object Array]' },

  /**
   * this code exists for ie8... for more background see:
   * http://www.flickr.com/photos/westcoastlogic/5955365742/in/photostream
   */
  indexOf: function(ary, item, i, l) {
    if (ary.indexOf) return ary.indexOf(item)
    for (i = 0, l = ary.length; i < l; i++) if (ary[i] === item) return i
    return -1
  },

  // awesome shorthand callbacks as strings. this is shameless theft from dojo.
  lambda: function (callback) {
    return this.fn(this.record, callback)
  },

  // first stab at named parameters for terse callbacks; dojo: first != best // ;D
  fn: function (name, callback) {
    return typeof callback == 'string' ? new Function(name, callback) : callback
  },

  // returns a unique identifier (by way of Backbone.localStorage.js)
  // TODO investigate smaller UUIDs to cut on storage cost
  uuid: function () {
    var S4 = function () {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  },

  // a classic iterator
  each: function (callback) {
    var cb = this.lambda(callback)
    // iterate from chain
    if (this.__results) {
      for (var i = 0, l = this.__results.length; i < l; i++) cb.call(this, this.__results[i], i)
    }
    // otherwise iterate the entire collection
    else {
      this.all(function(r) {
        for (var i = 0, l = r.length; i < l; i++) cb.call(this, r[i], i)
      })
    }
    return this
  }
// --
};

/**
 * Expose nodeJS module
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Lawnchair;
}

/**
 * indexed db adapter
 * ===
 * - originally authored by Vivian Li
 *
 */
Lawnchair.adapter('indexed-db', (function(){

  function fail(e, i) { console.error('error in indexed-db adapter!', e, i); }

  // update the STORE_VERSION when the schema used by this adapter changes
  // (for example, if you change the STORE_NAME above)
  var STORE_VERSION = 3;

  var getIDB = function() {
    return window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.oIndexedDB || window.msIndexedDB;
  };
  var getIDBTransaction = function() {
    return window.IDBTransaction || window.webkitIDBTransaction ||
      window.mozIDBTransaction || window.oIDBTransaction ||
      window.msIDBTransaction;
  };
  var getIDBKeyRange = function() {
    return window.IDBKeyRange || window.webkitIDBKeyRange ||
      window.mozIDBKeyRange || window.oIDBKeyRange ||
      window.msIDBKeyRange;
  };
  var getIDBDatabaseException = function() {
    return window.IDBDatabaseException || window.webkitIDBDatabaseException ||
      window.mozIDBDatabaseException || window.oIDBDatabaseException ||
      window.msIDBDatabaseException;
  };
  var useAutoIncrement = function() {
    // using preliminary mozilla implementation which doesn't support
    // auto-generated keys.  Neither do some webkit implementations.
    return !!window.indexedDB;
  };


  // see https://groups.google.com/a/chromium.org/forum/?fromgroups#!topic/chromium-html5/OhsoAQLj7kc
  var READ_WRITE = (getIDBTransaction() &&
    'READ_WRITE' in getIDBTransaction()) ?
    getIDBTransaction().READ_WRITE : 'readwrite';

  return {

    valid: function() { return !!getIDB(); },

    init:function(options, callback) {
      this.idb = getIDB();
      this.waiting = [];
      this.useAutoIncrement = useAutoIncrement();
      var request = this.idb.open(this.name, STORE_VERSION);
      var self = this;
      var cb = self.fn(self.name, callback);
      if (cb && typeof cb != 'function') throw 'callback not valid';
      var win = function() {
        // manually clean up event handlers on request; this helps on chrome
        request.onupgradeneeded = request.onsuccess = request.error = null;
        if(cb) return cb.call(self, self);
      };

      var upgrade = function(from, to) {
        // don't try to migrate dbs, just recreate
        try {
          self.db.deleteObjectStore('teststore'); // old adapter
        } catch (e1) { /* ignore */ }
        try {
          self.db.deleteObjectStore(self.record);
        } catch (e2) { /* ignore */ }

        // ok, create object store.
        var params = {};
        if (self.useAutoIncrement) { params.autoIncrement = true; }
        self.db.createObjectStore(self.record, params);
        self.store = true;
      };
      request.onupgradeneeded = function(event) {
        self.db = request.result;
        self.transaction = request.transaction;
        upgrade(event.oldVersion, event.newVersion);
        // will end up in onsuccess callback
      };
      request.onsuccess = function(event) {
        self.db = event.target.result;

        if(self.db.version != (''+STORE_VERSION)) {
          // DEPRECATED API: modern implementations will fire the
          // upgradeneeded event instead.
          var oldVersion = self.db.version;
          var setVrequest = self.db.setVersion(''+STORE_VERSION);
          // onsuccess is the only place we can create Object Stores
          setVrequest.onsuccess = function(event) {
            var transaction = setVrequest.result;
            setVrequest.onsuccess = setVrequest.onerror = null;
            // can't upgrade w/o versionchange transaction.
            upgrade(oldVersion, STORE_VERSION);
            transaction.oncomplete = function() {
              for (var i = 0; i < self.waiting.length; i++) {
                self.waiting[i].call(self);
              }
              self.waiting = [];
              win();
            };
          };
          setVrequest.onerror = function(e) {
            setVrequest.onsuccess = setVrequest.onerror = null;
            console.error("Failed to create objectstore " + e);
            fail(e);
          };
        } else {
          self.store = true;
          for (var i = 0; i < self.waiting.length; i++) {
            self.waiting[i].call(self);
          }
          self.waiting = [];
          win();
        }
      }
      request.onerror = function(ev) {
        if ( getIDBDatabaseException() && 
          request.errorCode === getIDBDatabaseException().VERSION_ERR) {
          // xxx blow it away
          self.idb.deleteDatabase(self.name);
          // try it again.
          return self.init(options, callback);
        }
        console.error('Failed to open database');
      };
    },

    save:function(obj, callback) {
      var self = this;
      if(!this.store) {
        this.waiting.push(function() {
          this.save(obj, callback);
        });
        return;
      }

      var objs = (this.isArray(obj) ? obj : [obj]).map(function(o){if(!o.key) { o.key = self.uuid()} return o})

      var win  = function (e) {
        if (callback) { self.lambda(callback).call(self, self.isArray(obj) ? objs : objs[0] ) }
      };

      var trans = this.db.transaction(this.record, READ_WRITE);
      var store = trans.objectStore(this.record);

      for (var i = 0; i < objs.length; i++) {
        var o = objs[i];
        store.put(o, o.key);
      }
      store.transaction.oncomplete = win;
      store.transaction.onabort = fail;

      return this;
    },

    batch: function (objs, callback) {
      return this.save(objs, callback);
    },


    get:function(key, callback) {
      if(!this.store) {
        this.waiting.push(function() {
          this.get(key, callback);
        });
        return;
      }


      var self = this;
      var win  = function (e) {
        var r = e.target.result;
        if (callback) {
          if (r) { r.key = key; }
          self.lambda(callback).call(self, r);
        }
      };

      if (!this.isArray(key)){
        var req = this.db.transaction(this.record).objectStore(this.record).get(key);

        req.onsuccess = function(event) {
          req.onsuccess = req.onerror = null;
          win(event);
        };
        req.onerror = function(event) {
          req.onsuccess = req.onerror = null;
          fail(event);
        };

      } else {

        // note: these are hosted.
        var results = []
          ,   done = key.length
          ,   keys = key

        var getOne = function(i) {
          self.get(keys[i], function(obj) {
            results[i] = obj;
            if ((--done) > 0) { return; }
            if (callback) {
              self.lambda(callback).call(self, results);
            }
          });
        };
        for (var i = 0, l = keys.length; i < l; i++)
          getOne(i);
      }

      return this;
    },

    exists:function(key, callback) {
      if(!this.store) {
        this.waiting.push(function() {
          this.exists(key, callback);
        });
        return;
      }

      var self = this;

      var req = this.db.transaction(self.record).objectStore(this.record).openCursor(getIDBKeyRange().only(key));

      req.onsuccess = function(event) {
        req.onsuccess = req.onerror = null;
        // exists iff req.result is not null
        // XXX but firefox returns undefined instead, sigh XXX
        var undef;
        self.lambda(callback).call(self, event.target.result !== null &&
          event.target.result !== undef);
      };
      req.onerror = function(event) {
        req.onsuccess = req.onerror = null;
        fail(event);
      };

      return this;
    },

    all:function(callback) {
      if(!this.store) {
        this.waiting.push(function() {
          this.all(callback);
        });
        return;
      }
      var cb = this.fn(this.name, callback) || undefined;
      var self = this;
      var objectStore = this.db.transaction(this.record).objectStore(this.record);
      var toReturn = [];
      objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          toReturn.push(cursor.value);
          cursor['continue']();
        }
        else {
          if (cb) cb.call(self, toReturn);
        }
      };
      return this;
    },

    keys:function(callback) {
      if(!this.store) {
        this.waiting.push(function() {
          this.keys(callback);
        });
        return;
      }
      var cb = this.fn(this.name, callback) || undefined;
      var self = this;
      var objectStore = this.db.transaction(this.record).objectStore(this.record);
      var toReturn = [];
      // in theory we could use openKeyCursor() here, but no one actually
      // supports it yet.
      objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          toReturn.push(cursor.key);
          cursor['continue']();
        }
        else {
          if (cb) cb.call(self, toReturn);
        }
      };
      return this;
    },

    remove:function(keyOrArray, callback) {
      if(!this.store) {
        this.waiting.push(function() {
          this.remove(keyOrArray, callback);
        });
        return;
      }
      var self = this;

      var toDelete = keyOrArray;
      if (!this.isArray(keyOrArray)) {
        toDelete=[keyOrArray];
      }


      var win = function () {
        if (callback) self.lambda(callback).call(self)
      };

      var os = this.db.transaction(this.record, READ_WRITE).objectStore(this.record);

      var key = keyOrArray.key ? keyOrArray.key : keyOrArray;
      for (var i = 0; i < toDelete.length; i++) {
        var key = toDelete[i].key ? toDelete[i].key : toDelete[i];
        os['delete'](key);
      };

      os.transaction.oncomplete = win;
      os.transaction.onabort = fail;

      return this;
    },

    nuke:function(callback) {
      if(!this.store) {
        this.waiting.push(function() {
          this.nuke(callback);
        });
        return;
      }

      var self = this
        ,   win  = callback ? function() { self.lambda(callback).call(self) } : function(){};

      try {
        var os = this.db.transaction(this.record, READ_WRITE).objectStore(this.record);
        os.clear();
        os.transaction.oncomplete = win;
        os.transaction.onabort = fail;
      } catch (e) {
        if (e.name=='NotFoundError')
          win()
        else
          fail(e);
      }
      return this;
    }

  };

})());
Lawnchair.adapter('webkit-sqlite', (function () {
  // private methods
  var fail = function (e, i) { console.error('error in sqlite adaptor!', e, i) }
    ,   now  = function () { return new Date() } // FIXME need to use better date fn
  // not entirely sure if this is needed...
  if (!Function.prototype.bind) {
    Function.prototype.bind = function( obj ) {
      var slice = [].slice
        ,   args  = slice.call(arguments, 1)
        ,   self  = this
        ,   nop   = function () {}
        ,   bound = function () {
          return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)))
        }
      nop.prototype   = self.prototype
      bound.prototype = new nop()
      return bound
    }
  }

  // public methods
  return {

    valid: function() { return !!(window.openDatabase) },

    init: function (options, callback) {
      var that   = this
        ,   cb     = that.fn(that.name, callback)
        ,   create = "CREATE TABLE IF NOT EXISTS " + this.record + " (id NVARCHAR(32) UNIQUE PRIMARY KEY, value TEXT, timestamp REAL)"
        ,   win    = function(){ if(cb) return cb.call(that, that); }

      if (cb && typeof cb != 'function') throw 'callback not valid';

      // open a connection and create the db if it doesn't exist
      this.db = openDatabase(this.name, '1.0.0', this.name, options.maxSize || 65536 )
      this.db.transaction(function (t) {
        t.executeSql(create, [])
      }, fail, win)
    },

    keys:  function (callback) {
      var cb   = this.lambda(callback)
        ,   that = this
        ,   keys = "SELECT id FROM " + this.record + " ORDER BY timestamp DESC"

      this.db.readTransaction(function(t) {
        var win = function (xxx, results) {
          if (results.rows.length == 0 ) {
            cb.call(that, [])
          } else {
            var r = [];
            for (var i = 0, l = results.rows.length; i < l; i++) {
              r.push(results.rows.item(i).id);
            }
            cb.call(that, r)
          }
        }
        t.executeSql(keys, [], win, fail)
      })
      return this
    },
    // you think thats air you're breathing now?
    save: function (obj, callback, error) {
      var that = this
        ,   objs = (this.isArray(obj) ? obj : [obj]).map(function(o){if(!o.key) { o.key = that.uuid()} return o})
        ,   ins  = "INSERT OR REPLACE INTO " + this.record + " (value, timestamp, id) VALUES (?,?,?)"
        ,   win  = function () { if (callback) { that.lambda(callback).call(that, that.isArray(obj)?objs:objs[0]) }}
        ,   error= error || null
        ,   insvals = []
        ,   ts = now()

      try {
        for (var i = 0, l = objs.length; i < l; i++) {
          insvals[i] = [JSON.stringify(objs[i]), ts, objs[i].key];
        }
      } catch (e) {
        (error)? error(e) : fail(e);
        throw e;
      }

      that.db.transaction(function(t) {
        for (var i = 0, l = objs.length; i < l; i++)
          t.executeSql(ins, insvals[i])
      }, (error)? error : fail, win)

      return this
    },


    batch: function (objs, callback) {
      return this.save(objs, callback)
    },

    get: function (keyOrArray, cb) {
      var that = this
        ,   sql  = ''
        ,   args = this.isArray(keyOrArray) ? keyOrArray : [keyOrArray];
      // batch selects support
      sql = 'SELECT id, value FROM ' + this.record + " WHERE id IN (" +
        args.map(function(){return '?'}).join(",") + ")"
      // FIXME
      // will always loop the results but cleans it up if not a batch return at the end..
      // in other words, this could be faster
      var win = function (xxx, results) {
        var o
          ,   r
          ,   lookup = {}
        // map from results to keys
        for (var i = 0, l = results.rows.length; i < l; i++) {
          o = JSON.parse(results.rows.item(i).value)
          o.key = results.rows.item(i).id
          lookup[o.key] = o;
        }
        r = args.map(function(key) { return lookup[key]; });
        if (!that.isArray(keyOrArray)) r = r.length ? r[0] : null
        if (cb) that.lambda(cb).call(that, r)
      }
      this.db.readTransaction(function(t){ t.executeSql(sql, args, win, fail) })
      return this
    },

    exists: function (key, cb) {
      var is = "SELECT * FROM " + this.record + " WHERE id = ?"
        ,   that = this
        ,   win = function(xxx, results) { if (cb) that.fn('exists', cb).call(that, (results.rows.length > 0)) }
      this.db.readTransaction(function(t){ t.executeSql(is, [key], win, fail) })
      return this
    },

    all: function (callback) {
      var that = this
        ,   all  = "SELECT * FROM " + this.record
        ,   r    = []
        ,   cb   = this.fn(this.name, callback) || undefined
        ,   win  = function (xxx, results) {
          if (results.rows.length != 0) {
            for (var i = 0, l = results.rows.length; i < l; i++) {
              var obj = JSON.parse(results.rows.item(i).value)
              obj.key = results.rows.item(i).id
              r.push(obj)
            }
          }
          if (cb) cb.call(that, r)
        }

      this.db.readTransaction(function (t) {
        t.executeSql(all, [], win, fail)
      })
      return this
    },

    remove: function (keyOrArray, cb) {
      var that = this
        ,   args
        ,   sql  = "DELETE FROM " + this.record + " WHERE id "
        ,   win  = function () { if (cb) that.lambda(cb).call(that) }
      if (!this.isArray(keyOrArray)) {
        sql += '= ?';
        args = [keyOrArray];
      } else {
        args = keyOrArray;
        sql += "IN (" +
          args.map(function(){return '?'}).join(',') +
          ")";
      }
      args = args.map(function(obj) {
        return obj.key ? obj.key : obj;
      });

      this.db.transaction( function (t) {
        t.executeSql(sql, args, win, fail);
      });

      return this;
    },

    nuke: function (cb) {
      var nuke = "DELETE FROM " + this.record
        ,   that = this
        ,   win  = cb ? function() { that.lambda(cb).call(that) } : function(){}
      this.db.transaction(function (t) {
        t.executeSql(nuke, [], win, fail)
      })
      return this
    }
//////
  }})());

//===================================================================================================

// FROM: http://stackoverflow.com/questions/979975/how-to-get-the-value-from-url-parameter
var getQueryParams = function( qs ){
  qs = qs.split( "+" ).join( " " );

  var params = {}, tokens,
    re = /[?&]?([^=]+)=([^&]*)/g;

  while(tokens = re.exec( qs )) {
    params[decodeURIComponent( tokens[1] )]
      = decodeURIComponent( tokens[2] );
  }

  return params;
};

//===================================================================================================

var callAsSequence = function(fns, callback) {
  if (fns.length === 0){
    if( callback ) return callback();
    else return;
  }

  var completed = 0;
  var cbFn = function(results) {
    if (++completed == fns.length) {
      if (callback) {
        callback();
      }
    } else {
      iterate();
    }
  };

  var iterate = function() {
    fns[completed](cbFn);
  };

  iterate();
};

//===================================================================================================

(function () {

  var xmlHttpReq;
  try {
    new XMLHttpRequest();
    xmlHttpReq = true;
  }
  // FALL BACK
  catch (ex) {
    xmlHttpReq = false;
  }

  function reqListener() {
    if (this.readyState == 4) {
      // FINE
      if (this.readyState == 4 && this.status == 200) {
        console.log("grabbed file successfully");

        // JSON OBJECT
        if (this.asJSON) {
          var arg;
          try {
            arg = JSON.parse(this.responseText);
          }
          // FAILED TO CONVERT JSON TEXT
          catch (e) {
            this.failCallback(e);
          }
          this.winCallback(arg);
        }
        // PLAIN TEXT
        else {
          this.winCallback(this.responseText);
        }
      }
      // ERROR
      else {
        console.log("could not grab file");
        this.failCallback(this.statusText);
      }
    }
  }

  window.grabRemoteFile = function (options) {
    var oReq;

    console.log("try to grab file "+options.path);

    // GENERATE REQUEST OBJECT
    if (xmlHttpReq) oReq = new XMLHttpRequest();
    else oReq = new ActiveXObject("Microsoft.XMLHTTP");

    // WIN / FAIL CALLBACK
    oReq.asJSON = options.json;
    oReq.winCallback = options.success;
    oReq.failCallback = options.error;

    // META DATA
    oReq.onreadystatechange = reqListener;
    oReq.open("get", options.path+"?_cwtR="+parseInt(10000*Math.random(),10), true);

    // SEND IT
    oReq.send();
  }
})();