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
cwt.ConstructedObject = function() {};
stjs.extend(cwt.ConstructedObject, null, [], function(constructor, prototype) {
    prototype.onConstruction = function(instance) {};
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
cwt.MapRendererSystem = function() {};
stjs.extend(cwt.MapRendererSystem, null, [], null, {}, {});
stjs.ns("cwt");
cwt.ITest = function() {};
stjs.extend(cwt.ITest, null, [], null, {}, {});
stjs.ns("cwt");
cwt.MenuSys = function() {};
stjs.extend(cwt.MenuSys, null, [], null, {}, {});
stjs.ns("cwt");
cwt.NumberUtil = function() {};
stjs.extend(cwt.NumberUtil, null, [], function(constructor, prototype) {
    constructor.getRandomInt = function(max) {
        return parseInt((stjs.trunc(Math.random())) * max, 10);
    };
}, {}, {});
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
cwt.WaitAction = function() {};
stjs.extend(cwt.WaitAction, null, [], function(constructor, prototype) {
    prototype.onConstruction = function() {};
}, {}, {});
stjs.ns("cwt");
cwt.Turn = function() {};
stjs.extend(cwt.Turn, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.owner = null;
    prototype.day = 0;
    prototype.turn = 0;
}, {}, {});
stjs.ns("cwt");
cwt.Capturable = function() {};
stjs.extend(cwt.Capturable, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.points = 0;
    prototype.looseAfterCaptured = false;
    prototype.changeIntoAfterCaptured = null;
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
cwt.Manpower = function() {};
stjs.extend(cwt.Manpower, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.manpower = 0;
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
cwt.HideAble = function() {};
stjs.extend(cwt.HideAble, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.additionFuelDrain = 0;
}, {}, {});
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
cwt.Owner = function() {};
stjs.extend(cwt.Owner, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.owner = null;
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
cwt.Capturer = function() {};
stjs.extend(cwt.Capturer, null, [cwt.IEntityComponent], function(constructor, prototype) {
    prototype.points = 0;
}, {}, {});
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
    prototype.onLoadedEntity = function(entity, entityType) {};
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
cwt.SimpleTests = function() {};
stjs.extend(cwt.SimpleTests, null, [cwt.ITest, cwt.ConstructedClass], function(constructor, prototype) {
    prototype.asserter = null;
    prototype.testWhichSucceeds = function() {
        this.asserter.inspectValue("myInt", 10).isInt();
        this.asserter.inspectValue("myString", "MyString").isString();
        this.asserter.throwWhenFailureWasDetected();
    };
    prototype.testWhichFails = function() {
        this.asserter.inspectValue("myInt", 10).isString();
        this.asserter.throwWhenFailureWasDetected();
    };
}, {asserter: "cwt.Asserter"}, {});
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
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.FireAble, stjs.bind(this, function(suicide) {
                    this.asserter.inspectValue("FireAble.damage of " + entity, suicide.damage).isIntWithinRange(1, cwt.Constants.UNIT_HEALTH);
                    this.asserter.inspectValue("FireAble.range of " + entity, suicide.range).isIntWithinRange(1, cwt.Constants.MAX_SELECTION_RANGE);
                    this.asserter.inspectValue("FireAble.changesType of " + entity, suicide.changesType).whenNotNull(stjs.bind(this, function() {
                        this.asserter.isEntityId();
                    }));
                }));
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
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.Supplier, stjs.bind(this, function(supplier) {
                    this.asserter.inspectValue("Supplier.refillLoads of " + entity, supplier.refillLoads).isBoolean();
                    this.asserter.inspectValue("Supplier.supplies of " + entity, supplier.supplies).forEachArrayValue(stjs.bind(this, function(target) {
                        this.asserter.isEntityId();
                    }));
                }));
                break;
        }
        switch (entityType) {
            case cwt.LoadEntityEvent.TYPE_PROPERTY_DATA:
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.Funds, stjs.bind(this, function(funds) {
                    this.asserter.inspectValue("Funds.amount of " + entity, funds.amount).isIntWithinRange(0, 999999);
                }));
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
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.HideAble, stjs.bind(this, function(hideAble) {
                    this.asserter.inspectValue("HideAble.additionFuelDrain of " + entity, hideAble.additionFuelDrain).isIntWithinRange(0, 99);
                }));
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
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.FuelDrain, stjs.bind(this, function(drain) {
                    this.asserter.inspectValue("FuelDrain.daily of " + entity, drain.daily).isIntWithinRange(1, 99);
                }));
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
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.Transporter, stjs.bind(this, function(transporter) {
                    this.asserter.inspectValue("Transporter.slots of " + entity, transporter.slots).isIntWithinRange(1, 10);
                    this.asserter.inspectValue("Transporter.noDamage of " + entity, transporter.loads).forEachArrayValue(stjs.bind(this, function(target) {
                        this.asserter.isEntityId();
                    }));
                }));
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
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.Army, stjs.bind(this, function(army) {
                    this.asserter.inspectValue("Army.name of " + entity, army.name).isString();
                    this.asserter.inspectValue("Army.music of " + entity, army.music).isString();
                    this.asserter.inspectValue("Army.color of " + entity, army.color).isIntWithinRange(0, 999);
                }));
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
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.Repairer, stjs.bind(this, function(repairer) {
                    this.asserter.inspectValue("Repairer.amount of " + entity, repairer.amount).isIntWithinRange(1, cwt.Constants.UNIT_HEALTH);
                    this.asserter.inspectValue("Repairer.targets of " + entity, repairer.targets).forEachArrayValue(stjs.bind(this, function(target) {
                        this.asserter.isEntityId();
                    }));
                }));
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
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.Suicide, stjs.bind(this, function(suicide) {
                    this.asserter.inspectValue("Suicide.damage of " + entity, suicide.damage).isIntWithinRange(1, cwt.Constants.UNIT_HEALTH);
                    this.asserter.inspectValue("Suicide.range of " + entity, suicide.range).isIntWithinRange(1, cwt.Constants.MAX_SELECTION_RANGE);
                    this.asserter.inspectValue("Suicide.noDamage of " + entity, suicide.noDamage).forEachArrayValue(stjs.bind(this, function(target) {
                        this.asserter.isEntityId();
                    }));
                }));
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
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.FighterPrimaryWeapon, stjs.bind(this, function(primWp) {
                    this.asserter.inspectValue("FPW.ammo of " + entity, primWp.ammo).isIntWithinRange(0, 10);
                }));
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.FighterSecondaryWeapon, function(primWp) {});
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.RangedFighter, stjs.bind(this, function(rangFig) {
                    this.asserter.inspectValue("RF.minRange of " + entity, rangFig.minRange).isIntWithinRange(0, cwt.Constants.MAX_SELECTION_RANGE - 1);
                    this.asserter.inspectValue("RF.maxrange of " + entity, rangFig.maxRange).isIntWithinRange(rangFig.minRange + 1, cwt.Constants.MAX_SELECTION_RANGE);
                    this.asserter.inspectValue("FPW and RF exists together of " + entity, this.em.hasEntityComponent(entity, cwt.FighterPrimaryWeapon)).isTrue();
                }));
                break;
            case cwt.LoadEntityEvent.TYPE_PROPERTY_DATA:
            case cwt.LoadEntityEvent.TYPE_TILE_DATA:
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.Defense, stjs.bind(this, function(defense) {
                    this.asserter.inspectValue("DF.defense of " + entity, defense.defense).isIntWithinRange(0, 9);
                }));
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
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.Weather, stjs.bind(this, function(weather) {
                    this.asserter.inspectValue("Weather.defaultWeather of " + entity, weather.defaultWeather).isBoolean();
                }));
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
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.Movable, stjs.bind(this, function(mdata) {
                    this.asserter.inspectValue("Movable.fuel of " + entity, mdata.fuel).isIntWithinRange(1, 99);
                    this.asserter.inspectValue("Movable.range of " + entity, mdata.range).isIntWithinRange(1, cwt.Constants.MAX_SELECTION_RANGE);
                    this.asserter.inspectValue("Movable.type of " + entity, mdata.type).isEntityId();
                }));
                break;
            case cwt.LoadEntityEvent.TYPE_MOVETYPE_DATA:
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.MovingCosts, stjs.bind(this, function(costs) {
                    this.asserter.inspectValue("MovingCosts.costs of " + entity, costs.costs).forEachMapKey(stjs.bind(this, function(key) {
                        this.asserter.isEntityId();
                    }));
                    this.asserter.inspectValue("MovingCosts.costs of " + entity, costs.costs).forEachMapValue(stjs.bind(this, function(value) {
                        this.asserter.isIntWithinRange(0, 99);
                    }));
                }));
                break;
        }
    };
    prototype.onUnitMove = function(unit, steps) {
        var position = this.em.getComponent(unit, cwt.Position);
        var cX = position.x;
        var cY = position.y;
        var oX = cX;
        var oY = cY;
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
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.Buyable, stjs.bind(this, function(buyable) {
                    this.asserter.inspectValue("Buyable.cost of " + entity, buyable.cost).isIntWithinRange(0, 999999);
                }));
                break;
            case cwt.LoadEntityEvent.TYPE_PROPERTY_DATA:
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.Factory, stjs.bind(this, function(factory) {
                    this.asserter.inspectValue("Factory.builds of " + entity, factory.builds).forEachArrayValue(stjs.bind(this, function(value) {
                        this.asserter.isEntityId();
                    }));
                }));
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
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.Vision, stjs.bind(this, function(vision) {
                    this.asserter.inspectValue("Vision.range of " + entity, vision.range).isIntWithinRange(entityType == cwt.LoadEntityEvent.TYPE_UNIT_DATA ? 1 : 0, cwt.Constants.MAX_SELECTION_RANGE);
                }));
                break;
            case cwt.LoadEntityEvent.TYPE_TILE_DATA:
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.Visible, stjs.bind(this, function(visible) {
                    this.asserter.inspectValue("Visible.blocksVision of " + entity, visible.blocksVision).isBoolean();
                }));
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
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.Capturer, stjs.bind(this, function(capturer) {
                    this.asserter.inspectValue("Capturer.points of " + entity, capturer.points).isIntWithinRange(1, 99);
                }));
                break;
            case cwt.LoadEntityEvent.TYPE_PROPERTY_DATA:
                this.em.tryAcquireComponentFromDataSuccessCb(entity, data, cwt.Capturable, stjs.bind(this, function(capturable) {
                    this.asserter.inspectValue("Capturable.points of " + entity, capturable.points).isIntWithinRange(1, 99);
                    this.asserter.inspectValue("Capturable.looseAfterCaptured of " + entity, capturable.looseAfterCaptured).isBoolean();
                    this.asserter.inspectValue("Capturable.changeIntoAfterCaptured", capturable.changeIntoAfterCaptured).whenNotNull(stjs.bind(this, function() {
                        this.asserter.isEntityId();
                    }));
                }));
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
cwt.Asserter = function() {
    cwt.Log.call(this);
};
stjs.extend(cwt.Asserter, cwt.Log, [cwt.ConstructedObject], function(constructor, prototype) {
    prototype.value = null;
    prototype.valueName = null;
    prototype.anAssertionFailed = false;
    /**
     *  Grabs the focus of a given value. All assertions will be checked against on
     *  the inspected value.
     *  
     *  @param pName
     *  @param pValue
     */
    prototype.inspectValue = function(pName, pValue) {
        this.value = pValue;
        this.valueName = pName;
        this.anAssertionFailed = false;
        return this;
    };
    prototype.whenNotNull = function(validationFn) {
        if (this.value != null) {
            validationFn();
        }
        return this;
    };
    prototype.forEachArrayValue = function(valueCb) {
        this.isArray();
        if (this.value != null) {
            var oldName = this.valueName;
            var oldValue = this.value;
            for (var i = 0; i < oldValue.length; i++) {
                this.inspectValue(oldName + " - array item #" + i + " - ", oldValue[i]);
                valueCb(oldValue[i]);
            }
            this.inspectValue(oldName, oldValue);
        }
        return this;
    };
    prototype.forEachMapKey = function(valueCb) {
        this.isNotNull();
        if (this.value != null) {
            var oldName = this.valueName;
            var oldValue = this.value;
            var valueArr = cwt.JsUtil.objectKeys(this.value);
            for (var i = 0; i < valueArr.length; i++) {
                var entryKey = valueArr[i];
                this.inspectValue(oldName + " - object item key #" + i + " - ", entryKey);
                valueCb(entryKey);
            }
            this.inspectValue(oldName, oldValue);
        }
        return this;
    };
    prototype.forEachMapValue = function(valueCb) {
        this.isNotNull();
        if (this.value != null) {
            var oldName = this.valueName;
            var oldValue = this.value;
            var valueArr = cwt.JsUtil.objectKeys(this.value);
            for (var i = 0; i < valueArr.length; i++) {
                var entryKey = valueArr[i];
                var entryValue = (oldValue)[entryKey];
                this.inspectValue(oldName + " - object item value for key " + entryKey + " - ", entryValue);
                valueCb(entryValue);
            }
            this.inspectValue(oldName, oldValue);
        }
        return this;
    };
    prototype.isEntityId = function() {
        this.isString();
        if (this.value == null || this.value.toString().length != cwt.Constants.IDENTIFIER_LENGTH) {
            this.assertionFailed("to be a string which matches the entity id format");
        }
        return this;
    };
    prototype.isString = function() {
        if (this.value == null || (typeof this.value) != "string") {
            this.assertionFailed("to be a string");
        }
        return this;
    };
    prototype.isArray = function() {
        var value = this.value;
        if (value == null || !Array.isArray(value)) {
            this.assertionFailed("to be an array");
        }
        return this;
    };
    prototype.isInt = function() {
        if (this.value == null || (typeof this.value) != "number" || Math.floor(stjs.trunc(this.value)) != stjs.trunc(this.value)) {
            this.assertionFailed("to be an int");
        }
        return this;
    };
    prototype.isIntWithinRange = function(from, to) {
        this.isInt();
        if (this.value == null || stjs.trunc(this.value) < from || stjs.trunc(this.value) > to) {
            this.assertionFailed("between " + from + " and " + to + " (includign bounds)");
        }
        return this;
    };
    prototype.isBoolean = function() {
        if ((typeof this.value) != "boolean") {
            this.assertionFailed("to be boolean");
        }
        return this;
    };
    prototype.isNotNull = function() {
        if (this.value == null) {
            this.assertionFailed("to be not null");
        }
        return this;
    };
    prototype.isTrue = function() {
        if (this.value != true) {
            this.assertionFailed("to be true");
        }
        return this;
    };
    prototype.throwWhenFailureWasDetected = function() {
        if (this.anAssertionFailed) {
            throw new Error('AssertionFailures');
        }
    };
    prototype.assertionFailed = function(msg) {
        this.error("expected " + this.valueName + " " + msg + " [actual value is: " + this.value + "]");
        this.anAssertionFailed = true;
    };
}, {value: "Object"}, {});
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
    constructor.getObjects = function(clazz) {
        var result = [];
        var instanceNames = cwt.JsUtil.objectKeys(cwt.ConstructedFactory.instances);
        for (var i = 0; i < instanceNames.length; i++) {
            var instanceName = instanceNames[i];
            var instance = cwt.ConstructedFactory.instances[instanceName];
            var classObj = (instance).constructor;
            var interfaces = (classObj)["$inherit"];
            if (interfaces.indexOf(clazz) != -1) {
                result.push(instance);
            }
        }
        return result;
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
    prototype.tryAcquireComponentFromDataSuccessCb = function(id, data, componentClass, successCb) {
        var component = this.tryAcquireComponentFromData(id, data, componentClass);
        if (component != null) {
            successCb(component);
        }
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
        if (componentMap == undefined) {
            return null;
        }
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
            return null;
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
stjs.ns("cwt");
cwt.TestManagerSystem = function() {};
stjs.extend(cwt.TestManagerSystem, null, [cwt.ConstructedClass, cwt.SystemStartEvent], function(constructor, prototype) {
    prototype.log = null;
    prototype.passed = 0;
    prototype.failed = 0;
    prototype.onSystemInitialized = function() {
        if (this.isTestExecutionEnabled()) {
            this.callAllTests();
        }
    };
    prototype.callAllTests = function() {
        this.log.info("start tests");
        cwt.JsUtil.forEachArrayValue(cwt.ConstructedFactory.getObjects(cwt.ITest), stjs.bind(this, function(index, test) {
            this.callTestMethods(test);
        }));
        this.log.info("completed tests");
    };
    prototype.callTestMethods = function(test) {
        this.log.info("running " + cwt.ClassUtil.getClassName(test) + " test");
        this.resetStatistics();
        var testProto = ((test).constructor).prototype;
        var properties = cwt.JsUtil.objectKeys(testProto);
        cwt.JsUtil.forEachArrayValue(properties, stjs.bind(this, function(index, property) {
            if (this.isTestCaseProperty(test, property)) {
                this.callTestMethod(test, property);
            }
        }));
        this.printStatistics();
        this.log.info("completed " + cwt.ClassUtil.getClassName(test) + " test");
    };
    prototype.callTestMethod = function(test, methodName) {
        this.log.info("test case " + methodName);
        try {
            ((test)[methodName]).apply(test, []);
            this.log.info(".. has PASSED");
            this.passed++;
        }catch (e) {
            this.log.error(".. has FAILED");
            this.failed++;
        }
    };
    prototype.isTestCaseProperty = function(test, property) {
        return (typeof (test)[property]) == "function" && property.startsWith("test");
    };
    prototype.isTestExecutionEnabled = function() {
        var runTests = cwt.BrowserUtil.getUrlParameterMap()["runTests"];
        return runTests == "true";
    };
    prototype.resetStatistics = function() {
        this.passed = 0;
        this.failed = 0;
    };
    prototype.printStatistics = function() {
        this.log.info("results: TEST-CASES:" + (this.passed + this.failed) + ", PASSED:" + this.passed + ", FAILED:" + this.failed);
    };
}, {log: "cwt.Log"}, {});
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
