stjs.ns("cwt");
cwt.IEntityComponent = function() {};
stjs.extend(cwt.IEntityComponent, null, [], null, {}, {});
stjs.ns("cwt");
cwt.ScreenSystem = function() {};
stjs.extend(cwt.ScreenSystem, null, [], null, {}, {});
stjs.ns("cwt");
cwt.IEvent = function() {};
stjs.extend(cwt.IEvent, null, [], null, {}, {});
stjs.ns("cwt");
cwt.ConstructedClass = function() {};
stjs.extend(cwt.ConstructedClass, null, [], function(constructor, prototype) {
    prototype.onConstruction = function() {};
}, {}, {});
stjs.ns("cwt");
cwt.Constants = function() {};
stjs.extend(cwt.Constants, null, [], function(constructor, prototype) {
    constructor.UNIT_HEALTH = 99;
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
    constructor.MAX_MAP_SIDE_LENGTH = 50;
}, {}, {});
stjs.ns("cwt");
cwt.FireableCmp = function() {};
stjs.extend(cwt.FireableCmp, null, [], function(constructor, prototype) {
    prototype.damage = 0;
    prototype.range = 0;
    prototype.fireableBy = null;
}, {fireableBy: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.ConstructedObject = function() {};
stjs.extend(cwt.ConstructedObject, null, [], function(constructor, prototype) {
    prototype.onConstruction = function(instance) {};
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
    constructor.urlParameters = null;
    constructor.getUrlParameterMap = function() {
        if (cwt.BrowserUtil.urlParameters == null) {
            cwt.BrowserUtil.urlParameters = {};
            var parts = (window.document.location.search.substring(1)).split("&");
            for (var i = 0; i < parts.length; i++) {
                var nv = (parts[i]).split("=");
                if (!((nv[0]))) {
                    continue;
                }
                cwt.BrowserUtil.urlParameters[nv[0]] = (nv[1] || true);
            }
        }
        return cwt.BrowserUtil.urlParameters;
    };
}, {urlParameters: {name: "Map", arguments: [null, null]}}, {});
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
cwt.Color = function() {};
stjs.extend(cwt.Color, null, [], function(constructor, prototype) {}, {}, {});
stjs.ns("cwt");
cwt.ArmyCmp = function() {};
stjs.extend(cwt.ArmyCmp, null, [], function(constructor, prototype) {
    prototype.name = null;
}, {}, {});
stjs.ns("cwt");
cwt.CoCmp = function() {};
stjs.extend(cwt.CoCmp, null, [], function(constructor, prototype) {
    prototype.name = null;
    prototype.coStars = 0;
    prototype.scoStars = 0;
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
cwt.DevBlockConstruction = function() {};
stjs.extend(cwt.DevBlockConstruction, null, [], null, {}, {});
stjs.ns("cwt");
cwt.HealthSystem = function() {};
stjs.extend(cwt.HealthSystem, null, [], null, {}, {});
stjs.ns("cwt");
cwt.Colors = function() {};
stjs.extend(cwt.Colors, null, [], function(constructor, prototype) {}, {}, {});
stjs.ns("cwt");
cwt.EntityId = function() {};
stjs.extend(cwt.EntityId, null, [], function(constructor, prototype) {
    constructor.GAME_ROUND = "GAME_ROUND";
    constructor.UNIT = "UNIT_";
    constructor.PROPERTY = "PROPERTY_";
    constructor.getUnitEntityId = function(number) {
        return cwt.EntityId.UNIT + number;
    };
    constructor.getPropertyEntityId = function(number) {
        return cwt.EntityId.PROPERTY + number;
    };
    constructor.getTileEntityId = function(x, y) {
        return "TILE_" + x + "_" + y;
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
cwt.RenderableCmp = function() {};
stjs.extend(cwt.RenderableCmp, null, [], null, {}, {});
stjs.ns("cwt");
cwt.MapRendererSystem = function() {};
stjs.extend(cwt.MapRendererSystem, null, [], null, {}, {});
stjs.ns("cwt");
cwt.ITest = function() {};
stjs.extend(cwt.ITest, null, [], null, {}, {});
stjs.ns("cwt");
cwt.MenuSys = function() {};
stjs.extend(cwt.MenuSys, null, [], null, {}, {});
stjs.ns("cwt");
cwt.Modification = function() {};
stjs.extend(cwt.Modification, null, [], function(constructor, prototype) {
    prototype.sounds = null;
    prototype.musics = null;
    prototype.maps = null;
}, {sounds: {name: "Map", arguments: [null, null]}, musics: {name: "Map", arguments: [null, null]}, maps: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.TimeLimitComponents = function() {};
stjs.extend(cwt.TimeLimitComponents, null, [], function(constructor, prototype) {
    prototype.turnTimeLimit = 0;
    prototype.gameTimeLimit = 0;
}, {}, {});
stjs.ns("cwt");
cwt.NumberUtil = function() {};
stjs.extend(cwt.NumberUtil, null, [], function(constructor, prototype) {
    constructor.getRandomInt = function(max) {
        return parseInt((stjs.trunc(Math.random())) * max, 10);
    };
}, {}, {});
stjs.ns("cwt");
cwt.CapturerCmp = function() {};
stjs.extend(cwt.CapturerCmp, null, [], function(constructor, prototype) {
    prototype.points = 0;
}, {}, {});
stjs.ns("cwt");
cwt.TransportContainerCmp = function() {};
stjs.extend(cwt.TransportContainerCmp, null, [], function(constructor, prototype) {
    prototype.loads = null;
}, {loads: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.TypeSys = function() {};
stjs.extend(cwt.TypeSys, null, [], null, {}, {});
stjs.ns("cwt");
cwt.PlayerSys = function() {};
stjs.extend(cwt.PlayerSys, null, [], null, {}, {});
stjs.ns("cwt");
cwt.AssetLoader = function() {};
stjs.extend(cwt.AssetLoader, null, [], null, {}, {});
stjs.ns("cwt");
cwt.FundsCmp = function() {};
stjs.extend(cwt.FundsCmp, null, [], function(constructor, prototype) {
    prototype.funds = 0;
}, {}, {});
stjs.ns("cwt");
cwt.WaitAction = function() {};
stjs.extend(cwt.WaitAction, null, [], function(constructor, prototype) {
    prototype.onConstruction = function() {};
}, {}, {});
stjs.ns("cwt");
cwt.LaserCmp = function() {};
stjs.extend(cwt.LaserCmp, null, [], function(constructor, prototype) {
    prototype.damage = 0;
}, {}, {});
stjs.ns("cwt");
cwt.Tile = function() {};
stjs.extend(cwt.Tile, null, [], function(constructor, prototype) {
    prototype.defense = 0;
    prototype.blocksVision = false;
}, {}, {});
stjs.ns("cwt");
cwt.GameModeCmp = function() {};
stjs.extend(cwt.GameModeCmp, null, [], function(constructor, prototype) {
    constructor.GameMode = stjs.enumeration("AW1", "AW2");
    prototype.mode = null;
}, {mode: {name: "Enum", arguments: ["cwt.GameModeCmp.GameMode"]}}, {});
stjs.ns("cwt");
cwt.Turn = function() {};
stjs.extend(cwt.Turn, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.owner = null;
    prototype.day = 0;
    prototype.turn = 0;
}, {}, {});
stjs.ns("cwt");
cwt.FuelDrainerCmp = function() {};
stjs.extend(cwt.FuelDrainerCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.drain = 0;
}, {}, {});
stjs.ns("cwt");
cwt.HidableCmp = function() {};
stjs.extend(cwt.HidableCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.hidden = false;
    prototype.dailyFuelDrainHidden = 0;
}, {}, {});
stjs.ns("cwt");
cwt.Capturable = function() {};
stjs.extend(cwt.Capturable, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.points = 0;
    prototype.looseAfterCaptured = false;
    prototype.changeIntoAfterCaptured = null;
}, {}, {});
stjs.ns("cwt");
cwt.MovingAbilityCmp = function() {};
stjs.extend(cwt.MovingAbilityCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.fuel = 0;
    prototype.range = 0;
    prototype.movetype = null;
}, {}, {});
stjs.ns("cwt");
cwt.ValueMetaData = function() {};
stjs.extend(cwt.ValueMetaData, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.lowerBound = 0;
    prototype.upperBound = 0;
    prototype.changeValue = 0;
    prototype.defaultValue = 0;
}, {}, {});
stjs.ns("cwt");
cwt.SuicideCmp = function() {};
stjs.extend(cwt.SuicideCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.damage = 0;
    prototype.range = 0;
    prototype.noDamage = null;
}, {noDamage: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.Manpower = function() {};
stjs.extend(cwt.Manpower, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.manpower = 0;
}, {}, {});
stjs.ns("cwt");
cwt.SingleUse = function() {};
stjs.extend(cwt.SingleUse, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.used = false;
}, {}, {});
stjs.ns("cwt");
cwt.Suicide = function() {};
stjs.extend(cwt.Suicide, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.damage = 0;
    prototype.range = 0;
    prototype.noDamage = null;
}, {noDamage: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.Weather = function() {};
stjs.extend(cwt.Weather, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.defaultWeather = false;
}, {}, {});
stjs.ns("cwt");
cwt.DataType = function() {};
stjs.extend(cwt.DataType, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.typeEntity = null;
}, {}, {});
stjs.ns("cwt");
cwt.TimerData = function() {};
stjs.extend(cwt.TimerData, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.turnTime = 0;
    prototype.gameTime = 0;
    prototype.turnTimeLimit = 0;
    prototype.gameTimeLimit = 0;
}, {}, {});
stjs.ns("cwt");
cwt.Movable = function() {};
stjs.extend(cwt.Movable, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.range = 0;
    prototype.fuel = 0;
    prototype.type = null;
}, {}, {});
stjs.ns("cwt");
cwt.MovingCosts = function() {};
stjs.extend(cwt.MovingCosts, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.costs = null;
}, {costs: {name: "Map", arguments: [null, null]}}, {});
stjs.ns("cwt");
cwt.Supplier = function() {};
stjs.extend(cwt.Supplier, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.refillLoads = false;
    prototype.supplies = null;
}, {supplies: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.Factory = function() {};
stjs.extend(cwt.Factory, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.builds = null;
}, {builds: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.Config = function() {};
stjs.extend(cwt.Config, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.value = 0;
}, {}, {});
stjs.ns("cwt");
cwt.FighterPrimaryWeapon = function() {};
stjs.extend(cwt.FighterPrimaryWeapon, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.ammo = 0;
    prototype.damage = null;
}, {damage: {name: "Map", arguments: [null, null]}}, {});
stjs.ns("cwt");
cwt.Repairer = function() {};
stjs.extend(cwt.Repairer, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.amount = 0;
    prototype.targets = null;
}, {targets: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.Movemap = function() {};
stjs.extend(cwt.Movemap, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.top = 0;
    prototype.left = 0;
    prototype.data = null;
}, {data: {name: "Array", arguments: [{name: "Array", arguments: [null]}]}}, {});
stjs.ns("cwt");
cwt.Sprite = function() {};
stjs.extend(cwt.Sprite, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.sprite = null;
}, {}, {});
stjs.ns("cwt");
cwt.RepairerCmp = function() {};
stjs.extend(cwt.RepairerCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.repairs = null;
}, {repairs: {name: "Map", arguments: [null, null]}}, {});
stjs.ns("cwt");
cwt.Defense = function() {};
stjs.extend(cwt.Defense, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.defense = 0;
}, {}, {});
stjs.ns("cwt");
cwt.Visible = function() {};
stjs.extend(cwt.Visible, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.blocksVision = false;
}, {}, {});
stjs.ns("cwt");
cwt.Buyable = function() {};
stjs.extend(cwt.Buyable, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.cost = 0;
}, {}, {});
stjs.ns("cwt");
cwt.MenuComponent = function() {
    this.entries = [];
    for (var i = 0; i < cwt.MenuComponent.MENU_SIZE; i++) {
        this.entries.push({});
    }
};
stjs.extend(cwt.MenuComponent, null, [cwt.IEntityComponent], function(constructor, prototype) {
    constructor.MENU_SIZE = 10;
    constructor.MenuEntry = function() {};
    stjs.extend(cwt.MenuComponent.MenuEntry, null, [], function(constructor, prototype) {
        prototype.key = null;
        prototype.disabled = false;
    }, {}, {});
    prototype.entries = null;
    prototype.clear = function() {
        for (var i = 0; i < cwt.MenuComponent.MENU_SIZE; i++) {
            var entry = this.entries[i];
            entry.key = null;
            entry.disabled = false;
        }
    };
    /**
     *  Adds an menu entry.
     *  
     *  @param key
     *  @param disabled
     *  @return true when added, else false
     */
    prototype.addEntry = function(key, disabled) {
        for (var i = 0; i < cwt.MenuComponent.MENU_SIZE; i++) {
            var entry = this.entries[i];
            if (entry.key == null) {
                entry.key = key;
                entry.disabled = disabled;
                return true;
            }
        }
        return false;
    };
}, {entries: {name: "Array", arguments: ["cwt.MenuComponent.MenuEntry"]}}, {});
stjs.ns("cwt");
cwt.TransportCmp = function() {};
stjs.extend(cwt.TransportCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.maxloads = 0;
    prototype.canload = null;
}, {canload: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.Army = function() {};
stjs.extend(cwt.Army, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.name = null;
    prototype.color = 0;
    prototype.music = null;
}, {}, {});
stjs.ns("cwt");
cwt.Vision = function() {};
stjs.extend(cwt.Vision, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.range = 0;
}, {}, {});
stjs.ns("cwt");
cwt.Position = function() {};
stjs.extend(cwt.Position, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.x = 0;
    prototype.y = 0;
}, {}, {});
stjs.ns("cwt");
cwt.FuelDrain = function() {};
stjs.extend(cwt.FuelDrain, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.daily = 0;
}, {}, {});
stjs.ns("cwt");
cwt.Funds = function() {};
stjs.extend(cwt.Funds, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.amount = 0;
}, {}, {});
stjs.ns("cwt");
cwt.Living = function() {};
stjs.extend(cwt.Living, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.hp = 0;
}, {}, {});
stjs.ns("cwt");
cwt.CapturableCmp = function() {};
stjs.extend(cwt.CapturableCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.points = 0;
}, {}, {});
stjs.ns("cwt");
cwt.HideAble = function() {};
stjs.extend(cwt.HideAble, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.additionFuelDrain = 0;
}, {}, {});
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
cwt.Transporter = function() {};
stjs.extend(cwt.Transporter, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.slots = 0;
    prototype.loads = null;
}, {loads: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.FighterSecondaryWeapon = function() {};
stjs.extend(cwt.FighterSecondaryWeapon, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.damage = null;
}, {damage: {name: "Map", arguments: [null, null]}}, {});
stjs.ns("cwt");
cwt.SupplierCmp = function() {};
stjs.extend(cwt.SupplierCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.supplies = null;
}, {supplies: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.UsableComponent = function() {};
stjs.extend(cwt.UsableComponent, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.used = false;
}, {}, {});
stjs.ns("cwt");
cwt.Owner = function() {};
stjs.extend(cwt.Owner, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.owner = null;
}, {}, {});
stjs.ns("cwt");
cwt.MovingCmp = function() {};
stjs.extend(cwt.MovingCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.fuel = 0;
}, {}, {});
stjs.ns("cwt");
cwt.WeatherData = function() {};
stjs.extend(cwt.WeatherData, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.days = 0;
    prototype.weather = null;
}, {}, {});
stjs.ns("cwt");
cwt.FireAble = function() {};
stjs.extend(cwt.FireAble, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.usableBy = null;
    prototype.damage = 0;
    prototype.range = 0;
    prototype.changesType = null;
}, {usableBy: {name: "Array", arguments: [null]}}, {});
stjs.ns("cwt");
cwt.VisionerCmp = function() {};
stjs.extend(cwt.VisionerCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.vision = 0;
}, {}, {});
stjs.ns("cwt");
cwt.Capturer = function() {};
stjs.extend(cwt.Capturer, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.points = 0;
}, {}, {});
stjs.ns("cwt");
cwt.MovingCostsCmp = function() {};
stjs.extend(cwt.MovingCostsCmp, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.costs = null;
}, {costs: {name: "Map", arguments: [null, null]}}, {});
stjs.ns("cwt");
cwt.TileMap = function() {};
stjs.extend(cwt.TileMap, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.tiles = null;
    prototype.getTileAt = function(x, y) {
        return this.tiles[x][y];
    };
}, {tiles: {name: "Array", arguments: [{name: "Array", arguments: [null]}]}}, {});
stjs.ns("cwt");
cwt.RangedFighter = function() {};
stjs.extend(cwt.RangedFighter, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.maxRange = 0;
    prototype.minRange = 0;
}, {}, {});
stjs.ns("cwt");
cwt.GameEndEvent = function() {};
stjs.extend(cwt.GameEndEvent, null, [cwt.IEvent], function(constructor, prototype) {
    prototype.onGameEnd = function() {};
}, {}, {});
stjs.ns("cwt");
cwt.LoadEntityEvent = function() {};
stjs.extend(cwt.LoadEntityEvent, null, [cwt.IEvent], function(constructor, prototype) {
    constructor.TYPE_UNIT = "UNIT";
    constructor.TYPE_UNIT_DATA = "UNIT_TYPE";
    constructor.TYPE_TILE_DATA = "TILE_TYPE";
    constructor.TYPE_PROPERTY_DATA = "PROPERTY_TYPE";
    constructor.TYPE_WEATHER_DATA = "WEATHER_TYPE";
    constructor.TYPE_MOVETYPE_DATA = "MOVETYPE_TYPE";
    constructor.TYPE_CO_DATA = "CO_TYPE";
    constructor.TYPE_ARMY_DATA = "ARMY_TYPE";
    prototype.onLoadEntity = function(entity, entityType, data) {};
    prototype.onLoadedEntity = function(entity, type) {};
}, {}, {});
stjs.ns("cwt");
cwt.UnitProducedEvent = function() {};
stjs.extend(cwt.UnitProducedEvent, null, [cwt.IEvent], function(constructor, prototype) {
    prototype.onUnitProduced = function(factory, unit, type) {};
}, {}, {});
stjs.ns("cwt");
cwt.ErrorEvent = function() {};
stjs.extend(cwt.ErrorEvent, null, [cwt.IEvent], function(constructor, prototype) {
    prototype.onIllegalGameData = function(message) {};
}, {}, {});
stjs.ns("cwt");
cwt.UnitCreatedEvent = function() {};
stjs.extend(cwt.UnitCreatedEvent, null, [cwt.IEvent], function(constructor, prototype) {
    prototype.onUnitCreated = function(unitEntity) {};
}, {}, {});
stjs.ns("cwt");
cwt.WeatherChangesEvent = function() {};
stjs.extend(cwt.WeatherChangesEvent, null, [cwt.IEvent], function(constructor, prototype) {
    prototype.onWeatherChanges = function(weather, duration) {};
}, {}, {});
stjs.ns("cwt");
cwt.SystemStartEvent = function() {};
stjs.extend(cwt.SystemStartEvent, null, [cwt.IEvent], function(constructor, prototype) {
    prototype.onSystemInitialized = function() {};
    prototype.onSystemStartup = function(gameContainer) {};
}, {}, {});
stjs.ns("cwt");
cwt.TurnEndEvent = function() {};
stjs.extend(cwt.TurnEndEvent, null, [cwt.IEvent], function(constructor, prototype) {
    prototype.onTurnEnd = function() {};
}, {}, {});
stjs.ns("cwt");
cwt.ObjectChangeTypeEvent = function() {};
stjs.extend(cwt.ObjectChangeTypeEvent, null, [cwt.IEvent], function(constructor, prototype) {
    prototype.onObjectGetsType = function(object, type) {};
}, {}, {});
stjs.ns("cwt");
cwt.DayStartEvent = function() {};
stjs.extend(cwt.DayStartEvent, null, [cwt.IEvent], function(constructor, prototype) {
    prototype.onDayStart = function(day) {};
}, {}, {});
stjs.ns("cwt");
cwt.NextFrameEvent = function() {};
stjs.extend(cwt.NextFrameEvent, null, [cwt.IEvent], function(constructor, prototype) {
    prototype.onNextFrame = function(delta) {};
}, {}, {});
stjs.ns("cwt");
cwt.PositionEvent = function() {};
stjs.extend(cwt.PositionEvent, null, [cwt.IEvent], function(constructor, prototype) {
    prototype.onUnitPlacedAtProperty = function(unit, property) {};
    prototype.onUnitPlacedAtTile = function(unit, tile) {};
    prototype.onUnitPlacedAtPosition = function(unit, x, y) {};
}, {}, {});
stjs.ns("cwt");
cwt.MoveEvent = function() {};
stjs.extend(cwt.MoveEvent, null, [cwt.IEvent], function(constructor, prototype) {
    prototype.onUnitMove = function(unit, steps) {};
    prototype.onUnitMoved = function(unit, fromX, fromY, toX, toY) {};
}, {}, {});
stjs.ns("cwt");
cwt.ClickEvent = function() {};
stjs.extend(cwt.ClickEvent, null, [cwt.IEvent], function(constructor, prototype) {
    prototype.onClick = function(type, x, y) {};
}, {}, {});
stjs.ns("cwt");
cwt.UnitDestroyedEvent = function() {};
stjs.extend(cwt.UnitDestroyedEvent, null, [cwt.IEvent], function(constructor, prototype) {
    prototype.onUnitDestroyed = function(unitEntity) {};
}, {}, {});
stjs.ns("cwt");
cwt.ActionInvokedEvent = function() {};
stjs.extend(cwt.ActionInvokedEvent, null, [cwt.IEvent], function(constructor, prototype) {
    prototype.onBuildUnit = function(factory, type) {};
    prototype.onInvokeAction = function(action, pstr, p1, p2, p3, p4, p5) {};
}, {}, {});
stjs.ns("cwt");
cwt.TurnStartEvent = function() {};
stjs.extend(cwt.TurnStartEvent, null, [cwt.IEvent], function(constructor, prototype) {
    prototype.onTurnStart = function(player, turn) {};
}, {}, {});
stjs.ns("cwt");
cwt.ConfigUpdateEvent = function() {};
stjs.extend(cwt.ConfigUpdateEvent, null, [cwt.IEvent], function(constructor, prototype) {
    prototype.onConfigUpdate = function(configName, increaseValue) {};
}, {}, {});
stjs.ns("cwt");
cwt.FogEvent = function() {};
stjs.extend(cwt.FogEvent, null, [cwt.IEvent], function(constructor, prototype) {
    prototype.onTileVisionChanges = function(x, y, visible) {};
}, {}, {});
stjs.ns("cwt");
cwt.GameStartEvent = function() {};
stjs.extend(cwt.GameStartEvent, null, [cwt.IEvent], function(constructor, prototype) {
    prototype.onGameStart = function() {};
}, {}, {});
stjs.ns("cwt");
cwt.OwnerChangeEvent = function() {};
stjs.extend(cwt.OwnerChangeEvent, null, [cwt.IEvent], function(constructor, prototype) {
    prototype.onUnitGetsPropertyOwner = function(unit, factory) {};
}, {}, {});
stjs.ns("cwt");
cwt.CaptureEvents = function() {};
stjs.extend(cwt.CaptureEvents, null, [cwt.IEvent], function(constructor, prototype) {
    prototype.onLoweredCapturePoints = function(capturer, property, leftPoints) {};
    prototype.onCapturedProperty = function(capturer, property) {};
}, {}, {});
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
cwt.GameDataService = function() {};
stjs.extend(cwt.GameDataService, null, [cwt.ConstructedClass], null, {}, {});
stjs.ns("cwt");
cwt.ComponentManager = function() {};
stjs.extend(cwt.ComponentManager, null, [cwt.ConstructedClass], function(constructor, prototype) {
    prototype.getComponents = function(componentClass) {
        return null;
    };
    prototype.getComponent = function(entity, componentClass) {
        return null;
    };
}, {}, {});
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
cwt.Log = function() {};
stjs.extend(cwt.Log, null, [cwt.ConstructedObject], function(constructor, prototype) {
    prototype.loggerName = null;
    prototype.onConstruction = function(instance) {
        this.loggerName = cwt.Log.convertNameToFixedLength(cwt.ClassUtil.getClassName(instance));
    };
    prototype.info = function(msg) {
        console.log("%c[" + this.loggerName + "][ INFO] %c" + msg, cwt.Constants.LOGGER_CSS_INFO_HEAD, cwt.Constants.LOGGER_CSS_TEXT);
    };
    prototype.warn = function(msg) {
        console.log("%c[" + this.loggerName + "][ WARN] %c" + msg, cwt.Constants.LOGGER_CSS_WARN_HEAD, cwt.Constants.LOGGER_CSS_TEXT);
    };
    prototype.error = function(msg) {
        console.log("%c[" + this.loggerName + "][ERROR] %c" + msg, cwt.Constants.LOGGER_CSS_ERROR_HEAD, cwt.Constants.LOGGER_CSS_TEXT);
    };
    constructor.convertNameToFixedLength = function(loggerName) {
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
        return loggerName;
    };
}, {}, {});
stjs.ns("cwt");
cwt.ComponentSerializationUtil = function() {};
stjs.extend(cwt.ComponentSerializationUtil, null, [], function(constructor, prototype) {
    constructor.parseFromData = function(data, componentClass) {
        var componentClassName = cwt.ClassUtil.getClassName(componentClass);
        if (!(data).hasOwnProperty(componentClassName)) 
            return null;
        var componentData = (data)[componentClassName];
        var component = new componentClass();
        var componentPrototype = (componentClass).prototype;
        var componentPrototypeProperties = cwt.JsUtil.objectKeys(componentPrototype);
        cwt.JsUtil.forEachArrayValue(componentPrototypeProperties, function(index, property) {
            if ((typeof (componentPrototype)[property]) == "function") 
                return;
            if (property.startsWith("__")) 
                return;
            if ((componentData).hasOwnProperty(property)) {
                (component)[property] = (componentData)[property];
            }
        });
        return component;
    };
}, {}, {});
stjs.ns("cwt");
cwt.SerializationSystem = function() {};
stjs.extend(cwt.SerializationSystem, null, [cwt.ConstructedClass], function(constructor, prototype) {
    prototype.log = null;
    prototype.em = null;
    prototype.onConstruction = function() {
        this.log.info("creating data model");
        this.em.acquireEntityWithId("MAP");
        var map = this.em.acquireEntityComponent("MAP", cwt.TileMap);
        map.tiles = [];
        for (var x = 0; x < cwt.Constants.MAX_MAP_SIDE_LENGTH; x++) {
            map.tiles[x] = [];
            for (var y = 0; y < cwt.Constants.MAX_MAP_SIDE_LENGTH; y++) {
                map.tiles[x][y] = null;
            }
        }
    };
}, {log: "cwt.Log", em: "cwt.EntityManager"}, {});
stjs.ns("cwt");
cwt.SpecialWeaponsSystem = function() {};
stjs.extend(cwt.SpecialWeaponsSystem, null, [cwt.ConstructedClass, cwt.LoadEntityEvent], function(constructor, prototype) {
    prototype.em = null;
    prototype.asserter = null;
    prototype.onLoadEntity = function(entity, entityType, data) {
        switch (entityType) {
            case cwt.LoadEntityEvent.TYPE_PROPERTY_DATA:
                var fireAble = this.em.tryAcquireComponentFromData(entity, data, cwt.FireAble);
                if (fireAble != null) {
                    this.asserter.assertTrue("fireAble.damage int", is.integer(fireAble.damage));
                    this.asserter.assertTrue("fireAble.damage > 0", is.above(fireAble.damage, 0));
                    this.asserter.assertTrue("fireAble.damage < UNIT_HEALTH", is.under(fireAble.damage, cwt.Constants.UNIT_HEALTH + 1));
                    this.asserter.assertTrue("fireAble.range int", is.integer(fireAble.range));
                    this.asserter.assertTrue("fireAble.range > 0", is.above(fireAble.range, 0));
                    this.asserter.assertTrue("fireAble.range < MAX_SELECTION_RANGE", is.under(fireAble.range, cwt.Constants.MAX_SELECTION_RANGE + 1));
                    this.asserter.assertTrue("fireAble.changesType str or null", fireAble.changesType == null || is.string(fireAble.changesType));
                    if (fireAble.changesType != null) 
                        this.asserter.assertTrue("fireAble.changesType entity", this.em.isEntity(fireAble.changesType));
                }
                break;
        }
    };
}, {em: "cwt.EntityManager", asserter: "cwt.Asserter"}, {});
stjs.ns("cwt");
cwt.SupplierSystem = function() {};
stjs.extend(cwt.SupplierSystem, null, [cwt.ConstructedClass, cwt.LoadEntityEvent], function(constructor, prototype) {
    prototype.em = null;
    prototype.asserter = null;
    prototype.onConstruction = function() {};
    prototype.onLoadEntity = function(entity, entityType, data) {
        switch (entityType) {
            case cwt.LoadEntityEvent.TYPE_UNIT_DATA:
            case cwt.LoadEntityEvent.TYPE_PROPERTY_DATA:
                var supplier = this.em.tryAcquireComponentFromData(entity, data, cwt.Supplier);
                if (supplier != null) {
                    this.asserter.assertTrue("supplier.refillLoads bool", is.bool(supplier.refillLoads));
                    this.asserter.assertTrue("supplier.supplies array", is.array(supplier.supplies));
                    cwt.JsUtil.forEachArrayValue(supplier.supplies, stjs.bind(this, function(index, entry) {
                        this.asserter.assertTrue("supplier.supplies(v) str", is.string(entry));
                        this.asserter.assertTrue("supplier.supplies(v) entity", this.em.isEntity(entry));
                    }));
                }
                break;
        }
        switch (entityType) {
            case cwt.LoadEntityEvent.TYPE_PROPERTY_DATA:
                var funds = this.em.tryAcquireComponentFromData(entity, data, cwt.Funds);
                if (funds != null) {
                    this.asserter.assertTrue("funds.amount int", is.integer(funds.amount));
                    this.asserter.assertTrue("funds.amount > 0", is.above(funds.amount, 0));
                    this.asserter.assertTrue("funds.amount < 100000", is.under(funds.amount, 100000));
                }
                break;
        }
    };
}, {em: "cwt.EntityManager", asserter: "cwt.Asserter"}, {});
stjs.ns("cwt");
cwt.StealthSystem = function() {};
stjs.extend(cwt.StealthSystem, null, [cwt.ConstructedClass, cwt.LoadEntityEvent], function(constructor, prototype) {
    prototype.em = null;
    prototype.asserter = null;
    prototype.onConstruction = function() {};
    prototype.onLoadEntity = function(entity, entityType, data) {
        switch (entityType) {
            case cwt.LoadEntityEvent.TYPE_UNIT_DATA:
                var hideAble = this.em.tryAcquireComponentFromData(entity, data, cwt.HideAble);
                if (hideAble != null) {
                    this.asserter.assertTrue("hideAble.additionFuelDrain int", is.integer(hideAble.additionFuelDrain));
                    this.asserter.assertTrue("hideAble.additionFuelDrain >= 0", is.above(hideAble.additionFuelDrain, -1));
                    this.asserter.assertTrue("hideAble.additionFuelDrain < 100", is.under(hideAble.additionFuelDrain, 100));
                }
                break;
        }
    };
}, {em: "cwt.EntityManager", asserter: "cwt.Asserter"}, {});
stjs.ns("cwt");
cwt.FuelDrainSystem = function() {};
stjs.extend(cwt.FuelDrainSystem, null, [cwt.ConstructedClass, cwt.LoadEntityEvent], function(constructor, prototype) {
    prototype.em = null;
    prototype.asserter = null;
    prototype.onConstruction = function() {};
    prototype.onLoadEntity = function(entity, entityType, data) {
        switch (entityType) {
            case cwt.LoadEntityEvent.TYPE_UNIT_DATA:
                var drain = this.em.tryAcquireComponentFromData(entity, data, cwt.FuelDrain);
                if (drain != null) {
                    this.asserter.assertTrue("drain.daily int", is.integer(drain.daily));
                    this.asserter.assertTrue("drain.daily > 0", is.above(drain.daily, 0));
                    this.asserter.assertTrue("drain.daily < 100", is.under(drain.daily, 100));
                }
                break;
        }
    };
}, {em: "cwt.EntityManager", asserter: "cwt.Asserter"}, {});
stjs.ns("cwt");
cwt.TransportSystem = function() {};
stjs.extend(cwt.TransportSystem, null, [cwt.ConstructedClass, cwt.LoadEntityEvent], function(constructor, prototype) {
    prototype.em = null;
    prototype.asserter = null;
    prototype.onConstruction = function() {};
    prototype.onLoadEntity = function(entity, entityType, data) {
        switch (entityType) {
            case cwt.LoadEntityEvent.TYPE_UNIT_DATA:
                var transporter = this.em.tryAcquireComponentFromData(entity, data, cwt.Transporter);
                if (transporter != null) {
                    this.asserter.assertTrue("transporter.slots int", is.integer(transporter.slots));
                    this.asserter.assertTrue("transporter.slots > 0", is.above(transporter.slots, 0));
                    this.asserter.assertTrue("transporter.slots < 10", is.under(transporter.slots, 11));
                    this.asserter.assertTrue("transporter.loads array", is.array(transporter.loads));
                    cwt.JsUtil.forEachArrayValue(transporter.loads, stjs.bind(this, function(index, entry) {
                        this.asserter.assertTrue("transporter.loads(v) str", is.string(entry));
                        this.asserter.assertTrue("transporter.loads(v) entity", this.em.isEntity(entry));
                    }));
                }
                break;
        }
    };
}, {em: "cwt.EntityManager", asserter: "cwt.Asserter"}, {});
stjs.ns("cwt");
cwt.ArmySystem = function() {};
stjs.extend(cwt.ArmySystem, null, [cwt.ConstructedClass, cwt.LoadEntityEvent], function(constructor, prototype) {
    prototype.em = null;
    prototype.asserter = null;
    prototype.onConstruction = function() {};
    prototype.onLoadEntity = function(entity, entityType, data) {
        switch (entityType) {
            case cwt.LoadEntityEvent.TYPE_ARMY_DATA:
                var army = this.em.tryAcquireComponentFromData(entity, data, cwt.Army);
                if (army != null) {
                    this.asserter.assertTrue("name string", is.string(army.name));
                    this.asserter.assertTrue("name number of chars", is.equal(army.name.length, cwt.Constants.IDENTIFIER_LENGTH));
                    this.asserter.assertTrue("music string", is.string(army.music));
                    this.asserter.assertTrue("color integer", is.integer(army.color));
                    this.asserter.assertTrue("color greater equals 0", is.above(army.color, -1));
                }
                break;
        }
    };
}, {em: "cwt.EntityManager", asserter: "cwt.Asserter"}, {});
stjs.ns("cwt");
cwt.RepairSystem = function() {};
stjs.extend(cwt.RepairSystem, null, [cwt.ConstructedClass, cwt.LoadEntityEvent], function(constructor, prototype) {
    prototype.em = null;
    prototype.asserter = null;
    prototype.onConstruction = function() {};
    prototype.onLoadEntity = function(entity, entityType, data) {
        switch (entityType) {
            case cwt.LoadEntityEvent.TYPE_UNIT_DATA:
                var repairer = this.em.tryAcquireComponentFromData(entity, data, cwt.Repairer);
                if (repairer != null) {
                    this.asserter.assertTrue("repairer.amount int", is.integer(repairer.amount));
                    this.asserter.assertTrue("repairer.amount > 0", is.above(repairer.amount, 0));
                    this.asserter.assertTrue("repairer.amount < 100", is.under(repairer.amount, cwt.Constants.UNIT_HEALTH + 1));
                    this.asserter.assertTrue("repairer.targets array", is.array(repairer.targets));
                    cwt.JsUtil.forEachArrayValue(repairer.targets, stjs.bind(this, function(index, entry) {
                        this.asserter.assertTrue("repairer.targets(v) str", is.string(entry));
                        this.asserter.assertTrue("repairer.targets(v) entity", this.em.isEntity(entry));
                    }));
                }
                break;
        }
    };
}, {em: "cwt.EntityManager", asserter: "cwt.Asserter"}, {});
stjs.ns("cwt");
cwt.SuicideUnitSystem = function() {};
stjs.extend(cwt.SuicideUnitSystem, null, [cwt.ConstructedClass, cwt.LoadEntityEvent], function(constructor, prototype) {
    prototype.em = null;
    prototype.asserter = null;
    prototype.onConstruction = function() {};
    prototype.onLoadEntity = function(entity, entityType, data) {
        switch (entityType) {
            case cwt.LoadEntityEvent.TYPE_UNIT_DATA:
                var suicide = this.em.tryAcquireComponentFromData(entity, data, cwt.Suicide);
                if (suicide != null) {
                    this.asserter.assertTrue("suicide.damage int", is.integer(suicide.damage));
                    this.asserter.assertTrue("suicide.damage > 0", is.above(suicide.damage, 0));
                    this.asserter.assertTrue("suicide.damage < UNIT_HEALTH", is.under(suicide.damage, cwt.Constants.UNIT_HEALTH + 1));
                    this.asserter.assertTrue("suicide.range int", is.integer(suicide.range));
                    this.asserter.assertTrue("suicide.range > 0", is.above(suicide.range, 0));
                    this.asserter.assertTrue("suicide.range <= MAX_SELECTION_RANGE", is.under(suicide.range, cwt.Constants.MAX_SELECTION_RANGE + 1));
                    this.asserter.assertTrue("suicide.noDamage array", is.array(suicide.noDamage));
                    cwt.JsUtil.forEachArrayValue(suicide.noDamage, stjs.bind(this, function(index, entry) {
                        this.asserter.assertTrue("suicide.noDamage(v) str", is.string(entry));
                        this.asserter.assertTrue("suicide.noDamage(v) entity", this.em.isEntity(entry));
                    }));
                }
                break;
        }
    };
}, {em: "cwt.EntityManager", asserter: "cwt.Asserter"}, {});
/**
 *  The {@link BattleSystem} allows players to use units with the battle ability
 *  to fight against other entities with the living ability.
 */
stjs.ns("cwt");
cwt.BattleSystem = function() {};
stjs.extend(cwt.BattleSystem, null, [cwt.ConstructedClass, cwt.UnitCreatedEvent, cwt.LoadEntityEvent], function(constructor, prototype) {
    prototype.log = null;
    prototype.em = null;
    prototype.asserter = null;
    prototype.onUnitCreated = function(unitEntity) {
        this.em.getNonNullComponent(unitEntity, cwt.Living).hp = cwt.Constants.UNIT_HEALTH;
    };
    prototype.onLoadEntity = function(entity, entityType, data) {
        switch (entityType) {
            case cwt.LoadEntityEvent.TYPE_UNIT_DATA:
                var primWp = this.em.tryAcquireComponentFromData(entity, data, cwt.FighterPrimaryWeapon);
                if (primWp != null) {
                    this.asserter.assertTrue("minrange int", is.integer(primWp.ammo));
                    this.asserter.assertTrue("minrange >= 0", is.above(primWp.ammo, 0));
                    this.asserter.assertTrue("maxrange < 10", is.under(primWp.ammo, 10));
                }
                var secWp = this.em.tryAcquireComponentFromData(entity, data, cwt.FighterSecondaryWeapon);
                var rangFig = this.em.tryAcquireComponentFromData(entity, data, cwt.RangedFighter);
                if (rangFig != null) {
                    this.asserter.assertTrue("minrange int", is.integer(rangFig.minRange));
                    this.asserter.assertTrue("minrange > 0", is.above(rangFig.minRange, 0));
                    this.asserter.assertTrue("maxrange int", is.integer(rangFig.maxRange));
                    this.asserter.assertTrue("maxrange > minrange", is.above(rangFig.maxRange, rangFig.minRange));
                    this.asserter.assertTrue("maxrange < " + cwt.Constants.MAX_SELECTION_RANGE, is.under(rangFig.maxRange, cwt.Constants.MAX_SELECTION_RANGE));
                    if (primWp == null) {
                        this.log.error(entity + " uses " + cwt.ClassUtil.getClassName(cwt.RangedFighter) + " without having " + cwt.ClassUtil.getClassName(cwt.FighterPrimaryWeapon));
                    }
                }
                break;
            case cwt.LoadEntityEvent.TYPE_PROPERTY_DATA:
            case cwt.LoadEntityEvent.TYPE_TILE_DATA:
                var defense = this.em.tryAcquireComponentFromData(entity, data, cwt.Defense);
                if (defense != null) {
                    this.asserter.assertTrue("minrange integer", is.integer(defense.defense));
                    this.asserter.assertTrue("minrange greater equals 1", is.above(defense.defense, -1));
                }
                break;
        }
    };
    prototype.isDirectFighter = function(entity) {
        return !this.isIndirectFighter(entity);
    };
    prototype.isIndirectFighter = function(entity) {
        return this.em.getComponent(entity, cwt.RangedFighter) != null;
    };
    prototype.isBallisticFither = function(entity) {
        var range = this.em.getComponent(entity, cwt.RangedFighter);
        return range != null && range.minRange == 1;
    };
}, {log: "cwt.Log", em: "cwt.EntityManager", asserter: "cwt.Asserter"}, {});
stjs.ns("cwt");
cwt.DataLoadingSystem = function() {};
stjs.extend(cwt.DataLoadingSystem, null, [cwt.ConstructedClass, cwt.SystemStartEvent], function(constructor, prototype) {
    prototype.log = null;
    prototype.em = null;
    prototype.ev = null;
    prototype.onConstruction = function() {
        var config = {};
        config.driver = [localforage.INDEXEDDB, localforage.WEBSQL];
        config.name = cwt.Constants.OFFLINE_DB_NAME;
        config.size = cwt.Constants.OFFLINE_DB_SIZE;
        localforage.config(config);
    };
    prototype.onSystemStartup = function(gameContainer) {
        this.loadFolder(gameContainer, "modifications/cwt/tiles", cwt.LoadEntityEvent.TYPE_TILE_DATA);
        this.loadFolder(gameContainer, "modifications/cwt/props", cwt.LoadEntityEvent.TYPE_PROPERTY_DATA);
        this.loadFolder(gameContainer, "modifications/cwt/movetypes", cwt.LoadEntityEvent.TYPE_MOVETYPE_DATA);
        this.loadFolder(gameContainer, "modifications/cwt/units", cwt.LoadEntityEvent.TYPE_UNIT_DATA);
        this.loadFolder(gameContainer, "modifications/cwt/weathers", cwt.LoadEntityEvent.TYPE_WEATHER_DATA);
        this.loadFolder(gameContainer, "modifications/cwt/armies", cwt.LoadEntityEvent.TYPE_ARMY_DATA);
    };
    prototype.loadFolder = function(gameContainer, folder, type) {
        this.log.info("loading data from folder " + folder);
        var data = gameContainer.getAssetEntry("__filelist__.json", folder, "json");
        localforage.getItem(data.path, stjs.bind(this, function(err, value) {
            if (value == null) {
                cwt.BrowserUtil.requestJsonFile(data.url, stjs.bind(this, function(objData, error) {
                    this.loadRemoteFolderByContentList(gameContainer, folder, objData, type);
                }));
            } else {
                this.loadCachedFolderByContentList(gameContainer, folder, value, type);
            }
        }));
    };
    prototype.loadRemoteFolderByContentList = function(game, folder, content, type) {
        cwt.JsUtil.forEachArrayValue(content, stjs.bind(this, function(index, id) {
            var data = game.getAssetEntry(id, folder, "json");
            game.loader.add(data.key);
            this.log.info("grabbed value from " + data.url);
            cwt.BrowserUtil.requestJsonFile(data.url, stjs.bind(this, function(objData, error) {
                this.log.info("parsing and validating " + data.key);
                var entity = this.em.acquireEntityWithId((objData)["ID"].toString());
                this.ev.publish(cwt.LoadEntityEvent).onLoadEntity(entity, type, objData);
                localforage.setItem(data.key, objData, function(err, savedData) {
                    game.loader.success(data.key);
                });
            }));
        }));
    };
    prototype.loadCachedFolderByContentList = function(game, folder, content, type) {
        cwt.JsUtil.forEachArrayValue(content, stjs.bind(this, function(index, id) {
            var data = game.getAssetEntry(id, folder, "json");
            game.loader.add(data.key);
            localforage.getItem(data.key, stjs.bind(this, function(err, value) {
                this.log.info("grabbed value from the cache");
                var entity = this.em.acquireEntityWithId((value)["ID"].toString());
                this.ev.publish(cwt.LoadEntityEvent).onLoadEntity(entity, type, value);
                game.loader.success(data.key);
            }));
        }));
    };
}, {log: "cwt.Log", em: "cwt.EntityManager", ev: "cwt.EventEmitter"}, {});
stjs.ns("cwt");
cwt.TestSystem = function() {};
stjs.extend(cwt.TestSystem, null, [cwt.ConstructedClass, cwt.DevBlockConstruction, cwt.SystemStartEvent], function(constructor, prototype) {
    prototype.log = null;
    prototype.onSystemInitialized = function() {
        this.log.warn("It worked yay! :D");
    };
}, {log: "cwt.Log"}, {});
stjs.ns("cwt");
cwt.ModelCreationSystem = function() {};
stjs.extend(cwt.ModelCreationSystem, null, [cwt.ConstructedClass, cwt.SystemStartEvent], function(constructor, prototype) {
    prototype.em = null;
    prototype.onSystemStartup = function(gameContainer) {
        this.em.acquireEntityWithId("*");
    };
}, {em: "cwt.EntityManager"}, {});
stjs.ns("cwt");
cwt.WeatherSystem = function() {};
stjs.extend(cwt.WeatherSystem, null, [cwt.ConstructedClass, cwt.DayStartEvent, cwt.WeatherChangesEvent, cwt.LoadEntityEvent], function(constructor, prototype) {
    prototype.log = null;
    prototype.em = null;
    prototype.asserter = null;
    prototype.onConstruction = function() {
        this.log.info("created");
    };
    prototype.onLoadEntity = function(entity, entityType, data) {
        switch (entityType) {
            case cwt.LoadEntityEvent.TYPE_WEATHER_DATA:
                var weather = this.em.tryAcquireComponentFromData(entity, data, cwt.Weather);
                if (weather != null) {
                    this.asserter.assertTrue("weather.defaultWeather bool", is.bool(weather.defaultWeather));
                }
                break;
        }
    };
    prototype.onWeatherChanges = function(weather, duration) {
        var data = this.em.getNonNullComponent(cwt.EntityId.GAME_ROUND, cwt.WeatherData);
        data.days = duration;
        data.weather = weather;
    };
    prototype.onDayStart = function(day) {
        var data = this.em.getComponent(cwt.EntityId.GAME_ROUND, cwt.WeatherData);
        var currentWeather = this.em.getComponent(data.weather, cwt.Weather);
        data.days--;
        if (data.days == 0) {
            this.log.info("changing weather..");
            var weatherTypes = this.em.getEntitiesWithComponentType(cwt.Weather);
            var newWeatherEntity;
             while (true){
                newWeatherEntity = weatherTypes[cwt.NumberUtil.getRandomInt(weatherTypes.length)];
                if (newWeatherEntity != cwt.EntityId.GAME_ROUND && currentWeather != this.em.getComponent(newWeatherEntity, cwt.Weather)) {
                    break;
                }
            }
            var newWeather = this.em.getComponent(newWeatherEntity, cwt.Weather);
            var newDuration = newWeather.defaultWeather ? 1 : this.generateRandomDuration();
            this.log.info("..to " + newWeatherEntity + " for " + newDuration + " days");
        }
    };
    prototype.generateRandomDuration = function() {
        return 1;
    };
}, {log: "cwt.Log", em: "cwt.EntityManager", asserter: "cwt.Asserter"}, {});
stjs.ns("cwt");
cwt.MoveSystem = function() {};
stjs.extend(cwt.MoveSystem, null, [cwt.ConstructedClass, cwt.MoveEvent, cwt.LoadEntityEvent], function(constructor, prototype) {
    prototype.log = null;
    prototype.em = null;
    prototype.ev = null;
    prototype.asserter = null;
    prototype.onConstruction = function() {
        this.log.info("initialize move-data component");
        this.em.acquireEntityWithId("?");
        var map = this.em.getNonNullComponent("?", cwt.Movemap);
        map.data = [];
        for (var i = 0; i < cwt.Constants.MAX_SELECTION_RANGE; i++) {
            map.data[i] = [];
            for (var j = 0; j < cwt.Constants.MAX_SELECTION_RANGE; j++) {
                map.data[i][j] = 0;
            }
        }
    };
    prototype.onLoadEntity = function(entity, entityType, data) {
        switch (entityType) {
            case cwt.LoadEntityEvent.TYPE_UNIT_DATA:
                var mdata = this.em.tryAcquireComponentFromData(entity, data, cwt.Movable);
                if (mdata != null) {
                    this.asserter.assertTrue("mdata.fuel int", is.integer(mdata.fuel));
                    this.asserter.assertTrue("mdata.fuel > 0", is.above(mdata.fuel, 0));
                    this.asserter.assertTrue("mdata.fuel < 100", is.under(mdata.fuel, 100));
                    this.asserter.assertTrue("mdata.range int", is.integer(mdata.range));
                    this.asserter.assertTrue("mdata.range > 0", is.above(mdata.range, 0));
                    this.asserter.assertTrue("mdata.range < MAX_SELECTION_RANGE", is.under(mdata.range, cwt.Constants.MAX_SELECTION_RANGE));
                    this.asserter.assertTrue("mdata.type str", is.string(mdata.type));
                    this.asserter.assertTrue("mdata.type movetype", this.em.hasEntityComponent(mdata.type, cwt.MovingCosts));
                    this.em.setEntityPrototype(entity, mdata.type);
                }
                break;
            case cwt.LoadEntityEvent.TYPE_MOVETYPE_DATA:
                var costs = this.em.tryAcquireComponentFromData(entity, data, cwt.MovingCosts);
                if (costs != null) {
                    cwt.JsUtil.forEachMapValue(costs.costs, stjs.bind(this, function(key, value) {
                        this.asserter.assertTrue("costs.costs(v) int", is.integer(value));
                        this.asserter.assertTrue("costs.costs(v) >= 0", is.above(value, -1));
                        this.asserter.assertTrue("costs.costs(v) < 100", is.under(value, 100));
                    }));
                }
                break;
        }
    };
    prototype.onUnitMove = function(unit, steps) {
        var position = this.em.getComponent(unit, cwt.Position);
        var modeData = this.em.getComponent(unit, cwt.MovingAbilityCmp);
        var cX = position.x;
        var cY = position.y;
        var oX = cX;
        var oY = cY;
        var cFuel = modeData.fuel;
        position.x = cX;
        position.y = cY;
        this.ev.publish(cwt.MoveEvent).onUnitMoved(unit, oX, oY, cX, cY);
    };
}, {log: "cwt.Log", em: "cwt.EntityManager", ev: "cwt.EventEmitter", asserter: "cwt.Asserter"}, {});
stjs.ns("cwt");
cwt.AudioSystem = function() {};
stjs.extend(cwt.AudioSystem, null, [cwt.ConstructedClass, cwt.ClickEvent], function(constructor, prototype) {
    prototype.log = null;
    prototype.onClick = function(type, x, y) {
        this.log.info("GOT A CLICK => " + type);
    };
}, {log: "cwt.Log"}, {});
stjs.ns("cwt");
cwt.FactorySystem = function() {};
stjs.extend(cwt.FactorySystem, null, [cwt.ConstructedClass, cwt.ActionInvokedEvent, cwt.LoadEntityEvent], function(constructor, prototype) {
    prototype.log = null;
    prototype.em = null;
    prototype.ev = null;
    prototype.asserter = null;
    prototype.onLoadEntity = function(entity, entityType, data) {
        switch (entityType) {
            case cwt.LoadEntityEvent.TYPE_UNIT_DATA:
                var buyable = this.em.tryAcquireComponentFromData(entity, data, cwt.Buyable);
                if (buyable != null) {
                    this.asserter.assertTrue("buyable.cost int", is.integer(buyable.cost));
                    this.asserter.assertTrue("buyable.cost > 0", is.above(buyable.cost, 0));
                }
                break;
            case cwt.LoadEntityEvent.TYPE_PROPERTY_DATA:
                var factory = this.em.tryAcquireComponentFromData(entity, data, cwt.Factory);
                if (factory != null) {
                    this.asserter.assertTrue("factory.builds array", is.array(factory.builds));
                    factory.builds.forEach(stjs.bind(this, function(entry) {
                        this.asserter.assertTrue("factory.builds(x) str", is.string(entry));
                        this.asserter.assertTrue("factory.builds(x) unit entity", this.em.hasEntityComponent(entry, cwt.Living) && this.em.hasEntityComponent(entry, cwt.Owner));
                    }));
                }
                break;
        }
    };
    prototype.onBuildUnit = function(factory, type) {
        var factoryData = this.em.getComponent(factory, cwt.Factory);
        this.checkBuildData(type, factoryData);
        var unit = this.em.acquireEntity();
        var unitOwner = this.em.getNonNullComponent(unit, cwt.Owner);
        var unitPos = this.em.getNonNullComponent(unit, cwt.Position);
        var factoryOwner = this.em.getComponent(factory, cwt.Owner);
        var factoryPos = this.em.getComponent(factory, cwt.Position);
        unitOwner.owner = factoryOwner.owner;
        unitPos.x = factoryPos.x;
        unitPos.y = factoryPos.y;
        this.em.setEntityPrototype(unit, type);
        this.log.info("produced a unit [ID:" + unit + ", Type: " + type + "]");
        this.ev.publish(cwt.UnitProducedEvent).onUnitProduced(factory, unit, type);
    };
    prototype.checkBuildData = function(type, factoryData) {
        if (factoryData == null) {
            this.ev.publish(cwt.ErrorEvent).onIllegalGameData("NotAFactory");
        } else if (factoryData.builds.indexOf(type) == -1) {
            this.ev.publish(cwt.ErrorEvent).onIllegalGameData("TypeIsNotProcuceAble");
        }
    };
}, {log: "cwt.Log", em: "cwt.EntityManager", ev: "cwt.EventEmitter", asserter: "cwt.Asserter"}, {});
stjs.ns("cwt");
cwt.FogSystem = function() {};
stjs.extend(cwt.FogSystem, null, [cwt.ConstructedClass, cwt.UnitProducedEvent, cwt.UnitDestroyedEvent, cwt.LoadEntityEvent], function(constructor, prototype) {
    prototype.em = null;
    prototype.ev = null;
    prototype.asserter = null;
    prototype.turnOwnerData = null;
    prototype.clientOwnerData = null;
    prototype.onConstruction = function() {
        this.turnOwnerData = [];
        this.clientOwnerData = [];
    };
    prototype.onLoadEntity = function(entity, entityType, data) {
        switch (entityType) {
            case cwt.LoadEntityEvent.TYPE_UNIT_DATA:
            case cwt.LoadEntityEvent.TYPE_PROPERTY_DATA:
                var vision = this.em.tryAcquireComponentFromData(entity, data, cwt.Vision);
                if (vision != null) {
                    this.asserter.assertTrue("vision.range int", is.integer(vision.range));
                    this.asserter.assertTrue("vision.range >= 0(unit) or 1(property)", is.above(vision.range, entityType == cwt.LoadEntityEvent.TYPE_UNIT_DATA ? 0 : -1));
                    this.asserter.assertTrue("vision.range < Constants.MAX_SELECTION_RANGE", is.under(vision.range, cwt.Constants.MAX_SELECTION_RANGE));
                }
                break;
            case cwt.LoadEntityEvent.TYPE_TILE_DATA:
                var visible = this.em.tryAcquireComponentFromData(entity, data, cwt.Visible);
                if (visible != null) {
                    this.asserter.assertTrue("visible.blocksVision bool", is.bool(visible.blocksVision));
                }
                break;
        }
    };
    prototype.onUnitProduced = function(factory, unit, type) {
        if (!this.isTurnOwnerObject(unit)) 
            return;
        var pos = this.em.getComponent(unit, cwt.Position);
        var vision = this.em.getComponent(unit, cwt.Vision);
        this.changeVision(this.turnOwnerData, pos.x, pos.y, vision.range, +1, true);
        this.changeVision(this.clientOwnerData, pos.x, pos.y, vision.range, +1, false);
    };
    prototype.onUnitDestroyed = function(unit) {
        if (!this.isTurnOwnerObject(unit)) 
            return;
        var pos = this.em.getComponent(unit, cwt.Position);
        var vision = this.em.getComponent(unit, cwt.Vision);
        this.changeVision(this.turnOwnerData, pos.x, pos.y, vision.range, -1, true);
        this.changeVision(this.clientOwnerData, pos.x, pos.y, vision.range, +1, false);
    };
    prototype.changeVision = function(data, x, y, range, change, publishEvents) {
        var xe = x + range;
        var ye = y + range;
        x -= range;
        y -= range;
        if (x < 0) 
            x = 0;
        if (y < 0) 
            y = 0;
        var oy = y;
        for (; x <= xe; x++) {
            var column = data[x];
            for (y = oy; y <= ye; y++) {
                var oldVision = column[y];
                column[y] = oldVision + change;
                if (publishEvents) {
                    if (column[y] == 0 && oldVision > 0) {
                        this.ev.publish(cwt.FogEvent).onTileVisionChanges(x, y, false);
                    } else if (column[y] > 0 && oldVision == 0) {
                        this.ev.publish(cwt.FogEvent).onTileVisionChanges(x, y, true);
                    }
                }
            }
        }
    };
    prototype.isTurnOwnerObject = function(unit) {
        return (this.em.getComponent(unit, cwt.Owner).owner == this.em.getComponent(cwt.EntityId.GAME_ROUND, cwt.Turn).owner);
    };
}, {em: "cwt.EntityManager", ev: "cwt.EventEmitter", asserter: "cwt.Asserter", turnOwnerData: {name: "Array", arguments: [{name: "Array", arguments: [null]}]}, clientOwnerData: {name: "Array", arguments: [{name: "Array", arguments: [null]}]}}, {});
stjs.ns("cwt");
cwt.ConfigSystem = function() {};
stjs.extend(cwt.ConfigSystem, null, [cwt.ConstructedClass, cwt.GameStartEvent], function(constructor, prototype) {
    prototype.log = null;
    prototype.em = null;
    prototype.onGameStart = function() {
        this.log.info("going to reset all config values");
        var entities = this.em.getEntitiesWithComponentType(cwt.Config);
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            this.em.getComponent(entity, cwt.Config).value = this.em.getComponent(entity, cwt.ValueMetaData).defaultValue;
        }
    };
}, {log: "cwt.Log", em: "cwt.EntityManager"}, {});
/**
 *  The {@link ManpowerSystem} gives players the restriction to pay an additional
 *  resource per unit. This resource is manpower which is not expendable during
 *  the game round and the player won't be able to produce units when the
 *  manpower falls down to zero.
 *  
 */
stjs.ns("cwt");
cwt.ManpowerSystem = function() {};
stjs.extend(cwt.ManpowerSystem, null, [cwt.ConstructedClass, cwt.UnitCreatedEvent, cwt.GameStartEvent], function(constructor, prototype) {
    prototype.em = null;
    prototype.onGameStart = function() {};
    prototype.onUnitCreated = function(unitEntity) {
        this.em.getComponent(this.em.getComponent(unitEntity, cwt.Owner).owner, cwt.Manpower).manpower--;
    };
}, {em: "cwt.EntityManager"}, {});
/**
 *  The {@link GameTimeSystem} adds time limits for the turn and game mechanic.
 *  When a turn limit is reached then the turn will be ended by this system. If
 *  the game time limit is reached then the game round will be ended by this
 *  system.
 */
stjs.ns("cwt");
cwt.GameTimeSystem = function() {};
stjs.extend(cwt.GameTimeSystem, null, [cwt.ConstructedClass, cwt.NextFrameEvent, cwt.GameStartEvent, cwt.TurnStartEvent], function(constructor, prototype) {
    prototype.log = null;
    prototype.em = null;
    prototype.ev = null;
    prototype.onNextFrame = function(delta) {
        var data = this.em.getComponent(cwt.EntityId.GAME_ROUND, cwt.TimerData);
        data.gameTime += delta;
        data.turnTime += delta;
        if (data.turnTime >= data.turnTimeLimit) {
            this.log.info("ending current turn because turn time limit is reached");
            this.ev.publish(cwt.TurnEndEvent).onTurnEnd();
        } else if (data.gameTime >= data.gameTimeLimit) {
            this.log.info("ending game because game time limit is reached");
            this.ev.publish(cwt.GameEndEvent).onGameEnd();
        }
    };
    prototype.onGameStart = function() {
        var data = this.em.getComponent(cwt.EntityId.GAME_ROUND, cwt.TimerData);
        data.gameTime = 0;
        data.turnTime = 0;
    };
    prototype.onTurnStart = function(player, turn) {
        var data = this.em.getComponent(cwt.EntityId.GAME_ROUND, cwt.TimerData);
        data.turnTime = 0;
    };
}, {log: "cwt.Log", em: "cwt.EntityManager", ev: "cwt.EventEmitter"}, {});
stjs.ns("cwt");
cwt.CaptureSystem = function() {};
stjs.extend(cwt.CaptureSystem, null, [cwt.ConstructedClass, cwt.ActionInvokedEvent, cwt.LoadEntityEvent], function(constructor, prototype) {
    prototype.ev = null;
    prototype.em = null;
    prototype.asserter = null;
    prototype.onLoadEntity = function(entity, entityType, data) {
        switch (entityType) {
            case cwt.LoadEntityEvent.TYPE_UNIT_DATA:
                var capturer = this.em.tryAcquireComponentFromData(entity, data, cwt.Capturer);
                if (capturer != null) {
                    this.asserter.assertTrue("points int", is.integer(capturer.points));
                    this.asserter.assertTrue("points > 0", is.above(capturer.points, 0));
                    this.asserter.assertTrue("points < 100", is.under(capturer.points, 100));
                }
                break;
            case cwt.LoadEntityEvent.TYPE_PROPERTY_DATA:
                var capturable = this.em.tryAcquireComponentFromData(entity, data, cwt.Capturable);
                if (capturable != null) {
                    this.asserter.assertTrue("points int", is.integer(capturable.points));
                    this.asserter.assertTrue("points > 0", is.above(capturable.points, 0));
                    this.asserter.assertTrue("points < 100", is.under(capturable.points, 100));
                    this.asserter.assertTrue("looseAfterCaptured bool", is.bool(capturable.looseAfterCaptured));
                    this.asserter.assertTrue("changeIntoAfterCaptured str or null", is.string(capturable.changeIntoAfterCaptured) || capturable.changeIntoAfterCaptured == null);
                }
                break;
        }
    };
    prototype.onInvokeAction = function(action, pstr, p1, p2, p3, p4, p5) {
        if (action == "Capture") {
            var property = null;
            var capturer = null;
            var propertyData = this.em.getComponent(property, cwt.Capturable);
            var capturerData = this.em.getComponent(capturer, cwt.Capturer);
            propertyData.points -= capturerData.points;
            this.ev.publish(cwt.CaptureEvents).onLoweredCapturePoints(capturer, property, capturerData.points);
            if (propertyData.points <= 0) {
                var propertyOwner = this.em.getComponent(property, cwt.Owner);
                var capturerOwner = this.em.getComponent(capturer, cwt.Owner);
                propertyOwner.owner = capturerOwner.owner;
                this.ev.publish(cwt.CaptureEvents).onCapturedProperty(capturer, property);
            }
        }
    };
}, {ev: "cwt.EventEmitter", em: "cwt.EntityManager", asserter: "cwt.Asserter"}, {});
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
stjs.ns("cwt");
cwt.Asserter = function() {
    cwt.Log.call(this);
};
stjs.extend(cwt.Asserter, cwt.Log, [cwt.ConstructedObject], function(constructor, prototype) {
    prototype.assertTrue = function(key, expr) {
        if (!expr) {
            this.error("assertion for " + key + " failed");
        }
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
    constructor.log = null;
    constructor.instances = null;
    /**
     *  Initializes all classes which extends the {@link ConstructedClass}
     *  interface.
     */
    constructor.initObjects = function(forceConstructed) {
        cwt.ConstructedFactory.log = new cwt.Log();
        (cwt.ConstructedFactory.log)["loggerName"] = cwt.Log.convertNameToFixedLength("ConstructedFactory");
        cwt.ConstructedFactory.instances = {};
        var namespace = (window)[cwt.Constants.NAMESPACE];
        cwt.ConstructedFactory.createSingletons(namespace);
        cwt.ConstructedFactory.createForcedSingletons(forceConstructed, namespace);
        cwt.ConstructedFactory.injectDependencies(namespace);
        cwt.ConstructedFactory.injectConstructedObjects(namespace);
        cwt.ConstructedFactory.publishInitEvent();
    };
    constructor.createForcedSingletons = function(forceConstructed, namespace) {
        if (forceConstructed != null) {
            for (var i = 0; i < forceConstructed.length; i++) {
                var className = forceConstructed[i];
                cwt.ConstructedFactory.createConstructedInstance(namespace, className);
            }
        }
    };
    constructor.createSingletons = function(namespace) {
        var classNames = cwt.JsUtil.objectKeys(namespace);
        cwt.JsUtil.forEachArrayValue(classNames, function(index, className) {
            var classObject = (namespace)[className];
            cwt.ConstructedFactory.setClassNameProperty(className, classObject);
            if (cwt.ConstructedFactory.isConstructedClass(classObject) && !cwt.ConstructedFactory.isDevBlockedAutomaticInstantiationClass(classObject)) {
                cwt.ConstructedFactory.createConstructedInstance(namespace, className);
            }
        });
    };
    constructor.createConstructedInstance = function(namespace, className) {
        if (!(cwt.ConstructedFactory.instances).hasOwnProperty(className)) {
            cwt.ConstructedFactory.log.info("constructing " + className);
            var classObject = (namespace)[className];
            var cmp = new classObject();
            cwt.ConstructedFactory.instances[className] = cmp;
        }
    };
    constructor.injectDependencies = function(namespace) {
        cwt.JsUtil.forEachMapValue(cwt.ConstructedFactory.instances, function(instanceName, instanceObject) {
            var instanceClass = (namespace)[instanceName];
            var instanceDependencies = (instanceClass)["$typeDescription"];
            cwt.JsUtil.forEachMapValue(instanceDependencies, function(property, dependencyName) {
                if ((typeof dependencyName) == "string") {
                    var dependencyClassName = (dependencyName).replace(cwt.Constants.NAMESPACE + ".", "");
                    var dependency = cwt.ConstructedFactory.instances[dependencyClassName];
                    if (dependency != undefined) {
                        cwt.ConstructedFactory.log.info("injecting " + dependencyClassName + " into " + instanceName + " instance");
                        (instanceObject)[property] = dependency;
                    }
                }
            });
        });
    };
    constructor.injectConstructedObjects = function(namespace) {
        cwt.JsUtil.forEachMapValue(cwt.ConstructedFactory.instances, function(instanceName, instanceObject) {
            var instanceClass = (namespace)[instanceName];
            var instanceDependencies = (instanceClass)["$typeDescription"];
            cwt.ConstructedFactory.checkClassConstructedProperties(namespace, instanceObject, instanceDependencies);
        });
    };
    constructor.checkClassConstructedProperties = function(namespace, instance, instanceDependencies) {
        cwt.JsUtil.forEachMapValue(instanceDependencies, function(property, dependencyName) {
            if ((typeof dependencyName) == "string") {
                var dependencyClassName = (dependencyName).replace(cwt.Constants.NAMESPACE + ".", "");
                var dependencyClass = (namespace)[dependencyClassName];
                if (dependencyClass != undefined && (dependencyClass).hasOwnProperty("$typeDescription")) {
                    var interfaces = (dependencyClass)["$inherit"];
                    if (interfaces.indexOf(cwt.ConstructedObject) != -1) {
                        cwt.ConstructedFactory.log.info("creating object " + dependencyClassName + " as property " + property + " in " + cwt.ClassUtil.getClassName(instance) + " instance");
                        var constructedObject = new dependencyClass();
                        constructedObject.onConstruction(instance);
                        (instance)[property] = constructedObject;
                    }
                }
            }
        });
    };
    constructor.publishInitEvent = function() {
        cwt.JsUtil.forEachMapValue(cwt.ConstructedFactory.instances, function(componentName, component) {
            component.onConstruction();
        });
    };
    constructor.setClassNameProperty = function(className, classObject) {
        if ((classObject).hasOwnProperty("$typeDescription")) {
            (classObject)["__className"] = className;
            ((classObject).prototype)["__className"] = className;
        }
    };
    constructor.isDevBlockedAutomaticInstantiationClass = function(classObj) {
        if ((classObj).hasOwnProperty("$typeDescription")) {
            var interfaces = (classObj)["$inherit"];
            return interfaces.indexOf(cwt.DevBlockConstruction) != -1;
        }
        return false;
    };
    /**
     *  Searches for the {@link ConstructedClass} interface in a class hierarchy.
     *  At the moment the class has to implement an interface which extends the
     *  {@link ConstructedClass} interface in it's own hierarchy to be recognized
     *  as constructed class.
     *  
     *  @param classObj
     *           class that will be checked
     *  @return true when the class object is a constructed class, else false
     */
    constructor.isConstructedClass = function(classObj) {
        if ((classObj).hasOwnProperty("$typeDescription")) {
            var interfaces = (classObj)["$inherit"];
            if (interfaces.indexOf(cwt.ConstructedClass) != -1) {
                return true;
            }
            for (var i = 0; i < interfaces.length; i++) {
                var interfaceObj = interfaces[i];
                if (cwt.ConstructedFactory.isConstructedClass(interfaceObj)) {
                    return true;
                }
            }
        }
        return false;
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
        var value = cwt.ConstructedFactory.instances[(clazz)["__className"]];
        if (undefined == value) {
            return null;
        }
        return value;
    };
}, {log: "cwt.Log", instances: {name: "Map", arguments: [null, "cwt.ConstructedClass"]}}, {});
stjs.ns("cwt");
cwt.EntityManager = function() {
    this.entityIdCounter = 0;
    this.entities = {};
    this.entityPrototypes = {};
    this.allSelector = function(key) {
        return true;
    };
};
stjs.extend(cwt.EntityManager, null, [cwt.ConstructedClass], function(constructor, prototype) {
    prototype.entityPrototypes = null;
    prototype.entities = null;
    prototype.entityIdCounter = 0;
    prototype.allSelector = null;
    prototype.acquireEntity = function() {
        this.entityIdCounter++;
        return this.acquireEntityWithId("E" + (this.entityIdCounter - 1));
    };
    prototype.acquireEntityWithId = function(id) {
        if (id == null || id == undefined || this.entities[id] != undefined) {
            return null;
        }
        this.entities[id] = {};
        this.entityPrototypes[id] = null;
        return id;
    };
    prototype.isEntity = function(id) {
        return (this.entities).hasOwnProperty(id);
    };
    prototype.acquireEntityComponent = function(id, componentClass) {
        return this.attachEntityComponent(id, new componentClass());
    };
    prototype.tryAcquireComponentFromData = function(id, data, componentClass) {
        var component = cwt.ComponentSerializationUtil.parseFromData(data, componentClass);
        if (component != null) 
            this.attachEntityComponent(id, component);
        return component;
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
    prototype.getEntitiesWithComponentType = function(clazz) {
        var resultEntities = [];
        var entityNames = cwt.JsUtil.objectKeys(this.entities);
        for (var i = 0; i < entityNames.length; i++) {
            var entityName = entityNames[i];
            if (this.getComponent(entityName, clazz) != null) {
                resultEntities.push(entityName);
            }
        }
        return resultEntities;
    };
    /**
     *  Returns a component of an entity.
     *  
     *  @param id
     *           id of the entity
     *  @param lComponentClass
     *           class of the wanted component
     *  @return component object or null
     */
    prototype.getComponent = function(id, lComponentClass) {
        var componentMap = this.entities[id];
        if (componentMap == undefined) {
            exception("Entity " + id + " is not defined");
        }
        var componentName = cwt.ClassUtil.getClassName(lComponentClass);
        var component = componentMap[componentName];
        if (component == undefined) {
            var proto = this.entityPrototypes[id];
            return proto != undefined ? this.getComponent(proto, lComponentClass) : null;
        } else {
            return component;
        }
    };
    prototype.getNonNullComponent = function(lId, lComponentClass) {
        var component;
        component = this.getComponent(lId, lComponentClass);
        if (component == null) {
            component = this.acquireEntityComponent(lId, lComponentClass);
        }
        return component;
    };
    prototype.hasEntityComponent = function(lId, lComponentClass) {
        return this.getComponent(lId, lComponentClass) != null;
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
        dataCallback(JSON.stringify(data, null, 2));
    };
    prototype.setEntityPrototype = function(entity, prototype) {};
}, {entityPrototypes: {name: "Map", arguments: [null, null]}, entities: {name: "Map", arguments: [null, {name: "Map", arguments: [null, "cwt.IEntityComponent"]}]}, allSelector: {name: "Function1", arguments: [null, null]}}, {});
stjs.ns("cwt");
cwt.Cwt = function() {};
stjs.extend(cwt.Cwt, null, [cwt.ConstructedClass, cwt.SystemStartEvent], function(constructor, prototype) {
    prototype.log = null;
    prototype.em = null;
    prototype.evem = null;
    prototype.onConstruction = function() {
        cwt.PlaygroundUtil.setBasePath(this, "../");
        this.container = window.document.getElementById("game");
    };
    prototype.onSystemInitialized = function() {
        this.log.info("initialize playground engine");
        (window)["cwtPly"] = playground(this);
    };
    prototype.preload = function() {
        this.loader.on("error", stjs.bind(this, function(error) {
            return this.log.error("Failed to load asset => " + error);
        }));
        this.evem.publish(cwt.SystemStartEvent).onSystemStartup(this);
    };
    prototype.ready = function() {};
    prototype.step = function(delta) {};
    prototype.render = function() {};
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
        this.log.info("enter state " + cwt.ClassUtil.getClassName(event.state));
    };
    prototype.keydown = function(ev) {
        this.evem.publish(cwt.ClickEvent).onClick(ev.key + "", 0, 0);
    };
    prototype.mousedown = function(ev) {
        this.evem.publish(cwt.ClickEvent).onClick(ev.original.which + "", 0, 0);
    };
    prototype.leavestate = function(event) {
        this.log.info("leaving state " + cwt.ClassUtil.getClassName(event.state));
    };
}, {log: "cwt.Log", em: "cwt.EntityManager", evem: "cwt.EventEmitter", atlases: {name: "Map", arguments: [null, "cwt.CanvasQuery.Atlas"]}, container: "Element", data: {name: "Map", arguments: [null, "Object"]}, images: {name: "Map", arguments: [null, "Canvas"]}, keyboard: "cwt.Playground.KeyboardStatus", layer: "cwt.CanvasQuery", loader: "cwt.Playground.Loader", mouse: "cwt.Playground.MouseStatus", music: "cwt.Playground.SoundActions", paths: "cwt.Playground.ResourcePaths", pointers: {name: "Array", arguments: ["cwt.Playground.PointerEvent"]}, sound: "cwt.Playground.SoundActions", touch: "cwt.Playground.TouchStatus", state: "cwt.PlaygroundState"}, {});
stjs.ns("cwt");
cwt.EventEmitter = function() {};
stjs.extend(cwt.EventEmitter, null, [cwt.ConstructedClass], function(constructor, prototype) {
    prototype.log = null;
    prototype.eventEmitter = null;
    prototype.eventListeners = null;
    prototype.onConstruction = function() {
        this.eventEmitter = {};
        this.eventListeners = {};
        this.createEventEmitter();
        this.registerSubriberSystems();
    };
    prototype.createEventEmitter = function() {
        var namespace = (window)[cwt.Constants.NAMESPACE];
        var classNames = cwt.JsUtil.objectKeys(namespace);
        for (var i = 0; i < classNames.length; i++) {
            var className = classNames[i];
            var classObject = (namespace)[className];
            if (this.isEventClass(classObject)) {
                var classPrototype = (classObject).prototype;
                var classFunctions = cwt.JsUtil.objectKeys(classPrototype);
                cwt.JsUtil.forEachArrayValue(classFunctions, stjs.bind(this, function(index, classFnName) {
                    if (!classFnName.startsWith("on")) 
                        return;
                    if ((this.eventEmitter).hasOwnProperty(classFnName)) {
                        this.log.error("event function " + classFnName + " is already registered by an other event class");
                    }
                    (this.eventEmitter)[classFnName] = this.createEventEmitterCallback(classFnName);
                    this.log.info("registered event emitter for " + classFnName);
                }));
            }
        }
    };
    prototype.isEventClass = function(classObject) {
        var inherits = (classObject)["$inherit"];
        return inherits.indexOf(cwt.IEvent) != -1;
    };
    prototype.createEventEmitterCallback = function(evName) {
        var eventListeners = this.eventListeners;
        return function() {
            var listeners = eventListeners[evName];
            for (var i = 0; i < listeners.length; i++) {
                var listener = listeners[i];
                ((listener)[evName]).apply(listener, arguments);
            }
        };
    };
    prototype.registerSubriberSystems = function() {
        var namespace = (window)[cwt.Constants.NAMESPACE];
        var classNames = cwt.JsUtil.objectKeys(namespace);
        for (var i = 0; i < classNames.length; i++) {
            var className = classNames[i];
            this.checkClass(namespace, className);
        }
    };
    prototype.checkClass = function(namespace, className) {
        var classObject = (namespace)[className];
        var constructedInstance = cwt.ConstructedFactory.getObject(classObject);
        if (constructedInstance == null) {
            return;
        }
        var classInherits = (classObject)["$inherit"];
        for (var j = 0; j < classInherits.length; j++) {
            var possibleEventClass = classInherits[j];
            if (this.isEventClass(possibleEventClass)) {
                var classPrototype = (possibleEventClass).prototype;
                var classFunctions = cwt.JsUtil.objectKeys(classPrototype);
                cwt.JsUtil.forEachArrayValue(classFunctions, stjs.bind(this, function(index, classFnName) {
                    if (!classFnName.startsWith("on")) 
                        return;
                    if (this.eventListeners[classFnName] == undefined) {
                        this.eventListeners[classFnName] = [];
                    }
                    this.eventListeners[classFnName].push(constructedInstance);
                    this.log.info("registered event listener " + className + " for " + classFnName);
                }));
            }
        }
    };
    prototype.publish = function(eventClass) {
        return this.eventEmitter;
    };
}, {log: "cwt.Log", eventEmitter: "Object", eventListeners: {name: "Map", arguments: [null, {name: "Array", arguments: ["Object"]}]}}, {});
/**
 *  Starter class with main function.
 */
stjs.ns("cwt");
cwt.Starter = function() {};
stjs.extend(cwt.Starter, null, [], function(constructor, prototype) {
    constructor.main = function(args) {
        var forcedParam = cwt.BrowserUtil.getUrlParameterMap()["forcedConstruction"];
        var forcedConst = forcedParam != undefined ? (forcedParam).split(",") : [];
        cwt.ConstructedFactory.initObjects(forcedConst);
        cwt.ConstructedFactory.getObject(cwt.EventEmitter).publish(cwt.SystemStartEvent).onSystemInitialized();
    };
}, {}, {});
if (!stjs.mainCallDisabled) 
    cwt.Starter.main();
