! function() {
    for (var e = 0, t = ["ms", "moz", "webkit", "o"], n = 0; n < t.length && !window.requestAnimationFrame; ++n) window.requestAnimationFrame = window[t[n] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[t[n] + "CancelAnimationFrame"] || window[t[n] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(t) {
        var n = (new Date).getTime(),
            o = Math.max(0, 16 - (n - e)),
            r = window.setTimeout(function() {
                t(n + o)
            }, o);
        return e = n + o, r
    }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(e) {
        clearTimeout(e)
    })
}();
var Base64Helper = {};
Base64Helper.canvasToBase64 = function(e) {
        var t = document.createElement("canvas");
        t.width = e.width, t.height = e.height;
        var n = t.getContext("2d");
        n.drawImage(e, 0, 0);
        var o = t.toDataURL("image/png");
        return o.replace(/^data:image\/(png|jpg);base64,/, "")
    },
    function(e) {
        var t = e;
        Base64Helper.encodeBuffer = function(e) {
            for (var n, o, r, a, i, s = "", l = new Uint8Array(e), c = l.byteLength, u = c % 3, d = c - u, m = 0; d > m; m += 3) i = l[m] << 16 | l[m + 1] << 8 | l[m + 2], n = (16515072 & i) >> 18, o = (258048 & i) >> 12, r = (4032 & i) >> 6, a = 63 & i, s += t[n] + t[o] + t[r] + t[a];
            return 1 == u ? (i = l[d], n = (252 & i) >> 2, o = (3 & i) << 4, s += t[n] + t[o] + "==") : 2 == u && (i = l[d] << 8 | l[d + 1], n = (64512 & i) >> 10, o = (1008 & i) >> 4, r = (15 & i) << 2, s += t[n] + t[o] + t[r] + "="), s
        }, Base64Helper.decodeBuffer = function(t) {
            var n, o, r, a, i, s = .75 * t.length,
                l = t.length,
                c = 0;
            "=" === t[t.length - 1] && (s--, "=" === t[t.length - 2] && s--);
            var u = new ArrayBuffer(s),
                d = new Uint8Array(u);
            for (n = 0; l > n; n += 4) o = e.indexOf(t[n]), r = e.indexOf(t[n + 1]), a = e.indexOf(t[n + 2]), i = e.indexOf(t[n + 3]), d[c++] = o << 2 | r >> 4, d[c++] = (15 & r) << 4 | a >> 2, d[c++] = (3 & a) << 6 | 63 & i;
            return u
        }
    }("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
var Lawnchair = function(e, t) {
    if (!(this instanceof Lawnchair)) return new Lawnchair(e, t);
    if (!JSON) throw "JSON unavailable! Include http://www.json.org/json2.js to fix.";
    if (!(arguments.length <= 2)) throw "Incorrect # of ctor args!";
    t = "function" == typeof arguments[0] ? arguments[0] : arguments[1], e = "function" == typeof arguments[0] ? {} : arguments[0] || {}, this.record = e.record || "record", this.name = e.name || "records";
    var n;
    if (e.adapter) {
        "string" == typeof e.adapter && (e.adapter = [e.adapter]);
        for (var o = 0, r = e.adapter.length; r > o; o++) {
            for (var a = Lawnchair.adapters.length - 1; a >= 0 && (Lawnchair.adapters[a].adapter !== e.adapter[o] || !(n = Lawnchair.adapters[a].valid() ? Lawnchair.adapters[a] : void 0)); a--);
            if (n) break
        }
    } else
        for (var a = 0, i = Lawnchair.adapters.length; i > a && !(n = Lawnchair.adapters[a].valid() ? Lawnchair.adapters[a] : void 0); a++);
    if (!n) throw "No valid adapter.";
    for (var o in n) this[o] = n[o];
    for (var a = 0, i = Lawnchair.plugins.length; i > a; a++) Lawnchair.plugins[a].call(this);
    this.init(e, t)
};
Lawnchair.adapters = [], Lawnchair.adapter = function(e, t) {
    t.adapter = e;
    var n = "adapter valid init keys save batch get exists all remove nuke".split(" "),
        o = this.prototype.indexOf;
    for (var r in t)
        if (-1 === o(n, r)) throw "Invalid adapter! Nonstandard method: " + r;
    Lawnchair.adapters.splice(0, 0, t)
}, Lawnchair.plugins = [], Lawnchair.plugin = function(e) {
    for (var t in e) "init" === t ? Lawnchair.plugins.push(e[t]) : this.prototype[t] = e[t]
}, Lawnchair.prototype = {
    isArray: Array.isArray || function(e) {
        return "[object Array]" === Object.prototype.toString.call(e)
    },
    indexOf: function(e, t, n, o) {
        if (e.indexOf) return e.indexOf(t);
        for (n = 0, o = e.length; o > n; n++)
            if (e[n] === t) return n;
        return -1
    },
    lambda: function(e) {
        return this.fn(this.record, e)
    },
    fn: function(e, t) {
        return "string" == typeof t ? new Function(e, t) : t
    },
    uuid: function() {
        var e = function() {
            return (0 | 65536 * (1 + Math.random())).toString(16).substring(1)
        };
        return e() + e() + "-" + e() + "-" + e() + "-" + e() + "-" + e() + e() + e()
    },
    each: function(e) {
        var t = this.lambda(e);
        if (this.__results)
            for (var n = 0, o = this.__results.length; o > n; n++) t.call(this, this.__results[n], n);
        else this.all(function(e) {
            for (var n = 0, o = e.length; o > n; n++) t.call(this, e[n], n)
        });
        return this
    }
}, "undefined" != typeof module && module.exports && (module.exports = Lawnchair), Lawnchair.adapter("indexed-db", function() {
    function e(e, t) {
        console.error("error in indexed-db adapter!", e, t)
    }
    var t = 3,
        n = function() {
            return window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.oIndexedDB || window.msIndexedDB
        },
        o = function() {
            return window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction || window.oIDBTransaction || window.msIDBTransaction
        },
        r = function() {
            return window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange || window.oIDBKeyRange || window.msIDBKeyRange
        },
        a = function() {
            return window.IDBDatabaseException || window.webkitIDBDatabaseException || window.mozIDBDatabaseException || window.oIDBDatabaseException || window.msIDBDatabaseException
        },
        i = function() {
            return !!window.indexedDB
        },
        s = o() && "READ_WRITE" in o() ? o().READ_WRITE : "readwrite";
    return {
        valid: function() {
            return !!n()
        },
        init: function(o, r) {
            this.idb = n(), this.waiting = [], this.useAutoIncrement = i();
            var s = this.idb.open(this.name, t),
                l = this,
                c = l.fn(l.name, r);
            if (c && "function" != typeof c) throw "callback not valid";
            var u = function() {
                    return s.onupgradeneeded = s.onsuccess = s.error = null, c ? c.call(l, l) : void 0
                },
                d = function() {
                    try {
                        l.db.deleteObjectStore("teststore")
                    } catch (e) {}
                    try {
                        l.db.deleteObjectStore(l.record)
                    } catch (t) {}
                    var n = {};
                    l.useAutoIncrement && (n.autoIncrement = !0), l.db.createObjectStore(l.record, n), l.store = !0
                };
            s.onupgradeneeded = function(e) {
                l.db = s.result, l.transaction = s.transaction, d(e.oldVersion, e.newVersion)
            }, s.onsuccess = function(n) {
                if (l.db = n.target.result, l.db.version != "" + t) {
                    var o = l.db.version,
                        r = l.db.setVersion("" + t);
                    r.onsuccess = function() {
                        var e = r.result;
                        r.onsuccess = r.onerror = null, d(o, t), e.oncomplete = function() {
                            for (var e = 0; e < l.waiting.length; e++) l.waiting[e].call(l);
                            l.waiting = [], u()
                        }
                    }, r.onerror = function(t) {
                        r.onsuccess = r.onerror = null, console.error("Failed to create objectstore " + t), e(t)
                    }
                } else {
                    l.store = !0;
                    for (var a = 0; a < l.waiting.length; a++) l.waiting[a].call(l);
                    l.waiting = [], u()
                }
            }, s.onerror = function() {
                return a() && s.errorCode === a().VERSION_ERR ? (l.idb.deleteDatabase(l.name), l.init(o, r)) : (console.error("Failed to open database"), void 0)
            }
        },
        save: function(t, n) {
            var o = this;
            if (!this.store) return this.waiting.push(function() {
                this.save(t, n)
            }), void 0;
            for (var r = (this.isArray(t) ? t : [t]).map(function(e) {
                    return e.key || (e.key = o.uuid()), e
                }), a = function() {
                    n && o.lambda(n).call(o, o.isArray(t) ? r : r[0])
                }, i = this.db.transaction(this.record, s), l = i.objectStore(this.record), c = 0; c < r.length; c++) {
                var u = r[c];
                l.put(u, u.key)
            }
            return l.transaction.oncomplete = a, l.transaction.onabort = e, this
        },
        batch: function(e, t) {
            return this.save(e, t)
        },
        get: function(t, n) {
            if (!this.store) return this.waiting.push(function() {
                this.get(t, n)
            }), void 0;
            var o = this,
                r = function(e) {
                    var r = e.target.result;
                    n && (r && (r.key = t), o.lambda(n).call(o, r))
                };
            if (this.isArray(t))
                for (var a = [], i = t.length, s = t, l = function(e) {
                        o.get(s[e], function(t) {
                            a[e] = t, --i > 0 || n && o.lambda(n).call(o, a)
                        })
                    }, c = 0, u = s.length; u > c; c++) l(c);
            else {
                var d = this.db.transaction(this.record).objectStore(this.record).get(t);
                d.onsuccess = function(e) {
                    d.onsuccess = d.onerror = null, r(e)
                }, d.onerror = function(t) {
                    d.onsuccess = d.onerror = null, e(t)
                }
            }
            return this
        },
        exists: function(t, n) {
            if (!this.store) return this.waiting.push(function() {
                this.exists(t, n)
            }), void 0;
            var o = this,
                a = this.db.transaction(o.record).objectStore(this.record).openCursor(r().only(t));
            return a.onsuccess = function(e) {
                a.onsuccess = a.onerror = null;
                var t;
                o.lambda(n).call(o, null !== e.target.result && e.target.result !== t)
            }, a.onerror = function(t) {
                a.onsuccess = a.onerror = null, e(t)
            }, this
        },
        all: function(e) {
            if (!this.store) return this.waiting.push(function() {
                this.all(e)
            }), void 0;
            var t = this.fn(this.name, e) || void 0,
                n = this,
                o = this.db.transaction(this.record).objectStore(this.record),
                r = [];
            return o.openCursor().onsuccess = function(e) {
                var o = e.target.result;
                o ? (r.push(o.value), o.continue()) : t && t.call(n, r)
            }, this
        },
        keys: function(e) {
            if (!this.store) return this.waiting.push(function() {
                this.keys(e)
            }), void 0;
            var t = this.fn(this.name, e) || void 0,
                n = this,
                o = this.db.transaction(this.record).objectStore(this.record),
                r = [];
            return o.openCursor().onsuccess = function(e) {
                var o = e.target.result;
                o ? (r.push(o.key), o.continue()) : t && t.call(n, r)
            }, this
        },
        remove: function(t, n) {
            if (!this.store) return this.waiting.push(function() {
                this.remove(t, n)
            }), void 0;
            var o = this,
                r = t;
            this.isArray(t) || (r = [t]);
            for (var a = function() {
                    n && o.lambda(n).call(o)
                }, i = this.db.transaction(this.record, s).objectStore(this.record), l = t.key ? t.key : t, c = 0; c < r.length; c++) {
                var l = r[c].key ? r[c].key : r[c];
                i.delete(l)
            }
            return i.transaction.oncomplete = a, i.transaction.onabort = e, this
        },
        nuke: function(t) {
            if (!this.store) return this.waiting.push(function() {
                this.nuke(t)
            }), void 0;
            var n = this,
                o = t ? function() {
                    n.lambda(t).call(n)
                } : function() {};
            try {
                var r = this.db.transaction(this.record, s).objectStore(this.record);
                r.clear(), r.transaction.oncomplete = o, r.transaction.onabort = e
            } catch (a) {
                "NotFoundError" == a.name ? o() : e(a)
            }
            return this
        }
    }
}()), Lawnchair.adapter("webkit-sqlite", function() {
    var e = function(e, t) {
            console.error("error in sqlite adaptor!", e, t)
        },
        t = function() {
            return new Date
        };
    return Function.prototype.bind || (Function.prototype.bind = function(e) {
        var t = [].slice,
            n = t.call(arguments, 1),
            o = this,
            r = function() {},
            a = function() {
                return o.apply(this instanceof r ? this : e || {}, n.concat(t.call(arguments)))
            };
        return r.prototype = o.prototype, a.prototype = new r, a
    }), {
        valid: function() {
            return !!window.openDatabase
        },
        init: function(t, n) {
            var o = this,
                r = o.fn(o.name, n),
                a = "CREATE TABLE IF NOT EXISTS " + this.record + " (id NVARCHAR(32) UNIQUE PRIMARY KEY, value TEXT, timestamp REAL)",
                i = function() {
                    return r ? r.call(o, o) : void 0
                };
            if (r && "function" != typeof r) throw "callback not valid";
            this.db = openDatabase(this.name, "1.0.0", this.name, t.maxSize || 65536), this.db.transaction(function(e) {
                e.executeSql(a, [])
            }, e, i)
        },
        keys: function(t) {
            var n = this.lambda(t),
                o = this,
                r = "SELECT id FROM " + this.record + " ORDER BY timestamp DESC";
            return this.db.readTransaction(function(t) {
                var a = function(e, t) {
                    if (0 == t.rows.length) n.call(o, []);
                    else {
                        for (var r = [], a = 0, i = t.rows.length; i > a; a++) r.push(t.rows.item(a).id);
                        n.call(o, r)
                    }
                };
                t.executeSql(r, [], a, e)
            }), this
        },
        save: function(n, o, r) {
            var a = this,
                i = (this.isArray(n) ? n : [n]).map(function(e) {
                    return e.key || (e.key = a.uuid()), e
                }),
                s = "INSERT OR REPLACE INTO " + this.record + " (value, timestamp, id) VALUES (?,?,?)",
                l = function() {
                    o && a.lambda(o).call(a, a.isArray(n) ? i : i[0])
                },
                r = r || null,
                c = [],
                u = t();
            try {
                for (var d = 0, m = i.length; m > d; d++) c[d] = [JSON.stringify(i[d]), u, i[d].key]
            } catch (_) {
                throw r ? r(_) : e(_), _
            }
            return a.db.transaction(function(e) {
                for (var t = 0, n = i.length; n > t; t++) e.executeSql(s, c[t])
            }, r ? r : e, l), this
        },
        batch: function(e, t) {
            return this.save(e, t)
        },
        get: function(t, n) {
            var o = this,
                r = "",
                a = this.isArray(t) ? t : [t];
            r = "SELECT id, value FROM " + this.record + " WHERE id IN (" + a.map(function() {
                return "?"
            }).join(",") + ")";
            var i = function(e, r) {
                for (var i, s, l = {}, c = 0, u = r.rows.length; u > c; c++) i = JSON.parse(r.rows.item(c).value), i.key = r.rows.item(c).id, l[i.key] = i;
                s = a.map(function(e) {
                    return l[e]
                }), o.isArray(t) || (s = s.length ? s[0] : null), n && o.lambda(n).call(o, s)
            };
            return this.db.readTransaction(function(t) {
                t.executeSql(r, a, i, e)
            }), this
        },
        exists: function(t, n) {
            var o = "SELECT * FROM " + this.record + " WHERE id = ?",
                r = this,
                a = function(e, t) {
                    n && r.fn("exists", n).call(r, t.rows.length > 0)
                };
            return this.db.readTransaction(function(n) {
                n.executeSql(o, [t], a, e)
            }), this
        },
        all: function(t) {
            var n = this,
                o = "SELECT * FROM " + this.record,
                r = [],
                a = this.fn(this.name, t) || void 0,
                i = function(e, t) {
                    if (0 != t.rows.length)
                        for (var o = 0, i = t.rows.length; i > o; o++) {
                            var s = JSON.parse(t.rows.item(o).value);
                            s.key = t.rows.item(o).id, r.push(s)
                        }
                    a && a.call(n, r)
                };
            return this.db.readTransaction(function(t) {
                t.executeSql(o, [], i, e)
            }), this
        },
        remove: function(t, n) {
            var o, r = this,
                a = "DELETE FROM " + this.record + " WHERE id ",
                i = function() {
                    n && r.lambda(n).call(r)
                };
            return this.isArray(t) ? (o = t, a += "IN (" + o.map(function() {
                return "?"
            }).join(",") + ")") : (a += "= ?", o = [t]), o = o.map(function(e) {
                return e.key ? e.key : e
            }), this.db.transaction(function(t) {
                t.executeSql(a, o, i, e)
            }), this
        },
        nuke: function(t) {
            var n = "DELETE FROM " + this.record,
                o = this,
                r = t ? function() {
                    o.lambda(t).call(o)
                } : function() {};
            return this.db.transaction(function(t) {
                t.executeSql(n, [], r, e)
            }), this
        }
    }
}()), window.getQueryParams = function(e) {
    e = e.split("+").join(" ");
    for (var t, n = {}, o = /[?&]?([^=]+)=([^&]*)/g; t = o.exec(e);) n[decodeURIComponent(t[1])] = decodeURIComponent(t[2]);
    return n
};
var jWorkflow = function() {
    function e(e) {
        if ("function" != typeof e) throw "expected function but was " + typeof e
    }

    function t(e) {
        return "function" == typeof e.andThen && "function" == typeof e.start && "function" == typeof e.chill
    }

    function n(e) {
        return !!e.map && !!e.reduce
    }
    var o = {
        order: function(o, r) {
            var a, i = [],
                s = null,
                l = function() {
                    var e = !1;
                    return {
                        take: function() {
                            e = !0
                        },
                        pass: function(t) {
                            var n;
                            e = !1, a.length ? (n = a.shift(), t = n.func.apply(n.context, [t, l]), e || l.pass(t)) : s.func && s.func.apply(s.context, [t])
                        },
                        drop: function(t) {
                            e = !0, a = [], setTimeout(function() {
                                l.pass(t)
                            }, 1)
                        }
                    }
                }(),
                c = {
                    andThen: function(o, r) {
                        if (t(o)) {
                            var a = function(e, t) {
                                t.take(), o.start({
                                    callback: function(e) {
                                        t.pass(e)
                                    },
                                    context: r,
                                    initialValue: e
                                })
                            };
                            i.push({
                                func: a,
                                context: r
                            })
                        } else if (n(o)) {
                            var s = function(e, t) {
                                t.take();
                                var n = o.length,
                                    r = function() {
                                        return --n || t.pass()
                                    };
                                o.forEach(function(e) {
                                    jWorkflow.order(e).start(r)
                                })
                            };
                            i.push({
                                func: s,
                                context: r
                            })
                        } else e(o), i.push({
                            func: o,
                            context: r
                        });
                        return c
                    },
                    chill: function(e) {
                        return c.andThen(function(t, n) {
                            n.take(), setTimeout(function() {
                                n.pass(t)
                            }, e)
                        })
                    },
                    start: function() {
                        var e, t, n;
                        arguments[0] && "object" == typeof arguments[0] ? (e = arguments[0].callback, t = arguments[0].context, n = arguments[0].initialValue) : (e = arguments[0], t = arguments[1]), s = {
                            func: e,
                            context: t
                        }, a = i.slice(), l.pass(n)
                    }
                };
            return o ? c.andThen(o, r) : c
        }
    };
    return o
}();
"object" == typeof module && "function" == typeof require && (module.exports = jWorkflow), util.scoped(function() {
    "use strict";
    var e = window.navigator.userAgent.toLowerCase(),
        t = /mobile|android|kindle|silk|midp|(windows nt 6\.2.+arm|touch)/.test(e);
    e = /(chrome|firefox)[ \/]([\w.]+)/.exec(e) || /(iphone|ipad|ipod)(?:.*version)?[ \/]([\w.]+)/.exec(e) || /(android)(?:.*version)?[ \/]([\w.]+)/.exec(e) || /(webkit|opera)(?:.*version)?[ \/]([\w.]+)/.exec(e) || /(msie) ([\w.]+)/.exec(e) || [];
    var n = e[1],
        o = parseFloat(e[2]);
    switch (n) {
        case "msie":
            n = "ie", o = doc.documentMode || o;
            break;
        case "firefox":
            n = "ff";
            break;
        case "ipod":
        case "ipad":
        case "iphone":
            n = "ios";
            break;
        case "webkit":
            n = "safari"
    }
    window.Browser = {
        name: n,
        mobile: t,
        version: o
    }, Browser[n] = !0
});
var view = window.view = {};
window.onerror = function(e) {
    controller.showErrorPanel("Critical Game Fault", e.stack)
}, util.singleLazyCall = function(e) {
    var t = !1;
    return function() {
        t && assert(!1, "this function cannot be called twice"), e.apply(null, arguments)
    }
}, util.iterateListByFlow = function(e, t, n) {
    for (var o = {
            i: 0,
            list: t
        }, r = 0, a = t.length; a > r; r++) e.andThen(function(e, t) {
        n.call(this, e, t), this.i++
    }, o);
    e.andThen(function() {
        assert(t === this.list), assert(this.i === this.list.length)
    }, o)
}, util.scoped(function() {
    function e() {
        if (4 == this.readyState)
            if (4 == this.readyState && 200 == this.status)
                if (util.log("grabbed file successfully"), this.asJSON) {
                    var e;
                    try {
                        e = JSON.parse(this.responseText)
                    } catch (t) {
                        this.failCallback(t)
                    }
                    this.winCallback(e)
                } else this.winCallback(this.responseText);
        else util.log("could not grab file"), this.failCallback(this.statusText)
    }
    var t;
    try {
        new XMLHttpRequest, t = !0
    } catch (n) {
        t = !1
    }
    util.grabRemoteFile = function(n) {
        var o;
        util.log("try to grab file", n.path), o = t ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP"), o.asJSON = n.json, o.winCallback = n.success, o.failCallback = n.error, o.onreadystatechange = e, o.open("get", n.path, !0), o.send()
    }
}), util.scoped(function() {
    var e = controller.stateMachine.data.selection,
        t = [0, 3, 0, 250, 0, 0, 3, 0, 250, 0, 0, 7, 0, 150, 0, 0, 20, 0, 300, 0, 0, 4, 0, 400, 0, 0, 4, 0, 350, 0, 0, 8, 0, 350, 0],
        n = 1;
    view.getSpriteStep = function(e) {
        switch (e) {
            case "UNIT":
                return t[0];
            case "UNIT_SIMPLE":
                return t[5];
            case "SELECTION":
                return t[10];
            case "STATUS":
                return t[15];
            case "PROPERTY":
                return t[20];
            case "ANIM_TILES":
                return t[25];
            case "ANIM_TILES_EXT":
                return t[30]
        }
        return 0
    }, view.updateSpriteAnimations = function(o) {
        for (var r = !1, a = 0, i = t.length; i > a; a += 5)
            if (t[a + 2] += o, t[a + 2] >= t[a + 3]) {
                if (t[a + 2] = 0, 0 === a ? (t[a] += n, -1 === n ? -1 === t[a] && (t[a] = 1, n = 1) : t[a] === t[a + 1] && (t[a] = t[a + 1] - 2, n = -1)) : (t[a] += 1, t[a] === t[a + 1] && (t[a] = 0)), r = !0, t[a + 4] = 1, r) {
                    var s = 0,
                        l = 0,
                        c = model.map_width,
                        u = model.map_height;
                    if (1 === t[4] || 1 === t[9] || 1 === t[24] || 1 === t[29])
                        for (; c > s; s++)
                            for (var d = l; u > d; d++)(1 === t[4] || 1 === t[9]) && null !== model.unit_posData[s][d] && view.redraw_markPosWithNeighboursRing(s, d), 1 === t[24] && null !== model.property_posMap[s][d] && view.redraw_markPosWithNeighboursRing(s, d), (1 === t[29] || 1 === t[34]) && view.animatedTiles[model.map_data[s][d].ID] && view.redraw_markPos(s, d);
                    var m = "MOVEPATH_SELECTION" === controller.stateMachine.state || "ACTION_SELECT_TARGET_A" === controller.stateMachine.state || "ACTION_SELECT_TARGET_B" === controller.stateMachine.state || controller.attackRangeVisible;
                    m && 1 === t[14] && e.rerenderNonInactive()
                }
                t[4] = 0, t[9] = 0, t[14] = 0, t[19] = 0, t[24] = 0, t[29] = 0, t[34] = 0
            }
    }
}), controller.audio_SFX_STORAGE_PARAMETER = "volume_sfx", controller.audio_MUSIC_STORAGE_PARAMETER = "music_sfx", controller.audio_ctx_ = !1, controller.audio_gainNode_music_ = null, controller.audio_gainNode_sfx_ = null, controller.audio_initialize = function() {
    if (util.log("initializing audio context"), !controller.features_client.audioSFX && !controller.features_client.audioMusic) return controller.audio_ctx_ = null, null;
    try {
        if (window.AudioContext) controller.audio_ctx_ = new window.AudioContext;
        else {
            if (!window.webkitAudioContext) throw Error("no AudioContext constructor found");
            controller.audio_ctx_ = new window.webkitAudioContext
        }
        controller.audio_gainNode_sfx_ = (controller.audio_ctx_.createGain ? controller.audio_ctx_.createGain() : controller.audio_ctx_.createGainNode()), controller.audio_gainNode_sfx_.gain.value = 1, controller.audio_gainNode_sfx_.connect(controller.audio_ctx_.destination), controller.audio_gainNode_music_ = (controller.audio_ctx_.createGain ? controller.audio_ctx_.createGain() : controller.audio_ctx_.createGainNode()), controller.audio_gainNode_music_.gain.value = .5, controller.audio_gainNode_music_.connect(controller.audio_ctx_.destination), controller.storage_general.get(controller.audio_SFX_STORAGE_PARAMETER, function(e) {
            e && (controller.audio_gainNode_sfx_.gain.value = e.value)
        }), controller.storage_general.get(controller.audio_MUSIC_STORAGE_PARAMETER, function(e) {
            e && (controller.audio_gainNode_music_.gain.value = e.value)
        })
    } catch (e) {}
}, controller.audio_grabContext = function() {
    return controller.audio_ctx_
}, controller.audio_buffer_ = {}, controller.audio_currentMusic_ = null, controller.audio_currentMusicId_ = null, controller.audio_registerAudioBuffer = function(e, t) {
    controller.audio_buffer_[e] = t
}, controller.audio_loadByArrayBuffer = function(e, t, n) {
    assert(util.isString(e)), controller.audio_grabContext().decodeAudioData(t, function(t) {
        controller.audio_registerAudioBuffer(e, t), n && n(!0, e)
    }, function() {
        n && n(!1, e)
    })
}, controller.audio_unloadBuffer = function(e) {
    assert(util.isString(e)), delete controller.audio_buffer_[e]
}, controller.audio_isBuffered = function(e) {
    return controller.audio_buffer_.hasOwnProperty(e)
}, controller.audio_getSfxVolume = function() {
    return controller.audio_ctx_ ? controller.audio_gainNode_sfx_.gain.value : void 0
}, controller.audio_getMusicVolume = function() {
    return controller.audio_ctx_ ? controller.audio_gainNode_music_.gain.value : void 0
}, controller.audio_setSfxVolume = function(e) {
    controller.audio_ctx_ && (0 > e ? e = 0 : e > 1 && (e = 1), controller.audio_gainNode_sfx_.gain.value = e)
}, controller.audio_setMusicVolume = function(e) {
    controller.audio_ctx_ && (0 > e ? e = 0 : e > 1 && (e = 1), controller.audio_gainNode_music_.gain.value = e)
}, controller.audio_saveConfigs = function() {
    controller.audio_gainNode_sfx_ && controller.storage_general.set(controller.audio_SFX_STORAGE_PARAMETER, controller.audio_gainNode_sfx_.gain.value), controller.audio_gainNode_music_ && controller.storage_general.set(controller.audio_MUSIC_STORAGE_PARAMETER, controller.audio_gainNode_music_.gain.value)
}, controller.audio_playSound = function(e, t, n) {
    if (controller.audio_ctx_ && controller.audio_buffer_[e]) {
        var o = n ? controller.audio_gainNode_music_ : controller.audio_gainNode_sfx_;
        if (!o) return null;
        var r = controller.audio_ctx_.createBufferSource();
         if (t) r.loop = !0;
         r.buffer = controller.audio_buffer_[e];
         r.connect(o);
         (r.start ? r.start(0) : r.noteOn(0));
        return r;
    }
}, controller.audio_playNullSound = function() {
    if (controller.audio_ctx_) {
        var e = controller.audio_ctx_,
            t = e.createBuffer(1, 1, 22050),
            n = e.createBufferSource();
        n.buffer = t, n.connect(e.destination), (n.start ? n.start(0) : n.noteOn(0))
    }
}, controller.audio_playMusic = function(e) {
    controller.audio_ctx_ && controller.audio_currentMusicId_ !== e && controller.audio_buffer_[e] && (controller.audio_stopMusic(), controller.audio_currentMusic_ = controller.audio_playSound(e, !0, !0), controller.audio_currentMusicId_ = e)
}, controller.audio_stopMusic = function() {
    controller.audio_currentMusic_ && ((controller.audio_currentMusic_.stop ? controller.audio_currentMusic_.stop() : controller.audio_currentMusic_.noteOff(0)), controller.audio_currentMusic_.disconnect(0)), controller.audio_currentMusic_ = null, controller.audio_currentMusicId_ = null
}, controller.background_cssEl_ = null, controller.background_registerAsBackground = function(e) {
    assert(util.isString(e) && e.length > 0), controller.background_cssEl_ || (controller.background_cssEl_ = document.createElement("style"), document.getElementsByTagName("head")[0].appendChild(controller.background_cssEl_)), controller.background_cssEl_.innerHTML = ".cwt_page {background-image: url(data:image/jpeg;base64," + e + ");" + "background-repeat: no-repeat;" + "background-position: 0px 45px;" + "background-size: 100% calc(100% - 44px);" + "}"
}, controller.BUTTON_GROUP_DEFAULT_STYLE = "cwt_panel_header_big cwt_page_button cwt_panel_button", controller.BUTTON_GROUP_DEFAULT_STYLE_ACT = "cwt_panel_header_big cwt_page_button cwt_panel_button active", controller.BUTTON_GROUP_DEFAULT_STYLE_INACT = "cwt_panel_header_big cwt_page_button cwt_panel_button inactive", controller.ButtonGroup = {
    changeIndex: function(e, t) {
        void 0 === t && (t = !0), -1 !== this.index && (this.elements[this.index].className = this.cls), t ? e > 0 ? (this.index++, this.index >= this.elements.length && (this.index = 0)) : (this.index--, this.index < 0 && (this.index = this.elements.length - 1)) : this.index = 0 > e || e >= this.elements.length ? 0 : e, vl = this.elements[this.index].attributes.inactive && "true" === this.elements[this.index].attributes.inactive.value ? this.cls_inact : this.cls_act, this.elements[this.index].className = vl
    },
    increaseIndex: function() {
        this.changeIndex(1, !0)
    },
    decreaseIndex: function() {
        this.changeIndex(-1, !0)
    },
    setIndex: function(e) {
        this.changeIndex(e, !1)
    },
    isIndexInactive: function() {
        return this.elements[this.index].attributes.inactive && "true" === this.elements[this.index].attributes.inactive.value
    },
    getActiveKey: function() {
        return this.elements[this.index].attributes.key.value
    },
    getActiveData: function() {
        return this.elements[this.index].attributes.data.value
    },
    getActiveElement: function() {
        return this.elements[this.index]
    }
}, controller.registerButtonGroupHover = function(e, t, n) {
    t.onmouseover = function() {
        e.setIndex(n, !1)
    }, t.onclick = function() {
        controller.screenStateMachine.event("INP_ACTION")
    }
}, controller.generateButtonGroup = function(e, t, n, o) {
    var r = e.getElementsByTagName("button"),
        a = Object.create(controller.ButtonGroup);
    a.index = 0, a.elements = r, 1 === arguments.length && (t = controller.BUTTON_GROUP_DEFAULT_STYLE, n = controller.BUTTON_GROUP_DEFAULT_STYLE_ACT, o = controller.BUTTON_GROUP_DEFAULT_STYLE_INACT), a.cls = t, a.cls_act = n, a.cls_inact = o;
    for (var i = 0, s = r.length; s > i; i++) r[i].className = a.cls, controller.registerButtonGroupHover(a, r[i], i);
    return a.setIndex(0), a
}, controller.mapCursorX = 0, controller.mapCursorY = 0, controller.resetMapCursor = function() {
    controller.mapCursorX = 0, controller.mapCursorY = 0
}, controller.cursorAction = function(e) {
    if (!controller.inAnimationHookPhase()) {
        var t = controller.stateMachine.state,
            n = "MOVEPATH_SELECTION" === t || "IDLE_R" === t || "ACTION_SELECT_TARGET_A" === t || "ACTION_SELECT_TARGET_B" === t;
        e ? controller.stateMachine.event("cancel", controller.mapCursorX, controller.mapCursorY) : -1 !== controller.menuCursorIndex ? controller.stateMachine.event("action", controller.menuCursorIndex) : controller.stateMachine.event("action", controller.mapCursorX, controller.mapCursorY);
        var o = controller.stateMachine.state,
            r = "MOVEPATH_SELECTION" === o || "IDLE_R" === o || "ACTION_SELECT_TARGET_A" === o || "ACTION_SELECT_TARGET_B" === o;
        if ((n && !r || r) && view.redraw_markSelection(controller.stateMachine.data), "ACTION_MENU" === o || "ACTION_SUBMENU" === o) {
            var a = controller.stateMachine.data.menu;
            controller.showMenu(a, controller.mapCursorX, controller.mapCursorY)
        } else("ACTION_MENU" === t || "ACTION_SUBMENU" === t) && controller.hideMenu()
    }
}, controller.cursorActionCancel = function() {
    controller.cursorAction(!0), controller.audio_playSound(model.data_sounds.CANCEL)
}, controller.cursorActionClick = function() {
    controller.cursorAction(!1), controller.audio_playSound(model.data_sounds.MENUTICK)
}, controller.moveCursor = function(e, t) {
    1 === arguments.length && (t = 1);
    var n = controller.mapCursorX,
        o = controller.mapCursorY;
    switch (e) {
        case model.move_MOVE_CODES.UP:
            o -= t;
            break;
        case model.move_MOVE_CODES.RIGHT:
            n += t;
            break;
        case model.move_MOVE_CODES.DOWN:
            o += t;
            break;
        case model.move_MOVE_CODES.LEFT:
            n -= t
    }
    controller.setCursorPosition(n, o)
}, controller.setCursorPosition = function(e, t, n) {
    if (!controller.isMenuOpen() && (n && (e += controller.screenX, t += controller.screenY), 0 > e && (e = 0), 0 > t && (t = 0), e >= model.map_width && (e = model.map_width - 1), t >= model.map_height && (t = model.map_height - 1), e !== controller.mapCursorX || t !== controller.mapCursorY)) {
        view.redraw_markPos(controller.mapCursorX, controller.mapCursorY), controller.mapCursorY < model.map_height - 1 && view.redraw_markPos(controller.mapCursorX, controller.mapCursorY + 1), controller.audio_playSound(model.data_sounds.MAPTICK), view.redraw_markPos(controller.mapCursorX, controller.mapCursorY), controller.mapCursorX = e, controller.mapCursorY = t, controller.updateSimpleTileInformation();
        var o = controller.screenScale;
        0 === o ? o = .8 : -1 === o && (o = .7);
        var r = parseInt(parseInt((window.innerWidth - 80) / 16, 10) / o, 10),
            a = parseInt(parseInt((window.innerHeight - 80) / 16, 10) / o, 10);
        controller.sideSimpleTileInformationPanel < 0 && e - controller.screenX < .25 * r && controller.moveSimpleTileInformationToRight(), controller.sideSimpleTileInformationPanel > 0 && e - controller.screenX >= .75 * r && controller.moveSimpleTileInformationToLeft();
        var i = -1;
        e - controller.screenX <= 1 ? i = model.move_MOVE_CODES.LEFT : e - controller.screenX >= r - 1 ? i = model.move_MOVE_CODES.RIGHT : t - controller.screenY <= 1 ? i = model.move_MOVE_CODES.UP : t - controller.screenY >= a - 1 && (i = model.move_MOVE_CODES.DOWN), -1 !== i && controller.shiftScreenPosition(i, 5), view.redraw_markPos(e, t)
    }
}, util.scoped(function() {
    var e = document.getElementById("cwt_errorPanel"),
        t = document.getElementById("cwt_errorPanel_reason"),
        n = document.getElementById("cwt_errorPanel_data");
    controller.errorButtons = controller.generateButtonGroup(e, "cwt_panel_header_small cwt_page_button cwt_panel_button", "cwt_panel_header_small cwt_page_button cwt_panel_button button_active", "cwt_panel_header_small cwt_page_button cwt_panel_button button_inactive"), controller.errorPanelVisible = !1, controller.showErrorPanel = function(o, r) {
        n.innerHTML = o, t.innerHTML = r, e.style.display = "block", controller.errorPanelVisible = !0
    }, controller.hideErrorPanel = function() {
        e.style.display = "none", controller.errorPanelVisible = !1
    }
}), controller.features_client = {
    audioSFX: !1,
    audioMusic: !1,
    gamePad: !1,
    keyboard: !1,
    mouse: !1,
    touch: !1,
    supported: !1,
    scaledImg: !1
}, controller.features_analyseClient = function() {
    Browser.mobile ? (Browser.ios ? (Browser.version >= 5 && (controller.features_client.supported = !0), Browser.version >= 6 && (controller.features_client.audioSFX = !0)) : Browser.android && (controller.features_client.supported = !0), controller.features_client.touch = !0) : ((Browser.chrome || Browser.safari) && (controller.features_client.supported = !0, controller.features_client.audioSFX = !0, controller.features_client.audioMusic = !0), Browser.chrome && (controller.features_client.gamePad = !0), controller.features_client.mouse = !0, controller.features_client.keyboard = !0)
}, util.scoped(function() {
    function e() {
        if (view.hooksBuffer.isEmpty()) n = !1;
        else {
            n = !0;
            var e = view.hooksBuffer.pop(),
                o = e[e.length - 1];
            t = view.animationHooks[o], t.prepare.apply(t, e)
        }
    }
    var t = null,
        n = !1,
        o = 0;
    controller.prepareGameLoop = function() {
        o = 0
    }, controller.gameLoop = function(r) {
        o += r, controller.updateInputCoolDown(r);
        var a = 0 !== controller.moveScreenX || 0 !== controller.moveScreenY;
        if (a ? controller.solveMapShift() : (view.hasInfoMessage() ? view.updateMessagePanelTime(r) : n ? (t.update(r), t.isDone() && e()) : (controller.update_tickFrame(o), o = 0, e()), view.updateSpriteAnimations(r)), view.redraw_dataChanges > 0 && view.renderMap(controller.screenScale), n) t.render();
        else if ("ACTION_SELECT_TILE" === controller.stateMachine.state) {
            var i, s, l = view.selectionRange,
                c = controller.mapCursorX,
                u = controller.mapCursorY,
                d = u - l,
                m = u + l;
            for (0 > d && (d = 0), m >= model.map_height && (m = model.map_height - 1); m >= d; d++) {
                var _ = Math.abs(d - u);
                for (i = c - l + _, s = c + l - _, 0 > i && (i = 0), s >= model.map_width && (s = model.map_width - 1); s >= i; i++) view.redraw_markPos(i, d)
            }
        }
    }, controller.inGameLoop = !1, controller.inAnimationHookPhase = function() {
        return n
    }
}), view.hooksBuffer = util.createRingBuffer(50), view.animationHooks = {}, view.registerAnimationHook = function(e) {
    var t = e.key;
    view.animationHooks.hasOwnProperty(t) && assert(!1, "animation algorithm for", t, "is already registered"), view.animationHooks[t] = e, model.event_on(t, function() {
        for (var e = [], n = 0, o = arguments.length; o > n; n++) e[n] = arguments[n];
        e[e.length] = t, view.hooksBuffer.push(e)
    }), e.isEnabled = !0
}, view.IMAGE_CODE_IDLE = "IDLE", view.IMAGE_CODE_IDLE_INVERTED = "IDLE_R", view.IMAGE_CODE_RIGHT = "RIGHT", view.IMAGE_CODE_LEFT = "LEFT", view.IMAGE_CODE_UP = "UP", view.IMAGE_CODE_DOWN = "DOWN", view.IMAGE_CODE_STATELESS = "STATELESS", view.COLOR_RED = "RED", view.COLOR_GREEN = "GREEN", view.COLOR_BLUE = "BLUE", view.COLOR_YELLOW = "YELLOW", view.COLOR_BLACK_MASK = "BLACK_MASK", view.COLOR_NEUTRAL = "GRAY", view.COLOR_NONE = "NONE", view.IMG_COLOR_MAP_PROPERTIES_ID = "IMG_MAP_PROPERTY", view.IMG_COLOR_MAP_UNITS_ID = "IMG_MAP_UNIT", view.CodeStatelessview = {
    RED: {},
    BLUE: {},
    YELLOW: {},
    GREEN: {},
    BLACK_MASK: {},
    NONE: {},
    GRAY: {}
}, view.overlayImages = {}, view.animatedTiles = {}, view.CodeIdleview = {
    RED: {},
    BLUE: {},
    YELLOW: {},
    GREEN: {},
    BLACK_MASK: {}
}, view.CodeIdleInvertedview = {
    RED: {},
    BLUE: {},
    YELLOW: {},
    GREEN: {},
    BLACK_MASK: {}
}, view.CodeRightview = {
    RED: {},
    BLUE: {},
    YELLOW: {},
    GREEN: {},
    BLACK_MASK: {}
}, view.CodeLeftview = {
    RED: {},
    BLUE: {},
    YELLOW: {},
    GREEN: {},
    BLACK_MASK: {}
}, view.CodeUpview = {
    RED: {},
    BLUE: {},
    YELLOW: {},
    GREEN: {},
    BLACK_MASK: {}
}, view.CodeDownview = {
    RED: {},
    BLUE: {},
    YELLOW: {},
    GREEN: {},
    BLACK_MASK: {}
}, view.setImageForType = function(e, t, n, o) {
    switch (void 0 === n && (n = view.IMAGE_CODE_STATELESS), void 0 === o && (o = view.COLOR_NONE), n) {
        case view.IMAGE_CODE_IDLE:
            view.CodeIdleview[o][t] = e;
            break;
        case view.IMAGE_CODE_STATELESS:
            view.CodeStatelessview[o][t] = e;
            break;
        case view.IMAGE_CODE_IDLE_INVERTED:
            view.CodeIdleInvertedview[o][t] = e;
            break;
        case view.IMAGE_CODE_LEFT:
            view.CodeLeftview[o][t] = e;
            break;
        case view.IMAGE_CODE_RIGHT:
            view.CodeRightview[o][t] = e;
            break;
        case view.IMAGE_CODE_DOWN:
            view.CodeDownview[o][t] = e;
            break;
        case view.IMAGE_CODE_UP:
            view.CodeUpview[o][t] = e;
            break;
        default:
            assert(!1, "unknown image state code ", n)
    }
}, view.setUnitImageForType = view.setImageForType, view.setPropertyImageForType = function(e, t, n) {
    view.setImageForType(e, t, view.IMAGE_CODE_STATELESS, n)
}, view.setTileImageForType = function(e, t) {
    view.setImageForType(e, t, view.IMAGE_CODE_STATELESS, view.COLOR_NONE)
}, view.setTileShadowImageForType = function(e, t) {
    view.setImageForType(e, t, view.IMAGE_CODE_STATELESS, view.COLOR_BLACK_MASK)
}, view.setInfoImageForType = function(e, t) {
    view.setImageForType(e, t, view.IMAGE_CODE_STATELESS, view.COLOR_NONE)
}, view.getImageForType = function(e, t, n) {
    switch (t) {
        case view.IMAGE_CODE_IDLE:
            return view.CodeIdleview[n][e];
        case view.IMAGE_CODE_IDLE_INVERTED:
            return view.CodeIdleInvertedview[n][e];
        case view.IMAGE_CODE_LEFT:
            return view.CodeLeftview[n][e];
        case view.IMAGE_CODE_RIGHT:
            return view.CodeRightview[n][e];
        case view.IMAGE_CODE_DOWN:
            return view.CodeDownview[n][e];
        case view.IMAGE_CODE_UP:
            return view.CodeUpview[n][e];
        case view.IMAGE_CODE_STATELESS:
            return view.CodeStatelessview[n][e];
        default:
            assert(!1, "unknown image state code ", t)
    }
}, view.getUnitImageForType = view.getImageForType, view.getPropertyImageForType = function(e, t) {
    return view.getImageForType(e, view.IMAGE_CODE_STATELESS, t)
}, view.getTileImageForType = function(e) {
    return view.getImageForType(e, view.IMAGE_CODE_STATELESS, view.COLOR_NONE)
}, view.getTileShadowImageForType = function(e) {
    return view.getImageForType(e, view.IMAGE_CODE_STATELESS, view.COLOR_BLACK_MASK)
}, view.getInfoImageForType = function(e) {
    return view.getImageForType(e, view.IMAGE_CODE_STATELESS, view.COLOR_NONE)
}, view.imageProcessor_UNIT_INDEXES = {
    BLACK_MASK: 8,
    RED: 0,
    BLUE: 3,
    GREEN: 4,
    YELLOW: 5,
    colors: 6
}, view.imageProcessor_PROPERTY_INDEXES = {
    RED: 0,
    GRAY: 1,
    BLUE: 3,
    GREEN: 4,
    YELLOW: 5,
    BLACK_MASK: 8,
    colors: 4
}, view.imageProcessor_getPropertyColorData = util.scoped(function() {
    var e = null;
    return function() {
        return e || (e = view.imageProcessor_getImageDataArray(view.getInfoImageForType(view.IMG_COLOR_MAP_PROPERTIES_ID))), e
    }
}), view.imageProcessor_getUnitColorData = util.scoped(function() {
    var e = null;
    return function() {
        return e || (e = view.imageProcessor_getImageDataArray(view.getInfoImageForType(view.IMG_COLOR_MAP_UNITS_ID))), e
    }
}), view.imageProcessor_getImageDataArray = function(e) {
    var t = document.createElement("canvas"),
        n = t.getContext("2d"),
        o = e.width,
        r = e.height;
    return t.width = o, t.height = r, n.drawImage(e, 0, 0), n.getImageData(0, 0, o, r).data
}, view.imageProcessor_flipImage = function(e, t, n) {
    var o = t ? -1 : 1,
        r = n ? -1 : 1,
        a = t ? -1 * e.width : 0,
        i = n ? -1 * e.height : 0,
        s = document.createElement("canvas");
    s.height = e.height, s.width = e.width;
    var l = s.getContext("2d");
    return l.save(), l.scale(o, r), l.drawImage(e, a, i, e.width, e.height), l.restore(), s
}, view.imageProcessor_convertToBlackMask = function(e) {
    var t = document.createElement("canvas"),
        n = t.getContext("2d"),
        o = e.width,
        r = e.height;
    t.width = o, t.height = r, n.drawImage(e, 0, 0);
    for (var a = n.getImageData(0, 0, o, r), i = 0; i < a.height; i++)
        for (var s = 0; s < a.width; s++) {
            var l = 4 * i * a.width + 4 * s,
                c = a.data[l + 3];
            c > 0 && (a.data[l] = 0, a.data[l + 1] = 0, a.data[l + 2] = 0)
        }
    return n.putImageData(a, 0, 0), t
}, view.imageProcessor_replaceColors = function(e, t, n, o, r) {
    var a = document.createElement("canvas"),
        i = a.getContext("2d"),
        s = e.width,
        l = e.height;
    a.width = s, a.height = l, i.drawImage(e, 0, 0);
    for (var c = i.getImageData(0, 0, s, l), u = 4 * o * n, d = 4 * r * n, m = 0; m < c.height; m++)
        for (var _ = 0; _ < c.width; _++)
            for (var h = 4 * m * c.width + 4 * _, f = c.data[h], p = c.data[h + 1], g = c.data[h + 2], v = 0, w = 4 * n; w > v; v += 4) {
                var I = t[u + v],
                    E = t[u + v + 1],
                    T = t[u + v + 2];
                if (I === f && E === p && T === g) {
                    var S = d + v,
                        M = t[S],
                        y = t[S + 1],
                        A = t[S + 2];
                    c.data[h] = M, c.data[h + 1] = y, c.data[h + 2] = A
                }
            }
    return i.putImageData(c, 0, 0), a
}, view.imageProcessor_colorizeUnit = util.scoped(function() {
    var e = [view.IMAGE_CODE_IDLE, view.IMAGE_CODE_IDLE_INVERTED, view.IMAGE_CODE_DOWN, view.IMAGE_CODE_UP, view.IMAGE_CODE_RIGHT, view.IMAGE_CODE_LEFT];
    return function(t) {
        for (var n = 0, o = e.length; o > n; n++) {
            var r = e[n],
                a = view.getUnitImageForType(t, r, view.COLOR_RED),
                i = view.imageProcessor_getUnitColorData(),
                s = view.imageProcessor_UNIT_INDEXES;
            view.setUnitImageForType(view.imageProcessor_replaceColors(a, i, s.colors, s.RED, s.BLUE), t, r, view.COLOR_BLUE), view.setUnitImageForType(view.imageProcessor_replaceColors(a, i, s.colors, s.RED, s.GREEN), t, r, view.COLOR_GREEN), view.setUnitImageForType(view.imageProcessor_replaceColors(a, i, s.colors, s.RED, s.YELLOW), t, r, view.COLOR_YELLOW), view.setUnitImageForType(view.imageProcessor_convertToBlackMask(a), t, r, view.COLOR_BLACK_MASK)
        }
    }
}), view.imageProcessor_colorizeProperty = function(e) {
    var t = view.getPropertyImageForType(e, view.COLOR_RED),
        n = view.imageProcessor_getPropertyColorData(),
        o = view.imageProcessor_PROPERTY_INDEXES;
    view.setPropertyImageForType(view.imageProcessor_replaceColors(t, n, o.colors, o.RED, o.BLUE), e, view.COLOR_BLUE), view.setPropertyImageForType(view.imageProcessor_replaceColors(t, n, o.colors, o.RED, o.GREEN), e, view.COLOR_GREEN), view.setPropertyImageForType(view.imageProcessor_replaceColors(t, n, o.colors, o.RED, o.YELLOW), e, view.COLOR_YELLOW), view.setPropertyImageForType(view.imageProcessor_replaceColors(t, n, o.colors, o.RED, o.GRAY), e, view.COLOR_NEUTRAL), view.setPropertyImageForType(view.imageProcessor_convertToBlackMask(t), e, view.COLOR_BLACK_MASK)
}, view.imageProcessor_colorizeTile = function(e) {
    view.setTileShadowImageForType(view.imageProcessor_convertToBlackMask(view.getTileImageForType(e)), e)
}, view.imageProcessor_cropMiscSprite = function(e) {
    if (e.length > 2) {
        var t = view.getInfoImageForType(e[0]),
            n = document.createElement("canvas"),
            o = n.getContext("2d");
        e.length > 6 ? e[6] === !0 ? (n.height = 32, n.width = 96, n = view.imageProcessor_flipImage(n, !0, !1), o = n.getContext("2d")) : e[6] === !1 ? (n.height = 32, n.width = 96, n = view.imageProcessor_flipImage(n, !1, !0), o = n.getContext("2d")) : (n.height = 16, n.width = 16, o.save(), o.translate(8, 8), o.rotate(e[6] * Math.PI / 180), o.translate(-8, -8)) : (n.height = 16, n.width = 16), e.length > 6 && e[6] === !0 ? o.drawImage(t, e[2], e[3], e[4], e[5], 0, 0, 96, 32) : o.drawImage(t, e[2], e[3], e[4], e[5], 0, 0, 16, 16), e.length > 6 && o.restore(), view.setInfoImageForType(n, e[0])
    }
}, view.imageProcessor_cropUnitSprite = function(e) {
    var t, n, o = view.COLOR_RED,
        r = view.getUnitImageForType(e, view.IMAGE_CODE_IDLE, o);
    t = document.createElement("canvas"), t.height = 32, t.width = 96, n = t.getContext("2d"), n.drawImage(r, 0, 0, 96, 32, 0, 0, 96, 32), view.setUnitImageForType(t, e, view.IMAGE_CODE_IDLE, o), t = document.createElement("canvas"), t.height = 32, t.width = 96, n = t.getContext("2d"), n.drawImage(r, 0, 0, 96, 32, 0, 0, 96, 32), view.setUnitImageForType(view.imageProcessor_flipImage(t, !0, !1), e, view.IMAGE_CODE_IDLE_INVERTED, o), t = document.createElement("canvas"), t.height = 32, t.width = 96, n = t.getContext("2d"), n.drawImage(r, 288, 0, 96, 32, 0, 0, 96, 32), view.setUnitImageForType(t, e, view.IMAGE_CODE_LEFT, o), t = document.createElement("canvas"), t.height = 32, t.width = 96, n = t.getContext("2d"), n.drawImage(r, 288, 0, 96, 32, 0, 0, 96, 32), view.setUnitImageForType(view.imageProcessor_flipImage(t, !0, !1), e, view.IMAGE_CODE_RIGHT, o), t = document.createElement("canvas"), t.height = 32, t.width = 96, n = t.getContext("2d"), n.drawImage(r, 96, 0, 96, 32, 0, 0, 96, 32), view.setUnitImageForType(t, e, view.IMAGE_CODE_UP, o), t = document.createElement("canvas"), t.height = 32, t.width = 96, n = t.getContext("2d"), n.drawImage(r, 192, 0, 96, 32, 0, 0, 96, 32), view.setUnitImageForType(t, e, view.IMAGE_CODE_DOWN, o)
}, view.imageProcessor_scale2x = function(e) {
    var t, n, o, r, a, i, s, l, c, u, d, m, _, h, f, p, g, v, w, I, E, T, S, M, y, A, C, O, L = e.width,
        b = e.height,
        P = document.createElement("canvas"),
        N = P.getContext("2d");
    P.width = L, P.height = b, N.drawImage(e, 0, 0);
    var D = N.getImageData(0, 0, L, b),
        x = document.createElement("canvas"),
        R = x.getContext("2d");
    x.width = 2 * L, x.height = 2 * b;
    for (var k = R.getImageData(0, 0, 2 * L, 2 * b), B = 0; B < D.height; B++)
        for (var G = 0; G < D.width; G++) p = 4 * B * D.width + 4 * G, t = D.data[p], n = D.data[p + 1], o = D.data[p + 2], G > 0 ? (p = 4 * B * D.width + 4 * (G - 1), _ = D.data[p], h = D.data[p + 1], f = D.data[p + 2]) : (_ = t, h = n, f = o), B > 0 ? (p = 4 * (B - 1) * D.width + 4 * G, r = D.data[p], a = D.data[p + 1], i = D.data[p + 2]) : (r = t, a = n, i = o), G < D.height - 1 ? (p = 4 * (B + 1) * D.width + 4 * G, s = D.data[p], l = D.data[p + 1], c = D.data[p + 2]) : (s = t, l = n, c = o), G < D.width - 1 ? (p = 4 * B * D.width + 4 * (G + 1), u = D.data[p], d = D.data[p + 1], m = D.data[p + 2]) : (u = t, d = n, m = o), g = t, v = n, w = o, I = t, E = n, T = o, S = t, M = n, y = o, A = t, C = n, O = o, r === s && a === l && i === c || _ === u && h === d && f === m || (r === _ && a === h && i === f && (g = _, v = h, w = f), r === u && a === d && i === m && (I = u, E = d, T = m), _ === s && h === l && f === c && (S = _, M = h, y = f), s === u && l === d && c === m && (A = u, C = d, O = m)), p = 4 * 2 * B * k.width + 4 * 2 * G, k.data[p + 0] = g, k.data[p + 1] = v, k.data[p + 2] = w, k.data[p + 4] = I, k.data[p + 5] = E, k.data[p + 6] = T, p = 4 * (2 * B + 1) * k.width + 4 * 2 * G, k.data[p + 0] = S, k.data[p + 1] = M, k.data[p + 2] = y, k.data[p + 4] = A, k.data[p + 5] = C, k.data[p + 6] = O;
    return R.putImageData(k, 0, 0), P = null, x
}, controller.KEY_MAPPINGS = {
    KEYBOARD: 0,
    GAMEPAD: 1
}, controller.DEFAULT_KEY_MAP = {
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
}, controller.KEYMAP_STORAGE_KEY = "__user_key_map__", controller.keyMaps = {
    KEYBOARD: util.copy(controller.DEFAULT_KEY_MAP.KEYBOARD),
    GAMEPAD: util.copy(controller.DEFAULT_KEY_MAP.GAMEPAD)
}, controller.saveKeyMapping = function() {
    controller.storage_general.set(controller.KEYMAP_STORAGE_KEY, controller.keyMaps)
}, controller.loadKeyMapping = function(e) {
    controller.storage_general.get(controller.KEYMAP_STORAGE_KEY, function(t) {
        t && (controller.keyMaps = t.value), e && e()
    })
}, controller.inputCoolDown = 0, controller.updateInputCoolDown = function(e) {
    controller.inputCoolDown -= e, controller.inputCoolDown < 0 && (controller.inputCoolDown = 0)
}, view.mapImages = util.matrix(100, 100, null), util.scoped(function() {
    function e(e, t, n, o, r) {
        if (0 > e || 0 > t || e >= model.map_width || t >= model.map_height) return o[n] = "", void 0;
        var a = r[model.map_data[e][t].ID];
        void 0 === a && (a = ""), o[n] = a
    }

    function t(e, t, n, o) {
        for (var r = 0, a = e.length; a > r; r++) {
            var i = e[r];
            if (!("" !== i[1] && i[1] !== t[0] || "" !== i[2] && i[2] !== t[1] || "" !== i[3] && i[3] !== t[2] || "" !== i[4] && i[4] !== t[3])) {
                if (!n) {
                    if ("" !== i[5] && i[5] !== t[4]) continue;
                    if ("" !== i[6] && i[6] !== t[5]) continue;
                    if ("" !== i[7] && i[7] !== t[6]) continue;
                    if ("" !== i[8] && i[8] !== t[7]) continue
                }
                return i[0]
            }
        }
        return o
    }
    view.updateMapImages = function() {
        var n, o, r = model.map_width,
            a = model.map_height,
            i = e,
            s = t,
            l = [];
        for (n = 0; r > n; n++)
            for (o = 0; a > o; o++) {
                var c = n,
                    u = o,
                    d = model.map_data[c][u].ID,
                    m = model.data_tileSheets[d].assets.gfx_variants;
                if (m) {
                    var _ = m[0];
                    5 === m[1][0].length ? (i(n, o - 1, 0, l, _), i(n + 1, o, 1, l, _), i(n, o + 1, 2, l, _), i(n - 1, o, 3, l, _), view.mapImages[n][o] = s(m[1], l, !0, d)) : (i(n, o - 1, 0, l, _), i(n + 1, o - 1, 1, l, _), i(n + 1, o, 2, l, _), i(n + 1, o + 1, 3, l, _), i(n, o + 1, 4, l, _), i(n - 1, o + 1, 5, l, _), i(n - 1, o, 6, l, _), i(n - 1, o - 1, 7, l, _), view.mapImages[n][o] = s(m[1], l, !1, d))
                } else view.mapImages[c][u] = d
            }
    }
}), util.scoped(function() {
    var e = {},
        t = document.getElementById("cwt_menu");
    document.getElementById("cwt_menu_header"), document.getElementById("cwt_menu_content");
    var n = document.getElementById("cwt_menu_entries"),
        o = "button_active";
    controller.menuPosX = -1, controller.menuPosY = -1, controller.menuCursorIndex = -1, controller.resetMenuCursor = function() {
        controller.menuCursorIndex = 0
    }, controller.setMenuIndex = function(e) {
        controller.audio_playSound(model.data_sounds.MENUTICK), n.children[controller.menuCursorIndex].className = "", controller.menuCursorIndex = e, n.children[controller.menuCursorIndex].className = o
    }, controller.increaseMenuCursor = function() {
        n.children[controller.menuCursorIndex].className = "", controller.menuCursorIndex++, controller.menuCursorIndex === controller.stateMachine.data.menu.size ? controller.menuCursorIndex-- : controller.audio_playSound(model.data_sounds.MENUTICK), n.children[controller.menuCursorIndex].className = o, n.children[controller.menuCursorIndex].children[0].focus()
    }, controller.createButtonConnector = function(e, t) {
        e.onmouseover = function() {
            controller.setMenuIndex(t, !1)
        }, e.onclick = function() {
            controller.screenStateMachine.event("INP_ACTION")
        }
    }, controller.decreaseMenuCursor = function() {
        n.children[controller.menuCursorIndex].className = "", controller.menuCursorIndex--, controller.menuCursorIndex < 0 ? controller.menuCursorIndex = 0 : controller.audio_playSound(model.data_sounds.MENUTICK), n.children[controller.menuCursorIndex].className = o, n.children[controller.menuCursorIndex].children[0].focus()
    }, controller.showMenu = function(o, r, a) {
        TILE_LENGTH * controller.screenScale;
        var i = e.__mainMenu__;
        if ("ACTION_SUBMENU" === controller.stateMachine.state) {
            var s = e[controller.stateMachine.data.action.selectedEntry];
            s && (i = s)
        }
        if (1 === arguments.length && (r = controller.menuPosX, a = controller.menuPosY), !model.map_isValidPosition(r, a)) throw Error("invalid menu position");
        for (var l = n.children, c = 0, u = l.length; u > c; c++) l[c].style.display = "none";
        for (var c = 0, u = o.size; u > c; c++) {
            var d;
            if (l.length > c) l[c].className = "", d = l[c].children[0];
            else {
                d = document.createElement("button"), controller.createButtonConnector(d, c);
                var m = document.createElement("li");
                m.appendChild(d), n.appendChild(m)
            }
            i(o.data[c], d, c, o.enabled[c]), l[c].style.display = ""
        }
        r -= controller.screenX, a -= controller.screenY, controller.menuPosX = r, controller.menuPosY = a, controller.menuCursorIndex = 0, n.children[controller.menuCursorIndex].className = "activeButton", n.children[controller.menuCursorIndex].children[0].focus(), t.style.opacity = 1, t.style.top = "96px", controller.menuVisible = !0, controller.setMenuIndex(0)
    }, controller.hideMenu = function() {
        n.children[controller.menuCursorIndex].className = "", t.style.opacity = 0, t.style.top = "-1000px", controller.menuCursorIndex = -1, controller.menuVisible = !1
    }, controller.menuVisible = !1, controller.isMenuOpen = function() {
        return controller.menuVisible
    }, controller.registerMenuRenderer = function(t, n) {
        e.hasOwnProperty(t) && assert(!1, "renderer for", t, "is already registered"), e[t] = n
    }
}), util.scoped(function() {
    var e, t = document.getElementById("cwt_info_box"),
        n = document.getElementById("cwt_info_box_content"),
        o = 2e3;
    view.updateMessagePanelTime = function(n) {
        e > 0 && (e -= n, 0 >= e && (t.style.opacity = 0, t.style.top = "-1000px"))
    }, view.hasInfoMessage = function() {
        return e > 0
    }, view.showInfoMessage = function(r, a) {
        1 === arguments.length && (a = o), n.innerHTML = r, t.style.opacity = 1, t.style.top = "96px", e = a
    }
}), controller.isNetworkGame = function() {
    return !1
}, controller.isHost = function() {
    return !0
}, controller.unitStatusMap = util.list(200, function() {
    return {
        HP_PIC: null,
        LOW_AMMO: !1,
        LOW_FUEL: !1,
        HAS_LOADS: !1,
        CAPTURES: !1,
        VISIBLE: !1
    }
}), controller.getUnitStatusForUnit = function(e) {
    var t = model.unit_extractId(e);
    return controller.unitStatusMap[t]
}, util.scoped(function() {
    function e(e, t, n, o) {
        if (model.map_isValidPosition(e, t)) {
            var r = model.unit_posData[e][t];
            r && (model.player_data[r.owner].team !== n && (o.VISIBLE = !0), r.hidden && (controller.unitStatusMap[model.unit_extractId(r)].VISIBLE = !0))
        }
    }

    function t(t, n) {
        if (n || (n = controller.unitStatusMap[model.unit_extractId(t)]), n.VISIBLE = !0, t.hidden) {
            n.VISIBLE = !1;
            var o = t.x,
                r = t.y,
                a = model.player_data[t.owner].team;
            e(o - 1, r, a, n), e(o, r - 1, a, n), e(o, r + 1, a, n), e(o + 1, r, a, n)
        }
    }
    controller.updateUnitStatus = function(e) {
        var n = model.unit_data[e];
        n.x, n.y;
        var o = controller.unitStatusMap[e],
            r = n.type,
            a = n.ammo,
            i = r.ammo;
        o.LOW_AMMO = a <= parseInt(.25 * i, 10) ? !0 : !1, 0 === i && (o.LOW_AMMO = !1);
        var s = n.fuel,
            l = r.fuel;
        o.LOW_FUEL = s < parseInt(.25 * l, 10) ? !0 : !1;
        var c = -1;
        switch (n.hp <= 90 && (c = parseInt(n.hp / 10, 10) + 1), c) {
            case 1:
                o.HP_PIC = view.getInfoImageForType("HP_1");
                break;
            case 2:
                o.HP_PIC = view.getInfoImageForType("HP_2");
                break;
            case 3:
                o.HP_PIC = view.getInfoImageForType("HP_3");
                break;
            case 4:
                o.HP_PIC = view.getInfoImageForType("HP_4");
                break;
            case 5:
                o.HP_PIC = view.getInfoImageForType("HP_5");
                break;
            case 6:
                o.HP_PIC = view.getInfoImageForType("HP_6");
                break;
            case 7:
                o.HP_PIC = view.getInfoImageForType("HP_7");
                break;
            case 8:
                o.HP_PIC = view.getInfoImageForType("HP_8");
                break;
            case 9:
                o.HP_PIC = view.getInfoImageForType("HP_9");
                break;
            default:
                o.HP_PIC = null
        }
        if (o.HAS_LOADS = n.loadedIn < -1 ? !0 : !1, n.x >= 0) {
            var u = model.property_posMap[n.x][n.y];
            o.CAPTURES = null !== u && u.capturePoints < 20 ? !0 : !1
        }
        t(n, o)
    }
}), controller.action_clientAction({
    key: "options",
    condition: function() {
        return !0
    },
    invoke: function() {
        controller.screenStateMachine.event("toOptions_", !0)
    }
}), view.redraw_dataChanges = 0, view.redraw_data = util.matrix(100, 100, !1), view.redraw_MODE = {
    RECTANGLE: 0,
    CIRCLE: 1
}, view.redraw_markPos = function(e, t, n, o, r) {
    "number" != typeof n ? n = 0 : n--, "number" != typeof o ? o = 0 : o--, "undefined" == typeof r && (r = view.redraw_MODE.RECTANGLE);
    var a = r === view.redraw_MODE.CIRCLE,
        i = e,
        s = t;
    a && (e -= n, t -= o);
    for (var l = Math.min(e + n, model.map_width - 1), c = Math.min(t + o, model.map_height - 1); l >= e; e++)
        for (t = s;;) {
            if (0 > e || 0 > t || e >= model.map_width || t >= model.map_height) break;
            if (view.redraw_data[e][t]) {
                if (t++, c >= t) continue;
                break
            }
            if ((!a || Math.abs(e - i) + Math.abs(t - s) <= n) && (view.redraw_data[e][t] = !0, view.redraw_dataChanges++), model.property_posMap[e][t] && "PROP_INV" === model.property_posMap[e][t].type.ID && e === l && (l++, t > c && (c = t)), t++, t === model.map_height) break;
            if (null === model.property_posMap[e][t] && !(c >= t) && view.overlayImages[view.mapImages[e][t]] !== !0) break
        }
}, view.redraw_markAll = function() {
    view.redraw_dataChanges = 1;
    for (var e = 0, t = model.map_width; t > e; e++)
        for (var n = 0, o = model.map_height; o > n; n++) view.redraw_data[e][n] = !0
}, view.redraw_markSelection = function(e) {
    var t = e.selection.centerX,
        n = e.selection.centerY,
        o = e.selection.data;
    view.redraw_markPos(t, n, o.length, o.length, view.redraw_MODE.RECTANGLE)
}, view.redraw_markPosWithNeighbours = function(e, t) {
    view.redraw_markPos(e, t, 2, 0, view.redraw_MODE.CIRCLE)
}, view.redraw_markPosWithNeighboursRing = function(e, t) {
    view.redraw_markPos(e - 1, t - 1, 3, 3, view.redraw_MODE.RECTANGLE)
}, controller.screenElement = document.getElementById("cwt_canvas"), controller.screenX = 0, controller.screenY = 0, controller.screenWidth = -1, controller.screenHeight = -1, controller.screenScale = 1, controller.moveScreenX = 0, controller.moveScreenY = 0, controller.setScreenScale = function(e) {
    if (!(1 > e || e > 3)) {
        controller.screenScale = e, controller.screenElement.className = "scale" + e;
        var t = TILE_LENGTH * e;
        controller.screenWidth = parseInt(window.innerWidth / t, 10), controller.screenHeight = parseInt(window.innerHeight / t, 10), controller.setScreenPosition(controller.screenX, controller.screenY, !1)
    }
}, controller.getMapXByScreenX = function(e) {
    return controller.screenX + parseInt(e / (TILE_LENGTH * controller.screenScale), 10)
}, controller.getMapXByScreenY = function(e) {
    return controller.screenY + parseInt(e / (TILE_LENGTH * controller.screenScale), 10)
}, controller.getCanvasPosX = function(e) {
    return e * TILE_LENGTH
}, controller.getCanvasPosY = function(e) {
    return e * TILE_LENGTH
}, controller.setScreenPosition = function(e, t) {
    controller.screenX = e, controller.screenY = t;
    var n = controller.screenElement.style,
        o = controller.screenScale,
        r = -(controller.screenX * TILE_LENGTH * o),
        a = -(controller.screenY * TILE_LENGTH * o);
    switch (o) {
        case 2:
            r += controller.screenElement.width / 2, a += controller.screenElement.height / 2;
            break;
        case 3:
            r += controller.screenElement.width, a += controller.screenElement.height
    }
    n.position = "absolute", n.left = r + "px", n.top = a + "px"
}, controller.shiftScreenPosition = function(e, t) {
    1 === arguments.length && (t = 1);
    var n = controller.screenX,
        o = controller.screenY;
    switch (e) {
        case model.move_MOVE_CODES.DOWN:
            o += t;
            break;
        case model.move_MOVE_CODES.RIGHT:
            n += t;
            break;
        case model.move_MOVE_CODES.UP:
            o -= t;
            break;
        case model.move_MOVE_CODES.LEFT:
            n -= t
    }
    0 > n && (n = 0), 0 > o && (o = 0), n >= model.map_width && (n = model.map_width - 1), o >= model.map_height && (o = model.map_height - 1), controller.setScreenPosition(n, o, !1)
}, view.resizeCanvas = function() {
    var e = controller.screenElement;
    e.width = TILE_LENGTH * model.map_width, e.height = TILE_LENGTH * model.map_height, controller.screenWidth = parseInt(window.innerWidth / TILE_LENGTH, 10), controller.screenHeight = parseInt(window.innerHeight / TILE_LENGTH, 10)
};
var TILE_LENGTH = 16;
controller.baseSize = 16, view.preventRenderUnit = null, view.canvasCtx = controller.screenElement.getContext("2d"), view.selectionRange = 2, view.colorArray = [view.COLOR_RED, view.COLOR_BLUE, view.COLOR_GREEN, view.COLOR_YELLOW], view.renderMap = function() {
    var e = TILE_LENGTH,
        t = view.canvasCtx;
    controller.screenX, controller.screenY;
    for (var n, o, r, a, i, s, l, c, u, d, m, _ = controller.mapCursorX, h = controller.mapCursorY, f = view.getSpriteStep("SELECTION"), p = view.getSpriteStep("UNIT"), g = view.getSpriteStep("UNIT_SIMPLE"), v = view.getSpriteStep("PROPERTY"), w = view.getSpriteStep("STATUS"), I = view.getSpriteStep("ANIM_TILES"), E = view.getSpriteStep("ANIM_TILES_EXT"), T = controller.baseSize, S = model.data_simpleAnimatedUnits, M = -1 !== model.client_lastPid ? model.player_data[model.client_lastPid].team : -1, y = "MOVEPATH_SELECTION" === controller.stateMachine.state || "ACTION_SELECT_TARGET_A" === controller.stateMachine.state || "ACTION_SELECT_TARGET_B" === controller.stateMachine.state || controller.attackRangeVisible, A = "ACTION_SELECT_TILE" === controller.stateMachine.state, C = controller.stateMachine.data, O = C.selection, L = model.map_height - 1, b = 0; L >= b; b++)
        for (var P = model.map_width - 1, N = 0; P >= N; N++)
            if (m = 0 === model.fog_clientData[N][b], view.redraw_data[N][b] === !0) {
                n = view.mapImages[N][b], o = view.getTileImageForType(n), r = 0, a = 0, view.animatedTiles[model.map_data[N][b].ID] && (r += 2 === model.map_data[N][b].assets.animated ? T * E : T * I), i = T, s = 2 * T, l = N * e, c = b * e - e, u = e, d = 2 * e, 0 > c && (a += T, s -= T, c += e, d -= e), void 0 !== o ? (t.drawImage(o, r, a, i, s, l, c, u, d), m && (o = view.getTileShadowImageForType(view.mapImages[N][b]), t.globalAlpha = .35, t.drawImage(o, r, a, i, s, l, c, u, d), t.globalAlpha = 1)) : (t.fillStyle = "rgb(0,0,255)", t.fillRect(l, c, e, e));
                var D = model.property_posMap[N][b];
                if (null !== D && D.type.assets.gfx) {
                    var x;
                    if (n = D.type.ID, -1 === D.owner) x = view.COLOR_NEUTRAL;
                    else if (x = view.colorArray[D.owner], D.type.factionSprites) {
                        var R = model.co_data[D.owner].coA;
                        R && (n = D.type.factionSprites[R.faction])
                    }
                    m && (x = view.COLOR_NEUTRAL), o = view.getPropertyImageForType(n, x), r = 0 + T * v, a = 0, i = T, s = 2 * T, l = N * e, c = b * e - e, u = e, d = 2 * e, 0 > c && (a += T, s -= T, c += e, d -= e), D.type.assets.gfxOffset && (r = 0 + D.type.assets.gfxOffset[0] * v, i = D.type.assets.gfxOffset[0], s = D.type.assets.gfxOffset[1], l += D.type.assets.gfxOffset[2], c += D.type.assets.gfxOffset[3], u = D.type.assets.gfxOffset[0], d = D.type.assets.gfxOffset[1]), void 0 !== o ? (t.drawImage(o, r, a, i, s, l, c, u, d), m && (o = view.getPropertyImageForType(D.type.ID, view.COLOR_BLACK_MASK), t.globalAlpha = .35, t.drawImage(o, r, a, i, s, l, c, u, d), t.globalAlpha = 1)) : (l = N * e, c = b * e, u = e, d = e, t.fillStyle = "rgb(0,255,0)", t.fillRect(l, c, u, d))
                }
                if (y) {
                    o = view.getInfoImageForType("MOVEPATH_SELECTION" === controller.stateMachine.state ? "MOVE_FOC" : "ATK_FOC");
                    var k = O.getValueAt(N, b);
                    k > 0 && (r = T * f, a = 0, i = T, s = T, l = N * e, c = b * e, u = e, d = e, t.globalAlpha = .65, t.drawImage(o, r, a, i, s, l, c, u, d), t.globalAlpha = 1)
                }
                if (A) {
                    var B = model.map_getDistance(_, h, N, b);
                    if (view.selectionRange === B) {
                        var o = null;
                        o = 0 === B ? view.getInfoImageForType("SILO_ALL") : _ === N ? h > b ? view.getInfoImageForType("SILO_N") : view.getInfoImageForType("SILO_S") : h === b ? _ > N ? view.getInfoImageForType("SILO_W") : view.getInfoImageForType("SILO_E") : _ > N ? h > b ? view.getInfoImageForType("SILO_NW") : view.getInfoImageForType("SILO_SW") : h > b ? view.getInfoImageForType("SILO_NE") : view.getInfoImageForType("SILO_SE"), l = N * e, c = b * e, null !== o && t.drawImage(o, l, c)
                    }
                }
                var G = model.unit_posData[N][b],
                    U = null !== G ? controller.getUnitStatusForUnit(G) : null;
                if (!m && null !== G && G.type.assets.gfx && (G.owner === model.round_turnOwner || model.player_data[G.owner].team == M || U.VISIBLE) && G !== view.preventRenderUnit) {
                    var x, F = S[G.type.ID] ? g : p;
                    x = -1 === G.owner ? view.COLOR_NEUTRAL : view.colorArray[G.owner];
                    var Y;
                    if (Y = G.type.cannon ? view.IMAGE_CODE_IDLE : 1 === G.owner % 2 ? view.IMAGE_CODE_IDLE : view.IMAGE_CODE_IDLE_INVERTED, o = view.getUnitImageForType(G.type.ID, Y, x), r = 2 * T * F, a = 0, i = 2 * T, s = 2 * T, l = N * e - e / 2, c = b * e - e / 2, u = e + e, d = e + e, void 0 !== o ? (t.drawImage(o, r, a, i, s, l, c, u, d), G.owner !== model.round_turnOwner || model.actions_canAct(model.unit_extractId(G)) || (t.globalAlpha = .5, t.drawImage(view.getUnitImageForType(G.type.ID, Y, view.COLOR_BLACK_MASK), r, a, i, s, l, c, u, d), t.globalAlpha = 1)) : (l = N * e, c = b * e, u = e, d = e, t.fillStyle = "rgb(255,0,0)", t.fillRect(l, c, u, d)), o = U.HP_PIC, null !== o && t.drawImage(o, l + e, c + e), 0 !== w && 1 !== w && 4 !== w && 5 !== w && 8 !== w && 9 !== w && 12 !== w && 13 !== w && 16 !== w && 17 !== w) {
                        var H = parseInt(w / 4, 10);
                        o = null;
                        var X = H;
                        do {
                            if (0 === X && U.LOW_AMMO ? o = view.getInfoImageForType("SYM_AMMO") : 1 === X && U.CAPTURES ? o = view.getInfoImageForType("SYM_CAPTURE") : 2 === X && U.LOW_FUEL ? o = view.getInfoImageForType("SYM_FUEL") : 3 === X && U.HAS_LOADS ? o = view.getInfoImageForType("SYM_LOAD") : 4 === X && G.hidden && (o = view.getInfoImageForType("SYM_HIDDEN")), null !== o) break;
                            X++, 5 === X && (X = 0)
                        } while (X !== H);
                        null !== o && t.drawImage(o, l + e / 2, c + e)
                    }
                }
                view.redraw_data[N][b] = !1
            }
    if ("MOVEPATH_SELECTION" === controller.stateMachine.state)
        for (var V, z, K, W, j = C.movePath.data, q = C.source.x, J = C.source.y, Q = 0, Z = j.length; Z > Q && -1 !== j[Q] && null !== j[Q]; Q++) {
            switch (V = q, z = J, j[Q]) {
                case model.move_MOVE_CODES.UP:
                    J--;
                    break;
                case model.move_MOVE_CODES.RIGHT:
                    q++;
                    break;
                case model.move_MOVE_CODES.DOWN:
                    J++;
                    break;
                case model.move_MOVE_CODES.LEFT:
                    q--
            }
            if (-1 === j[Q + 1] || null === j[Q + 1]) K = -1, W = -1;
            else switch (j[Q + 1]) {
                case model.move_MOVE_CODES.UP:
                    K = q, W = J - 1;
                    break;
                case model.move_MOVE_CODES.RIGHT:
                    K = q + 1, W = J;
                    break;
                case model.move_MOVE_CODES.DOWN:
                    K = q, W = J + 1;
                    break;
                case model.move_MOVE_CODES.LEFT:
                    K = q - 1, W = J
            }
            if (-1 == K) switch (j[Q]) {
                case model.move_MOVE_CODES.UP:
                    o = view.getTileImageForType("ARROW_N");
                    break;
                case model.move_MOVE_CODES.RIGHT:
                    o = view.getTileImageForType("ARROW_E");
                    break;
                case model.move_MOVE_CODES.DOWN:
                    o = view.getTileImageForType("ARROW_S");
                    break;
                case model.move_MOVE_CODES.LEFT:
                    o = view.getTileImageForType("ARROW_W")
            } else {
                var $ = Math.abs(K - V),
                    et = Math.abs(W - z);
                if (2 === $) o = view.getTileImageForType("ARROW_WE");
                else if (2 === et) o = view.getTileImageForType("ARROW_NS");
                else if (q > K && z > J || q > V && W > J) o = view.getTileImageForType("ARROW_SW");
                else if (q > K && J > z || q > V && J > W) o = view.getTileImageForType("ARROW_WN");
                else if (K > q && J > z || V > q && J > W) o = view.getTileImageForType("ARROW_NE");
                else {
                    if (!(K > q && z > J || V > q && W > J)) {
                        assert(!1, "illegal move arrow state", "old (", V, ",", z, ")", "current (", q, ",", J, ")", "next (", K, ",", W, ")", "path (", j, ")");
                        continue
                    }
                    o = view.getTileImageForType("ARROW_ES")
                }
            }
            q >= 0 && J >= 0 && q < controller.screenWidth && J < controller.screenHeight && t.drawImage(o, q * e, J * e)
        }
    t.lineWidth = 2, t.strokeStyle = "#f00", t.strokeRect(e * controller.mapCursorX + 1, e * controller.mapCursorY + 1, e - 2, e - 2), view.redraw_dataChanges = 0
}, controller.openedSection = null, controller.openSection = function(e) {
    if (null !== e) {
        var t = document.getElementById(e);
        t || model.criticalError(constants.error.CLIENT_ERROR, constants.error.CLIENT_DATA_ERROR), null !== this.openedSection && (this.openedSection.style.display = "none"), t.style.display = "", this.openedSection = t
    }
}, controller.screenStateMachine = util.stateMachine({}, {
    noHistory: !0
}), controller.screenStateMachine.data = {}, controller.storage_SIZES = {
    maps: 10,
    assets: 40,
    general: 5
}, controller.storage_NAMES = {
    maps: "MAPS",
    assets: "ASSETS",
    general: "GENERAL"
}, controller.storage_maps = null, controller.storage_assets = null, controller.storage_general = null, controller.storage_create = function(e, t, n, o) {
    var r = new Lawnchair({
        adaptor: n,
        maxSize: 1024 * 1024 * t,
        name: e
    }, function() {
        o({
            get: function(e, t) {
                r.get(e, t)
            },
            has: function(e, t) {
                r.exists(e, t)
            },
            exists: function(e, t) {
                r.exists(e, t)
            },
            set: function(e, t, n) {
                r.save({
                    key: e,
                    value: t
                }, n)
            },
            keys: function(e) {
                r.keys(e)
            },
            clear: function(e) {
                r.nuke(e)
            },
            remove: function(e, t) {
                r.remove(e, t)
            }
        })
    })
}, controller.storage_initialize = function(e, t) {
    t.take();
    var n = Browser.mobile ? "webkit-sqlite" : "indexed-db";
    jWorkflow.order(function(e, t) {
        t.take(), controller.storage_create(controller.storage_NAMES.maps, controller.storage_SIZES.maps, n, function(e) {
            controller.storage_maps = e, t.pass()
        })
    }).andThen(function(e, t) {
        t.take(), controller.storage_create(controller.storage_NAMES.assets, controller.storage_SIZES.assets, n, function(e) {
            controller.storage_assets = e, t.pass()
        })
    }).andThen(function(e, t) {
        t.take(), controller.storage_create(controller.storage_NAMES.general, controller.storage_SIZES.general, n, function(e) {
            controller.storage_general = e, t.pass()
        })
    }).start(function(e) {
        t.pass()
    })
}, controller.storage_wipeOut = function(e) {
    function t(e, t) {
        e.andThen(function(e, n) {
            n.take(), t.clear(function() {
                n.pass()
            })
        })
    }
    var n = jWorkflow.order();
    controller.storage_general && t(n, controller.storage_general), controller.storage_assets && t(n, controller.storage_assets), controller.storage_maps && t(n, controller.storage_maps), n.start(function() {
        e && e()
    })
}, controller.colorizeImages = util.singleLazyCall(function(e, t) {
    t.take();
    var n = jWorkflow.order(function() {});
    model.data_unitTypes.forEach(function(e) {
        model.data_unitSheets[e].assets.gfx && n.andThen(function() {
            view.imageProcessor_colorizeUnit(e)
        })
    }), model.data_propertyTypes.forEach(function(e) {
        model.data_tileSheets[e].assets.gfx && n.andThen(function() {
            view.imageProcessor_colorizeProperty(e)
        })
    }), model.data_tileTypes.forEach(function(e) {
        n.andThen(function() {
            view.imageProcessor_colorizeTile(e)
        })
    }), model.data_tileTypes.forEach(function(e) {
        var t = model.data_tileSheets[e];
        t.assets.gfx_variants && t.assets.gfx_variants[1].forEach(function(e) {
            n.andThen(function() {
                view.imageProcessor_colorizeTile(e[0])
            })
        })
    }), n.start(function() {
        t.pass()
    })
}), controller.cutImages = util.singleLazyCall(function(e, t) {
    t.take();
    var n = jWorkflow.order(function() {});
    model.data_unitTypes.forEach(function(e) {
        model.data_unitSheets[e].assets.gfx && n.andThen(function() {
            view.imageProcessor_cropUnitSprite(e)
        })
    }), model.data_graphics.misc.forEach(function(e) {
        n.andThen(function() {
            view.imageProcessor_cropMiscSprite(e)
        })
    }), n.start(function() {
        t.pass()
    })
}), controller.dataLoader_start = function(e, t) {
    assert(e && t), jWorkflow.order().andThen(function() {
        e.innerHTML = "Loading", t.className = "loadBar_0"
    }).andThen(controller.features_analyseClient).andThen(function() {
        t.className = "loadBar_5"
    }).andThen(function(e, t) {
        controller.features_client.supported || (t.take(), confirm("Your system isn't supported by CW:T. Try to run it?") && t.pass())
    }).andThen(function() {
        t.className = "loadBar_10"
    }).andThen(controller.storage_initialize).andThen(function() {
        t.className = "loadBar_15"
    }).andThen(function(e, t) {
        return e ? e : (t.take(), controller.storage_general.get("cwt_resetData", function(e) {
            var n = e && e.value === !0;
            n || (n = "1" === getQueryParams(document.location.search).cwt_resetData), n ? controller.storage_general.clear(function() {
                controller.storage_assets.clear(function() {
                    controller.storage_maps.clear(function() {
                        t.pass(!1)
                    })
                })
            }) : t.pass(!1)
        }), void 0)
    }).andThen(function(e, t) {
        return e ? e : (t.take(), controller.storage_general.get("cwt_forceTouch", function(e) {
            var n = e && e.value === !0;
            n || (n = "1" === getQueryParams(document.location.search).cwt_forceTouch), n && (controller.features_client.mouse = !1, controller.features_client.touch = !0, controller.screenStateMachine.structure.OPTIONS.forceTouch = !0), t.pass(!1)
        }), void 0)
    }).andThen(function() {
        t.className = "loadBar_20"
    }).andThen(controller.modification_load).andThen(function() {
        e.innerHTML = model.data_localized("loading.loadMaps"), t.className = "loadBar_30"
    }).andThen(controller.loadMaps_doIt).andThen(function() {
        e.innerHTML = model.data_localized("loading.loadImages"), t.className = "loadBar_40"
    }).andThen(controller.loadImages_doIt).andThen(function(e, t) {
        t.take();
        var n = model.data_menu.bgs[parseInt(model.data_menu.bgs.length * Math.random(), 10)];
        controller.storage_assets.get(model.data_assets.images + "/" + n, function(e) {
            e && controller.background_registerAsBackground(e.value), t.pass()
        })
    }).andThen(function() {
        e.innerHTML = model.data_localized("loading.cropImages"), t.className = "loadBar_60"
    }).andThen(controller.cutImages).andThen(function() {
        e.innerHTML = model.data_localized("loading.colorizeImages"), t.className = "loadBar_65"
    }).andThen(controller.colorizeImages).andThen(function() {
        e.innerHTML = model.data_localized("loading.loadSounds"), t.className = "loadBar_70"
    }).andThen(controller.audio_initialize).andThen(controller.loadAudio_doIt).andThen(function() {
        e.innerHTML = model.data_localized("loading.prepareInput"), t.className = "loadBar_90"
    }).andThen(controller.loadInputDevices).andThen(function() {
        e.innerHTML = model.data_localized("loading.prepareInput"), t.className = "loadBar_93"
    }).andThen(function(e, t) {
        t.take(), controller.loadKeyMapping(function() {
            t.pass()
        })
    }).andThen(function() {
        e.innerHTML = model.data_localized("loading.prepareLanguage"), t.className = "loadBar_95"
    }).andThen(function() {
        for (var e = document.querySelectorAll("[key]"), t = 0, n = e.length; n > t; t++) e[t].innerHTML = model.data_localized(e[t].attributes.key.value)
    }).andThen(function() {
        e.innerHTML = model.data_localized("loading.done"), t.className = "loadBar_100"
    }).andThen(function() {
        controller.screenStateMachine.event("complete")
    }).start(function(e) {
        e && assert(!1, "data loader failed (" + e + ")")
    })
}, controller.loadAudio_loadIt_ = function(e, t, n, o) {
    (!t || controller.features_client.audioMusic) && (controller.audio_isBuffered(e) || (n.take(), controller.storage_assets.get(e, function(r) {
        if (r) o ? controller.storage_assets.get(e, function(t) {
            assert(t.value);
            var o = Base64Helper.decodeBuffer(t.value);
            controller.audio_loadByArrayBuffer(e, o, function() {
                n.pass()
            })
        }) : n.pass();
        else {
            var a = new XMLHttpRequest;
            a.open("GET", (t ? model.data_assets.music : model.data_assets.sounds) + "/" + e, !0), a.responseType = "arraybuffer", a.onload = function() {
                if (404 === this.status) return n.pass(), void 0;
                var t = a.response,
                    r = Base64Helper.encodeBuffer(t);
                controller.storage_assets.set(e, r, function() {
                    o ? controller.audio_loadByArrayBuffer(e, t, function() {
                        n.pass()
                    }) : n.pass()
                })
            }, a.send()
        }
    })))
}, controller.loadAudio_doIt = util.singleLazyCall(function(e, t) {
    if (controller.features_client.audioSFX || controller.features_client.audioMusic) {
        var n = controller.audio_grabContext();
        if (n) {
            t.take();
            var o = jWorkflow.order(function() {});
            if (controller.features_client.audioMusic && (o.andThen(function(e, t) {
                    controller.loadAudio_loadIt_(model.data_menu.music, !0, t, !0)
                }), util.iterateListByFlow(o, model.data_fractionTypes, function(e, t) {
                    controller.loadAudio_loadIt_(model.data_fractionSheets[this.list[this.i]].music, !0, t)
                }), util.iterateListByFlow(o, model.data_coTypes, function(e, t) {
                    controller.loadAudio_loadIt_(model.data_coSheets[this.list[this.i]].music, !0, t)
                })), controller.features_client.audioSFX) {
                for (var r = Object.keys(model.data_sounds), a = [], i = 0; i < r.length; i++) a.push(model.data_sounds[r[i]]);
                util.iterateListByFlow(o, a, function(e, t) {
                    controller.loadAudio_loadIt_(this.list[this.i], !1, t, !0)
                }), util.iterateListByFlow(o, model.data_propertyTypes, function(e, t) {
                    var n = this.list[this.i],
                        o = model.data_tileSheets[n];
                    o.assets && o.assets.fireSound && controller.loadAudio_loadIt_(o.assets.fireSound, !1, t, !0)
                }), util.iterateListByFlow(o, model.data_unitTypes, function(e, t) {
                    var n = this.list[this.i],
                        o = model.data_unitSheets[n];
                    o.assets && o.assets.pri_att_sound && controller.loadAudio_loadIt_(o.assets.pri_att_sound, !1, t, !0)
                }), util.iterateListByFlow(o, model.data_unitTypes, function(e, t) {
                    var n = this.list[this.i],
                        o = model.data_unitSheets[n];
                    o.assets && o.assets.sec_att_sound && controller.loadAudio_loadIt_(o.assets.sec_att_sound, !1, t, !0)
                })
            }
            o.start(function() {
                t.pass()
            })
        }
    }
}), controller.loadImages_loadFailed_ = function() {
    var e = "could not load " + this.pickey_;
    assert(!1, e)
}, controller.loadImages_loadSuccessful_ = function() {
    var e = this.mode_,
        t = this.baton_,
        n = this.pickey_;
    switch (this.saveIt_ && controller.storage_assets.set(this.src, Base64Helper.canvasToBase64(this), controller.loadImages_pictureSaved_), delete this.pickey_, delete this.baton_, delete this.mode_, delete this.saveIt_, e) {
        case "U":
            view.setUnitImageForType(this, n, view.IMAGE_CODE_IDLE, view.COLOR_RED);
            break;
        case "P":
            view.setPropertyImageForType(this, n, view.COLOR_RED);
            break;
        case "T":
            view.setTileImageForType(this, n);
            break;
        case "M":
            view.setInfoImageForType(this, n);
            break;
        default:
            assert(!1)
    }
    t.pass()
}, controller.loadImages_pictureSaved_ = function(e) {}, controller.loadImages_prepareImg_ = function(e, t, n, o) {
    t = model.data_assets.images + "/" + t;
    var r = new Image;
    r.pickey_ = e, r.baton_ = o, r.mode_ = n, r.saveIt_ = !1, r.onerror = controller.loadImages_loadFailed_, r.onload = controller.loadImages_loadSuccessful_, o.take(), controller.storage_assets.get(t, function(e) {
        e ? controller.storage_assets.get(t, function(e) {
            r.src = "data:image/png;base64," + e.value
        }) : (r.saveIt_ = !0, r.src = t)
    })
}, controller.loadImages_doIt = util.singleLazyCall(function(e, t) {
    t.take();
    var n = jWorkflow.order(function() {});
    util.iterateListByFlow(n, model.data_unitTypes, function(e, t) {
        var n = model.data_unitSheets[this.list[this.i]];
        n.assets.gfx && controller.loadImages_prepareImg_(this.list[this.i], n.assets.gfx, "U", t)
    }), util.iterateListByFlow(n, model.data_tileTypes, function(e, t) {
        var n = this.list[this.i],
            o = model.data_tileSheets[n];
        controller.loadImages_prepareImg_(n, o.assets.gfx, "T", t), o.assets.gfxOverlay && (view.overlayImages[n] = !0), (1 === o.assets.animated || 2 === o.assets.animated) && (view.animatedTiles[n] = !0)
    }), util.iterateListByFlow(n, model.data_propertyTypes, function(e, t) {
        var n = model.data_tileSheets[this.list[this.i]];
        n.assets.gfx && controller.loadImages_prepareImg_(this.list[this.i], n.assets.gfx, "P", t)
    }), model.data_tileTypes.forEach(function(e) {
        var t = model.data_tileSheets[e];
        if (t.assets.gfx_variants) {
            var o = jWorkflow.order(function() {});
            t.assets.gfx_variants[1].forEach(function(e) {
                o.andThen(function(t, n) {
                    controller.loadImages_prepareImg_(e[0], e[0], "T", n)
                })
            }), n.andThen(o)
        }
    }), util.iterateListByFlow(n, model.data_propertyTypes, function(e, t) {
        var n = model.data_tileSheets[this.list[this.i]];
        n.assets.fireAnimation && controller.loadImages_prepareImg_(n.assets.fireAnimation[0], n.assets.fireAnimation[0], "M", t)
    }), util.iterateListByFlow(n, model.data_propertyTypes, function(e, t) {
        var n = model.data_tileSheets[this.list[this.i]];
        n.assets.streamAnimation && controller.loadImages_prepareImg_(n.assets.streamAnimation[0], n.assets.streamAnimation[0], "M", t)
    }), util.iterateListByFlow(n, model.data_propertyTypes, function(e, t) {
        var n = model.data_tileSheets[this.list[this.i]];
        n.assets.chargeAnimation && controller.loadImages_prepareImg_(n.assets.chargeAnimation[0], n.assets.chargeAnimation[0], "M", t)
    }), util.iterateListByFlow(n, model.data_propertyTypes, function(e, t) {
        var n = model.data_tileSheets[this.list[this.i]];
        n.assets.fireAnimation2 && controller.loadImages_prepareImg_(n.assets.fireAnimation2[0], n.assets.fireAnimation2[0], "M", t)
    }), util.iterateListByFlow(n, model.data_propertyTypes, function(e, t) {
        var n = model.data_tileSheets[this.list[this.i]];
        n.assets.streamAnimation2 && controller.loadImages_prepareImg_(n.assets.streamAnimation2[0], n.assets.streamAnimation2[0], "M", t)
    }), util.iterateListByFlow(n, model.data_propertyTypes, function(e, t) {
        var n = model.data_tileSheets[this.list[this.i]];
        n.assets.chargeAnimation2 && controller.loadImages_prepareImg_(n.assets.chargeAnimation2[0], n.assets.chargeAnimation2[0], "M", t)
    }), util.iterateListByFlow(n, model.data_propertyTypes, function(e, t) {
        var n = model.data_tileSheets[this.list[this.i]];
        n.assets.fireAnimation3 && controller.loadImages_prepareImg_(n.assets.fireAnimation3[0], n.assets.fireAnimation3[0], "M", t)
    }), util.iterateListByFlow(n, model.data_propertyTypes, function(e, t) {
        var n = model.data_tileSheets[this.list[this.i]];
        n.assets.streamAnimation3 && controller.loadImages_prepareImg_(n.assets.streamAnimation3[0], n.assets.streamAnimation3[0], "M", t)
    }), util.iterateListByFlow(n, model.data_propertyTypes, function(e, t) {
        var n = model.data_tileSheets[this.list[this.i]];
        n.assets.chargeAnimation3 && controller.loadImages_prepareImg_(n.assets.chargeAnimation3[0], n.assets.chargeAnimation3[0], "M", t)
    }), util.iterateListByFlow(n, model.data_propertyTypes, function(e, t) {
        var n = model.data_tileSheets[this.list[this.i]];
        n.assets.fireAnimation4 && controller.loadImages_prepareImg_(n.assets.fireAnimation4[0], n.assets.fireAnimation4[0], "M", t)
    }), util.iterateListByFlow(n, model.data_propertyTypes, function(e, t) {
        var n = model.data_tileSheets[this.list[this.i]];
        n.assets.streamAnimation4 && controller.loadImages_prepareImg_(n.assets.streamAnimation4[0], n.assets.streamAnimation4[0], "M", t)
    }), util.iterateListByFlow(n, model.data_propertyTypes, function(e, t) {
        var n = model.data_tileSheets[this.list[this.i]];
        n.assets.chargeAnimation4 && controller.loadImages_prepareImg_(n.assets.chargeAnimation4[0], n.assets.chargeAnimation4[0], "M", t)
    }), util.iterateListByFlow(n, model.data_menu.bgs, function(e, t) {
        controller.loadImages_prepareImg_(this.list[this.i], this.list[this.i], "M", t)
    }), util.iterateListByFlow(n, model.data_graphics.misc, function(e, t) {
        controller.loadImages_prepareImg_(this.list[this.i][0], this.list[this.i][1], "M", t)
    }), n.start(function(e) {
        t.pass()
    })
}), controller.loadInputDevices = util.singleLazyCall(function() {
    var e = document.getElementById("cwt_canvas"),
        t = document.getElementById("cwt_menu");
    controller.features_client.keyboard && controller.setupKeyboardControls(e, t), controller.features_client.gamePad && controller.setupGamePadControls(e, t), controller.features_client.mouse && controller.setupMouseControls(e, t), controller.features_client.touch && controller.setupTouchControls(e, t)
}), controller.loadMaps_load_ = function(e, t) {
    t.take(), controller.storage_maps.exists(e, function(n) {
        n ? t.pass() : util.grabRemoteFile({
            path: model.data_assets.maps + "/" + e,
            json: !0,
            error: function() {
                t.pass()
            },
            success: function(n) {
                controller.storage_maps.set(e, n, function() {}), t.pass()
            }
        })
    })
}, controller.loadMaps_doIt = util.singleLazyCall(function(e, t) {
    var n = jWorkflow.order(function() {
        t.take()
    });
    util.iterateListByFlow(n, model.data_maps, function(e, t) {
        controller.loadMaps_load_(this.list[this.i], t)
    }), n.start(function() {
        t.pass()
    })
}), controller.modification_load = util.singleLazyCall(function(e, t) {
    function n(e, t) {
        t.take(), util.grabRemoteFile({
            path: "http://ctomni231.github.io/cwtactics/0_3_5/mod/cwt/" + e + ".json",
            json: !0,
            error: function(e) {
                t.drop(e)
            },
            success: function(n) {
                a[e] = n, t.pass()
            }
        })
    }

    function o(e, o) {
        var r = window.navigator.language;
        r && "en" !== r ? (o.take(), util.grabRemoteFile({
            path: "http://ctomni231.github.io/cwtactics/0_3_5/mod/cwt//language_" + r + ".json",
            json: !0,
            error: function() {
                util.grabRemoteFile({
                    path: "http://ctomni231.github.io/cwtactics/0_3_5/mod/cwt//language.json",
                    json: !0,
                    error: function(e) {
                        t.drop({
                            message: e,
                            stack: null
                        })
                    },
                    success: function(e) {
                        a.language = e, o.pass()
                    }
                })
            },
            success: function(e) {
                a.language = e, o.pass()
            }
        })) : n("language", o)
    }
    var r = "modification_data";
    t.take();
    var a;
    jWorkflow.order().andThen(function(e, t) {
        t.take(), controller.storage_general.get(r, function(e) {
            e ? (a = e.value, t.pass(!1)) : (a = {}, t.pass(!0))
        })
    }).andThen(function(e, t) {
        return e ? (t.take(), jWorkflow.order().andThen(function(e, t) {
            n("header", t)
        }).andThen(function(e, t) {
            n("co", t)
        }).andThen(function(e, t) {
            n("fraction", t)
        }).andThen(function(e, t) {
            n("gamemode", t)
        }).andThen(function(e, t) {
            n("maps", t)
        }).andThen(function(e, t) {
            n("movetypes", t)
        }).andThen(function(e, t) {
            n("globalrules", t)
        }).andThen(function(e, t) {
            n("sounds", t)
        }).andThen(function(e, t) {
            n("menu", t)
        }).andThen(function(e, t) {
            n("tiles", t)
        }).andThen(function(e, t) {
            n("units", t)
        }).andThen(function(e, t) {
            n("weathers", t)
        }).andThen(function(e, t) {
            n("assets", t)
        }).andThen(function(e, t) {
            n("graphics", t)
        }).andThen(function(e, t) {
            n("tips", t)
        }).andThen(o).start(function(e) {
            e ? t.drop(e) : t.pass(!0)
        }), void 0) : !1
    }).andThen(function(e, t) {
        e && (t.take(), controller.storage_general.set(r, a, function() {
            t.pass()
        }))
    }).andThen(function() {
        model.modification_load(a)
    }).start(function(e) {
        e ? t.drop(e) : t.pass()
    })
}), util.scoped(function() {
    var e, t = [],
        n = [];
    controller.setupGamePadControls = function() {
        var n = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;
        n && (e = !0, t = navigator.webkitGetGamepads())
    }, controller.updateGamePadControls = function() {
        if (e)
            for (var o = 0, r = 4; r > o; o++) {
                var a = t[o];
                if (a && (!n[o] || a.timestamp != n[o]))
                    if (n[o] = a.timestamp, null !== controller.activeMapping && controller.activeMapping === controller.KEY_MAPPINGS.GAMEPAD) {
                        var i = -1;
                        1 === a.buttons[0] ? i = 0 : 1 === a.buttons[1] ? i = 1 : 1 === a.buttons[2] ? i = 2 : 1 === a.buttons[3] ? i = 3 : 1 === a.buttons[4] ? i = 4 : 1 === a.buttons[5] ? i = 5 : 1 === a.buttons[6] ? i = 6 : 1 === a.buttons[7] ? i = 7 : 1 === a.buttons[8] ? i = 8 : 1 === a.buttons[9] ? i = 9 : 1 === a.buttons[10] ? i = 10 : 1 === a.buttons[11] ? i = 11 : 1 === a.buttons[12] ? i = 12 : 1 === a.buttons[13] && (i = 13), i > -1 && controller.screenStateMachine.event("INPUT_SET", i)
                    } else {
                        var s = controller.keyMaps.GAMEPAD,
                            l = null;
                        a.axes[1] < -.5 ? l = "INP_UP" : a.axes[1] > .5 && (l = "INP_DOWN"), a.axes[0] < -.5 ? l = "INP_LEFT" : a.axes[0] > .5 && (l = "INP_RIGHT"), 1 === a.buttons[s.ACTION] ? l = "INP_ACTION" : 1 === a.buttons[s.CANCEL] && (l = "INP_CANCEL"), l && controller.screenStateMachine.event(l, 1)
                    }
            }
    }
}), util.scoped(function() {
    controller.setupKeyboardControls = function() {
        document.onkeydown = function(e) {
            if (null !== controller.activeMapping && controller.activeMapping === controller.KEY_MAPPINGS.KEYBOARD) controller.screenStateMachine.event("INPUT_SET", e.keyCode);
            else {
                var t = controller.keyMaps.KEYBOARD;
                switch (e.keyCode) {
                    case t.LEFT:
                        return controller.screenStateMachine.event("INP_LEFT", 1), !1;
                    case t.UP:
                        return controller.screenStateMachine.event("INP_UP", 1), !1;
                    case t.RIGHT:
                        return controller.screenStateMachine.event("INP_RIGHT", 1), !1;
                    case t.DOWN:
                        return controller.screenStateMachine.event("INP_DOWN", 1), !1;
                    case t.CANCEL:
                        return controller.screenStateMachine.event("INP_CANCEL"), !1;
                    case t.ACTION:
                        return controller.screenStateMachine.event("INP_ACTION"), !1
                }
            }
            return !1
        }
    }
}), controller.setupMouseControls = function() {
    controller.screenElement.addEventListener("mousemove", function(e) {
        e.target.id;
        var t, n;
        e = e || window.event, "number" == typeof e.offsetX ? (t = e.offsetX, n = e.offsetY) : (t = e.layerX, n = e.layerY), t = parseInt(t / TILE_LENGTH, 10), n = parseInt(n / TILE_LENGTH, 10), controller.screenStateMachine.event("INP_HOVER", t, n)
    }), controller.screenElement.onmouseup = function(e) {
        if (controller.menuVisible) return controller.screenStateMachine.event("INP_CANCEL"), void 0;
        switch (e = e || window.event, e.which) {
            case 1:
                controller.screenStateMachine.event("INP_ACTION");
                break;
            case 2:
                break;
            case 3:
                controller.screenStateMachine.event("INP_CANCEL")
        }
    }
}, controller.setupTouchControls = function() {
    util.scoped(function() {
        function e(e, t, n) {
            t = controller.getMapXByScreenX(t), n = controller.getMapXByScreenY(n);
            var o = "MOVEPATH_SELECTION" === controller.stateMachine.state || "ACTION_SELECT_TARGET_A" === controller.stateMachine.state || "ACTION_SELECT_TARGET_B" === controller.stateMachine.state || controller.attackRangeVisible;
            controller.menuVisible ? "cwt_menu" === e.target.id ? controller.screenStateMachine.event("INP_ACTION") : controller.screenStateMachine.event("INP_CANCEL") : o ? controller.stateMachine.data.selection.getValueAt(t, n) > 0 ? controller.screenStateMachine.event("INP_ACTION", t, n) : controller.screenStateMachine.event("INP_CANCEL", t, n) : controller.screenStateMachine.event("INP_ACTION", t, n)
        }

        function t() {
            controller.screenStateMachine.event("INP_CANCEL")
        }

        function n(e, t, n) {
            "GAME_ROUND" === controller.screenStateMachine.state ? (1 === t && controller.screenStateMachine.event("SHIFT_RIGHT", 10), -1 === t && controller.screenStateMachine.event("SHIFT_LEFT", 10), 1 === n && controller.screenStateMachine.event("SHIFT_DOWN", 10), -1 === n && controller.screenStateMachine.event("SHIFT_UP", 10)) : (1 === t && controller.screenStateMachine.event("INP_RIGHT", 1), -1 === t && controller.screenStateMachine.event("INP_LEFT", 1), 1 === n && controller.screenStateMachine.event("INP_DOWN", 1), -1 === n && controller.screenStateMachine.event("INP_UP", 1))
        }

        function o(e, t, n) {
            1 === t && controller.screenStateMachine.event("INP_RIGHT", 1), -1 === t && controller.screenStateMachine.event("INP_LEFT", 1), 1 === n && controller.screenStateMachine.event("INP_DOWN", 1), -1 === n && controller.screenStateMachine.event("INP_UP", 1), controller.menuVisible && ("cwt_menu" === e.target.id || controller.screenStateMachine.event("INP_CANCEL"))
        }

        function r(e, t) {
            0 > t ? controller.setScreenScale(controller.screenScale - 1) : controller.setScreenScale(controller.screenScale + 1)
        }
        var a, i, s, l, c, u, d, m, _, h, f, p = 0,
            g = !1;
        controller.screenElement.addEventListener("touchstart", function(e) {
            if (e.preventDefault(), a = e.touches[0].clientX, i = e.touches[0].clientY, s = a, l = i, g = !1, 2 === e.touches.length) {
                c = e.touches[1].clientX, u = e.touches[1].clientY, d = c, m = u;
                var t = Math.abs(a - c),
                    n = Math.abs(i - u);
                h = Math.sqrt(t * t + n * n)
            } else c = -1;
            _ = e.timeStamp
        }, !1), controller.screenElement.addEventListener("touchmove", function(e) {
            e.preventDefault();
            var t, n;
            s = e.touches[0].clientX, l = e.touches[0].clientY, 2 === e.touches.length ? (d = e.touches[1].clientX, m = e.touches[1].clientY, t = Math.abs(s - d), n = Math.abs(l - m), f = Math.sqrt(t * t + n * n)) : c = -1, t = Math.abs(a - s), n = Math.abs(i - l);
            var r = Math.sqrt(t * t + n * n),
                u = e.timeStamp - _;
            r > 16 && u > 300 && (g = !0, p > 75 ? (t > n ? o(e, a > s ? -1 : 1, 0) : o(e, 0, i > l ? -1 : 1), p = 0, a = s, i = l) : p += u)
        }, !1), controller.screenElement.addEventListener("touchend", function(o) {
            if (o.preventDefault(), !(controller.inputCoolDown > 0)) {
                var u = Math.abs(a - s),
                    d = Math.abs(i - l),
                    m = Math.sqrt(u * u + d * d),
                    p = o.timeStamp - _; - 1 !== c ? (Math.abs(f - h) <= 32 ? t(o, s, l) : r(o, h > f ? 1 : -1), controller.inputCoolDown = 500) : 16 >= m ? 500 >= p && e(o, s, l) : 300 >= p && (u > d ? n(o, a > s ? -1 : 1, 0) : n(o, 0, i > l ? -1 : 1))
            }
        }, !1)
    })
}, util.scoped(function() {
    var e = util.matrix(61, 61, 0);
    controller.attackRangeVisible = !1, controller.showAttackRangeInfo = function() {
        if (!controller.attackRangeVisible) {
            var t = controller.mapCursorX,
                n = controller.mapCursorY,
                o = model.unit_posData[t][n];
            if (null !== o) {
                var r = model.unit_extractId(o),
                    a = controller.stateMachine.data.selection;
                if (a.setCenter(t, n, -1), model.battle_isIndirectUnit(r)) model.battle_calculateTargets(r, t, n, a);
                else {
                    controller.stateMachine.data.movePath.move_fillMoveMap(t, n, o), a.data.cloneValues(e), a.setCenter(t, n, -1);
                    for (var i = e.length, s = 0; i > s; s++)
                        for (var l = 0; i > l; l++) e[s][l] >= 0 && model.battle_calculateTargets(r, s, l, a, !0)
                }
                controller.attackRangeVisible = !0
            }
        }
    }, controller.hideAttackRangeInfo = function() {
        controller.attackRangeVisible && (view.redraw_markSelection(controller.stateMachine.data), controller.attackRangeVisible = !1)
    }
}), controller.registerMenuRenderer("buildUnit", function(e, t, n, o) {
    var r = model.data_unitSheets[e].cost;
    t.innerHTML = o ? model.data_localized(e) + " (" + r + "$)" : "<span style='color:red;'>" + model.data_localized(e) + " (" + r + "$) </span>"
}), util.scoped(function() {
    var e = document.getElementById("cwt_game_infoBar"),
        t = document.getElementById("infoBox_unitRow1"),
        n = document.getElementById("infoBox_unitRow2"),
        o = document.getElementById("infoBox_unitRow3"),
        r = document.getElementById("infoBox_name"),
        a = document.getElementById("infoBox_hp"),
        i = document.getElementById("infoBox_fuel"),
        s = document.getElementById("infoBox_ammo"),
        l = document.getElementById("infoBox_fuel2"),
        c = document.getElementById("infoBox_ammo2"),
        u = document.getElementById("infoBox_attrange"),
        d = document.getElementById("infoBox_attrange2"),
        m = document.getElementById("infoBox_hp_d"),
        _ = document.getElementById("infoBox_pr_hp_d"),
        h = document.getElementById("infoBox_fuel_d"),
        f = document.getElementById("infoBox_ammo_d"),
        p = document.getElementById("infoBox_attrange_d"),
        g = document.getElementById("infoBox_playerName"),
        v = document.getElementById("infoBox_playerpower"),
        w = document.getElementById("infoBox_playergold");
    document.getElementById("infoBox_tileRow1"), document.getElementById("infoBox_tileRow2");
    var I = document.getElementById("infoBox_tileRow2d2"),
        E = document.getElementById("infoBox_tilename"),
        T = document.getElementById("infoBox_defense_d"),
        S = document.getElementById("infoBox_defense"),
        M = document.getElementById("infoBox_capPt_d"),
        y = document.getElementById("infoBox_capPt"),
        A = document.getElementById("infoBox_capPt2"),
        C = !1,
        O = !0;
    controller.sideSimpleTileInformationPanel = -1, controller.moveSimpleTileInformationToLeft = function() {
        controller.sideSimpleTileInformationPanel < 0 || (e.style.left = "4px", e.style.right = "", controller.sideSimpleTileInformationPanel = -1)
    }, controller.moveSimpleTileInformationToRight = function() {
        controller.sideSimpleTileInformationPanel > 0 || (e.style.right = "4px", e.style.left = "", controller.sideSimpleTileInformationPanel = 1)
    }, controller.updateSimpleTileInformation = function() {
        var e, L = controller.mapCursorX,
            b = controller.mapCursorY,
            P = model.unit_posData[L][b],
            N = model.property_posMap[L][b];
        if (C || (m.getContext("2d").drawImage(view.getInfoImageForType("SYM_HP"), 0, 0), _.getContext("2d").drawImage(view.getInfoImageForType("SYM_HP"), 0, 0), h.getContext("2d").drawImage(view.getInfoImageForType("SYM_FUEL"), 0, 0), f.getContext("2d").drawImage(view.getInfoImageForType("SYM_AMMO"), 0, 0), p.getContext("2d").drawImage(view.getInfoImageForType("SYM_ATT"), 0, 0), T.getContext("2d").drawImage(view.getInfoImageForType("SYM_DEFENSE"), 0, 0), M.getContext("2d").drawImage(view.getInfoImageForType("SYM_CAPTURE"), 0, 0), C = !0), P) {
            e = P.type, r.innerHTML = model.data_localized(e.ID), a.innerHTML = P.hp, i.innerHTML = P.fuel, l.innerHTML = e.fuel, s.innerHTML = P.ammo, c.innerHTML = e.ammo;
            var D = e.attack;
            D ? (u.innerHTML = D.minrange || 1, d.innerHTML = D.maxrange || 1) : (u.innerHTML = "", d.innerHTML = ""), r.style.opacity = 1, t.style.opacity = 1, n.style.opacity = 1, o.style.opacity = 1
        } else r.style.opacity = 0, t.style.opacity = 0, n.style.opacity = 0, o.style.opacity = 0;
        N ? (e = N.type, E.innerHTML = model.data_localized(e.ID), y.innerHTML = N.capturePoints, N.capturePoints < 0 ? O || (_.style.display = "none", M.style.display = "", O = !0) : O && (_.style.display = "", M.style.display = "none", O = !1), A.innerHTML = 20, S.innerHTML = e.defense, I.style.opacity = 1) : (e = model.map_data[L][b], E.innerHTML = model.data_localized(e.ID), S.innerHTML = e.defense, I.style.opacity = 0), e = null;
        var x = -1;
        x = P ? P.owner : N && -1 !== N.owner ? N.owner : model.round_turnOwner, x > -1 ? (e = model.player_data[x], g.innerHTML = e.name, w.innerHTML = e.gold, v.innerHTML = model.co_data[x].power) : (g.innerHTML = "", w.innerHTML = "", v.innerHTML = "")
    }
}), controller.updateComplexTileInformation = function() {}, controller.registerMenuRenderer("__mainMenu__", function(e, t) {
    t.innerHTML = model.data_localized(e)
}), controller.registerMenuRenderer("team_transferMoney", function(e, t) {
    t.innerHTML = e + "$"
}), util.scoped(function() {
    var e = function(e, t) {
        t.innerHTML = model.player_data[e].name
    };
    controller.registerMenuRenderer("transferProperty", e), controller.registerMenuRenderer("transferUnit", e)
}), controller.registerMenuRenderer("unloadUnit", function(e, t) {
    t.innerHTML = "done" === e ? model.data_localized("done") : model.data_localized(model.unit_data[e].type.ID)
}), util.scoped(function() {
    function e(e, t, o, r) {
        if (o -= r - 1, !(0 > o || o > 9)) {
            var a = TILE_LENGTH,
                i = 48 * o,
                s = 0,
                l = 48,
                c = 48,
                u = e * a,
                d = t * a,
                m = a,
                _ = a;
            view.canvasCtx.drawImage(n, i, s, l, c, u, d, m, _), view.redraw_markPos(e, t)
        }
    }

    function t(e, t) {
        if (model.map_isValidPosition(e, t)) {
            var n = model.unit_posData[e][t];
            null !== n && controller.updateUnitStatus(model.unit_extractId(n))
        }
    }
    var n, o, r;
    view.registerAnimationHook({
        key: "rocketFly",
        prepare: function(e, t, n, a) {
            o || (o = view.getInfoImageForType("FLYING_ROCKET")), r || (r = view.getInfoImageForType("FLYING_ROCKET_INV")), this.siloX = controller.getCanvasPosX(e), this.siloY = controller.getCanvasPosY(t), this.targetX = controller.getCanvasPosX(n), this.targetY = controller.getCanvasPosY(a), this.curX = this.siloX, this.curY = this.siloY, this.phase = 0
        },
        render: function() {
            var e = TILE_LENGTH,
                t = 0,
                n = 0,
                a = 24,
                i = 24,
                s = this.curX,
                l = this.curY,
                c = e + 8,
                u = e + 8;
            view.canvasCtx.drawImage(0 === this.phase ? o : r, t, n, a, i, s, l, c, u), view.redraw_markPosWithNeighboursRing(parseInt(this.curX / TILE_LENGTH, 10), parseInt(this.curY / TILE_LENGTH, 10))
        },
        update: function(e) {
            var t = e / 1e3 * 14 * TILE_LENGTH;
            0 === this.phase ? (this.curY -= t, this.curY <= 0 && (this.curX = this.targetX, this.curY = 0, this.phase = 1)) : (this.curY += t, this.curY >= this.targetY && (this.phase = 2))
        },
        isDone: function() {
            return 2 === this.phase
        }
    }), view.registerAnimationHook({
        key: "explode_invoked",
        prepare: function(e, t, o) {
            n || (n = view.getInfoImageForType("EXPLOSION_GROUND")), controller.audio_playSound("ROCKET_IMPACT"), this.x = e, this.y = t, this.range = o, this.maxStep = 10 + o + 1, this.step = 0, this.time = 0
        },
        render: function() {
            model.map_doInRange(this.x, this.y, this.range, e, this.step)
        },
        update: function(e) {
            this.time += e, this.time > 75 && (this.step++, this.time = 0)
        },
        isDone: function() {
            var e = this.step === this.maxStep;
            return e && model.map_doInRange(this.x, this.y, this.range, t), e
        }
    }), view.registerAnimationHook({
        key: "bombs_fireCannon",
        prepare: function(e, t, n, o, r) {
            var a = model.data_tileSheets[r],
                i = a.assets.fireAnimation;
            assert(5 === i.length), this.pic = view.getInfoImageForType(i[0]), this.sizeX = i[1], this.sizeY = i[2], this.offsetX = i[3], this.offsetY = i[4], this.curX = e, this.curY = t, this.step = 0, this.time = 0, controller.audio_playSound(a.assets.fireSound)
        },
        render: function() {
            var e = TILE_LENGTH,
                t = this.sizeX * this.step,
                n = 0,
                o = this.sizeX,
                r = this.sizeY,
                a = this.curX * e + this.offsetX,
                i = this.curY * e + this.offsetY,
                s = this.sizeX,
                l = this.sizeY;
            view.canvasCtx.drawImage(this.pic, t, n, o, r, a, i, s, l)
        },
        update: function(e) {
            this.time += e, this.time > 100 && (this.step++, this.time = 0)
        },
        isDone: function() {
            return 6 === this.step
        }
    }), view.registerAnimationHook({
        key: "bombs_fireLaser",
        prepare: function(e, t) {
            var n = model.property_posMap[e][t].type,
                o = n.assets.chargeAnimation,
                r = n.assets.fireAnimation,
                a = n.assets.streamAnimation;
            assert(5 === o.length), assert(5 === r.length), assert(5 === a.length), this.a = {
                pic: view.getInfoImageForType(o[0]),
                sizeX: r[1],
                sizeY: r[2],
                offsetX: r[3],
                offsetY: r[4]
            }, this.b = {
                pic: view.getInfoImageForType(r[0]),
                sizeX: o[1],
                sizeY: o[2],
                offsetX: o[3],
                offsetY: o[4]
            }, this.c = {
                pic: view.getInfoImageForType(a[0]),
                sizeX: a[1],
                sizeY: a[2],
                offsetX: a[3],
                offsetY: a[4]
            }, o = n.assets.chargeAnimation3, r = n.assets.fireAnimation3, a = n.assets.streamAnimation3, assert(5 === o.length), assert(5 === r.length), assert(5 === a.length), this.a2 = {
                pic: view.getInfoImageForType(o[0]),
                sizeX: r[1],
                sizeY: r[2],
                offsetX: r[3],
                offsetY: r[4]
            }, this.b2 = {
                pic: view.getInfoImageForType(r[0]),
                sizeX: o[1],
                sizeY: o[2],
                offsetX: o[3],
                offsetY: o[4]
            }, this.c2 = {
                pic: view.getInfoImageForType(a[0]),
                sizeX: a[1],
                sizeY: a[2],
                offsetX: a[3],
                offsetY: a[4]
            }, o = n.assets.chargeAnimation2, r = n.assets.fireAnimation2, a = n.assets.streamAnimation2, assert(5 === o.length), assert(5 === r.length), assert(5 === a.length), this.a3 = {
                pic: view.getInfoImageForType(o[0]),
                sizeX: r[1],
                sizeY: r[2],
                offsetX: r[3],
                offsetY: r[4]
            }, this.b3 = {
                pic: view.getInfoImageForType(r[0]),
                sizeX: o[1],
                sizeY: o[2],
                offsetX: o[3],
                offsetY: o[4]
            }, this.c3 = {
                pic: view.getInfoImageForType(a[0]),
                sizeX: a[1],
                sizeY: a[2],
                offsetX: a[3],
                offsetY: a[4]
            }, o = n.assets.chargeAnimation4, r = n.assets.fireAnimation4, a = n.assets.streamAnimation4, assert(5 === o.length), assert(5 === r.length), assert(5 === a.length), this.a4 = {
                pic: view.getInfoImageForType(o[0]),
                sizeX: r[1],
                sizeY: r[2],
                offsetX: r[3],
                offsetY: r[4]
            }, this.b4 = {
                pic: view.getInfoImageForType(r[0]),
                sizeX: o[1],
                sizeY: o[2],
                offsetX: o[3],
                offsetY: o[4]
            }, this.c4 = {
                pic: view.getInfoImageForType(a[0]),
                sizeX: a[1],
                sizeY: a[2],
                offsetX: a[3],
                offsetY: a[4]
            }, this.curX = e, this.curY = t, this.phase = 0, this.step = 0, this.time = 0, controller.audio_playSound(n.assets.fireSound)
        },
        render: function() {
            var e = 0 === this.phase ? this.a : this.b,
                t = 0 === this.phase ? this.a2 : this.b2,
                n = 0 === this.phase ? this.a3 : this.b3,
                o = 0 === this.phase ? this.a4 : this.b4,
                r = TILE_LENGTH,
                a = e.sizeX * this.step,
                i = 0,
                s = e.sizeX,
                l = e.sizeY,
                c = this.curX * r + e.offsetX,
                u = this.curY * r + e.offsetY,
                d = e.sizeX,
                m = e.sizeY;
            if (view.canvasCtx.drawImage(e.pic, a, i, s, l, c, u, d, m), r = TILE_LENGTH, a = t.sizeX * this.step, i = 0, s = t.sizeX, l = t.sizeY, c = this.curX * r + t.offsetX, u = this.curY * r + t.offsetY, d = t.sizeX, m = t.sizeY, view.canvasCtx.drawImage(t.pic, a, i, s, l, c, u, d, m), r = TILE_LENGTH, a = n.sizeX * this.step, i = 0, s = n.sizeX, l = n.sizeY, c = this.curX * r + n.offsetX, u = this.curY * r + n.offsetY, d = n.sizeX, m = n.sizeY, view.canvasCtx.drawImage(n.pic, a, i, s, l, c, u, d, m), r = TILE_LENGTH, a = o.sizeX * this.step, i = 0, s = o.sizeX, l = o.sizeY, c = this.curX * r + o.offsetX, u = this.curY * r + o.offsetY, d = o.sizeX, m = o.sizeY, view.canvasCtx.drawImage(o.pic, a, i, s, l, c, u, d, m), view.redraw_markPosWithNeighboursRing(this.curX, this.curY), e === this.b) {
                e = this.c, t = this.c2, n = this.c3, o = this.c4, a = e.sizeX * this.step, i = 0, s = e.sizeX, l = e.sizeY;
                for (var _ = this.curX + 1, h = model.map_width; h > _; _++) c = _ * r + e.offsetX, u = this.curY * r + e.offsetY, d = e.sizeX, m = e.sizeY, view.canvasCtx.drawImage(e.pic, a, i, s, l, c, u, d, m), view.redraw_markPos(_, this.curY - 1), view.redraw_markPos(_, this.curY), view.redraw_markPos(_, this.curY + 1);
                a = t.sizeX * this.step, i = 0, s = t.sizeX, l = t.sizeY;
                for (var _ = this.curX - 1, h = 0; _ >= h; _--) c = _ * r + t.offsetX, u = this.curY * r + t.offsetY, d = t.sizeX, m = t.sizeY, view.canvasCtx.drawImage(t.pic, a, i, s, l, c, u, d, m), view.redraw_markPos(_, this.curY - 1), view.redraw_markPos(_, this.curY), view.redraw_markPos(_, this.curY + 1);
                a = n.sizeX * this.step, i = 0, s = n.sizeX, l = n.sizeY;
                for (var _ = this.curY + 1, h = model.map_height; h > _; _++) c = this.curX * r + n.offsetX, u = _ * r + n.offsetY, d = n.sizeX, m = n.sizeY, view.canvasCtx.drawImage(n.pic, a, i, s, l, c, u, d, m), view.redraw_markPos(this.curX + 1, _), view.redraw_markPos(this.curX, _), view.redraw_markPos(this.curX - 1, _);
                a = o.sizeX * this.step, i = 0, s = o.sizeX, l = o.sizeY;
                for (var _ = this.curY - 1, h = 0; _ >= 0; _--) c = this.curX * r + o.offsetX, u = _ * r + o.offsetY, d = o.sizeX, m = o.sizeY, view.canvasCtx.drawImage(o.pic, a, i, s, l, c, u, d, m), view.redraw_markPos(this.curX + 1, _), view.redraw_markPos(this.curX, _), view.redraw_markPos(this.curX - 1, _)
            }
        },
        update: function(e) {
            if (this.time += e, this.time > 100) switch (this.step++, this.time = 0, this.phase) {
                case 0:
                    10 === this.step && (this.step = 0, this.phase++);
                case 1:
                    12 === this.step && (this.step = 0, this.phase++)
            }
        },
        isDone: function() {
            return 2 === this.phase
        }
    })
}), view.registerAnimationHook({
    key: "property_capture",
    prepare: function(e, t) {
        var n = model.property_data[t];
        controller.updateUnitStatus(e), 20 === n.capturePoints ? view.showInfoMessage(model.data_localized("propertyCaptured")) : view.showInfoMessage(model.data_localized("propertyPointsLeft") + " " + n.capturePoints)
    },
    render: function() {},
    update: function() {},
    isDone: function() {
        return !view.hasInfoMessage()
    }
}), view.registerAnimationHook({
    key: "weather_change",
    prepare: function(e) {
        view.showInfoMessage(model.data_localized("weatherChange") + " " + model.data_localized(e))
    },
    render: function() {},
    update: function() {},
    isDone: function() {
        return !view.hasInfoMessage()
    }
}), view.registerAnimationHook({
    key: "destroyUnit",
    prepare: function(e) {
        var t = model.unit_data[e];
        this.step = 0, this.time = 0, this.x = -t.x, this.y = -t.y, controller.audio_playSound("EXPLODE")
    },
    render: function() {
        var e = this.step,
            t = view.getInfoImageForType("EXPLOSION_GROUND"),
            n = this.x,
            o = this.y,
            r = TILE_LENGTH,
            a = 48 * e,
            i = 0,
            s = 48,
            l = 48,
            c = n * r,
            u = o * r,
            d = r,
            m = r;
        view.canvasCtx.drawImage(t, a, i, s, l, c, u, d, m), view.redraw_markPos(n, o)
    },
    update: function(e) {
        this.time += e, this.time > 75 && (this.step++, this.time = 0)
    },
    isDone: function() {
        return 10 === this.step
    }
}), model.event_on("modifyVisionAt", function(e, t, n, o) {
    o = 10;
    var r, a, i = t - o,
        s = t + o;
    for (0 > i && (i = 0), s >= model.map_height && (s = model.map_height - 1); s >= i; i++) {
        var l = Math.abs(i - t);
        for (r = e - o + l, a = e + o - l, 0 > r && (r = 0), a >= model.map_width && (a = model.map_width - 1); a >= r; r++) {
            view.redraw_markPos(r, i);
            var c = model.unit_posData[r][i];
            null !== c && c.hidden && controller.updateUnitStatus(model.unit_extractId(c))
        }
    }
}), model.event_on("recalculateFogMap", function() {
    view.redraw_markAll()
}), view.registerAnimationHook({
    key: "move_moveByCache",
    prepare: function(e, t, n) {
        this.moveAnimationX = t, this.moveAnimationY = n, this.moveAnimationIndex = 0, this.moveAnimationPath = model.move_pathCache, this.moveAnimationUid = e, this.moveAnimationClientOwned = model.fog_visibleClientPids[model.unit_data[e].owner], this.moveAnimationShift = 0, this.moveAnimationDustX = -1, this.moveAnimationDustY = -1, this.moveAnimationDustTime = -1, this.moveAnimationDustStep = -1, this.moveAnimationDustPic = null, view.preventRenderUnit = model.unit_data[e], model.unit_data[e].type.movetype
    },
    update: function(e) {
        var t = TILE_LENGTH;
        if (this.moveAnimationShift += e / 1e3 * 8 * t, view.redraw_markPosWithNeighboursRing(this.moveAnimationX, this.moveAnimationY), -1 !== this.moveAnimationDustStep && (this.moveAnimationDustTime += e, this.moveAnimationDustTime > 30 && (this.moveAnimationDustStep++, this.moveAnimationDustTime = 0, 3 === this.moveAnimationDustStep && (this.moveAnimationDustStep = -1))), this.moveAnimationShift > t) {
            switch (this.moveAnimationDustX = this.moveAnimationX, this.moveAnimationDustY = this.moveAnimationY, this.moveAnimationDustTime = 0, this.moveAnimationDustStep = 0, this.moveAnimationPath[this.moveAnimationIndex]) {
                case model.move_MOVE_CODES.UP:
                    this.moveAnimationY--, this.moveAnimationDustPic = view.getInfoImageForType("DUST_U");
                    break;
                case model.move_MOVE_CODES.RIGHT:
                    this.moveAnimationX++, this.moveAnimationDustPic = view.getInfoImageForType("DUST_R");
                    break;
                case model.move_MOVE_CODES.DOWN:
                    this.moveAnimationY++, this.moveAnimationDustPic = view.getInfoImageForType("DUST_D");
                    break;
                case model.move_MOVE_CODES.LEFT:
                    this.moveAnimationX--, this.moveAnimationDustPic = view.getInfoImageForType("DUST_L")
            }
            this.moveAnimationIndex++, this.moveAnimationShift -= t, (this.moveAnimationIndex === this.moveAnimationPath.length || -1 === this.moveAnimationPath[this.moveAnimationIndex]) && (this.moveAnimationX = 0, this.moveAnimationY = 0, this.moveAnimationIndex = 0, this.moveAnimationPath = null, this.moveAnimationUid = -1, this.moveAnimationShift = 0, view.preventRenderUnit = null)
        }
    },
    render: function() {
        var e, t = this.moveAnimationUid,
            n = this.moveAnimationX,
            o = this.moveAnimationY,
            r = this.moveAnimationShift,
            a = this.moveAnimationPath[this.moveAnimationIndex],
            i = model.unit_data[t],
            s = view.colorArray[i.owner],
            l = i.type;
        if (this.moveAnimationClientOwned || model.fog_clientData[n][o]) {
            switch (a) {
                case model.move_MOVE_CODES.UP:
                    e = view.IMAGE_CODE_UP;
                    break;
                case model.move_MOVE_CODES.RIGHT:
                    e = view.IMAGE_CODE_RIGHT;
                    break;
                case model.move_MOVE_CODES.DOWN:
                    e = view.IMAGE_CODE_DOWN;
                    break;
                case model.move_MOVE_CODES.LEFT:
                    e = view.IMAGE_CODE_LEFT
            }
            var c = view.getUnitImageForType(l.ID, e, s),
                u = TILE_LENGTH,
                d = controller.baseSize,
                m = 2 * d * view.getSpriteStep("UNIT"),
                _ = 0,
                h = 2 * d,
                f = 2 * d,
                p = n * u - u / 2,
                g = o * u - u / 2,
                v = u + u,
                w = u + u;
            switch (a) {
                case model.move_MOVE_CODES.UP:
                    g -= r;
                    break;
                case model.move_MOVE_CODES.LEFT:
                    p -= r;
                    break;
                case model.move_MOVE_CODES.RIGHT:
                    p += r;
                    break;
                case model.move_MOVE_CODES.DOWN:
                    g += r
            }
            if (void 0 !== c) view.canvasCtx.drawImage(c, m, _, h, f, p, g, v, v);
            else {
                switch (p = n * u, g = o * u, v = u, w = u, a) {
                    case model.move_MOVE_CODES.UP:
                        g -= r;
                        break;
                    case model.move_MOVE_CODES.LEFT:
                        p -= r;
                        break;
                    case model.move_MOVE_CODES.RIGHT:
                        p += r;
                        break;
                    case model.move_MOVE_CODES.DOWN:
                        g += r
                }
                view.canvasCtx.fillStyle = "rgb(255,0,0)", view.canvasCtx.fillRect(p, g, v, w)
            }
            if (-1 !== this.moveAnimationDustStep) {
                var u = TILE_LENGTH;
                m = 2 * d * this.moveAnimationDustStep, _ = 0, h = 2 * d, f = 2 * d, p = this.moveAnimationDustX * u - u / 2, g = this.moveAnimationDustY * u - u / 2, v = u + u, w = u + u, view.canvasCtx.drawImage(this.moveAnimationDustPic, m, _, h, f, p, g, v, w)
            }
        }
    },
    isDone: function() {
        var e = -1 === this.moveAnimationUid;
        return e
    }
}), model.event_on("multistep_next", function() {
    "IDLE" !== controller.stateMachine.state && controller.showMenu(controller.stateMachine.data.menu, controller.mapCursorX, controller.mapCursorY)
}), util.scoped(function() {
    function e(e, t) {
        controller.audio_playMusic(t)
    }

    function t(t) {
        var n = Base64Helper.decodeBuffer(t.value);
        controller.audio_loadByArrayBuffer(t.key, n, e)
    }

    function n(e) {
        controller.storage_assets.get(e, t)
    }
    view.registerAnimationHook({
        key: "nextTurn_invoked",
        prepare: function() {
            var t = model.co_data[model.round_turnOwner].coA;
            t && (controller.audio_isBuffered(t.music) ? e(!1, t.music) : n(t.music)), view.showInfoMessage(model.data_localized("day") + " " + model.round_day + " - " + model.player_data[model.round_turnOwner].name)
        },
        render: function() {},
        update: function() {},
        isDone: function() {
            return !view.hasInfoMessage()
        }
    })
}), model.event_on("transferMoney_invoked", function() {
    controller.renderPlayerInfo()
}), model.event_on("transferUnit_invoked", function(e) {
    var t = model.unit_data[e],
        n = -t.x,
        o = -t.y;
    controller.updateUnitStatus(model.unit_extractId(model.unit_posData[n][o]))
}), view.registerAnimationHook({
    key: "trapwait_invoked",
    prepare: function(e) {
        var t = model.unit_data[e];
        this.time = 0, this.xp = t.x + 1, this.yp = t.y, this.x = (t.x + 1) * TILE_LENGTH, this.y = t.y * TILE_LENGTH
    },
    render: function() {
        var e = view.getInfoImageForType("TRAPPED");
        view.canvasCtx.drawImage(e, this.x, this.y)
    },
    update: function(e) {
        this.time += e
    },
    isDone: function() {
        var e = this.time > 1e3;
        if (e)
            for (var t = view.getInfoImageForType("TRAPPED"), n = this.yp, o = this.xp, r = o + parseInt(t.width / TILE_LENGTH, 10); r >= o; o++) view.redraw_markPos(o, n);
        return e
    }
}), model.event_on("damageUnit", function(e) {
    controller.updateUnitStatus(e)
}), model.event_on("healUnit", function(e) {
    controller.updateUnitStatus(e)
}), model.event_on("attack_invoked", function(e, t) {
    controller.updateSimpleTileInformation(), controller.updateUnitStatus(e), controller.updateUnitStatus(t)
}), model.event_on("buildUnit_invoked", function() {
    controller.updateSimpleTileInformation()
}), model.event_on("createUnit", function(e) {
    controller.updateUnitStatus(e)
}), model.event_on("loadUnit_invoked", function(e, t) {
    controller.updateUnitStatus(t)
}), model.event_on("unloadUnit_invoked", function(e) {
    controller.updateUnitStatus(e)
}), model.event_on("joinUnits_invoked", function(e, t) {
    controller.updateUnitStatus(t)
}), model.event_on("supply_refillResources", function(e) {
    "number" == typeof e.x && (e = model.unit_extractId(e)), controller.updateUnitStatus(e)
}), model.event_on("clearUnitPosition", function(e) {
    var t = model.unit_data[e],
        n = -t.x,
        o = -t.y;
    model.map_isValidPosition(n - 1, o) && model.unit_posData[n - 1][o] && controller.updateUnitStatus(model.unit_extractId(model.unit_posData[n - 1][o])), model.map_isValidPosition(n + 1, o) && model.unit_posData[n + 1][o] && controller.updateUnitStatus(model.unit_extractId(model.unit_posData[n + 1][o])), model.map_isValidPosition(n, o + 1) && model.unit_posData[n][o + 1] && controller.updateUnitStatus(model.unit_extractId(model.unit_posData[n][o + 1])), model.map_isValidPosition(n, o - 1) && model.unit_posData[n][o - 1] && controller.updateUnitStatus(model.unit_extractId(model.unit_posData[n][o - 1]))
}), model.event_on("setUnitPosition", function(e) {
    controller.updateUnitStatus(e)
}), model.event_on("unitHide_invoked", function(e) {
    controller.updateUnitStatus(e)
}), model.event_on("unitUnhide_invoked", function(e) {
    controller.updateUnitStatus(e)
}), util.scoped(function() {
    function e(e) {
        return function() {
            if (controller.errorPanelVisible) {
                if ("LEFT" === e) controller.errorButtons.decreaseIndex();
                else if ("RIGHT" === e) controller.errorButtons.increaseIndex();
                else if ("ACTION" === e) {
                    var t = controller.errorButtons.getActiveKey();
                    "error.panel.yes" === t ? controller.storage_general.clear(function() {
                        controller.storage_assets.clear(function() {
                            controller.storage_maps.clear(function() {
                                window.location.reload()
                            })
                        })
                    }) : window.location.reload()
                }
                return this.breakTransition()
            }
            var n = this.structure[this.state][e];
            return n ? n.apply(this, arguments) : this.breakTransition()
        }
    }
    controller.stateParent = {
        onenter: function() {
            return controller.openSection(this.structure[this.state].section), this.structure[this.state].enterState ? this.structure[this.state].enterState.apply(this, arguments) : void 0
        },
        INP_UP: e("UP"),
        INP_LEFT: e("LEFT"),
        INP_RIGHT: e("RIGHT"),
        INP_DOWN: e("DOWN"),
        INP_ACTION: e("ACTION"),
        INP_CANCEL: e("CANCEL"),
        INP_HOVER: e("HOVER"),
        onerror: controller.haltEngine
    }
}), util.scoped(function() {
    var e = !1;
    controller.screenStateMachine.structure.GAMEROUND = Object.create(controller.stateParent), controller.screenStateMachine.structure.GAMEROUND.section = "cwt_game_screen", controller.screenStateMachine.structure.GAMEROUND.enterState = function() {
        if (e !== !0) {
            controller.audio_stopMusic(), controller.setCursorPosition(0, 0), controller.update_startGameRound();
            for (var t = 0, n = model.unit_data.length; n > t; t++) - 1 !== model.unit_data[t].owner && controller.updateUnitStatus(t);
            view.resizeCanvas(), view.updateMapImages(), view.redraw_markAll(), controller.setScreenScale(2), controller.inGameLoop = !0, controller.prepareGameLoop()
        }
        e = !1
    }, controller.screenStateMachine.structure.GAMEROUND.gameHasEnded = function() {
        return controller.inGameLoop = !1, "MAIN"
    }, controller.screenStateMachine.structure.GAMEROUND.LEFT = function(e, t) {
        var n = controller.stateMachine.state;
        return "ACTION_SELECT_TARGET_A" === n || "ACTION_SELECT_TARGET_B" === n ? (controller.stateMachine.data.selection.nextValidPosition(controller.mapCursorX, controller.mapCursorY, 0, !0, controller.setCursorPosition), this.breakTransition()) : (t || (t = 1), 1 === t ? controller.moveCursor(model.move_MOVE_CODES.LEFT, t) : controller.shiftScreenPosition(model.move_MOVE_CODES.LEFT, t), this.breakTransition())
    }, controller.screenStateMachine.structure.GAMEROUND.RIGHT = function(e, t) {
        var n = controller.stateMachine.state;
        return "ACTION_SELECT_TARGET_A" === n || "ACTION_SELECT_TARGET_B" === n ? (controller.stateMachine.data.selection.nextValidPosition(controller.mapCursorX, controller.mapCursorY, 0, !1, controller.setCursorPosition), this.breakTransition()) : (t || (t = 1), 1 === t ? controller.moveCursor(model.move_MOVE_CODES.RIGHT, t) : controller.shiftScreenPosition(model.move_MOVE_CODES.RIGHT, t), this.breakTransition())
    }, controller.screenStateMachine.structure.GAMEROUND.UP = function(e, t) {
        var n = controller.stateMachine.state;
        if ("ACTION_SELECT_TARGET_A" === n || "ACTION_SELECT_TARGET_B" === n) return controller.stateMachine.data.selection.nextValidPosition(controller.mapCursorX, controller.mapCursorY, 0, !0, controller.setCursorPosition), this.breakTransition();
        var o = "ACTION_MENU" === n || "ACTION_SUBMENU" === n;
        return t || (t = 1), o ? controller.decreaseMenuCursor() : 1 === t ? controller.moveCursor(model.move_MOVE_CODES.UP, t) : controller.shiftScreenPosition(model.move_MOVE_CODES.UP, t), this.breakTransition()
    }, controller.screenStateMachine.structure.GAMEROUND.DOWN = function(e, t) {
        var n = controller.stateMachine.state;
        if ("ACTION_SELECT_TARGET_A" === n || "ACTION_SELECT_TARGET_B" === n) return controller.stateMachine.data.selection.nextValidPosition(controller.mapCursorX, controller.mapCursorY, 0, !1, controller.setCursorPosition), this.breakTransition();
        var o = "ACTION_MENU" === n || "ACTION_SUBMENU" === n;
        return t || (t = 1), o ? controller.increaseMenuCursor() : 1 === t ? controller.moveCursor(model.move_MOVE_CODES.DOWN, t) : controller.shiftScreenPosition(model.move_MOVE_CODES.DOWN, t), this.breakTransition()
    }, controller.screenStateMachine.structure.GAMEROUND.SHIFT_DOWN = function(e, t) {
        return controller.shiftScreenPosition(model.move_MOVE_CODES.DOWN, t), controller.moveCursor(model.move_MOVE_CODES.DOWN, t), this.breakTransition()
    }, controller.screenStateMachine.structure.GAMEROUND.SHIFT_UP = function(e, t) {
        return controller.shiftScreenPosition(model.move_MOVE_CODES.UP, t), controller.moveCursor(model.move_MOVE_CODES.UP, t), this.breakTransition()
    }, controller.screenStateMachine.structure.GAMEROUND.SHIFT_LEFT = function(e, t) {
        return controller.shiftScreenPosition(model.move_MOVE_CODES.LEFT, t), controller.moveCursor(model.move_MOVE_CODES.LEFT, t), this.breakTransition()
    }, controller.screenStateMachine.structure.GAMEROUND.SHIFT_RIGHT = function(e, t) {
        return controller.shiftScreenPosition(model.move_MOVE_CODES.RIGHT, t), controller.moveCursor(model.move_MOVE_CODES.RIGHT, t), this.breakTransition()
    }, controller.screenStateMachine.structure.GAMEROUND.ACTION = function(e, t, n) {
        var o = controller.stateMachine.state;
        return "IDLE" === o && controller.attackRangeVisible ? (controller.hideAttackRangeInfo(), this.breakTransition()) : ("number" == typeof t && controller.setCursorPosition(t, n), controller.cursorActionClick(), this.breakTransition())
    }, controller.screenStateMachine.structure.GAMEROUND.HOVER = function(e, t, n) {
        return controller.setCursorPosition(t, n), this.breakTransition()
    }, controller.screenStateMachine.structure.GAMEROUND.CANCEL = function(e, t, n) {
        var o = controller.stateMachine.state;
        if ("IDLE" === o) {
            if (controller.attackRangeVisible) return controller.hideAttackRangeInfo(), this.breakTransition();
            var r = model.unit_posData[controller.mapCursorX][controller.mapCursorY];
            if (r) return controller.showAttackRangeInfo(), this.breakTransition()
        }
        return "number" == typeof t && controller.setCursorPosition(t, n), controller.cursorActionCancel(), this.breakTransition()
    }, controller.screenStateMachine.structure.GAMEROUND.toOptions_ = function() {
        return assert(2 === arguments.length && arguments[1] === !0), e = !0, "OPTIONS"
    }
}), controller.screenStateMachine.structure.LOAD = Object.create(controller.stateParent), controller.screenStateMachine.structure.LOAD.section = "cwt_load_screen", controller.screenStateMachine.structure.LOAD.enterState = function() {
    controller.dataLoader_start(document.getElementById("loading_text"), document.getElementById("loading_bar"))
}, controller.screenStateMachine.structure.LOAD.complete = function() {
    return "MOBILE"
}, controller.screenStateMachine.structure.LOAD.onerror = controller.haltEngine, util.scoped(function() {
    var e = document.getElementById("cwt_main_screen"),
        t = controller.generateButtonGroup(e, "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button", "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button button_active", "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button button_inactive");
    document.getElementById("mainScreen_version").innerHTML = "0.3.5.1", controller.screenStateMachine.structure.MAIN = Object.create(controller.stateParent), controller.screenStateMachine.structure.MAIN.section = "cwt_main_screen", controller.screenStateMachine.structure.MAIN.enterState = function() {
        controller.audio_playNullSound(), controller.features_client.audioMusic && controller.audio_playMusic(model.data_menu.music), t.setIndex(1)
    }, controller.screenStateMachine.structure.MAIN.UP = function() {
        return t.decreaseIndex(), this.breakTransition()
    }, controller.screenStateMachine.structure.MAIN.DOWN = function() {
        return t.increaseIndex(), this.breakTransition()
    }, controller.screenStateMachine.structure.MAIN.ACTION = function() {
        var e, n;
        return t.isIndexInactive() ? (n = model.data_sounds.CANCEL, e = this.breakTransition()) : (n = model.data_sounds.MENUTICK, e = t.getActiveKey()), controller.audio_playSound(n), e
    }
}), controller.screenStateMachine.structure.NONE = Object.create(controller.stateParent), controller.screenStateMachine.structure.NONE.section = null, controller.screenStateMachine.structure.NONE.start = function() {
    return function() {
        function e() {
            requestAnimationFrame(e);
            var n = (new Date).getTime(),
                o = n - t;
            t = n, controller.updateGamePadControls(o), controller.inGameLoop && (controller.update_inGameRound ? controller.gameLoop(o) : controller.screenStateMachine.event("gameHasEnded")), "MOBILE" === controller.screenStateMachine.state && controller.screenStateMachine.event("decreaseTimer", o)
        }
        var t = (new Date).getTime();
        requestAnimationFrame(e)
    }(), "LOAD"
}, util.scoped(function() {
    function e() {
        document.location.reload()
    }

    function t() {
        controller.screenStateMachine.structure.OPTIONS.forceTouch = !controller.screenStateMachine.structure.OPTIONS.forceTouch, n()
    }

    function n() {
        s.innerHTML = controller.screenStateMachine.structure.OPTIONS.forceTouch ? model.data_localized("yes") : model.data_localized("no")
    }

    function o() {
        a.innerHTML = Math.round(100 * controller.audio_getSfxVolume()), i.innerHTML = Math.round(100 * controller.audio_getMusicVolume())
    }
    var r, a = document.getElementById("cwt_options_sfxVolume"),
        i = document.getElementById("cwt_options_musicVolume"),
        s = document.getElementById("cwt_options_forceTouch"),
        l = controller.generateButtonGroup(document.getElementById("cwt_options_screen"), "cwt_panel_header_small cwt_page_button w_400 cwt_panel_button", "cwt_panel_header_small cwt_page_button w_400 cwt_panel_button button_active", "cwt_panel_header_small cwt_page_button w_400 cwt_panel_button button_inactive");
    controller.screenStateMachine.structure.OPTIONS = Object.create(controller.stateParent), controller.screenStateMachine.structure.OPTIONS.forceTouch = !1, controller.screenStateMachine.structure.OPTIONS.section = "cwt_options_screen", controller.screenStateMachine.structure.OPTIONS.enterState = function(e, t) {
        r = t === !0 ? !0 : !1, o(), n(), l.setIndex(1)
    }, controller.screenStateMachine.structure.OPTIONS.UP = function() {
        switch (l.getActiveKey()) {
            case "options.sfx.up":
            case "options.music.up":
            case "options.music.down":
                l.decreaseIndex(), l.decreaseIndex();
                break;
            default:
                l.decreaseIndex()
        }
        return this.breakTransition()
    }, controller.screenStateMachine.structure.OPTIONS.DOWN = function() {
        switch (l.getActiveKey()) {
            case "options.sfx.up":
            case "options.sfx.down":
            case "options.music.down":
                l.increaseIndex(), l.increaseIndex();
                break;
            default:
                l.increaseIndex()
        }
        return this.breakTransition()
    }, controller.screenStateMachine.structure.OPTIONS.LEFT = function() {
        switch (l.getActiveKey()) {
            case "options.sfx.up":
            case "options.music.up":
                l.decreaseIndex()
        }
        return this.breakTransition()
    }, controller.screenStateMachine.structure.OPTIONS.RIGHT = function() {
        switch (l.getActiveKey()) {
            case "options.sfx.down":
            case "options.music.down":
                l.increaseIndex()
        }
        return this.breakTransition()
    }, controller.screenStateMachine.structure.OPTIONS.ACTION = function() {
        switch (l.getActiveKey()) {
            case "options.sfx.down":
                controller.audio_setSfxVolume(controller.audio_getSfxVolume() - .05), o();
                break;
            case "options.sfx.up":
                controller.audio_setSfxVolume(controller.audio_getSfxVolume() + .05), o();
                break;
            case "options.music.down":
                controller.audio_setMusicVolume(controller.audio_getMusicVolume() - .05), o();
                break;
            case "options.music.up":
                controller.audio_setMusicVolume(controller.audio_getMusicVolume() + .05), o();
                break;
            case "options.setKeyboad":
                return controller.activeMapping = controller.KEY_MAPPINGS.KEYBOARD, "REMAP_KEYS";
            case "options.setGamepad":
                return controller.activeMapping = controller.KEY_MAPPINGS.GAMEPAD, "REMAP_KEYS";
            case "options.resetData":
                controller.storage_general.set("cwt_resetData", !0, e);
                break;
            case "options.forceTouch":
                t();
                break;
            case "options.goBack":
                return controller.audio_saveConfigs(), controller.storage_general.set("cwt_forceTouch", controller.screenStateMachine.structure.OPTIONS.forceTouch), r ? "GAMEROUND" : "MAIN"
        }
        return this.breakTransition()
    }, controller.screenStateMachine.structure.OPTIONS.CANCEL = function() {
        return controller.audio_saveConfigs(), r ? "GAMEROUND" : "MAIN"
    }
}), util.scoped(function() {
    function e(e, t, n, o) {
        var a = r[e];
        a[0].innerHTML = model.data_localized(t), a[1].innerHTML = n ? model.data_localized(n) : n, a[2].innerHTML = o
    }

    function t(t) {
        var n = controller.roundConfig_typeSelected[t];
        if (-1 === n) e(t, "config.player.off", "", "");
        else if (-2 === n) e(t, "config.player.disabled", "", "");
        else {
            var o, r;
            o = 0 === n ? "config.player.human" : "config.player.AI", r = "config.player.co.none", -1 !== controller.roundConfig_coSelected[t] && (r = model.data_coSheets[model.data_coTypes[controller.roundConfig_coSelected[t]]].ID), e(t, o, r, controller.roundConfig_teamSelected[t])
        }
    }

    function n(e) {
        var n = e.value;
        controller.persistence_prepareModel(n), controller.roundConfig_prepare();
        for (var o = 0, r = 4; r > o; o++) t(o)
    }
    var o = controller.generateButtonGroup(document.getElementById("cwt_player_setup_screen"), "cwt_panel_header_big cwt_page_button cwt_panel_button", "cwt_panel_header_big cwt_page_button cwt_panel_button button_active", "cwt_panel_header_big cwt_page_button cwt_panel_button button_inactive"),
        r = [
            [document.getElementById("playerConfig_p1_type"), document.getElementById("playerConfig_p1_co"), document.getElementById("playerConfig_p1_team")],
            [document.getElementById("playerConfig_p2_type"), document.getElementById("playerConfig_p2_co"), document.getElementById("playerConfig_p2_team")],
            [document.getElementById("playerConfig_p3_type"), document.getElementById("playerConfig_p3_co"), document.getElementById("playerConfig_p3_team")],
            [document.getElementById("playerConfig_p4_type"), document.getElementById("playerConfig_p4_co"), document.getElementById("playerConfig_p4_team")]
        ];
    controller.screenStateMachine.structure.PLAYER_SETUP = Object.create(controller.stateParent), controller.screenStateMachine.structure.PLAYER_SETUP.section = "cwt_player_setup_screen", controller.screenStateMachine.structure.PLAYER_SETUP.enterState = function() {
        controller.storage_maps.get(this.data.mapToLoad, n)
    }, controller.screenStateMachine.structure.PLAYER_SETUP.UP = function() {
        switch (o.getActiveKey()) {
            case "config.co.next":
            case "config.co.prev":
            case "config.team.next":
            case "config.team.prev":
                o.decreaseIndex(), o.decreaseIndex(), o.decreaseIndex(), o.decreaseIndex();
                break;
            case "config.type.next":
                var e = o.getActiveData();
                "1" == e ? (o.decreaseIndex(), o.decreaseIndex()) : "2" == e ? (o.decreaseIndex(), o.decreaseIndex(), o.decreaseIndex(), o.decreaseIndex()) : (o.decreaseIndex(), o.decreaseIndex(), o.decreaseIndex(), o.decreaseIndex());
                break;
            case "config.type.prev":
                var e = o.getActiveData();
                "1" == e ? o.decreaseIndex() : "2" == e ? (o.decreaseIndex(), o.decreaseIndex(), o.decreaseIndex()) : (o.decreaseIndex(), o.decreaseIndex(), o.decreaseIndex(), o.decreaseIndex());
                break;
            case "config.next":
                o.decreaseIndex()
        }
        return this.breakTransition()
    }, controller.screenStateMachine.structure.PLAYER_SETUP.DOWN = function() {
        switch (o.getActiveKey()) {
            case "config.type.next":
            case "config.co.next":
            case "config.type.prev":
            case "config.co.prev":
                o.increaseIndex(), o.increaseIndex(), o.increaseIndex(), o.increaseIndex();
                break;
            case "config.team.next":
                var e = o.getActiveData();
                "3" == e ? (o.increaseIndex(), o.increaseIndex(), o.increaseIndex()) : "4" == e ? o.increaseIndex() : (o.increaseIndex(), o.increaseIndex(), o.increaseIndex(), o.increaseIndex());
                break;
            case "config.team.prev":
                var e = o.getActiveData();
                "3" == e ? (o.increaseIndex(), o.increaseIndex(), o.increaseIndex(), o.increaseIndex()) : "4" == e ? (o.increaseIndex(), o.increaseIndex()) : (o.increaseIndex(), o.increaseIndex(), o.increaseIndex(), o.increaseIndex());
                break;
            case "config.next":
                o.increaseIndex()
        }
        return this.breakTransition()
    }, controller.screenStateMachine.structure.PLAYER_SETUP.LEFT = function() {
        switch (o.getActiveKey()) {
            case "config.type.prev":
            case "config.co.prev":
            case "config.team.prev":
                var e = o.getActiveData();
                ("2" == e || "4" == e) && o.decreaseIndex();
                break;
            case "config.type.next":
            case "config.co.next":
            case "config.team.next":
                o.decreaseIndex()
        }
        return this.breakTransition()
    }, controller.screenStateMachine.structure.PLAYER_SETUP.RIGHT = function() {
        switch (o.getActiveKey()) {
            case "config.type.next":
            case "config.co.next":
            case "config.team.next":
                var e = o.getActiveData();
                ("1" == e || "3" == e) && o.increaseIndex();
                break;
            case "config.type.prev":
            case "config.co.prev":
            case "config.team.prev":
                o.increaseIndex()
        }
        return this.breakTransition()
    }, controller.screenStateMachine.structure.PLAYER_SETUP.CANCEL = function() {
        return this.data.mapToLoad = null, "VERSUS"
    }, controller.screenStateMachine.structure.PLAYER_SETUP.ACTION = function() {
        switch (o.getActiveKey()) {
            case "config.type.prev":
            case "config.type.next":
            case "config.co.prev":
            case "config.co.next":
            case "config.team.prev":
            case "config.team.next":
                var e;
                switch (o.getActiveData()) {
                    case "1":
                        e = 0;
                        break;
                    case "2":
                        e = 1;
                        break;
                    case "3":
                        e = 2;
                        break;
                    case "4":
                        e = 3
                }
                if (-1 === model.player_data[e].team) break;
                switch (o.getActiveKey()) {
                    case "config.type.prev":
                        controller.roundConfig_changeConfig(e, controller.roundConfig_CHANGE_TYPE.PLAYER_TYPE, !0);
                        break;
                    case "config.type.next":
                        controller.roundConfig_changeConfig(e, controller.roundConfig_CHANGE_TYPE.PLAYER_TYPE, !1);
                        break;
                    case "config.team.prev":
                        controller.roundConfig_changeConfig(e, controller.roundConfig_CHANGE_TYPE.TEAM, !0);
                        break;
                    case "config.team.next":
                        controller.roundConfig_changeConfig(e, controller.roundConfig_CHANGE_TYPE.TEAM, !1);
                        break;
                    case "config.co.prev":
                        controller.roundConfig_changeConfig(e, controller.roundConfig_CHANGE_TYPE.CO_MAIN, !1);
                        break;
                    case "config.co.next":
                        controller.roundConfig_changeConfig(e, controller.roundConfig_CHANGE_TYPE.CO_MAIN, !1)
                }
                t(e);
                break;
            case "config.next":
                return controller.roundConfig_evalAfterwards(), "GAMEROUND"
        }
        return this.breakTransition()
    }
}), controller.activeMapping = null, controller._state_remapKeys_message = document.getElementById("keyMappingText"), controller._state_remapKeys_step = 0, controller._state_remapKeys_steps = ["left", "up", "down", "right", "action", "cancel"], controller.screenStateMachine.structure.REMAP_KEYS = Object.create(controller.stateParent), controller.screenStateMachine.structure.REMAP_KEYS.section = "cwt_keyMapping_screen", controller.screenStateMachine.structure.REMAP_KEYS.enterState = function() {
    switch (controller.activeMapping) {
        case controller.KEY_MAPPINGS.KEYBOARD:
            controller._state_remapKeys_step = 0;
            break;
        case controller.KEY_MAPPINGS.GAMEPAD:
            controller._state_remapKeys_step = 4
    }
    controller._state_remapKeys_message.innerHTML = model.data_localized(controller._state_remapKeys_steps[controller._state_remapKeys_step])
}, controller.screenStateMachine.structure.REMAP_KEYS.INPUT_SET = function(e, t) {
    var n = null;
    switch (controller.activeMapping) {
        case controller.KEY_MAPPINGS.KEYBOARD:
            n = controller.keyMaps.KEYBOARD;
            break;
        case controller.KEY_MAPPINGS.GAMEPAD:
            n = controller.keyMaps.GAMEPAD
    }
    switch (controller._state_remapKeys_step) {
        case 0:
            n.LEFT = t;
            break;
        case 1:
            n.UP = t;
            break;
        case 2:
            n.DOWN = t;
            break;
        case 3:
            n.RIGHT = t;
            break;
        case 4:
            n.ACTION = t;
            break;
        case 5:
            n.CANCEL = t
    }
    return controller._state_remapKeys_step++, controller._state_remapKeys_step === controller._state_remapKeys_steps.length ? (controller.activeMapping = null, controller.saveKeyMapping(), "OPTIONS") : (controller._state_remapKeys_message.innerHTML = model.data_localized(controller._state_remapKeys_steps[controller._state_remapKeys_step]), this.breakTransition())
}, controller.screenStateMachine.structure.RULE_EDIT = Object.create(controller.stateParent), controller.screenStateMachine.structure.RULE_EDIT.section = "cwt_ruleEditScreen", controller.screenStateMachine.structure.RULE_EDIT.enterState = function() {}, util.scoped(function() {
    function e() {
        model.data_tips.length > 0 && (o.innerHTML = model.data_tips[t])
    }
    var t, n = 1e4,
        o = document.getElementById("startScreen_toolTip"),
        r = document.getElementById("cwt_mobileSound_screen");
    controller.generateButtonGroup(r, "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button", "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button button_active", "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button button_inactive"), controller.screenStateMachine.structure.MOBILE = Object.create(controller.stateParent), controller.screenStateMachine.structure.MOBILE.timer = 0, controller.screenStateMachine.structure.MOBILE.section = "cwt_mobileSound_screen", controller.screenStateMachine.structure.MOBILE.enterState = function() {
        t = parseInt(Math.random() * model.data_tips.length, 10), e(), controller.screenStateMachine.structure.MOBILE.timer = n
    }, controller.screenStateMachine.structure.MOBILE.decreaseTimer = function(o, r) {
        return controller.screenStateMachine.structure.MOBILE.timer -= r, controller.screenStateMachine.structure.MOBILE.timer <= 0 && (controller.screenStateMachine.structure.MOBILE.timer = n, t++, t >= model.data_tips.length && (t = 0), e()), this.breakTransition()
    }, controller.screenStateMachine.structure.MOBILE.ACTION = function() {
        return controller.stateMachine.event("start"), "MAIN"
    }, controller.screenStateMachine.structure.MOBILE.LEFT = function() {
        return t--, 0 > t && (t = model.data_tips.length - 1), controller.screenStateMachine.structure.MOBILE.timer = n, e(), this.breakTransition()
    }, controller.screenStateMachine.structure.MOBILE.RIGHT = function() {
        return t++, t >= model.data_tips.length && (t = 0), controller.screenStateMachine.structure.MOBILE.timer = n, e(), this.breakTransition()
    }
}), util.scoped(function() {
    function e() {
        t.innerHTML = model.data_maps[n]
    }
    var t = document.getElementById("map_selection");
    document.getElementById("versus_start_btn");
    var n, o = controller.generateButtonGroup(document.getElementById("cwt_versus_screen"), "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button", "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button button_active", "cwt_panel_header_big cwt_page_button w_400 cwt_panel_button button_inactive");
    controller.screenStateMachine.structure.VERSUS = Object.create(controller.stateParent), controller.screenStateMachine.structure.VERSUS.section = "cwt_versus_screen", controller.screenStateMachine.structure.VERSUS.enterState = function() {
        n = 0, this.data.isSinglePlayer = !0, e()
    }, controller.screenStateMachine.structure.VERSUS.UP = function() {
        switch (o.getActiveKey()) {
            case "versus.nextMap":
                o.decreaseIndex()
        }
        return o.decreaseIndex(), this.breakTransition()
    }, controller.screenStateMachine.structure.VERSUS.DOWN = function() {
        switch (o.getActiveKey()) {
            case "versus.prevMap":
                o.increaseIndex()
        }
        return o.increaseIndex(), this.breakTransition()
    }, controller.screenStateMachine.structure.VERSUS.LEFT = function() {
        switch (o.getActiveKey()) {
            case "versus.nextMap":
                o.decreaseIndex()
        }
        return this.breakTransition()
    }, controller.screenStateMachine.structure.VERSUS.RIGHT = function() {
        switch (o.getActiveKey()) {
            case "versus.prevMap":
                o.increaseIndex()
        }
        return this.breakTransition()
    }, controller.screenStateMachine.structure.VERSUS.CANCEL = function() {
        return "MAIN"
    }, controller.screenStateMachine.structure.VERSUS.ACTION = function() {
        switch (o.getActiveKey()) {
            case "versus.prevMap":
                n > 0 ? n-- : n = model.data_maps.length - 1, e();
                break;
            case "versus.nextMap":
                n < model.data_maps.length - 1 ? n++ : n = 0, e();
                break;
            case "versus.next":
                return this.data.mapToLoad = model.data_maps[n], "PLAYER_SETUP"
        }
        return this.breakTransition()
    }
}), controller.screenStateMachine.data.mapToLoad = null, controller.screenStateMachine.data.isSinglePlayer = !1;
