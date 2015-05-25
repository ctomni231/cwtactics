stjs.ns("cwt");
cwt.LaserCmp = function() {};
stjs.extend(cwt.LaserCmp, null, [], function(constructor, prototype) {
    prototype.damage = 0;
}, {}, {});
stjs.ns("cwt");
cwt.JsUtil = function() {};
stjs.extend(cwt.JsUtil, null, [], function(constructor, prototype) {
    constructor.objectKeys = function(obj) {
        return Object.keys(obj);
    };
    constructor.forEachObjectKeys = function(obj, callback) {
        cwt.JsUtil.objectKeys(obj).forEach(callback);
    };
    constructor.forEachObjectValue = function(obj, callback) {
        var keys = cwt.JsUtil.objectKeys(obj);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            callback(key, (obj)[key]);
        }
    };
    constructor.forEachMapValue = function(obj, callback) {
        cwt.JsUtil.forEachObjectValue(obj, callback);
    };
    constructor.forEachArrayValue = function(array, callback) {
        for (var i = 0; i < array.length; i++) {
            callback(i, array[i]);
        }
    };
}, {}, {});
stjs.ns("cwt");
cwt.ObjectType = function() {};
stjs.extend(cwt.ObjectType, null, [], function(constructor, prototype) {
    prototype.ID = null;
    prototype.checkExpression = function(expr, errors, msg) {
        if (!expr) {
            errors.push(msg);
        }
    };
    prototype.checkType = function(type, errors) {
        type.validateData(errors);
    };
    /**
     *  Validates the data type and returns all failures as a list as parameter
     *  when calling the callback.
     *  
     *  @param callback
     */
    prototype.validate = function(callback) {
        var errors = [];
        this.checkExpression(is.string(this.ID) && is.equal(this.ID.length, 4), errors, "ID");
        try {
            this.validateData(errors);
        }catch (validationError) {}
        callback(errors);
    };
    prototype.grabMapValue = function(data, key, defaultValue) {
        return (data).hasOwnProperty(key) ? data[key] : defaultValue;
    };
    /**
     *  Usable to extend the validation behavior (e.g. when sub type adds new
     *  properties).
     *  
     *  @param errors
     */
    prototype.validateData = function(errors) {};
    prototype.grabDataFromMapGlobal = function(data) {
        this.ID = this.grabMapValue(data, "ID", null);
        this.grabDataFromMap(data);
    };
    prototype.grabDataFromMap = function(data) {};
}, {}, {});
stjs.ns("cwt");
cwt.IEntityComponent = function() {};
stjs.extend(cwt.IEntityComponent, null, [], null, {}, {});
/**
 *  A flyweight component is a component which is shared between several
 *  components. It should be used to prevent multiple initialization of state
 *  game data.
 */
stjs.ns("cwt");
cwt.IFlyweightComponent = function() {};
stjs.extend(cwt.IFlyweightComponent, null, [], null, {}, {});
stjs.ns("cwt");
cwt.Color = function() {};
stjs.extend(cwt.Color, null, [], function(constructor, prototype) {}, {}, {});
stjs.ns("cwt");
cwt.Observerable3 = function() {
    this.observers = [];
};
stjs.extend(cwt.Observerable3, null, [], function(constructor, prototype) {
    prototype.observers = null;
    prototype.subscribe = function(handler) {
        this.observers.push(handler);
    };
    prototype.unsubscribe = function(handler) {
         while (true){
            var index = this.observers.indexOf(handler);
            if (index == -1) {
                return;
            }
            this.observers.splice(index, 1);
        }
    };
    prototype.publish = function(dataA, dataB, dataC) {
        for (var i = 0; i < this.observers.length; i++) {
            this.observers[i](dataA, dataB, dataC);
        }
    };
}, {observers: {name: "Array", arguments: [{name: "Callback3", arguments: ["A", "B", "C"]}]}}, {});
/**
 *  Utility class which contains a lot of browser environment related functions.
 */
stjs.ns("cwt");
cwt.BrowserUtil = function() {};
stjs.extend(cwt.BrowserUtil, null, [], function(constructor, prototype) {
    constructor.requestJsonFile = function(path, callback) {
        cwt.BrowserUtil.doXmlHttpRequest(path, null, function(data, error) {
            var dataMap = null;
            if (error == null) {
                dataMap = JSON.parse(data);
            }
            callback(dataMap, error);
        });
    };
    /**
     *  Invokes a XmlHttpRequest.
     *  
     *  @param path
     *  @param specialType
     *           null or a special binary response type like array buffer
     *  @param callback
     *           callback will be invoked with two parameters => object data and
     *           error message (both aren't not null at the same time)
     */
    constructor.doXmlHttpRequest = function(path, specialType, callback) {
        var request = new XMLHttpRequest();
        if (specialType != null) {
            (request)["responseType"] = specialType;
        }
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                if (request.readyState == 4 && request.status == 200) {
                    if (specialType != null) {
                        callback((request)["response"], null);
                    } else {
                        callback(request.responseText, null);
                    }
                } else {
                    callback(null, request.statusText);
                }
            }
        };
        request.open("get", path, true);
        request.send();
    };
    /**
     *  Creates a DOM element.
     *  
     *  @param tag
     *           name of the tag
     *  @return a DOM element with the given tag
     */
    constructor.createDomElement = function(tag) {
        return document.createElement(tag);
    };
    /**
     *  
     *  @param handler
     */
    constructor.requestAnimationFrame = function(handler) {
        requestAnimationFrame(handler);
    };
}, {}, {});
stjs.ns("cwt");
cwt.Observerable4 = function() {
    this.observers = [];
};
stjs.extend(cwt.Observerable4, null, [], function(constructor, prototype) {
    prototype.observers = null;
    prototype.subscribe = function(handler) {
        this.observers.push(handler);
    };
    prototype.unsubscribe = function(handler) {
         while (true){
            var index = this.observers.indexOf(handler);
            if (index == -1) {
                return;
            }
            this.observers.splice(index, 1);
        }
    };
    prototype.publish = function(dataA, dataB, dataC, dataD) {
        for (var i = 0; i < this.observers.length; i++) {
            this.observers[i](dataA, dataB, dataC, dataD);
        }
    };
}, {observers: {name: "Array", arguments: [{name: "Callback4", arguments: ["A", "B", "C", "D"]}]}}, {});
stjs.ns("cwt");
cwt.Observerable2 = function() {
    this.observers = [];
};
stjs.extend(cwt.Observerable2, null, [], function(constructor, prototype) {
    prototype.observers = null;
    prototype.subscribe = function(handler) {
        this.observers.push(handler);
    };
    prototype.unsubscribe = function(handler) {
         while (true){
            var index = this.observers.indexOf(handler);
            if (index == -1) {
                return;
            }
            this.observers.splice(index, 1);
        }
    };
    prototype.publish = function(dataA, dataB) {
        for (var i = 0; i < this.observers.length; i++) {
            this.observers[i](dataA, dataB);
        }
    };
}, {observers: {name: "Array", arguments: [{name: "Callback2", arguments: ["A", "B"]}]}}, {});
stjs.ns("cwt");
cwt.Playground = function() {};
stjs.extend(cwt.Playground, null, [], function(constructor, prototype) {
    constructor.AssetEntry = function() {};
    stjs.extend(cwt.Playground.AssetEntry, null, [], function(constructor, prototype) {
        /**
         *  extension matched from key - otherwise defaultExtension
         */
        prototype.ext = null;
        /**
         *  normalized key that you can use to store the asset
         */
        prototype.key = null;
        /**
         *  if it requires more than one file - here is url without extension for
         *  example texture atlas consists of atlas.png + atlas.json
         */
        prototype.path = null;
        /**
         *  by a rule of thumb is to use the url to load a file
         */
        prototype.url = null;
    }, {}, {});
    constructor.ChangeStateEvent = function() {};
    stjs.extend(cwt.Playground.ChangeStateEvent, null, [], function(constructor, prototype) {
        prototype.next = null;
        prototype.prev = null;
        prototype.state = null;
    }, {next: "cwt.PlaygroundState", prev: "cwt.PlaygroundState", state: "cwt.PlaygroundState"}, {});
    constructor.GamepadEvent = function() {};
    stjs.extend(cwt.Playground.GamepadEvent, null, [], function(constructor, prototype) {
        prototype.button = null;
        prototype.gamepad = 0;
    }, {}, {});
    constructor.KeyboardEvent = function() {};
    stjs.extend(cwt.Playground.KeyboardEvent, null, [], function(constructor, prototype) {
        prototype.key = 0;
    }, {}, {});
    constructor.KeyboardKeys = function() {};
    stjs.extend(cwt.Playground.KeyboardKeys, null, [], function(constructor, prototype) {
        prototype.a = 0;
        prototype.ctrl = 0;
    }, {}, {});
    constructor.KeyboardStatus = function() {};
    stjs.extend(cwt.Playground.KeyboardStatus, null, [], function(constructor, prototype) {
        prototype.keys = null;
    }, {keys: "cwt.Playground.KeyboardKeys"}, {});
    constructor.Loader = function() {};
    stjs.extend(cwt.Playground.Loader, null, [], function(constructor, prototype) {}, {}, {});
    constructor.MouseEvent = function() {};
    stjs.extend(cwt.Playground.MouseEvent, null, [], function(constructor, prototype) {
        prototype.original = null;
        prototype.x = 0;
        prototype.y = 0;
    }, {original: "DOMEvent"}, {});
    constructor.MouseStatus = function() {};
    stjs.extend(cwt.Playground.MouseStatus, null, [], function(constructor, prototype) {
        prototype.left = false;
        prototype.middle = false;
        prototype.right = false;
        prototype.x = 0;
        prototype.y = 0;
    }, {}, {});
    constructor.PointerEvent = function() {};
    stjs.extend(cwt.Playground.PointerEvent, null, [], function(constructor, prototype) {
        prototype.button = null;
        prototype.delta = 0;
        prototype.id = 0;
        prototype.mouse = false;
        prototype.original = null;
        prototype.touch = false;
        prototype.x = 0;
        prototype.y = 0;
    }, {original: "DOMEvent"}, {});
    constructor.ResourcePaths = function() {};
    stjs.extend(cwt.Playground.ResourcePaths, null, [], function(constructor, prototype) {
        prototype.atlases = null;
        prototype.base = null;
        prototype.images = null;
        prototype.sounds = null;
    }, {}, {});
    constructor.Sound = function() {};
    stjs.extend(cwt.Playground.Sound, null, [], null, {}, {});
    constructor.SoundActions = function() {};
    stjs.extend(cwt.Playground.SoundActions, null, [], function(constructor, prototype) {}, {}, {});
    constructor.TouchEvent = function() {};
    stjs.extend(cwt.Playground.TouchEvent, null, [], function(constructor, prototype) {
        prototype.id = 0;
        prototype.original = null;
        prototype.x = 0;
        prototype.y = 0;
    }, {original: "DOMEvent"}, {});
    constructor.TouchStatus = function() {};
    stjs.extend(cwt.Playground.TouchStatus, null, [], function(constructor, prototype) {
        prototype.x = 0;
        prototype.y = 0;
    }, {}, {});
    constructor.Tween = function() {};
    stjs.extend(cwt.Playground.Tween, null, [], function(constructor, prototype) {}, {}, {});
    constructor.Tweenable = function() {};
    stjs.extend(cwt.Playground.Tweenable, null, [], function(constructor, prototype) {
        prototype.background = null;
        prototype.height = 0;
        prototype.rotation = 0;
        prototype.scale = 0.0;
        prototype.width = 0;
        prototype.x = 0;
        prototype.y = 0;
    }, {}, {});
    constructor.TweenData = function() {};
    stjs.extend(cwt.Playground.TweenData, null, [], null, {}, {});
    prototype.atlases = null;
    prototype.container = null;
    prototype.data = null;
    prototype.height = 0;
    prototype.images = null;
    prototype.keyboard = null;
    prototype.layer = null;
    prototype.lifetime = 0;
    prototype.loader = null;
    prototype.mouse = null;
    prototype.music = null;
    prototype.paths = null;
    prototype.pointers = null;
    prototype.preferedAudioFormat = null;
    prototype.scale = 0.0;
    prototype.smoothing = false;
    prototype.sound = null;
    prototype.touch = null;
    prototype.width = 0;
    prototype.state = null;
    prototype.create = function() {};
    prototype.createstate = function() {};
    prototype.enterstate = function(event) {};
    prototype.gamepaddown = function(ev) {};
    prototype.gamepadmove = function(ev) {};
    prototype.gamepadup = function(ev) {};
    prototype.keydown = function(ev) {};
    prototype.keyup = function(ev) {};
    prototype.leavestate = function(event) {};
    prototype.mousedown = function(ev) {};
    prototype.mousemove = function(ev) {};
    prototype.mouseup = function(ev) {};
    prototype.pointerdown = function(ev) {};
    prototype.pointermove = function(ev) {};
    prototype.pointerup = function(ev) {};
    prototype.pointerwheel = function(ev) {};
    prototype.preload = function() {};
    prototype.ready = function() {};
    prototype.render = function() {};
    prototype.resize = function() {};
    prototype.step = function(delta) {};
    prototype.touchend = function(ev) {};
    prototype.touchmove = function(ev) {};
    prototype.touchstart = function(ev) {};
}, {atlases: {name: "Map", arguments: [null, "cwt.CanvasQuery.Atlas"]}, container: "Element", data: {name: "Map", arguments: [null, "Object"]}, images: {name: "Map", arguments: [null, "Canvas"]}, keyboard: "cwt.Playground.KeyboardStatus", layer: "cwt.CanvasQuery", loader: "cwt.Playground.Loader", mouse: "cwt.Playground.MouseStatus", music: "cwt.Playground.SoundActions", paths: "cwt.Playground.ResourcePaths", pointers: {name: "Array", arguments: ["cwt.Playground.PointerEvent"]}, sound: "cwt.Playground.SoundActions", touch: "cwt.Playground.TouchStatus", state: "cwt.PlaygroundState"}, {});
stjs.ns("cwt");
cwt.Observerable1 = function() {
    this.observers = [];
};
stjs.extend(cwt.Observerable1, null, [], function(constructor, prototype) {
    prototype.observers = null;
    prototype.subscribe = function(handler) {
        this.observers.push(handler);
    };
    prototype.unsubscribe = function(handler) {
         while (true){
            var index = this.observers.indexOf(handler);
            if (index == -1) {
                return;
            }
            this.observers.splice(index, 1);
        }
    };
    prototype.publish = function(dataA) {
        for (var i = 0; i < this.observers.length; i++) {
            this.observers[i](dataA);
        }
    };
}, {observers: {name: "Array", arguments: [{name: "Callback1", arguments: ["A"]}]}}, {});
stjs.ns("cwt");
cwt.GameModeCmp = function() {};
stjs.extend(cwt.GameModeCmp, null, [], function(constructor, prototype) {
    constructor.GameMode = stjs.enumeration("AW1", "AW2");
    prototype.mode = null;
}, {mode: {name: "Enum", arguments: ["cwt.GameModeCmp.GameMode"]}}, {});
stjs.ns("cwt");
cwt.FundsCmp = function() {};
stjs.extend(cwt.FundsCmp, null, [], function(constructor, prototype) {
    prototype.funds = 0;
}, {}, {});
stjs.ns("cwt");
cwt.Colors = function() {};
stjs.extend(cwt.Colors, null, [], function(constructor, prototype) {}, {}, {});
stjs.ns("cwt");
cwt.Tile = function() {};
stjs.extend(cwt.Tile, null, [], function(constructor, prototype) {
    prototype.defense = 0;
    prototype.blocksVision = false;
}, {}, {});
stjs.ns("cwt");
cwt.ClassUtil = function() {};
stjs.extend(cwt.ClassUtil, null, [], function(constructor, prototype) {
    constructor.getClassName = function(object) {
        if (object == null || object == undefined) {
            return null;
        }
        return (object)["__className"];
    };
    constructor.getClass = function(object) {
        return (object).constructor;
    };
}, {}, {});
stjs.ns("cwt");
cwt.PlaygroundUtil = function() {};
stjs.extend(cwt.PlaygroundUtil, null, [], function(constructor, prototype) {
    constructor.setBasePath = function(instance, path) {
        if (instance.paths == null) {
            instance.paths = {};
        }
        instance.paths.base = path;
    };
}, {}, {});
stjs.ns("cwt");
cwt.PlaygroundState = function() {};
stjs.extend(cwt.PlaygroundState, null, [], function(constructor, prototype) {
    prototype.app = null;
    prototype.create = function() {};
    prototype.enter = function() {};
    prototype.leave = function() {};
    prototype.step = function(delta) {};
    prototype.render = function() {};
    prototype.keydown = function(ev) {};
    prototype.keyup = function(ev) {};
}, {app: "cwt.Playground"}, {});
stjs.ns("cwt");
cwt.Constants = function() {};
stjs.extend(cwt.Constants, null, [], function(constructor, prototype) {
    /**
     *  The version of the game build.
     */
    constructor.VERSION = "0.40";
    /**
     *  The expected number of characters in an object identifier.
     */
    constructor.IDENTIFIER_LENGTH = 4;
    /**
     *  Internal screen height in pixel.
     */
    constructor.SCREEN_HEIGHT_PX = 480;
    /**
     *  Internal screen width in pixel.
     */
    constructor.SCREEN_WIDTH_PX = 640;
    /**
     *  Maximum range of a selection.
     */
    constructor.MAX_SELECTION_RANGE = 15;
    /**
     *  The version of the game build.
     */
    constructor.NAMESPACE = "cwt";
    /**
     *  Controls the exact length of the logger name field in a log message. The
     *  class name will be extended (with spaces) or trimmed to has the exact
     *  wanted length.
     */
    constructor.LOGGER_CLASS_NAME_LENGTH = 20;
    constructor.LOGGER_CSS_INFO_HEAD = "color: #197519; font-weight: bold";
    constructor.LOGGER_CSS_WARN_HEAD = "color: #FF7519; font-weight: bold";
    constructor.LOGGER_CSS_ERROR_HEAD = "color: #B20000; font-weight: bold";
    constructor.LOGGER_CSS_TEXT = "color: #1A1A1A";
    constructor.OFFLINE_DB_SIZE = 50;
    constructor.OFFLINE_DB_NAME = "CWT-DB";
}, {}, {});
stjs.ns("cwt");
cwt.DataConverter = function() {};
stjs.extend(cwt.DataConverter, null, [], function(constructor, prototype) {
    prototype.grabData = function(asset, callback) {};
    prototype.cacheData = function(data, callback) {};
    prototype.loadData = function(data, callback) {};
}, {}, {});
stjs.ns("cwt");
cwt.EntityId = function() {};
stjs.extend(cwt.EntityId, null, [], function(constructor, prototype) {
    constructor.GAME_ROUND = "GAME_ROUND";
    constructor.UNIT = "UNIT_";
    constructor.PROPERTY = "PROPERTY_";
}, {}, {});
stjs.ns("cwt");
cwt.FireableCmp = function() {};
stjs.extend(cwt.FireableCmp, null, [], function(constructor, prototype) {
    prototype.damage = 0;
    prototype.range = 0;
    prototype.fireableBy = null;
}, {fireableBy: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.DataTypeCmp = function() {};
stjs.extend(cwt.DataTypeCmp, null, [], function(constructor, prototype) {
    constructor.DataType = stjs.enumeration("UNIT_TYPE", "TILE_TYPE", "PROPERTY_TYPE", "WEATHER_TYPE", "ARMY_TYPE", "CO_TYPE");
    prototype.type = null;
}, {type: {name: "Enum", arguments: ["cwt.DataTypeCmp.DataType"]}}, {});
stjs.ns("cwt");
cwt.LocalForageConfig = function() {};
stjs.extend(cwt.LocalForageConfig, null, [], function(constructor, prototype) {
    /**
     *  The preferred driver(s) to use. Same format as what is passed to
     *  <code>setDriver()</code>, above.
     *  
     *  Default: <code>[localforage.INDEXEDDB, localforage.WEBSQL,
     *  localforage.LOCALSTORAGE]</code>
     */
    prototype.driver = null;
    /**
     *  The name of the database. May appear during storage limit prompts. Useful
     *  to use the name of your app here. In localStorage, this is used as a key
     *  prefix for all keys stored in localStorage.
     *  
     *  Default: <code>localforage</code>
     */
    prototype.name = null;
    /**
     *  The size of the database in bytes. Used only in WebSQL for now.
     *  
     *  Default: <code>4980736</code>
     */
    prototype.size = 0;
    /**
     *  The name of the datastore. In IndexedDB this is the dataStore, in WebSQL
     *  this is the name of the key/value table in the database. Must be
     *  alphanumeric, with underscores. Any non-alphanumeric characters will be
     *  converted to underscores.
     *  
     *  Default: <code>keyvaluepairs</code>
     */
    prototype.storeName = null;
    /**
     *  The version of your database. May be used for upgrades in the future;
     *  currently unused.
     *  
     *  Default: <code>1.0</code>
     */
    prototype.version = null;
    /**
     *  A description of the database, essentially for developer usage.
     *  
     *  Default: <code>""</code>
     */
    prototype.description = null;
}, {driver: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.RenderableCmp = function() {};
stjs.extend(cwt.RenderableCmp, null, [], null, {}, {});
stjs.ns("cwt");
cwt.ArmyCmp = function() {};
stjs.extend(cwt.ArmyCmp, null, [], function(constructor, prototype) {
    prototype.name = null;
}, {}, {});
stjs.ns("cwt");
cwt.MapCmp = function() {};
stjs.extend(cwt.MapCmp, null, [], function(constructor, prototype) {
    prototype.tiles = null;
}, {tiles: {name: "Array", arguments: [{name: "Array", arguments: [null]}]}}, {});
stjs.ns("cwt");
cwt.TransportContainerCmp = function() {};
stjs.extend(cwt.TransportContainerCmp, null, [], function(constructor, prototype) {
    prototype.loads = null;
}, {loads: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.Modification = function() {};
stjs.extend(cwt.Modification, null, [], function(constructor, prototype) {
    prototype.sounds = null;
    prototype.musics = null;
    prototype.maps = null;
}, {sounds: {name: "Map", arguments: [null, null]}, musics: {name: "Map", arguments: [null, null]}, maps: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.CoCmp = function() {};
stjs.extend(cwt.CoCmp, null, [], function(constructor, prototype) {
    prototype.name = null;
    prototype.coStars = 0;
    prototype.scoStars = 0;
}, {}, {});
stjs.ns("cwt");
cwt.CapturerCmp = function() {};
stjs.extend(cwt.CapturerCmp, null, [], function(constructor, prototype) {
    prototype.points = 0;
}, {}, {});
stjs.ns("cwt");
cwt.MoveType = function() {
    cwt.ObjectType.call(this);
};
stjs.extend(cwt.MoveType, cwt.ObjectType, [], function(constructor, prototype) {
    prototype.costs = null;
    prototype.validateData = function(errors) {
        cwt.JsUtil.forEachObjectValue(this.costs, stjs.bind(this, function(tileTypeId, movecosts) {
            this.checkExpression(is.string(tileTypeId), errors, "costs -> " + tileTypeId + " key");
            this.checkExpression(is.integer(movecosts) && is.within(movecosts, -2, 100) && is.not.equal(movecosts, 0), errors, "costs -> " + tileTypeId + " value");
        }));
    };
    prototype.grabDataFromMap = function(data) {
        this.costs = this.grabMapValue(data, "costs", {});
    };
}, {costs: {name: "Map", arguments: [null, null]}}, {});
stjs.ns("cwt");
cwt.WeatherType = function() {
    cwt.ObjectType.call(this);
};
stjs.extend(cwt.WeatherType, cwt.ObjectType, [], function(constructor, prototype) {
    prototype.isDefaultWeather = false;
    prototype.validateData = function(errors) {
        this.checkExpression(is.bool(this.isDefaultWeather), errors, "isDefaultWeather");
    };
    prototype.grabDataFromMap = function(data) {
        this.isDefaultWeather = this.grabMapValue(data, "isDefaultWeather", false);
    };
}, {}, {});
stjs.ns("cwt");
cwt.ArmyType = function() {
    cwt.ObjectType.call(this);
};
stjs.extend(cwt.ArmyType, cwt.ObjectType, [], function(constructor, prototype) {
    prototype.name = null;
    prototype.validateData = function(errors) {
        this.checkExpression(is.string(this.name) && is.within(this.name.length, 3, 20), errors, "name");
    };
    prototype.grabDataFromMap = function(data) {
        this.name = this.grabMapValue(data, "name", null);
    };
}, {}, {});
stjs.ns("cwt");
cwt.LaserType = function() {
    cwt.ObjectType.call(this);
};
stjs.extend(cwt.LaserType, cwt.ObjectType, [], function(constructor, prototype) {
    prototype.damage = 0;
    prototype.validateData = function(errors) {
        this.checkExpression(is.integer(this.damage) && is.within(this.damage, -1, 10), errors, "damage");
    };
    prototype.grabDataFromMap = function(data) {
        this.damage = this.grabMapValue(data, "damage", 0);
    };
}, {}, {});
stjs.ns("cwt");
cwt.TileType = function() {
    cwt.ObjectType.call(this);
};
stjs.extend(cwt.TileType, cwt.ObjectType, [], function(constructor, prototype) {
    prototype.defense = 0;
    prototype.blocksVision = false;
    prototype.validateData = function(errors) {
        this.checkExpression(is.bool(this.blocksVision), errors, "blocksVision");
        this.checkExpression(is.integer(this.defense) && is.above(this.defense, -1), errors, "defense");
    };
    prototype.grabDataFromMap = function(data) {
        this.defense = this.grabMapValue(data, "defense", 0);
        this.blocksVision = this.grabMapValue(data, "blocksVision", false);
    };
}, {}, {});
stjs.ns("cwt");
cwt.MapFileType = function() {
    cwt.ObjectType.call(this);
};
stjs.extend(cwt.MapFileType, cwt.ObjectType, [], function(constructor, prototype) {
    prototype.mapName = null;
    prototype.maxPlayers = 0;
    prototype.validateData = function(errors) {
        this.checkExpression(is.string(this.mapName), errors, "mapName");
        this.checkExpression(is.integer(this.maxPlayers) && is.within(this.maxPlayers, 2, 4), errors, "maxPlayers");
    };
    prototype.grabDataFromMap = function(data) {
        this.mapName = this.grabMapValue(data, "mapName", null);
        this.maxPlayers = this.grabMapValue(data, "maxPlayers", -1);
    };
}, {}, {});
stjs.ns("cwt");
cwt.RocketSiloType = function() {
    cwt.ObjectType.call(this);
};
stjs.extend(cwt.RocketSiloType, cwt.ObjectType, [], function(constructor, prototype) {
    prototype.damage = 0;
    prototype.range = 0;
    prototype.fireableBy = null;
    prototype.validateData = function(errors) {
        this.checkExpression(is.array(this.fireableBy), errors, "fireable");
        this.checkExpression(is.integer(this.range) && is.within(this.range, 0, 6), errors, "range");
        this.checkExpression(is.integer(this.damage) && is.within(this.damage, -1, 10), errors, "damage");
    };
    prototype.grabDataFromMap = function(data) {
        this.damage = this.grabMapValue(data, "damage", 0);
        this.range = this.grabMapValue(data, "range", 1);
        this.fireableBy = this.grabMapValue(data, "fireable", []);
    };
}, {fireableBy: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.CoType = function() {
    cwt.ObjectType.call(this);
};
stjs.extend(cwt.CoType, cwt.ObjectType, [], function(constructor, prototype) {
    prototype.coStars = 0;
    prototype.scoStars = 0;
    prototype.validateData = function(errors) {
        this.checkExpression(is.integer(this.coStars) && is.within(this.coStars, 0, 11), errors, "coStars");
        this.checkExpression(is.integer(this.scoStars) && is.within(this.scoStars, 0, 11), errors, "scoStars");
    };
    prototype.grabDataFromMap = function(data) {
        this.coStars = this.grabMapValue(data, "coStars", 1);
        this.scoStars = this.grabMapValue(data, "scoStars", 1);
    };
}, {}, {});
stjs.ns("cwt");
cwt.VisionerCmp = function() {};
stjs.extend(cwt.VisionerCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.vision = 0;
}, {}, {});
stjs.ns("cwt");
cwt.DataType = function() {};
stjs.extend(cwt.DataType, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.typeEntity = null;
}, {}, {});
stjs.ns("cwt");
cwt.FuelDrainerCmp = function() {};
stjs.extend(cwt.FuelDrainerCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.drain = 0;
}, {}, {});
stjs.ns("cwt");
cwt.SupplierCmp = function() {};
stjs.extend(cwt.SupplierCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.supplies = null;
}, {supplies: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.MenuCmp = function() {
    this.entries = [];
    for (var i = 0; i < 10; i++) {
        this.entries.push({});
    }
};
stjs.extend(cwt.MenuCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    constructor.MenuEntry = function() {};
    stjs.extend(cwt.MenuCmp.MenuEntry, null, [], function(constructor, prototype) {
        prototype.key = null;
        prototype.enabled = false;
    }, {}, {});
    prototype.entries = null;
}, {entries: {name: "Array", arguments: ["cwt.MenuCmp.MenuEntry"]}}, {});
stjs.ns("cwt");
cwt.WeatherCmp = function() {};
stjs.extend(cwt.WeatherCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.defaultWeather = false;
}, {}, {});
stjs.ns("cwt");
cwt.WeatherDurationCmp = function() {};
stjs.extend(cwt.WeatherDurationCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.days = 0;
}, {}, {});
stjs.ns("cwt");
cwt.BuyableCmp = function() {};
stjs.extend(cwt.BuyableCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.cost = 0;
}, {}, {});
stjs.ns("cwt");
cwt.TransportCmp = function() {};
stjs.extend(cwt.TransportCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.maxloads = 0;
    prototype.canload = null;
}, {canload: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.Positionable = function() {};
stjs.extend(cwt.Positionable, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.x = 0;
    prototype.y = 0;
}, {}, {});
stjs.ns("cwt");
cwt.HealthComponent = function() {};
stjs.extend(cwt.HealthComponent, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.hp = 0;
}, {}, {});
stjs.ns("cwt");
cwt.DamageMap = function() {};
stjs.extend(cwt.DamageMap, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.data = null;
}, {data: {name: "Map", arguments: [null, null]}}, {});
stjs.ns("cwt");
cwt.MovingCostsCmp = function() {};
stjs.extend(cwt.MovingCostsCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.costs = null;
}, {costs: {name: "Map", arguments: [null, null]}}, {});
stjs.ns("cwt");
cwt.Player = function() {};
stjs.extend(cwt.Player, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.gold = 0;
    prototype.numOfUnits = 0;
    prototype.numOfProperties = 0;
}, {}, {});
stjs.ns("cwt");
cwt.MovingAbilityCmp = function() {};
stjs.extend(cwt.MovingAbilityCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.fuel = 0;
    prototype.range = 0;
    prototype.movetype = null;
}, {}, {});
stjs.ns("cwt");
cwt.DirectFighting = function() {};
stjs.extend(cwt.DirectFighting, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.ammo = 0;
}, {}, {});
stjs.ns("cwt");
cwt.CapturableCmp = function() {};
stjs.extend(cwt.CapturableCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.points = 0;
}, {}, {});
stjs.ns("cwt");
cwt.MovingCmp = function() {};
stjs.extend(cwt.MovingCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.fuel = 0;
}, {}, {});
stjs.ns("cwt");
cwt.SuicideCmp = function() {};
stjs.extend(cwt.SuicideCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.damage = 0;
    prototype.range = 0;
    prototype.noDamage = null;
}, {noDamage: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.IndirectFighting = function() {};
stjs.extend(cwt.IndirectFighting, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.ammo = 0;
    prototype.maxRange = 0;
    prototype.minRange = 0;
}, {}, {});
stjs.ns("cwt");
cwt.HidableCmp = function() {};
stjs.extend(cwt.HidableCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.hidden = false;
    prototype.dailyFuelDrainHidden = 0;
}, {}, {});
stjs.ns("cwt");
cwt.OwnableCmp = function() {};
stjs.extend(cwt.OwnableCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.owner = null;
}, {}, {});
stjs.ns("cwt");
cwt.RepairerCmp = function() {};
stjs.extend(cwt.RepairerCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.repairs = null;
}, {repairs: {name: "Map", arguments: [null, null]}}, {});
stjs.ns("cwt");
cwt.SingleUse = function() {};
stjs.extend(cwt.SingleUse, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.used = false;
}, {}, {});
stjs.ns("cwt");
cwt.FactoryCmp = function() {};
stjs.extend(cwt.FactoryCmp, null, [cwt.IEntityComponent, cwt.IFlyweightComponent], function(constructor, prototype) {
    prototype.builds = null;
}, {builds: {name: "Array", arguments: [null]}}, {});
/**
 *  Image utility class to manipulate images.
 */
stjs.ns("cwt");
cwt.ImageUtil = function() {};
stjs.extend(cwt.ImageUtil, null, [], function(constructor, prototype) {
    constructor.convertImageToString = function(image, resultCb) {
        var canvas = cwt.BrowserUtil.createDomElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.height = image.height;
        canvas.width = image.width;
        ctx.drawImage(image, 0, 0);
        resultCb(canvas.toDataURL("image/png"));
    };
    constructor.convertStringToImage = function(dataUrl, resultCb) {
        var canvas = cwt.BrowserUtil.createDomElement("canvas");
        var ctx = canvas.getContext("2d");
        var img = new Image();
        img.onload = function(image) {
            ctx.drawImage(image, 0, 0);
            resultCb(canvas);
        };
        img.src = dataUrl;
    };
    /**
     *  Converts an image to a black image while not touching the alpha layer.
     *  
     *  @param image
     *  @return
     */
    constructor.convertImageToBlackMask = function(image) {
        var canvas = cwt.BrowserUtil.createDomElement("canvas");
        var canvasContext = canvas.getContext("2d");
        var imgW = image.width;
        var imgH = image.height;
        canvas.width = imgW;
        canvas.height = imgH;
        canvasContext.drawImage(image, 0, 0);
        var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);
        for (var y = 0; y < imgPixels.height; y++) {
            for (var x = 0; x < imgPixels.width; x++) {
                var xi = (y * 4) * imgPixels.width + x * 4;
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
    /**
     *  Crops and rotates and image.
     *  
     *  @param image
     *           source image
     *  @param sx
     *           start position x
     *  @param sy
     *           start position y
     *  @param w
     *           width
     *  @param rotation
     *  @return
     */
    constructor.cropAndRotate = function(image, sx, sy, w, rotation) {
        var canvas = cwt.BrowserUtil.createDomElement("canvas");
        var context = canvas.getContext("2d");
        var hw = stjs.trunc(w / 2);
        canvas.height = w;
        canvas.width = w;
        context.save();
        context.translate(hw, hw);
        context.rotate(rotation * Math.PI / 180);
        context.translate(-hw, -hw);
        context.drawImage(image, sx, sy, w, w, 0, 0, w, w);
        context.restore();
        return canvas;
    };
    /**
     *  Draws a part of an image to a new canvas.
     *  
     *  @param image
     *  @param sx
     *  @param sy
     *  @param w
     *  @param h
     *  @return
     */
    constructor.cropImage = function(image, sx, sy, w, h) {
        var canvas = cwt.BrowserUtil.createDomElement("canvas");
        var canvasContext = canvas.getContext("2d");
        canvas.width = w;
        canvas.height = h;
        canvasContext.drawImage(image, sx, sy, w, h, 0, 0, w, h);
        return canvas;
    };
    /**
     *  Flips an image.
     * 
     *  BASED ON http://jsfiddle.net/pankajparashar/KwDhX/
     *  
     *  @param image
     *  @param flipH
     *  @param flipV
     *  @return
     */
    constructor.flipImage = function(image, flipH, flipV) {
        var scaleH = flipH ? -1 : 1;
        var scaleV = flipV ? -1 : 1;
        var posX = flipH ? image.width * -1 : 0;
        var posY = flipV ? image.height * -1 : 0;
        var nCanvas = cwt.BrowserUtil.createDomElement("canvas");
        var nContext = nCanvas.getContext("2d");
        nCanvas.height = image.height;
        nCanvas.width = image.width;
        nContext.save();
        nContext.scale(scaleH, scaleV);
        nContext.drawImage(image, posX, posY, image.width, image.height);
        nContext.restore();
        return nCanvas;
    };
    /**
     *  Returns the image data of an image.
     *  
     *  @param image
     *  @return
     */
    constructor.getImageData = function(image) {
        var canvas = cwt.BrowserUtil.createDomElement("canvas");
        var canvasContext = canvas.getContext("2d");
        var imgW = image.width;
        var imgH = image.height;
        canvas.width = imgW;
        canvas.height = imgH;
        canvasContext.drawImage(image, 0, 0);
        return canvasContext.getImageData(0, 0, imgW, imgH).data;
    };
    /**
     *  Changes colors in an assets object by given replacement color maps and
     *  returns a new assets object (html5 canvas).
     *  
     *  @param image
     *  @param colorData
     *  @param numColors
     *  @param oriIndex
     *  @param replaceIndex
     *  @return Canvas with replaced colors
     */
    constructor.replaceColors = function(image, colorData, numColors, oriIndex, replaceIndex) {
        var canvas = cwt.BrowserUtil.createDomElement("canvas");
        var canvasContext = canvas.getContext("2d");
        var imgW = image.width;
        var imgH = image.height;
        canvas.width = imgW;
        canvas.height = imgH;
        canvasContext.drawImage(image, 0, 0);
        var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);
        var oriStart = (oriIndex * 4) * numColors;
        var replStart = (replaceIndex * 4) * numColors;
        for (var y = 0; y < imgPixels.height; y++) {
            for (var x = 0; x < imgPixels.width; x++) {
                var xi = (y * 4) * imgPixels.width + x * 4;
                var oR = imgPixels.data[xi];
                var oG = imgPixels.data[xi + 1];
                var oB = imgPixels.data[xi + 2];
                for (var n = 0, ne = (numColors * 4); n < ne; n += 4) {
                    var sR = colorData.data[oriStart + n];
                    var sG = colorData.data[oriStart + n + 1];
                    var sB = colorData.data[oriStart + n + 2];
                    if (sR == oR && sG == oG && sB == oB) {
                        var r = replStart + n;
                        var rR = colorData.data[r];
                        var rG = colorData.data[r + 1];
                        var rB = colorData.data[r + 2];
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
    /**
     *  
     *  Doubles the size of an assets by using the scale2x algorithm.
     *  
     *  @param image
     *  @return
     */
    constructor.scaleImageWithScale2x = function(image) {
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
        var canvasS = cwt.BrowserUtil.createDomElement("canvas");
        var canvasSContext = canvasS.getContext("2d");
        canvasS.width = imgW;
        canvasS.height = imgH;
        canvasSContext.drawImage(image, 0, 0);
        var imgPixelsS = canvasSContext.getImageData(0, 0, imgW, imgH);
        var canvasT = cwt.BrowserUtil.createDomElement("canvas");
        var canvasTContext = canvasT.getContext("2d");
        canvasT.width = imgW * 2;
        canvasT.height = imgH * 2;
        var imgPixelsT = canvasTContext.getImageData(0, 0, imgW * 2, imgH * 2);
        for (var y = 0; y < imgPixelsS.height; y++) {
            for (var x = 0; x < imgPixelsS.width; x++) {
                xi = (y * 4) * imgPixelsS.width + x * 4;
                oR = imgPixelsS.data[xi];
                oG = imgPixelsS.data[xi + 1];
                oB = imgPixelsS.data[xi + 2];
                if (x > 0) {
                    xi = (y * 4) * imgPixelsS.width + (x - 1) * 4;
                    lR = imgPixelsS.data[xi];
                    lG = imgPixelsS.data[xi + 1];
                    lB = imgPixelsS.data[xi + 2];
                } else {
                    lR = oR;
                    lG = oG;
                    lB = oB;
                }
                if (y > 0) {
                    xi = ((y - 1) * 4) * imgPixelsS.width + (x) * 4;
                    uR = imgPixelsS.data[xi];
                    uG = imgPixelsS.data[xi + 1];
                    uB = imgPixelsS.data[xi + 2];
                } else {
                    uR = oR;
                    uG = oG;
                    uB = oB;
                }
                if (x < imgPixelsS.height - 1) {
                    xi = ((y + 1) * 4) * imgPixelsS.width + (x) * 4;
                    dR = imgPixelsS.data[xi];
                    dG = imgPixelsS.data[xi + 1];
                    dB = imgPixelsS.data[xi + 2];
                } else {
                    dR = oR;
                    dG = oG;
                    dB = oB;
                }
                if (x < imgPixelsS.width - 1) {
                    xi = (y * 4) * imgPixelsS.width + (x + 1) * 4;
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
                if ((uR != dR || uG != dG || uB != dB) && (lR != rR || lG != rG || lB != rB)) {
                    if (uR == lR && uG == lG && uB == lB) {
                        t0R = lR;
                        t0G = lG;
                        t0B = lB;
                    }
                    if (uR == rR && uG == rG && uB == rB) {
                        t1R = rR;
                        t1G = rG;
                        t1B = rB;
                    }
                    if (lR == dR && lG == dG && lB == dB) {
                        t2R = lR;
                        t2G = lG;
                        t2B = lB;
                    }
                    if (dR == rR && dG == rG && dB == rB) {
                        t3R = rR;
                        t3G = rG;
                        t3B = rB;
                    }
                }
                xi = ((y * 2) * 4) * imgPixelsT.width + (x * 2) * 4;
                imgPixelsT.data[xi + 0] = t0R;
                imgPixelsT.data[xi + 1] = t0G;
                imgPixelsT.data[xi + 2] = t0B;
                imgPixelsT.data[xi + 4] = t1R;
                imgPixelsT.data[xi + 5] = t1G;
                imgPixelsT.data[xi + 6] = t1B;
                xi = ((y * 2 + 1) * 4) * imgPixelsT.width + (x * 2) * 4;
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
}, {}, {});
stjs.ns("cwt");
cwt.SuicideType = function() {
    cwt.ObjectType.call(this);
};
stjs.extend(cwt.SuicideType, cwt.ObjectType, [], function(constructor, prototype) {
    prototype.damage = 0;
    prototype.range = 0;
    prototype.noDamage = null;
    prototype.validateData = function(errors) {
        this.checkExpression(is.integer(this.damage) && is.within(this.damage, -1, 10), errors, "damage");
        this.checkExpression(is.integer(this.range) && is.within(this.range, 0, cwt.Constants.MAX_SELECTION_RANGE + 1), errors, "range");
        this.checkExpression(is.array(this.noDamage), errors, "noDamage");
    };
    prototype.grabDataFromMap = function(data) {
        this.damage = this.grabMapValue(data, "damage", 0);
        this.range = this.grabMapValue(data, "range", 1);
        this.noDamage = this.grabMapValue(data, "noDamage", []);
    };
}, {noDamage: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.AttackType = function() {
    cwt.ObjectType.call(this);
};
stjs.extend(cwt.AttackType, cwt.ObjectType, [], function(constructor, prototype) {
    prototype.minrange = null;
    prototype.maxrange = null;
    prototype.mainWeapon = null;
    prototype.secondaryWeapon = null;
    prototype.validateData = function(errors) {
        this.checkExpression(is.integer(this.minrange) && is.within(this.minrange, 0, cwt.Constants.MAX_SELECTION_RANGE + 1), errors, "minrange");
        this.checkExpression(is.integer(this.maxrange) && is.within(this.maxrange, this.minrange - 1, cwt.Constants.MAX_SELECTION_RANGE + 1), errors, "maxrange");
        this.checkDamageMap(this.mainWeapon, "mainWeapon", errors);
        this.checkDamageMap(this.secondaryWeapon, "secondaryWeapon", errors);
    };
    prototype.checkDamageMap = function(damageMap, errorItemName, errors) {
        cwt.JsUtil.forEachObjectValue(damageMap, stjs.bind(this, function(typeId, damage) {
            this.checkExpression(is.string(typeId), errors, errorItemName + " key");
            this.checkExpression(is.integer(damage) && is.within(damage, 0, 1000), errors, errorItemName + " entry");
        }));
    };
    prototype.grabDataFromMap = function(data) {
        this.minrange = this.grabMapValue(data, "minrange", 1);
        this.maxrange = this.grabMapValue(data, "maxrange", 1);
        this.mainWeapon = this.grabMapValue(data, "mainWeapon", {});
        this.secondaryWeapon = this.grabMapValue(data, "secondaryWeapon", {});
    };
}, {mainWeapon: {name: "Map", arguments: [null, null]}, secondaryWeapon: {name: "Map", arguments: [null, null]}}, {});
stjs.ns("cwt");
cwt.ConstructedClass = function() {};
stjs.extend(cwt.ConstructedClass, null, [], function(constructor, prototype) {
    constructor.NAME_UNKNOWN_LOGGER = "UnknownLogger";
    constructor.PROPERTY_LOGGER_NAME = "__loggerName";
    prototype.getLoggerName = function() {
        var name = cwt.ClassUtil.getClassName(this);
        return name == null ? cwt.ConstructedClass.NAME_UNKNOWN_LOGGER : name;
    };
    prototype.getCachedLoggerName = function() {
        var loggerName = ((this).constructor)[cwt.ConstructedClass.PROPERTY_LOGGER_NAME];
        if (loggerName == undefined) {
            loggerName = this.getLoggerName();
            if (loggerName.length < cwt.Constants.LOGGER_CLASS_NAME_LENGTH) {
                var missingSpaces = cwt.Constants.LOGGER_CLASS_NAME_LENGTH - loggerName.length;
                var newName = "";
                for (var i = 0; i < missingSpaces; i++) {
                    newName += " ";
                }
                loggerName = newName + loggerName;
            } else if (loggerName.length > cwt.Constants.LOGGER_CLASS_NAME_LENGTH) {
                loggerName = loggerName.substring(0, cwt.Constants.LOGGER_CLASS_NAME_LENGTH);
            }
            ((this).constructor)[cwt.ConstructedClass.PROPERTY_LOGGER_NAME] = loggerName;
        }
        return loggerName;
    };
    prototype.info = function(msg) {
        console.log("%c[" + this.getCachedLoggerName() + "][ INFO] %c" + msg, cwt.Constants.LOGGER_CSS_INFO_HEAD, cwt.Constants.LOGGER_CSS_TEXT);
    };
    prototype.warn = function(msg) {
        console.log("%c[" + this.getCachedLoggerName() + "][ WARN] %c" + msg, cwt.Constants.LOGGER_CSS_WARN_HEAD, cwt.Constants.LOGGER_CSS_TEXT);
    };
    prototype.error = function(msg) {
        console.log("%c[" + this.getCachedLoggerName() + "][ERROR] %c" + msg, cwt.Constants.LOGGER_CSS_ERROR_HEAD, cwt.Constants.LOGGER_CSS_TEXT);
    };
    prototype.throwError = function(msg) {
        this.error(msg);
        throw new Error(msg);
    };
    prototype.onConstruction = function() {};
}, {}, {});
stjs.ns("cwt");
cwt.TypedObjectConverter = function() {};
stjs.extend(cwt.TypedObjectConverter, null, [cwt.DataConverter], function(constructor, prototype) {
    prototype.grabData = function(asset, callback) {
        cwt.BrowserUtil.doXmlHttpRequest(asset.url, null, function(objData, error) {});
    };
    prototype.cacheData = function(data, callback) {
        callback(JSON.stringify(data));
    };
    prototype.loadData = function(data, callback) {};
}, {}, {});
stjs.ns("cwt");
cwt.ObjectConverter = function() {};
stjs.extend(cwt.ObjectConverter, null, [cwt.DataConverter], function(constructor, prototype) {
    prototype.grabData = function(asset, callback) {
        cwt.BrowserUtil.requestJsonFile(asset.url, function(data, error) {
            if (error == null) {
                callback(data);
            }
        });
    };
    prototype.cacheData = function(data, callback) {
        callback(JSON.stringify(data));
    };
    prototype.loadData = function(data, callback) {
        callback(JSON.parse(data));
    };
}, {}, {});
stjs.ns("cwt");
cwt.PropertyType = function() {
    cwt.ObjectType.call(this);
};
stjs.extend(cwt.PropertyType, cwt.ObjectType, [], function(constructor, prototype) {
    prototype.repairs = null;
    prototype.defense = 0;
    prototype.vision = 0;
    prototype.capturePoints = 20;
    prototype.visionBlocker = false;
    prototype.rocketsilo = null;
    prototype.builds = null;
    prototype.laser = null;
    prototype.changesTo = null;
    prototype.funds = 0;
    prototype.looseAfterCaptured = false;
    prototype.blocker = false;
    prototype.notTransferable = false;
    prototype.validateData = function(errors) {
        this.checkExpression(is.integer(this.defense) && is.within(this.defense, -1, 7), errors, "defense");
        this.checkExpression(is.integer(this.vision) && is.within(this.vision, -1, cwt.Constants.MAX_SELECTION_RANGE + 1), errors, "vision");
        this.checkExpression(is.integer(this.capturePoints) && is.within(this.capturePoints, -1, 21), errors, "capturePoints");
        this.checkType(this.rocketsilo, errors);
        this.checkExpression(is.array(this.builds), errors, "builds");
        cwt.JsUtil.forEachArrayValue(this.builds, function(index, value) {});
        cwt.JsUtil.forEachObjectValue(this.repairs, stjs.bind(this, function(unitOrMoveTypeId, amount) {
            this.checkExpression(is.string(unitOrMoveTypeId), errors, "reapirs key " + unitOrMoveTypeId);
            this.checkExpression(is.integer(amount) && is.within(amount, 0, 11), errors, "repairs value of " + unitOrMoveTypeId);
        }));
        this.checkType(this.laser, errors);
        this.checkExpression(is.string(this.changesTo) && is.not.empty(this.changesTo), errors, "changesTo");
        this.checkExpression(is.integer(this.funds) && is.within(this.funds, -1, 100000), errors, "funds");
        this.checkExpression(is.bool(this.looseAfterCaptured), errors, "looseAfterCaptured");
        this.checkExpression(is.bool(this.notTransferable), errors, "notTransferable");
        this.checkExpression(is.bool(this.blocker), errors, "blocker");
    };
    prototype.grabDataFromMap = function(data) {
        this.rocketsilo = new cwt.RocketSiloType();
        this.laser = new cwt.LaserType();
        this.defense = this.grabMapValue(data, "defense", 0);
        this.vision = this.grabMapValue(data, "vision", 0);
        this.capturePoints = this.grabMapValue(data, "capturePoints", 20);
        this.visionBlocker = this.grabMapValue(data, "visionBlocker", false);
        this.rocketsilo.grabDataFromMap(this.grabMapValue(data, "rocketsilo", {}));
        this.repairs = this.grabMapValue(data, "repairs", {});
        this.builds = this.grabMapValue(data, "builds", []);
        this.laser.grabDataFromMap(this.grabMapValue(data, "laser", {}));
        this.changesTo = this.grabMapValue(data, "changesTo", "NONE");
        this.funds = this.grabMapValue(data, "funds", 0);
        this.blocker = this.grabMapValue(data, "blocker", false);
        this.looseAfterCaptured = this.grabMapValue(data, "looseAfterCaptured", false);
        this.notTransferable = this.grabMapValue(data, "notTransferable", false);
    };
}, {repairs: {name: "Map", arguments: [null, null]}, rocketsilo: "cwt.RocketSiloType", builds: {name: "Array", arguments: [null]}, laser: "cwt.LaserType"}, {});
stjs.ns("cwt");
cwt.SecondaryWeaponDamageMap = function() {
    cwt.DamageMap.call(this);
};
stjs.extend(cwt.SecondaryWeaponDamageMap, cwt.DamageMap, [], null, {data: {name: "Map", arguments: [null, null]}}, {});
stjs.ns("cwt");
cwt.MainWeaponDamageMap = function() {
    cwt.DamageMap.call(this);
};
stjs.extend(cwt.MainWeaponDamageMap, cwt.DamageMap, [], null, {data: {name: "Map", arguments: [null, null]}}, {});
stjs.ns("cwt");
cwt.ImageConverter = function() {};
stjs.extend(cwt.ImageConverter, null, [cwt.DataConverter], function(constructor, prototype) {
    prototype.grabData = function(asset, callback) {
        var img = new Image();
        img.onload = function(image) {
            var canvas = cwt.BrowserUtil.createDomElement("canvas");
            var ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            callback(canvas);
        };
        img.src = asset.path;
    };
    prototype.cacheData = function(data, callback) {
        cwt.ImageUtil.convertImageToString(data, callback);
    };
    prototype.loadData = function(data, callback) {
        cwt.ImageUtil.convertStringToImage(data, callback);
    };
}, {}, {});
stjs.ns("cwt");
cwt.UnitType = function() {
    cwt.ObjectType.call(this);
};
stjs.extend(cwt.UnitType, cwt.ObjectType, [], function(constructor, prototype) {
    prototype.cost = 0;
    prototype.range = 0;
    prototype.vision = 0;
    prototype.fuel = 0;
    prototype.ammo = 0;
    prototype.movetype = null;
    prototype.dailyFuelDrain = 0;
    prototype.dailyFuelDrainHidden = 0;
    prototype.maxloads = 0;
    prototype.canload = null;
    prototype.supply = null;
    prototype.captures = 0;
    prototype.stealth = false;
    prototype.attack = null;
    prototype.suicide = null;
    /**
     * 
     *  @return move type object for the given move type id of the unit type
     */
    prototype.getMoveType = function() {
        return null;
    };
    prototype.validateData = function(errors) {
        this.checkExpression(is.bool(this.stealth), errors, "stealth");
        this.checkExpression(is.integer(this.cost) && is.within(this.cost, -1, 1000000) && is.not.equal(this.cost, 0), errors, "cost");
        this.checkExpression(is.integer(this.range) && is.within(this.range, 0, cwt.Constants.MAX_SELECTION_RANGE + 1), errors, "range");
        this.checkExpression(is.integer(this.vision) && is.within(this.vision, 0, cwt.Constants.MAX_SELECTION_RANGE + 1), errors, "vision");
        this.checkExpression(is.integer(this.fuel) && is.within(this.fuel, -1, 100), errors, "fuel");
        this.checkExpression(is.integer(this.ammo) && is.within(this.ammo, -1, 100), errors, "ammo");
        this.checkExpression(is.integer(this.dailyFuelDrain) && is.within(this.dailyFuelDrain, -1, 100), errors, "dailyFuelDrain");
        this.checkExpression(is.integer(this.dailyFuelDrainHidden) && is.within(this.dailyFuelDrainHidden, this.dailyFuelDrain, 100), errors, "dailyFuelDrainHidden");
        this.checkExpression(is.integer(this.maxloads) && is.within(this.maxloads, -1, 5), errors, "maxloads");
        this.checkExpression(is.integer(this.captures) && is.within(this.captures, -1, 1000), errors, "captures");
        this.checkType(this.attack, errors);
        this.checkType(this.suicide, errors);
    };
    prototype.grabDataFromMap = function(data) {
        this.attack = new cwt.AttackType();
        this.suicide = new cwt.SuicideType();
        this.cost = this.grabMapValue(data, "cost", 1);
        this.range = this.grabMapValue(data, "range", 1);
        this.vision = this.grabMapValue(data, "vision", 1);
        this.fuel = this.grabMapValue(data, "fuel", 0);
        this.ammo = this.grabMapValue(data, "ammo", 0);
        this.movetype = this.grabMapValue(data, "movetype", null);
        this.dailyFuelDrain = this.grabMapValue(data, "dailyFuelDrain", 0);
        this.dailyFuelDrainHidden = this.grabMapValue(data, "dailyFuelDrainHidden", this.dailyFuelDrain + 1);
        this.maxloads = this.grabMapValue(data, "maxloads", 0);
        this.canload = this.grabMapValue(data, "canload", []);
        this.supply = this.grabMapValue(data, "supply", []);
        this.captures = this.grabMapValue(data, "captures", 0);
        this.stealth = this.grabMapValue(data, "stealth", false);
        this.attack.grabDataFromMap(this.grabMapValue(data, "attack", {}));
        this.suicide.grabDataFromMap(this.grabMapValue(data, "suicide", {}));
    };
}, {canload: {name: "Array", arguments: [null]}, supply: {name: "Array", arguments: [null]}, attack: "cwt.AttackType", suicide: "cwt.SuicideType"}, {});
stjs.ns("cwt");
cwt.SystemEvents = function() {};
stjs.extend(cwt.SystemEvents, null, [cwt.ConstructedClass], function(constructor, prototype) {
    prototype.INIT_ENGINE = null;
    prototype.INPUT_ACTION = null;
    prototype.INPUT_CANCEL = null;
    /**
     *  (TileEntity, TilePropertyEntity, TileUnitEntity)
     */
    prototype.CLICK_ON_TILE = null;
    prototype.INVOKE_ACTION = null;
    prototype.OBJECT_WAITS = null;
    prototype.ERROR_RAISED = null;
    prototype.FRAME_TICK = null;
    /**
     *  (player, turnNumber)
     */
    prototype.TURN_STARTS = null;
    prototype.WEATHER_CHANGES = null;
    prototype.WEATHER_CHANGED = null;
    prototype.UNIT_HEALED = null;
    prototype.UNIT_DAMAGED = null;
    prototype.INFLICTS_DAMAGE = null;
    prototype.UNIT_CREATED = null;
    prototype.UNIT_DESTROYED = null;
    prototype.UNIT_MOVED = null;
    prototype.PLAYER_GOLD_CHANGES = null;
    /**
     *  (Id, Type, X, Y)
     */
    prototype.UNIT_PRODUCED = null;
    prototype.onConstruction = function() {
        this.ERROR_RAISED = new cwt.Observerable1();
        this.FRAME_TICK = new cwt.Observerable1();
        this.UNIT_HEALED = new cwt.Observerable2();
        this.UNIT_DAMAGED = new cwt.Observerable2();
        this.INFLICTS_DAMAGE = new cwt.Observerable3();
        this.UNIT_CREATED = new cwt.Observerable1();
        this.UNIT_DESTROYED = new cwt.Observerable1();
        this.UNIT_MOVED = new cwt.Observerable4();
        this.PLAYER_GOLD_CHANGES = new cwt.Observerable2();
        this.UNIT_PRODUCED = new cwt.Observerable4();
        this.WEATHER_CHANGED = new cwt.Observerable1();
        this.WEATHER_CHANGES = new cwt.Observerable2();
        this.INPUT_ACTION = new cwt.Observerable1();
        this.INPUT_CANCEL = new cwt.Observerable1();
        this.INIT_ENGINE = new cwt.Observerable1();
    };
}, {INIT_ENGINE: {name: "cwt.Observerable1", arguments: ["cwt.Playground"]}, INPUT_ACTION: {name: "cwt.Observerable1", arguments: ["cwt.Playground"]}, INPUT_CANCEL: {name: "cwt.Observerable1", arguments: ["cwt.Playground"]}, CLICK_ON_TILE: {name: "cwt.Observerable3", arguments: [null, null, null]}, INVOKE_ACTION: {name: "cwt.Observerable4", arguments: [null, null, null, null]}, OBJECT_WAITS: {name: "cwt.Observerable1", arguments: [null]}, ERROR_RAISED: {name: "cwt.Observerable1", arguments: [null]}, FRAME_TICK: {name: "cwt.Observerable1", arguments: [null]}, TURN_STARTS: {name: "cwt.Observerable2", arguments: [null, null]}, WEATHER_CHANGES: {name: "cwt.Observerable2", arguments: [null, null]}, WEATHER_CHANGED: {name: "cwt.Observerable1", arguments: [null]}, UNIT_HEALED: {name: "cwt.Observerable2", arguments: [null, null]}, UNIT_DAMAGED: {name: "cwt.Observerable2", arguments: [null, null]}, INFLICTS_DAMAGE: {name: "cwt.Observerable3", arguments: [null, null, null]}, UNIT_CREATED: {name: "cwt.Observerable1", arguments: [null]}, UNIT_DESTROYED: {name: "cwt.Observerable1", arguments: [null]}, UNIT_MOVED: {name: "cwt.Observerable4", arguments: [null, null, null, {name: "Array", arguments: [null]}]}, PLAYER_GOLD_CHANGES: {name: "cwt.Observerable2", arguments: [null, null]}, UNIT_PRODUCED: {name: "cwt.Observerable4", arguments: [null, null, null, null]}}, {});
stjs.ns("cwt");
cwt.UnitAssetLoader = function() {};
stjs.extend(cwt.UnitAssetLoader, null, [cwt.ConstructedClass], function(constructor, prototype) {
    prototype.defaultFrameData = null;
    prototype.knownTypeIds = null;
    prototype.onConstruction = function() {
        this.knownTypeIds = [];
    };
    prototype.loadData = function() {};
    prototype.createDefaultFrame = function() {
        var frame = new cwt.CanvasQuery.Atlas();
        var frames = [];
        frame.frames = frames;
        for (var j = 0; j < 9; j++) {
            var subFrame = new cwt.CanvasQuery.AtlasFrame();
            subFrame.height = 32;
            subFrame.width = 32;
            subFrame.region = [0, 0, 32, 32];
            subFrame.offset = [0, 0];
            frames.push(subFrame);
        }
        return frame;
    };
}, {defaultFrameData: "cwt.CanvasQuery.Atlas", knownTypeIds: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.BrowserService = function() {};
stjs.extend(cwt.BrowserService, null, [cwt.ConstructedClass], function(constructor, prototype) {
    prototype.requestJsonFile = function(path, callback) {};
    /**
     *  Invokes a XmlHttpRequest.
     *  
     *  @param path
     *  @param specialType
     *           null or a special binary response type like array buffer
     *  @param callback
     *           callback will be invoked with two parameters => object data and
     *           error message (both aren't not null at the same time)
     */
    prototype.doXmlHttpRequest = function(path, specialType, callback) {
        var request = new XMLHttpRequest();
        if (specialType != null) {
            (request)["responseType"] = specialType;
        }
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                if (request.readyState == 4 && request.status == 200) {
                    if (specialType != null) {
                        callback((request)["response"], null);
                    } else {
                        callback(request.responseText, null);
                    }
                } else {
                    callback(null, request.statusText);
                }
            }
        };
        request.open("get", path, true);
        request.send();
    };
}, {}, {});
stjs.ns("cwt");
cwt.GameDataService = function() {};
stjs.extend(cwt.GameDataService, null, [cwt.ConstructedClass], function(constructor, prototype) {
    prototype.typeMap = null;
    prototype.onConstruction = function() {
        this.typeMap = {};
    };
    /**
     *  Registers a data type object. After that this object can be grabbed type
     *  safe by the get methods of this service.
     *  
     *  @param type
     */
    prototype.registerDataType = function(type) {
        type.validate(stjs.bind(this, function(errors) {
            if (errors.length > 0) {
                this.throwError("InvalidDataType Errors:" + JSON.stringify(errors));
            } else if ((this.typeMap).hasOwnProperty(type.ID)) {
                this.throwError("InvalidDataType Errors: ID " + type.ID + " is alreday registered");
            } else {
                this.info("registered " + cwt.ClassUtil.getClassName(type) + " object with id " + type.ID);
                this.typeMap[type.ID] = type;
            }
        }));
    };
    prototype.getDataType = function(id, typeClassName) {
        var type = this.typeMap[id];
        if (cwt.ClassUtil.getClassName(type) != typeClassName) {
            this.throwError("NoDataTypeExists (" + typeClassName + ":" + id + ")");
        }
        return type;
    };
    prototype.getArmy = function(armyId) {
        return this.getDataType(armyId, cwt.ClassUtil.getClassName(cwt.ArmyType));
    };
}, {typeMap: {name: "Map", arguments: [null, "cwt.ObjectType"]}}, {});
stjs.ns("cwt");
cwt.EntityManager = function() {
    this.entityIdCounter = 0;
    this.entities = {};
    this.allSelector = function(key) {
        return true;
    };
};
stjs.extend(cwt.EntityManager, null, [cwt.ConstructedClass], function(constructor, prototype) {
    prototype.entities = null;
    prototype.entityIdCounter = 0;
    prototype.allSelector = null;
    prototype.acquireEntity = function() {
        this.entityIdCounter++;
        return this.acquireEntityWithId("E" + (this.entityIdCounter - 1));
    };
    prototype.acquireEntityWithId = function(id) {
        this.entities[id] = {};
        return id;
    };
    prototype.acquireEntityComponent = function(id, componentClass) {
        return this.attachEntityComponent(id, new componentClass());
    };
    prototype.attachEntityComponent = function(id, component) {
        var entityMap = this.entities[id];
        entityMap[cwt.ClassUtil.getClassName(component)] = component;
        return component;
    };
    prototype.detachEntityComponent = function(id, component) {
        var entityMap = this.entities[id];
        delete entityMap[cwt.ClassUtil.getClassName(component)];
    };
    prototype.detachEntityComponentByClass = function(id, componentClass) {
        var entityMap = this.entities[id];
        delete entityMap[cwt.ClassUtil.getClassName(componentClass)];
    };
    /**
     *  Releases an entity. All connected {@link IEntityComponent} objects will be
     *  detached, cached in a pool and reused with the next acquire call.
     *  
     *  <strong>Be aware (!) </strong> that this manager will not pooling
     *  {@link IEntityComponent} objects which extends the
     *  {@link IFlyweightComponent} interface. It's suggested to leave at least one
     *  entity connected to your object over the whole life time of the game. If
     *  you release all connections to your {@link IFlyweightComponent} object then
     *  it will be available for remove by the garbage collector.
     *  
     *  @param id
     */
    prototype.releaseEntity = function(id) {};
    /**
     *  CAUTION: expensive
     *  
     *  @param lId
     *  @return
     */
    prototype.getEntityComponents = function(lId) {
        var componentMap = this.entities[lId];
        var componentKeys = cwt.JsUtil.objectKeys(componentMap);
        var components = [];
        for (var i = 0; i < componentKeys.length; i++) {
            components.push(componentMap[componentKeys[i]]);
        }
        return components;
    };
    /**
     *  Returns a component of an entity.
     *  
     *  @param lId
     *           id of the entity
     *  @param lComponentClass
     *           class of the wanted component
     *  @return component object or null
     */
    prototype.getEntityComponent = function(lId, lComponentClass) {
        var componentMap = this.entities[lId];
        var componentName = cwt.ClassUtil.getClassName(lComponentClass);
        var component = componentMap[componentName];
        return component == undefined ? null : component;
    };
    prototype.hasEntityComponent = function(lId, lComponentClass) {
        return this.getEntityComponent(lId, lComponentClass) != null;
    };
    /**
     *  Creates a complete data dump of the internal entity data.
     *  
     *  @param dataCallback
     */
    prototype.createEntityDataDump = function(dataCallback) {
        this.createEntityDataDumpWithSelector(this.allSelector, dataCallback);
    };
    /**
     *  Creates a data dump of the internal entity data. The result entities will
     *  be selected by the given selector function.
     *  
     *  @param selector
     *           (string) -> boolean => returns true when a given entityId should
     *           be added to the data dump else false
     *  @param dataCallback
     */
    prototype.createEntityDataDumpWithSelector = function(selector, dataCallback) {
        var data = ({});
        var entityIds = cwt.JsUtil.objectKeys(this.entities);
        for (var i = 0; i < entityIds.length; i++) {
            var entityId = entityIds[i];
            if (selector(entityId)) {
                data[entityId] = this.entities[entityId];
            }
        }
        dataCallback(JSON.stringify(data));
    };
}, {entities: {name: "Map", arguments: [null, {name: "Map", arguments: [null, "cwt.IEntityComponent"]}]}, allSelector: {name: "Function1", arguments: [null, null]}}, {});
/**
 *  
 *  <strong>This class is dynamic, so if you are going to change things here then
 *  be careful!</strong>
 */
stjs.ns("cwt");
cwt.ConstructedFactory = function() {};
stjs.extend(cwt.ConstructedFactory, null, [], function(constructor, prototype) {
    constructor.components = null;
    /**
     *  Initializes all classes which extends the {@link ConstructedClass}
     *  interface.
     */
    constructor.initObjects = function() {
        cwt.ConstructedFactory.components = {};
        var namespace = cwt.Constants.NAMESPACE;
        var objectConst = (window)["Object"];
        var objectPropertiesFn = (objectConst)["keys"];
        var namespaceObj = (window)[namespace];
        var keys = objectPropertiesFn(namespaceObj);
        for (var i = 0; i < keys.length; i++) {
            var objectName = keys[i];
            var object = ((window)[namespace])[objectName];
            if ((object).hasOwnProperty("$typeDescription")) {
                (object)["__className"] = objectName;
                ((object).prototype)["__className"] = objectName;
                var interfaces = (object)["$inherit"];
                if (interfaces.indexOf(cwt.ConstructedClass) != -1) {
                    console.log("CONSTRUCTING => " + objectName);
                    var cmp = new object();
                    cwt.ConstructedFactory.components[objectName] = cmp;
                }
            }
        }
        cwt.JsUtil.forEachMapValue(cwt.ConstructedFactory.components, function(componentName, component) {
            component.onConstruction();
        });
    };
    /**
     *  
     *  @param clazz
     *  @return the instantiated object of the given class
     *  @throws IllegalArgumentException
     *            when the given class is not registered as constructed class or
     *            when it's a member of a non supported namespace
     */
    constructor.getObject = function(clazz) {
        var value = cwt.ConstructedFactory.components[(clazz)["__className"]];
        if (undefined == value) {
            exception("IllegalArgumentException");
        }
        return value;
    };
}, {components: {name: "Map", arguments: [null, "cwt.ConstructedClass"]}}, {});
stjs.ns("cwt");
cwt.StartScreen = function() {};
stjs.extend(cwt.StartScreen, null, [cwt.ConstructedClass], function(constructor, prototype) {
    prototype.enter = function() {};
    prototype.render = function() {
        this.app.layer.clear("black").fillStyle("white").font("24pt Arial").fillText("Custom Wars: Tactics", 60, 228).fillText("Development Version", 120, 270);
    };
    prototype.keydown = function(ev) {};
}, {app: "cwt.Playground"}, {});
stjs.ns("cwt");
cwt.AssetLoader = function() {};
stjs.extend(cwt.AssetLoader, null, [cwt.ConstructedClass], function(constructor, prototype) {
    constructor.FOLDER_IMAGES = "image/cwt_tileset/units";
    constructor.FOLDER_SHEETS = "modifications/cwt/units";
    prototype.imgGrabber = null;
    prototype.sheetGrabber = null;
    prototype.onConstruction = function() {
        this.imgGrabber = new cwt.ImageConverter();
        this.sheetGrabber = new cwt.TypedObjectConverter();
    };
    prototype.loadEntry = function(app, entry, frameData) {
        this.sheetGrabber.grabData(entry, stjs.bind(this, function(sheet) {
            app.data[entry.key] = sheet;
            var spriteEntry = app.getAssetEntry("CWT_" + entry.key, cwt.AssetLoader.FOLDER_IMAGES, "png");
            this.imgGrabber.grabData(spriteEntry, function(sheetSprite) {
                var sprite = new cwt.CanvasQuery.Atlas();
                sprite.image = sheetSprite;
                sprite.frames = frameData.frames;
                app.atlases[entry.key] = sprite;
            });
        }));
    };
    prototype.loadFolder = function(app, dataClass) {};
}, {imgGrabber: "cwt.ImageConverter", sheetGrabber: {name: "cwt.TypedObjectConverter", arguments: ["cwt.UnitType"]}}, {});
/**
 *  Starter class with main function.
 */
stjs.ns("cwt");
cwt.Starter = function() {};
stjs.extend(cwt.Starter, null, [], function(constructor, prototype) {
    constructor.main = function(args) {
        cwt.ConstructedFactory.initObjects();
    };
}, {}, {});
if (!stjs.mainCallDisabled) 
    cwt.Starter.main();
stjs.ns("cwt");
cwt.OfflineCacheDataLoader = function() {};
stjs.extend(cwt.OfflineCacheDataLoader, null, [cwt.ConstructedClass], function(constructor, prototype) {
    prototype.onConstruction = function() {
        this.info("initializing cache loader");
        var config = {};
        config.driver = [localforage.INDEXEDDB, localforage.WEBSQL];
        config.name = cwt.Constants.OFFLINE_DB_NAME;
        config.size = cwt.Constants.OFFLINE_DB_SIZE;
        localforage.config(config);
    };
    prototype.loadFolderData = function(game, folder, dataClass) {
        this.info("loading data from folder " + folder);
        var data = game.getAssetEntry("__filelist__.json", folder, "json");
        localforage.getItem(data.path, stjs.bind(this, function(err, value) {
            if (value == null) {
                cwt.ConstructedFactory.getObject(cwt.BrowserService).doXmlHttpRequest(data.url, null, stjs.bind(this, function(objData, error) {
                    this.loadRemoteFolderByContentList(game, folder, JSON.parse(objData), dataClass);
                }));
            } else {
                this.loadCachedFolderByContentList(game, folder, value, dataClass);
            }
        }));
    };
    prototype.loadRemoteFolderByContentList = function(game, folder, content, dataClass) {
        cwt.JsUtil.forEachArrayValue(content, stjs.bind(this, function(index, id) {
            var data = game.getAssetEntry(id, folder, "json");
            game.loader.add(data.key);
            this.info("grabbed value from " + data.url);
            cwt.ConstructedFactory.getObject(cwt.BrowserService).doXmlHttpRequest(data.url, null, stjs.bind(this, function(objData, error) {
                this.info("parsing and validating " + data.key);
                try {
                    var type = new dataClass();
                    type.grabDataFromMapGlobal(JSON.parse(objData));
                    cwt.ConstructedFactory.getObject(cwt.GameDataService).registerDataType(type);
                    this.info("putting " + data.key + " into the cache");
                    localforage.setItem(data.key, type, function(errInner, valueInner) {
                        game.loader.success(data.key);
                    });
                }catch (e) {
                    this.warn("could not parse data type " + data.key);
                    game.loader.error(data.key);
                }
            }));
        }));
    };
    prototype.loadCachedFolderByContentList = function(game, folder, content, dataClass) {
        cwt.JsUtil.forEachArrayValue(content, stjs.bind(this, function(index, id) {
            var data = game.getAssetEntry(id, folder, "json");
            game.loader.add(data.key);
            localforage.getItem(data.key, stjs.bind(this, function(err, value) {
                this.info("grabbed value from the cache");
                var type = stjs.typefy(value, dataClass);
                cwt.ConstructedFactory.getObject(cwt.GameDataService).registerDataType(type);
                game.loader.success(data.key);
            }));
        }));
    };
}, {}, {});
stjs.ns("cwt");
cwt.ErrorScreen = function() {};
stjs.extend(cwt.ErrorScreen, null, [cwt.ConstructedClass], function(constructor, prototype) {
    prototype.errorMsg = null;
    prototype.onConstruction = function() {
        this.errorMsg = null;
    };
    prototype.enter = function() {};
    prototype.render = function() {
        this.app.layer.clear("black").fillStyle("red").font("24pt Arial").fillText("An error occured", 60, 228).fillText(this.errorMsg, 120, 270);
    };
    prototype.keyup = function(ev) {
        cwt.ConstructedFactory.getObject(cwt.SystemEvents).INPUT_ACTION.publish(this.app);
    };
}, {app: "cwt.Playground"}, {});
stjs.ns("cwt");
cwt.ISystem = function() {};
stjs.extend(cwt.ISystem, null, [], function(constructor, prototype) {
    prototype.onInit = function() {};
    prototype.entityManager = function() {
        return null;
    };
    prototype.getEntityComponent = function(id, clazz) {
        return this.entityManager().getEntityComponent(id, clazz);
    };
    prototype.events = function() {
        return cwt.ConstructedFactory.getObject(cwt.SystemEvents);
    };
    prototype.gec = function(id, clazz) {
        return this.entityManager().getEntityComponent(id, clazz);
    };
    prototype.gedtc = function(id, clazz) {
        var manager = this.entityManager();
        return manager.getEntityComponent(manager.getEntityComponent(id, cwt.DataType).typeEntity, clazz);
    };
    prototype.publishEvent = function(event) {};
}, {}, {});
stjs.ns("cwt");
cwt.Cwt = function() {};
stjs.extend(cwt.Cwt, null, [cwt.ConstructedClass], function(constructor, prototype) {
    prototype.getLoggerName = function() {
        return cwt.ClassUtil.getClassName(cwt.Cwt);
    };
    prototype.onConstruction = function() {
        cwt.PlaygroundUtil.setBasePath(this, "../");
        this.container = window.document.getElementById("game");
        this.info("initialize playground engine");
        (window)["cwtPly"] = playground(this);
    };
    prototype.preload = function() {
        this.loader.on("error", stjs.bind(this, function(error) {
            return this.error("Failed to load asset => " + error);
        }));
    };
    prototype.ready = function() {};
    prototype.error = function(msg) {
        this.warn("Got an error: " + msg);
        cwt.ConstructedFactory.getObject(cwt.ErrorScreen).errorMsg = msg;
    };
    prototype.step = function(delta) {
        cwt.ConstructedFactory.getObject(cwt.SystemEvents).FRAME_TICK.publish(delta);
    };
    prototype.render = function() {
        this.layer.clear("yellow");
    };
    /**
     *  Sets a state by it's class. The class needs to be a {@link Constructed}
     *  class.
     * 
     *  @param stateClass
     */
    prototype.setStateByClass = function(stateClass) {
        this.setState(cwt.ConstructedFactory.getObject(stateClass));
    };
    prototype.enterstate = function(event) {
        this.info("enter state " + cwt.ClassUtil.getClassName(event.state));
    };
    prototype.keydown = function(ev) {
        cwt.ConstructedFactory.getObject(cwt.SystemEvents).INPUT_CANCEL.publish(this);
    };
    prototype.leavestate = function(event) {
        this.info("leaving state " + cwt.ClassUtil.getClassName(event.state));
    };
}, {atlases: {name: "Map", arguments: [null, "cwt.CanvasQuery.Atlas"]}, container: "Element", data: {name: "Map", arguments: [null, "Object"]}, images: {name: "Map", arguments: [null, "Canvas"]}, keyboard: "cwt.Playground.KeyboardStatus", layer: "cwt.CanvasQuery", loader: "cwt.Playground.Loader", mouse: "cwt.Playground.MouseStatus", music: "cwt.Playground.SoundActions", paths: "cwt.Playground.ResourcePaths", pointers: {name: "Array", arguments: ["cwt.Playground.PointerEvent"]}, sound: "cwt.Playground.SoundActions", touch: "cwt.Playground.TouchStatus", state: "cwt.PlaygroundState"}, {});
stjs.ns("cwt");
cwt.PlayerSys = function() {};
stjs.extend(cwt.PlayerSys, null, [cwt.ISystem], function(constructor, prototype) {
    prototype.onInit = function() {
        this.events().UNIT_DESTROYED.subscribe(stjs.bind(this, function(unit) {
            var ownC = this.entityManager().getEntityComponent(unit, cwt.OwnableCmp);
            this.entityManager().getEntityComponent(ownC.owner, cwt.Player).numOfUnits--;
        }));
        this.events().UNIT_CREATED.subscribe(stjs.bind(this, function(unit) {
            var ownC = this.entityManager().getEntityComponent(unit, cwt.OwnableCmp);
            this.entityManager().getEntityComponent(ownC.owner, cwt.Player).numOfUnits++;
        }));
    };
}, {}, {});
stjs.ns("cwt");
cwt.WaitAction = function() {};
stjs.extend(cwt.WaitAction, null, [cwt.ISystem], function(constructor, prototype) {
    prototype.onInit = function() {
        this.events().CLICK_ON_TILE.subscribe(stjs.bind(this, function(tile, property, unit) {
            var entry = this.gec("MENU", cwt.MenuCmp).entries[0];
            entry.enabled = true;
            entry.key = cwt.ClassUtil.getClassName(cwt.WaitAction);
        }));
        this.events().INVOKE_ACTION.subscribe(stjs.bind(this, function(action, p1, p2, p3) {
            if (action == cwt.ClassUtil.getClassName(cwt.WaitAction)) {
                this.gec(p1, cwt.SingleUse).used = true;
                this.events().OBJECT_WAITS.publish(p1);
            }
        }));
    };
}, {}, {});
stjs.ns("cwt");
cwt.WeatherSys = function() {};
stjs.extend(cwt.WeatherSys, null, [cwt.ISystem], function(constructor, prototype) {
    prototype.onInit = function() {
        this.events().WEATHER_CHANGES.subscribe(stjs.bind(this, function(weather, days) {
            return this.changeWeather(weather, days);
        }));
    };
    prototype.changeWeather = function(weather, duration) {
        this.gec(cwt.EntityId.GAME_ROUND, cwt.WeatherDurationCmp).days = duration;
        this.entityManager().detachEntityComponentByClass(cwt.EntityId.GAME_ROUND, cwt.WeatherCmp);
        this.entityManager().attachEntityComponent(cwt.EntityId.GAME_ROUND, this.getEntityComponent(weather, cwt.WeatherCmp));
        this.events().WEATHER_CHANGED.publish(weather);
    };
}, {}, {});
stjs.ns("cwt");
cwt.FactorySys = function() {};
stjs.extend(cwt.FactorySys, null, [cwt.ISystem], function(constructor, prototype) {
    prototype.onInit = function() {};
    prototype.isFactory = function(factoryId) {
        return this.entityManager().hasEntityComponent(factoryId, cwt.FactoryCmp);
    };
    /**
     *  
     *  @param factoryId
     *           entity id of the factory
     *  @param type
     *           wanted unit type that will be produced
     */
    prototype.buildUnit = function(factoryId, type) {
        if (!this.isFactory(factoryId)) {
            this.events().ERROR_RAISED.publish("EntityIsNoFactory");
        }
        var factoryData = this.getEntityComponent(factoryId, cwt.FactoryCmp);
        if (factoryData.builds.indexOf(type) == -1) {
            this.events().ERROR_RAISED.publish("GivenTypeIsNotProcuceAble");
        }
        var factoryPos = this.getEntityComponent(factoryId, cwt.Positionable);
        var factoryOwner = this.getEntityComponent(factoryId, cwt.OwnableCmp);
        var unitEntity = this.entityManager().acquireEntity();
        var unitPos = this.entityManager().acquireEntityComponent(unitEntity, cwt.Positionable);
        var unitOwner = this.entityManager().acquireEntityComponent(unitEntity, cwt.OwnableCmp);
        var typeComponents = this.entityManager().getEntityComponents(type);
        for (var i = 0; i < typeComponents.length; i++) {
            this.entityManager().attachEntityComponent(unitEntity, typeComponents[i]);
        }
        unitPos.x = factoryPos.x;
        unitPos.y = factoryPos.y;
        unitOwner.owner = factoryOwner.owner;
        this.events().UNIT_PRODUCED.publish(unitEntity, type, unitPos.x, unitPos.y);
    };
}, {}, {});
stjs.ns("cwt");
cwt.Battle = function() {};
stjs.extend(cwt.Battle, null, [cwt.ISystem], function(constructor, prototype) {
    prototype.onInit = function() {};
}, {}, {});
stjs.ns("cwt");
cwt.TypeSys = function() {};
stjs.extend(cwt.TypeSys, null, [cwt.ISystem, cwt.ConstructedClass], function(constructor, prototype) {
    prototype.requiredUnitComponents = null;
    prototype.optionalUnitComponents = null;
    prototype.onConstruction = function() {
        this.requiredUnitComponents = [];
        this.requiredUnitComponents.push(cwt.MovingAbilityCmp);
        this.requiredUnitComponents.push(cwt.MovingCostsCmp);
        this.requiredUnitComponents.push(cwt.VisionerCmp);
        this.optionalUnitComponents = [];
        this.optionalUnitComponents.push(cwt.FuelDrainerCmp);
        this.optionalUnitComponents.push(cwt.HidableCmp);
        this.optionalUnitComponents.push(cwt.SuicideCmp);
        this.optionalUnitComponents.push(cwt.SupplierCmp);
        this.optionalUnitComponents.push(cwt.RepairerCmp);
        this.optionalUnitComponents.push(cwt.TransportCmp);
        this.optionalUnitComponents.push(cwt.DirectFighting);
        this.optionalUnitComponents.push(cwt.IndirectFighting);
        this.optionalUnitComponents.push(cwt.BuyableCmp);
        this.optionalUnitComponents.push(cwt.CapturableCmp);
        this.optionalUnitComponents.push(cwt.MainWeaponDamageMap);
        this.optionalUnitComponents.push(cwt.SecondaryWeaponDamageMap);
    };
    prototype.createUnitType = function(data) {
        var id = data["ID"];
        this.entityManager().acquireEntityWithId(id);
    };
    prototype.parseTypeComponents = function(entityId, data, requiredComponents, optionalComponents) {
        try {}catch (e) {
            this.events().ERROR_RAISED.publish("CouldNotReadType: " + JSON.stringify(data));
        }
    };
}, {requiredUnitComponents: {name: "Array", arguments: [{name: "Class", arguments: ["Object"]}]}, optionalUnitComponents: {name: "Array", arguments: [{name: "Class", arguments: ["Object"]}]}}, {});
stjs.ns("cwt");
cwt.MapRenderer = function() {};
stjs.extend(cwt.MapRenderer, null, [cwt.ISystem, cwt.ConstructedClass], function(constructor, prototype) {
    prototype.appRef = null;
    prototype.onConstruction = function() {
        this.events().INIT_ENGINE.subscribe(stjs.bind(this, function(app) {
            this.appRef = app;
        }));
        this.events().INPUT_CANCEL.subscribe(stjs.bind(this, function(app) {
            this.info("CLICK");
            var r = parseInt(255 * Math.random(), 10);
            var g = parseInt(255 * Math.random(), 10);
            var b = parseInt(255 * Math.random(), 10);
            var color = "rgb(" + [r, g, b].join(", ") + ")";
            this.info("NEW COLOR: " + color);
            app.layer.clear(color);
        }));
    };
}, {appRef: "cwt.Playground"}, {});
stjs.ns("cwt");
cwt.MenuSys = function() {};
stjs.extend(cwt.MenuSys, null, [cwt.ISystem], function(constructor, prototype) {
    prototype.onInit = function() {
        this.entityManager().acquireEntityWithId("MENU");
        this.entityManager().acquireEntityComponent("MENU", cwt.MenuCmp);
    };
}, {}, {});
stjs.ns("cwt");
cwt.Move = function() {};
stjs.extend(cwt.Move, null, [cwt.ISystem], function(constructor, prototype) {
    prototype.moveEntity = function(id, path) {
        var posC = this.entityManager().getEntityComponent(id, cwt.Positionable);
        var moveableC = this.entityManager().getEntityComponent(id, cwt.MovingAbilityCmp);
        var cX = posC.x;
        var cY = posC.y;
        var oX = cX;
        var oY = cY;
        var cFuel = moveableC.fuel;
        posC.x = cX;
        posC.y = cY;
        this.publishEvent("unit/moved");
    };
}, {}, {});
stjs.ns("cwt");
cwt.Health = function() {};
stjs.extend(cwt.Health, null, [cwt.ISystem], function(constructor, prototype) {
    prototype.onInit = function() {
        this.events().INFLICTS_DAMAGE.subscribe(stjs.bind(this, function(attacker, defender, damage) {
            return this.damageEntity(defender, damage, 0);
        }));
    };
    /**
     *  Damages an unit object.
     *  
     *  @param id
     *           entity id
     *  @param amount
     *           amount of damage
     *  @param minRest
     */
    prototype.damageEntity = function(id, amount, minRest) {
        var hpC = this.grabHealthComponent(id);
        hpC.hp -= amount;
        if (hpC.hp < 0) {
            hpC.hp = 0;
        }
        this.events().UNIT_DAMAGED.publish(id, amount);
    };
    /**
     *  Heals an unit object.
     *  
     *  @param id
     *           entity id
     *  @param amount
     *           amount of healing in health
     */
    prototype.healEntity = function(id, amount) {
        var hpC = this.grabHealthComponent(id);
        hpC.hp += amount;
        if (hpC.hp > 99) {
            hpC.hp = 99;
        }
        this.events().UNIT_HEALED.publish(id, amount);
    };
    prototype.grabHealthComponent = function(id) {
        var hpC = this.entityManager().getEntityComponent(id, cwt.HealthComponent);
        return hpC;
    };
}, {}, {});
