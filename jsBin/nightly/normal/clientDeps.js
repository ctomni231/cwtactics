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
/**
 * @namespace
 */
var Base64Helper = {};

/**
 * 
 * @param {Image} img
 */
Base64Helper.canvasToBase64 = function( img ){

  // Create an empty canvas element
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  // Copy the image contents to the canvas
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  // Get the data-URL formatted image
  // Firefox supports PNG and JPEG. You could check img.src to
  // guess the original format, but be aware the using "image/jpg"
  // will re-encode the image.
  var dataURL = canvas.toDataURL("image/png");

  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
};

/*
 * Based on base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function(chars){
  var encodings = chars;
  
  Base64Helper.encodeBuffer = function(arrayBuffer){
    var base64    = '';

    var bytes         = new Uint8Array(arrayBuffer);
    var byteLength    = bytes.byteLength;
    var byteRemainder = byteLength % 3;
    var mainLength    = byteLength - byteRemainder;

    var a, b, c, d;
    var chunk;

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
      // Combine the three bytes into a single integer
      chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

      // Use bitmasks to extract 6-bit segments from the triplet
      a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
      b = (chunk & 258048)   >> 12; // 258048   = (2^6 - 1) << 12
      c = (chunk & 4032)     >>  6; // 4032     = (2^6 - 1) << 6
      d = chunk & 63;               // 63       = 2^6 - 1

      // Convert the raw binary segments to the appropriate ASCII encoding
      base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
      chunk = bytes[mainLength];

      a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

      // Set the 4 least significant bits to zero
      b = (chunk & 3)   << 4; // 3   = 2^2 - 1

      base64 += encodings[a] + encodings[b] + '==';
    } else if (byteRemainder == 2) {
      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

      a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
      b = (chunk & 1008)  >>  4; // 1008  = (2^6 - 1) << 4

      // Set the 2 least significant bits to zero
      c = (chunk & 15)    <<  2; // 15    = 2^4 - 1

      base64 += encodings[a] + encodings[b] + encodings[c] + '=';
    }

    return base64;
  };

  Base64Helper.decodeBuffer =  function(base64) {
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

    for (i = 0; i < len; i+=4) {
      encoded1 = chars.indexOf(base64[i]);
      encoded2 = chars.indexOf(base64[i+1]);
      encoded3 = chars.indexOf(base64[i+2]);
      encoded4 = chars.indexOf(base64[i+3]);

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };
})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
(function(b,p){function e(g){l[l.length]=g}function q(g){j.className=j.className.replace(RegExp("\\b"+g+"\\b"),"")}function m(g,c){for(var b=0,a=g.length;b<a;b++)c.call(g,g[b],b)}function r(){j.className=j.className.replace(/ (w-|eq-|gt-|gte-|lt-|lte-|portrait|no-portrait|landscape|no-landscape)\d+/g,"");var g=b.innerWidth||j.clientWidth,a=b.outerWidth||b.screen.width;d.screen.innerWidth=g;d.screen.outerWidth=a;e("w-"+g);m(c.screens,function(a){g>a?(c.screensCss.gt&&e("gt-"+a),c.screensCss.gte&&e("gte-"+
a)):g<a?(c.screensCss.lt&&e("lt-"+a),c.screensCss.lte&&e("lte-"+a)):g===a&&(c.screensCss.lte&&e("lte-"+a),c.screensCss.eq&&e("e-q"+a),c.screensCss.gte&&e("gte-"+a))});var a=b.innerHeight||j.clientHeight,f=b.outerHeight||b.screen.height;d.screen.innerHeight=a;d.screen.outerHeight=f;d.feature("portrait",a>g);d.feature("landscape",a<g)}function s(){b.clearTimeout(t);t=b.setTimeout(r,100)}var n=b.document,f=b.navigator,u=b.location,j=n.documentElement,l=[],c={screens:[240,320,480,640,768,800,1024,1280,
1440,1680,1920],screensCss:{gt:!0,gte:!1,lt:!0,lte:!1,eq:!1},browsers:[{ie:{min:6,max:10}}],browserCss:{gt:!0,gte:!1,lt:!0,lte:!1,eq:!0},section:"-section",page:"-page",head:"head"};if(b.head_conf)for(var a in b.head_conf)b.head_conf[a]!==p&&(c[a]=b.head_conf[a]);var d=b[c.head]=function(){d.ready.apply(null,arguments)};d.feature=function(a,b,c){if(!a)return j.className+=" "+l.join(" "),l=[],d;"[object Function]"===Object.prototype.toString.call(b)&&(b=b.call());e((b?"":"no-")+a);d[a]=!!b;c||(q("no-"+
a),q(a),d.feature());return d};d.feature("js",!0);a=f.userAgent.toLowerCase();f=/mobile|midp/.test(a);d.feature("mobile",f,!0);d.feature("desktop",!f,!0);a=/(chrome|firefox)[ \/]([\w.]+)/.exec(a)||/(iphone|ipad|ipod)(?:.*version)?[ \/]([\w.]+)/.exec(a)||/(android)(?:.*version)?[ \/]([\w.]+)/.exec(a)||/(webkit|opera)(?:.*version)?[ \/]([\w.]+)/.exec(a)||/(msie) ([\w.]+)/.exec(a)||[];f=a[1];a=parseFloat(a[2]);switch(f){case "msie":f="ie";a=n.documentMode||a;break;case "firefox":f="ff";break;case "ipod":case "ipad":case "iphone":f=
"ios";break;case "webkit":f="safari"}d.browser={name:f,version:a};d.browser[f]=!0;for(var k=0,v=c.browsers.length;k<v;k++)for(var h in c.browsers[k])if(f===h){e(h);for(var w=c.browsers[k][h].max,i=c.browsers[k][h].min;i<=w;i++)a>i?(c.browserCss.gt&&e("gt-"+h+i),c.browserCss.gte&&e("gte-"+h+i)):a<i?(c.browserCss.lt&&e("lt-"+h+i),c.browserCss.lte&&e("lte-"+h+i)):a===i&&(c.browserCss.lte&&e("lte-"+h+i),c.browserCss.eq&&e("eq-"+h+i),c.browserCss.gte&&e("gte-"+h+i))}else e("no-"+h);"ie"===f&&9>a&&m("abbr article aside audio canvas details figcaption figure footer header hgroup mark meter nav output progress section summary time video".split(" "),
function(a){n.createElement(a)});m(u.pathname.split("/"),function(a,b){if(2<this.length&&this[b+1]!==p)b&&e(this.slice(1,b+1).join("-").toLowerCase()+c.section);else{var d=a||"index",f=d.indexOf(".");0<f&&(d=d.substring(0,f));j.id=d.toLowerCase()+c.page;b||e("root"+c.section)}});d.screen={height:b.screen.height,width:b.screen.width};r();var t=0;b.addEventListener?b.addEventListener("resize",s,!1):b.attachEvent("onresize",s)})(window);
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
    if (arguments.length <= 2 && arguments.length > 0) {
        callback = (typeof arguments[0] === 'function') ? arguments[0] : arguments[1];
        options  = (typeof arguments[0] === 'function') ? {} : arguments[0];
    } else {
        throw 'Incorrect # of ctor args!'
    }
    // TODO perhaps allow for pub/sub instead?
    if (typeof callback !== 'function') throw 'No callback was provided';
    
    // default configuration 
    this.record = options.record || 'record'  // default for records
    this.name   = options.name   || 'records' // default name for underlying store
    
    // mixin first valid  adapter
    var adapter
    // if the adapter is passed in we try to load that only
    if (options.adapter) {
        for (var i = 0, l = Lawnchair.adapters.length; i < l; i++) {
            if (Lawnchair.adapters[i].adapter === options.adapter) {
              adapter = Lawnchair.adapters[i].valid() ? Lawnchair.adapters[i] : undefined;
              break;
            }
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
 * dom storage adapter 
 * === 
 * - originally authored by Joseph Pecoraro
 *
 */ 
//
// TODO does it make sense to be chainable all over the place?
// chainable: nuke, remove, all, get, save, all    
// not chainable: valid, keys
//
Lawnchair.adapter('dom', (function() {
    var storage = window.localStorage
    // the indexer is an encapsulation of the helpers needed to keep an ordered index of the keys
    var indexer = function(name) {
        return {
            // the key
            key: name + '._index_',
            // returns the index
            all: function() {
				var a  = storage.getItem(this.key)
				if (a) {
					a = JSON.parse(a)
				}
                if (a === null) storage.setItem(this.key, JSON.stringify([])) // lazy init
                return JSON.parse(storage.getItem(this.key))
            },
            // adds a key to the index
            add: function (key) {
                var a = this.all()
                a.push(key)
                storage.setItem(this.key, JSON.stringify(a))
            },
            // deletes a key from the index
            del: function (key) {
                var a = this.all(), r = []
                // FIXME this is crazy inefficient but I'm in a strata meeting and half concentrating
                for (var i = 0, l = a.length; i < l; i++) {
                    if (a[i] != key) r.push(a[i])
                }
                storage.setItem(this.key, JSON.stringify(r))
            },
            // returns index for a key
            find: function (key) {
                var a = this.all()
                for (var i = 0, l = a.length; i < l; i++) {
                    if (key === a[i]) return i 
                }
                return false
            }
        }
    }
    
    // adapter api 
    return {
    
        // ensure we are in an env with localStorage 
        valid: function () {
            return !!storage 
        },

        init: function (options, callback) {
            this.indexer = indexer(this.name)
            if (callback) this.fn(this.name, callback).call(this, this)  
        },
        
        save: function (obj, callback) {
            var key = obj.key ? this.name + '.' + obj.key : this.name + '.' + this.uuid()
            // if the key is not in the index push it on
            if (this.indexer.find(key) === false) this.indexer.add(key)
            // now we kil the key and use it in the store colleciton    
            delete obj.key;
            storage.setItem(key, JSON.stringify(obj))
            obj.key = key.slice(this.name.length + 1)
            if (callback) {
                this.lambda(callback).call(this, obj)
            }
            return this
        },

        batch: function (ary, callback) {
            var saved = []
            // not particularily efficient but this is more for sqlite situations
            for (var i = 0, l = ary.length; i < l; i++) {
                this.save(ary[i], function(r){
                    saved.push(r)
                })
            }
            if (callback) this.lambda(callback).call(this, saved)
            return this
        },
       
        // accepts [options], callback
        keys: function(callback) {
            if (callback) { 
                var name = this.name
                ,   keys = this.indexer.all().map(function(r){ return r.replace(name + '.', '') })
                this.fn('keys', callback).call(this, keys)
            }
            return this // TODO options for limit/offset, return promise
        },
        
        get: function (key, callback) {
            if (this.isArray(key)) {
                var r = []
                for (var i = 0, l = key.length; i < l; i++) {
                    var k = this.name + '.' + key[i]
                    var obj = storage.getItem(k)
                    if (obj) {
						obj = JSON.parse(obj)
                        obj.key = key[i]
                        r.push(obj)
                    } 
                }
                if (callback) this.lambda(callback).call(this, r)
            } else {
                var k = this.name + '.' + key
                var  obj = storage.getItem(k)
                if (obj) {
					obj = JSON.parse(obj)
					obj.key = key
				}
                if (callback) this.lambda(callback).call(this, obj)
            }
            return this
        },

        exists: function (key, cb) {
            var exists = this.indexer.find(this.name+'.'+key) === false ? false : true ;
            this.lambda(cb).call(this, exists);
            return this;
        },
        // NOTE adapters cannot set this.__results but plugins do
        // this probably should be reviewed
        all: function (callback) {
            var idx = this.indexer.all()
            ,   r   = []
            ,   o
            ,   k
            for (var i = 0, l = idx.length; i < l; i++) {
                k     = idx[i] //v
                o     = JSON.parse(storage.getItem(k))
                o.key = k.replace(this.name + '.', '')
                r.push(o)
            }
            if (callback) this.fn(this.name, callback).call(this, r)
            return this
        },
        
        remove: function (keyOrObj, callback) {
            var key = this.name + '.' + ((keyOrObj.key) ? keyOrObj.key : keyOrObj)
            this.indexer.del(key)
            storage.removeItem(key)
            if (callback) this.lambda(callback).call(this)
            return this
        },
        
        nuke: function (callback) {
            this.all(function(r) {
                for (var i = 0, l = r.length; i < l; i++) {
                    this.remove(r[i]);
                }
                if (callback) this.lambda(callback).call(this)
            })
            return this 
        }
}})());
// window.name code courtesy Remy Sharp: http://24ways.org/2009/breaking-out-the-edges-of-the-browser
Lawnchair.adapter('window-name', (function(index, store) {

    var data = window.top.name ? JSON.parse(window.top.name) : {}

    return {

        valid: function () {
            return typeof window.top.name != 'undefined' 
        },

        init: function (options, callback) {
            data[this.name] = data[this.name] || {index:[],store:{}}
            index = data[this.name].index
            store = data[this.name].store
            this.fn(this.name, callback).call(this, this)
        },

        keys: function (callback) {
            this.fn('keys', callback).call(this, index)
            return this
        },

        save: function (obj, cb) {
            // data[key] = value + ''; // force to string
            // window.top.name = JSON.stringify(data);
            var key = obj.key || this.uuid()
            if (obj.key) delete obj.key 
            this.exists(key, function(exists) {
                if (!exists) index.push(key)
                store[key] = obj
                window.top.name = JSON.stringify(data) // TODO wow, this is the only diff from the memory adapter
                obj.key = key
                if (cb) {
                    this.lambda(cb).call(this, obj)
                }
            })
            return this
        },

        batch: function (objs, cb) {
            var r = []
            for (var i = 0, l = objs.length; i < l; i++) {
                this.save(objs[i], function(record) {
                    r.push(record)
                })
            }
            if (cb) this.lambda(cb).call(this, r)
            return this
        },
        
        get: function (keyOrArray, cb) {
            var r;
            if (this.isArray(keyOrArray)) {
                r = []
                for (var i = 0, l = keyOrArray.length; i < l; i++) {
                    r.push(store[keyOrArray[i]]) 
                }
            } else {
                r = store[keyOrArray]
                if (r) r.key = keyOrArray
            }
            if (cb) this.lambda(cb).call(this, r)
            return this 
        },
        
        exists: function (key, cb) {
            this.lambda(cb).call(this, !!(store[key]))
            return this
        },

        all: function (cb) {
            var r = []
            for (var i = 0, l = index.length; i < l; i++) {
                var obj = store[index[i]]
                obj.key = index[i]
                r.push(obj)
            }
            this.fn(this.name, cb).call(this, r)
            return this
        },
        
        remove: function (keyOrArray, cb) {
            var del = this.isArray(keyOrArray) ? keyOrArray : [keyOrArray]
            for (var i = 0, l = del.length; i < l; i++) {
                delete store[del[i]]
                index.splice(this.indexOf(index, del[i]), 1)
            }
            window.top.name = JSON.stringify(data)
            if (cb) this.lambda(cb).call(this)
            return this
        },

        nuke: function (cb) {
            storage = {}
            index = []
            window.top.name = JSON.stringify(data)
            if (cb) this.lambda(cb).call(this)
            return this 
        }
    }
/////
})());
/**
 * indexed db adapter
 * === 
 * - originally authored by Vivian Li
 *
 */ 

Lawnchair.adapter('indexed-db', (function(){
    
  function fail(e, i) { console.log('error in indexed-db adapter!', e, i); debugger; } ;
     
  function getIDB(){
    return window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.oIndexedDB || window.msIndexedDB;
  }; 
  
  
    
  return {
    
    valid: function() { return !!getIDB(); },
    
    init:function(options, callback) {
        this.idb = getIDB();
        this.waiting = [];
        var request = this.idb.open(this.name);
        var self = this;
        var cb = self.fn(self.name, callback);
        var win = function(){ return cb.call(self, self); }
        
        request.onsuccess = function(event) {
           self.db = request.result; 
            
            if(self.db.version != "1.0") {
              var setVrequest = self.db.setVersion("1.0");
              // onsuccess is the only place we can create Object Stores
              setVrequest.onsuccess = function(e) {
                  self.store = self.db.createObjectStore("teststore", { autoIncrement: true} );
                  for (var i = 0; i < self.waiting.length; i++) {
                      self.waiting[i].call(self);
                  }
                  self.waiting = [];
                  win();
              };
              setVrequest.onerror = function(e) {
                  console.log("Failed to create objectstore " + e);
                  fail(e);
              }
            } else {
                self.store = {};
                for (var i = 0; i < self.waiting.length; i++) {
                      self.waiting[i].call(self);
                }
                self.waiting = [];
                win();
            }
        }
        request.onerror = fail;
    },

    save:function(obj, callback) {
        if(!this.store) {
            this.waiting.push(function() {
                this.save(obj, callback);
            });
            return;
         }
         
         var self = this;
         var win  = function (e) { if (callback) { obj.key = e.target.result; self.lambda(callback).call(self, obj) }};
         
         var trans = this.db.transaction(["teststore"], webkitIDBTransaction.READ_WRITE);
         var store = trans.objectStore("teststore");
         var request = obj.key ? store.put(obj, obj.key) : store.put(obj);
         
         request.onsuccess = win;
         request.onerror = fail;
         
         return this;
    },
    
    // FIXME this should be a batch insert / just getting the test to pass...
    batch: function (objs, cb) {
        
        var results = []
        ,   done = false
        ,   self = this

        var updateProgress = function(obj) {
            results.push(obj)
            done = results.length === objs.length
        }

        var checkProgress = setInterval(function() {
            if (done) {
                if (cb) self.lambda(cb).call(self, results)
                clearInterval(checkProgress)
            }
        }, 200)

        for (var i = 0, l = objs.length; i < l; i++) 
            this.save(objs[i], updateProgress)
        
        return this
    },
    

    get:function(key, callback) {
        if(!this.store) {
            this.waiting.push(function() {
                this.get(key, callback);
            });
            return;
        }
        
        
        var self = this;
        var win  = function (e) { if (callback) { self.lambda(callback).call(self, e.target.result) }};
        
        
        if (!this.isArray(key)){
            var req = this.db.transaction("teststore").objectStore("teststore").get(key);

            req.onsuccess = win;
            req.onerror = function(event) {
                console.log("Failed to find " + key);
                fail(event);
            };
        
        // FIXME: again the setInterval solution to async callbacks..    
        } else {

            // note: these are hosted.
            var results = []
            ,   done = false
            ,   keys = key

            var updateProgress = function(obj) {
                results.push(obj)
                done = results.length === keys.length
            }

            var checkProgress = setInterval(function() {
                if (done) {
                    if (callback) self.lambda(callback).call(self, results)
                    clearInterval(checkProgress)
                }
            }, 200)

            for (var i = 0, l = keys.length; i < l; i++) 
                this.get(keys[i], updateProgress)
            
        }

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
        var objectStore = this.db.transaction("teststore").objectStore("teststore");
        var toReturn = [];
        objectStore.openCursor().onsuccess = function(event) {
          var cursor = event.target.result;
          if (cursor) {
               toReturn.push(cursor.value);
               cursor.continue();
          }
          else {
              if (cb) cb.call(self, toReturn);
          }
        };
        return this;
    },

    remove:function(keyOrObj, callback) {
        if(!this.store) {
            this.waiting.push(function() {
                this.remove(keyOrObj, callback);
            });
            return;
        }
        if (typeof keyOrObj == "object") {
            keyOrObj = keyOrObj.key;
        }
        var self = this;
        var win  = function () { if (callback) self.lambda(callback).call(self) };
        
        var request = this.db.transaction(["teststore"], webkitIDBTransaction.READ_WRITE).objectStore("teststore").delete(keyOrObj);
        request.onsuccess = win;
        request.onerror = fail;
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
            this.db
                .transaction(["teststore"], webkitIDBTransaction.READ_WRITE)
                .objectStore("teststore").clear().onsuccess = win;
            
        } catch(e) {
            fail();
        }
        return this;
    }
    
  };
  
})());

Lawnchair.adapter('webkit-sqlite', (function () {
    // private methods 
    var fail = function (e, i) { console.log('error in sqlite adaptor!', e, i) }
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
            ,   create = "CREATE TABLE IF NOT EXISTS " + this.name + " (id NVARCHAR(32) UNIQUE PRIMARY KEY, value TEXT, timestamp REAL)"
            ,   win    = function(){ return cb.call(that, that); }
            // open a connection and create the db if it doesn't exist 
            this.db = openDatabase(this.name, '1.0.0', this.name, options.maxSize || 65536)
            this.db.transaction(function (t) { 
                t.executeSql(create, [], win, fail) 
            })
        }, 

        keys:  function (callback) {
            var cb   = this.lambda(callback)
            ,   that = this
            ,   keys = "SELECT id FROM " + this.name + " ORDER BY timestamp DESC"

            this.db.transaction(function(t) {
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
        save: function (obj, callback) {
            var that = this
            ,   id   = obj.key || that.uuid()
            ,   ins  = "INSERT INTO " + this.name + " (value, timestamp, id) VALUES (?,?,?)"
            ,   up   = "UPDATE " + this.name + " SET value=?, timestamp=? WHERE id=?"
            ,   win  = function () { if (callback) { obj.key = id; that.lambda(callback).call(that, obj) }}
            ,   val  = [now(), id]
      // existential 
            that.exists(obj.key, function(exists) {
                // transactions are like condoms
                that.db.transaction(function(t) {
          // TODO move timestamp to a plugin
                    var insert = function (obj) {
                        val.unshift(JSON.stringify(obj))
                        t.executeSql(ins, val, win, fail)
                    }
          // TODO move timestamp to a plugin
                    var update = function (obj) {
                        delete(obj.key)
                        val.unshift(JSON.stringify(obj))
                        t.executeSql(up, val, win, fail)
                    }
          // pretty
                    exists ? update(obj) : insert(obj)
                })
            });
            return this
        }, 

    // FIXME this should be a batch insert / just getting the test to pass...
        batch: function (objs, cb) {

      var results = []
      ,   done = false
      ,   that = this

      var updateProgress = function(obj) {
        results.push(obj)
        done = results.length === objs.length
      }

      var checkProgress = setInterval(function() {
        if (done) {
          if (cb) that.lambda(cb).call(that, results)
          clearInterval(checkProgress)
        }
      }, 200)

      for (var i = 0, l = objs.length; i < l; i++) 
        this.save(objs[i], updateProgress)

            return this
        },

        get: function (keyOrArray, cb) {
      var that = this
      ,   sql  = ''
            // batch selects support
      if (this.isArray(keyOrArray)) {
        sql = 'SELECT id, value FROM ' + this.name + " WHERE id IN ('" + keyOrArray.join("','") + "')"
      } else {
        sql = 'SELECT id, value FROM ' + this.name + " WHERE id = '" + keyOrArray + "'"
      }	
      // FIXME
            // will always loop the results but cleans it up if not a batch return at the end..
      // in other words, this could be faster
      var win = function (xxx, results) {
        var o = null
        ,   r = []
        if (results.rows.length) {
          for (var i = 0, l = results.rows.length; i < l; i++) {
            o = JSON.parse(results.rows.item(i).value)
            o.key = results.rows.item(i).id
            r.push(o)
          }
        }
        if (!that.isArray(keyOrArray)) r = r.length ? r[0] : null
        if (cb) that.lambda(cb).call(that, r)
            }
            this.db.transaction(function(t){ t.executeSql(sql, [], win, fail) })
            return this 
    },

    exists: function (key, cb) {
      var is = "SELECT * FROM " + this.name + " WHERE id = ?"
      ,   that = this
      ,   win = function(xxx, results) { if (cb) that.fn('exists', cb).call(that, (results.rows.length > 0)) }
      this.db.transaction(function(t){ t.executeSql(is, [key], win, fail) })
      return this
    },

    all: function (callback) {
      var that = this
      ,   all  = "SELECT * FROM " + this.name
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

      this.db.transaction(function (t) { 
        t.executeSql(all, [], win, fail) 
      })
      return this
    },

    remove: function (keyOrObj, cb) {
      var that = this
      ,   key  = typeof keyOrObj === 'string' ? keyOrObj : keyOrObj.key
      ,   del  = "DELETE FROM " + this.name + " WHERE id = ?"
      ,   win  = function () { if (cb) that.lambda(cb).call(that) }

      this.db.transaction( function (t) {
        t.executeSql(del, [key], win, fail);
      });

      return this;
    },

    nuke: function (cb) {
      var nuke = "DELETE FROM " + this.name
      ,   that = this
      ,   win  = cb ? function() { that.lambda(cb).call(that) } : function(){}
        this.db.transaction(function (t) { 
        t.executeSql(nuke, [], win, fail) 
      })
      return this
    }
//////
}})())
// FROM
// http://stackoverflow.com/questions/979975/how-to-get-the-value-from-url-parameter
function getQueryParams(qs) {
    qs = qs.split("+").join(" ");

    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}
// jWorkflow.js
// (c) 2010 tinyHippos inc.
// jWorkflow is freely distributable under the terms of the MIT license.
// Portions of jWorkflow are inspired by Underscore.js
var jWorkflow = (function () {
    function _valid(func) {
        if (typeof(func) !== 'function') {
            throw "expected function but was " + typeof(func);
        }
    }

    function _isWorkflow(func) {
        return typeof func.andThen === 'function' &&
               typeof func.start === 'function' &&
               typeof func.chill === 'function';
    }

    function _isArray(func) {
        return !!func.map && !!func.reduce;
    }

    var transfunctioner =  {
        order: function (func, context) {
            var _workflow = [],
                _tasks,
                _callback = null,
                _baton = (function () {
                    var _taken = false; 
                    return {

                        take: function () {
                            _taken = true;
                        },

                        pass: function (result) {
                            var task;
                            _taken = false;

                            if (_tasks.length) {
                                task = _tasks.shift();
                                result = task.func.apply(task.context, [result, _baton]);

                                if (!_taken) {
                                    _baton.pass(result);
                                }
                            }
                            else { 
                                if (_callback.func) {
                                    _callback.func.apply(_callback.context, [result]);
                                }
                            }
                        },

                        drop: function (result) {
                            _taken = true;
                            _tasks = [];
                            setTimeout(function () {
                                _baton.pass(result);
                            }, 1);
                        }
                    };
                }()),
                _self = {

                    andThen: function (func, context) {
                        if (_isWorkflow(func)) {
                            var f = function (prev, baton) {
                                baton.take();
                                func.start({
                                    callback: function (result) {
                                        baton.pass(result);
                                    }, 
                                    context: context, 
                                    initialValue: prev
                                });
                            };
                            _workflow.push({func: f, context: context});
                        }
                        else if (_isArray(func)) {
                            var orch = function (prev, baton) {
                                baton.take();

                                var l = func.length,
                                    join = function () {
                                        return --l || baton.pass();
                                    };

                                func.forEach(function (f) {
                                    jWorkflow.order(f).start(join);
                                });
                            };
                            _workflow.push({func: orch, context: context});
                        }
                        else {
                            _valid(func);
                            _workflow.push({func: func, context: context});
                        }
                        return _self;
                    },

                    chill: function (time) {
                        return _self.andThen(function (prev, baton) {
                            baton.take();
                            setTimeout(function () {
                                baton.pass(prev);
                            }, time);
                        });
                    },

                    start: function () {
                        var callback,
                            context,
                            initialValue;

                        if (arguments[0] && typeof arguments[0] === 'object') {
                            callback = arguments[0].callback;
                            context = arguments[0].context;
                            initialValue = arguments[0].initialValue;
                        }
                        else {
                            callback = arguments[0];
                            context = arguments[1];
                        }

                        _callback = {func: callback, context: context};
                        _tasks = _workflow.slice();
                        _baton.pass(initialValue);
                    }
                };

            return func ? _self.andThen(func, context) : _self;
        }
    };

    return transfunctioner;
}());

if (typeof module === "object" && typeof require === "function") {
    module.exports = jWorkflow;
}