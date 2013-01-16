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