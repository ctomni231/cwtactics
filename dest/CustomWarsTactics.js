stjs.ns("cwt");
cwt.Constants = function() {};
stjs.extend(cwt.Constants, null, [], function(constructor, prototype) {
    /**
     *  The version of the game build.
     */
    constructor.VERSION = "0.40";
    /**
     *  The version of the game build.
     */
    constructor.NAMESPACE = "cwt";
    /**
     *  Internal screen height in pixel.
     */
    constructor.SCREEN_HEIGHT_PX = 480;
    /**
     *  Internal screen width in pixel.
     */
    constructor.SCREEN_WIDTH_PX = 640;
}, {}, {});
stjs.ns("cwt");
cwt.ConstructedLogger = function() {};
stjs.extend(cwt.ConstructedLogger, null, [], function(constructor, prototype) {
    prototype.info = function(msg) {};
    prototype.warn = function(msg) {};
    prototype.error = function(msg) {};
}, {}, {});
stjs.ns("cwt");
cwt.Playground = function() {};
stjs.extend(cwt.Playground, null, [], function(constructor, prototype) {
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
    prototype.container = null;
    prototype.atlases = null;
    prototype.data = null;
    prototype.height = 0;
    prototype.images = null;
    prototype.keyboard = null;
    prototype.layer = null;
    prototype.lifetime = 0;
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
    prototype.create = function() {};
    prototype.createstate = function() {};
    prototype.gamepaddown = function(ev) {};
    prototype.gamepadmove = function(ev) {};
    prototype.gamepadup = function(ev) {};
    prototype.keydown = function(ev) {};
    prototype.keyup = function(ev) {};
    constructor.ChangeStateEvent = function() {};
    stjs.extend(cwt.Playground.ChangeStateEvent, null, [], function(constructor, prototype) {
        prototype.prev = null;
        prototype.next = null;
        prototype.state = null;
    }, {prev: "cwt.PlaygroundState", next: "cwt.PlaygroundState", state: "cwt.PlaygroundState"}, {});
    prototype.enterstate = function(event) {};
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
}, {container: "Element", atlases: {name: "Map", arguments: [null, "cwt.CanvasQuery.Atlas"]}, data: {name: "Map", arguments: [null, "Object"]}, images: {name: "Map", arguments: [null, "Canvas"]}, keyboard: "cwt.Playground.KeyboardStatus", layer: "cwt.CanvasQuery", mouse: "cwt.Playground.MouseStatus", music: "cwt.Playground.SoundActions", paths: "cwt.Playground.ResourcePaths", pointers: {name: "Array", arguments: ["cwt.Playground.PointerEvent"]}, sound: "cwt.Playground.SoundActions", touch: "cwt.Playground.TouchStatus"}, {});
stjs.ns("cwt");
cwt.ConstructedClass = function() {};
stjs.extend(cwt.ConstructedClass, null, [], function(constructor, prototype) {
    prototype.onConstruction = function() {};
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
cwt.GameMode = stjs.enumeration("ADVANCE_WARS_1", "ADVANCE_WARS_2");
stjs.ns("cwt");
cwt.GameInit = function() {};
stjs.extend(cwt.GameInit, null, [cwt.ConstructedClass], function(constructor, prototype) {
    prototype.enter = function() {
        this.app.layer.clear("black");
    };
}, {app: "cwt.Playground"}, {});
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
                var interfaces = (object)["$inherit"];
                if (interfaces.indexOf(cwt.ConstructedClass) != -1) {
                    var cmp = new object();
                    cwt.ConstructedFactory.components[objectName] = cmp;
                    cmp.onConstruction();
                }
            }
        }
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
}, {components: {name: "Map", arguments: [null, "Object"]}}, {});
stjs.ns("cwt");
cwt.Cwt = function() {};
stjs.extend(cwt.Cwt, null, [cwt.ConstructedClass, cwt.ConstructedLogger], function(constructor, prototype) {
    prototype.onConstruction = function() {
        this.width = cwt.Constants.SCREEN_WIDTH_PX;
        this.height = cwt.Constants.SCREEN_HEIGHT_PX;
        this.smoothing = false;
        this.container = window.document.getElementById("game");
        this.info("Initialize playground engine");
        playground(this);
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
        this.info("Enter state " + event.state);
    };
    prototype.leavestate = function(event) {
        this.info("Leaving state " + event.state);
    };
}, {container: "Element", atlases: {name: "Map", arguments: [null, "cwt.CanvasQuery.Atlas"]}, data: {name: "Map", arguments: [null, "Object"]}, images: {name: "Map", arguments: [null, "Canvas"]}, keyboard: "cwt.Playground.KeyboardStatus", layer: "cwt.CanvasQuery", mouse: "cwt.Playground.MouseStatus", music: "cwt.Playground.SoundActions", paths: "cwt.Playground.ResourcePaths", pointers: {name: "Array", arguments: ["cwt.Playground.PointerEvent"]}, sound: "cwt.Playground.SoundActions", touch: "cwt.Playground.TouchStatus"}, {});
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
