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
    // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html

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



/**
 * DeviceDetection Class
 * @author Daniel Pötzinger
 * @author Darius Aukstinaitis
 */
DeviceDetection = function(ua) {
  /**
   * @type string the user agend string used (readonly)
   */
  this.ua;
  /**
   * @type object struct with common check results for performance
   */
  this.checks;
  /**
   * Constructor
   * @param string ua Optional the useragent string - if not given its retrieved from browser
   */
  this.construct = function(ua) {
    if (typeof ua == 'undefined') {
      var ua = navigator.userAgent;
    }
    this.ua = ua;
    // parse data
    this.checks = {
      iphone: Boolean(ua.match(/iPhone/)),
      ipod: Boolean(ua.match(/iPod/)),
      ipad: Boolean(ua.match(/iPad/)),
      blackberry: Boolean(ua.match(/BlackBerry/)),
      playbook: Boolean(ua.match(/PlayBook/)),
      android: Boolean(ua.match(/Android/)),
      macOS: Boolean(ua.match(/Mac OS X/)),
      win: Boolean(ua.match(/Windows/)),
      mac: Boolean(ua.match(/Macintosh/)),
      wphone: Boolean(ua.match(/(Windows Phone OS|Windows CE|Windows Mobile)/)),
      mobile: Boolean(ua.match(/Mobile/)),
      /* http://mojosunite.com/tablet-user-agent-strings */
      androidTablet: Boolean( ua.match(/(GT-P1000|SGH-T849|SHW-M180S)/) ),
      tabletPc: Boolean(ua.match(/Tablet PC/)),
      palmDevice: Boolean(ua.match(/(PalmOS|PalmSource| Pre\/)/)),
      kindle: Boolean(ua.match(/(Kindle)/)),
      otherMobileHints: Boolean(ua.match(/(Opera Mini|IEMobile|SonyEricsson|smartphone)/))
    };
  }

  this.isTouchDevice = function() {
    return this.checks.iphone || this.checks.ipod || this.checks.ipad;
  }

  this.isApple = function() {
    return this.checks.iphone || this.checks.ipod || this.checks.ipad || this.checks.macOS  || this.checks.mac;
  }

  this.isBlackberry = function() {
    return this.checks.blackberry;
  }

  this.isAndroid = function() {
    return this.checks.android;
  }

  this.isTablet = function() {
    return this.checks.ipad || this.checks.tabletPc || this.checks.playbook || this.checks.androidTablet || this.checks.kindle;
  }
  this.isDesktop = function() {
    return !this.isTouchDevice() && !this.isSmartPhone() && !this.isTablet()
  }
  this.isSmartPhone = function() {
    return (this.checks.mobile || this.checks.blackberry || this.checks.palmDevice || this.checks.otherMobileHints) && !this.isTablet() && !this.checks.ipod;
  }

  this.construct(ua);
};




/**
 * Browser detection based heavily on JQuery.browser implementation.
 */
var BrowserDetection = (function(){
  var userAgent = navigator.userAgent.toLowerCase();
  var result = {};

  // CHECK BROWSER
  var match = /(chrome)[ \/]([\w.]+)/.exec( userAgent ) ||
    /(webkit)[ \/]([\w.]+)/.exec( userAgent ) ||
    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( userAgent ) ||
    /(msie) ([\w.]+)/.exec( userAgent ) ||
    userAgent.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( userAgent ) ||
    [];

  // INJECT INFO
  if( match[1] ){
    result[ match[1] ] = true;
    result.version = match[2] || "0";
  }

  // CHROME IS WEBKIT, BUT WEBKIT IS ALSO SAFARI.
  if( result.chrome ){
    result.webkit = true;
    
    // CHECK FOR ANDROID
    if( userAgent.search(/android/) !== -1 ){
      result.android = true;
    }
  }
  else if ( result.webkit ) {
    result.safari = true;

    // CHECK VERSION
    var v = userAgent.match( /(version\/)([\w.]+)/ );
    if( v ){
      result.version = v[v.length-1];
    }

    // CHECK FOR IOS
    if( userAgent.search(/like mac os x/) !== -1 ){
      result.ios = true;
    }
  }

  return result;
})();
// javascript-astar
// http://github.com/bgrins/javascript-astar
// Freely distributable under the MIT License.
// Includes Binary Heap (with modifications) from Marijn Haverbeke. 
// http://eloquentjavascript.net/appendix2.html

// NOTE: MODIFIED WALL VALUE -> NOW -1

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
/*
 * Hammer.JS
 * version 0.6.1
 * author: Eight Media
 * https://github.com/EightMedia/hammer.js
 * Licensed under the MIT license.
 */
function Hammer(element, options, undefined)
{
  var self = this;

  var defaults = {
    // prevent the default event or not... might be buggy when false
    prevent_default    : false,
    css_hacks          : true,

    swipe              : true,
    swipe_time         : 200,   // ms
    swipe_min_distance : 20, // pixels

    drag               : true,
    drag_vertical      : true,
    drag_horizontal    : true,
    // minimum distance before the drag event starts
    drag_min_distance  : 20, // pixels

    // pinch zoom and rotation
    transform          : true,
    scale_treshold     : 0.1,
    rotation_treshold  : 15, // degrees

    tap                : true,
    tap_double         : true,
    tap_max_interval   : 300,
    tap_max_distance   : 10,
    tap_double_distance: 20,

    hold               : true,
    hold_timeout       : 500
  };
  options = mergeObject(defaults, options);

  // some css hacks
  (function() {
    if(!options.css_hacks) {
      return false;
    }

    var vendors = ['webkit','moz','ms','o',''];
    var css_props = {
      "userSelect": "none",
      "touchCallout": "none",
      "userDrag": "none",
      "tapHighlightColor": "rgba(0,0,0,0)"
    };

    var prop = '';
    for(var i = 0; i < vendors.length; i++) {
      for(var p in css_props) {
        prop = p;
        if(vendors[i]) {
          prop = vendors[i] + prop.substring(0, 1).toUpperCase() + prop.substring(1);
        }
        element.style[ prop ] = css_props[p];
      }
    }
  })();

  // holds the distance that has been moved
  var _distance = 0;

  // holds the exact angle that has been moved
  var _angle = 0;

  // holds the diraction that has been moved
  var _direction = 0;

  // holds position movement for sliding
  var _pos = { };

  // how many fingers are on the view
  var _fingers = 0;

  var _first = false;

  var _gesture = null;
  var _prev_gesture = null;

  var _touch_start_time = null;
  var _prev_tap_pos = {x: 0, y: 0};
  var _prev_tap_end_time = null;

  var _hold_timer = null;

  var _offset = {};

  // keep track of the mouse status
  var _mousedown = false;

  var _event_start;
  var _event_move;
  var _event_end;

  var _has_touch = ('ontouchstart' in window);


  /**
   * option setter/getter
   * @param   string  key
   * @param   mixed   value
   * @return  mixed   value
   */
  this.option = function(key, val) {
    if(val != undefined) {
      options[key] = val;
    }

    return options[key];
  };


  /**
   * angle to direction define
   * @param  float    angle
   * @return string   direction
   */
  this.getDirectionFromAngle = function( angle ) {
    var directions = {
      down: angle >= 45 && angle < 135, //90
      left: angle >= 135 || angle <= -135, //180
      up: angle < -45 && angle > -135, //270
      right: angle >= -45 && angle <= 45 //0
    };

    var direction, key;
    for(key in directions){
      if(directions[key]){
        direction = key;
        break;
      }
    }
    return direction;
  };


  /**
   * destory events
   * @return  void
   */
  this.destroy = function() {
    if(_has_touch) {
      removeEvent(element, "touchstart touchmove touchend touchcancel", handleEvents);
    }
    // for non-touch
    else {
      removeEvent(element, "mouseup mousedown mousemove", handleEvents);
      removeEvent(element, "mouseout", handleMouseOut);
    }
  };


  /**
   * count the number of fingers in the event
   * when no fingers are detected, one finger is returned (mouse pointer)
   * @param  event
   * @return int  fingers
   */
  function countFingers( event )
  {
    // there is a bug on android (until v4?) that touches is always 1,
    // so no multitouch is supported, e.g. no, zoom and rotation...
    return event.touches ? event.touches.length : 1;
  }


  /**
   * get the x and y positions from the event object
   * @param  event
   * @return array  [{ x: int, y: int }]
   */
  function getXYfromEvent( event )
  {
    event = event || window.event;

    // no touches, use the event pageX and pageY
    if(!_has_touch) {
      var doc = document,
        body = doc.body;

      return [{
        x: event.pageX || event.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && doc.clientLeft || 0 ),
        y: event.pageY || event.clientY + ( doc && doc.scrollTop || body && body.scrollTop || 0 ) - ( doc && doc.clientTop || body && doc.clientTop || 0 )
      }];
    }
    // multitouch, return array with positions
    else {
      var pos = [], src;
      for(var t=0, len=event.touches.length; t<len; t++) {
        src = event.touches[t];
        pos.push({ x: src.pageX, y: src.pageY });
      }
      return pos;
    }
  }


  /**
   * calculate the angle between two points
   * @param   object  pos1 { x: int, y: int }
   * @param   object  pos2 { x: int, y: int }
   */
  function getAngle( pos1, pos2 )
  {
    return Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x) * 180 / Math.PI;
  }


  /**
   * calculate the scale size between two fingers
   * @param   object  pos_start
   * @param   object  pos_move
   * @return  float   scale
   */
  function calculateScale(pos_start, pos_move)
  {
    if(pos_start.length == 2 && pos_move.length == 2) {
      var x, y;

      x = pos_start[0].x - pos_start[1].x;
      y = pos_start[0].y - pos_start[1].y;
      var start_distance = Math.sqrt((x*x) + (y*y));

      x = pos_move[0].x - pos_move[1].x;
      y = pos_move[0].y - pos_move[1].y;
      var end_distance = Math.sqrt((x*x) + (y*y));

      return end_distance / start_distance;
    }

    return 0;
  }


  /**
   * calculate the rotation degrees between two fingers
   * @param   object  pos_start
   * @param   object  pos_move
   * @return  float   rotation
   */
  function calculateRotation(pos_start, pos_move)
  {
    if(pos_start.length == 2 && pos_move.length == 2) {
      var x, y;

      x = pos_start[0].x - pos_start[1].x;
      y = pos_start[0].y - pos_start[1].y;
      var start_rotation = Math.atan2(y, x) * 180 / Math.PI;

      x = pos_move[0].x - pos_move[1].x;
      y = pos_move[0].y - pos_move[1].y;
      var end_rotation = Math.atan2(y, x) * 180 / Math.PI;

      return end_rotation - start_rotation;
    }

    return 0;
  }


  /**
   * trigger an event/callback by name with params
   * @param string name
   * @param array  params
   */
  function triggerEvent( eventName, params )
  {
    // return touches object
    params.touches = getXYfromEvent(params.originalEvent);
    params.type = eventName;

    // trigger callback
    if(isFunction(self["on"+ eventName])) {
      self["on"+ eventName].call(self, params);
    }
  }


  /**
   * cancel event
   * @param   object  event
   * @return  void
   */

  function cancelEvent(event)
  {
    event = event || window.event;
    if(event.preventDefault){
      event.preventDefault();
      event.stopPropagation();
    }else{
      event.returnValue = false;
      event.cancelBubble = true;
    }
  }


  /**
   * reset the internal vars to the start values
   */
  function reset()
  {
    _pos = {};
    _first = false;
    _fingers = 0;
    _distance = 0;
    _angle = 0;
    _gesture = null;
  }


  var gestures = {
    // hold gesture
    // fired on touchstart
    hold : function(event)
    {
      // only when one finger is on the view
      if(options.hold) {
        _gesture = 'hold';
        clearTimeout(_hold_timer);

        _hold_timer = setTimeout(function() {
          if(_gesture == 'hold') {
            triggerEvent("hold", {
              originalEvent   : event,
              position        : _pos.start
            });
          }
        }, options.hold_timeout);
      }
    },

    // swipe gesture
    // fired on touchend
    swipe : function(event)
    {
      if(!_pos.move) {
        return;
      }

      // get the distance we moved
      var _distance_x = _pos.move[0].x - _pos.start[0].x;
      var _distance_y = _pos.move[0].y - _pos.start[0].y;
      _distance = Math.sqrt(_distance_x*_distance_x + _distance_y*_distance_y);

      // compare the kind of gesture by time
      var now = new Date().getTime();
      var touch_time = now - _touch_start_time;

      if(options.swipe && (options.swipe_time > touch_time) && (_distance > options.swipe_min_distance)) {
        // calculate the angle
        _angle = getAngle(_pos.start[0], _pos.move[0]);
        _direction = self.getDirectionFromAngle(_angle);

        _gesture = 'swipe';

        var position = { x: _pos.move[0].x - _offset.left,
          y: _pos.move[0].y - _offset.top };

        var event_obj = {
          originalEvent   : event,
          position        : position,
          direction       : _direction,
          distance        : _distance,
          distanceX       : _distance_x,
          distanceY       : _distance_y,
          angle           : _angle
        };

        // normal slide event
        triggerEvent("swipe", event_obj);
      }
    },


    // drag gesture
    // fired on mousemove
    drag : function(event)
    {
      // get the distance we moved
      var _distance_x = _pos.move[0].x - _pos.start[0].x;
      var _distance_y = _pos.move[0].y - _pos.start[0].y;
      _distance = Math.sqrt(_distance_x * _distance_x + _distance_y * _distance_y);

      // drag
      // minimal movement required
      if(options.drag && (_distance > options.drag_min_distance) || _gesture == 'drag') {
        // calculate the angle
        _angle = getAngle(_pos.start[0], _pos.move[0]);
        _direction = self.getDirectionFromAngle(_angle);

        // check the movement and stop if we go in the wrong direction
        var is_vertical = (_direction == 'up' || _direction == 'down');
        if(((is_vertical && !options.drag_vertical) || (!is_vertical && !options.drag_horizontal))
          && (_distance > options.drag_min_distance)) {
          return;
        }

        _gesture = 'drag';

        var position = { x: _pos.move[0].x - _offset.left,
          y: _pos.move[0].y - _offset.top };

        var event_obj = {
          originalEvent   : event,
          position        : position,
          direction       : _direction,
          distance        : _distance,
          distanceX       : _distance_x,
          distanceY       : _distance_y,
          angle           : _angle
        };

        // on the first time trigger the start event
        if(_first) {
          triggerEvent("dragstart", event_obj);

          _first = false;
        }

        // normal slide event
        triggerEvent("drag", event_obj);

        cancelEvent(event);
      }
    },


    // transform gesture
    // fired on touchmove
    transform : function(event)
    {
      if(options.transform) {
        if(countFingers(event) != 2) {
          return false;
        }

        var rotation = calculateRotation(_pos.start, _pos.move);
        var scale = calculateScale(_pos.start, _pos.move);

        if(_gesture != 'drag' &&
          (_gesture == 'transform' || Math.abs(1-scale) > options.scale_treshold || Math.abs(rotation) > options.rotation_treshold)) {
          _gesture = 'transform';

          _pos.center = {  x: ((_pos.move[0].x + _pos.move[1].x) / 2) - _offset.left,
            y: ((_pos.move[0].y + _pos.move[1].y) / 2) - _offset.top };

          var event_obj = {
            originalEvent   : event,
            position        : _pos.center,
            scale           : scale,
            rotation        : rotation
          };

          // on the first time trigger the start event
          if(_first) {
            triggerEvent("transformstart", event_obj);
            _first = false;
          }

          triggerEvent("transform", event_obj);

          cancelEvent(event);

          return true;
        }
      }

      return false;
    },


    // tap and double tap gesture
    // fired on touchend
    tap : function(event)
    {
      // compare the kind of gesture by time
      var now = new Date().getTime();
      var touch_time = now - _touch_start_time;

      // dont fire when hold is fired
      if(options.hold && !(options.hold && options.hold_timeout > touch_time)) {
        return;
      }

      // when previous event was tap and the tap was max_interval ms ago
      var is_double_tap = (function(){
        if (_prev_tap_pos &&
          options.tap_double &&
          _prev_gesture == 'tap' &&
          (_touch_start_time - _prev_tap_end_time) < options.tap_max_interval)
        {
          var x_distance = Math.abs(_prev_tap_pos[0].x - _pos.start[0].x);
          var y_distance = Math.abs(_prev_tap_pos[0].y - _pos.start[0].y);
          return (_prev_tap_pos && _pos.start && Math.max(x_distance, y_distance) < options.tap_double_distance);
        }
        return false;
      })();

      if(is_double_tap) {
        _gesture = 'double_tap';
        _prev_tap_end_time = null;

        triggerEvent("doubletap", {
          originalEvent   : event,
          position        : _pos.start
        });
        cancelEvent(event);
      }

      // single tap is single touch
      else {
        var x_distance = (_pos.move) ? Math.abs(_pos.move[0].x - _pos.start[0].x) : 0;
        var y_distance =  (_pos.move) ? Math.abs(_pos.move[0].y - _pos.start[0].y) : 0;
        _distance = Math.max(x_distance, y_distance);

        if(_distance < options.tap_max_distance) {
          _gesture = 'tap';
          _prev_tap_end_time = now;
          _prev_tap_pos = _pos.start;

          if(options.tap) {
            triggerEvent("tap", {
              originalEvent   : event,
              position        : _pos.start
            });
            cancelEvent(event);
          }
        }
      }

    }

  };


  function handleEvents(event)
  {
    switch(event.type)
    {
      case 'mousedown':
      case 'touchstart':
        _pos.start = getXYfromEvent(event);
        _touch_start_time = new Date().getTime();
        _fingers = countFingers(event);
        _first = true;
        _event_start = event;

        // borrowed from jquery offset https://github.com/jquery/jquery/blob/master/src/offset.js
        var box = element.getBoundingClientRect();
        var clientTop  = element.clientTop  || document.body.clientTop  || 0;
        var clientLeft = element.clientLeft || document.body.clientLeft || 0;
        var scrollTop  = window.pageYOffset || element.scrollTop  || document.body.scrollTop;
        var scrollLeft = window.pageXOffset || element.scrollLeft || document.body.scrollLeft;

        _offset = {
          top: box.top + scrollTop - clientTop,
          left: box.left + scrollLeft - clientLeft
        };

        _mousedown = true;

        // hold gesture
        gestures.hold(event);

        if(options.prevent_default) {
          cancelEvent(event);
        }
        break;

      case 'mousemove':
      case 'touchmove':
        if(!_mousedown) {
          return false;
        }
        _event_move = event;
        _pos.move = getXYfromEvent(event);

        if(!gestures.transform(event)) {
          gestures.drag(event);
        }
        break;

      case 'mouseup':
      case 'mouseout':
      case 'touchcancel':
      case 'touchend':
        if(!_mousedown || (_gesture != 'transform' && event.touches && event.touches.length > 0)) {
          return false;
        }

        _mousedown = false;
        _event_end = event;


        // swipe gesture
        gestures.swipe(event);


        // drag gesture
        // dragstart is triggered, so dragend is possible
        if(_gesture == 'drag') {
          triggerEvent("dragend", {
            originalEvent   : event,
            direction       : _direction,
            distance        : _distance,
            angle           : _angle
          });
        }

        // transform
        // transformstart is triggered, so transformed is possible
        else if(_gesture == 'transform') {
          triggerEvent("transformend", {
            originalEvent   : event,
            position        : _pos.center,
            scale           : calculateScale(_pos.start, _pos.move),
            rotation        : calculateRotation(_pos.start, _pos.move)
          });
        }
        else {
          gestures.tap(_event_start);
        }

        _prev_gesture = _gesture;

        // trigger release event
        triggerEvent("release", {
          originalEvent   : event,
          gesture         : _gesture
        });

        // reset vars
        reset();
        break;
    }
  }


  function handleMouseOut(event) {
    if(!isInsideHammer(element, event.relatedTarget)) {
      handleEvents(event);
    }
  }


  // bind events for touch devices
  // except for windows phone 7.5, it doesnt support touch events..!
  if(_has_touch) {
    addEvent(element, "touchstart touchmove touchend touchcancel", handleEvents);
  }
  // for non-touch
  else {
    addEvent(element, "mouseup mousedown mousemove", handleEvents);
    addEvent(element, "mouseout", handleMouseOut);
  }


  /**
   * find if element is (inside) given parent element
   * @param   object  element
   * @param   object  parent
   * @return  bool    inside
   */
  function isInsideHammer(parent, child) {
    // get related target for IE
    if(!child && window.event && window.event.toElement){
      child = window.event.toElement;
    }

    if(parent === child){
      return true;
    }

    // loop over parentNodes of child until we find hammer element
    if(child){
      var node = child.parentNode;
      while(node !== null){
        if(node === parent){
          return true;
        };
        node = node.parentNode;
      }
    }
    return false;
  }


  /**
   * merge 2 objects into a new object
   * @param   object  obj1
   * @param   object  obj2
   * @return  object  merged object
   */
  function mergeObject(obj1, obj2) {
    var output = {};

    if(!obj2) {
      return obj1;
    }

    for (var prop in obj1) {
      if (prop in obj2) {
        output[prop] = obj2[prop];
      } else {
        output[prop] = obj1[prop];
      }
    }
    return output;
  }


  /**
   * check if object is a function
   * @param   object  obj
   * @return  bool    is function
   */
  function isFunction( obj ){
    return Object.prototype.toString.call( obj ) == "[object Function]";
  }


  /**
   * attach event
   * @param   node    element
   * @param   string  types
   * @param   object  callback
   */
  function addEvent(element, types, callback) {
    types = types.split(" ");
    for(var t= 0,len=types.length; t<len; t++) {
      if(element.addEventListener){
        element.addEventListener(types[t], callback, false);
      }
      else if(document.attachEvent){
        element.attachEvent("on"+ types[t], callback);
      }
    }
  }


  /**
   * detach event
   * @param   node    element
   * @param   string  types
   * @param   object  callback
   */
  function removeEvent(element, types, callback) {
    types = types.split(" ");
    for(var t= 0,len=types.length; t<len; t++) {
      if(element.removeEventListener){
        element.removeEventListener(types[t], callback, false);
      }
      else if(document.detachEvent){
        element.detachEvent("on"+ types[t], callback);
      }
    }
  }
}
(function(b,p){function e(g){l[l.length]=g}function q(g){j.className=j.className.replace(RegExp("\\b"+g+"\\b"),"")}function m(g,c){for(var b=0,a=g.length;b<a;b++)c.call(g,g[b],b)}function r(){j.className=j.className.replace(/ (w-|eq-|gt-|gte-|lt-|lte-|portrait|no-portrait|landscape|no-landscape)\d+/g,"");var g=b.innerWidth||j.clientWidth,a=b.outerWidth||b.screen.width;d.screen.innerWidth=g;d.screen.outerWidth=a;e("w-"+g);m(c.screens,function(a){g>a?(c.screensCss.gt&&e("gt-"+a),c.screensCss.gte&&e("gte-"+
a)):g<a?(c.screensCss.lt&&e("lt-"+a),c.screensCss.lte&&e("lte-"+a)):g===a&&(c.screensCss.lte&&e("lte-"+a),c.screensCss.eq&&e("e-q"+a),c.screensCss.gte&&e("gte-"+a))});var a=b.innerHeight||j.clientHeight,f=b.outerHeight||b.screen.height;d.screen.innerHeight=a;d.screen.outerHeight=f;d.feature("portrait",a>g);d.feature("landscape",a<g)}function s(){b.clearTimeout(t);t=b.setTimeout(r,100)}var n=b.document,f=b.navigator,u=b.location,j=n.documentElement,l=[],c={screens:[240,320,480,640,768,800,1024,1280,
1440,1680,1920],screensCss:{gt:!0,gte:!1,lt:!0,lte:!1,eq:!1},browsers:[{ie:{min:6,max:10}}],browserCss:{gt:!0,gte:!1,lt:!0,lte:!1,eq:!0},section:"-section",page:"-page",head:"head"};if(b.head_conf)for(var a in b.head_conf)b.head_conf[a]!==p&&(c[a]=b.head_conf[a]);var d=b[c.head]=function(){d.ready.apply(null,arguments)};d.feature=function(a,b,c){if(!a)return j.className+=" "+l.join(" "),l=[],d;"[object Function]"===Object.prototype.toString.call(b)&&(b=b.call());e((b?"":"no-")+a);d[a]=!!b;c||(q("no-"+
a),q(a),d.feature());return d};d.feature("js",!0);a=f.userAgent.toLowerCase();f=/mobile|midp/.test(a);d.feature("mobile",f,!0);d.feature("desktop",!f,!0);a=/(chrome|firefox)[ \/]([\w.]+)/.exec(a)||/(iphone|ipad|ipod)(?:.*version)?[ \/]([\w.]+)/.exec(a)||/(android)(?:.*version)?[ \/]([\w.]+)/.exec(a)||/(webkit|opera)(?:.*version)?[ \/]([\w.]+)/.exec(a)||/(msie) ([\w.]+)/.exec(a)||[];f=a[1];a=parseFloat(a[2]);switch(f){case "msie":f="ie";a=n.documentMode||a;break;case "firefox":f="ff";break;case "ipod":case "ipad":case "iphone":f=
"ios";break;case "webkit":f="safari"}d.browser={name:f,version:a};d.browser[f]=!0;for(var k=0,v=c.browsers.length;k<v;k++)for(var h in c.browsers[k])if(f===h){e(h);for(var w=c.browsers[k][h].max,i=c.browsers[k][h].min;i<=w;i++)a>i?(c.browserCss.gt&&e("gt-"+h+i),c.browserCss.gte&&e("gte-"+h+i)):a<i?(c.browserCss.lt&&e("lt-"+h+i),c.browserCss.lte&&e("lte-"+h+i)):a===i&&(c.browserCss.lte&&e("lte-"+h+i),c.browserCss.eq&&e("eq-"+h+i),c.browserCss.gte&&e("gte-"+h+i))}else e("no-"+h);"ie"===f&&9>a&&m("abbr article aside audio canvas details figcaption figure footer header hgroup mark meter nav output progress section summary time video".split(" "),
function(a){n.createElement(a)});m(u.pathname.split("/"),function(a,b){if(2<this.length&&this[b+1]!==p)b&&e(this.slice(1,b+1).join("-").toLowerCase()+c.section);else{var d=a||"index",f=d.indexOf(".");0<f&&(d=d.substring(0,f));j.id=d.toLowerCase()+c.page;b||e("root"+c.section)}});d.screen={height:b.screen.height,width:b.screen.width};r();var t=0;b.addEventListener?b.addEventListener("resize",s,!1):b.attachEvent("onresize",s)})(window);
// is.js 1.2 ~ Copyright (c) 2012 Cedrik Boudreau
// http://isjs.quipoapps.com
if(!Array.prototype.forEach){Array.prototype.forEach=function(a){var b=this.length;if(typeof a!="function")throw new TypeError();var c=arguments[1];for(var i=0;i<b;i++){if(i in this)a.call(c,this[i],i,this)}}}var is=(function(){var e=Object,proto=e.prototype,ua=(window.navigator&&navigator.userAgent)||"",av=(window.navigator&&navigator.appVersion)||"",dateP=Date.prototype,isClass=function(a,b){return proto.toString.call(a)==='[object '+b+']'},extend=function(b,c){Array.prototype.slice.call(arguments,1).forEach(function(a){for(key in a)b[key]=a[key]});return b},each=function(a,b){var i,key;if(typeof a==='array')for(i=0;i<a.length;i++){if(b.call(a[i],i,a[i])===false)return a}else for(key in a){if(b.call(a[key],key,a[key])===false)return a}return a},methods={};each(['Object','Array','Boolean','Date','Function','Number','String','RegExp'],function(i,a){methods['is'+a]=function(){return isClass(this,a)}});extend(methods,{isInteger:function(){return this%1===0},isFloat:function(){return!this.isInteger()},isOdd:function(){return!this.isMultipleOf(2)},isEven:function(){return this.isMultipleOf(2)},isMultipleOf:function(a){return this%a===0},isNaN:function(){return!this.isNumber()},isEmpty:function(){if(this==null||typeof this!='object')return!(this&&this.length>0);return e.keys(this).length==0},isSameType:function(a){return proto.toString.call(this)===proto.toString.call(a)},isOwnProperty:function(a){return proto.hasOwnProperty.call(this,a)},isType:function(a){return isClass(this,a)},isBlank:function(){return this.trim().length===0}});extend(dateP,{isPast:function(){return this.getTime()<new date().getTime()},isFuture:function(){return this.getTime()>new date().getTime()},isWeekday:function(){return this.getUTCDay()>0&&this.getUTCDay()<6},isWeekend:function(){return this.getUTCDay()===0||this.getUTCDay()===6},isBefore:function(d){return this.getTime()<d.getTime()},isAfter:function(d){return this.getTime()>d.getTime()},isLeapYear:function(){var a=this.getFullYear();return(a%4===0&&a%100!==0)||(a%400===0)},isValid:function(){return!this.getTime().isNaN()}});extend(proto,methods);return{ie:function(){return(/msie/i).test(ua)},ie6:function(){return(/msie 6/i).test(ua)},ie7:function(){return(/msie 7/i).test(ua)},ie8:function(){return(/msie 8/i).test(ua)},ie9:function(){return(/msie 9/i).test(ua)},firefox:function(){return(/firefox/i).test(ua)},gecko:function(){return(/gecko/i).test(ua)},opera:function(){return(/opera/i).test(ua)},safari:function(){return(/webkit\W(?!.*chrome).*safari\W/i).test(ua)},chrome:function(){return(/webkit\W.*(chrome|chromium)\W/i).test(ua)},webkit:function(){return(/webkit\W/i).test(ua)},mobile:function(){return(/iphone|ipod|(android.*?mobile)|blackberry|nokia/i).test(ua)},tablet:function(){return(/ipad|android(?!.*mobile)/i).test(ua)},desktop:function(){return!this.mobile()&&!this.tablet()},kindle:function(){return(/kindle|silk/i).test(ua)},tv:function(){return(/googletv|sonydtv/i).test(ua)},online:function(){return(navigator.onLine)},offline:function(){return!this.online()},windows:function(){return(/win/i).test(av)},mac:function(){return(/mac/i).test(av)},unix:function(){return(/x11/i).test(av)},linux:function(){return(/linux/i).test(av)}}})();
/**
* SoundJS
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2011 gskinner.com, inc.
* 
* Distributed under the terms of the MIT license.
* http://www.opensource.org/licenses/mit-license.html
*
* This notice shall be included in all copies or substantial portions of the Software.
**/
this.createjs=this.createjs||{};
(function(){var a=function(){this.initialize()},d=a.prototype;a.initialize=function(a){a.addEventListener=d.addEventListener;a.removeEventListener=d.removeEventListener;a.removeAllEventListeners=d.removeAllEventListeners;a.hasEventListener=d.hasEventListener;a.dispatchEvent=d.dispatchEvent};d._listeners=null;d.initialize=function(){};d.addEventListener=function(a,c){var b=this._listeners;b?this.removeEventListener(a,c):b=this._listeners={};var e=b[a];e||(e=b[a]=[]);e.push(c);return c};d.removeEventListener=
function(a,c){var b=this._listeners;if(b){var e=b[a];if(e)for(var k=0,f=e.length;k<f;k++)if(e[k]==c){1==f?delete b[a]:e.splice(k,1);break}}};d.removeAllEventListeners=function(a){a?this._listeners&&delete this._listeners[a]:this._listeners=null};d.dispatchEvent=function(a,c){var b=!1,e=this._listeners;if(a&&e){"string"==typeof a&&(a={type:a});a.target=c||this;e=e[a.type];if(!e)return b;for(var e=e.slice(),k=0,f=e.length;k<f;k++){var g=e[k];g instanceof Function?b=b||g.apply(null,[a]):g.handleEvent&&
(b=b||g.handleEvent(a))}}return!!b};d.hasEventListener=function(a){var c=this._listeners;return!(!c||!c[a])};d.toString=function(){return"[EventDispatcher]"};createjs.EventDispatcher=a})();this.createjs=this.createjs||{};
(function(){function a(){throw"Sound cannot be instantiated";}function d(b,a){this.init(b,a)}function l(){}a.DELIMITER="|";a.AUDIO_TIMEOUT=8E3;a.INTERRUPT_ANY="any";a.INTERRUPT_EARLY="early";a.INTERRUPT_LATE="late";a.INTERRUPT_NONE="none";a.PLAY_INITED="playInited";a.PLAY_SUCCEEDED="playSucceeded";a.PLAY_INTERRUPTED="playInterrupted";a.PLAY_FINISHED="playFinished";a.PLAY_FAILED="playFailed";a.SUPPORTED_EXTENSIONS="mp3 ogg mpeg wav m4a mp4 aiff wma mid".split(" ");a.EXTENSION_MAP={m4a:"mp4"};a.FILE_PATTERN=
/(\w+:\/{2})?((?:\w+\.){2}\w+)?(\/?[\S]+\/|\/)?([\w\-%\.]+)(?:\.)(\w+)?(\?\S+)?/i;a.defaultInterruptBehavior=a.INTERRUPT_NONE;a.lastId=0;a.activePlugin=null;a.pluginsRegistered=!1;a.masterVolume=1;a.masterMute=!1;a.instances=[];a.idHash={};a.preloadHash={};a.defaultSoundInstance=null;a.addEventListener=null;a.removeEventListener=null;a.removeAllEventListeners=null;a.dispatchEvent=null;a.hasEventListener=null;a._listeners=null;createjs.EventDispatcher.initialize(a);a.onLoadComplete=null;a.sendLoadComplete=
function(b){if(a.preloadHash[b])for(var e=0,c=a.preloadHash[b].length;e<c;e++){var f=a.preloadHash[b][e],f={target:this,type:"loadComplete",src:f.src,id:f.id,data:f.data};a.preloadHash[b][e]=!0;a.onLoadComplete&&a.onLoadComplete(f);a.dispatchEvent(f)}};a.getPreloadHandlers=function(){return{callback:createjs.proxy(a.initLoad,a),types:["sound"],extensions:a.SUPPORTED_EXTENSIONS}};a.registerPlugin=function(b){a.pluginsRegistered=!0;return null==b?!1:b.isSupported()?(a.activePlugin=new b,!0):!1};a.registerPlugins=
function(b){for(var e=0,c=b.length;e<c;e++)if(a.registerPlugin(b[e]))return!0;return!1};a.initializeDefaultPlugins=function(){return null!=a.activePlugin?!0:a.pluginsRegistered?!1:a.registerPlugins([createjs.WebAudioPlugin,createjs.HTMLAudioPlugin])?!0:!1};a.isReady=function(){return null!=a.activePlugin};a.getCapabilities=function(){return null==a.activePlugin?null:a.activePlugin.capabilities};a.getCapability=function(b){return null==a.activePlugin?null:a.activePlugin.capabilities[b]};a.initLoad=
function(b,e,c,f){b=a.registerSound(b,c,f,!1);return null==b?!1:b};a.registerSound=function(b,e,c,f){if(!a.initializeDefaultPlugins())return!1;b instanceof Object&&(b=b.src,e=b.id,c=b.data);var g=a.parsePath(b,"sound",e,c);if(null==g)return!1;null!=e&&(a.idHash[e]=g.src);var j=null;null!=c&&(isNaN(c.channels)?isNaN(c)||(j=parseInt(c)):j=parseInt(c.channels));var h=a.activePlugin.register(g.src,j);null!=h&&(null!=h.numChannels&&(j=h.numChannels),d.create(g.src,j),null==c||!isNaN(c)?c=g.data=j||d.maxPerChannel():
c.channels=g.data.channels=j||d.maxPerChannel(),null!=h.tag?g.tag=h.tag:h.src&&(g.src=h.src),null!=h.completeHandler&&(g.completeHandler=h.completeHandler),g.type=h.type);!1!=f&&(a.preloadHash[g.src]||(a.preloadHash[g.src]=[]),a.preloadHash[g.src].push({src:b,id:e,data:c}),1==a.preloadHash[g.src].length&&a.activePlugin.preload(g.src,h));return g};a.registerManifest=function(b){for(var a=[],c=0,f=b.length;c<f;c++)a[c]=createjs.Sound.registerSound(b[c].src,b[c].id,b[c].data,b[c].preload);return a};
a.loadComplete=function(b){var e=a.parsePath(b,"sound");b=e?a.getSrcById(e.src):a.getSrcById(b);return!0==a.preloadHash[b][0]};a.parsePath=function(b,e,c,f){"string"!=typeof b&&(b=b.toString());b=b.split(a.DELIMITER);e={type:e||"sound",id:c,data:f};c=a.getCapabilities();f=0;for(var g=b.length;f<g;f++){var d=b[f],h=d.match(a.FILE_PATTERN);if(null==h)return!1;var l=h[4],h=h[5];if(c[h]&&-1<a.SUPPORTED_EXTENSIONS.indexOf(h))return e.name=l,e.src=d,e.extension=h,e}return null};a.play=function(b,e,c,f,
g,d,h){b=a.createInstance(b);a.playInstance(b,e,c,f,g,d,h)||b.playFailed();return b};a.createInstance=function(b){if(!a.initializeDefaultPlugins())return a.defaultSoundInstance;var e=a.parsePath(b,"sound");b=e?a.getSrcById(e.src):a.getSrcById(b);var e=b.lastIndexOf("."),c=b.slice(e+1);-1!=e&&-1<a.SUPPORTED_EXTENSIONS.indexOf(c)?(d.create(b),b=a.activePlugin.create(b)):b=a.defaultSoundInstance;b.uniqueId=a.lastId++;return b};a.setVolume=function(b){if(null==Number(b))return!1;b=Math.max(0,Math.min(1,
b));a.masterVolume=b;if(!this.activePlugin||!this.activePlugin.setVolume||!this.activePlugin.setVolume(b))for(var e=this.instances,c=0,f=e.length;c<f;c++)e[c].setMasterVolume(b)};a.getVolume=function(){return a.masterVolume};a.mute=function(b){this.masterMute=b;if(!this.activePlugin||!this.activePlugin.setMute||!this.activePlugin.setMute(b))for(var a=this.instances,c=0,f=a.length;c<f;c++)a[c].setMasterMute(b)};a.setMute=function(b){if(null==b||void 0==b)return!1;this.masterMute=b;if(!this.activePlugin||
!this.activePlugin.setMute||!this.activePlugin.setMute(b))for(var a=this.instances,c=0,f=a.length;c<f;c++)a[c].setMasterMute(b);return!0};a.getMute=function(){return this.masterMute};a.stop=function(){for(var b=this.instances,a=b.length;0<a;a--)b[a-1].stop()};a.playInstance=function(b,c,k,f,g,d,h){c=c||a.defaultInterruptBehavior;null==k&&(k=0);null==f&&(f=b.getPosition());null==g&&(g=0);null==d&&(d=b.getVolume());null==h&&(h=b.getPan());if(0==k){if(!a.beginPlaying(b,c,f,g,d,h))return!1}else k=setTimeout(function(){a.beginPlaying(b,
c,f,g,d,h)},k),b.delayTimeoutId=k;this.instances.push(b);return!0};a.beginPlaying=function(b,a,c,f,g,j){return!d.add(b,a)?!1:!b.beginPlaying(c,f,g,j)?(b=this.instances.indexOf(b),-1<b&&this.instances.splice(b,1),!1):!0};a.getSrcById=function(b){return null==a.idHash||null==a.idHash[b]?b:a.idHash[b]};a.playFinished=function(b){d.remove(b);b=this.instances.indexOf(b);-1<b&&this.instances.splice(b,1)};a.proxy=function(b,a){return function(){return b.apply(a,arguments)}};createjs.Sound=a;createjs.proxy=
function(b,a){var c=Array.prototype.slice.call(arguments,2);return function(){return b.apply(a,Array.prototype.slice.call(arguments,0).concat(c))}};d.channels={};d.create=function(b,a){return null==d.get(b)?(d.channels[b]=new d(b,a),!0):!1};d.add=function(b,a){var c=d.get(b.src);return null==c?!1:c.add(b,a)};d.remove=function(b){var a=d.get(b.src);if(null==a)return!1;a.remove(b);return!0};d.maxPerChannel=function(){return c.maxDefault};d.get=function(b){return d.channels[b]};var c=d.prototype={src:null,
max:null,maxDefault:100,length:0,init:function(b,a){this.src=b;this.max=a||this.maxDefault;-1==this.max&&this.max==this.maxDefault;this.instances=[]},get:function(b){return this.instances[b]},add:function(b,a){if(!this.getSlot(a,b))return!1;this.instances.push(b);this.length++;return!0},remove:function(b){b=this.instances.indexOf(b);if(-1==b)return!1;this.instances.splice(b,1);this.length--;return!0},getSlot:function(b){for(var c,d,f=0,g=this.max;f<g;f++){c=this.get(f);if(null==c)return!0;if(!(b==
a.INTERRUPT_NONE&&c.playState!=a.PLAY_FINISHED))if(0==f)d=c;else if(c.playState==a.PLAY_FINISHED||c==a.PLAY_INTERRUPTED||c==a.PLAY_FAILED)d=c;else if(b==a.INTERRUPT_EARLY&&c.getPosition()<d.getPosition()||b==a.INTERRUPT_LATE&&c.getPosition()>d.getPosition())d=c}return null!=d?(d.interrupt(),this.remove(d),!0):!1},toString:function(){return"[Sound SoundChannel]"}};a.defaultSoundInstance=new function(){this.isDefault=!0;this.addEventListener=this.removeEventListener=this.removeAllEventListener=this.dispatchEvent=
this.hasEventListener=this._listeners=this.interrupt=this.playFailed=this.pause=this.resume=this.play=this.beginPlaying=this.cleanUp=this.stop=this.setMasterVolume=this.setVolume=this.mute=this.setMute=this.getMute=this.setPan=this.getPosition=this.setPosition=function(){return!1};this.getVolume=this.getPan=this.getDuration=function(){return 0};this.playState=a.PLAY_FAILED;this.toString=function(){return"[Sound Default Sound Instance]"}};l.init=function(){var b=navigator.userAgent;l.isFirefox=-1<
b.indexOf("Firefox");l.isOpera=null!=window.opera;l.isChrome=-1<b.indexOf("Chrome");l.isIOS=-1<b.indexOf("iPod")||-1<b.indexOf("iPhone")||-1<b.indexOf("iPad");l.isAndroid=-1<b.indexOf("Android");l.isBlackberry=-1<b.indexOf("Blackberry")};l.init();createjs.Sound.BrowserDetect=l})();this.createjs=this.createjs||{};
(function(){function a(){this.init()}function d(a,b){this.init(a,b)}function l(a,b){this.init(a,b)}a.capabilities=null;a.isSupported=function(){if("file:"==location.protocol)return!1;a.generateCapabilities();return null==a.context?!1:!0};a.generateCapabilities=function(){if(null==a.capabilities){var c=document.createElement("audio");if(null==c.canPlayType)return null;if(window.webkitAudioContext)a.context=new webkitAudioContext;else if(window.AudioContext)a.context=new AudioContext;else return null;
a.capabilities={panning:!0,volume:!0,tracks:-1};for(var b=createjs.Sound.SUPPORTED_EXTENSIONS,e=createjs.Sound.EXTENSION_MAP,d=0,f=b.length;d<f;d++){var g=b[d],j=e[g]||g;a.capabilities[g]="no"!=c.canPlayType("audio/"+g)&&""!=c.canPlayType("audio/"+g)||"no"!=c.canPlayType("audio/"+j)&&""!=c.canPlayType("audio/"+j)}2>a.context.destination.numberOfChannels&&(a.capabilities.panning=!1);a.dynamicsCompressorNode=a.context.createDynamicsCompressor();a.dynamicsCompressorNode.connect(a.context.destination);
a.gainNode=a.context.createGainNode();a.gainNode.connect(a.dynamicsCompressorNode)}};a.prototype={capabilities:null,volume:1,context:null,dynamicsCompressorNode:null,gainNode:null,arrayBuffers:null,init:function(){this.capabilities=a.capabilities;this.arrayBuffers={};this.context=a.context;this.gainNode=a.gainNode;this.dynamicsCompressorNode=a.dynamicsCompressorNode},register:function(a){this.arrayBuffers[a]=!0;return{tag:new l(a,this)}},isPreloadStarted:function(a){return null!=this.arrayBuffers[a]},
isPreloadComplete:function(a){return!(null==this.arrayBuffers[a]||!0==this.arrayBuffers[a])},removeFromPreload:function(a){delete this.arrayBuffers[a]},addPreloadResults:function(a,b){this.arrayBuffers[a]=b},handlePreloadComplete:function(){createjs.Sound.sendLoadComplete(this.src)},preload:function(a){this.arrayBuffers[a]=!0;a=new l(a,this);a.onload=this.handlePreloadComplete;a.load()},create:function(a){this.isPreloadStarted(a)||this.preload(a);return new d(a,this)},setVolume:function(a){this.volume=
a;this.updateVolume();return!0},updateVolume:function(){var a=createjs.Sound.masterMute?0:this.volume;a!=this.gainNode.gain.value&&(this.gainNode.gain.value=a)},getVolume:function(){return this.volume},setMute:function(){this.updateVolume();return!0},toString:function(){return"[WebAudioPlugin]"}};createjs.WebAudioPlugin=a;d.prototype={src:null,uniqueId:-1,playState:null,owner:null,offset:0,delay:0,volume:1,pan:0,duration:0,remainingLoops:0,delayTimeoutId:null,soundCompleteTimeout:null,panNode:null,
gainNode:null,sourceNode:null,muted:!1,paused:!1,startTime:0,addEventListener:null,removeEventListener:null,removeAllEventListeners:null,dispatchEvent:null,hasEventListener:null,_listeners:null,endedHandler:null,readyHandler:null,stalledHandler:null,onReady:null,onPlaySucceeded:null,onPlayInterrupted:null,onPlayFailed:null,onComplete:null,onLoop:null,sendEvent:function(a){this.dispatchEvent({target:this,type:a})},init:function(a,b){this.owner=b;this.src=a;this.panNode=this.owner.context.createPanner();
this.gainNode=this.owner.context.createGainNode();this.gainNode.connect(this.panNode);this.owner.isPreloadComplete(this.src)&&(this.duration=1E3*this.owner.arrayBuffers[this.src].duration);this.endedHandler=createjs.proxy(this.handleSoundComplete,this);this.readyHandler=createjs.proxy(this.handleSoundReady,this);this.stalledHandler=createjs.proxy(this.handleSoundStalled,this)},cleanUp:function(){this.sourceNode&&this.sourceNode.playbackState!=this.sourceNode.UNSCHEDULED_STATE&&(this.sourceNode.noteOff(0),
this.sourceNode=null);0!=this.panNode.numberOfOutputs&&this.panNode.disconnect(0);clearTimeout(this.delayTimeoutId);clearTimeout(this.soundCompleteTimeout);null!=window.createjs&&createjs.Sound.playFinished(this)},interrupt:function(){this.playState=createjs.Sound.PLAY_INTERRUPTED;if(this.onPlayInterrupted)this.onPlayInterrupted(this);this.sendEvent("interrupted");this.cleanUp();this.paused=!1},handleSoundStalled:function(){if(null!=this.onPlayFailed)this.onPlayFailed(this);this.sendEvent("failed")},
handleSoundReady:function(){null!=window.createjs&&(this.offset>this.getDuration()?this.playFailed():(0>this.offset&&(this.offset=0),this.playState=createjs.Sound.PLAY_SUCCEEDED,this.paused=!1,this.panNode.connect(this.owner.gainNode),this.sourceNode=this.owner.context.createBufferSource(),this.sourceNode.buffer=this.owner.arrayBuffers[this.src],this.duration=1E3*this.owner.arrayBuffers[this.src].duration,this.sourceNode.connect(this.gainNode),this.soundCompleteTimeout=setTimeout(this.endedHandler,
1E3*(this.sourceNode.buffer.duration-this.offset)),this.startTime=this.owner.context.currentTime-this.offset,this.sourceNode.noteGrainOn(0,this.offset,this.sourceNode.buffer.duration-this.offset)))},play:function(a,b,e,d,f,g){this.cleanUp();createjs.Sound.playInstance(this,a,b,e,d,f,g)},beginPlaying:function(a,b,e,d){if(null!=window.createjs&&this.src){this.offset=a/1E3;this.remainingLoops=b;this.setVolume(e);this.setPan(d);if(this.owner.isPreloadComplete(this.src))return this.handleSoundReady(null),
this.onPlaySucceeded&&this.onPlaySucceeded(this),this.sendEvent("succeeded"),1;this.playFailed()}},pause:function(){return!this.paused&&this.playState==createjs.Sound.PLAY_SUCCEEDED?(this.paused=!0,this.offset=this.owner.context.currentTime-this.startTime,this.sourceNode.noteOff(0),0!=this.panNode.numberOfOutputs&&this.panNode.disconnect(),clearTimeout(this.delayTimeoutId),clearTimeout(this.soundCompleteTimeout),!0):!1},resume:function(){if(!this.paused)return!1;this.handleSoundReady(null);return!0},
stop:function(){this.playState=createjs.Sound.PLAY_FINISHED;this.cleanUp();this.offset=0;return!0},setVolume:function(a){if(null==Number(a))return!1;this.volume=a=Math.max(0,Math.min(1,a));this.updateVolume();return!0},updateVolume:function(){var a=this.muted?0:this.volume;return a!=this.gainNode.gain.value?(this.gainNode.gain.value=a,!0):!1},getVolume:function(){return this.volume},mute:function(a){this.muted=a;this.updateVolume();return!0},setMute:function(a){if(null==a||void 0==a)return!1;this.muted=
a;this.updateVolume();return!0},getMute:function(){return this.muted},setPan:function(a){if(this.owner.capabilities.panning)this.panNode.setPosition(a,0,-0.5),this.pan=a;else return!1},getPan:function(){return this.pan},getPosition:function(){return 1E3*(this.paused||null==this.sourceNode?this.offset:this.owner.context.currentTime-this.startTime)},setPosition:function(a){this.offset=a/1E3;this.sourceNode&&this.sourceNode.playbackState!=this.sourceNode.UNSCHEDULED_STATE&&(this.sourceNode.noteOff(0),
clearTimeout(this.soundCompleteTimeout));!this.paused&&this.playState==createjs.Sound.PLAY_SUCCEEDED&&this.handleSoundReady(null);return!0},getDuration:function(){return this.duration},handleSoundComplete:function(){this.offset=0;if(0!=this.remainingLoops){this.remainingLoops--;this.handleSoundReady(null);if(null!=this.onLoop)this.onLoop(this);this.sendEvent("loop")}else if(null!=window.createjs){this.playState=createjs.Sound.PLAY_FINISHED;if(null!=this.onComplete)this.onComplete(this);this.sendEvent("complete");
this.cleanUp()}},playFailed:function(){if(null!=window.createjs){this.playState=createjs.Sound.PLAY_FAILED;if(null!=this.onPlayFailed)this.onPlayFailed(this);this.sendEvent("failed");this.cleanUp()}},toString:function(){return"[WebAudioPlugin SoundInstance]"}};createjs.EventDispatcher.initialize(d.prototype);l.prototype={request:null,owner:null,progress:-1,src:null,result:null,onload:null,onprogress:null,onError:null,init:function(a,b){this.src=a;this.owner=b},load:function(a){null!=a&&(this.src=
a);this.request=new XMLHttpRequest;this.request.open("GET",this.src,!0);this.request.responseType="arraybuffer";this.request.onload=createjs.proxy(this.handleLoad,this);this.request.onError=createjs.proxy(this.handleError,this);this.request.onprogress=createjs.proxy(this.handleProgress,this);this.request.send()},handleProgress:function(a,b){this.progress=a/b;if(null!=this.onprogress)this.onprogress({loaded:a,total:b,progress:this.progress})},handleLoad:function(){a.context.decodeAudioData(this.request.response,
createjs.proxy(this.handleAudioDecoded,this),createjs.proxy(this.handleError,this))},handleAudioDecoded:function(a){this.progress=1;this.result=a;this.owner.addPreloadResults(this.src,this.result);this.onload&&this.onload()},handleError:function(a){this.owner.removeFromPreload(this.src);this.onerror&&this.onerror(a)},toString:function(){return"[WebAudioPlugin WebAudioLoader]"}}})();this.createjs=this.createjs||{};
(function(){function a(){this.init()}function d(a,c){this.init(a,c)}function l(a,c){this.init(a,c)}function c(a){this.init(a)}a.MAX_INSTANCES=30;a.capabilities=null;a.AUDIO_READY="canplaythrough";a.AUDIO_ENDED="ended";a.AUDIO_ERROR="error";a.AUDIO_STALLED="stalled";a.isSupported=function(){if(createjs.Sound.BrowserDetect.isIOS)return!1;a.generateCapabilities();return null==a.tag||null==a.capabilities?!1:!0};a.generateCapabilities=function(){if(null==a.capabilities){var b=a.tag=document.createElement("audio");
if(null==b.canPlayType)return null;a.capabilities={panning:!0,volume:!0,tracks:-1};for(var c=createjs.Sound.SUPPORTED_EXTENSIONS,d=createjs.Sound.EXTENSION_MAP,f=0,g=c.length;f<g;f++){var j=c[f],h=d[j]||j;a.capabilities[j]="no"!=b.canPlayType("audio/"+j)&&""!=b.canPlayType("audio/"+j)||"no"!=b.canPlayType("audio/"+h)&&""!=b.canPlayType("audio/"+h)}}};a.prototype={capabilities:null,audioSources:null,defaultNumChannels:2,init:function(){this.capabilities=a.capabilities;this.audioSources={}},register:function(a,
e){this.audioSources[a]=!0;for(var d=c.get(a),f=null,g=e||this.defaultNumChannels,j=0;j<g;j++)f=this.createTag(a),d.add(f);return{tag:f,numChannels:g}},createTag:function(a){var c=document.createElement("audio");c.autoplay=!1;c.preload="none";c.src=a;return c},create:function(a){if(!this.isPreloadStarted(a)){var e=c.get(a),k=this.createTag(a);e.add(k);this.preload(a,{tag:k})}return new d(a,this)},isPreloadStarted:function(a){return null!=this.audioSources[a]},preload:function(a,c){this.audioSources[a]=
!0;new l(a,c.tag)},toString:function(){return"[HTMLAudioPlugin]"}};createjs.HTMLAudioPlugin=a;d.prototype={src:null,uniqueId:-1,playState:null,owner:null,loaded:!1,offset:0,delay:0,volume:1,pan:0,duration:0,remainingLoops:0,delayTimeoutId:null,tag:null,muted:!1,paused:!1,addEventListener:null,removeEventListener:null,removeAllEventListeners:null,dispatchEvent:null,hasEventListener:null,_listeners:null,onComplete:null,onLoop:null,onReady:null,onPlayFailed:null,onPlayInterrupted:null,onPlaySucceeded:null,
endedHandler:null,readyHandler:null,stalledHandler:null,init:function(a,c){this.src=a;this.owner=c;this.endedHandler=createjs.proxy(this.handleSoundComplete,this);this.readyHandler=createjs.proxy(this.handleSoundReady,this);this.stalledHandler=createjs.proxy(this.handleSoundStalled,this)},sendEvent:function(a){this.dispatchEvent({target:this,type:a})},cleanUp:function(){var a=this.tag;if(null!=a){a.pause();try{a.currentTime=0}catch(e){}a.removeEventListener(createjs.HTMLAudioPlugin.AUDIO_ENDED,this.endedHandler,
!1);a.removeEventListener(createjs.HTMLAudioPlugin.AUDIO_READY,this.readyHandler,!1);c.setInstance(this.src,a);this.tag=null}clearTimeout(this.delayTimeoutId);null!=window.createjs&&createjs.Sound.playFinished(this)},interrupt:function(){if(null!=this.tag){this.playState=createjs.Sound.PLAY_INTERRUPTED;if(this.onPlayInterrupted)this.onPlayInterrupted(this);this.sendEvent("interrupted");this.cleanUp();this.paused=!1}},play:function(a,c,d,f,g,j){this.cleanUp();createjs.Sound.playInstance(this,a,c,d,
f,g,j)},beginPlaying:function(a,e,d){if(null==window.createjs)return-1;var f=this.tag=c.getInstance(this.src);if(null==f)return this.playFailed(),-1;this.duration=1E3*this.tag.duration;f.addEventListener(createjs.HTMLAudioPlugin.AUDIO_ENDED,this.endedHandler,!1);this.offset=a;this.volume=d;this.updateVolume();this.remainingLoops=e;4!==f.readyState?(f.addEventListener(createjs.HTMLAudioPlugin.AUDIO_READY,this.readyHandler,!1),f.addEventListener(createjs.HTMLAudioPlugin.AUDIO_STALLED,this.stalledHandler,
!1),f.load()):this.handleSoundReady(null);this.onPlaySucceeded&&this.onPlaySucceeded(this);this.sendEvent("succeeded");return 1},handleSoundStalled:function(){if(null!=this.onPlayFailed)this.onPlayFailed(this);this.sendEvent("failed");this.cleanUp()},handleSoundReady:function(){null!=window.createjs&&(this.playState=createjs.Sound.PLAY_SUCCEEDED,this.paused=!1,this.tag.removeEventListener(createjs.HTMLAudioPlugin.AUDIO_READY,this.readyHandler,!1),this.offset>=this.getDuration()?this.playFailed():
(0<this.offset&&(this.tag.currentTime=0.0010*this.offset),-1==this.remainingLoops&&(this.tag.loop=!0),this.tag.play()))},pause:function(){return!this.paused&&this.playState==createjs.Sound.PLAY_SUCCEEDED&&null!=this.tag?(this.paused=!0,this.tag.pause(),clearTimeout(this.delayTimeoutId),!0):!1},resume:function(){if(!this.paused||null==this.tag)return!1;this.paused=!1;this.tag.play();return!0},stop:function(){this.offset=0;this.pause();this.playState=createjs.Sound.PLAY_FINISHED;this.cleanUp();return!0},
setMasterVolume:function(){this.updateVolume();return!0},setVolume:function(a){if(null==Number(a))return!1;this.volume=a=Math.max(0,Math.min(1,a));this.updateVolume();return!0},updateVolume:function(){if(null!=this.tag){var a=this.muted||createjs.Sound.masterMute?0:this.volume*createjs.Sound.masterVolume;a!=this.tag.volume&&(this.tag.volume=a);return!0}return!1},getVolume:function(){return this.volume},mute:function(a){this.muted=a;this.updateVolume();return!0},setMasterMute:function(){this.updateVolume();
return!0},setMute:function(a){if(null==a||void 0==a)return!1;this.muted=a;this.updateVolume();return!0},getMute:function(){return this.muted},setPan:function(){return!1},getPan:function(){return 0},getPosition:function(){return null==this.tag?this.offset:1E3*this.tag.currentTime},setPosition:function(a){if(null==this.tag)this.offset=a;else try{this.tag.currentTime=0.0010*a}catch(c){return!1}return!0},getDuration:function(){return this.duration},handleSoundComplete:function(){this.offset=0;if(0!=this.remainingLoops){this.remainingLoops--;
this.tag.play();if(null!=this.onLoop)this.onLoop(this);this.sendEvent("loop")}else if(null!=window.createjs){this.playState=createjs.Sound.PLAY_FINISHED;if(null!=this.onComplete)this.onComplete(this);this.sendEvent("complete");this.cleanUp()}},playFailed:function(){if(null!=window.createjs){this.playState=createjs.Sound.PLAY_FAILED;if(null!=this.onPlayFailed)this.onPlayFailed(this);this.sendEvent("failed");this.cleanUp()}},toString:function(){return"[HTMLAudioPlugin SoundInstance]"}};createjs.EventDispatcher.initialize(d.prototype);
l.prototype={src:null,tag:null,preloadTimer:null,loadedHandler:null,init:function(a,c){this.src=a;this.tag=c;this.preloadTimer=setInterval(createjs.proxy(this.preloadTick,this),200);this.loadedHandler=createjs.proxy(this.sendLoadedEvent,this);this.tag.addEventListener&&this.tag.addEventListener("canplaythrough",this.loadedHandler);this.tag.onreadystatechange=createjs.proxy(this.sendLoadedEvent,this);this.tag.preload="auto";this.tag.src=a;this.tag.load()},preloadTick:function(){var a=this.tag.buffered,
c=this.tag.duration;0<a.length&&a.end(0)>=c-1&&this.handleTagLoaded()},handleTagLoaded:function(){clearInterval(this.preloadTimer)},sendLoadedEvent:function(){this.tag.removeEventListener&&this.tag.removeEventListener("canplaythrough",this.loadedHandler);this.tag.onreadystatechange=null;createjs.Sound.sendLoadComplete(this.src)},toString:function(){return"[HTMLAudioPlugin HTMLAudioLoader]"}};c.tags={};c.get=function(a){var d=c.tags[a];null==d&&(d=c.tags[a]=new c(a));return d};c.getInstance=function(a){a=
c.tags[a];return null==a?null:a.get()};c.setInstance=function(a,d){var k=c.tags[a];return null==k?null:k.set(d)};c.prototype={src:null,length:0,available:0,tags:null,init:function(a){this.src=a;this.tags=[]},add:function(a){this.tags.push(a);this.length++;this.available++},get:function(){if(0==this.tags.length)return null;this.available=this.tags.length;var a=this.tags.pop();null==a.parentNode&&document.body.appendChild(a);return a},set:function(a){-1==this.tags.indexOf(a)&&this.tags.push(a);this.available=
this.tags.length},toString:function(){return"[HTMLAudioPlugin TagPool]"}}})();(function(){var a=this.createjs=this.createjs||{},a=a.SoundJS=a.SoundJS||{};a.version="0.4.0";a.buildDate="Tue, 12 Feb 2013 21:11:51 GMT"})();
