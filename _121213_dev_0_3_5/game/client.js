var INACTIVE_ID = -1;

var DESELECT_ID = -2;

var ACTIONS_BUFFER_SIZE = 200;

var MAX_PLAYER = 4;

var MAX_MAP_WIDTH = 100;

var MAX_MAP_HEIGHT = 100;

var MAX_UNITS_PER_PLAYER = 50;

var MAX_PROPERTIES = 300;

var MAX_SELECTION_RANGE = 15;

var MAX_BUFFER_SIZE = 200;

var VERSION = "0.3.5";

var DEBUG = true;

var MOD_PATH = "http://ctomni231.github.io/cwtactics/_121213_dev_0_3_5/mod/cwt/";

var EV_FACTORY_TYPE_CHECK = "ev_fac_canBuild";

var EV_FACTORY_TYPE_BUILDED = "ev_fac_builded";

(function() {
    var lastTime = 0;
    var vendors = [ "ms", "moz", "webkit", "o" ];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
})();

var Base64Helper = {};

Base64Helper.canvasToBase64 = function(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
};

(function(chars) {
    var encodings = chars;
    Base64Helper.encodeBuffer = function(arrayBuffer) {
        var base64 = "";
        var bytes = new Uint8Array(arrayBuffer);
        var byteLength = bytes.byteLength;
        var byteRemainder = byteLength % 3;
        var mainLength = byteLength - byteRemainder;
        var a, b, c, d;
        var chunk;
        for (var i = 0; i < mainLength; i = i + 3) {
            chunk = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
            a = (chunk & 16515072) >> 18;
            b = (chunk & 258048) >> 12;
            c = (chunk & 4032) >> 6;
            d = chunk & 63;
            base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
        }
        if (byteRemainder == 1) {
            chunk = bytes[mainLength];
            a = (chunk & 252) >> 2;
            b = (chunk & 3) << 4;
            base64 += encodings[a] + encodings[b] + "==";
        } else if (byteRemainder == 2) {
            chunk = bytes[mainLength] << 8 | bytes[mainLength + 1];
            a = (chunk & 64512) >> 10;
            b = (chunk & 1008) >> 4;
            c = (chunk & 15) << 2;
            base64 += encodings[a] + encodings[b] + encodings[c] + "=";
        }
        return base64;
    };
    Base64Helper.decodeBuffer = function(base64) {
        var bufferLength = base64.length * .75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
        if (base64[base64.length - 1] === "=") {
            bufferLength--;
            if (base64[base64.length - 2] === "=") {
                bufferLength--;
            }
        }
        var arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
        for (i = 0; i < len; i += 4) {
            encoded1 = chars.indexOf(base64[i]);
            encoded2 = chars.indexOf(base64[i + 1]);
            encoded3 = chars.indexOf(base64[i + 2]);
            encoded4 = chars.indexOf(base64[i + 3]);
            bytes[p++] = encoded1 << 2 | encoded2 >> 4;
            bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
            bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
        }
        return arraybuffer;
    };
})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");

var Lawnchair = function(options, callback) {
    if (!(this instanceof Lawnchair)) return new Lawnchair(options, callback);
    if (!JSON) throw "JSON unavailable! Include http://www.json.org/json2.js to fix.";
    if (arguments.length <= 2) {
        callback = typeof arguments[0] === "function" ? arguments[0] : arguments[1];
        options = typeof arguments[0] === "function" ? {} : arguments[0] || {};
    } else {
        throw "Incorrect # of ctor args!";
    }
    this.record = options.record || "record";
    this.name = options.name || "records";
    var adapter;
    if (options.adapter) {
        if (typeof options.adapter === "string") {
            options.adapter = [ options.adapter ];
        }
        for (var j = 0, k = options.adapter.length; j < k; j++) {
            for (var i = Lawnchair.adapters.length - 1; i >= 0; i--) {
                if (Lawnchair.adapters[i].adapter === options.adapter[j]) {
                    adapter = Lawnchair.adapters[i].valid() ? Lawnchair.adapters[i] : undefined;
                    if (adapter) break;
                }
            }
            if (adapter) break;
        }
    } else {
        for (var i = 0, l = Lawnchair.adapters.length; i < l; i++) {
            adapter = Lawnchair.adapters[i].valid() ? Lawnchair.adapters[i] : undefined;
            if (adapter) break;
        }
    }
    if (!adapter) throw "No valid adapter.";
    for (var j in adapter) this[j] = adapter[j];
    for (var i = 0, l = Lawnchair.plugins.length; i < l; i++) Lawnchair.plugins[i].call(this);
    this.init(options, callback);
};

Lawnchair.adapters = [];

Lawnchair.adapter = function(id, obj) {
    obj["adapter"] = id;
    var implementing = "adapter valid init keys save batch get exists all remove nuke".split(" "), indexOf = this.prototype.indexOf;
    for (var i in obj) {
        if (indexOf(implementing, i) === -1) throw "Invalid adapter! Nonstandard method: " + i;
    }
    Lawnchair.adapters.splice(0, 0, obj);
};

Lawnchair.plugins = [];

Lawnchair.plugin = function(obj) {
    for (var i in obj) i === "init" ? Lawnchair.plugins.push(obj[i]) : this.prototype[i] = obj[i];
};

Lawnchair.prototype = {
    isArray: Array.isArray || function(o) {
        return Object.prototype.toString.call(o) === "[object Array]";
    },
    indexOf: function(ary, item, i, l) {
        if (ary.indexOf) return ary.indexOf(item);
        for (i = 0, l = ary.length; i < l; i++) if (ary[i] === item) return i;
        return -1;
    },
    lambda: function(callback) {
        return this.fn(this.record, callback);
    },
    fn: function(name, callback) {
        return typeof callback == "string" ? new Function(name, callback) : callback;
    },
    uuid: function() {
        var S4 = function() {
            return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
        };
        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    },
    each: function(callback) {
        var cb = this.lambda(callback);
        if (this.__results) {
            for (var i = 0, l = this.__results.length; i < l; i++) cb.call(this, this.__results[i], i);
        } else {
            this.all(function(r) {
                for (var i = 0, l = r.length; i < l; i++) cb.call(this, r[i], i);
            });
        }
        return this;
    }
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = Lawnchair;
}

Lawnchair.adapter("indexed-db", function() {
    function fail(e, i) {
        console.error("error in indexed-db adapter!", e, i);
    }
    var STORE_VERSION = 3;
    var getIDB = function() {
        return window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.oIndexedDB || window.msIndexedDB;
    };
    var getIDBTransaction = function() {
        return window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction || window.oIDBTransaction || window.msIDBTransaction;
    };
    var getIDBKeyRange = function() {
        return window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange || window.oIDBKeyRange || window.msIDBKeyRange;
    };
    var getIDBDatabaseException = function() {
        return window.IDBDatabaseException || window.webkitIDBDatabaseException || window.mozIDBDatabaseException || window.oIDBDatabaseException || window.msIDBDatabaseException;
    };
    var useAutoIncrement = function() {
        return !!window.indexedDB;
    };
    var READ_WRITE = getIDBTransaction() && "READ_WRITE" in getIDBTransaction() ? getIDBTransaction().READ_WRITE : "readwrite";
    return {
        valid: function() {
            return !!getIDB();
        },
        init: function(options, callback) {
            this.idb = getIDB();
            this.waiting = [];
            this.useAutoIncrement = useAutoIncrement();
            var request = this.idb.open(this.name, STORE_VERSION);
            var self = this;
            var cb = self.fn(self.name, callback);
            if (cb && typeof cb != "function") throw "callback not valid";
            var win = function() {
                request.onupgradeneeded = request.onsuccess = request.error = null;
                if (cb) return cb.call(self, self);
            };
            var upgrade = function(from, to) {
                try {
                    self.db.deleteObjectStore("teststore");
                } catch (e1) {}
                try {
                    self.db.deleteObjectStore(self.record);
                } catch (e2) {}
                var params = {};
                if (self.useAutoIncrement) {
                    params.autoIncrement = true;
                }
                self.db.createObjectStore(self.record, params);
                self.store = true;
            };
            request.onupgradeneeded = function(event) {
                self.db = request.result;
                self.transaction = request.transaction;
                upgrade(event.oldVersion, event.newVersion);
            };
            request.onsuccess = function(event) {
                self.db = event.target.result;
                if (self.db.version != "" + STORE_VERSION) {
                    var oldVersion = self.db.version;
                    var setVrequest = self.db.setVersion("" + STORE_VERSION);
                    setVrequest.onsuccess = function(event) {
                        var transaction = setVrequest.result;
                        setVrequest.onsuccess = setVrequest.onerror = null;
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
            };
            request.onerror = function(ev) {
                if (getIDBDatabaseException() && request.errorCode === getIDBDatabaseException().VERSION_ERR) {
                    self.idb.deleteDatabase(self.name);
                    return self.init(options, callback);
                }
                console.error("Failed to open database");
            };
        },
        save: function(obj, callback) {
            var self = this;
            if (!this.store) {
                this.waiting.push(function() {
                    this.save(obj, callback);
                });
                return;
            }
            var objs = (this.isArray(obj) ? obj : [ obj ]).map(function(o) {
                if (!o.key) {
                    o.key = self.uuid();
                }
                return o;
            });
            var win = function(e) {
                if (callback) {
                    self.lambda(callback).call(self, self.isArray(obj) ? objs : objs[0]);
                }
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
        batch: function(objs, callback) {
            return this.save(objs, callback);
        },
        get: function(key, callback) {
            if (!this.store) {
                this.waiting.push(function() {
                    this.get(key, callback);
                });
                return;
            }
            var self = this;
            var win = function(e) {
                var r = e.target.result;
                if (callback) {
                    if (r) {
                        r.key = key;
                    }
                    self.lambda(callback).call(self, r);
                }
            };
            if (!this.isArray(key)) {
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
                var results = [], done = key.length, keys = key;
                var getOne = function(i) {
                    self.get(keys[i], function(obj) {
                        results[i] = obj;
                        if (--done > 0) {
                            return;
                        }
                        if (callback) {
                            self.lambda(callback).call(self, results);
                        }
                    });
                };
                for (var i = 0, l = keys.length; i < l; i++) getOne(i);
            }
            return this;
        },
        exists: function(key, callback) {
            if (!this.store) {
                this.waiting.push(function() {
                    this.exists(key, callback);
                });
                return;
            }
            var self = this;
            var req = this.db.transaction(self.record).objectStore(this.record).openCursor(getIDBKeyRange().only(key));
            req.onsuccess = function(event) {
                req.onsuccess = req.onerror = null;
                var undef;
                self.lambda(callback).call(self, event.target.result !== null && event.target.result !== undef);
            };
            req.onerror = function(event) {
                req.onsuccess = req.onerror = null;
                fail(event);
            };
            return this;
        },
        all: function(callback) {
            if (!this.store) {
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
                    cursor["continue"]();
                } else {
                    if (cb) cb.call(self, toReturn);
                }
            };
            return this;
        },
        keys: function(callback) {
            if (!this.store) {
                this.waiting.push(function() {
                    this.keys(callback);
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
                    toReturn.push(cursor.key);
                    cursor["continue"]();
                } else {
                    if (cb) cb.call(self, toReturn);
                }
            };
            return this;
        },
        remove: function(keyOrArray, callback) {
            if (!this.store) {
                this.waiting.push(function() {
                    this.remove(keyOrArray, callback);
                });
                return;
            }
            var self = this;
            var toDelete = keyOrArray;
            if (!this.isArray(keyOrArray)) {
                toDelete = [ keyOrArray ];
            }
            var win = function() {
                if (callback) self.lambda(callback).call(self);
            };
            var os = this.db.transaction(this.record, READ_WRITE).objectStore(this.record);
            var key = keyOrArray.key ? keyOrArray.key : keyOrArray;
            for (var i = 0; i < toDelete.length; i++) {
                var key = toDelete[i].key ? toDelete[i].key : toDelete[i];
                os["delete"](key);
            }
            os.transaction.oncomplete = win;
            os.transaction.onabort = fail;
            return this;
        },
        nuke: function(callback) {
            if (!this.store) {
                this.waiting.push(function() {
                    this.nuke(callback);
                });
                return;
            }
            var self = this, win = callback ? function() {
                self.lambda(callback).call(self);
            } : function() {};
            try {
                var os = this.db.transaction(this.record, READ_WRITE).objectStore(this.record);
                os.clear();
                os.transaction.oncomplete = win;
                os.transaction.onabort = fail;
            } catch (e) {
                if (e.name == "NotFoundError") win(); else fail(e);
            }
            return this;
        }
    };
}());

Lawnchair.adapter("webkit-sqlite", function() {
    var fail = function(e, i) {
        console.error("error in sqlite adaptor!", e, i);
    }, now = function() {
        return new Date();
    };
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(obj) {
            var slice = [].slice, args = slice.call(arguments, 1), self = this, nop = function() {}, bound = function() {
                return self.apply(this instanceof nop ? this : obj || {}, args.concat(slice.call(arguments)));
            };
            nop.prototype = self.prototype;
            bound.prototype = new nop();
            return bound;
        };
    }
    return {
        valid: function() {
            return !!window.openDatabase;
        },
        init: function(options, callback) {
            var that = this, cb = that.fn(that.name, callback), create = "CREATE TABLE IF NOT EXISTS " + this.record + " (id NVARCHAR(32) UNIQUE PRIMARY KEY, value TEXT, timestamp REAL)", win = function() {
                if (cb) return cb.call(that, that);
            };
            if (cb && typeof cb != "function") throw "callback not valid";
            this.db = openDatabase(this.name, "1.0.0", this.name, options.maxSize || 65536);
            this.db.transaction(function(t) {
                t.executeSql(create, []);
            }, fail, win);
        },
        keys: function(callback) {
            var cb = this.lambda(callback), that = this, keys = "SELECT id FROM " + this.record + " ORDER BY timestamp DESC";
            this.db.readTransaction(function(t) {
                var win = function(xxx, results) {
                    if (results.rows.length == 0) {
                        cb.call(that, []);
                    } else {
                        var r = [];
                        for (var i = 0, l = results.rows.length; i < l; i++) {
                            r.push(results.rows.item(i).id);
                        }
                        cb.call(that, r);
                    }
                };
                t.executeSql(keys, [], win, fail);
            });
            return this;
        },
        save: function(obj, callback, error) {
            var that = this, objs = (this.isArray(obj) ? obj : [ obj ]).map(function(o) {
                if (!o.key) {
                    o.key = that.uuid();
                }
                return o;
            }), ins = "INSERT OR REPLACE INTO " + this.record + " (value, timestamp, id) VALUES (?,?,?)", win = function() {
                if (callback) {
                    that.lambda(callback).call(that, that.isArray(obj) ? objs : objs[0]);
                }
            }, error = error || null, insvals = [], ts = now();
            try {
                for (var i = 0, l = objs.length; i < l; i++) {
                    insvals[i] = [ JSON.stringify(objs[i]), ts, objs[i].key ];
                }
            } catch (e) {
                error ? error(e) : fail(e);
                throw e;
            }
            that.db.transaction(function(t) {
                for (var i = 0, l = objs.length; i < l; i++) t.executeSql(ins, insvals[i]);
            }, error ? error : fail, win);
            return this;
        },
        batch: function(objs, callback) {
            return this.save(objs, callback);
        },
        get: function(keyOrArray, cb) {
            var that = this, sql = "", args = this.isArray(keyOrArray) ? keyOrArray : [ keyOrArray ];
            sql = "SELECT id, value FROM " + this.record + " WHERE id IN (" + args.map(function() {
                return "?";
            }).join(",") + ")";
            var win = function(xxx, results) {
                var o, r, lookup = {};
                for (var i = 0, l = results.rows.length; i < l; i++) {
                    o = JSON.parse(results.rows.item(i).value);
                    o.key = results.rows.item(i).id;
                    lookup[o.key] = o;
                }
                r = args.map(function(key) {
                    return lookup[key];
                });
                if (!that.isArray(keyOrArray)) r = r.length ? r[0] : null;
                if (cb) that.lambda(cb).call(that, r);
            };
            this.db.readTransaction(function(t) {
                t.executeSql(sql, args, win, fail);
            });
            return this;
        },
        exists: function(key, cb) {
            var is = "SELECT * FROM " + this.record + " WHERE id = ?", that = this, win = function(xxx, results) {
                if (cb) that.fn("exists", cb).call(that, results.rows.length > 0);
            };
            this.db.readTransaction(function(t) {
                t.executeSql(is, [ key ], win, fail);
            });
            return this;
        },
        all: function(callback) {
            var that = this, all = "SELECT * FROM " + this.record, r = [], cb = this.fn(this.name, callback) || undefined, win = function(xxx, results) {
                if (results.rows.length != 0) {
                    for (var i = 0, l = results.rows.length; i < l; i++) {
                        var obj = JSON.parse(results.rows.item(i).value);
                        obj.key = results.rows.item(i).id;
                        r.push(obj);
                    }
                }
                if (cb) cb.call(that, r);
            };
            this.db.readTransaction(function(t) {
                t.executeSql(all, [], win, fail);
            });
            return this;
        },
        remove: function(keyOrArray, cb) {
            var that = this, args, sql = "DELETE FROM " + this.record + " WHERE id ", win = function() {
                if (cb) that.lambda(cb).call(that);
            };
            if (!this.isArray(keyOrArray)) {
                sql += "= ?";
                args = [ keyOrArray ];
            } else {
                args = keyOrArray;
                sql += "IN (" + args.map(function() {
                    return "?";
                }).join(",") + ")";
            }
            args = args.map(function(obj) {
                return obj.key ? obj.key : obj;
            });
            this.db.transaction(function(t) {
                t.executeSql(sql, args, win, fail);
            });
            return this;
        },
        nuke: function(cb) {
            var nuke = "DELETE FROM " + this.record, that = this, win = cb ? function() {
                that.lambda(cb).call(that);
            } : function() {};
            this.db.transaction(function(t) {
                t.executeSql(nuke, [], win, fail);
            });
            return this;
        }
    };
}());

window.getQueryParams = function(qs) {
    qs = qs.split("+").join(" ");
    var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }
    return params;
};

var jWorkflow = function() {
    function _valid(func) {
        if (typeof func !== "function") {
            throw "expected function but was " + typeof func;
        }
    }
    function _isWorkflow(func) {
        return typeof func.andThen === "function" && typeof func.start === "function" && typeof func.chill === "function";
    }
    function _isArray(func) {
        return !!func.map && !!func.reduce;
    }
    var transfunctioner = {
        order: function(func, context) {
            var _workflow = [], _tasks, _callback = null, _baton = function() {
                var _taken = false;
                return {
                    take: function() {
                        _taken = true;
                    },
                    pass: function(result) {
                        var task;
                        _taken = false;
                        if (_tasks.length) {
                            task = _tasks.shift();
                            result = task.func.apply(task.context, [ result, _baton ]);
                            if (!_taken) {
                                _baton.pass(result);
                            }
                        } else {
                            if (_callback.func) {
                                _callback.func.apply(_callback.context, [ result ]);
                            }
                        }
                    },
                    drop: function(result) {
                        _taken = true;
                        _tasks = [];
                        setTimeout(function() {
                            _baton.pass(result);
                        }, 1);
                    }
                };
            }(), _self = {
                andThen: function(func, context) {
                    if (_isWorkflow(func)) {
                        var f = function(prev, baton) {
                            baton.take();
                            func.start({
                                callback: function(result) {
                                    baton.pass(result);
                                },
                                context: context,
                                initialValue: prev
                            });
                        };
                        _workflow.push({
                            func: f,
                            context: context
                        });
                    } else if (_isArray(func)) {
                        var orch = function(prev, baton) {
                            baton.take();
                            var l = func.length, join = function() {
                                return --l || baton.pass();
                            };
                            func.forEach(function(f) {
                                jWorkflow.order(f).start(join);
                            });
                        };
                        _workflow.push({
                            func: orch,
                            context: context
                        });
                    } else {
                        _valid(func);
                        _workflow.push({
                            func: func,
                            context: context
                        });
                    }
                    return _self;
                },
                chill: function(time) {
                    return _self.andThen(function(prev, baton) {
                        baton.take();
                        setTimeout(function() {
                            baton.pass(prev);
                        }, time);
                    });
                },
                start: function() {
                    var callback, context, initialValue;
                    if (arguments[0] && typeof arguments[0] === "object") {
                        callback = arguments[0].callback;
                        context = arguments[0].context;
                        initialValue = arguments[0].initialValue;
                    } else {
                        callback = arguments[0];
                        context = arguments[1];
                    }
                    _callback = {
                        func: callback,
                        context: context
                    };
                    _tasks = _workflow.slice();
                    _baton.pass(initialValue);
                }
            };
            return func ? _self.andThen(func, context) : _self;
        }
    };
    return transfunctioner;
}();

if (typeof module === "object" && typeof require === "function") {
    module.exports = jWorkflow;
}

util.scoped(function() {
    "use strict";
    var ua = window.navigator.userAgent.toLowerCase(), mobile = /mobile|android|kindle|silk|midp|(windows nt 6\.2.+arm|touch)/.test(ua);
    ua = /(chrome|firefox)[ \/]([\w.]+)/.exec(ua) || /(iphone|ipad|ipod)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || /(android)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || /(webkit|opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || [];
    var browser = ua[1], version = parseFloat(ua[2]);
    switch (browser) {
      case "msie":
        browser = "ie";
        version = doc.documentMode || version;
        break;

      case "firefox":
        browser = "ff";
        break;

      case "ipod":
      case "ipad":
      case "iphone":
        browser = "ios";
        break;

      case "webkit":
        browser = "safari";
        break;
    }
    window.Browser = {
        name: browser,
        mobile: mobile,
        version: version
    };
    Browser[browser] = true;
});

var view = window.view = {};

window.onerror = function(e) {
    controller.showErrorPanel("Critical Game Fault", e.stack);
};

util.singleLazyCall = function(fn) {
    var called = false;
    return function() {
        if (called) assert(false, "this function cannot be called twice");
        fn.apply(null, arguments);
    };
};

util.iterateListByFlow = function(flow, list, cb) {
    var data = {
        i: 0,
        list: list
    };
    for (var i = 0, e = list.length; i < e; i++) {
        flow.andThen(function(p, b) {
            cb.call(this, p, b);
            this.i++;
        }, data);
    }
    flow.andThen(function(data) {
        assert(list === this.list);
        assert(this.i === this.list.length);
    }, data);
};

util.scoped(function() {
    var xmlHttpReq;
    try {
        new XMLHttpRequest();
        xmlHttpReq = true;
    } catch (ex) {
        xmlHttpReq = false;
    }
    function reqListener() {
        if (this.readyState == 4) {
            if (this.readyState == 4 && this.status == 200) {
                util.log("grabbed file successfully");
                if (this.asJSON) {
                    var arg;
                    try {
                        arg = JSON.parse(this.responseText);
                    } catch (e) {
                        this.failCallback(e);
                    }
                    this.winCallback(arg);
                } else {
                    this.winCallback(this.responseText);
                }
            } else {
                util.log("could not grab file");
                this.failCallback(this.statusText);
            }
        }
    }
    util.grabRemoteFile = function(options) {
        var oReq;
        util.log("try to grab file", options.path);
        if (xmlHttpReq) oReq = new XMLHttpRequest(); else oReq = new ActiveXObject("Microsoft.XMLHTTP");
        oReq.asJSON = options.json;
        oReq.winCallback = options.success;
        oReq.failCallback = options.error;
        oReq.onreadystatechange = reqListener;
        oReq.open("get", options.path, true);
        oReq.send();
    };
});

util.scoped(function() {
    var selection = controller.stateMachine.data.selection;
    var animations = [ 0, 3, 0, 250, 0, 0, 3, 0, 250, 0, 0, 7, 0, 150, 0, 0, 20, 0, 300, 0, 0, 4, 0, 400, 0, 0, 4, 0, 300, 0 ];
    var unitStepper = +1;
    view.getSpriteStep = function(key) {
        switch (key) {
          case "UNIT":
            return animations[0];

          case "UNIT_SIMPLE":
            return animations[5];

          case "SELECTION":
            return animations[10];

          case "STATUS":
            return animations[15];

          case "PROPERTY":
            return animations[20];

          case "ANIM_TILES":
            return animations[25];
        }
        return 0;
    };
    view.updateSpriteAnimations = function(delta) {
        var flagged = false;
        for (var i = 0, e = animations.length; i < e; i += 5) {
            animations[i + 2] += delta;
            if (animations[i + 2] >= animations[i + 3]) {
                animations[i + 2] = 0;
                if (i === 0) {
                    animations[i] += unitStepper;
                    if (unitStepper === -1) {
                        if (animations[i] === -1) {
                            animations[i] = 1;
                            unitStepper = +1;
                        }
                    } else {
                        if (animations[i] === animations[i + 1]) {
                            animations[i] = animations[i + 1] - 2;
                            unitStepper = -1;
                        }
                    }
                } else {
                    animations[i] += 1;
                    if (animations[i] === animations[i + 1]) animations[i] = 0;
                }
                flagged = true;
                animations[i + 4] = 1;
                if (flagged) {
                    var x = 0;
                    var yS = 0;
                    var xe = model.map_width;
                    var ye = model.map_height;
                    if (animations[4] === 1 || animations[9] === 1 || animations[24] === 1 || animations[29] === 1) {
                        for (;x < xe; x++) {
                            for (var y = yS; y < ye; y++) {
                                if (animations[4] === 1 || animations[9] === 1) {
                                    if (model.unit_posData[x][y] !== null) view.redraw_markPosWithNeighboursRing(x, y);
                                }
                                if (animations[24] === 1) {
                                    if (model.property_posMap[x][y] !== null) view.redraw_markPosWithNeighboursRing(x, y);
                                }
                                if (animations[29] === 1) {
                                    if (view.animatedTiles[view.mapImages[x][y]]) view.redraw_markPos(x, y);
                                }
                            }
                        }
                    }
                    var focusExists = controller.stateMachine.state === "MOVEPATH_SELECTION" || controller.stateMachine.state === "ACTION_SELECT_TARGET_A" || controller.stateMachine.state === "ACTION_SELECT_TARGET_B" || controller.attackRangeVisible;
                    if (focusExists && animations[14] === 1) {
                        selection.rerenderNonInactive();
                    }
                }
                animations[4] = 0;
                animations[9] = 0;
                animations[14] = 0;
                animations[19] = 0;
                animations[24] = 0;
                animations[29] = 0;
            }
        }
    };
});

controller.audio_SFX_STORAGE_PARAMETER = "volume_sfx";

controller.audio_MUSIC_STORAGE_PARAMETER = "music_sfx";

controller.audio_ctx_ = false;

controller.audio_gainNode_music_ = null;

controller.audio_gainNode_sfx_ = null;

controller.audio_initialize = function(p, b) {
    util.log("initializing audio context");
    if (!controller.features_client.audioSFX && !controller.features_client.audioMusic) {
        controller.audio_ctx_ = null;
        return null;
    }
    try {
        if (window.AudioContext) controller.audio_ctx_ = new window.AudioContext(); else if (window.webkitAudioContext) controller.audio_ctx_ = new window.webkitAudioContext(); else throw Error("no AudioContext constructor found");
        controller.audio_gainNode_sfx_ = controller.audio_ctx_.createGainNode();
        controller.audio_gainNode_sfx_.gain.value = 1;
        controller.audio_gainNode_sfx_.connect(controller.audio_ctx_.destination);
        controller.audio_gainNode_music_ = controller.audio_ctx_.createGainNode();
        controller.audio_gainNode_music_.gain.value = .5;
        controller.audio_gainNode_music_.connect(controller.audio_ctx_.destination);
        controller.storage_general.get(controller.audio_SFX_STORAGE_PARAMETER, function(obj) {
            if (obj) controller.audio_gainNode_sfx_.gain.value = obj.value;
        });
        controller.storage_general.get(controller.audio_MUSIC_STORAGE_PARAMETER, function(obj) {
            if (obj) controller.audio_gainNode_music_.gain.value = obj.value;
        });
    } catch (e) {
        if (DEBUG) util.log("could not grab audio context (Error:", e, ")");
    }
};

controller.audio_grabContext = function() {
    return controller.audio_ctx_;
};

controller.audio_buffer_ = {};

controller.audio_currentMusic_ = null;

controller.audio_currentMusicId_ = null;

controller.audio_registerAudioBuffer = function(id, buff) {
    if (DEBUG) util.log("register", id, "in the audio cache");
    controller.audio_buffer_[id] = buff;
};

controller.audio_loadByArrayBuffer = function(id, audioData, callback) {
    assert(util.isString(id));
    if (DEBUG) util.log("decode audio data of", id);
    controller.audio_grabContext().decodeAudioData(audioData, function(buffer) {
        controller.audio_registerAudioBuffer(id, buffer);
        if (callback) callback(true, id);
    }, function(e) {
        if (callback) callback(false, id);
    });
};

controller.audio_unloadBuffer = function(id) {
    assert(util.isString(id));
    if (DEBUG) util.log("de-register", id, "from the audio cache");
    delete controller.audio_buffer_[id];
};

controller.audio_isBuffered = function(id) {
    return controller.audio_buffer_.hasOwnProperty(id);
};

controller.audio_getSfxVolume = function() {
    if (!controller.audio_ctx_) return;
    return controller.audio_gainNode_sfx_.gain.value;
};

controller.audio_getMusicVolume = function() {
    if (!controller.audio_ctx_) return;
    return controller.audio_gainNode_music_.gain.value;
};

controller.audio_setSfxVolume = function(vol) {
    if (!controller.audio_ctx_) return;
    if (vol < 0) vol = 0; else if (vol > 1) vol = 1;
    controller.audio_gainNode_sfx_.gain.value = vol;
};

controller.audio_setMusicVolume = function(vol) {
    if (!controller.audio_ctx_) return;
    if (vol < 0) vol = 0; else if (vol > 1) vol = 1;
    controller.audio_gainNode_music_.gain.value = vol;
};

controller.audio_saveConfigs = function() {
    if (controller.audio_gainNode_sfx_) {
        controller.storage_general.set(controller.audio_SFX_STORAGE_PARAMETER, controller.audio_gainNode_sfx_.gain.value);
    }
    if (controller.audio_gainNode_music_) {
        controller.storage_general.set(controller.audio_MUSIC_STORAGE_PARAMETER, controller.audio_gainNode_music_.gain.value);
    }
};

controller.audio_playSound = function(id, loop, isMusic) {
    if (!controller.audio_ctx_) return;
    if (!controller.audio_buffer_[id]) return;
    var gainNode = isMusic ? controller.audio_gainNode_music_ : controller.audio_gainNode_sfx_;
    var source = controller.audio_ctx_.createBufferSource();
    if (loop) source.loop = true;
    source.buffer = controller.audio_buffer_[id];
    source.connect(gainNode);
    source.noteOn(0);
    return source;
};

controller.audio_playNullSound = function() {
    if (!controller.audio_ctx_) return;
    var context = controller.audio_ctx_;
    var buffer = context.createBuffer(1, 1, 22050);
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.noteOn(0);
};

controller.audio_playMusic = function(id) {
    if (!controller.audio_ctx_) return;
    if (controller.audio_currentMusicId_ === id) return;
    if (!controller.audio_buffer_[id]) return;
    controller.audio_stopMusic();
    controller.audio_currentMusic_ = controller.audio_playSound(id, true, true);
    controller.audio_currentMusicId_ = id;
};

controller.audio_stopMusic = function() {
    if (controller.audio_currentMusic_) {
        controller.audio_currentMusic_.noteOff(0);
        controller.audio_currentMusic_.disconnect(0);
    }
    controller.audio_currentMusic_ = null;
    controller.audio_currentMusicId_ = null;
};

controller.background_cssEl_ = null;

controller.background_registerAsBackground = function(base64) {
    assert(util.isString(base64) && base64.length > 0);
    if (!controller.background_cssEl_) {
        controller.background_cssEl_ = document.createElement("style");
        document.getElementsByTagName("head")[0].appendChild(controller.background_cssEl_);
    }
    controller.background_cssEl_.innerHTML = ".cwt_page {" + "background-image: url(data:image/jpeg;base64," + base64 + ");" + "background-repeat: no-repeat;" + "background-position: 0px 45px;" + "background-size: 100% calc(100% - 44px);" + "}";
};

controller.BUTTON_GROUP_DEFAULT_STYLE = "cwt_panel_header_big cwt_page_button cwt_panel_button";

controller.BUTTON_GROUP_DEFAULT_STYLE_ACT = "cwt_panel_header_big cwt_page_button cwt_panel_button active";

controller.BUTTON_GROUP_DEFAULT_STYLE_INACT = "cwt_panel_header_big cwt_page_button cwt_panel_button inactive";

controller.ButtonGroup = {
    changeIndex: function(mode, relative) {
        if (relative === undefined) relative = true;
        if (this.index !== -1) this.elements[this.index].className = this.cls;
        if (relative) {
            if (mode > 0) {
                this.index++;
                if (this.index >= this.elements.length) this.index = 0;
            } else {
                this.index--;
                if (this.index < 0) this.index = this.elements.length - 1;
            }
        } else {
            if (mode < 0 || mode >= this.elements.length) {
                this.index = 0;
            } else this.index = mode;
        }
        if (!this.elements[this.index].attributes.inactive || this.elements[this.index].attributes.inactive.value !== "true") {
            vl = this.cls_act;
        } else vl = this.cls_inact;
        this.elements[this.index].className = vl;
    },
    increaseIndex: function(amount) {
        this.changeIndex(1, true);
    },
    decreaseIndex: function() {
        this.changeIndex(-1, true);
    },
    setIndex: function(value) {
        this.changeIndex(value, false);
    },
    isIndexInactive: function() {
        return this.elements[this.index].attributes.inactive && this.elements[this.index].attributes.inactive.value === "true";
    },
    getActiveKey: function() {
        return this.elements[this.index].attributes.key.value;
    },
    getActiveData: function() {
        return this.elements[this.index].attributes.data.value;
    },
    getActiveElement: function() {
        return this.elements[this.index];
    }
};

controller.registerButtonGroupHover = function(group, element, i) {
    element.onmouseover = function() {
        group.setIndex(i, false);
    };
};

controller.generateButtonGroup = function(parent, normalCls, activeCls, inactiveCls) {
    var buttons = parent.getElementsByTagName("button");
    var grp = Object.create(controller.ButtonGroup);
    grp.index = 0;
    grp.elements = buttons;
    if (arguments.length === 1) {
        normalCls = controller.BUTTON_GROUP_DEFAULT_STYLE;
        activeCls = controller.BUTTON_GROUP_DEFAULT_STYLE_ACT;
        inactiveCls = controller.BUTTON_GROUP_DEFAULT_STYLE_INACT;
    }
    grp.cls = normalCls;
    grp.cls_act = activeCls;
    grp.cls_inact = inactiveCls;
    for (var i = 0, e = buttons.length; i < e; i++) {
        buttons[i].className = grp.cls;
        controller.registerButtonGroupHover(grp, buttons[i], i);
    }
    grp.setIndex(0);
    return grp;
};

controller.mapCursorX = 0;

controller.mapCursorY = 0;

controller.resetMapCursor = function() {
    controller.mapCursorX = 0;
    controller.mapCursorY = 0;
};

controller.cursorAction = function(isCancel) {
    if (controller.inAnimationHookPhase()) return;
    var bstate = controller.stateMachine.state;
    var bfocus = bstate === "MOVEPATH_SELECTION" || bstate === "IDLE_R" || bstate === "ACTION_SELECT_TARGET_A" || bstate === "ACTION_SELECT_TARGET_B";
    if (isCancel) {
        controller.stateMachine.event("cancel", controller.mapCursorX, controller.mapCursorY);
    } else {
        if (controller.menuCursorIndex !== -1) {
            controller.stateMachine.event("action", controller.menuCursorIndex);
        } else {
            controller.stateMachine.event("action", controller.mapCursorX, controller.mapCursorY);
        }
    }
    var astate = controller.stateMachine.state;
    var afocus = astate === "MOVEPATH_SELECTION" || astate === "IDLE_R" || astate === "ACTION_SELECT_TARGET_A" || astate === "ACTION_SELECT_TARGET_B";
    if (bfocus && !afocus || afocus) {
        view.redraw_markSelection(controller.stateMachine.data);
    }
    if (astate === "ACTION_MENU" || astate === "ACTION_SUBMENU") {
        var menu = controller.stateMachine.data.menu;
        controller.showMenu(menu, controller.mapCursorX, controller.mapCursorY);
    } else {
        if (bstate === "ACTION_MENU" || bstate === "ACTION_SUBMENU") controller.hideMenu();
    }
};

controller.cursorActionCancel = function() {
    controller.cursorAction(true);
    controller.audio_playSound(model.data_sounds.CANCEL);
};

controller.cursorActionClick = function() {
    controller.cursorAction(false);
    controller.audio_playSound(model.data_sounds.MENUTICK);
};

controller.moveCursor = function(dir, len) {
    if (arguments.length === 1) len = 1;
    var x = controller.mapCursorX;
    var y = controller.mapCursorY;
    switch (dir) {
      case model.move_MOVE_CODES.UP:
        y--;
        break;

      case model.move_MOVE_CODES.RIGHT:
        x++;
        break;

      case model.move_MOVE_CODES.DOWN:
        y++;
        break;

      case model.move_MOVE_CODES.LEFT:
        x--;
        break;
    }
    controller.setCursorPosition(x, y);
};

controller.setCursorPosition = function(x, y, relativeToScreen) {
    if (controller.isMenuOpen()) return;
    if (relativeToScreen) {
        x = x + controller.screenX;
        y = y + controller.screenY;
    }
    if (!model.map_isValidPosition(x, y)) {
        return;
    }
    if (x === controller.mapCursorX && y === controller.mapCursorY) return;
    view.redraw_markPos(controller.mapCursorX, controller.mapCursorY);
    if (controller.mapCursorY < model.map_height - 1) view.redraw_markPos(controller.mapCursorX, controller.mapCursorY + 1);
    controller.audio_playSound(model.data_sounds.MAPTICK);
    view.redraw_markPos(controller.mapCursorX, controller.mapCursorY);
    controller.mapCursorX = x;
    controller.mapCursorY = y;
    controller.updateSimpleTileInformation();
    var scale = controller.screenScale;
    if (scale === 0) scale = .8; else if (scale === -1) scale = .7;
    var scw = parseInt(parseInt((window.innerWidth - 80) / 16, 10) / scale, 10);
    var sch = parseInt(parseInt((window.innerHeight - 80) / 16, 10) / scale, 10);
    if (controller.sideSimpleTileInformationPanel < 0 && x - controller.screenX < scw * .25) controller.moveSimpleTileInformationToRight();
    if (controller.sideSimpleTileInformationPanel > 0 && x - controller.screenX >= scw * .75) controller.moveSimpleTileInformationToLeft();
    var moveCode = -1;
    if (x - controller.screenX <= 1) moveCode = model.move_MOVE_CODES.LEFT; else if (x - controller.screenX >= scw - 1) moveCode = model.move_MOVE_CODES.RIGHT; else if (y - controller.screenY <= 1) moveCode = model.move_MOVE_CODES.UP; else if (y - controller.screenY >= sch - 1) moveCode = model.move_MOVE_CODES.DOWN;
    if (moveCode !== -1) {
        controller.shiftScreenPosition(moveCode, 5);
    }
    if (DEBUG) {
        util.log("set cursor position to", x, y, "screen node is at", controller.screenX, controller.screenY);
    }
    view.redraw_markPos(x, y);
};

util.scoped(function() {
    var errorPanel = document.getElementById("cwt_errorPanel");
    var header = document.getElementById("cwt_errorPanel_reason");
    var stack = document.getElementById("cwt_errorPanel_data");
    controller.errorButtons = controller.generateButtonGroup(errorPanel, "cwt_panel_header_small cwt_page_button cwt_panel_button", "cwt_panel_header_small cwt_page_button cwt_panel_button button_active", "cwt_panel_header_small cwt_page_button cwt_panel_button button_inactive");
    controller.errorPanelVisible = false;
    controller.showErrorPanel = function(msg, type, stackData) {
        stack.innerHTML = msg;
        header.innerHTML = type;
        errorPanel.style.display = "block";
        controller.errorPanelVisible = true;
    };
    controller.hideErrorPanel = function() {
        errorPanel.style.display = "none";
        controller.errorPanelVisible = false;
    };
});

controller.features_client = {
    audioSFX: false,
    audioMusic: false,
    gamePad: false,
    keyboard: false,
    mouse: false,
    touch: false,
    supported: false,
    scaledImg: false
};

controller.features_analyseClient = function() {
    if (Browser.mobile) {
        if (Browser.ios) {
            if (Browser.version >= 5) controller.features_client.supported = true;
            if (Browser.version >= 6) controller.features_client.audioSFX = true;
        } else if (Browser.android) {
            controller.features_client.supported = true;
        }
        controller.features_client.touch = true;
    } else {
        if (Browser.chrome || Browser.safari) {
            controller.features_client.supported = true;
            controller.features_client.audioSFX = true;
            controller.features_client.audioMusic = true;
        }
        if (Browser.chrome) controller.features_client.gamePad = true;
        controller.features_client.mouse = true;
        controller.features_client.keyboard = true;
    }
};

util.scoped(function() {
    var activeHock = null;
    var hasHocks = false;
    var savedDelta = 0;
    function tryToPopNextHook() {
        if (!view.hooksBuffer.isEmpty()) {
            hasHocks = true;
            var data = view.hooksBuffer.pop();
            var key = data[data.length - 1];
            activeHock = view.animationHooks[key];
            activeHock.prepare.apply(activeHock, data);
        } else hasHocks = false;
    }
    controller.prepareGameLoop = function() {
        savedDelta = 0;
    };
    controller.gameLoop = function(delta) {
        savedDelta += delta;
        controller.updateInputCoolDown(delta);
        var inMove = controller.moveScreenX !== 0 || controller.moveScreenY !== 0;
        if (inMove) controller.solveMapShift(); else {
            if (view.hasInfoMessage()) {
                view.updateMessagePanelTime(delta);
            } else {
                if (!hasHocks) {
                    controller.update_tickFrame(savedDelta);
                    savedDelta = 0;
                    tryToPopNextHook();
                } else {
                    activeHock.update(delta);
                    if (activeHock.isDone()) tryToPopNextHook();
                }
            }
            view.updateSpriteAnimations(delta);
        }
        if (view.redraw_dataChanges > 0) view.renderMap(controller.screenScale);
        if (hasHocks) {
            activeHock.render();
        } else {
            if (controller.stateMachine.state === "ACTION_SELECT_TILE") {
                var r = view.selectionRange;
                var x = controller.mapCursorX;
                var y = controller.mapCursorY;
                var lX;
                var hX;
                var lY = y - r;
                var hY = y + r;
                if (lY < 0) lY = 0;
                if (hY >= model.map_height) hY = model.map_height - 1;
                for (;lY <= hY; lY++) {
                    var disY = Math.abs(lY - y);
                    lX = x - r + disY;
                    hX = x + r - disY;
                    if (lX < 0) lX = 0;
                    if (hX >= model.map_width) hX = model.map_width - 1;
                    for (;lX <= hX; lX++) {
                        view.redraw_markPos(lX, lY);
                    }
                }
            }
        }
    };
    controller.inGameLoop = false;
    controller.inAnimationHookPhase = function() {
        return hasHocks;
    };
});

view.hooksBuffer = util.createRingBuffer(50);

view.animationHooks = {};

view.registerAnimationHook = function(impl) {
    var key = impl.key;
    if (view.animationHooks.hasOwnProperty(key)) {
        assert(false, "animation algorithm for", key, "is already registered");
    }
    view.animationHooks[key] = impl;
    model.event_on(key, function() {
        var data = [];
        for (var i = 0, e = arguments.length; i < e; i++) data[i] = arguments[i];
        data[data.length] = key;
        view.hooksBuffer.push(data);
    });
    impl.isEnabled = true;
};

view.IMAGE_CODE_IDLE = "IDLE";

view.IMAGE_CODE_IDLE_INVERTED = "IDLE_R";

view.IMAGE_CODE_RIGHT = "RIGHT";

view.IMAGE_CODE_LEFT = "LEFT";

view.IMAGE_CODE_UP = "UP";

view.IMAGE_CODE_DOWN = "DOWN";

view.IMAGE_CODE_STATELESS = "STATELESS";

view.COLOR_RED = "RED";

view.COLOR_GREEN = "GREEN";

view.COLOR_BLUE = "BLUE";

view.COLOR_YELLOW = "YELLOW";

view.COLOR_BLACK_MASK = "BLACK_MASK";

view.COLOR_NEUTRAL = "GRAY";

view.COLOR_NONE = "NONE";

view.IMG_COLOR_MAP_PROPERTIES_ID = "IMG_MAP_PROPERTY";

view.IMG_COLOR_MAP_UNITS_ID = "IMG_MAP_UNIT";

view.CodeStatelessview = {
    RED: {},
    BLUE: {},
    YELLOW: {},
    GREEN: {},
    BLACK_MASK: {},
    NONE: {},
    GRAY: {}
};

view.overlayImages = {};

view.animatedTiles = {};

view.CodeIdleview = {
    RED: {},
    BLUE: {},
    YELLOW: {},
    GREEN: {},
    BLACK_MASK: {}
};

view.CodeIdleInvertedview = {
    RED: {},
    BLUE: {},
    YELLOW: {},
    GREEN: {},
    BLACK_MASK: {}
};

view.CodeRightview = {
    RED: {},
    BLUE: {},
    YELLOW: {},
    GREEN: {},
    BLACK_MASK: {}
};

view.CodeLeftview = {
    RED: {},
    BLUE: {},
    YELLOW: {},
    GREEN: {},
    BLACK_MASK: {}
};

view.CodeUpview = {
    RED: {},
    BLUE: {},
    YELLOW: {},
    GREEN: {},
    BLACK_MASK: {}
};

view.CodeDownview = {
    RED: {},
    BLUE: {},
    YELLOW: {},
    GREEN: {},
    BLACK_MASK: {}
};

view.setImageForType = function(image, type, state, color) {
    if (state === undefined) state = view.IMAGE_CODE_STATELESS;
    if (color === undefined) color = view.COLOR_NONE;
    switch (state) {
      case view.IMAGE_CODE_IDLE:
        view.CodeIdleview[color][type] = image;
        break;

      case view.IMAGE_CODE_STATELESS:
        view.CodeStatelessview[color][type] = image;
        break;

      case view.IMAGE_CODE_IDLE_INVERTED:
        view.CodeIdleInvertedview[color][type] = image;
        break;

      case view.IMAGE_CODE_LEFT:
        view.CodeLeftview[color][type] = image;
        break;

      case view.IMAGE_CODE_RIGHT:
        view.CodeRightview[color][type] = image;
        break;

      case view.IMAGE_CODE_DOWN:
        view.CodeDownview[color][type] = image;
        break;

      case view.IMAGE_CODE_UP:
        view.CodeUpview[color][type] = image;
        break;

      default:
        assert(false, "unknown image state code ", state);
    }
};

view.setUnitImageForType = view.setImageForType;

view.setPropertyImageForType = function(image, type, color) {
    view.setImageForType(image, type, view.IMAGE_CODE_STATELESS, color);
};

view.setTileImageForType = function(image, type) {
    view.setImageForType(image, type, view.IMAGE_CODE_STATELESS, view.COLOR_NONE);
};

view.setTileShadowImageForType = function(image, type) {
    view.setImageForType(image, type, view.IMAGE_CODE_STATELESS, view.COLOR_BLACK_MASK);
};

view.setInfoImageForType = function(image, type) {
    view.setImageForType(image, type, view.IMAGE_CODE_STATELESS, view.COLOR_NONE);
};

view.getImageForType = function(type, code, color) {
    switch (code) {
      case view.IMAGE_CODE_IDLE:
        return view.CodeIdleview[color][type];

      case view.IMAGE_CODE_IDLE_INVERTED:
        return view.CodeIdleInvertedview[color][type];

      case view.IMAGE_CODE_LEFT:
        return view.CodeLeftview[color][type];

      case view.IMAGE_CODE_RIGHT:
        return view.CodeRightview[color][type];

      case view.IMAGE_CODE_DOWN:
        return view.CodeDownview[color][type];

      case view.IMAGE_CODE_UP:
        return view.CodeUpview[color][type];

      case view.IMAGE_CODE_STATELESS:
        return view.CodeStatelessview[color][type];

      default:
        assert(false, "unknown image state code ", code);
    }
};

view.getUnitImageForType = view.getImageForType;

view.getPropertyImageForType = function(type, color) {
    return view.getImageForType(type, view.IMAGE_CODE_STATELESS, color);
};

view.getTileImageForType = function(type) {
    return view.getImageForType(type, view.IMAGE_CODE_STATELESS, view.COLOR_NONE);
};

view.getTileShadowImageForType = function(type) {
    return view.getImageForType(type, view.IMAGE_CODE_STATELESS, view.COLOR_BLACK_MASK);
};

view.getInfoImageForType = function(type) {
    return view.getImageForType(type, view.IMAGE_CODE_STATELESS, view.COLOR_NONE);
};

view.imageProcessor_UNIT_INDEXES = {
    BLACK_MASK: 8,
    RED: 0,
    BLUE: 3,
    GREEN: 4,
    YELLOW: 5,
    colors: 6
};

view.imageProcessor_PROPERTY_INDEXES = {
    RED: 0,
    GRAY: 1,
    BLUE: 3,
    GREEN: 4,
    YELLOW: 5,
    BLACK_MASK: 8,
    colors: 4
};

view.imageProcessor_getPropertyColorData = util.scoped(function() {
    var v = null;
    return function() {
        if (!v) v = view.imageProcessor_getImageDataArray(view.getInfoImageForType(view.IMG_COLOR_MAP_PROPERTIES_ID));
        return v;
    };
});

view.imageProcessor_getUnitColorData = util.scoped(function() {
    var v = null;
    return function() {
        if (!v) v = view.imageProcessor_getImageDataArray(view.getInfoImageForType(view.IMG_COLOR_MAP_UNITS_ID));
        return v;
    };
});

view.imageProcessor_getImageDataArray = function(image) {
    var canvas = document.createElement("canvas");
    var canvasContext = canvas.getContext("2d");
    var imgW = image.width;
    var imgH = image.height;
    canvas.width = imgW;
    canvas.height = imgH;
    canvasContext.drawImage(image, 0, 0);
    return canvasContext.getImageData(0, 0, imgW, imgH).data;
};

view.imageProcessor_flipImage = function(image, flipH, flipV) {
    var scaleH = flipH ? -1 : 1;
    var scaleV = flipV ? -1 : 1;
    var posX = flipH ? image.width * -1 : 0;
    var posY = flipV ? image.height * -1 : 0;
    var nCanvas = document.createElement("canvas");
    nCanvas.height = image.height;
    nCanvas.width = image.width;
    var nContext = nCanvas.getContext("2d");
    nContext.save();
    nContext.scale(scaleH, scaleV);
    nContext.drawImage(image, posX, posY, image.width, image.height);
    nContext.restore();
    return nCanvas;
};

view.imageProcessor_convertToBlackMask = function(image) {
    var canvas = document.createElement("canvas");
    var canvasContext = canvas.getContext("2d");
    var imgW = image.width;
    var imgH = image.height;
    canvas.width = imgW;
    canvas.height = imgH;
    canvasContext.drawImage(image, 0, 0);
    var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);
    for (var y = 0; y < imgPixels.height; y++) {
        for (var x = 0; x < imgPixels.width; x++) {
            var xi = y * 4 * imgPixels.width + x * 4;
            var oA = imgPixels.data[xi + 3];
            if (oA > 0) {
                imgPixels.data[xi] = 0;
                imgPixels.data[xi + 1] = 0;
                imgPixels.data[xi + 2] = 0;
            }
        }
    }
    canvasContext.putImageData(imgPixels, 0, 0);
    return canvas;
};

view.imageProcessor_replaceColors = function(image, colorData, numColors, oriIndex, replaceIndex) {
    var canvas = document.createElement("canvas");
    var canvasContext = canvas.getContext("2d");
    var imgW = image.width;
    var imgH = image.height;
    canvas.width = imgW;
    canvas.height = imgH;
    canvasContext.drawImage(image, 0, 0);
    var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);
    var oriStart = oriIndex * 4 * numColors;
    var replStart = replaceIndex * 4 * numColors;
    for (var y = 0; y < imgPixels.height; y++) {
        for (var x = 0; x < imgPixels.width; x++) {
            var xi = y * 4 * imgPixels.width + x * 4;
            var oR = imgPixels.data[xi];
            var oG = imgPixels.data[xi + 1];
            var oB = imgPixels.data[xi + 2];
            for (var n = 0, ne = numColors * 4; n < ne; n += 4) {
                var sR = colorData[oriStart + n];
                var sG = colorData[oriStart + n + 1];
                var sB = colorData[oriStart + n + 2];
                if (sR === oR && sG === oG && sB === oB) {
                    var r = replStart + n;
                    var rR = colorData[r];
                    var rG = colorData[r + 1];
                    var rB = colorData[r + 2];
                    imgPixels.data[xi] = rR;
                    imgPixels.data[xi + 1] = rG;
                    imgPixels.data[xi + 2] = rB;
                }
            }
        }
    }
    canvasContext.putImageData(imgPixels, 0, 0);
    return canvas;
};

view.imageProcessor_colorizeUnit = util.scoped(function() {
    var UNIT_STATES = [ view.IMAGE_CODE_IDLE, view.IMAGE_CODE_IDLE_INVERTED, view.IMAGE_CODE_DOWN, view.IMAGE_CODE_UP, view.IMAGE_CODE_RIGHT, view.IMAGE_CODE_LEFT ];
    return function(tp) {
        if (DEBUG) util.log("colorize type", tp);
        for (var si = 0, se = UNIT_STATES.length; si < se; si++) {
            var cCode = UNIT_STATES[si];
            var redPic = view.getUnitImageForType(tp, cCode, view.COLOR_RED);
            var IMG_MAP_UNIT = view.imageProcessor_getUnitColorData();
            var UNIT_INDEXES = view.imageProcessor_UNIT_INDEXES;
            view.setUnitImageForType(view.imageProcessor_replaceColors(redPic, IMG_MAP_UNIT, UNIT_INDEXES.colors, UNIT_INDEXES.RED, UNIT_INDEXES.BLUE), tp, cCode, view.COLOR_BLUE);
            view.setUnitImageForType(view.imageProcessor_replaceColors(redPic, IMG_MAP_UNIT, UNIT_INDEXES.colors, UNIT_INDEXES.RED, UNIT_INDEXES.GREEN), tp, cCode, view.COLOR_GREEN);
            view.setUnitImageForType(view.imageProcessor_replaceColors(redPic, IMG_MAP_UNIT, UNIT_INDEXES.colors, UNIT_INDEXES.RED, UNIT_INDEXES.YELLOW), tp, cCode, view.COLOR_YELLOW);
            view.setUnitImageForType(view.imageProcessor_convertToBlackMask(redPic), tp, cCode, view.COLOR_BLACK_MASK);
        }
    };
});

view.imageProcessor_colorizeProperty = function(tp) {
    if (DEBUG) util.log("colorize type", tp);
    var redPic = view.getPropertyImageForType(tp, view.COLOR_RED);
    var IMG_MAP_PROP = view.imageProcessor_getPropertyColorData();
    var PROPERTY_INDEXES = view.imageProcessor_PROPERTY_INDEXES;
    view.setPropertyImageForType(view.imageProcessor_replaceColors(redPic, IMG_MAP_PROP, PROPERTY_INDEXES.colors, PROPERTY_INDEXES.RED, PROPERTY_INDEXES.BLUE), tp, view.COLOR_BLUE);
    view.setPropertyImageForType(view.imageProcessor_replaceColors(redPic, IMG_MAP_PROP, PROPERTY_INDEXES.colors, PROPERTY_INDEXES.RED, PROPERTY_INDEXES.GREEN), tp, view.COLOR_GREEN);
    view.setPropertyImageForType(view.imageProcessor_replaceColors(redPic, IMG_MAP_PROP, PROPERTY_INDEXES.colors, PROPERTY_INDEXES.RED, PROPERTY_INDEXES.YELLOW), tp, view.COLOR_YELLOW);
    view.setPropertyImageForType(view.imageProcessor_replaceColors(redPic, IMG_MAP_PROP, PROPERTY_INDEXES.colors, PROPERTY_INDEXES.RED, PROPERTY_INDEXES.GRAY), tp, view.COLOR_NEUTRAL);
    view.setPropertyImageForType(view.imageProcessor_convertToBlackMask(redPic), tp, view.COLOR_BLACK_MASK);
};

view.imageProcessor_colorizeTile = function(tp) {
    if (DEBUG) util.log("colorize type", tp);
    view.setTileShadowImageForType(view.imageProcessor_convertToBlackMask(view.getTileImageForType(tp)), tp);
};

view.imageProcessor_cropMiscSprite = function(miscType) {
    if (miscType.length > 2) {
        if (DEBUG) util.log("crop misc sprite", miscType[0]);
        var img = view.getInfoImageForType(miscType[0]);
        var nCanvas = document.createElement("canvas");
        var nContext = nCanvas.getContext("2d");
        if (miscType.length > 6) {
            if (miscType[6] === true) {
                nCanvas.height = 32;
                nCanvas.width = 32 * 3;
                nCanvas = view.imageProcessor_flipImage(nCanvas, true, false);
                nContext = nCanvas.getContext("2d");
            } else if (miscType[6] === false) {
                nCanvas.height = 32;
                nCanvas.width = 32 * 3;
                nCanvas = view.imageProcessor_flipImage(nCanvas, false, true);
                nContext = nCanvas.getContext("2d");
            } else {
                nCanvas.height = 16;
                nCanvas.width = 16;
                nContext.save();
                nContext.translate(8, 8);
                nContext.rotate(miscType[6] * Math.PI / 180);
                nContext.translate(-8, -8);
            }
        } else {
            nCanvas.height = 16;
            nCanvas.width = 16;
        }
        if (miscType.length > 6 && miscType[6] === true) {
            nContext.drawImage(img, miscType[2], miscType[3], miscType[4], miscType[5], 0, 0, 32 * 3, 32);
        } else {
            nContext.drawImage(img, miscType[2], miscType[3], miscType[4], miscType[5], 0, 0, 16, 16);
        }
        if (miscType.length > 6) {
            nContext.restore();
        }
        view.setInfoImageForType(nCanvas, miscType[0]);
    }
};

view.imageProcessor_cropUnitSprite = function(tp) {
    if (DEBUG) util.log("crop unit sprite", tp);
    var nCanvas;
    var nContext;
    var red = view.COLOR_RED;
    var img = view.getUnitImageForType(tp, view.IMAGE_CODE_IDLE, red);
    nCanvas = document.createElement("canvas");
    nCanvas.height = 32;
    nCanvas.width = 32 * 3;
    nContext = nCanvas.getContext("2d");
    nContext.drawImage(img, 0, 0, 32 * 3, 32, 0, 0, 32 * 3, 32);
    view.setUnitImageForType(nCanvas, tp, view.IMAGE_CODE_IDLE, red);
    nCanvas = document.createElement("canvas");
    nCanvas.height = 32;
    nCanvas.width = 32 * 3;
    nContext = nCanvas.getContext("2d");
    nContext.drawImage(img, 0, 0, 32 * 3, 32, 0, 0, 32 * 3, 32);
    view.setUnitImageForType(view.imageProcessor_flipImage(nCanvas, true, false), tp, view.IMAGE_CODE_IDLE_INVERTED, red);
    nCanvas = document.createElement("canvas");
    nCanvas.height = 32;
    nCanvas.width = 32 * 3;
    nContext = nCanvas.getContext("2d");
    nContext.drawImage(img, 32 * 9, 0, 32 * 3, 32, 0, 0, 32 * 3, 32);
    view.setUnitImageForType(nCanvas, tp, view.IMAGE_CODE_LEFT, red);
    nCanvas = document.createElement("canvas");
    nCanvas.height = 32;
    nCanvas.width = 32 * 3;
    nContext = nCanvas.getContext("2d");
    nContext.drawImage(img, 32 * 9, 0, 32 * 3, 32, 0, 0, 32 * 3, 32);
    view.setUnitImageForType(view.imageProcessor_flipImage(nCanvas, true, false), tp, view.IMAGE_CODE_RIGHT, red);
    nCanvas = document.createElement("canvas");
    nCanvas.height = 32;
    nCanvas.width = 32 * 3;
    nContext = nCanvas.getContext("2d");
    nContext.drawImage(img, 32 * 3, 0, 32 * 3, 32, 0, 0, 32 * 3, 32);
    view.setUnitImageForType(nCanvas, tp, view.IMAGE_CODE_UP, red);
    nCanvas = document.createElement("canvas");
    nCanvas.height = 32;
    nCanvas.width = 32 * 3;
    nContext = nCanvas.getContext("2d");
    nContext.drawImage(img, 32 * 6, 0, 32 * 3, 32, 0, 0, 32 * 3, 32);
    view.setUnitImageForType(nCanvas, tp, view.IMAGE_CODE_DOWN, red);
    if (DEBUG) util.log("cropped unit sprite");
};

view.imageProcessor_scale2x = function(image) {
    var imgW = image.width;
    var imgH = image.height;
    var oR, oG, oB;
    var uR, uG, uB;
    var dR, dG, dB;
    var rR, rG, rB;
    var lR, lG, lB;
    var xi;
    var t0R, t0G, t0B;
    var t1R, t1G, t1B;
    var t2R, t2G, t2B;
    var t3R, t3G, t3B;
    var canvasS = document.createElement("canvas");
    var canvasSContext = canvasS.getContext("2d");
    canvasS.width = imgW;
    canvasS.height = imgH;
    canvasSContext.drawImage(image, 0, 0);
    var imgPixelsS = canvasSContext.getImageData(0, 0, imgW, imgH);
    var canvasT = document.createElement("canvas");
    var canvasTContext = canvasT.getContext("2d");
    canvasT.width = imgW * 2;
    canvasT.height = imgH * 2;
    var imgPixelsT = canvasTContext.getImageData(0, 0, imgW * 2, imgH * 2);
    for (var y = 0; y < imgPixelsS.height; y++) {
        for (var x = 0; x < imgPixelsS.width; x++) {
            xi = y * 4 * imgPixelsS.width + x * 4;
            oR = imgPixelsS.data[xi];
            oG = imgPixelsS.data[xi + 1];
            oB = imgPixelsS.data[xi + 2];
            if (x > 0) {
                xi = y * 4 * imgPixelsS.width + (x - 1) * 4;
                lR = imgPixelsS.data[xi];
                lG = imgPixelsS.data[xi + 1];
                lB = imgPixelsS.data[xi + 2];
            } else {
                lR = oR;
                lG = oG;
                lB = oB;
            }
            if (y > 0) {
                xi = (y - 1) * 4 * imgPixelsS.width + x * 4;
                uR = imgPixelsS.data[xi];
                uG = imgPixelsS.data[xi + 1];
                uB = imgPixelsS.data[xi + 2];
            } else {
                uR = oR;
                uG = oG;
                uB = oB;
            }
            if (x < imgPixelsS.height - 1) {
                xi = (y + 1) * 4 * imgPixelsS.width + x * 4;
                dR = imgPixelsS.data[xi];
                dG = imgPixelsS.data[xi + 1];
                dB = imgPixelsS.data[xi + 2];
            } else {
                dR = oR;
                dG = oG;
                dB = oB;
            }
            if (x < imgPixelsS.width - 1) {
                xi = y * 4 * imgPixelsS.width + (x + 1) * 4;
                rR = imgPixelsS.data[xi];
                rG = imgPixelsS.data[xi + 1];
                rB = imgPixelsS.data[xi + 2];
            } else {
                rR = oR;
                rG = oG;
                rB = oB;
            }
            t0R = oR;
            t0G = oG;
            t0B = oB;
            t1R = oR;
            t1G = oG;
            t1B = oB;
            t2R = oR;
            t2G = oG;
            t2B = oB;
            t3R = oR;
            t3G = oG;
            t3B = oB;
            if ((uR !== dR || uG !== dG || uB !== dB) && (lR !== rR || lG !== rG || lB !== rB)) {
                if (uR === lR && uG === lG && uB === lB) {
                    t0R = lR;
                    t0G = lG;
                    t0B = lB;
                }
                if (uR === rR && uG === rG && uB === rB) {
                    t1R = rR;
                    t1G = rG;
                    t1B = rB;
                }
                if (lR === dR && lG === dG && lB === dB) {
                    t2R = lR;
                    t2G = lG;
                    t2B = lB;
                }
                if (dR === rR && dG === rG && dB === rB) {
                    t3R = rR;
                    t3G = rG;
                    t3B = rB;
                }
            }
            xi = y * 2 * 4 * imgPixelsT.width + x * 2 * 4;
            imgPixelsT.data[xi + 0] = t0R;
            imgPixelsT.data[xi + 1] = t0G;
            imgPixelsT.data[xi + 2] = t0B;
            imgPixelsT.data[xi + 4] = t1R;
            imgPixelsT.data[xi + 5] = t1G;
            imgPixelsT.data[xi + 6] = t1B;
            xi = (y * 2 + 1) * 4 * imgPixelsT.width + x * 2 * 4;
            imgPixelsT.data[xi + 0] = t2R;
            imgPixelsT.data[xi + 1] = t2G;
            imgPixelsT.data[xi + 2] = t2B;
            imgPixelsT.data[xi + 4] = t3R;
            imgPixelsT.data[xi + 5] = t3G;
            imgPixelsT.data[xi + 6] = t3B;
        }
    }
    canvasTContext.putImageData(imgPixelsT, 0, 0);
    canvasS = null;
    return canvasT;
};

controller.KEY_MAPPINGS = {
    KEYBOARD: 0,
    GAMEPAD: 1
};

controller.DEFAULT_KEY_MAP = {
    KEYBOARD: {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        ACTION: 13,
        CANCEL: 8
    },
    GAMEPAD: {
        ACTION: 0,
        CANCEL: 1
    }
};

controller.KEYMAP_STORAGE_KEY = "__user_key_map__";

controller.keyMaps = {
    KEYBOARD: util.copy(controller.DEFAULT_KEY_MAP.KEYBOARD),
    GAMEPAD: util.copy(controller.DEFAULT_KEY_MAP.GAMEPAD)
};

controller.saveKeyMapping = function() {
    controller.storage_general.set(controller.KEYMAP_STORAGE_KEY, controller.keyMaps);
};

controller.loadKeyMapping = function(cb) {
    controller.storage_general.get(controller.KEYMAP_STORAGE_KEY, function(obj) {
        if (obj) {
            if (DEBUG) util.log("loading custom key configuration");
            controller.keyMaps = obj.value;
        } else if (DEBUG) util.log("loading default key configuration");
        if (cb) cb();
    });
};

controller.inputCoolDown = 0;

controller.updateInputCoolDown = function(delta) {
    controller.inputCoolDown -= delta;
    if (controller.inputCoolDown < 0) controller.inputCoolDown = 0;
};

view.mapImages = util.matrix(MAX_MAP_WIDTH, MAX_MAP_HEIGHT, null);

util.scoped(function() {
    function checkTileForConnection(x, y, index, data, cKeys) {
        if (x < 0 || y < 0 || x >= model.map_width || y >= model.map_height) {
            data[index] = "";
            return;
        }
        var short = cKeys[model.map_data[x][y].ID];
        if (short === undefined) short = "";
        data[index] = short;
    }
    function getTileTypeForConnection(data, check, cross, type) {
        for (var i = 0, e = data.length; i < e; i++) {
            var toCheck = data[i];
            if (toCheck[1] !== "" && toCheck[1] !== check[0]) continue;
            if (toCheck[2] !== "" && toCheck[2] !== check[1]) continue;
            if (toCheck[3] !== "" && toCheck[3] !== check[2]) continue;
            if (toCheck[4] !== "" && toCheck[4] !== check[3]) continue;
            if (!cross) {
                if (toCheck[5] !== "" && toCheck[5] !== check[4]) continue;
                if (toCheck[6] !== "" && toCheck[6] !== check[5]) continue;
                if (toCheck[7] !== "" && toCheck[7] !== check[6]) continue;
                if (toCheck[8] !== "" && toCheck[8] !== check[7]) continue;
            }
            return toCheck[0];
        }
        return type;
    }
    view.updateMapImages = function() {
        var x;
        var y;
        var xe = model.map_width;
        var ye = model.map_height;
        var check = checkTileForConnection;
        var resultCheck = getTileTypeForConnection;
        var sdata = [];
        for (x = 0; x < xe; x++) {
            for (y = 0; y < ye; y++) {
                var lX = x;
                var lY = y;
                var tile = model.map_data[lX][lY].ID;
                var data = model.data_tileSheets[tile].assets.gfx_variants;
                if (!data) {
                    view.mapImages[lX][lY] = tile;
                } else {
                    var cKeys = data[0];
                    if (data[1][0].length === 5) {
                        check(x, y - 1, 0, sdata, cKeys);
                        check(x + 1, y, 1, sdata, cKeys);
                        check(x, y + 1, 2, sdata, cKeys);
                        check(x - 1, y, 3, sdata, cKeys);
                        view.mapImages[x][y] = resultCheck(data[1], sdata, true, tile);
                    } else {
                        check(x, y - 1, 0, sdata, cKeys);
                        check(x + 1, y - 1, 1, sdata, cKeys);
                        check(x + 1, y, 2, sdata, cKeys);
                        check(x + 1, y + 1, 3, sdata, cKeys);
                        check(x, y + 1, 4, sdata, cKeys);
                        check(x - 1, y + 1, 5, sdata, cKeys);
                        check(x - 1, y, 6, sdata, cKeys);
                        check(x - 1, y - 1, 7, sdata, cKeys);
                        view.mapImages[x][y] = resultCheck(data[1], sdata, false, tile);
                    }
                }
            }
        }
    };
});

util.scoped(function() {
    var menuRenderer = {};
    var menuElement = document.getElementById("cwt_menu");
    var menuHeaderElement = document.getElementById("cwt_menu_header");
    var menuEntryContentElement = document.getElementById("cwt_menu_content");
    var menuEntryListElement = document.getElementById("cwt_menu_entries");
    var styleButton = "button_active";
    controller.menuPosX = -1;
    controller.menuPosY = -1;
    controller.menuCursorIndex = -1;
    controller.resetMenuCursor = function() {
        controller.menuCursorIndex = 0;
    };
    controller.setMenuIndex = function(index) {
        controller.audio_playSound(model.data_sounds.MENUTICK);
        menuEntryListElement.children[controller.menuCursorIndex].className = "";
        controller.menuCursorIndex = index;
        menuEntryListElement.children[controller.menuCursorIndex].className = styleButton;
    };
    controller.increaseMenuCursor = function() {
        menuEntryListElement.children[controller.menuCursorIndex].className = "";
        controller.menuCursorIndex++;
        if (controller.menuCursorIndex === controller.stateMachine.data.menu.size) {
            controller.menuCursorIndex--;
        } else controller.audio_playSound(model.data_sounds.MENUTICK);
        menuEntryListElement.children[controller.menuCursorIndex].className = styleButton;
        menuEntryListElement.children[controller.menuCursorIndex].children[0].focus();
    };
    controller.decreaseMenuCursor = function() {
        menuEntryListElement.children[controller.menuCursorIndex].className = "";
        controller.menuCursorIndex--;
        if (controller.menuCursorIndex < 0) controller.menuCursorIndex = 0; else controller.audio_playSound(model.data_sounds.MENUTICK);
        menuEntryListElement.children[controller.menuCursorIndex].className = styleButton;
        menuEntryListElement.children[controller.menuCursorIndex].children[0].focus();
    };
    controller.showMenu = function(menu, x, y) {
        if (DEBUG) util.log("opening GUI menu");
        var tileSize = TILE_LENGTH * controller.screenScale;
        var renderer = menuRenderer["__mainMenu__"];
        if (controller.stateMachine.state === "ACTION_SUBMENU") {
            var newRend = menuRenderer[controller.stateMachine.data.action.selectedEntry];
            if (newRend) renderer = newRend;
        }
        if (arguments.length === 1) {
            x = controller.menuPosX;
            y = controller.menuPosY;
        }
        if (!model.map_isValidPosition(x, y)) throw Error("invalid menu position");
        var entries = menuEntryListElement.children;
        for (var i = 0, e = entries.length; i < e; i++) {
            entries[i].style.display = "none";
        }
        for (var i = 0, e = menu.size; i < e; i++) {
            var entry;
            if (entries.length > i) {
                entries[i].className = "";
                entry = entries[i].children[0];
            } else {
                entry = document.createElement("button");
                var li = document.createElement("li");
                li.appendChild(entry);
                menuEntryListElement.appendChild(li);
            }
            renderer(menu.data[i], entry, i, menu.enabled[i]);
            entries[i].style.display = "";
        }
        x = x - controller.screenX;
        y = y - controller.screenY;
        controller.menuPosX = x;
        controller.menuPosY = y;
        controller.menuCursorIndex = 0;
        menuEntryListElement.children[controller.menuCursorIndex].className = "activeButton";
        menuEntryListElement.children[controller.menuCursorIndex].children[0].focus();
        menuElement.style.opacity = 1;
        menuElement.style.top = "96px";
        controller.menuVisible = true;
        controller.setMenuIndex(0);
    };
    controller.hideMenu = function() {
        if (DEBUG) util.log("closing GUI menu");
        menuEntryListElement.children[controller.menuCursorIndex].className = "";
        menuElement.style.opacity = 0;
        menuElement.style.top = "-1000px";
        controller.menuCursorIndex = -1;
        controller.menuVisible = false;
    };
    controller.menuVisible = false;
    controller.isMenuOpen = function() {
        return controller.menuVisible;
    };
    controller.registerMenuRenderer = function(key, renderer) {
        if (menuRenderer.hasOwnProperty(key)) {
            assert(false, "renderer for", key, "is already registered");
        }
        menuRenderer[key] = renderer;
    };
});

util.scoped(function() {
    var panel = document.getElementById("cwt_info_box");
    var contentDiv = document.getElementById("cwt_info_box_content");
    var DEFAULT_MESSAGE_TIME = 2e3;
    var timeLeft;
    view.updateMessagePanelTime = function(delta) {
        if (timeLeft > 0) {
            timeLeft -= delta;
            if (timeLeft <= 0) {
                panel.style.opacity = 0;
                panel.style.top = "-1000px";
            }
        }
    };
    view.hasInfoMessage = function() {
        return timeLeft > 0;
    };
    view.showInfoMessage = function(msg, time) {
        if (arguments.length === 1) time = DEFAULT_MESSAGE_TIME;
        contentDiv.innerHTML = msg;
        panel.style.opacity = 1;
        panel.style.top = "96px";
        timeLeft = time;
    };
});

controller.isNetworkGame = function() {
    return false;
};

controller.isHost = function() {
    return true;
};

controller.unitStatusMap = util.list(MAX_UNITS_PER_PLAYER * MAX_PLAYER, function() {
    return {
        HP_PIC: null,
        LOW_AMMO: false,
        LOW_FUEL: false,
        HAS_LOADS: false,
        CAPTURES: false,
        VISIBLE: false
    };
});

controller.getUnitStatusForUnit = function(unit) {
    var id = model.unit_extractId(unit);
    return controller.unitStatusMap[id];
};

util.scoped(function() {
    function inVision(x, y, tid, unitStatus) {
        if (!model.map_isValidPosition(x, y)) return;
        var unit = model.unit_posData[x][y];
        if (unit) {
            if (model.player_data[unit.owner].team !== tid) unitStatus.VISIBLE = true;
            if (unit.hidden) controller.unitStatusMap[model.unit_extractId(unit)].VISIBLE = true;
        }
    }
    function checkHiddenStatus(unit, unitStatus) {
        if (!unitStatus) {
            unitStatus = controller.unitStatusMap[model.unit_extractId(unit)];
        }
        unitStatus.VISIBLE = true;
        if (unit.hidden) {
            unitStatus.VISIBLE = false;
            var x = unit.x;
            var y = unit.y;
            var ttid = model.player_data[unit.owner].team;
            inVision(x - 1, y, ttid, unitStatus);
            inVision(x, y - 1, ttid, unitStatus);
            inVision(x, y + 1, ttid, unitStatus);
            inVision(x + 1, y, ttid, unitStatus);
        }
    }
    controller.updateUnitStatus = function(uid) {
        var unit = model.unit_data[uid];
        var x = unit.x;
        var y = unit.y;
        var unitStatus = controller.unitStatusMap[uid];
        var uSheet = unit.type;
        var cAmmo = unit.ammo;
        var mAmmo = uSheet.ammo;
        if (cAmmo <= parseInt(mAmmo * .25, 10)) unitStatus.LOW_AMMO = true; else unitStatus.LOW_AMMO = false;
        if (mAmmo === 0) unitStatus.LOW_AMMO = false;
        var cFuel = unit.fuel;
        var mFuel = uSheet.fuel;
        if (cFuel < parseInt(mFuel * .25, 10)) unitStatus.LOW_FUEL = true; else unitStatus.LOW_FUEL = false;
        var num = -1;
        if (unit.hp <= 90) {
            num = parseInt(unit.hp / 10, 10) + 1;
        }
        switch (num) {
          case 1:
            unitStatus.HP_PIC = view.getInfoImageForType("HP_1");
            break;

          case 2:
            unitStatus.HP_PIC = view.getInfoImageForType("HP_2");
            break;

          case 3:
            unitStatus.HP_PIC = view.getInfoImageForType("HP_3");
            break;

          case 4:
            unitStatus.HP_PIC = view.getInfoImageForType("HP_4");
            break;

          case 5:
            unitStatus.HP_PIC = view.getInfoImageForType("HP_5");
            break;

          case 6:
            unitStatus.HP_PIC = view.getInfoImageForType("HP_6");
            break;

          case 7:
            unitStatus.HP_PIC = view.getInfoImageForType("HP_7");
            break;

          case 8:
            unitStatus.HP_PIC = view.getInfoImageForType("HP_8");
            break;

          case 9:
            unitStatus.HP_PIC = view.getInfoImageForType("HP_9");
            break;

          default:
            unitStatus.HP_PIC = null;
        }
        if (unit.loadedIn < -1) {
            unitStatus.HAS_LOADS = true;
        } else unitStatus.HAS_LOADS = false;
        if (unit.x >= 0) {
            var property = model.property_posMap[unit.x][unit.y];
            if (property !== null && property.capturePoints < 20) {
                unitStatus.CAPTURES = true;
            } else unitStatus.CAPTURES = false;
        }
        checkHiddenStatus(unit, unitStatus);
    };
});

controller.action_clientAction({
    key: "options",
    condition: function() {
        return true;
    },
    invoke: function() {
        controller.screenStateMachine.event("toOptions_", true);
    }
});

view.redraw_dataChanges = 0;

view.redraw_data = util.matrix(MAX_MAP_WIDTH, MAX_MAP_HEIGHT, false);

view.redraw_MODE = {
    RECTANGLE: 0,
    CIRCLE: 1
};

view.redraw_markPos = function(x, y, sizeX, sizeY, redrawMode) {
    if (typeof sizeX !== "number") sizeX = 0; else sizeX--;
    if (typeof sizeY !== "number") sizeY = 0; else sizeY--;
    if (typeof redrawMode === "undefined") redrawMode = view.redraw_MODE.RECTANGLE;
    var isCircleMode = redrawMode === view.redraw_MODE.CIRCLE;
    var ox = x;
    var oy = y;
    if (isCircleMode) {
        x -= sizeX;
        y -= sizeY;
    }
    var xe = Math.min(x + sizeX, model.map_width - 1);
    var ye = Math.min(y + sizeY, model.map_height - 1);
    for (;x <= xe; x++) {
        y = oy;
        while (true) {
            if (x < 0 || y < 0 || x >= model.map_width || y >= model.map_height) break;
            if (view.redraw_data[x][y]) {
                y++;
                if (y <= ye) continue; else break;
            }
            if (!isCircleMode || Math.abs(x - ox) + Math.abs(y - oy) <= sizeX) {
                view.redraw_data[x][y] = true;
                view.redraw_dataChanges++;
            }
            if (model.property_posMap[x][y] && model.property_posMap[x][y].type.ID === "PROP_INV") {
                if (x === xe) {
                    xe++;
                    if (y > ye) ye = y;
                }
            }
            y++;
            if (y === model.map_height) break;
            if (model.property_posMap[x][y] !== null) {
                continue;
            }
            if (y <= ye) continue;
            if (view.overlayImages[view.mapImages[x][y]] === true) continue;
            break;
        }
    }
};

view.redraw_markAll = function() {
    view.redraw_dataChanges = 1;
    for (var x = 0, xe = model.map_width; x < xe; x++) {
        for (var y = 0, ye = model.map_height; y < ye; y++) {
            view.redraw_data[x][y] = true;
        }
    }
};

view.redraw_markSelection = function(scope) {
    var cx = scope.selection.centerX;
    var cy = scope.selection.centerY;
    var data = scope.selection.data;
    view.redraw_markPos(cx, cy, data.length, data.length, view.redraw_MODE.RECTANGLE);
};

view.redraw_markPosWithNeighbours = function(x, y) {
    view.redraw_markPos(x, y, 2, 0, view.redraw_MODE.CIRCLE);
};

view.redraw_markPosWithNeighboursRing = function(x, y) {
    view.redraw_markPos(x - 1, y - 1, 3, 3, view.redraw_MODE.RECTANGLE);
};

controller.screenElement = document.getElementById("cwt_canvas");

controller.screenX = 0;

controller.screenY = 0;

controller.screenWidth = -1;

controller.screenHeight = -1;

controller.screenScale = 1;

controller.moveScreenX = 0;

controller.moveScreenY = 0;

controller.setScreenScale = function(scale) {
    if (scale < -1 || scale > 3) {
        return;
    }
    controller.screenScale = scale;
    controller.screenElement.className = "scale" + scale;
    if (scale === 0) scale = .8; else if (scale === -1) scale = .7;
    var tileLen = TILE_LENGTH * scale;
    controller.screenWidth = parseInt(window.innerWidth / tileLen, 10);
    controller.screenHeight = parseInt(window.innerHeight / tileLen, 10);
    controller.setScreenPosition(controller.screenX, controller.screenY, false);
};

controller.getCanvasPosX = function(x) {
    return x * TILE_LENGTH;
};

controller.getCanvasPosY = function(y) {
    return y * TILE_LENGTH;
};

controller.setScreenPosition = function(x, y, centerIt) {
    controller.screenX = x;
    controller.screenY = y;
    var style = controller.screenElement.style;
    var scale = controller.screenScale;
    var left = -(controller.screenX * TILE_LENGTH * scale);
    var top = -(controller.screenY * TILE_LENGTH * scale);
    switch (scale) {
      case 2:
        left += controller.screenElement.width / 2;
        top += controller.screenElement.height / 2;
        break;

      case 3:
        left += controller.screenElement.width;
        top += controller.screenElement.height;
        break;
    }
    style.position = "absolute";
    style.left = left + "px";
    style.top = top + "px";
};

controller.shiftScreenPosition = function(code, len) {
    if (arguments.length === 1) len = 1;
    var x = controller.screenX;
    var y = controller.screenY;
    switch (code) {
      case model.move_MOVE_CODES.DOWN:
        y += len;
        break;

      case model.move_MOVE_CODES.RIGHT:
        x += len;
        break;

      case model.move_MOVE_CODES.UP:
        y -= len;
        break;

      case model.move_MOVE_CODES.LEFT:
        x -= len;
        break;
    }
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x >= model.map_width) x = model.map_width - 1;
    if (y >= model.map_height) y = model.map_height - 1;
    controller.setScreenPosition(x, y, false);
};

view.resizeCanvas = function() {
    var canvEl = controller.screenElement;
    canvEl.width = TILE_LENGTH * model.map_width;
    canvEl.height = TILE_LENGTH * model.map_height;
    controller.screenWidth = parseInt(window.innerWidth / TILE_LENGTH, 10);
    controller.screenHeight = parseInt(window.innerHeight / TILE_LENGTH, 10);
};

var TILE_LENGTH = 16;

controller.baseSize = 16;

view.preventRenderUnit = null;

view.canvasCtx = controller.screenElement.getContext("2d");

view.selectionRange = 2;

view.colorArray = [ view.COLOR_RED, view.COLOR_BLUE, view.COLOR_GREEN, view.COLOR_YELLOW ];

view.renderMap = function(scale) {
    var tileSize = TILE_LENGTH;
    var ctx = view.canvasCtx;
    var sx = controller.screenX;
    var sy = controller.screenY;
    var cursx = controller.mapCursorX;
    var cursy = controller.mapCursorY;
    var type;
    var pic;
    var scx;
    var scy;
    var scw;
    var sch;
    var tcx;
    var tcy;
    var tcw;
    var tch;
    var sprStepSel = view.getSpriteStep("SELECTION");
    var sprStepUnit = view.getSpriteStep("UNIT");
    var sprStepUnitSimple = view.getSpriteStep("UNIT_SIMPLE");
    var sprStepProp = view.getSpriteStep("PROPERTY");
    var sprStepStat = view.getSpriteStep("STATUS");
    var sprStepTiles = view.getSpriteStep("ANIM_TILES");
    var BASESIZE = controller.baseSize;
    var simpleUnitAnimTypes = model.data_simpleAnimatedUnits;
    var teamId = model.client_lastPid !== -1 ? model.player_data[model.client_lastPid].team : -1;
    var focusExists = controller.stateMachine.state === "MOVEPATH_SELECTION" || controller.stateMachine.state === "ACTION_SELECT_TARGET_A" || controller.stateMachine.state === "ACTION_SELECT_TARGET_B" || controller.attackRangeVisible;
    var inFreeSelection = controller.stateMachine.state === "ACTION_SELECT_TILE";
    var stmData = controller.stateMachine.data;
    var selection = stmData.selection;
    var inShadow;
    var ye = model.map_height - 1;
    for (var y = 0; y <= ye; y++) {
        var xe = model.map_width - 1;
        for (var x = 0; x <= xe; x++) {
            inShadow = model.fog_clientData[x][y] === 0;
            if (view.redraw_data[x][y] === true) {
                type = view.mapImages[x][y];
                pic = view.getTileImageForType(type);
                scx = 0;
                scy = 0;
                if (view.animatedTiles[type]) {
                    scx += BASESIZE * sprStepTiles;
                }
                scw = BASESIZE;
                sch = BASESIZE * 2;
                tcx = x * tileSize;
                tcy = y * tileSize - tileSize;
                tcw = tileSize;
                tch = tileSize * 2;
                if (tcy < 0) {
                    scy = scy + BASESIZE;
                    sch = sch - BASESIZE;
                    tcy = tcy + tileSize;
                    tch = tch - tileSize;
                }
                if (pic !== undefined) {
                    ctx.drawImage(pic, scx, scy, scw, sch, tcx, tcy, tcw, tch);
                    if (inShadow) {
                        pic = view.getTileShadowImageForType(view.mapImages[x][y]);
                        ctx.globalAlpha = .35;
                        ctx.drawImage(pic, scx, scy, scw, sch, tcx, tcy, tcw, tch);
                        ctx.globalAlpha = 1;
                    }
                } else {
                    ctx.fillStyle = "rgb(0,0,255)";
                    ctx.fillRect(tcx, tcy, tileSize, tileSize);
                }
                var property = model.property_posMap[x][y];
                if (property !== null && property.type.assets.gfx) {
                    var color;
                    type = property.type.ID;
                    if (property.owner === -1) {
                        color = view.COLOR_NEUTRAL;
                    } else {
                        color = view.colorArray[property.owner];
                        if (property.type.factionSprites) {
                            var co = model.co_data[property.owner].coA;
                            if (co) type = property.type.factionSprites[co.faction];
                        }
                    }
                    if (inShadow) color = view.COLOR_NEUTRAL;
                    pic = view.getPropertyImageForType(type, color);
                    scx = 0 + BASESIZE * sprStepProp;
                    scy = 0;
                    scw = BASESIZE;
                    sch = BASESIZE * 2;
                    tcx = x * tileSize;
                    tcy = y * tileSize - tileSize;
                    tcw = tileSize;
                    tch = tileSize * 2;
                    if (tcy < 0) {
                        scy = scy + BASESIZE;
                        sch = sch - BASESIZE;
                        tcy = tcy + tileSize;
                        tch = tch - tileSize;
                    }
                    if (property.type.assets.gfxOffset) {
                        scx = 0 + property.type.assets.gfxOffset[0] * sprStepProp;
                        scw = property.type.assets.gfxOffset[0];
                        sch = property.type.assets.gfxOffset[1];
                        tcx += property.type.assets.gfxOffset[2];
                        tcy += property.type.assets.gfxOffset[3];
                        tcw = property.type.assets.gfxOffset[0];
                        tch = property.type.assets.gfxOffset[1];
                    }
                    if (pic !== undefined) {
                        ctx.drawImage(pic, scx, scy, scw, sch, tcx, tcy, tcw, tch);
                        if (inShadow) {
                            pic = view.getPropertyImageForType(property.type.ID, view.COLOR_BLACK_MASK);
                            ctx.globalAlpha = .35;
                            ctx.drawImage(pic, scx, scy, scw, sch, tcx, tcy, tcw, tch);
                            ctx.globalAlpha = 1;
                        }
                    } else {
                        tcx = x * tileSize;
                        tcy = y * tileSize;
                        tcw = tileSize;
                        tch = tileSize;
                        ctx.fillStyle = "rgb(0,255,0)";
                        ctx.fillRect(tcx, tcy, tcw, tch);
                    }
                }
                if (focusExists) {
                    pic = view.getInfoImageForType(controller.stateMachine.state === "MOVEPATH_SELECTION" ? "MOVE_FOC" : "ATK_FOC");
                    var value = selection.getValueAt(x, y);
                    if (value > 0) {
                        scx = BASESIZE * sprStepSel;
                        scy = 0;
                        scw = BASESIZE;
                        sch = BASESIZE;
                        tcx = x * tileSize;
                        tcy = y * tileSize;
                        tcw = tileSize;
                        tch = tileSize;
                        ctx.globalAlpha = .65;
                        ctx.drawImage(pic, scx, scy, scw, sch, tcx, tcy, tcw, tch);
                        ctx.globalAlpha = 1;
                    }
                }
                if (inFreeSelection) {
                    var dis = model.map_getDistance(cursx, cursy, x, y);
                    if (view.selectionRange === dis) {
                        var pic = null;
                        if (dis === 0) {
                            pic = view.getInfoImageForType("SILO_ALL");
                        } else {
                            if (cursx === x) {
                                if (y < cursy) pic = view.getInfoImageForType("SILO_N"); else pic = view.getInfoImageForType("SILO_S");
                            } else if (cursy === y) {
                                if (x < cursx) pic = view.getInfoImageForType("SILO_W"); else pic = view.getInfoImageForType("SILO_E");
                            } else {
                                if (x < cursx) {
                                    if (y < cursy) pic = view.getInfoImageForType("SILO_NW"); else pic = view.getInfoImageForType("SILO_SW");
                                } else {
                                    if (y < cursy) pic = view.getInfoImageForType("SILO_NE"); else pic = view.getInfoImageForType("SILO_SE");
                                }
                            }
                        }
                        tcx = x * tileSize;
                        tcy = y * tileSize;
                        if (pic !== null) {
                            ctx.drawImage(pic, tcx, tcy);
                        }
                    }
                }
                var unit = model.unit_posData[x][y];
                var stats = unit !== null ? controller.getUnitStatusForUnit(unit) : null;
                if (!inShadow && unit !== null && unit.type.assets.gfx && (unit.owner === model.round_turnOwner || model.player_data[unit.owner].team == teamId || stats.VISIBLE)) {
                    if (unit !== view.preventRenderUnit) {
                        var uStep = simpleUnitAnimTypes[unit.type.ID] ? sprStepUnitSimple : sprStepUnit;
                        var color;
                        if (unit.owner === -1) {
                            color = view.COLOR_NEUTRAL;
                        } else {
                            color = view.colorArray[unit.owner];
                        }
                        var state;
                        if (unit.type.cannon) state = view.IMAGE_CODE_IDLE; else state = unit.owner % 2 === 1 ? view.IMAGE_CODE_IDLE : view.IMAGE_CODE_IDLE_INVERTED;
                        pic = view.getUnitImageForType(unit.type.ID, state, color);
                        scx = BASESIZE * 2 * uStep;
                        scy = 0;
                        scw = BASESIZE * 2;
                        sch = BASESIZE * 2;
                        tcx = x * tileSize - tileSize / 2;
                        tcy = y * tileSize - tileSize / 2;
                        tcw = tileSize + tileSize;
                        tch = tileSize + tileSize;
                        if (pic !== undefined) {
                            ctx.drawImage(pic, scx, scy, scw, sch, tcx, tcy, tcw, tch);
                            if (unit.owner === model.round_turnOwner && !model.actions_canAct(model.unit_extractId(unit))) {
                                ctx.globalAlpha = .5;
                                ctx.drawImage(view.getUnitImageForType(unit.type.ID, state, view.COLOR_BLACK_MASK), scx, scy, scw, sch, tcx, tcy, tcw, tch);
                                ctx.globalAlpha = 1;
                            }
                        } else {
                            tcx = x * tileSize;
                            tcy = y * tileSize;
                            tcw = tileSize;
                            tch = tileSize;
                            ctx.fillStyle = "rgb(255,0,0)";
                            ctx.fillRect(tcx, tcy, tcw, tch);
                        }
                        pic = stats.HP_PIC;
                        if (pic !== null) {
                            ctx.drawImage(pic, tcx + tileSize, tcy + tileSize);
                        }
                        if (sprStepStat !== 0 && sprStepStat !== 1 && sprStepStat !== 4 && sprStepStat !== 5 && sprStepStat !== 8 && sprStepStat !== 9 && sprStepStat !== 12 && sprStepStat !== 13 && sprStepStat !== 16 && sprStepStat !== 17) {
                            var st = parseInt(sprStepStat / 4, 10);
                            pic = null;
                            var stIn = st;
                            do {
                                if (stIn === 0 && stats.LOW_AMMO) {
                                    pic = view.getInfoImageForType("SYM_AMMO");
                                } else if (stIn === 1 && stats.CAPTURES) {
                                    pic = view.getInfoImageForType("SYM_CAPTURE");
                                } else if (stIn === 2 && stats.LOW_FUEL) {
                                    pic = view.getInfoImageForType("SYM_FUEL");
                                } else if (stIn === 3 && stats.HAS_LOADS) {
                                    pic = view.getInfoImageForType("SYM_LOAD");
                                } else if (stIn === 4 && unit.hidden) {
                                    pic = view.getInfoImageForType("SYM_HIDDEN");
                                }
                                if (pic !== null) break;
                                stIn++;
                                if (stIn === 5) stIn = 0;
                            } while (stIn !== st);
                            if (pic !== null) {
                                ctx.drawImage(pic, tcx + tileSize / 2, tcy + tileSize);
                            }
                        }
                    }
                }
                view.redraw_data[x][y] = false;
            }
        }
    }
    if (controller.stateMachine.state === "MOVEPATH_SELECTION") {
        var currentMovePath = stmData.movePath.data;
        var cX = stmData.source.x;
        var cY = stmData.source.y;
        var oX;
        var oY;
        var tX;
        var tY;
        for (var i = 0, e = currentMovePath.length; i < e; i++) {
            if (currentMovePath[i] === -1 || currentMovePath[i] === null) break;
            oX = cX;
            oY = cY;
            switch (currentMovePath[i]) {
              case model.move_MOVE_CODES.UP:
                cY--;
                break;

              case model.move_MOVE_CODES.RIGHT:
                cX++;
                break;

              case model.move_MOVE_CODES.DOWN:
                cY++;
                break;

              case model.move_MOVE_CODES.LEFT:
                cX--;
                break;
            }
            if (currentMovePath[i + 1] === -1 || currentMovePath[i + 1] === null) {
                tX = -1;
                tY = -1;
            } else {
                switch (currentMovePath[i + 1]) {
                  case model.move_MOVE_CODES.UP:
                    tX = cX;
                    tY = cY - 1;
                    break;

                  case model.move_MOVE_CODES.RIGHT:
                    tX = cX + 1;
                    tY = cY;
                    break;

                  case model.move_MOVE_CODES.DOWN:
                    tX = cX;
                    tY = cY + 1;
                    break;

                  case model.move_MOVE_CODES.LEFT:
                    tX = cX - 1;
                    tY = cY;
                    break;
                }
            }
            if (tX == -1) {
                switch (currentMovePath[i]) {
                  case model.move_MOVE_CODES.UP:
                    pic = view.getTileImageForType("ARROW_N");
                    break;

                  case model.move_MOVE_CODES.RIGHT:
                    pic = view.getTileImageForType("ARROW_E");
                    break;

                  case model.move_MOVE_CODES.DOWN:
                    pic = view.getTileImageForType("ARROW_S");
                    break;

                  case model.move_MOVE_CODES.LEFT:
                    pic = view.getTileImageForType("ARROW_W");
                    break;
                }
            } else {
                var diffX = Math.abs(tX - oX);
                var diffY = Math.abs(tY - oY);
                if (diffX === 2) {
                    pic = view.getTileImageForType("ARROW_WE");
                } else if (diffY === 2) {
                    pic = view.getTileImageForType("ARROW_NS");
                } else if (tX < cX && oY > cY || oX < cX && tY > cY) {
                    pic = view.getTileImageForType("ARROW_SW");
                } else if (tX < cX && oY < cY || oX < cX && tY < cY) {
                    pic = view.getTileImageForType("ARROW_WN");
                } else if (tX > cX && oY < cY || oX > cX && tY < cY) {
                    pic = view.getTileImageForType("ARROW_NE");
                } else if (tX > cX && oY > cY || oX > cX && tY > cY) {
                    pic = view.getTileImageForType("ARROW_ES");
                } else {
                    assert(false, "illegal move arrow state", "old (", oX, ",", oY, ")", "current (", cX, ",", cY, ")", "next (", tX, ",", tY, ")", "path (", currentMovePath, ")");
                    continue;
                }
            }
            if (cX >= 0 && cY >= 0 && cX < controller.screenWidth && cY < controller.screenHeight) {
                ctx.drawImage(pic, cX * tileSize, cY * tileSize);
            }
        }
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#f00";
    ctx.strokeRect(tileSize * controller.mapCursorX + 1, tileSize * controller.mapCursorY + 1, tileSize - 2, tileSize - 2);
    view.redraw_dataChanges = 0;
};

controller.openedSection = null;

controller.openSection = function(id) {
    if (id === null) return;
    var element = document.getElementById(id);
    if (!element) model.criticalError(constants.error.CLIENT_ERROR, constants.error.CLIENT_DATA_ERROR);
    if (this.openedSection !== null) {
        this.openedSection.style.display = "none";
    }
    element.style.display = "";
    this.openedSection = element;
};

controller.screenStateMachine = util.stateMachine({}, {
    noHistory: true
});

controller.screenStateMachine.data = {};

controller.storage_SIZES = {
    maps: 10,
    assets: 40,
    general: 5
};

controller.storage_NAMES = {
    maps: "MAPS",
    assets: "ASSETS",
    general: "GENERAL"
};

controller.storage_maps = null;

controller.storage_assets = null;

controller.storage_general = null;

controller.storage_create = function(name, sizeMb, storage_type, cb) {
    var store = new Lawnchair({
        adaptor: storage_type,
        maxSize: sizeMb * 1024 * 1024,
        name: name
    }, function() {
        cb({
            get: function(key, cb) {
                store.get(key, cb);
            },
            has: function(key, cb) {
                store.exists(key, cb);
            },
            exists: function(key, cb) {
                store.exists(key, cb);
            },
            set: function(key, value, cb) {
                store.save({
                    key: key,
                    value: value
                }, cb);
            },
            keys: function(cb) {
                store.keys(cb);
            },
            clear: function(cb) {
                store.nuke(cb);
            },
            remove: function(key, cb) {
                store.remove(key, cb);
            }
        });
    });
};

controller.storage_initialize = function(p, mb) {
    mb.take();
    var storage_type = Browser.mobile ? "webkit-sqlite" : "indexed-db";
    jWorkflow.order(function(p, b) {
        b.take();
        controller.storage_create(controller.storage_NAMES.maps, controller.storage_SIZES.maps, storage_type, function(str) {
            controller.storage_maps = str;
            b.pass();
        });
    }).andThen(function(p, b) {
        b.take();
        controller.storage_create(controller.storage_NAMES.assets, controller.storage_SIZES.assets, storage_type, function(str) {
            controller.storage_assets = str;
            b.pass();
        });
    }).andThen(function(p, b) {
        b.take();
        controller.storage_create(controller.storage_NAMES.general, controller.storage_SIZES.general, storage_type, function(str) {
            controller.storage_general = str;
            b.pass();
        });
    }).start(function(r) {
        if (r) ;
        mb.pass();
    });
};

controller.storage_wipeOut = function(cb) {
    function wipeoutStorage(flow, storage) {
        flow.andThen(function(_, b) {
            b.take();
            storage.clear(function() {
                b.pass();
            });
        });
    }
    var flow = jWorkflow.order();
    if (controller.storage_general) wipeoutStorage(flow, controller.storage_general);
    if (controller.storage_assets) wipeoutStorage(flow, controller.storage_assets);
    if (controller.storage_maps) wipeoutStorage(flow, controller.storage_maps);
    flow.start(function() {
        if (cb) cb();
    });
};

controller.colorizeImages = util.singleLazyCall(function(err, baton) {
    baton.take();
    var flow = jWorkflow.order(function() {
        if (DEBUG) util.log("colorize images");
    });
    model.data_unitTypes.forEach(function(el) {
        if (!model.data_unitSheets[el].assets.gfx) return;
        flow.andThen(function() {
            view.imageProcessor_colorizeUnit(el);
        });
    });
    model.data_propertyTypes.forEach(function(el) {
        if (!model.data_tileSheets[el].assets.gfx) return;
        flow.andThen(function() {
            view.imageProcessor_colorizeProperty(el);
        });
    });
    model.data_tileTypes.forEach(function(el) {
        flow.andThen(function() {
            view.imageProcessor_colorizeTile(el);
        });
    });
    model.data_tileTypes.forEach(function(el) {
        var obj = model.data_tileSheets[el];
        if (obj.assets.gfx_variants) {
            obj.assets.gfx_variants[1].forEach(function(sel) {
                flow.andThen(function() {
                    view.imageProcessor_colorizeTile(sel[0]);
                });
            });
        }
    });
    flow.start(function() {
        if (DEBUG) util.log("colorized images");
        baton.pass();
    });
});

controller.cutImages = util.singleLazyCall(function(err, baton) {
    baton.take();
    var flow = jWorkflow.order(function() {
        if (DEBUG) util.log("crop images");
    });
    model.data_unitTypes.forEach(function(el) {
        if (!model.data_unitSheets[el].assets.gfx) return;
        flow.andThen(function() {
            view.imageProcessor_cropUnitSprite(el);
        });
    });
    model.data_graphics.misc.forEach(function(el) {
        flow.andThen(function() {
            view.imageProcessor_cropMiscSprite(el);
        });
    });
    flow.start(function() {
        if (DEBUG) util.log("cropped images");
        baton.pass();
    });
});

controller.dataLoader_start = function(loadDescComponent, loadBarComponent) {
    assert(loadDescComponent && loadBarComponent);
    var SMALL_WAIT = 150;
    var BIG_WAIT = 500;
    if (DEBUG) util.log("loading game data");
    jWorkflow.order().andThen(function() {
        loadDescComponent.innerHTML = "Loading";
        loadBarComponent.className = "loadBar_0";
    }).chill(SMALL_WAIT).andThen(controller.features_analyseClient).andThen(function() {
        loadBarComponent.className = "loadBar_5";
    }).chill(SMALL_WAIT).andThen(function(p, b) {
        if (!controller.features_client.supported) {
            b.take();
            if (confirm("Your system isn't supported by CW:T. Try to run it?")) b.pass();
        }
    }).andThen(function() {
        loadBarComponent.className = "loadBar_10";
    }).chill(SMALL_WAIT).andThen(controller.storage_initialize).andThen(function() {
        loadBarComponent.className = "loadBar_15";
    }).chill(SMALL_WAIT).andThen(function(err, baton) {
        if (err) return err;
        baton.take();
        controller.storage_general.get("cwt_resetData", function(obj) {
            var wipeOut = obj && obj.value === true;
            if (!wipeOut) wipeOut = getQueryParams(document.location.search).cwt_resetData === "1";
            if (wipeOut) {
                if (DEBUG) util.log("wipe out cached data");
                controller.storage_general.clear(function() {
                    controller.storage_assets.clear(function() {
                        controller.storage_maps.clear(function() {
                            baton.pass(false);
                        });
                    });
                });
            } else baton.pass(false);
        });
    }).andThen(function(err, baton) {
        if (err) return err;
        baton.take();
        controller.storage_general.get("cwt_forceTouch", function(obj) {
            var doIt = obj && obj.value === true;
            if (!doIt) doIt = getQueryParams(document.location.search).cwt_forceTouch === "1";
            if (doIt) {
                if (DEBUG) util.log("force to use touch controls");
                controller.features_client.mouse = false;
                controller.features_client.touch = true;
                controller.screenStateMachine.structure.OPTIONS.forceTouch = true;
            }
            baton.pass(false);
        });
    }).andThen(function() {
        loadBarComponent.className = "loadBar_20";
    }).chill(SMALL_WAIT).andThen(controller.modification_load).andThen(function() {
        loadDescComponent.innerHTML = model.data_localized("loading.loadMaps");
        loadBarComponent.className = "loadBar_30";
    }).chill(SMALL_WAIT).andThen(controller.loadMaps_doIt).andThen(function() {
        loadDescComponent.innerHTML = model.data_localized("loading.loadImages");
        loadBarComponent.className = "loadBar_40";
    }).chill(SMALL_WAIT).andThen(controller.loadImages_doIt).andThen(function(p, b) {
        b.take();
        var el = model.data_menu.bgs[parseInt(model.data_menu.bgs.length * Math.random(), 10)];
        controller.storage_assets.get(model.data_assets.images + "/" + el, function(obj) {
            if (obj) {
                if (DEBUG) util.log("set custom background to", el);
                controller.background_registerAsBackground(obj.value);
            }
            b.pass();
        });
    }).andThen(function() {
        loadDescComponent.innerHTML = model.data_localized("loading.cropImages");
        loadBarComponent.className = "loadBar_60";
    }).chill(SMALL_WAIT).andThen(controller.cutImages).andThen(function() {
        loadDescComponent.innerHTML = model.data_localized("loading.colorizeImages");
        loadBarComponent.className = "loadBar_65";
    }).chill(SMALL_WAIT).andThen(controller.colorizeImages).andThen(function() {
        loadDescComponent.innerHTML = model.data_localized("loading.loadSounds");
        loadBarComponent.className = "loadBar_70";
    }).chill(SMALL_WAIT).andThen(controller.audio_initialize).andThen(controller.loadAudio_doIt).andThen(function() {
        loadDescComponent.innerHTML = model.data_localized("loading.prepareInput");
        loadBarComponent.className = "loadBar_90";
    }).chill(SMALL_WAIT).andThen(controller.loadInputDevices).andThen(function() {
        loadDescComponent.innerHTML = model.data_localized("loading.prepareInput");
        loadBarComponent.className = "loadBar_93";
    }).chill(SMALL_WAIT).andThen(function(err, baton) {
        baton.take();
        controller.loadKeyMapping(function() {
            baton.pass();
        });
    }).andThen(function() {
        loadDescComponent.innerHTML = model.data_localized("loading.prepareLanguage");
        loadBarComponent.className = "loadBar_95";
    }).chill(SMALL_WAIT).andThen(function() {
        var els = document.querySelectorAll("[key]");
        for (var i = 0, e = els.length; i < e; i++) {
            els[i].innerHTML = model.data_localized(els[i].attributes.key.value);
        }
    }).andThen(function() {
        loadDescComponent.innerHTML = model.data_localized("loading.done");
        loadBarComponent.className = "loadBar_100";
    }).chill(BIG_WAIT).andThen(function() {
        controller.screenStateMachine.event("complete");
    }).start(function(p) {
        if (p) assert(false, "data loader failed (" + p + ")");
    });
};

controller.loadAudio_loadIt_ = function(path, music, baton, loadIt) {
    if (music && !controller.features_client.audioMusic) {
        if (DEBUG) util.log("skip audio", path, ", because client does not support music playback");
        return;
    }
    if (controller.audio_isBuffered(path)) {
        if (DEBUG) util.log("skip audio", path, ", because already loaded it");
        return;
    }
    if (DEBUG) util.log("loading audio", path);
    baton.take();
    controller.storage_assets.get(path, function(obj) {
        if (!obj) {
            if (DEBUG) util.log(" ..is not in the cache");
            var request = new XMLHttpRequest();
            request.open("GET", (music ? model.data_assets.music : model.data_assets.sounds) + "/" + path, true);
            request.responseType = "arraybuffer";
            request.onload = function() {
                if (this.status === 404) {
                    if (DEBUG) util.log(" ..could not find", path);
                    baton.pass();
                    return;
                }
                var audioData = request.response;
                var stringData = Base64Helper.encodeBuffer(audioData);
                if (DEBUG) util.log(" ..saving", path);
                controller.storage_assets.set(path, stringData, function() {
                    if (loadIt) {
                        if (DEBUG) util.log("loading it directly into the cache");
                        controller.audio_loadByArrayBuffer(path, audioData, function() {
                            baton.pass();
                        });
                    } else baton.pass();
                });
            };
            request.send();
        } else {
            if (DEBUG) util.log(" ..is in the cache");
            if (loadIt) {
                if (DEBUG) util.log("loading it directly into the cache");
                controller.storage_assets.get(path, function(obj) {
                    assert(obj.value);
                    var audioData = Base64Helper.decodeBuffer(obj.value);
                    controller.audio_loadByArrayBuffer(path, audioData, function() {
                        baton.pass();
                    });
                });
            } else baton.pass();
        }
    });
};

controller.loadAudio_doIt = util.singleLazyCall(function(_, baton) {
    if (!controller.features_client.audioSFX && !controller.features_client.audioMusic) {
        if (DEBUG) util.log("client does not support audio system, skip init...");
        return;
    }
    var context = controller.audio_grabContext();
    if (!context) return;
    baton.take();
    var flow = jWorkflow.order(function() {
        if (DEBUG) util.log("loading modification sounds");
    });
    if (controller.features_client.audioMusic) {
        flow.andThen(function(data, b) {
            controller.loadAudio_loadIt_(model.data_menu.music, true, b, true);
        });
        util.iterateListByFlow(flow, model.data_fractionTypes, function(data, b) {
            controller.loadAudio_loadIt_(model.data_fractionSheets[this.list[this.i]].music, true, b);
        });
        util.iterateListByFlow(flow, model.data_coTypes, function(data, b) {
            controller.loadAudio_loadIt_(model.data_coSheets[this.list[this.i]].music, true, b);
        });
    }
    if (controller.features_client.audioSFX) {
        var list = Object.keys(model.data_sounds);
        var tlist = [];
        for (var li = 0; li < list.length; li++) tlist.push(model.data_sounds[list[li]]);
        util.iterateListByFlow(flow, tlist, function(data, b) {
            controller.loadAudio_loadIt_(this.list[this.i], false, b, true);
        });
        util.iterateListByFlow(flow, model.data_propertyTypes, function(data, b) {
            var key = this.list[this.i];
            var obj = model.data_tileSheets[key];
            if (obj.assets && obj.assets.fireSound) {
                controller.loadAudio_loadIt_(obj.assets.fireSound, false, b, true);
            }
        });
        util.iterateListByFlow(flow, model.data_unitTypes, function(data, b) {
            var key = this.list[this.i];
            var obj = model.data_unitSheets[key];
            if (obj.assets && obj.assets.pri_att_sound) {
                controller.loadAudio_loadIt_(obj.assets.pri_att_sound, false, b, true);
            }
        });
        util.iterateListByFlow(flow, model.data_unitTypes, function(data, b) {
            var key = this.list[this.i];
            var obj = model.data_unitSheets[key];
            if (obj.assets && obj.assets.sec_att_sound) {
                controller.loadAudio_loadIt_(obj.assets.sec_att_sound, false, b, true);
            }
        });
    }
    flow.start(function() {
        if (DEBUG) util.log("loaded modification sounds");
        baton.pass();
    });
});

controller.loadImages_loadFailed_ = function() {
    var msg = "could not load " + this.pickey_;
    if (DEBUG) util.log(msg);
    assert(false, msg);
};

controller.loadImages_loadSuccessful_ = function() {
    var mode = this.mode_;
    var baton = this.baton_;
    var key = this.pickey_;
    if (this.saveIt_) {
        controller.storage_assets.set(this.src, Base64Helper.canvasToBase64(this), controller.loadImages_pictureSaved_);
    }
    delete this.pickey_;
    delete this.baton_;
    delete this.mode_;
    delete this.saveIt_;
    switch (mode) {
      case "U":
        view.setUnitImageForType(this, key, view.IMAGE_CODE_IDLE, view.COLOR_RED);
        break;

      case "P":
        view.setPropertyImageForType(this, key, view.COLOR_RED);
        break;

      case "T":
        view.setTileImageForType(this, key);
        break;

      case "M":
        view.setInfoImageForType(this, key);
        break;

      default:
        assert(false);
    }
    baton.pass();
};

controller.loadImages_pictureSaved_ = function(obj) {
    if (DEBUG) util.log("caching image", obj.key);
};

controller.loadImages_prepareImg_ = function(key, path, mode, baton) {
    path = model.data_assets.images + "/" + path;
    if (DEBUG) util.log("searching image", path);
    var img = new Image();
    img.pickey_ = key;
    img.baton_ = baton;
    img.mode_ = mode;
    img.saveIt_ = false;
    img.onerror = controller.loadImages_loadFailed_;
    img.onload = controller.loadImages_loadSuccessful_;
    baton.take();
    controller.storage_assets.get(path, function(obj) {
        if (obj) {
            if (DEBUG) util.log("load image", path, "from cache");
            controller.storage_assets.get(path, function(obj) {
                img.src = "data:image/png;base64," + obj.value;
            });
        } else {
            if (DEBUG) util.log("load image", path, "from remote path");
            img.saveIt_ = true;
            img.src = path;
        }
    });
};

controller.loadImages_doIt = util.singleLazyCall(function(err, baton) {
    if (DEBUG) util.log("loading modification images");
    baton.take();
    var flow = jWorkflow.order(function() {});
    util.iterateListByFlow(flow, model.data_unitTypes, function(data, baton) {
        var obj = model.data_unitSheets[this.list[this.i]];
        if (obj.assets.gfx) controller.loadImages_prepareImg_(this.list[this.i], obj.assets.gfx, "U", baton);
    });
    util.iterateListByFlow(flow, model.data_tileTypes, function(data, baton) {
        var key = this.list[this.i];
        var obj = model.data_tileSheets[key];
        controller.loadImages_prepareImg_(key, obj.assets.gfx, "T", baton);
        if (obj.assets.gfxOverlay) view.overlayImages[key] = true;
    });
    util.iterateListByFlow(flow, model.data_propertyTypes, function(data, baton) {
        var obj = model.data_tileSheets[this.list[this.i]];
        if (obj.assets.gfx) controller.loadImages_prepareImg_(this.list[this.i], obj.assets.gfx, "P", baton);
    });
    model.data_tileTypes.forEach(function(el) {
        var obj = model.data_tileSheets[el];
        if (obj.assets.gfx_variants) {
            var subFlow = jWorkflow.order(function() {});
            obj.assets.gfx_variants[1].forEach(function(sel) {
                subFlow.andThen(function(p, baton) {
                    controller.loadImages_prepareImg_(sel[0], sel[0], "T", baton);
                });
            });
            flow.andThen(subFlow);
        }
    });
    util.iterateListByFlow(flow, model.data_propertyTypes, function(data, baton) {
        var obj = model.data_tileSheets[this.list[this.i]];
        if (obj.assets.fireAnimation) {
            controller.loadImages_prepareImg_(obj.assets.fireAnimation[0], obj.assets.fireAnimation[0], "M", baton);
        }
    });
    util.iterateListByFlow(flow, model.data_propertyTypes, function(data, baton) {
        var obj = model.data_tileSheets[this.list[this.i]];
        if (obj.assets.streamAnimation) {
            controller.loadImages_prepareImg_(obj.assets.streamAnimation[0], obj.assets.streamAnimation[0], "M", baton);
        }
    });
    util.iterateListByFlow(flow, model.data_propertyTypes, function(data, baton) {
        var obj = model.data_tileSheets[this.list[this.i]];
        if (obj.assets.chargeAnimation) {
            controller.loadImages_prepareImg_(obj.assets.chargeAnimation[0], obj.assets.chargeAnimation[0], "M", baton);
        }
    });
    util.iterateListByFlow(flow, model.data_propertyTypes, function(data, baton) {
        var obj = model.data_tileSheets[this.list[this.i]];
        if (obj.assets.fireAnimation2) {
            controller.loadImages_prepareImg_(obj.assets.fireAnimation2[0], obj.assets.fireAnimation2[0], "M", baton);
        }
    });
    util.iterateListByFlow(flow, model.data_propertyTypes, function(data, baton) {
        var obj = model.data_tileSheets[this.list[this.i]];
        if (obj.assets.streamAnimation2) {
            controller.loadImages_prepareImg_(obj.assets.streamAnimation2[0], obj.assets.streamAnimation2[0], "M", baton);
        }
    });
    util.iterateListByFlow(flow, model.data_propertyTypes, function(data, baton) {
        var obj = model.data_tileSheets[this.list[this.i]];
        if (obj.assets.chargeAnimation2) {
            controller.loadImages_prepareImg_(obj.assets.chargeAnimation2[0], obj.assets.chargeAnimation2[0], "M", baton);
        }
    });
    util.iterateListByFlow(flow, model.data_propertyTypes, function(data, baton) {
        var obj = model.data_tileSheets[this.list[this.i]];
        if (obj.assets.fireAnimation3) {
            controller.loadImages_prepareImg_(obj.assets.fireAnimation3[0], obj.assets.fireAnimation3[0], "M", baton);
        }
    });
    util.iterateListByFlow(flow, model.data_propertyTypes, function(data, baton) {
        var obj = model.data_tileSheets[this.list[this.i]];
        if (obj.assets.streamAnimation3) {
            controller.loadImages_prepareImg_(obj.assets.streamAnimation3[0], obj.assets.streamAnimation3[0], "M", baton);
        }
    });
    util.iterateListByFlow(flow, model.data_propertyTypes, function(data, baton) {
        var obj = model.data_tileSheets[this.list[this.i]];
        if (obj.assets.chargeAnimation3) {
            controller.loadImages_prepareImg_(obj.assets.chargeAnimation3[0], obj.assets.chargeAnimation3[0], "M", baton);
        }
    });
    util.iterateListByFlow(flow, model.data_propertyTypes, function(data, baton) {
        var obj = model.data_tileSheets[this.list[this.i]];
        if (obj.assets.fireAnimation4) {
            controller.loadImages_prepareImg_(obj.assets.fireAnimation4[0], obj.assets.fireAnimation4[0], "M", baton);
        }
    });
    util.iterateListByFlow(flow, model.data_propertyTypes, function(data, baton) {
        var obj = model.data_tileSheets[this.list[this.i]];
        if (obj.assets.streamAnimation4) {
            controller.loadImages_prepareImg_(obj.assets.streamAnimation4[0], obj.assets.streamAnimation4[0], "M", baton);
        }
    });
    util.iterateListByFlow(flow, model.data_propertyTypes, function(data, baton) {
        var obj = model.data_tileSheets[this.list[this.i]];
        if (obj.assets.chargeAnimation4) {
            controller.loadImages_prepareImg_(obj.assets.chargeAnimation4[0], obj.assets.chargeAnimation4[0], "M", baton);
        }
    });
    util.iterateListByFlow(flow, model.data_menu.bgs, function(data, baton) {
        controller.loadImages_prepareImg_(this.list[this.i], this.list[this.i], "M", baton);
    });
    util.iterateListByFlow(flow, model.data_graphics.misc, function(data, baton) {
        controller.loadImages_prepareImg_(this.list[this.i][0], this.list[this.i][1], "M", baton);
    });
    flow.start(function(e) {
        if (e && DEBUG) util.log("could not load modification images");
        if (!e && DEBUG) util.log("loaded all modification images");
        baton.pass();
    });
});

controller.loadInputDevices = util.singleLazyCall(function(err, baton) {
    if (DEBUG) util.log("loading input devices");
    var canvas = document.getElementById("cwt_canvas");
    var menuEl = document.getElementById("cwt_menu");
    if (controller.features_client.keyboard) controller.setupKeyboardControls(canvas, menuEl);
    if (controller.features_client.gamePad) controller.setupGamePadControls(canvas, menuEl);
    if (controller.features_client.mouse) controller.setupMouseControls(canvas, menuEl);
    if (controller.features_client.touch) controller.setupTouchControls(canvas, menuEl);
});

controller.loadMaps_load_ = function(path, baton) {
    baton.take();
    controller.storage_maps.exists(path, function(exits) {
        if (!exits) {
            if (DEBUG) util.log("going to cache map " + path);
            util.grabRemoteFile({
                path: model.data_assets.maps + "/" + path,
                json: true,
                error: function(msg) {
                    baton.pass();
                },
                success: function(resp) {
                    controller.storage_maps.set(path, resp, function() {
                        if (DEBUG) util.log("cached map " + path);
                    });
                    baton.pass();
                }
            });
        } else baton.pass();
    });
};

controller.loadMaps_doIt = util.singleLazyCall(function(p, baton) {
    if (DEBUG) util.log("loading maps");
    var flow = jWorkflow.order(function() {
        baton.take();
    });
    util.iterateListByFlow(flow, model.data_maps, function(data, b) {
        controller.loadMaps_load_(this.list[this.i], b);
    });
    flow.start(function() {
        baton.pass();
    });
});

controller.modification_load = util.singleLazyCall(function(err, baton) {
    if (DEBUG) util.log("loading modification");
    var MOD_KEY = "modification_data";
    function addModPart(file, baton) {
        baton.take();
        util.grabRemoteFile({
            path: MOD_PATH + file + ".json",
            json: true,
            error: function(msg) {
                baton.drop(msg);
            },
            success: function(resp) {
                mod[file] = resp;
                baton.pass();
            }
        });
    }
    function loadLanguage(p, b) {
        var lang = window.navigator.language;
        if (lang && lang !== "en") {
            b.take();
            util.grabRemoteFile({
                path: MOD_PATH + "/language_" + lang + ".json",
                json: true,
                error: function(msg) {
                    util.grabRemoteFile({
                        path: MOD_PATH + "/language.json",
                        json: true,
                        error: function(msg) {
                            baton.drop({
                                message: msg,
                                stack: null
                            });
                        },
                        success: function(resp) {
                            mod["language"] = resp;
                            b.pass();
                        }
                    });
                },
                success: function(resp) {
                    mod["language"] = resp;
                    b.pass();
                }
            });
        } else addModPart("language", b);
    }
    baton.take();
    var mod;
    jWorkflow.order().andThen(function(p, b) {
        b.take();
        controller.storage_general.get(MOD_KEY, function(obj) {
            if (!obj) {
                mod = {};
                b.pass(true);
            } else {
                mod = obj.value;
                b.pass(false);
            }
        });
    }).andThen(function(modExists, subBaton) {
        if (modExists) {
            if (DEBUG) util.log("grab new modification");
            subBaton.take();
            jWorkflow.order().andThen(function(p, b) {
                addModPart("header", b);
            }).andThen(function(p, b) {
                addModPart("co", b);
            }).andThen(function(p, b) {
                addModPart("fraction", b);
            }).andThen(function(p, b) {
                addModPart("gamemode", b);
            }).andThen(function(p, b) {
                addModPart("maps", b);
            }).andThen(function(p, b) {
                addModPart("movetypes", b);
            }).andThen(function(p, b) {
                addModPart("globalrules", b);
            }).andThen(function(p, b) {
                addModPart("sounds", b);
            }).andThen(function(p, b) {
                addModPart("menu", b);
            }).andThen(function(p, b) {
                addModPart("tiles", b);
            }).andThen(function(p, b) {
                addModPart("units", b);
            }).andThen(function(p, b) {
                addModPart("weathers", b);
            }).andThen(function(p, b) {
                addModPart("assets", b);
            }).andThen(function(p, b) {
                addModPart("graphics", b);
            }).andThen(function(p, b) {
                addModPart("tips", b);
            }).andThen(loadLanguage).start(function(p) {
                if (p) {
                    if (DEBUG) util.log("failed to grab modification");
                    subBaton.drop(p);
                } else {
                    if (DEBUG) util.log("finished grabbing modification");
                    subBaton.pass(true);
                }
            });
        } else {
            return false;
        }
    }).andThen(function(modGrabbed, b) {
        if (!DEBUG) {
            if (modGrabbed) {
                b.take();
                controller.storage_general.set(null, function() {
                    b.pass();
                });
            }
        } else {
            util.log("will not caching modification data because being in debug mode");
        }
    }).andThen(function() {
        model.modification_load(mod);
    }).start(function(p) {
        if (p) baton.drop(p); else baton.pass();
    });
});

util.scoped(function() {
    var enabled;
    var gamepads = [];
    var prevTimestamps = [];
    controller.setupGamePadControls = function(canvas, menuEl) {
        var chrome = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;
        if (chrome) {
            enabled = true;
            gamepads = navigator.webkitGetGamepads();
        }
    };
    controller.updateGamePadControls = function(canvas, menuEl) {
        if (!enabled) return;
        for (var i = 0, e = 4; i < e; i++) {
            var gamepad = gamepads[i];
            if (!gamepad) continue;
            if (prevTimestamps[i] && gamepad.timestamp == prevTimestamps[i]) continue;
            prevTimestamps[i] = gamepad.timestamp;
            if (controller.activeMapping !== null && controller.activeMapping === controller.KEY_MAPPINGS.GAMEPAD) {
                var code = -1;
                if (gamepad.buttons[0] === 1) code = 0; else if (gamepad.buttons[1] === 1) code = 1; else if (gamepad.buttons[2] === 1) code = 2; else if (gamepad.buttons[3] === 1) code = 3; else if (gamepad.buttons[4] === 1) code = 4; else if (gamepad.buttons[5] === 1) code = 5; else if (gamepad.buttons[6] === 1) code = 6; else if (gamepad.buttons[7] === 1) code = 7; else if (gamepad.buttons[8] === 1) code = 8; else if (gamepad.buttons[9] === 1) code = 9; else if (gamepad.buttons[10] === 1) code = 10; else if (gamepad.buttons[11] === 1) code = 11; else if (gamepad.buttons[12] === 1) code = 12; else if (gamepad.buttons[13] === 1) code = 13;
                if (code > -1) controller.screenStateMachine.event("INPUT_SET", code);
            } else {
                var keymap = controller.keyMaps.GAMEPAD;
                var key = null;
                if (gamepad.axes[1] < -.5) key = "INP_UP"; else if (gamepad.axes[1] > +.5) key = "INP_DOWN";
                if (gamepad.axes[0] < -.5) key = "INP_LEFT"; else if (gamepad.axes[0] > +.5) key = "INP_RIGHT";
                if (gamepad.buttons[keymap.ACTION] === 1) key = "INP_ACTION"; else if (gamepad.buttons[keymap.CANCEL] === 1) key = "INP_CANCEL";
                if (key) controller.screenStateMachine.event(key, 1);
            }
        }
    };
});

util.scoped(function() {
    controller.setupKeyboardControls = function(canvas, menuEl) {
        if (DEBUG) util.log("initializing keyboard support");
        document.onkeydown = function(ev) {
            if (controller.activeMapping !== null && controller.activeMapping === controller.KEY_MAPPINGS.KEYBOARD) {
                controller.screenStateMachine.event("INPUT_SET", ev.keyCode);
            } else {
                var keymap = controller.keyMaps.KEYBOARD;
                switch (ev.keyCode) {
                  case keymap.LEFT:
                    controller.screenStateMachine.event("INP_LEFT", 1);
                    return false;

                  case keymap.UP:
                    controller.screenStateMachine.event("INP_UP", 1);
                    return false;

                  case keymap.RIGHT:
                    controller.screenStateMachine.event("INP_RIGHT", 1);
                    return false;

                  case keymap.DOWN:
                    controller.screenStateMachine.event("INP_DOWN", 1);
                    return false;

                  case keymap.CANCEL:
                    controller.screenStateMachine.event("INP_CANCEL");
                    return false;

                  case keymap.ACTION:
                    controller.screenStateMachine.event("INP_ACTION");
                    return false;
                }
            }
            return false;
        };
    };
});

controller.setupMouseControls = function(canvas, menuEl) {
    if (DEBUG) util.log("initializing mouse support");
    var mouseInMenu = false;
    menuEl.onmouseout = function() {
        mouseInMenu = false;
    };
    menuEl.onmouseover = function() {
        mouseInMenu = true;
    };
    var len = TILE_LENGTH;
    var msx = 0;
    var msy = 0;
    var menusy = 0;
    document.addEventListener("mousemove", function(ev) {
        var id = ev.target.id;
        if (id !== "cwt_canvas" && !controller.menuVisible) return;
        var x, y;
        ev = ev || window.event;
        if (controller.menuVisible) {
            x = ev.pageX;
            y = ev.pageY;
            if (menusy !== -1) {
                if (y <= menusy - 16) {
                    controller.screenStateMachine.event("INP_UP");
                    menusy = y;
                } else if (y >= menusy + 16) {
                    controller.screenStateMachine.event("INP_DOWN");
                    menusy = y;
                }
            } else menusy = y;
        } else {
            if (typeof ev.offsetX === "number") {
                x = ev.offsetX;
                y = ev.offsetY;
            } else {
                x = ev.layerX;
                y = ev.layerY;
            }
            x = parseInt(x / len, 10);
            y = parseInt(y / len, 10);
            controller.screenStateMachine.event("INP_HOVER", x, y);
        }
    });
    document.onmousedown = function(ev) {
        ev = ev || window.event;
        if (typeof ev.offsetX === "number") {
            msx = ev.offsetX;
            msy = ev.offsetY;
        } else {
            msx = ev.layerX;
            msy = ev.layerY;
        }
    };
    document.onmouseup = function(ev) {
        ev = ev || window.event;
        var msex;
        var msey;
        if (typeof ev.offsetX === "number") {
            msex = ev.offsetX;
            msey = ev.offsetY;
        } else {
            msex = ev.layerX;
            msey = ev.layerY;
        }
        var dex = Math.abs(msx - msex);
        var dey = Math.abs(msy - msey);
        menusy = -1;
        switch (ev.which) {
          case 1:
            controller.screenStateMachine.event("INP_ACTION");
            break;

          case 2:
            break;

          case 3:
            controller.screenStateMachine.event("INP_CANCEL");
            break;
        }
    };
};

controller.setupTouchControls = function(canvas, menuEl) {
    util.scoped(function() {
        var sx, sy;
        var ex, ey;
        var s2x, s2y;
        var e2x, e2y;
        var st;
        var pinDis, pinDis2;
        var dragDiff = 0;
        var isDrag = false;
        document.addEventListener("touchstart", function(event) {
            if (event.target.id !== "cwt_options_mapIn") event.preventDefault();
            sx = event.touches[0].screenX;
            sy = event.touches[0].screenY;
            ex = sx;
            ey = sy;
            isDrag = false;
            if (event.touches.length === 2) {
                s2x = event.touches[1].screenX;
                s2y = event.touches[1].screenY;
                e2x = s2x;
                e2y = s2y;
                var dx = Math.abs(sx - s2x);
                var dy = Math.abs(sy - s2y);
                pinDis = Math.sqrt(dx * dx + dy * dy);
            } else s2x = -1;
            st = event.timeStamp;
        }, false);
        document.addEventListener("touchmove", function(event) {
            if (event.target.id !== "cwt_options_mapIn") event.preventDefault();
            ex = event.touches[0].screenX;
            ey = event.touches[0].screenY;
            if (event.touches.length === 2) {
                e2x = event.touches[1].screenX;
                e2y = event.touches[1].screenY;
                var dx = Math.abs(ex - e2x);
                var dy = Math.abs(ey - e2y);
                pinDis2 = Math.sqrt(dx * dx + dy * dy);
            } else s2x = -1;
            var dx = Math.abs(sx - ex);
            var dy = Math.abs(sy - ey);
            var d = Math.sqrt(dx * dx + dy * dy);
            var timeDiff = event.timeStamp - st;
            if (d > 16) {
                if (timeDiff > 300) {
                    isDrag = true;
                    if (dragDiff > 75) {
                        var mode;
                        if (dx > dy) {
                            if (sx > ex) mode = "INP_LEFT"; else mode = "INP_RIGHT";
                        } else {
                            if (sy > ey) mode = "INP_UP"; else mode = "INP_DOWN";
                        }
                        dragDiff = 0;
                        sx = ex;
                        sy = ey;
                        controller.screenStateMachine.event(mode, 1);
                    } else dragDiff += timeDiff;
                }
            }
        }, false);
        document.addEventListener("touchend", function(event) {
            if (event.target.id !== "cwt_options_mapIn") event.preventDefault();
            if (controller.inputCoolDown > 0) return;
            var dx = Math.abs(sx - ex);
            var dy = Math.abs(sy - ey);
            var d = Math.sqrt(dx * dx + dy * dy);
            var timeDiff = event.timeStamp - st;
            if (s2x !== -1) {
                var pinDis3 = Math.abs(pinDis2 - pinDis);
                if (pinDis3 <= 32) {
                    controller.screenStateMachine.event("INP_CANCEL");
                } else {
                    if (pinDis2 < pinDis) {} else {}
                }
                controller.inputCoolDown = 500;
            } else {
                if (d <= 16) {
                    if (timeDiff <= 500) {
                        controller.screenStateMachine.event("INP_ACTION");
                    }
                } else if (timeDiff <= 300) {
                    var mode;
                    if (dx > dy) {
                        if (sx > ex) mode = "INP_LEFT"; else mode = "INP_RIGHT";
                    } else {
                        if (sy > ey) mode = "INP_UP"; else mode = "INP_DOWN";
                    }
                    controller.screenStateMachine.event(mode, 1);
                }
            }
        }, false);
    });
};

util.scoped(function() {
    var tmpData = util.matrix(MAX_SELECTION_RANGE * 4 + 1, MAX_SELECTION_RANGE * 4 + 1, 0);
    controller.attackRangeVisible = false;
    controller.showAttackRangeInfo = function() {
        if (controller.attackRangeVisible) return;
        var x = controller.mapCursorX;
        var y = controller.mapCursorY;
        var unit = model.unit_posData[x][y];
        if (unit === null) return;
        var unitId = model.unit_extractId(unit);
        if (DEBUG) util.log("show attack range information");
        var selection = controller.stateMachine.data.selection;
        selection.setCenter(x, y, INACTIVE_ID);
        if (model.battle_isIndirectUnit(unitId)) {
            model.battle_calculateTargets(unitId, x, y, selection);
        } else {
            controller.stateMachine.data.movePath.move_fillMoveMap(x, y, unit);
            selection.data.cloneValues(tmpData);
            selection.setCenter(x, y, INACTIVE_ID);
            var e = tmpData.length;
            for (var ax = 0; ax < e; ax++) {
                for (var ay = 0; ay < e; ay++) {
                    if (tmpData[ax][ay] >= 0) {
                        model.battle_calculateTargets(unitId, ax, ay, selection, true);
                    }
                }
            }
        }
        controller.attackRangeVisible = true;
    };
    controller.hideAttackRangeInfo = function() {
        if (!controller.attackRangeVisible) return;
        if (DEBUG) util.log("hide attack range information");
        view.redraw_markSelection(controller.stateMachine.data);
        controller.attackRangeVisible = false;
    };
});

controller.registerMenuRenderer("buildUnit", function(content, entry, index, enabled) {
    var cost = model.data_unitSheets[content].cost;
    if (enabled) entry.innerHTML = model.data_localized(content) + " (" + cost + "$)"; else entry.innerHTML = "<span style='color:red;'>" + model.data_localized(content) + " (" + cost + "$) </span>";
});

util.scoped(function() {
    var PANEL = document.getElementById("cwt_game_infoBar");
    var ROW1 = document.getElementById("infoBox_unitRow1");
    var ROW2 = document.getElementById("infoBox_unitRow2");
    var ROW3 = document.getElementById("infoBox_unitRow3");
    var NAME = document.getElementById("infoBox_name");
    var HP = document.getElementById("infoBox_hp");
    var GAS = document.getElementById("infoBox_fuel");
    var AMMO = document.getElementById("infoBox_ammo");
    var GAS2 = document.getElementById("infoBox_fuel2");
    var AMMO2 = document.getElementById("infoBox_ammo2");
    var ATTRANGE = document.getElementById("infoBox_attrange");
    var ATTRANGE2 = document.getElementById("infoBox_attrange2");
    var HP_D = document.getElementById("infoBox_hp_d");
    var PR_HP_D = document.getElementById("infoBox_pr_hp_d");
    var GAS_D = document.getElementById("infoBox_fuel_d");
    var AMMO_D = document.getElementById("infoBox_ammo_d");
    var ATTRANGE_D = document.getElementById("infoBox_attrange_d");
    var PLAYER_NAME = document.getElementById("infoBox_playerName");
    var PLAYER_POWER = document.getElementById("infoBox_playerpower");
    var PLAYER_GOLD = document.getElementById("infoBox_playergold");
    var TILE_ROW1 = document.getElementById("infoBox_tileRow1");
    var TILE_ROW2 = document.getElementById("infoBox_tileRow2");
    var TILE_ROW2D2 = document.getElementById("infoBox_tileRow2d2");
    var TILE_NAME = document.getElementById("infoBox_tilename");
    var DEFENSE_D = document.getElementById("infoBox_defense_d");
    var DEFENSE = document.getElementById("infoBox_defense");
    var CAPPT_D = document.getElementById("infoBox_capPt_d");
    var CAPPT = document.getElementById("infoBox_capPt");
    var CAPPT2 = document.getElementById("infoBox_capPt2");
    var symbolsRendered = false;
    var capCanvasRendered = true;
    controller.sideSimpleTileInformationPanel = -1;
    controller.moveSimpleTileInformationToLeft = function() {
        if (controller.sideSimpleTileInformationPanel < 0) return;
        PANEL.style.left = "4px";
        PANEL.style.right = "";
        controller.sideSimpleTileInformationPanel = -1;
    };
    controller.moveSimpleTileInformationToRight = function() {
        if (controller.sideSimpleTileInformationPanel > 0) return;
        PANEL.style.right = "4px";
        PANEL.style.left = "";
        controller.sideSimpleTileInformationPanel = +1;
    };
    controller.updateSimpleTileInformation = function() {
        var x = controller.mapCursorX;
        var y = controller.mapCursorY;
        var unit = model.unit_posData[x][y];
        var prop = model.property_posMap[x][y];
        var type;
        if (!symbolsRendered) {
            HP_D.getContext("2d").drawImage(view.getInfoImageForType("SYM_HP"), 0, 0);
            PR_HP_D.getContext("2d").drawImage(view.getInfoImageForType("SYM_HP"), 0, 0);
            GAS_D.getContext("2d").drawImage(view.getInfoImageForType("SYM_FUEL"), 0, 0);
            AMMO_D.getContext("2d").drawImage(view.getInfoImageForType("SYM_AMMO"), 0, 0);
            ATTRANGE_D.getContext("2d").drawImage(view.getInfoImageForType("SYM_ATT"), 0, 0);
            DEFENSE_D.getContext("2d").drawImage(view.getInfoImageForType("SYM_DEFENSE"), 0, 0);
            CAPPT_D.getContext("2d").drawImage(view.getInfoImageForType("SYM_CAPTURE"), 0, 0);
            symbolsRendered = true;
        }
        if (!unit) {
            NAME.style.opacity = 0;
            ROW1.style.opacity = 0;
            ROW2.style.opacity = 0;
            ROW3.style.opacity = 0;
        } else {
            type = unit.type;
            NAME.innerHTML = model.data_localized(type.ID);
            HP.innerHTML = unit.hp;
            GAS.innerHTML = unit.fuel;
            GAS2.innerHTML = type.fuel;
            AMMO.innerHTML = unit.ammo;
            AMMO2.innerHTML = type.ammo;
            var attack = type.attack;
            if (attack) {
                ATTRANGE.innerHTML = attack.minrange || 1;
                ATTRANGE2.innerHTML = attack.maxrange || 1;
            } else {
                ATTRANGE.innerHTML = "";
                ATTRANGE2.innerHTML = "";
            }
            NAME.style.opacity = 1;
            ROW1.style.opacity = 1;
            ROW2.style.opacity = 1;
            ROW3.style.opacity = 1;
        }
        if (!prop) {
            type = model.map_data[x][y];
            TILE_NAME.innerHTML = model.data_localized(type.ID);
            DEFENSE.innerHTML = type.defense;
            TILE_ROW2D2.style.opacity = 0;
        } else {
            type = prop.type;
            TILE_NAME.innerHTML = model.data_localized(type.ID);
            CAPPT.innerHTML = prop.capturePoints;
            if (prop.capturePoints < 0) {
                if (!capCanvasRendered) {
                    PR_HP_D.style.display = "none";
                    CAPPT_D.style.display = "";
                    capCanvasRendered = true;
                }
            } else {
                if (capCanvasRendered) {
                    PR_HP_D.style.display = "";
                    CAPPT_D.style.display = "none";
                    capCanvasRendered = false;
                }
            }
            CAPPT2.innerHTML = 20;
            DEFENSE.innerHTML = type.defense;
            TILE_ROW2D2.style.opacity = 1;
        }
        type = null;
        var id = -1;
        if (unit) id = unit.owner; else if (prop && prop.owner !== INACTIVE_ID) id = prop.owner; else id = model.round_turnOwner;
        if (id > -1) {
            type = model.player_data[id];
            PLAYER_NAME.innerHTML = type.name;
            PLAYER_GOLD.innerHTML = type.gold;
            PLAYER_POWER.innerHTML = model.co_data[id].power;
        } else {
            PLAYER_NAME.innerHTML = "";
            PLAYER_GOLD.innerHTML = "";
            PLAYER_POWER.innerHTML = "";
        }
    };
});

controller.updateComplexTileInformation = function() {};

controller.registerMenuRenderer("__mainMenu__", function(content, entry, index) {
    entry.innerHTML = model.data_localized(content);
});

controller.registerMenuRenderer("team_transferMoney", function(content, entry, index) {
    entry.innerHTML = content + "$";
});

util.scoped(function() {
    var extractPlayer = function(content, entry, index) {
        entry.innerHTML = model.player_data[content].name;
    };
    controller.registerMenuRenderer("transferProperty", extractPlayer);
    controller.registerMenuRenderer("transferUnit", extractPlayer);
});

controller.registerMenuRenderer("unloadUnit", function(content, entry, index) {
    if (content === "done") {
        entry.innerHTML = model.data_localized("done");
    } else entry.innerHTML = model.data_localized(model.unit_data[content].type.ID);
});

util.scoped(function() {
    var expl_img;
    var rocket_img;
    var rocket_img_inv;
    function renderSmoke(x, y, step, distance) {
        step -= distance - 1;
        if (step < 0 || step > 9) return;
        var tileSize = TILE_LENGTH;
        var scx = 48 * step;
        var scy = 0;
        var scw = 48;
        var sch = 48;
        var tcx = x * tileSize;
        var tcy = y * tileSize;
        var tcw = tileSize;
        var tch = tileSize;
        view.canvasCtx.drawImage(expl_img, scx, scy, scw, sch, tcx, tcy, tcw, tch);
        view.redraw_markPos(x, y);
    }
    function checkStatus(x, y) {
        if (model.map_isValidPosition(x, y)) {
            var unit = model.unit_posData[x][y];
            if (unit !== null) {
                controller.updateUnitStatus(model.unit_extractId(unit));
            }
        }
    }
    view.registerAnimationHook({
        key: "bombs_startFireSilo",
        prepare: function(x, y, siloId, tx, ty) {
            if (!rocket_img) rocket_img = view.getInfoImageForType("FLYING_ROCKET");
            if (!rocket_img_inv) rocket_img_inv = view.getInfoImageForType("FLYING_ROCKET_INV");
            this.siloX = controller.getCanvasPosX(x);
            this.siloY = controller.getCanvasPosY(y);
            this.targetX = controller.getCanvasPosX(tx);
            this.targetY = controller.getCanvasPosY(ty);
            this.curX = this.siloX;
            this.curY = this.siloY;
            this.phase = 0;
        },
        render: function() {
            var tileSize = TILE_LENGTH;
            var scx = 0;
            var scy = 0;
            var scw = 24;
            var sch = 24;
            var tcx = this.curX;
            var tcy = this.curY;
            var tcw = tileSize + 8;
            var tch = tileSize + 8;
            view.canvasCtx.drawImage(this.phase === 0 ? rocket_img : rocket_img_inv, scx, scy, scw, sch, tcx, tcy, tcw, tch);
            view.redraw_markPosWithNeighboursRing(parseInt(this.curX / TILE_LENGTH, 10), parseInt(this.curY / TILE_LENGTH, 10));
        },
        update: function(delta) {
            var shift = delta / 1e3 * TILE_LENGTH * 14;
            if (this.phase === 0) {
                this.curY -= shift;
                if (this.curY <= 0) {
                    this.curX = this.targetX;
                    this.curY = 0;
                    this.phase = 1;
                }
            } else {
                this.curY += shift;
                if (this.curY >= this.targetY) {
                    this.phase = 2;
                }
            }
        },
        isDone: function() {
            return this.phase === 2;
        }
    });
    view.registerAnimationHook({
        key: "bombs_explosionAt",
        prepare: function(tx, ty, range, damage, owner) {
            if (!expl_img) expl_img = view.getInfoImageForType("EXPLOSION_GROUND");
            controller.audio_playSound("ROCKET_IMPACT");
            this.x = tx;
            this.y = ty;
            this.range = range;
            this.maxStep = 10 + range + 1;
            this.step = 0;
            this.time = 0;
        },
        render: function() {
            model.map_doInRange(this.x, this.y, this.range, renderSmoke, this.step);
        },
        update: function(delta) {
            this.time += delta;
            if (this.time > 75) {
                this.step++;
                this.time = 0;
            }
        },
        isDone: function() {
            var done = this.step === this.maxStep;
            if (done) model.map_doInRange(this.x, this.y, this.range, checkStatus);
            return done;
        }
    });
    view.registerAnimationHook({
        key: "bombs_fireCannon",
        prepare: function(ox, oy, x, y, tp) {
            var type = model.data_tileSheets[tp];
            var fireAnim = type.assets.fireAnimation;
            assert(fireAnim.length === 5);
            this.pic = view.getInfoImageForType(fireAnim[0]);
            this.sizeX = fireAnim[1];
            this.sizeY = fireAnim[2];
            this.offsetX = fireAnim[3];
            this.offsetY = fireAnim[4];
            this.curX = ox;
            this.curY = oy;
            this.step = 0;
            this.time = 0;
            controller.audio_playSound(type.assets.fireSound);
        },
        render: function() {
            var tileSize = TILE_LENGTH;
            var scx = this.sizeX * this.step;
            var scy = 0;
            var scw = this.sizeX;
            var sch = this.sizeY;
            var tcx = this.curX * tileSize + this.offsetX;
            var tcy = this.curY * tileSize + this.offsetY;
            var tcw = this.sizeX;
            var tch = this.sizeY;
            view.canvasCtx.drawImage(this.pic, scx, scy, scw, sch, tcx, tcy, tcw, tch);
        },
        update: function(delta) {
            this.time += delta;
            if (this.time > 100) {
                this.step++;
                this.time = 0;
            }
        },
        isDone: function() {
            return this.step === 6;
        }
    });
    view.registerAnimationHook({
        key: "bombs_fireLaser",
        prepare: function(ox, oy, tp) {
            var type = model.data_tileSheets[tp];
            var fireAnimA = type.assets.chargeAnimation;
            var fireAnimB = type.assets.fireAnimation;
            var fireAnimC = type.assets.streamAnimation;
            assert(fireAnimA.length === 5);
            assert(fireAnimB.length === 5);
            assert(fireAnimC.length === 5);
            this.a = {
                pic: view.getInfoImageForType(fireAnimA[0]),
                sizeX: fireAnimB[1],
                sizeY: fireAnimB[2],
                offsetX: fireAnimB[3],
                offsetY: fireAnimB[4]
            };
            this.b = {
                pic: view.getInfoImageForType(fireAnimB[0]),
                sizeX: fireAnimA[1],
                sizeY: fireAnimA[2],
                offsetX: fireAnimA[3],
                offsetY: fireAnimA[4]
            };
            this.c = {
                pic: view.getInfoImageForType(fireAnimC[0]),
                sizeX: fireAnimC[1],
                sizeY: fireAnimC[2],
                offsetX: fireAnimC[3],
                offsetY: fireAnimC[4]
            };
            fireAnimA = type.assets.chargeAnimation3;
            fireAnimB = type.assets.fireAnimation3;
            fireAnimC = type.assets.streamAnimation3;
            assert(fireAnimA.length === 5);
            assert(fireAnimB.length === 5);
            assert(fireAnimC.length === 5);
            this.a2 = {
                pic: view.getInfoImageForType(fireAnimA[0]),
                sizeX: fireAnimB[1],
                sizeY: fireAnimB[2],
                offsetX: fireAnimB[3],
                offsetY: fireAnimB[4]
            };
            this.b2 = {
                pic: view.getInfoImageForType(fireAnimB[0]),
                sizeX: fireAnimA[1],
                sizeY: fireAnimA[2],
                offsetX: fireAnimA[3],
                offsetY: fireAnimA[4]
            };
            this.c2 = {
                pic: view.getInfoImageForType(fireAnimC[0]),
                sizeX: fireAnimC[1],
                sizeY: fireAnimC[2],
                offsetX: fireAnimC[3],
                offsetY: fireAnimC[4]
            };
            fireAnimA = type.assets.chargeAnimation2;
            fireAnimB = type.assets.fireAnimation2;
            fireAnimC = type.assets.streamAnimation2;
            assert(fireAnimA.length === 5);
            assert(fireAnimB.length === 5);
            assert(fireAnimC.length === 5);
            this.a3 = {
                pic: view.getInfoImageForType(fireAnimA[0]),
                sizeX: fireAnimB[1],
                sizeY: fireAnimB[2],
                offsetX: fireAnimB[3],
                offsetY: fireAnimB[4]
            };
            this.b3 = {
                pic: view.getInfoImageForType(fireAnimB[0]),
                sizeX: fireAnimA[1],
                sizeY: fireAnimA[2],
                offsetX: fireAnimA[3],
                offsetY: fireAnimA[4]
            };
            this.c3 = {
                pic: view.getInfoImageForType(fireAnimC[0]),
                sizeX: fireAnimC[1],
                sizeY: fireAnimC[2],
                offsetX: fireAnimC[3],
                offsetY: fireAnimC[4]
            };
            fireAnimA = type.assets.chargeAnimation4;
            fireAnimB = type.assets.fireAnimation4;
            fireAnimC = type.assets.streamAnimation4;
            assert(fireAnimA.length === 5);
            assert(fireAnimB.length === 5);
            assert(fireAnimC.length === 5);
            this.a4 = {
                pic: view.getInfoImageForType(fireAnimA[0]),
                sizeX: fireAnimB[1],
                sizeY: fireAnimB[2],
                offsetX: fireAnimB[3],
                offsetY: fireAnimB[4]
            };
            this.b4 = {
                pic: view.getInfoImageForType(fireAnimB[0]),
                sizeX: fireAnimA[1],
                sizeY: fireAnimA[2],
                offsetX: fireAnimA[3],
                offsetY: fireAnimA[4]
            };
            this.c4 = {
                pic: view.getInfoImageForType(fireAnimC[0]),
                sizeX: fireAnimC[1],
                sizeY: fireAnimC[2],
                offsetX: fireAnimC[3],
                offsetY: fireAnimC[4]
            };
            this.curX = ox;
            this.curY = oy;
            this.phase = 0;
            this.step = 0;
            this.time = 0;
            controller.audio_playSound(type.assets.fireSound);
        },
        render: function() {
            var data = this.phase === 0 ? this.a : this.b;
            var data2 = this.phase === 0 ? this.a2 : this.b2;
            var data3 = this.phase === 0 ? this.a3 : this.b3;
            var data4 = this.phase === 0 ? this.a4 : this.b4;
            var tileSize = TILE_LENGTH;
            var scx = data.sizeX * this.step;
            var scy = 0;
            var scw = data.sizeX;
            var sch = data.sizeY;
            var tcx = this.curX * tileSize + data.offsetX;
            var tcy = this.curY * tileSize + data.offsetY;
            var tcw = data.sizeX;
            var tch = data.sizeY;
            view.canvasCtx.drawImage(data.pic, scx, scy, scw, sch, tcx, tcy, tcw, tch);
            tileSize = TILE_LENGTH;
            scx = data2.sizeX * this.step;
            scy = 0;
            scw = data2.sizeX;
            sch = data2.sizeY;
            tcx = this.curX * tileSize + data2.offsetX;
            tcy = this.curY * tileSize + data2.offsetY;
            tcw = data2.sizeX;
            tch = data2.sizeY;
            view.canvasCtx.drawImage(data2.pic, scx, scy, scw, sch, tcx, tcy, tcw, tch);
            tileSize = TILE_LENGTH;
            scx = data3.sizeX * this.step;
            scy = 0;
            scw = data3.sizeX;
            sch = data3.sizeY;
            tcx = this.curX * tileSize + data3.offsetX;
            tcy = this.curY * tileSize + data3.offsetY;
            tcw = data3.sizeX;
            tch = data3.sizeY;
            view.canvasCtx.drawImage(data3.pic, scx, scy, scw, sch, tcx, tcy, tcw, tch);
            tileSize = TILE_LENGTH;
            scx = data4.sizeX * this.step;
            scy = 0;
            scw = data4.sizeX;
            sch = data4.sizeY;
            tcx = this.curX * tileSize + data4.offsetX;
            tcy = this.curY * tileSize + data4.offsetY;
            tcw = data4.sizeX;
            tch = data4.sizeY;
            view.canvasCtx.drawImage(data4.pic, scx, scy, scw, sch, tcx, tcy, tcw, tch);
            view.redraw_markPosWithNeighboursRing(this.curX, this.curY);
            if (data === this.b) {
                data = this.c;
                data2 = this.c2;
                data3 = this.c3;
                data4 = this.c4;
                scx = data.sizeX * this.step;
                scy = 0;
                scw = data.sizeX;
                sch = data.sizeY;
                for (var ci = this.curX + 1, ce = model.map_width; ci < ce; ci++) {
                    tcx = ci * tileSize + data.offsetX;
                    tcy = this.curY * tileSize + data.offsetY;
                    tcw = data.sizeX;
                    tch = data.sizeY;
                    view.canvasCtx.drawImage(data.pic, scx, scy, scw, sch, tcx, tcy, tcw, tch);
                    view.redraw_markPos(ci, this.curY - 1);
                    view.redraw_markPos(ci, this.curY);
                    view.redraw_markPos(ci, this.curY + 1);
                }
                scx = data2.sizeX * this.step;
                scy = 0;
                scw = data2.sizeX;
                sch = data2.sizeY;
                for (var ci = this.curX - 1, ce = 0; ci >= ce; ci--) {
                    tcx = ci * tileSize + data2.offsetX;
                    tcy = this.curY * tileSize + data2.offsetY;
                    tcw = data2.sizeX;
                    tch = data2.sizeY;
                    view.canvasCtx.drawImage(data2.pic, scx, scy, scw, sch, tcx, tcy, tcw, tch);
                    view.redraw_markPos(ci, this.curY - 1);
                    view.redraw_markPos(ci, this.curY);
                    view.redraw_markPos(ci, this.curY + 1);
                }
                scx = data3.sizeX * this.step;
                scy = 0;
                scw = data3.sizeX;
                sch = data3.sizeY;
                for (var ci = this.curY + 1, ce = model.map_height; ci < ce; ci++) {
                    tcx = this.curX * tileSize + data3.offsetX;
                    tcy = ci * tileSize + data3.offsetY;
                    tcw = data3.sizeX;
                    tch = data3.sizeY;
                    view.canvasCtx.drawImage(data3.pic, scx, scy, scw, sch, tcx, tcy, tcw, tch);
                    view.redraw_markPos(this.curX + 1, ci);
                    view.redraw_markPos(this.curX, ci);
                    view.redraw_markPos(this.curX - 1, ci);
                }
                scx = data4.sizeX * this.step;
                scy = 0;
                scw = data4.sizeX;
                sch = data4.sizeY;
                for (var ci = this.curY - 1, ce = 0; ci >= 0; ci--) {
                    tcx = this.curX * tileSize + data4.offsetX;
                    tcy = ci * tileSize + data4.offsetY;
                    tcw = data4.sizeX;
                    tch = data4.sizeY;
                    view.canvasCtx.drawImage(data4.pic, scx, scy, scw, sch, tcx, tcy, tcw, tch);
                    view.redraw_markPos(this.curX + 1, ci);
                    view.redraw_markPos(this.curX, ci);
                    view.redraw_markPos(this.curX - 1, ci);
                }
            }
        },
        update: function(delta) {
            this.time += delta;
            if (this.time > 100) {
                this.step++;
                this.time = 0;
                switch (this.phase) {
                  case 0:
                    if (this.step === 10) {
                        this.step = 0;
                        this.phase++;
                    }

                  case 1:
                    if (this.step === 12) {
                        this.step = 0;
                        this.phase++;
                    }
                }
            }
        },
        isDone: function() {
            return this.phase === 2;
        }
    });
});

view.registerAnimationHook({
    key: "property_capture",
    prepare: function(cid, prid) {
        var property = model.property_data[prid];
        controller.updateUnitStatus(cid);
        if (property.capturePoints === 20) {
            view.showInfoMessage(model.data_localized("propertyCaptured"));
        } else view.showInfoMessage(model.data_localized("propertyPointsLeft") + " " + property.capturePoints);
    },
    render: function() {},
    update: function() {},
    isDone: function() {
        return !view.hasInfoMessage();
    }
});

view.registerAnimationHook({
    key: "weather_change",
    prepare: function(wth) {
        view.showInfoMessage(model.data_localized("weatherChange") + " " + model.data_localized(wth));
    },
    render: function() {},
    update: function() {},
    isDone: function() {
        return !view.hasInfoMessage();
    }
});

view.registerAnimationHook({
    key: "unit_destroy",
    prepare: function(id) {
        var unit = model.unit_data[id];
        this.step = 0;
        this.time = 0;
        this.x = -unit.x;
        this.y = -unit.y;
        controller.audio_playSound("EXPLODE");
    },
    render: function() {
        var step = this.step;
        var pic = view.getInfoImageForType("EXPLOSION_GROUND");
        var x = this.x;
        var y = this.y;
        var tileSize = TILE_LENGTH;
        var scx = 48 * step;
        var scy = 0;
        var scw = 48;
        var sch = 48;
        var tcx = x * tileSize;
        var tcy = y * tileSize;
        var tcw = tileSize;
        var tch = tileSize;
        view.canvasCtx.drawImage(pic, scx, scy, scw, sch, tcx, tcy, tcw, tch);
        view.redraw_markPos(x, y);
    },
    update: function(delta) {
        this.time += delta;
        if (this.time > 75) {
            this.step++;
            this.time = 0;
        }
    },
    isDone: function() {
        return this.step === 10;
    }
});

model.event_on("fog_modifyVisionAt", function(x, y, pid, range, value) {
    range = 10;
    var lX;
    var hX;
    var lY = y - range;
    var hY = y + range;
    if (lY < 0) lY = 0;
    if (hY >= model.map_height) hY = model.map_height - 1;
    for (;lY <= hY; lY++) {
        var disY = Math.abs(lY - y);
        lX = x - range + disY;
        hX = x + range - disY;
        if (lX < 0) lX = 0;
        if (hX >= model.map_width) hX = model.map_width - 1;
        for (;lX <= hX; lX++) {
            view.redraw_markPos(lX, lY);
            var unit = model.unit_posData[lX][lY];
            if (unit !== null && unit.hidden) {
                controller.updateUnitStatus(model.unit_extractId(unit));
            }
        }
    }
});

model.event_on("fog_recalculateFogMap", function(range) {
    view.redraw_markAll();
});

view.registerAnimationHook({
    key: "move_moveUnitByPath",
    prepare: function(way, uid, x, y) {
        this.moveAnimationX = x;
        this.moveAnimationY = y;
        this.moveAnimationIndex = 0;
        this.moveAnimationPath = way;
        this.moveAnimationUid = uid;
        this.moveAnimationShift = 0;
        this.moveAnimationDustX = -1;
        this.moveAnimationDustY = -1;
        this.moveAnimationDustTime = -1;
        this.moveAnimationDustStep = -1;
        this.moveAnimationDustPic = null;
        view.preventRenderUnit = model.unit_data[uid];
        var mvType = model.unit_data[uid].type.movetype;
        if (DEBUG) {
            util.log("drawing move from", "(", this.moveAnimationX, ",", this.moveAnimationY, ")", "with path", "(", this.moveAnimationPath, ")");
        }
    },
    update: function(delta) {
        var tileSize = TILE_LENGTH;
        this.moveAnimationShift += delta / 1e3 * tileSize * 8;
        view.redraw_markPosWithNeighboursRing(this.moveAnimationX, this.moveAnimationY);
        if (this.moveAnimationDustStep !== -1) {
            this.moveAnimationDustTime += delta;
            if (this.moveAnimationDustTime > 30) {
                this.moveAnimationDustStep++;
                this.moveAnimationDustTime = 0;
                if (this.moveAnimationDustStep === 3) {
                    this.moveAnimationDustStep = -1;
                }
            }
        }
        if (this.moveAnimationShift > tileSize) {
            this.moveAnimationDustX = this.moveAnimationX;
            this.moveAnimationDustY = this.moveAnimationY;
            this.moveAnimationDustTime = 0;
            this.moveAnimationDustStep = 0;
            switch (this.moveAnimationPath[this.moveAnimationIndex]) {
              case model.move_MOVE_CODES.UP:
                this.moveAnimationY--;
                this.moveAnimationDustPic = view.getInfoImageForType("DUST_U");
                break;

              case model.move_MOVE_CODES.RIGHT:
                this.moveAnimationX++;
                this.moveAnimationDustPic = view.getInfoImageForType("DUST_R");
                break;

              case model.move_MOVE_CODES.DOWN:
                this.moveAnimationY++;
                this.moveAnimationDustPic = view.getInfoImageForType("DUST_D");
                break;

              case model.move_MOVE_CODES.LEFT:
                this.moveAnimationX--;
                this.moveAnimationDustPic = view.getInfoImageForType("DUST_L");
                break;
            }
            this.moveAnimationIndex++;
            this.moveAnimationShift -= tileSize;
            if (this.moveAnimationIndex === this.moveAnimationPath.length) {
                this.moveAnimationX = 0;
                this.moveAnimationY = 0;
                this.moveAnimationIndex = 0;
                this.moveAnimationPath = null;
                this.moveAnimationUid = -1;
                this.moveAnimationShift = 0;
                view.preventRenderUnit = null;
            }
        }
    },
    render: function() {
        var uid = this.moveAnimationUid;
        var cx = this.moveAnimationX;
        var cy = this.moveAnimationY;
        var shift = this.moveAnimationShift;
        var moveCode = this.moveAnimationPath[this.moveAnimationIndex];
        var unit = model.unit_data[uid];
        var color = view.colorArray[unit.owner];
        var state;
        var tp = unit.type;
        switch (moveCode) {
          case model.move_MOVE_CODES.UP:
            state = view.IMAGE_CODE_UP;
            break;

          case model.move_MOVE_CODES.RIGHT:
            state = view.IMAGE_CODE_RIGHT;
            break;

          case model.move_MOVE_CODES.DOWN:
            state = view.IMAGE_CODE_DOWN;
            break;

          case model.move_MOVE_CODES.LEFT:
            state = view.IMAGE_CODE_LEFT;
            break;
        }
        var pic = view.getUnitImageForType(tp.ID, state, color);
        var tileSize = TILE_LENGTH;
        var BASESIZE = controller.baseSize;
        var scx = BASESIZE * 2 * view.getSpriteStep("UNIT");
        var scy = 0;
        var scw = BASESIZE * 2;
        var sch = BASESIZE * 2;
        var tcx = cx * tileSize - tileSize / 2;
        var tcy = cy * tileSize - tileSize / 2;
        var tcw = tileSize + tileSize;
        var tch = tileSize + tileSize;
        switch (moveCode) {
          case model.move_MOVE_CODES.UP:
            tcy -= shift;
            break;

          case model.move_MOVE_CODES.LEFT:
            tcx -= shift;
            break;

          case model.move_MOVE_CODES.RIGHT:
            tcx += shift;
            break;

          case model.move_MOVE_CODES.DOWN:
            tcy += shift;
            break;
        }
        if (pic !== undefined) {
            view.canvasCtx.drawImage(pic, scx, scy, scw, sch, tcx, tcy, tcw, tcw);
        } else {
            tcx = cx * tileSize;
            tcy = cy * tileSize;
            tcw = tileSize;
            tch = tileSize;
            switch (moveCode) {
              case model.move_MOVE_CODES.UP:
                tcy -= shift;
                break;

              case model.move_MOVE_CODES.LEFT:
                tcx -= shift;
                break;

              case model.move_MOVE_CODES.RIGHT:
                tcx += shift;
                break;

              case model.move_MOVE_CODES.DOWN:
                tcy += shift;
                break;
            }
            view.canvasCtx.fillStyle = "rgb(255,0,0)";
            view.canvasCtx.fillRect(tcx, tcy, tcw, tch);
        }
        if (this.moveAnimationDustStep !== -1) {
            var tileSize = TILE_LENGTH;
            scx = BASESIZE * 2 * this.moveAnimationDustStep;
            scy = 0;
            scw = BASESIZE * 2;
            sch = BASESIZE * 2;
            tcx = this.moveAnimationDustX * tileSize - tileSize / 2;
            tcy = this.moveAnimationDustY * tileSize - tileSize / 2;
            tcw = tileSize + tileSize;
            tch = tileSize + tileSize;
            view.canvasCtx.drawImage(this.moveAnimationDustPic, scx, scy, scw, sch, tcx, tcy, tcw, tch);
        }
    },
    isDone: function() {
        var done = this.moveAnimationUid === -1;
        return done;
    }
});

model.event_on("multistep_nextStep_", function() {
    if (controller.stateMachine.state !== "IDLE") {
        controller.showMenu(controller.stateMachine.data.menu, controller.mapCursorX, controller.mapCursorY);
    }
});

util.scoped(function() {
    function playAudio(_, id) {
        controller.audio_playMusic(id);
    }
    function storeAudio(obj) {
        var audioData = Base64Helper.decodeBuffer(obj.value);
        controller.audio_loadByArrayBuffer(obj.key, audioData, playAudio);
    }
    function loadAudio(key) {
        controller.storage_assets.get(key, storeAudio);
    }
    view.registerAnimationHook({
        key: "round_nextTurn",
        prepare: function() {
            var co = model.co_data[model.round_turnOwner].coA;
            if (co) {
                if (!controller.audio_isBuffered(co.music)) {
                    loadAudio(co.music);
                } else {
                    playAudio(false, co.music);
                }
            }
            view.showInfoMessage(model.data_localized("day") + " " + model.round_day + " - " + model.player_data[model.round_turnOwner].name);
        },
        render: function() {},
        update: function(delta) {},
        isDone: function() {
            return !view.hasInfoMessage();
        }
    });
});

model.event_on("team_transferMoney", function() {
    controller.renderPlayerInfo();
});

model.event_on("team_transferUnit", function(suid) {
    var unit = model.unit_data[suid];
    var x = -unit.x;
    var y = -unit.y;
    controller.updateUnitStatus(model.unit_extractId(model.unit_posData[x][y]));
});

view.registerAnimationHook({
    key: "actions_trapWait",
    prepare: function(uid) {
        var unit = model.unit_data[uid];
        this.time = 0;
        this.xp = unit.x + 1;
        this.yp = unit.y;
        this.x = (unit.x + 1) * TILE_LENGTH;
        this.y = unit.y * TILE_LENGTH;
    },
    render: function() {
        var pic = view.getInfoImageForType("TRAPPED");
        view.canvasCtx.drawImage(pic, this.x, this.y);
    },
    update: function(delta) {
        this.time += delta;
    },
    isDone: function() {
        var res = this.time > 1e3;
        if (res) {
            var pic = view.getInfoImageForType("TRAPPED");
            var y = this.yp;
            for (var i = this.xp, e = i + parseInt(pic.width / TILE_LENGTH, 10); i <= e; i++) {
                view.redraw_markPos(i, y);
            }
        }
        return res;
    }
});

model.event_on("unit_inflictDamage", function(uid) {
    controller.updateUnitStatus(uid);
});

model.event_on("unit_heal", function(uid) {
    controller.updateUnitStatus(uid);
});

model.event_on("battle_mainAttack", function(auid, duid, dmg, mainWeap) {
    var type = model.unit_data[auid].type;
    var sound = mainWeap ? type.assets.pri_att_sound : type.assets.sec_att_sound;
    if (sound) controller.audio_playSound(sound);
});

model.event_on("battle_counterAttack", function(auid, duid, dmg, mainWeap) {
    var type = model.unit_data[auid].type;
    var sound = mainWeap ? type.assets.pri_att_sound : type.assets.sec_att_sound;
    if (sound) controller.audio_playSound(sound);
});

model.event_on("battle_invokeBattle", function(auid, duid) {
    controller.updateSimpleTileInformation();
    controller.updateUnitStatus(auid);
    controller.updateUnitStatus(duid);
});

model.event_on("factory_produceUnit", function() {
    controller.updateSimpleTileInformation();
});

model.event_on("transport_loadInto", function(uid, tid) {
    controller.updateUnitStatus(tid);
});

model.event_on("transport_unloadFrom", function(transportId, trsx, trsy, loadId, tx, ty) {
    controller.updateUnitStatus(transportId);
});

model.event_on("unit_join", function(uid, tid) {
    controller.updateUnitStatus(tid);
});

model.event_on("supply_refillResources", function(uid) {
    if (typeof uid.x === "number") uid = model.unit_extractId(uid);
    controller.updateUnitStatus(uid);
});

model.event_on("move_clearUnitPosition", function(uid) {
    var unit = model.unit_data[uid];
    var x = -unit.x;
    var y = -unit.y;
    if (model.map_isValidPosition(x - 1, y) && model.unit_posData[x - 1][y]) {
        controller.updateUnitStatus(model.unit_extractId(model.unit_posData[x - 1][y]));
    }
    if (model.map_isValidPosition(x + 1, y) && model.unit_posData[x + 1][y]) {
        controller.updateUnitStatus(model.unit_extractId(model.unit_posData[x + 1][y]));
    }
    if (model.map_isValidPosition(x, y + 1) && model.unit_posData[x][y + 1]) {
        controller.updateUnitStatus(model.unit_extractId(model.unit_posData[x][y + 1]));
    }
    if (model.map_isValidPosition(x, y - 1) && model.unit_posData[x][y - 1]) {
        controller.updateUnitStatus(model.unit_extractId(model.unit_posData[x][y - 1]));
    }
});

model.event_on("move_setUnitPosition", function(uid) {
    controller.updateUnitStatus(uid);
});

model.event_on("unit_hide", function(uid) {
    controller.updateUnitStatus(uid);
});

model.event_on("unit_unhide", function(uid) {
    controller.updateUnitStatus(uid);
});

util.scoped(function() {
    function generateHandler(origName) {
        return function() {
            if (controller.errorPanelVisible) {
                if (origName === "LEFT") controller.errorButtons.decreaseIndex(); else if (origName === "RIGHT") controller.errorButtons.increaseIndex(); else if (origName === "ACTION") {
                    var key = controller.errorButtons.getActiveKey();
                    if (key === "error.panel.yes") {
                        controller.storage_general.clear(function() {
                            controller.storage_assets.clear(function() {
                                controller.storage_maps.clear(function() {
                                    window.location.reload();
                                });
                            });
                        });
                    } else window.location.reload();
                }
                return this.breakTransition();
            }
            var fn = this.structure[this.state][origName];
            if (fn) return fn.apply(this, arguments); else return this.breakTransition();
        };
    }
    controller.stateParent = {
        onenter: function() {
            controller.openSection(this.structure[this.state].section);
            if (this.structure[this.state].enterState) {
                return this.structure[this.state].enterState.apply(this, arguments);
            }
        },
        INP_UP: generateHandler("UP"),
        INP_LEFT: generateHandler("LEFT"),
        INP_RIGHT: generateHandler("RIGHT"),
        INP_DOWN: generateHandler("DOWN"),
        INP_ACTION: generateHandler("ACTION"),
        INP_CANCEL: generateHandler("CANCEL"),
        INP_HOVER: generateHandler("HOVER"),
        onerror: controller.haltEngine
    };
});

util.scoped(function() {
    var noInit = false;
    controller.screenStateMachine.structure.GAMEROUND = Object.create(controller.stateParent);
    controller.screenStateMachine.structure.GAMEROUND.section = "cwt_game_screen";
    controller.screenStateMachine.structure.GAMEROUND.enterState = function() {
        if (noInit !== true) {
            controller.audio_stopMusic();
            controller.setCursorPosition(0, 0);
            controller.update_startGameRound();
            for (var i = 0, e = model.unit_data.length; i < e; i++) {
                if (model.unit_data[i].owner !== INACTIVE_ID) controller.updateUnitStatus(i);
            }
            view.resizeCanvas();
            view.updateMapImages();
            view.redraw_markAll();
            controller.setScreenScale(2);
            controller.inGameLoop = true;
            controller.prepareGameLoop();
        }
        noInit = false;
    };
    controller.screenStateMachine.structure.GAMEROUND.gameHasEnded = function() {
        controller.inGameLoop = false;
        return "MAIN";
    };
    controller.screenStateMachine.structure.GAMEROUND.LEFT = function(ev, distance) {
        var state = controller.stateMachine.state;
        if (state === "ACTION_SELECT_TARGET_A" || state === "ACTION_SELECT_TARGET_B") {
            controller.stateMachine.data.selection.nextValidPosition(controller.mapCursorX, controller.mapCursorY, 0, true, controller.setCursorPosition);
            return this.breakTransition();
        }
        if (!distance) distance = 1;
        if (distance === 1) controller.moveCursor(model.move_MOVE_CODES.LEFT, distance); else controller.shiftScreenPosition(model.move_MOVE_CODES.LEFT, distance);
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.GAMEROUND.RIGHT = function(ev, distance) {
        var state = controller.stateMachine.state;
        if (state === "ACTION_SELECT_TARGET_A" || state === "ACTION_SELECT_TARGET_B") {
            controller.stateMachine.data.selection.nextValidPosition(controller.mapCursorX, controller.mapCursorY, 0, false, controller.setCursorPosition);
            return this.breakTransition();
        }
        if (!distance) distance = 1;
        if (distance === 1) controller.moveCursor(model.move_MOVE_CODES.RIGHT, distance); else controller.shiftScreenPosition(model.move_MOVE_CODES.RIGHT, distance);
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.GAMEROUND.UP = function(ev, distance) {
        var state = controller.stateMachine.state;
        if (state === "ACTION_SELECT_TARGET_A" || state === "ACTION_SELECT_TARGET_B") {
            controller.stateMachine.data.selection.nextValidPosition(controller.mapCursorX, controller.mapCursorY, 0, true, controller.setCursorPosition);
            return this.breakTransition();
        }
        var inMenu = state === "ACTION_MENU" || state === "ACTION_SUBMENU";
        if (!distance) distance = 1;
        if (!inMenu) {
            if (distance === 1) controller.moveCursor(model.move_MOVE_CODES.UP, distance); else controller.shiftScreenPosition(model.move_MOVE_CODES.UP, distance);
        } else controller.decreaseMenuCursor();
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.GAMEROUND.DOWN = function(ev, distance) {
        var state = controller.stateMachine.state;
        if (state === "ACTION_SELECT_TARGET_A" || state === "ACTION_SELECT_TARGET_B") {
            controller.stateMachine.data.selection.nextValidPosition(controller.mapCursorX, controller.mapCursorY, 0, false, controller.setCursorPosition);
            return this.breakTransition();
        }
        var inMenu = state === "ACTION_MENU" || state === "ACTION_SUBMENU";
        if (!distance) distance = 1;
        if (!inMenu) {
            if (distance === 1) controller.moveCursor(model.move_MOVE_CODES.DOWN, distance); else controller.shiftScreenPosition(model.move_MOVE_CODES.DOWN, distance);
        } else controller.increaseMenuCursor();
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.GAMEROUND.ACTION = function(ev, x, y) {
        var state = controller.stateMachine.state;
        if (state === "IDLE") {
            if (controller.attackRangeVisible) {
                controller.hideAttackRangeInfo();
                return this.breakTransition();
            }
        }
        if (typeof x === "number") {
            controller.setCursorPosition(x, y);
        }
        controller.cursorActionClick();
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.GAMEROUND.HOVER = function(ev, x, y) {
        controller.setCursorPosition(x, y);
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.GAMEROUND.CANCEL = function(ev, x, y) {
        var state = controller.stateMachine.state;
        if (state === "IDLE") {
            if (!controller.attackRangeVisible) {
                var unit = model.unit_posData[controller.mapCursorX][controller.mapCursorY];
                if (unit) {
                    controller.showAttackRangeInfo();
                    return this.breakTransition();
                }
            } else {
                controller.hideAttackRangeInfo();
                return this.breakTransition();
            }
        }
        if (typeof x === "number") controller.setCursorPosition(x, y);
        controller.cursorActionCancel();
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.GAMEROUND.toOptions_ = function() {
        assert(arguments.length === 2 && arguments[1] === true);
        noInit = true;
        return "OPTIONS";
    };
});

controller.screenStateMachine.structure.LOAD = Object.create(controller.stateParent);

controller.screenStateMachine.structure.LOAD.section = "cwt_load_screen";

controller.screenStateMachine.structure.LOAD.enterState = function() {
    controller.dataLoader_start(document.getElementById("loading_text"), document.getElementById("loading_bar"));
};

controller.screenStateMachine.structure.LOAD.complete = function() {
    return "MOBILE";
};

controller.screenStateMachine.structure.LOAD.onerror = controller.haltEngine;

util.scoped(function() {
    var pageEl = document.getElementById("cwt_main_screen");
    var btn = controller.generateButtonGroup(pageEl, "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button", "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button button_active", "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button button_inactive");
    document.getElementById("mainScreen_version").innerHTML = VERSION;
    controller.screenStateMachine.structure.MAIN = Object.create(controller.stateParent);
    controller.screenStateMachine.structure.MAIN.section = "cwt_main_screen";
    controller.screenStateMachine.structure.MAIN.enterState = function() {
        controller.audio_playNullSound();
        if (controller.features_client.audioMusic) {
            controller.audio_playMusic(model.data_menu.music);
        }
        btn.setIndex(1);
    };
    controller.screenStateMachine.structure.MAIN.UP = function() {
        btn.decreaseIndex();
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.MAIN.DOWN = function() {
        btn.increaseIndex();
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.MAIN.ACTION = function() {
        var ret, snd;
        if (btn.isIndexInactive()) {
            snd = model.data_sounds.CANCEL;
            ret = this.breakTransition();
        } else {
            snd = model.data_sounds.MENUTICK;
            ret = btn.getActiveKey();
        }
        controller.audio_playSound(snd);
        return ret;
    };
});

controller.screenStateMachine.structure.NONE = Object.create(controller.stateParent);

controller.screenStateMachine.structure.NONE.section = null;

controller.screenStateMachine.structure.NONE.start = function() {
    if (DEBUG) util.log("start client");
    (function setupAnimationFrame() {
        if (DEBUG) util.log("setup animation frame");
        var oldTime = new Date().getTime();
        function looper() {
            requestAnimationFrame(looper);
            var now = new Date().getTime();
            var delta = now - oldTime;
            oldTime = now;
            controller.updateGamePadControls(delta);
            if (controller.inGameLoop) {
                if (controller.update_inGameRound) controller.gameLoop(delta); else controller.screenStateMachine.event("gameHasEnded");
            }
            if (controller.screenStateMachine.state === "MOBILE") {
                controller.screenStateMachine.event("decreaseTimer", delta);
            }
        }
        requestAnimationFrame(looper);
    })();
    return "LOAD";
};

util.scoped(function() {
    function wipeComplete() {
        document.location.reload();
    }
    function changeForceTouch() {
        controller.screenStateMachine.structure.OPTIONS.forceTouch = !controller.screenStateMachine.structure.OPTIONS.forceTouch;
        updateforceTouchContent();
    }
    function updateforceTouchContent() {
        nodeTouch.innerHTML = controller.screenStateMachine.structure.OPTIONS.forceTouch ? model.data_localized("yes") : model.data_localized("no");
    }
    function updateSoundContent() {
        nodeSfx.innerHTML = Math.round(controller.audio_getSfxVolume() * 100);
        nodeMusic.innerHTML = Math.round(controller.audio_getMusicVolume() * 100);
    }
    var nodeSfx = document.getElementById("cwt_options_sfxVolume");
    var nodeMusic = document.getElementById("cwt_options_musicVolume");
    var nodeTouch = document.getElementById("cwt_options_forceTouch");
    var btn = controller.generateButtonGroup(document.getElementById("cwt_options_screen"), "cwt_panel_header_small cwt_page_button w_400 cwt_panel_button", "cwt_panel_header_small cwt_page_button w_400 cwt_panel_button button_active", "cwt_panel_header_small cwt_page_button w_400 cwt_panel_button button_inactive");
    var sourceState;
    controller.screenStateMachine.structure.OPTIONS = Object.create(controller.stateParent);
    controller.screenStateMachine.structure.OPTIONS.forceTouch = false;
    controller.screenStateMachine.structure.OPTIONS.section = "cwt_options_screen";
    controller.screenStateMachine.structure.OPTIONS.enterState = function(_, source) {
        sourceState = typeof source !== "undefined" ? source : null;
        updateSoundContent();
        updateforceTouchContent();
        btn.setIndex(1);
    };
    controller.screenStateMachine.structure.OPTIONS.UP = function() {
        switch (btn.getActiveKey()) {
          case "options.sfx.up":
          case "options.music.up":
          case "options.music.down":
            btn.decreaseIndex();
            btn.decreaseIndex();
            break;

          default:
            btn.decreaseIndex();
        }
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.OPTIONS.DOWN = function() {
        switch (btn.getActiveKey()) {
          case "options.sfx.up":
          case "options.sfx.down":
          case "options.music.down":
            btn.increaseIndex();
            btn.increaseIndex();
            break;

          default:
            btn.increaseIndex();
        }
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.OPTIONS.LEFT = function() {
        switch (btn.getActiveKey()) {
          case "options.sfx.up":
          case "options.music.up":
            btn.decreaseIndex();
            break;
        }
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.OPTIONS.RIGHT = function() {
        switch (btn.getActiveKey()) {
          case "options.sfx.down":
          case "options.music.down":
            btn.increaseIndex();
            break;
        }
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.OPTIONS.ACTION = function() {
        switch (btn.getActiveKey()) {
          case "options.sfx.down":
            controller.audio_setSfxVolume(controller.audio_getSfxVolume() - .05);
            updateSoundContent();
            break;

          case "options.sfx.up":
            controller.audio_setSfxVolume(controller.audio_getSfxVolume() + .05);
            updateSoundContent();
            break;

          case "options.music.down":
            controller.audio_setMusicVolume(controller.audio_getMusicVolume() - .05);
            updateSoundContent();
            break;

          case "options.music.up":
            controller.audio_setMusicVolume(controller.audio_getMusicVolume() + .05);
            updateSoundContent();
            break;

          case "options.setKeyboad":
            controller.activeMapping = controller.KEY_MAPPINGS.KEYBOARD;
            return "REMAP_KEYS";

          case "options.setGamepad":
            controller.activeMapping = controller.KEY_MAPPINGS.GAMEPAD;
            return "REMAP_KEYS";

          case "options.resetData":
            controller.storage_general.set("cwt_resetData", true, wipeComplete);
            break;

          case "options.forceTouch":
            changeForceTouch();
            break;

          case "options.goBack":
            controller.audio_saveConfigs();
            controller.storage_general.set("cwt_forceTouch", controller.screenStateMachine.structure.OPTIONS.forceTouch);
            return sourceState !== null ? "GAMEROUND" : "MAIN";
        }
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.OPTIONS.CANCEL = function() {
        controller.audio_saveConfigs();
        return sourceState !== null ? "GAMEROUND" : "MAIN";
    };
});

util.scoped(function() {
    var btn = controller.generateButtonGroup(document.getElementById("cwt_player_setup_screen"), "cwt_panel_header_big cwt_page_button cwt_panel_button", "cwt_panel_header_big cwt_page_button cwt_panel_button button_active", "cwt_panel_header_big cwt_page_button cwt_panel_button button_inactive");
    var buttons = [ [ document.getElementById("playerConfig_p1_type"), document.getElementById("playerConfig_p1_co"), document.getElementById("playerConfig_p1_team") ], [ document.getElementById("playerConfig_p2_type"), document.getElementById("playerConfig_p2_co"), document.getElementById("playerConfig_p2_team") ], [ document.getElementById("playerConfig_p3_type"), document.getElementById("playerConfig_p3_co"), document.getElementById("playerConfig_p3_team") ], [ document.getElementById("playerConfig_p4_type"), document.getElementById("playerConfig_p4_co"), document.getElementById("playerConfig_p4_team") ] ];
    function updateButtons(id, a, b, c) {
        var btns = buttons[id];
        btns[0].innerHTML = model.data_localized(a);
        btns[1].innerHTML = b ? model.data_localized(b) : b;
        btns[2].innerHTML = c;
    }
    function update(pid) {
        var type = controller.roundConfig_typeSelected[pid];
        if (type === INACTIVE_ID) {
            updateButtons(pid, "config.player.off", "", "");
        } else if (type === DESELECT_ID) {
            updateButtons(pid, "config.player.disabled", "", "");
        } else {
            var a, b;
            if (type === 0) {
                a = "config.player.human";
            } else {
                a = "config.player.AI";
            }
            b = "config.player.co.none";
            if (controller.roundConfig_coSelected[pid] !== INACTIVE_ID) {
                b = model.data_coSheets[model.data_coTypes[controller.roundConfig_coSelected[pid]]].ID;
            }
            updateButtons(pid, a, b, controller.roundConfig_teamSelected[pid]);
        }
    }
    function loadMap(obj) {
        var map = obj.value;
        controller.persistence_prepareModel(map);
        controller.roundConfig_prepare();
        for (var i = 0, e = MAX_PLAYER; i < e; i++) update(i);
    }
    controller.screenStateMachine.structure.PLAYER_SETUP = Object.create(controller.stateParent);
    controller.screenStateMachine.structure.PLAYER_SETUP.section = "cwt_player_setup_screen";
    controller.screenStateMachine.structure.PLAYER_SETUP.enterState = function() {
        controller.storage_maps.get(this.data.mapToLoad, loadMap);
    };
    controller.screenStateMachine.structure.PLAYER_SETUP.UP = function() {
        switch (btn.getActiveKey()) {
          case "config.co.next":
          case "config.co.prev":
          case "config.team.next":
          case "config.team.prev":
            btn.decreaseIndex();
            btn.decreaseIndex();
            btn.decreaseIndex();
            btn.decreaseIndex();
            break;

          case "config.type.next":
            var data = btn.getActiveData();
            if (data == "1") {
                btn.decreaseIndex();
                btn.decreaseIndex();
            } else if (data == "2") {
                btn.decreaseIndex();
                btn.decreaseIndex();
                btn.decreaseIndex();
                btn.decreaseIndex();
            } else {
                btn.decreaseIndex();
                btn.decreaseIndex();
                btn.decreaseIndex();
                btn.decreaseIndex();
            }
            break;

          case "config.type.prev":
            var data = btn.getActiveData();
            if (data == "1") {
                btn.decreaseIndex();
            } else if (data == "2") {
                btn.decreaseIndex();
                btn.decreaseIndex();
                btn.decreaseIndex();
            } else {
                btn.decreaseIndex();
                btn.decreaseIndex();
                btn.decreaseIndex();
                btn.decreaseIndex();
            }
            break;

          case "config.next":
            btn.decreaseIndex();
            break;
        }
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.PLAYER_SETUP.DOWN = function() {
        switch (btn.getActiveKey()) {
          case "config.type.next":
          case "config.co.next":
          case "config.type.prev":
          case "config.co.prev":
            btn.increaseIndex();
            btn.increaseIndex();
            btn.increaseIndex();
            btn.increaseIndex();
            break;

          case "config.team.next":
            var data = btn.getActiveData();
            if (data == "3") {
                btn.increaseIndex();
                btn.increaseIndex();
                btn.increaseIndex();
            } else if (data == "4") {
                btn.increaseIndex();
            } else {
                btn.increaseIndex();
                btn.increaseIndex();
                btn.increaseIndex();
                btn.increaseIndex();
            }
            break;

          case "config.team.prev":
            var data = btn.getActiveData();
            if (data == "3") {
                btn.increaseIndex();
                btn.increaseIndex();
                btn.increaseIndex();
                btn.increaseIndex();
            } else if (data == "4") {
                btn.increaseIndex();
                btn.increaseIndex();
            } else {
                btn.increaseIndex();
                btn.increaseIndex();
                btn.increaseIndex();
                btn.increaseIndex();
            }
            break;

          case "config.next":
            btn.increaseIndex();
            break;
        }
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.PLAYER_SETUP.LEFT = function() {
        switch (btn.getActiveKey()) {
          case "config.type.prev":
          case "config.co.prev":
          case "config.team.prev":
            var data = btn.getActiveData();
            if (data == "2" || data == "4") {
                btn.decreaseIndex();
            }
            break;

          case "config.type.next":
          case "config.co.next":
          case "config.team.next":
            btn.decreaseIndex();
            break;
        }
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.PLAYER_SETUP.RIGHT = function() {
        switch (btn.getActiveKey()) {
          case "config.type.next":
          case "config.co.next":
          case "config.team.next":
            var data = btn.getActiveData();
            if (data == "1" || data == "3") {
                btn.increaseIndex();
            }
            break;

          case "config.type.prev":
          case "config.co.prev":
          case "config.team.prev":
            btn.increaseIndex();
            break;
        }
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.PLAYER_SETUP.CANCEL = function() {
        this.data.mapToLoad = null;
        return "VERSUS";
    };
    controller.screenStateMachine.structure.PLAYER_SETUP.ACTION = function() {
        switch (btn.getActiveKey()) {
          case "config.type.prev":
          case "config.type.next":
          case "config.co.prev":
          case "config.co.next":
          case "config.team.prev":
          case "config.team.next":
            var value;
            switch (btn.getActiveData()) {
              case "1":
                value = 0;
                break;

              case "2":
                value = 1;
                break;

              case "3":
                value = 2;
                break;

              case "4":
                value = 3;
                break;
            }
            if (model.player_data[value].team === INACTIVE_ID) break;
            switch (btn.getActiveKey()) {
              case "config.type.prev":
                controller.roundConfig_changeConfig(value, controller.roundConfig_CHANGE_TYPE.PLAYER_TYPE, true);
                break;

              case "config.type.next":
                controller.roundConfig_changeConfig(value, controller.roundConfig_CHANGE_TYPE.PLAYER_TYPE, false);
                break;

              case "config.team.prev":
                controller.roundConfig_changeConfig(value, controller.roundConfig_CHANGE_TYPE.TEAM, true);
                break;

              case "config.team.next":
                controller.roundConfig_changeConfig(value, controller.roundConfig_CHANGE_TYPE.TEAM, false);
                break;

              case "config.co.prev":
                controller.roundConfig_changeConfig(value, controller.roundConfig_CHANGE_TYPE.CO_MAIN, false);
                break;

              case "config.co.next":
                controller.roundConfig_changeConfig(value, controller.roundConfig_CHANGE_TYPE.CO_MAIN, false);
                break;
            }
            update(value);
            break;

          case "config.next":
            controller.roundConfig_evalAfterwards();
            return "GAMEROUND";
        }
        return this.breakTransition();
    };
});

controller.activeMapping = null;

controller._state_remapKeys_message = document.getElementById("keyMappingText");

controller._state_remapKeys_step = 0;

controller._state_remapKeys_steps = [ "left", "up", "down", "right", "action", "cancel" ];

controller.screenStateMachine.structure.REMAP_KEYS = Object.create(controller.stateParent);

controller.screenStateMachine.structure.REMAP_KEYS.section = "cwt_keyMapping_screen";

controller.screenStateMachine.structure.REMAP_KEYS.enterState = function() {
    switch (controller.activeMapping) {
      case controller.KEY_MAPPINGS.KEYBOARD:
        controller._state_remapKeys_step = 0;
        break;

      case controller.KEY_MAPPINGS.GAMEPAD:
        controller._state_remapKeys_step = 4;
        break;
    }
    controller._state_remapKeys_message.innerHTML = model.data_localized(controller._state_remapKeys_steps[controller._state_remapKeys_step]);
};

controller.screenStateMachine.structure.REMAP_KEYS.INPUT_SET = function(ev, keyId) {
    var keySet = null;
    switch (controller.activeMapping) {
      case controller.KEY_MAPPINGS.KEYBOARD:
        keySet = controller.keyMaps.KEYBOARD;
        break;

      case controller.KEY_MAPPINGS.GAMEPAD:
        keySet = controller.keyMaps.GAMEPAD;
        break;
    }
    switch (controller._state_remapKeys_step) {
      case 0:
        keySet.LEFT = keyId;
        break;

      case 1:
        keySet.UP = keyId;
        break;

      case 2:
        keySet.DOWN = keyId;
        break;

      case 3:
        keySet.RIGHT = keyId;
        break;

      case 4:
        keySet.ACTION = keyId;
        break;

      case 5:
        keySet.CANCEL = keyId;
        break;
    }
    controller._state_remapKeys_step++;
    if (controller._state_remapKeys_step === controller._state_remapKeys_steps.length) {
        controller.activeMapping = null;
        controller.saveKeyMapping();
        return "OPTIONS";
    } else {
        controller._state_remapKeys_message.innerHTML = model.data_localized(controller._state_remapKeys_steps[controller._state_remapKeys_step]);
        return this.breakTransition();
    }
};

controller.screenStateMachine.structure.RULE_EDIT = Object.create(controller.stateParent);

controller.screenStateMachine.structure.RULE_EDIT.section = "cwt_ruleEditScreen";

controller.screenStateMachine.structure.RULE_EDIT.enterState = function() {};

util.scoped(function() {
    var TIMEOUT_TIPS = 1e4;
    var toolTipId;
    var toolTipElement = document.getElementById("startScreen_toolTip");
    function updateTooltip() {
        if (model.data_tips.length > 0) toolTipElement.innerHTML = model.data_tips[toolTipId];
    }
    controller.screenStateMachine.structure.MOBILE = Object.create(controller.stateParent);
    controller.screenStateMachine.structure.MOBILE.timer = 0;
    controller.screenStateMachine.structure.MOBILE.section = "cwt_mobileSound_screen";
    controller.screenStateMachine.structure.MOBILE.enterState = function() {
        toolTipId = parseInt(Math.random() * model.data_tips.length, 10);
        updateTooltip();
        controller.screenStateMachine.structure.MOBILE.timer = TIMEOUT_TIPS;
    };
    controller.screenStateMachine.structure.MOBILE.decreaseTimer = function(_, delta) {
        controller.screenStateMachine.structure.MOBILE.timer -= delta;
        if (controller.screenStateMachine.structure.MOBILE.timer <= 0) {
            controller.screenStateMachine.structure.MOBILE.timer = TIMEOUT_TIPS;
            toolTipId++;
            if (toolTipId >= model.data_tips.length) toolTipId = 0;
            updateTooltip();
        }
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.MOBILE.ACTION = function() {
        controller.stateMachine.event("start");
        return "MAIN";
    };
    controller.screenStateMachine.structure.MOBILE.LEFT = function() {
        toolTipId--;
        if (toolTipId < 0) toolTipId = model.data_tips.length - 1;
        controller.screenStateMachine.structure.MOBILE.timer = TIMEOUT_TIPS;
        updateTooltip();
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.MOBILE.RIGHT = function() {
        toolTipId++;
        if (toolTipId >= model.data_tips.length) toolTipId = 0;
        controller.screenStateMachine.structure.MOBILE.timer = TIMEOUT_TIPS;
        updateTooltip();
        return this.breakTransition();
    };
});

util.scoped(function() {
    var mapElement = document.getElementById("map_selection");
    var startButton = document.getElementById("versus_start_btn");
    var mapIndex;
    var btn = controller.generateButtonGroup(document.getElementById("cwt_versus_screen"), "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button", "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button button_active", "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button button_inactive");
    function updateMapElement() {
        mapElement.innerHTML = model.data_maps[mapIndex];
    }
    controller.screenStateMachine.structure.VERSUS = Object.create(controller.stateParent);
    controller.screenStateMachine.structure.VERSUS.section = "cwt_versus_screen";
    controller.screenStateMachine.structure.VERSUS.enterState = function() {
        mapIndex = 0;
        this.data.isSinglePlayer = true;
        updateMapElement();
    };
    controller.screenStateMachine.structure.VERSUS.UP = function() {
        switch (btn.getActiveKey()) {
          case "versus.nextMap":
            btn.decreaseIndex();
            break;
        }
        btn.decreaseIndex();
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.VERSUS.DOWN = function() {
        switch (btn.getActiveKey()) {
          case "versus.prevMap":
            btn.increaseIndex();
            break;
        }
        btn.increaseIndex();
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.VERSUS.LEFT = function() {
        switch (btn.getActiveKey()) {
          case "versus.nextMap":
            btn.decreaseIndex();
            break;
        }
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.VERSUS.RIGHT = function() {
        switch (btn.getActiveKey()) {
          case "versus.prevMap":
            btn.increaseIndex();
            break;
        }
        return this.breakTransition();
    };
    controller.screenStateMachine.structure.VERSUS.CANCEL = function() {
        return "MAIN";
    };
    controller.screenStateMachine.structure.VERSUS.ACTION = function() {
        switch (btn.getActiveKey()) {
          case "versus.prevMap":
            if (mapIndex > 0) mapIndex--; else mapIndex = model.data_maps.length - 1;
            updateMapElement();
            break;

          case "versus.nextMap":
            if (mapIndex < model.data_maps.length - 1) mapIndex++; else mapIndex = 0;
            updateMapElement();
            break;

          case "versus.next":
            this.data.mapToLoad = model.data_maps[mapIndex];
            return "PLAYER_SETUP";
        }
        return this.breakTransition();
    };
});

controller.screenStateMachine.data.mapToLoad = null;

controller.screenStateMachine.data.isSinglePlayer = false;
