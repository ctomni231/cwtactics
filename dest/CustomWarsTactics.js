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
}, {app: "cwt.Playground"}, {});
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
cwt.Modification = function() {};
stjs.extend(cwt.Modification, null, [], function(constructor, prototype) {
    prototype.sounds = null;
    prototype.musics = null;
    prototype.maps = null;
}, {sounds: {name: "Map", arguments: [null, null]}, musics: {name: "Map", arguments: [null, null]}, maps: {name: "Array", arguments: [null]}}, {});
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
cwt.Color = function() {};
stjs.extend(cwt.Color, null, [], function(constructor, prototype) {}, {}, {});
stjs.ns("cwt");
cwt.GameMode = stjs.enumeration("ADVANCE_WARS_1", "ADVANCE_WARS_2");
stjs.ns("cwt");
cwt.Colors = function() {};
stjs.extend(cwt.Colors, null, [], function(constructor, prototype) {}, {}, {});
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
}, {app: "cwt.Playground"}, {});
stjs.ns("cwt");
cwt.StartScreen = function() {};
stjs.extend(cwt.StartScreen, null, [cwt.ConstructedClass], function(constructor, prototype) {
    prototype.enter = function() {};
    prototype.render = function() {
        this.app.layer.clear("black").fillStyle("white").font("24pt Arial").fillText("Custom Wars: Tactics", 60, 228).fillText("Development Version", 120, 270);
    };
}, {app: "cwt.Playground"}, {});
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
cwt.Cwt = function() {};
stjs.extend(cwt.Cwt, null, [cwt.ConstructedClass], function(constructor, prototype) {
    prototype.getLoggerName = function() {
        return cwt.ClassUtil.getClassName(cwt.Cwt);
    };
    prototype.onConstruction = function() {
        cwt.PlaygroundUtil.setBasePath(this, "../modifications/cwt/");
        this.container = window.document.getElementById("game");
        this.info("initialize playground engine");
        (window)["cwtPly"] = playground(this);
    };
    prototype.preload = function() {
        this.loader.on("error", stjs.bind(this, function(error) {
            return this.error("Failed to load asset => " + error);
        }));
        var offlineDataLoader = cwt.ConstructedFactory.getObject(cwt.OfflineCacheDataLoader);
        offlineDataLoader.loadFolderData(this, "armies", cwt.ArmyType);
        offlineDataLoader.loadFolderData(this, "cos", cwt.CoType);
        offlineDataLoader.loadFolderData(this, "tiles", cwt.TileType);
        offlineDataLoader.loadFolderData(this, "props", cwt.PropertyType);
        offlineDataLoader.loadFolderData(this, "movetypes", cwt.MoveType);
        offlineDataLoader.loadFolderData(this, "units", cwt.UnitType);
        offlineDataLoader.loadFolderData(this, "weathers", cwt.WeatherType);
    };
    prototype.ready = function() {
        var hasErrors = cwt.ConstructedFactory.getObject(cwt.ErrorScreen).errorMsg != null;
        this.setStateByClass(hasErrors ? cwt.ErrorScreen : cwt.StartScreen);
    };
    prototype.error = function(msg) {
        this.warn("Got an error: " + msg);
        cwt.ConstructedFactory.getObject(cwt.ErrorScreen).errorMsg = msg;
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
    prototype.leavestate = function(event) {
        this.info("leaving state " + cwt.ClassUtil.getClassName(event.state));
    };
}, {atlases: {name: "Map", arguments: [null, "cwt.CanvasQuery.Atlas"]}, container: "Element", data: {name: "Map", arguments: [null, "Object"]}, images: {name: "Map", arguments: [null, "Canvas"]}, keyboard: "cwt.Playground.KeyboardStatus", layer: "cwt.CanvasQuery", loader: "cwt.Playground.Loader", mouse: "cwt.Playground.MouseStatus", music: "cwt.Playground.SoundActions", paths: "cwt.Playground.ResourcePaths", pointers: {name: "Array", arguments: ["cwt.Playground.PointerEvent"]}, sound: "cwt.Playground.SoundActions", touch: "cwt.Playground.TouchStatus", state: "cwt.PlaygroundState"}, {});
