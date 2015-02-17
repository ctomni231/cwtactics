stjs.ns("wolfTec");
wolfTec.BeanFactory = function(namespace) {
    this.namespace = namespace;
    this.initBeans();
    this.solveDependencies();
};
stjs.extend(wolfTec.BeanFactory, null, [], function(constructor, prototype) {
    prototype.beans = null;
    prototype.namespace = null;
    prototype.factories = null;
    /**
     *  @param bean
     *           name of the bean (usually the class name)
     *  @return a bean with the given name
     */
    prototype.getBean = function(beanName) {
        var bean = this.beans[beanName];
        if (undefined == bean) {
            stjs.exception("Unknown bean name");
        }
        return bean;
    };
    /**
     *  @param typeConstructor
     *           constructor function object of the wanted bean
     *  @return a bean of a given type
     */
    prototype.getBeanOfType = function(typeConstructor) {
        var bean = null;
        var beanNames = Object.keys(this.beans);
        for (var beanName in beanNames) {
            if (!(beanNames).hasOwnProperty(beanName)) 
                continue;
            if (beans[beanName] instanceof typeConstructor) {
                return this.beans[beanName];
            }
        }
        if (null == bean) {
            stjs.exception("Unknown bean type");
        }
        return null;
    };
    /**
     *  
     *  @param intfc
     *  @return
     */
    prototype.getBeansOfInterface = function(intfc) {
        var intfcName;
        var list = [];
        var beanNames = Object.keys(this.beans);
        for (var beanName in beanNames) {
            if (!(beanNames).hasOwnProperty(beanName)) 
                continue;
            if (beans[beanName].constructor.$inherit.indexOf(intfcName) !== -1) {
                list.push(beans[beanName]);
            }
        }
        return list;
    };
    /**
     *  <strong>Note: </strong> This function is low level and contains real JS
     *  code. Modify only if you know what you're doing here.
     */
    prototype.initBeans = function() {
        this.beans = {};
        var possibleBeanNames = Object.keys(cwt);
        for (var name in possibleBeanNames) {
            if (!(possibleBeanNames).hasOwnProperty(name)) 
                continue;
            if (name.endsWith("Bean")) {
                this.beans[name] = new window[this.namespace][name]();
            }
        }
    };
    /**
     *  <strong>Note: </strong> This function is low level and contains real JS
     *  code. Modify only if you know what you're doing here.
     */
    prototype.solveDependencies = function() {
        var beanNames = Object.keys(this.beans);
        for (var beanName in beanNames) {
            if (!(beanNames).hasOwnProperty(beanName)) 
                continue;
            var bean = this.beans[beanName];
            var beanProperties = Object.keys(bean);
            for (var property in beanProperties) {
                if (!(beanProperties).hasOwnProperty(property)) 
                    continue;
                var hasTypeDescription = bean.constructor.$typeDescription.hasOwnProperty(property);
                if (hasTypeDescription) {
                    var propertyClass = bean.constructor.$typeDescription[property];
                    if (propertyClass == "Logger") {
                        bean[property] = LogJS.get({name: beanName, enabled: isDebugEnabled});
                    } else if (propertyClass.endsWith("Bean")) {
                        propertyClass = propertyClass.substring(propertyClass.lastIndexOf(".") + 1);
                        bean[property] = new this.beans[propertyClass]();
                    } else {}
                }
            }
        }
    };
}, {beans: {name: "Map", arguments: [null, "Object"]}, factories: {name: "Array", arguments: ["wolfTec.FactoryBean"]}}, {});
stjs.ns("wolfTec");
wolfTec.EngineOptions = function() {};
stjs.extend(wolfTec.EngineOptions, null, [], function(constructor, prototype) {
    prototype.debug = false;
    prototype.namespace = null;
    prototype.animationTickTime = 0;
    prototype.networkMessageBufferSize = 0;
    prototype.tileSize = 0;
    prototype.STORAGE_PARAMETER_CACHED_CONTENT = null;
    prototype.STORAGE_PARAMETER_MAP_PREFIX = null;
    prototype.STORAGE_PARAMETER_IMAGE_PREFIX = null;
    prototype.STORAGE_PARAMETER_SAVEGAME_PREFIX = null;
    prototype.STORAGE_PARAMETER_INPUT_MAPPING = null;
    prototype.STORAGE_PARAMETER_AUDIO_VOLUME = null;
    prototype.STORAGE_PARAMETER_APPLICATION_CONFIG = null;
}, {}, {});
stjs.ns("wolfTec");
wolfTec.StringKey = function() {};
stjs.extend(wolfTec.StringKey, null, [], function(constructor, prototype) {
    prototype.minLength = function() {};
    prototype.maxLength = function() {};
    prototype.not = function() {};
}, {}, {});
stjs.ns("wolfTec");
wolfTec.CursorHandler = function() {};
stjs.extend(wolfTec.CursorHandler, null, [], function(constructor, prototype) {
    prototype.moveCursor = function(dir, amountOfTiles) {};
}, {}, {});
stjs.ns("wolfTec");
wolfTec.LayerGroup = function() {};
stjs.extend(wolfTec.LayerGroup, null, [], function(constructor, prototype) {
    /**
     *  Renders the layer with the given index into the front layer.
     * 
     *  @param index
     */
    prototype.renderState = function(index) {};
}, {}, {});
stjs.ns("wolfTec");
wolfTec.Globals = function() {};
stjs.extend(wolfTec.Globals, null, [], function(constructor, prototype) {
    constructor.INACTIVE_ID = -1;
    constructor.STORAGE_PARAMETER_CACHED_CONTENT = "cwt_gameContent_cached";
    constructor.STORAGE_PARAMETER_MAP_PREFIX = "cwt_map_";
    constructor.STORAGE_PARAMETER_IMAGE_PREFIX = "cwt_image_";
    constructor.STORAGE_PARAMETER_SAVEGAME_PREFIX = "cwt_savegame_";
    constructor.STORAGE_PARAMETER_INPUT_MAPPING = "cwt_input_mapping";
    constructor.STORAGE_PARAMETER_AUDIO_VOLUME = "cwt_aduio_volume";
    constructor.STORAGE_PARAMETER_APPLICATION_CONFIG = "cwt_app_config";
}, {}, {});
/**
 *  An implementation of the concept of a circular buffer. Internally a circular
 *  buffer has a fixed size that makes the whole object very memory constant.
 * 
 *  @param <T>
 */
stjs.ns("wolfTec");
wolfTec.CircularBuffer = function(maxSize) {
    if (maxSize <= 0) 
        stjs.exception("size cannot be 0 or lower");
    this.index = 0;
    this.size = 0;
    this.data = [];
    this.maxSize = maxSize;
};
stjs.extend(wolfTec.CircularBuffer, null, [], function(constructor, prototype) {
    constructor.DEFAULT_SIZE = 32;
    prototype.index = 0;
    prototype.size = 0;
    prototype.data = null;
    prototype.maxSize = 0;
    prototype.getSize = function() {
        return this.size;
    };
    /**
     * 
     *  @return {boolean} true when no entries are in the buffer, else false
     */
    prototype.isEmpty = function() {
        return this.size == 0;
    };
    /**
     *  @return {boolean} true when buffer is full, else false
     */
    prototype.isFull = function() {
        return this.size == this.maxSize;
    };
    /**
     *  Returns an element at a given index. The element won't be returned.
     * 
     *  @param index
     *  @return {*}
     */
    prototype.get = function(index) {
        if (index < 0 || index >= this.size) 
            stjs.exception("illegal index");
        return this.data[(this.index + index) % this.maxSize];
    };
    /**
     *  Returns the oldest object from the buffer. The element will be removed from
     *  the buffer.
     * 
     *  @returns {*}
     */
    prototype.popFirst = function() {
        if (this.size == 0) 
            stjs.exception("buffer is empty");
        var obj = this.data[this.index];
        this.data[this.index] = null;
        this.size--;
        this.index++;
        if (this.index == this.maxSize) 
            this.index = 0;
        return obj;
    };
    /**
     *  Returns the youngest object from the buffer. The element will be removed
     *  from the buffer.
     * 
     *  @returns {*}
     */
    prototype.popLast = function() {
        if (this.size == 0) 
            stjs.exception("buffer is empty");
        var index = (this.index + this.size - 1) % this.maxSize;
        var obj = this.data[index];
        this.data[index] = null;
        this.size--;
        return obj;
    };
    /**
     *  Pushes an object into the buffer.
     * 
     *  @param el
     */
    prototype.push = function(el) {
        if (this.size == this.maxSize) 
            stjs.exception("buffer is full");
        this.data[(this.index + this.size) % this.maxSize] = el;
        this.size++;
    };
    /**
     *  Pushes an object into the buffer.
     * 
     *  @param el
     */
    prototype.pushInFront = function(el) {
        if (this.size == this.maxSize) 
            stjs.exception("buffer is full");
        var index = this.index - 1;
        if (index < 0) 
            index = this.maxSize - 1;
        this.data[index] = el;
        this.index = index;
        this.size++;
    };
    /**
     *  Removes everything from the buffer. After that the buffer will be empty.
     */
    prototype.clear = function() {
        this.index = 0;
        this.size = 0;
        for (var i = 0, e = this.data.length; i < e; i++) {
            this.data[i] = null;
        }
    };
    /**
     * 
     *  @param source
     *  @param target
     *  @param <M>
     */
    constructor.copyBuffer = function(source, target) {
        if (target.maxSize != source.maxSize) 
            stjs.exception("same size required");
        target.clear();
        for (var i = 0, e = source.size; i < e; i++) {
            target.push(source.get(i));
        }
    };
}, {data: {name: "Array", arguments: ["T"]}}, {});
stjs.ns("wolfTec");
wolfTec.InputBackend = function() {};
stjs.extend(wolfTec.InputBackend, null, [], function(constructor, prototype) {
    prototype.update = function(delta) {};
    prototype.enable = function() {};
    prototype.disable = function() {};
}, {}, {});
stjs.ns("wolfTec");
wolfTec.InputMappable = function() {};
stjs.extend(wolfTec.InputMappable, null, [], function(constructor, prototype) {
    prototype.getInputMapping = function() {};
    prototype.getInputMappingName = function() {};
    prototype.setInputMapping = function(map) {};
}, {}, {});
stjs.ns("wolfTec");
wolfTec.InputTypeKey = stjs.enumeration("UP", "DOWN", "LEFT", "RIGHT", "A", "B", "HOVER", "GENERIC_INPUT");
stjs.ns("wolfTec");
wolfTec.StateMachineBean = function() {
    this.states = {};
};
stjs.extend(wolfTec.StateMachineBean, null, [], function(constructor, prototype) {
    prototype.log = null;
    prototype.jsUtil = null;
    prototype.input = null;
    prototype.action = null;
    prototype.network = null;
    prototype.states = null;
    /**
     *  The active game state.
     */
    prototype.activeState = null;
    prototype.getActiveState = function() {
        return null;
    };
    prototype.started = false;
    prototype.addState = function(id, state) {
        if ((this.states).hasOwnProperty(id)) {
            stjs.exception("StateAlreadyRegistered");
        }
        this.states[id] = state;
    };
    prototype.timestamp = 0;
    prototype.stopLoop = false;
    /**
     *  The central game loop which calls the update function every frame of a 60
     *  frames per second loop.
     */
    prototype.gameLoop = null;
    prototype.init = function() {
        this.gameLoop = stjs.bind(this, function() {
            var newTimestamp = stjs.trunc((new Date()).getTime());
            var delta = newTimestamp - this.timestamp;
            this.timestamp = newTimestamp;
            this.update(delta);
            if (this.stopLoop) {
                this.stopLoop = false;
            } else {
                this.jsUtil.evalJs("requestAnimationFrame(this.gameLoop)");
            }
        });
    };
    /**
     *  Central update method that invokes the active state and calls the action
     *  invoker to evaluate buffered commands. Furthermore it grabs the user input
     *  from the input system to forward them to the update method of the active
     *  state.
     * 
     *  @param delta
     */
    prototype.update = function(delta) {
        if (this.activeState.isAnimationState()) {
            this.activeState.update(delta, null);
            this.activeState.render(delta);
        }
        if (this.network.hasMessages()) {
            this.action.invokeAction(this.network.grabMessage());
            return;
        }
        var inp = this.input.grabCommand();
        this.activeState.update(delta, inp);
        this.activeState.render(delta);
        if (inp != null) {
            this.input.releaseAction(inp);
        }
    };
    /**
     *  Changes the active state. The **exit event** will be fired during the
     *  change process in the old state and the **enter event** in the new state.
     * 
     *  @param stateId
     */
    prototype.changeState = function(stateId) {
        if (this.activeState != null) {
            this.log.info("leaving step " + this.jsUtil.getBeanName(this.activeState));
            this.activeState.exit();
        }
        this.setState(stateId, true);
    };
    prototype.setState = function(stateId, fireEvent) {
        this.activeState = this.states[stateId];
        this.log.info("enter step " + stateId);
        if (fireEvent) {
            this.activeState.enter();
        }
    };
    /**
     *  Starts the loop of the state machine and calls the gameLoop function in
     *  every frame.
     */
    prototype.startGameloop = function() {
        if (this.started) 
            stjs.exception("Already started");
        this.started = true;
        this.log.info("Starting state machine");
        this.timestamp = stjs.trunc((new Date()).getTime());
        requestAnimationFrame(this.gameLoop);
    };
    prototype.stopGameloop = function() {
        this.stopLoop = true;
    };
}, {log: "wolfTec.Logger", jsUtil: "wolfTec.JsUtil", input: "wolfTec.InputBean", action: "wolfTec.ActionHandler", network: "wolfTec.NetworkBean", states: {name: "Map", arguments: [null, "wolfTec.State"]}, activeState: "wolfTec.State", gameLoop: "Callback0"}, {});
stjs.ns("wolfTec");
wolfTec.ActionHandler = function() {};
stjs.extend(wolfTec.ActionHandler, null, [], function(constructor, prototype) {
    prototype.invokeAction = function(message) {};
}, {}, {});
stjs.ns("wolfTec");
wolfTec.JsUtil = function() {};
stjs.extend(wolfTec.JsUtil, null, [], function(constructor, prototype) {
    prototype.getPropertyValue = function(object, property) {
        return this.evalJs("object[property]");
    };
    prototype.getBeanName = function(bean) {
        var name = this.evalJs("object['$cwt$beanName']");
        if (this.evalJs("typeof name == 'string'")) {
            return name;
        }
        stjs.exception("object seems not to be a bean");
        return null;
    };
    prototype.evalJs = function(code) {
        return eval(code);
    };
}, {}, {});
stjs.ns("wolfTec");
wolfTec.BrowserHelperBean = function() {};
stjs.extend(wolfTec.BrowserHelperBean, null, [], function(constructor, prototype) {
    /**
     *  Converts a canvas object to a base64 string.
     *  
     *  @param image
     *  @return
     */
    prototype.convertCanvasToBase64 = function(image) {
        return Base64Helper.canvasToBase64(image);
    };
    /**
     *  Converts a base64 string to a canvas object.
     *  
     *  @param imageData
     *  @return
     */
    prototype.convertBase64ToImage = function(imageData) {
        return Base64Helper.base64ToImage(image);
    };
    /**
     *  
     *  @param param
     *  @return
     */
    prototype.getUrlParameter = function(param) {
        var parameter = getURLQueryParams(document.location.search)[param];
        return parameter !== undefined? parameter : null;
    };
    /**
     * 
     *  @param options
     */
    prototype.doHttpRequest = function(options) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                if (request.readyState == 4 && request.status == 200) {
                    if (options.json) {
                        var arg = null;
                        try {
                            arg = JSON.parse(request.responseText);
                        }catch (e) {
                            options.error(e);
                        }
                        options.success(arg);
                    } else {
                        options.success(request.responseText);
                    }
                } else {
                    options.error(request.statusText);
                }
            }
        };
        request.open("get", options.path + "?_wtEngRnd=" + parseInt(10000 * Math.random(), 10), true);
        request.send();
    };
    prototype.executeSeries = function(functions, finalCallback) {
        R.series(functions, finalCallback);
    };
    /**
     *  
     *  @param obj
     *  @return a list of property names that an object has
     */
    prototype.objectKeys = function(obj) {
        return Object.keys(obj);
    };
    /**
     *  Creates a DOM element.
     *  
     *  @param tag
     *           name of the tag
     *  @return a DOM element with the given tag
     */
    prototype.createDomElement = function(tag) {
        return document.createElement(tag);
    };
}, {}, {});
/**
 *  This annotation marks a property as reference to a bean. It will be
 *  automatically inserted by the {@link BeanFactory} on startup.
 */
stjs.ns("wolfTec");
wolfTec.Injected = function() {};
stjs.extend(wolfTec.Injected, null, [], function(constructor, prototype) {
    prototype.nullable = function() {};
}, {}, {});
stjs.ns("wolfTec");
wolfTec.ImageManipulationBean = function() {};
stjs.extend(wolfTec.ImageManipulationBean, null, [], function(constructor, prototype) {
    prototype.browser = null;
    prototype.getImageData = function(image) {
        var canvas = this.browser.createDomElement("canvas");
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
    prototype.replaceColors = function(image, colorData, numColors, oriIndex, replaceIndex) {
        var canvas = this.browser.createDomElement("canvas");
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
    prototype.convertImageToBlackMask = function(image) {
        var canvas = this.browser.createDomElement("canvas");
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
     *  Flips an image.
     * 
     *  BASED ON http://jsfiddle.net/pankajparashar/KwDhX/
     *  
     *  @param image
     *  @param flipH
     *  @param flipV
     *  @return
     */
    prototype.flipImage = function(image, flipH, flipV) {
        var scaleH = flipH ? -1 : 1;
        var scaleV = flipV ? -1 : 1;
        var posX = flipH ? image.width * -1 : 0;
        var posY = flipV ? image.height * -1 : 0;
        var nCanvas = this.browser.createDomElement("canvas");
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
     *  Draws a part of an image to a new canvas.
     *  
     *  @param image
     *  @param sx
     *  @param sy
     *  @param w
     *  @param h
     *  @return
     */
    prototype.cropImage = function(image, sx, sy, w, h) {
        var canvas = this.browser.createDomElement("canvas");
        var canvasContext = canvas.getContext("2d");
        canvas.width = w;
        canvas.height = h;
        canvasContext.drawImage(image, sx, sy, w, h, 0, 0, w, h);
        return canvas;
    };
    /**
     *  
     *  @param image
     *  @param sx
     *  @param sy
     *  @param w
     *  @param rotation
     *  @return
     */
    prototype.cropAndRotate = function(image, sx, sy, w, rotation) {
        var canvas = this.browser.createDomElement("canvas");
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
     *  
     *  Doubles the size of an assets by using the scale2x algorithm.
     *  
     *  @param image
     *  @return
     */
    prototype.scaleImageWithScale2x = function(image) {
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
        var canvasS = this.browser.createDomElement("canvas");
        var canvasSContext = canvasS.getContext("2d");
        canvasS.width = imgW;
        canvasS.height = imgH;
        canvasSContext.drawImage(image, 0, 0);
        var imgPixelsS = canvasSContext.getImageData(0, 0, imgW, imgH);
        var canvasT = this.browser.createDomElement("canvas");
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
}, {browser: "wolfTec.BrowserHelperBean"}, {});
stjs.ns("wolfTec");
wolfTec.StorageBean = function() {};
stjs.extend(wolfTec.StorageBean, null, [], function(constructor, prototype) {
    /**
     *  iOS 7 has a serious bug which makes unable to get the permission to
     *  increase the internal persistent storage above 5MB. To prevent that bug we
     *  simply use 4 MB as storage. If the pre-set size of the storage is below 5MB
     *  then iOS7 creates a database that can be filled up to 50MB without any
     *  permission. Strange? Yes it is!
     */
    constructor.IOS7_WEBSQL_BUGFIX_SIZE = 4;
    /**
     *  Maximum size of the application storage.
     */
    constructor.DEFAULT_DB_SIZE = 50;
    /**
     *  The given callback will be invoked with the value saved by the given key.
     */
    prototype.get = function(key, callback) {
        localForage.getItem(key, callback);
    };
    /**
     *  Saves a value with a given key. If the key exists, then the old value will
     *  be overwritten. After the saveGameConfig process, the callback will be
     *  invoked.
     */
    prototype.set = function(key, value, callback) {
        var safeCb = function(result, error) {
            if (error != null) {
                localForage.setItem(key, value, callback);
            } else {
                callback(result, null);
            }
        };
        localForage.setItem(key, value, safeCb);
    };
    /**
     *  The given callback will be invoked with a list of all keys that are saved
     *  in the storage.
     */
    prototype.keys = function(callback) {
        localForage.keys(callback);
    };
    /**
     *  Clears all values from the storage. The given callback will be invoked
     *  afterwards.
     */
    prototype.clear = function(callback) {
        localForage.clear(callback);
    };
    /**
     *  Removes a key including the saved value from the storage. The given
     *  callback will be invoked afterwards.
     */
    prototype.remove = function(key, callback) {
        localForage.removeItem(key, callback);
    };
}, {}, {});
(function() {
    var config = {};
    config["name"] = "CWT_DATABASE";
    config["size"] = (1 == 2 ? wolfTec.StorageBean.IOS7_WEBSQL_BUGFIX_SIZE : wolfTec.StorageBean.DEFAULT_DB_SIZE * 1024 * 1024);
    localForage.config(config);
})();
stjs.ns("wolfTec");
wolfTec.UiField = function(x, y, w, h, text, fsize, style, actionFn) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.fsize = fsize;
    this.style = style;
    this.inFocus = false;
    this.action = actionFn;
    this.inactive = false;
    this.key = text;
    this.text = text;
    ("/\\n/").split("\n");
};
stjs.extend(wolfTec.UiField, null, [], function(constructor, prototype) {
    constructor.STYLE_NONE = -1;
    constructor.STYLE_NORMAL = 0;
    constructor.STYLE_S = 1;
    constructor.STYLE_N = 2;
    constructor.STYLE_W = 3;
    constructor.STYLE_E = 4;
    constructor.STYLE_NE = 5;
    constructor.STYLE_NW = 6;
    constructor.STYLE_ES = 7;
    constructor.STYLE_SW = 8;
    constructor.STYLE_EW = 13;
    constructor.STYLE_NS = 14;
    constructor.STYLE_ESW = 9;
    constructor.STYLE_NEW = 10;
    constructor.STYLE_NSW = 11;
    constructor.STYLE_NES = 12;
    prototype.x = 0;
    prototype.y = 0;
    prototype.width = 0;
    prototype.height = 0;
    prototype.text = null;
    prototype.action = null;
    prototype.inactive = false;
    prototype.inFocus = false;
    prototype.fsize = 0;
    prototype.style = 0;
    prototype.key = null;
    prototype.isInactive = function() {
        return this.inactive;
    };
    prototype.isPositionInElement = function(x, y) {
        return (x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height);
    };
    prototype.callAction = function() {
        if (this.action != null) {
            this.action();
        }
    };
    prototype.erase = function(ctx) {
        ctx.clearRect(this.x, this.y, this.width, this.height);
    };
    prototype.draw = function(ctx) {
        if (this.style == wolfTec.UiField.STYLE_NONE) {
            return;
        }
        ctx.fillStyle = (this.inFocus) ? "rgb(220,220,220)" : "white";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "rgb(60,60,60)";
        switch (this.style) {
            case wolfTec.UiField.STYLE_NORMAL:
                ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);
                ctx.fillStyle = (this.inFocus) ? "rgb(220,220,220)" : "white";
                ctx.fillRect(this.x + 3, this.y + 3, this.width - 6, this.height - 6);
                break;
            case wolfTec.UiField.STYLE_N:
                ctx.fillRect(this.x, this.y + 1, this.width, 2);
                break;
            case wolfTec.UiField.STYLE_E:
                ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height);
                break;
            case wolfTec.UiField.STYLE_S:
                ctx.fillRect(this.x, this.y + this.height - 3, this.width, 2);
                break;
            case wolfTec.UiField.STYLE_W:
                ctx.fillRect(this.x + 1, this.y, 2, this.height);
                break;
            case wolfTec.UiField.STYLE_NE:
                ctx.fillRect(this.x, this.y + 1, this.width - 1, 2);
                ctx.fillRect(this.x + this.width - 3, this.y + 1, 2, this.height - 1);
                break;
            case wolfTec.UiField.STYLE_NW:
                ctx.fillRect(this.x + 1, this.y + 1, this.width, 2);
                ctx.fillRect(this.x + 1, this.y + 1, 2, this.height - 1);
                break;
            case wolfTec.UiField.STYLE_ES:
                ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height - 1);
                ctx.fillRect(this.x, this.y + this.height - 3, this.width - 1, 2);
                break;
            case wolfTec.UiField.STYLE_SW:
                ctx.fillRect(this.x + 1, this.y + this.height - 3, this.width - 1, 2);
                ctx.fillRect(this.x + 1, this.y, 2, this.height - 1);
                break;
            case wolfTec.UiField.STYLE_EW:
                ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height);
                ctx.fillRect(this.x + 1, this.y, 2, this.height);
                break;
            case wolfTec.UiField.STYLE_NS:
                ctx.fillRect(this.x, this.y + 1, this.width, 2);
                ctx.fillRect(this.x, this.y + this.height - 3, this.width, 2);
                break;
            case wolfTec.UiField.STYLE_ESW:
                ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height - 1);
                ctx.fillRect(this.x + 1, this.y + this.height - 3, this.width - 2, 2);
                ctx.fillRect(this.x + 1, this.y, 2, this.height - 1);
                break;
            case wolfTec.UiField.STYLE_NEW:
                ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, 2);
                ctx.fillRect(this.x + this.width - 3, this.y + 1, 2, this.height - 1);
                ctx.fillRect(this.x + 1, this.y + 1, 2, this.height - 1);
                break;
            case wolfTec.UiField.STYLE_NSW:
                ctx.fillRect(this.x + 1, this.y + 1, this.width - 1, 2);
                ctx.fillRect(this.x + 1, this.y + this.height - 3, this.width - 1, 2);
                ctx.fillRect(this.x + 1, this.y + 1, 2, this.height - 2);
                break;
            case wolfTec.UiField.STYLE_NES:
                ctx.fillRect(this.x, this.y + 1, this.width - 1, 2);
                ctx.fillRect(this.x + this.width - 3, this.y + 1, 2, this.height - 2);
                ctx.fillRect(this.x, this.y + this.height - 3, this.width - 1, 2);
                break;
        }
        ctx.fillStyle = "black";
        if (this.text != null && this.text.length > 0) {
            var tw = ctx.measureText(this.text);
            ctx.fillText(this.text, this.x + (stjs.trunc(this.width / 2)) - (stjs.trunc(tw.width / 2)), this.y + (stjs.trunc(this.height / 2)) + stjs.trunc(this.fsize / 2), this.width);
        }
    };
}, {action: "Callback0"}, {});
stjs.ns("wolfTec");
wolfTec.StorageEntry = function() {};
stjs.extend(wolfTec.StorageEntry, null, [], function(constructor, prototype) {
    prototype.key = null;
    prototype.value = null;
}, {}, {});
stjs.ns("wolfTec");
wolfTec.FactoryBean = function() {};
stjs.extend(wolfTec.FactoryBean, null, [], function(constructor, prototype) {
    prototype.create = function(propertyName, propertyClass) {};
}, {}, {});
stjs.ns("wolfTec");
wolfTec.ValidateKey = function() {};
stjs.extend(wolfTec.ValidateKey, null, [], function(constructor, prototype) {
    prototype.minLength = function() {};
    prototype.maxLength = function() {};
}, {}, {});
stjs.ns("wolfTec");
wolfTec.InputBackendType = stjs.enumeration("KEYBOARD", "GAMEPAD", "TOUCH", "MOUSE");
/**
 *  This annotation marks a property as reference to a map of beans that
 *  implements the given Interface. They will be automatically inserted by the
 *  {@link BeanFactory} on startup. The key of a value will be determined by the
 *  class path plus class name (e.g. wolfTec.MyBean will result into
 *  <code><"wolfTec.MyBean", wolfTec.MyBean@xyz></code>).
 */
stjs.ns("wolfTec");
wolfTec.InjectedMapByInterface = function() {};
stjs.extend(wolfTec.InjectedMapByInterface, null, [], null, {}, {});
stjs.ns("wolfTec");
wolfTec.AssetItem = function(path, name, type) {
    this.path = path;
    this.name = name;
    this.type = type;
};
stjs.extend(wolfTec.AssetItem, null, [], function(constructor, prototype) {
    prototype.path = null;
    prototype.name = null;
    prototype.type = null;
}, {type: {name: "Enum", arguments: ["wolfTec.AssetType"]}}, {});
stjs.ns("wolfTec");
wolfTec.AssetType = stjs.enumeration("MAPS", "IMAGES", "MUSIC", "SFX", "MODIFICATION", "LANGUAGE");
stjs.ns("wolfTec");
wolfTec.StringValue = function() {};
stjs.extend(wolfTec.StringValue, null, [], function(constructor, prototype) {
    prototype.minLength = function() {};
    prototype.maxLength = function() {};
    prototype.not = function() {};
}, {}, {});
stjs.ns("wolfTec");
wolfTec.AudioChannel = stjs.enumeration("CHANNEL_SFX", "CHANNEL_BG");
/**
 *  This annotation marks a class as bean and it will be instantiated by the
 *  {@link BeanFactory} on startup.
 */
stjs.ns("wolfTec");
wolfTec.Bean = function() {};
stjs.extend(wolfTec.Bean, null, [], null, {}, {});
stjs.ns("wolfTec");
wolfTec.NetworkMessage = function() {};
stjs.extend(wolfTec.NetworkMessage, null, [], function(constructor, prototype) {
    prototype.actionId = 0;
    prototype.parameters = null;
}, {parameters: {name: "Array", arguments: [null]}}, {});
stjs.ns("wolfTec");
wolfTec.AssetLoader = function() {};
stjs.extend(wolfTec.AssetLoader, null, [], function(constructor, prototype) {
    /**
     *  
     *  @param storage
     *  @param item
     *  @param callback
     */
    prototype.loadAsset = function(storage, item, callback) {};
    /**
     *  Called when an asset must be grabbed from remote location and cached
     *  internally.
     *  
     *  @param storage
     *  @param item
     *  @param callback
     */
    prototype.grabAsset = function(storage, item, callback) {};
}, {}, {});
stjs.ns("wolfTec");
wolfTec.ExternalRequestOptions = function() {};
stjs.extend(wolfTec.ExternalRequestOptions, null, [], function(constructor, prototype) {
    prototype.path = null;
    prototype.type = null;
    prototype.json = false;
    prototype.success = null;
    prototype.error = null;
}, {success: {name: "Callback1", arguments: ["Object"]}, error: {name: "Callback1", arguments: ["Object"]}}, {});
/**
 *  This interfaces the ability to validate an object against a set of validation
 *  annotations.
 */
stjs.ns("wolfTec");
wolfTec.DataObjectValidator = function() {};
stjs.extend(wolfTec.DataObjectValidator, null, [], function(constructor, prototype) {
    prototype.validateDataObject = function(dataClass, obj) {
        return null;
    };
}, {}, {});
stjs.ns("wolfTec");
wolfTec.AnimationManagerBean = function() {};
stjs.extend(wolfTec.AnimationManagerBean, null, [], function(constructor, prototype) {
    prototype.curTime = 0;
    prototype.layers = null;
    prototype.options = null;
    prototype.layerStates = null;
    prototype.init = function() {
        this.curTime = 0;
    };
    prototype.update = function(delta) {
        this.curTime += delta;
        if (this.curTime > this.options.animationTickTime) {
            this.curTime = 0;
            for (var i = 0; i < this.layers.length; i++) {
                var layer = this.layers[i];
                var state = this.layerStates[i];
                if (state + 1 < layer.getSubStates()) {
                    state += 1;
                } else {
                    state = 0;
                }
                this.layerStates[i] = state;
                if (layer.isDoubleStepAnimated()) {
                    if (state % 2 == 0) {
                        layer.renderState(stjs.trunc(state / 2));
                    }
                } else {
                    layer.renderState(state);
                }
            }
        }
    };
}, {layers: {name: "Array", arguments: ["wolfTec.AnimatedLayer"]}, options: "wolfTec.EngineOptions", layerStates: {name: "Array", arguments: [null]}}, {});
stjs.ns("wolfTec");
wolfTec.MenuRenderer = function() {};
stjs.extend(wolfTec.MenuRenderer, null, [], function(constructor, prototype) {
    prototype.renderButton = function() {};
    prototype.renderCheckbox = function() {};
    prototype.renderField = function() {};
    prototype.renderCustomField = function() {};
}, {}, {});
/**
 *  This annotation marks a method as bean initialization listener. It will be
 *  called by the {@link BeanFactory} after the bean has initialized and it's
 *  references been injected.
 */
stjs.ns("wolfTec");
wolfTec.PostInitialization = function() {};
stjs.extend(wolfTec.PostInitialization, null, [], null, {}, {});
stjs.ns("wolfTec");
wolfTec.Direction = stjs.enumeration("UP", "DOWN", "LEFT", "RIGHT");
/**
 *  
 *  This is only available on Google Chrome at the moment. Every other browser
 *  will likely return -1 for every method invocation in this bean.
 */
stjs.ns("wolfTec");
wolfTec.MemoryTools = function() {};
stjs.extend(wolfTec.MemoryTools, null, [], function(constructor, prototype) {
    prototype.memoryProfilingEnabled = false;
    prototype.init = function() {
        this.memoryProfilingEnabled = (performance && performance.memory);
    };
    /**
     *  
     *  @return heap size limit or -1 if performance API is not available
     */
    prototype.getHeapSizeLimit = function() {
        return this.memoryProfilingEnabled ? performance.memory.jsHeapSizeLimit : -1;
    };
    /**
     *  
     *  @return total heap size or -1 if performance API is not available
     */
    prototype.getTotalHeapSize = function() {
        return this.memoryProfilingEnabled ? performance.memory.totalJSHeapSize : -1;
    };
    /**
     *  
     *  @return used heap size or -1 if performance API is not available
     */
    prototype.getUsedHeapSize = function() {
        return this.memoryProfilingEnabled ? performance.memory.usedJSHeapSize : -1;
    };
}, {}, {});
stjs.ns("wolfTec");
wolfTec.Sprite = function(entries) {
    var nullObj = null;
     while (entries > 0){
        this.images.push(nullObj);
        entries--;
    }
};
stjs.extend(wolfTec.Sprite, null, [], function(constructor, prototype) {
    prototype.images = null;
    prototype.graphic = null;
    prototype.spriteHeight = 0;
    prototype.spriteWidth = 0;
    prototype.offsetX = 0;
    prototype.offsetY = 0;
    prototype.height = 0;
    prototype.width = 0;
    prototype.isOverlaySprite = function() {
        return false;
    };
    /**
     *  @returns {Number}
     */
    prototype.getNumberOfImages = function() {
        return this.images.length;
    };
    /**
     *  @param index
     *  @param image
     */
    prototype.setImage = function(index, image) {
        if (index < 0 && index >= this.images.length) {
            stjs.exception("IllegalIndex");
        }
        this.images[index] = image;
    };
    /**
     *  @param index
     *  @returns {behaviorTree.Sprite}
     */
    prototype.getImage = function(index) {
        return this.images[index];
    };
}, {images: {name: "Array", arguments: ["Canvas"]}, graphic: "Canvas"}, {});
stjs.ns("wolfTec");
wolfTec.Pagination = function(list, pageSize, updateFn) {
    this.page = 0;
    this.list = list;
    var nullObj = null;
    this.entries = [];
     while (pageSize > 0){
        this.entries.push(nullObj);
        pageSize--;
    }
    this.updateFn = updateFn;
};
stjs.extend(wolfTec.Pagination, null, [], function(constructor, prototype) {
    prototype.page = 0;
    prototype.list = null;
    prototype.entries = null;
    prototype.updateFn = null;
    /**
     *  Selects a page from the list. The entries of the selected page will be
     *  saved in the **entries** property of the pagination object.
     * 
     *  @param index
     */
    prototype.selectPage = function(index) {
        var PAGE_SIZE = this.entries.length;
        if (index < 0 || index * PAGE_SIZE >= this.list.length) {
            return;
        }
        this.page = index;
        index = (index * PAGE_SIZE);
        for (var n = 0; n < PAGE_SIZE; n++) {
            this.entries[n] = index + n >= this.list.length ? null : this.list[index + n];
        }
        if (this.updateFn != null) {
            this.updateFn();
        }
    };
}, {list: {name: "Array", arguments: ["Object"]}, entries: {name: "Array", arguments: ["Object"]}, updateFn: "Callback0"}, {});
/**
 *  This annotation marks a property as reference to a list of beans that
 *  implements the given Interface. They will be automatically inserted by the
 *  {@link BeanFactory} on startup.
 */
stjs.ns("wolfTec");
wolfTec.InjectedListByInterface = function() {};
stjs.extend(wolfTec.InjectedListByInterface, null, [], null, {}, {});
stjs.ns("wolfTec");
wolfTec.ConvertUtility = function() {};
stjs.extend(wolfTec.ConvertUtility, null, [], function(constructor, prototype) {
    prototype.strToInt = function(number) {
        return parseInt(number, 10);
    };
    prototype.floatToInt = function(number) {
        return parseInt(number, 10);
    };
}, {}, {});
stjs.ns("wolfTec");
wolfTec.ListUtil = function() {};
stjs.extend(wolfTec.ListUtil, null, [], function(constructor, prototype) {
    /**
     *  Selects a random element from a given list and returns it. It's possible to
     *  give a forbiddenElement that won't be selected from the list.
     * 
     *  @param list
     *  @param forbiddenElement
     *  @returns {*}
     */
    prototype.selectRandom = function(list, forbiddenElement) {
        var e = list.length;
        if (e == 0 || (e == 1 && list[0] == forbiddenElement)) {
            stjs.exception("IllegalArguments");
        }
        var r = parseInt(Math.random() * e, 10);
        var selected = list[r];
        if (selected == forbiddenElement) {
            selected = list[r < e - 1 ? r + 1 : r - 1];
        }
        return selected;
    };
}, {}, {});
/**
 *  This annotation marks a property as reference to a bean. It will be
 *  automatically inserted by the {@link BeanFactory} on startup.
 */
stjs.ns("wolfTec");
wolfTec.InjectedByFactory = function() {};
stjs.extend(wolfTec.InjectedByFactory, null, [], null, {}, {});
stjs.ns("wolfTec");
wolfTec.IntValue = function() {};
stjs.extend(wolfTec.IntValue, null, [], function(constructor, prototype) {
    prototype.max = function() {};
    prototype.min = function() {};
    prototype.not = function() {};
}, {}, {});
stjs.ns("wolfTec");
wolfTec.ScreenManagerBean = function() {};
stjs.extend(wolfTec.ScreenManagerBean, null, [], function(constructor, prototype) {
    prototype.MENU_ENTRY_HEIGHT = 0;
    prototype.MENU_ENTRY_WIDTH = 0;
    prototype.options = null;
    prototype.layers = null;
    prototype.height = 0;
    prototype.width = 0;
    prototype.offsetX = 0;
    prototype.offsetY = 0;
    prototype.scale = 0;
    prototype.init = function() {
        this.MENU_ENTRY_HEIGHT = 2 * this.options.tileSize;
        this.MENU_ENTRY_WIDTH = 10 * this.options.tileSize;
    };
    prototype.setCameraPosition = function(x, y) {};
    prototype.shiftCameraPosition = function(direction, amount) {};
}, {options: "wolfTec.EngineOptions", layers: {name: "Array", arguments: ["wolfTec.Camera"]}}, {});
stjs.ns("wolfTec");
wolfTec.Engine = function(options) {
    this.options = options;
    this.beanFactory = new wolfTec.BeanFactory(null);
};
stjs.extend(wolfTec.Engine, null, [], function(constructor, prototype) {
    prototype.beanFactory = null;
    prototype.options = null;
}, {beanFactory: "wolfTec.BeanFactory", options: "wolfTec.EngineOptions"}, {});
stjs.ns("wolfTec");
wolfTec.AnimatedLayer = function() {};
stjs.extend(wolfTec.AnimatedLayer, null, [wolfTec.LayerGroup], function(constructor, prototype) {
    prototype.getSubStates = function() {};
    prototype.isDoubleStepAnimated = function() {
        return false;
    };
}, {}, {});
stjs.ns("wolfTec");
wolfTec.Camera = function() {};
stjs.extend(wolfTec.Camera, null, [wolfTec.LayerGroup], function(constructor, prototype) {
    prototype.cv = null;
    prototype.ctx = null;
    prototype.w = 0;
    prototype.h = 0;
    prototype.contexts = null;
    prototype.layers = null;
    prototype.getZIndex = function() {};
    prototype.getLayerCanvasId = function() {};
    prototype.onScreenShift = function(dir, offsetX, offsetY, amount, scale) {};
    prototype.onFullScreenRender = function() {};
    prototype.onSetScreenPosition = function(x, y, offsetX, offsetY) {};
    prototype.initialize = function(canvasId, frames, w, h) {
        this.cv = window.document.getElementById(canvasId);
        this.cv.width = w;
        this.cv.height = h;
        this.ctx = this.cv.getContext("2d");
        this.w = w;
        this.h = h;
        if (frames > 0) {
            this.contexts = [];
            this.layers = [];
            var n = 0;
             while (n < frames){
                var cv = window.document.createElement("canvas");
                cv.width = w;
                cv.height = h;
                this.contexts[n] = cv.getContext("2d");
                this.layers[n] = cv;
                n++;
            }
        }
    };
    prototype.renderState = function(index) {
        var ctx = this.getContext(wolfTec.Globals.INACTIVE_ID);
        ctx.clearRect(0, 0, this.w, this.h);
        ctx.drawImage(this.getLayer(index), 0, 0, this.w, this.h);
    };
    /**
     * 
     *  @param {number?} index
     *  @returns {HTMLCanvasElement}
     */
    prototype.getLayer = function(index) {
        if (index == wolfTec.Globals.INACTIVE_ID) {
            return this.cv;
        }
        return this.layers[index];
    };
    /**
     *  Clears the layer with the given index.
     * 
     *  @param index
     *           index of the layer
     */
    prototype.clear = function(index) {
        this.getContext(index).clearRect(0, 0, this.w, this.h);
    };
    /**
     *  Clears all background layers including the front layer.
     */
    prototype.clearAll = function() {
        var n = this.layers.length - 1;
         while (n >= 0){
            this.clear(n);
            n--;
        }
        this.clear(wolfTec.Globals.INACTIVE_ID);
    };
    /**
     *  Returns the context of a layer with the given index.
     * 
     *  @param {number?} index
     *  @returns {CanvasRenderingContext2D}
     */
    prototype.getContext = function(index) {
        if (index == wolfTec.Globals.INACTIVE_ID) {
            return this.ctx;
        }
        return this.contexts[index];
    };
    prototype.renderSprite = function(sprite, x, y) {};
}, {cv: "Canvas", ctx: "CanvasRenderingContext2D", contexts: {name: "Array", arguments: ["CanvasRenderingContext2D"]}, layers: {name: "Array", arguments: ["Canvas"]}}, {});
stjs.ns("wolfTec");
wolfTec.InputBean = function() {};
stjs.extend(wolfTec.InputBean, null, [], function(constructor, prototype) {
    prototype.log = null;
    prototype.stack = null;
    prototype.buffer = null;
    /**
     *  If true, then every user input will be blocked.
     */
    prototype.blocked = false;
    /**
     *  Returns true when the input system wants a generic input (raw codes) from
     *  input backends like keyboards and game pads.
     */
    prototype.genericInput = false;
    /**
     *  Pushes an input **key** into the input stack. The parameters **d1** and
     *  **d2** has to be integers.
     * 
     *  @param key
     *  @param d1
     *  @param d2
     */
    prototype.pushAction = function(key, d1, d2) {
        if (this.blocked || this.buffer.isEmpty()) 
            return;
        this.log.info("adding input data " + key + ", " + d1 + ", " + d2);
        var cmd = this.buffer.popFirst();
        cmd.d1 = d1;
        cmd.d2 = d2;
        cmd.key = key;
        this.stack.push(cmd);
    };
    prototype.hasCommands = function() {
        return !this.stack.isEmpty();
    };
    /**
     *  Grabs and returns an **input data object** from the input stack, **null**
     *  if the stack is empty.
     * 
     *  @return
     */
    prototype.grabCommand = function() {
        if (this.stack.isEmpty()) {
            return null;
        }
        return this.stack.popFirst();
    };
    prototype.dropBufferedCommands = function() {
         while (!this.stack.isEmpty()){
            this.releaseAction(this.stack.popLast());
        }
    };
    /**
     *  Returns the character for a key code.
     */
    prototype.codeToChar = function(charCode) {
        if (charCode == wolfTec.Globals.INACTIVE_ID) {
            return "";
        }
        var value = (String).fromCharCode(charCode);
        switch (charCode) {
            case 6:
                value = "Mac";
                break;
            case 8:
                value = "Backspace";
                break;
            case 9:
                value = "Tab";
                break;
            case 13:
                value = "Enter";
                break;
            case 16:
                value = "Shift";
                break;
            case 17:
                value = "CTRL";
                break;
            case 18:
                value = "ALT";
                break;
            case 19:
                value = "Pause/Break";
                break;
            case 20:
                value = "Caps Lock";
                break;
            case 27:
                value = "ESC";
                break;
            case 32:
                value = "Space";
                break;
            case 33:
                value = "Page Up";
                break;
            case 34:
                value = "Page Down";
                break;
            case 35:
                value = "End";
                break;
            case 36:
                value = "Home";
                break;
            case 37:
                value = "Arrow Left";
                break;
            case 38:
                value = "Arrow Up";
                break;
            case 39:
                value = "Arrow Right";
                break;
            case 40:
                value = "Arrow Down";
                break;
            case 43:
                value = "Plus";
                break;
            case 45:
                value = "Insert";
                break;
            case 46:
                value = "Delete";
                break;
            case 91:
                value = "Left Window Key";
                break;
            case 92:
                value = "Right Window Key";
                break;
            case 93:
                value = "Select Key";
                break;
            case 96:
                value = "Numpad 0";
                break;
            case 97:
                value = "Numpad 1";
                break;
            case 98:
                value = "Numpad 2";
                break;
            case 99:
                value = "Numpad 3";
                break;
            case 100:
                value = "Numpad 4";
                break;
            case 101:
                value = "Numpad 5";
                break;
            case 102:
                value = "Numpad 6";
                break;
            case 103:
                value = "Numpad 7";
                break;
            case 104:
                value = "Numpad 8";
                break;
            case 105:
                value = "Numpad 9";
                break;
            case 106:
                value = "*";
                break;
            case 107:
                value = "+";
                break;
            case 109:
                value = "-";
                break;
            case 110:
                value = ";";
                break;
            case 111:
                value = "/";
                break;
            case 112:
                value = "F1";
                break;
            case 113:
                value = "F2";
                break;
            case 114:
                value = "F3";
                break;
            case 115:
                value = "F4";
                break;
            case 116:
                value = "F5";
                break;
            case 117:
                value = "F6";
                break;
            case 118:
                value = "F7";
                break;
            case 119:
                value = "F8";
                break;
            case 120:
                value = "F9";
                break;
            case 121:
                value = "F10";
                break;
            case 122:
                value = "F11";
                break;
            case 123:
                value = "F12";
                break;
            case 144:
                value = "Num Lock";
                break;
            case 145:
                value = "Scroll Lock";
                break;
            case 186:
                value = ";";
                break;
            case 187:
                value = "=";
                break;
            case 188:
                value = ",";
                break;
            case 189:
                value = "-";
                break;
            case 190:
                value = ".";
                break;
            case 191:
                value = "/";
                break;
            case 192:
                value = "`";
                break;
            case 219:
                value = "[";
                break;
            case 220:
                value = "\\";
                break;
            case 221:
                value = "]";
                break;
            case 222:
                value = "'";
                break;
        }
        return value;
    };
    prototype.releaseAction = function(inp) {
        this.buffer.push(inp);
    };
}, {log: "wolfTec.Logger", stack: {name: "wolfTec.CircularBuffer", arguments: ["wolfTec.InputData"]}, buffer: {name: "wolfTec.CircularBuffer", arguments: ["wolfTec.InputData"]}}, {});
stjs.ns("wolfTec");
wolfTec.InputMappingManagerBean = function() {};
stjs.extend(wolfTec.InputMappingManagerBean, null, [], function(constructor, prototype) {
    prototype.log = null;
    prototype.storage = null;
    prototype.browser = null;
    prototype.mappables = null;
    /**
     *  Saves the input mappings from the input backends into the storage.
     *  
     *  @param callback
     */
    prototype.saveConfig = function(callback) {
        var mappings = {};
        for (var i = 0; i < this.mappables.length; i++) {
            mappings[this.mappables[i].getInputMappingName()] = this.mappables[i].getInputMapping();
        }
        this.storage.set(wolfTec.Globals.STORAGE_PARAMETER_INPUT_MAPPING, mappings, stjs.bind(this, function(data, error) {
            if (error != null) {
                this.log.error("SavingInputMappingError");
            } else {
                this.log.info("Successfully saved user input mappings");
                callback();
            }
        }));
    };
    /**
     *  Loads the input mapping configuration from storage and injects it into the
     *  possible input backends.
     *  
     *  @param callback
     */
    prototype.loadConfig = function(callback) {
        this.storage.get(wolfTec.Globals.STORAGE_PARAMETER_INPUT_MAPPING, stjs.bind(this, function(entry) {
            if (entry.value != null) {
                var mappings = entry.value;
                var mappingKeys = this.browser.objectKeys(mappings);
                for (var i = 0; i < mappingKeys.length; i++) {
                    var curKey = mappingKeys[i];
                    for (var j = 0; j < this.mappables.length; j++) {
                        if (this.mappables[j].getInputMappingName() == curKey) {
                            this.mappables[j].setInputMapping(mappings[curKey]);
                            break;
                        }
                    }
                }
            }
            this.log.info("Successfully load user input mappings");
            callback();
        }));
    };
}, {log: "wolfTec.Logger", storage: "wolfTec.StorageBean", browser: "wolfTec.BrowserHelperBean", mappables: {name: "Array", arguments: ["wolfTec.InputMappable"]}}, {});
stjs.ns("wolfTec");
wolfTec.ConnectedTile = function(desc, connection) {
    this.desc = desc;
    this.connection = connection;
};
stjs.extend(wolfTec.ConnectedTile, null, [], function(constructor, prototype) {
    prototype.desc = null;
    prototype.connection = null;
    /**
     *  Grabs the short key for a given type.
     * 
     *  @param typeId
     *  @return
     */
    prototype.grabShortKey = function(typeId) {
        return ((this.desc).hasOwnProperty(typeId)) ? this.desc[typeId] : "";
    };
    /**
     *  Returns the variant number in relation to a given set of neighbor types.
     * 
     *  @param typeN
     *           tile type ID in the north
     *  @param typeE
     *           tile type ID in the east
     *  @param typeS
     *           tile type ID in the south
     *  @param typeW
     *           tile type ID in the west
     *  @param typeNE
     *           tile type ID in the north east
     *  @param typeSE
     *           tile type ID in the south east
     *  @param typeSW
     *           tile type ID in the south west
     *  @param typeNW
     *           tile type ID in the north west
     */
    prototype.getVariant = function(typeN, typeE, typeS, typeW, typeNE, typeSE, typeSW, typeNW) {
        typeN = this.grabShortKey(typeN);
        typeE = this.grabShortKey(typeE);
        typeS = this.grabShortKey(typeS);
        typeW = this.grabShortKey(typeW);
        typeNE = this.grabShortKey(typeNE);
        typeSE = this.grabShortKey(typeSE);
        typeSW = this.grabShortKey(typeSW);
        typeNW = this.grabShortKey(typeNW);
        for (var i = 0, e = this.connection.length; i < e; i++) {
            var cConn = this.connection[i];
            if (cConn.length == 5) {
                if (cConn[1] != "" && cConn[1] != typeN) 
                    continue;
                if (cConn[2] != "" && cConn[2] != typeE) 
                    continue;
                if (cConn[3] != "" && cConn[3] != typeS) 
                    continue;
                if (cConn[4] != "" && cConn[4] != typeW) 
                    continue;
            } else {
                if (cConn[1] != "" && cConn[1] != typeN) 
                    continue;
                if (cConn[2] != "" && cConn[2] != typeNE) 
                    continue;
                if (cConn[3] != "" && cConn[3] != typeE) 
                    continue;
                if (cConn[4] != "" && cConn[4] != typeSE) 
                    continue;
                if (cConn[5] != "" && cConn[5] != typeS) 
                    continue;
                if (cConn[6] != "" && cConn[6] != typeSW) 
                    continue;
                if (cConn[7] != "" && cConn[7] != typeW) 
                    continue;
                if (cConn[8] != "" && cConn[8] != typeNW) 
                    continue;
            }
            return Integer.parseInt(cConn[0].toString());
        }
        return wolfTec.Globals.INACTIVE_ID;
    };
}, {desc: {name: "Map", arguments: [null, null]}, connection: {name: "Array", arguments: [{name: "Array", arguments: [null]}]}}, {});
stjs.ns("wolfTec");
wolfTec.MoveableMatrix = function(sideLength) {
    this.data = [];
    for (var i = 0; i < sideLength; i++) {
        this.data.push([]);
        for (var j = 0; j < sideLength; j++) {
            this.data[i][j] = wolfTec.Globals.INACTIVE_ID;
        }
    }
};
stjs.extend(wolfTec.MoveableMatrix, null, [], function(constructor, prototype) {
    prototype.sideLen = 0;
    prototype.centerX = 0;
    prototype.centerY = 0;
    prototype.defaultValue = 0;
    prototype.data = null;
    prototype.getCenterX = function() {
        return this.centerX;
    };
    prototype.getCenterY = function() {
        return this.centerY;
    };
    prototype.setCenter = function(centerx, centery, defaultValue) {
        this.centerX = Math.max(0, centerx - (this.sideLen - 1));
        this.centerY = Math.max(0, centery - (this.sideLen - 1));
        this.defaultValue = defaultValue;
        for (var rx = 0; rx < this.sideLen; rx++) {
            for (var ry = 0; ry < this.sideLen; ry++) {
                this.data[rx][ry] = defaultValue;
            }
        }
    };
    prototype.getValue = function(x, y) {
        x = x - this.centerX;
        y = y - this.centerY;
        if (x < 0 || y < 0 || x >= this.sideLen || y >= this.sideLen) {
            return this.defaultValue;
        } else {
            return this.data[x][y];
        }
    };
    prototype.setValue = function(x, y, value) {
        x = x - this.centerX;
        y = y - this.centerY;
        if (x < 0 || y < 0 || x >= this.sideLen || y >= this.sideLen) {
            stjs.exception("IndexOutOfBounds");
        } else {
            this.data[x][y] = value;
        }
    };
    prototype.reset = function() {
        this.setCenter(0, 0, this.defaultValue);
    };
    /**
     *  Sets all values to the value of newValue. If fixedValue is given, then all
     *  positions with the same value as fixedValue won't change its value.
     * 
     *  @param newValue
     *  @param fixedValue
     */
    prototype.setAllValuesTo = function(newValue, fixedValue) {
        for (var x = 0; x < this.sideLen; x++) {
            for (var y = 0; y < this.sideLen; y++) {
                if (this.data[x][y] != fixedValue) {
                    this.data[x][y] = newValue;
                }
            }
        }
    };
    /**
     *  
     *  @param minValue
     *  @param maxValue
     */
    prototype.onAllValidPositions = function(minValue, maxValue, cb, args) {
        for (var x = 0; x < this.sideLen; x++) {
            for (var y = 0; y < this.sideLen; y++) {
                var value = this.data[x][y];
                if (value >= minValue && value <= maxValue) {
                    cb(x, y, value, args);
                }
            }
        }
    };
    prototype.nextRandomPosition = function(cb, arg, minValue) {
        var n = parseInt(Math.random() * this.sideLen, 10);
        for (var x = 0; x < this.sideLen; x++) {
            for (var y = 0; y < this.sideLen; y++) {
                if (this.data[x][y] >= minValue) {
                    n--;
                    if (n < 0) {
                        cb(x, y, arg);
                        return true;
                    }
                }
            }
        }
        return false;
    };
    prototype.nextValidPosition = function(x, y, minValue, walkLeft, cb, arg) {
        x = x - this.centerX;
        y = y - this.centerY;
        if (x < 0 || y < 0 || x >= this.sideLen || y >= this.sideLen) {
            if (walkLeft) {
                x = this.sideLen - 1;
                y = this.sideLen - 1;
            } else {
                x = 0;
                y = 0;
            }
        }
        var mod = (walkLeft) ? -1 : +1;
        y += mod;
        for (; (walkLeft) ? x >= 0 : x < this.sideLen; x += mod) {
            for (; (walkLeft) ? y >= 0 : y < this.sideLen; y += mod) {
                if (this.data[x][y] >= minValue) {
                    cb(x, y, arg);
                    return;
                }
            }
            y = (walkLeft) ? this.sideLen - 1 : 0;
        }
    };
    /**
     *  
     *  @param x
     *  @param y
     *  @return
     */
    prototype.hasActiveNeighbour = function(x, y) {
        x = x - this.centerX;
        y = y - this.centerY;
        if (x < 0 || y < 0 || x >= this.sideLen || y >= this.sideLen) {
            stjs.exception("IndexOutOfBounds");
        }
        return ((x > 0 && this.data[x - 1][y] > 0) || (y > 0 && this.data[x][y - 1] > 0) || (x < this.sideLen - 1 && this.data[x + 1][y] > 0) || (y < this.sideLen - 1 && this.data[x][y + 1] > 0));
    };
}, {data: {name: "Array", arguments: [{name: "Array", arguments: [null]}]}}, {});
stjs.ns("wolfTec");
wolfTec.NetworkBean = function() {};
stjs.extend(wolfTec.NetworkBean, null, [], function(constructor, prototype) {
    constructor.log = null;
    prototype.buffer = null;
    /**
     *  Id of the game in the connected network session.
     */
    prototype.gameId = -1;
    /**
     *  Id of the client in the connected network session.
     */
    prototype.clientId = -1;
    prototype.connect = function(server) {
        wolfTec.NetworkBean.log.error("NotImplementedYetException");
    };
    prototype.disconnect = function() {
        wolfTec.NetworkBean.log.error("NotImplementedYetException");
    };
    prototype.isConnected = function() {
        return this.gameId != wolfTec.Globals.INACTIVE_ID;
    };
    prototype.isGameHost = function() {
        return this.gameId == wolfTec.Globals.INACTIVE_ID || this.clientId != wolfTec.Globals.INACTIVE_ID;
    };
    /**
     *  Parses a message and invokes commands if necessary.
     */
    prototype.grabMessage = function() {
        wolfTec.NetworkBean.log.error("NotImplementedYetException");
        return null;
    };
    /**
     *  Sends a given action data object into data object and sends it to the game
     *  server.
     */
    prototype.sendMessage = function(data) {
        wolfTec.NetworkBean.log.error("NotImplementedYetException");
    };
    prototype.hasMessages = function() {
        wolfTec.NetworkBean.log.error("NotImplementedYetException");
        return false;
    };
}, {log: "wolfTec.Logger", buffer: {name: "wolfTec.CircularBuffer", arguments: ["wolfTec.NetworkMessage"]}}, {});
stjs.ns("wolfTec");
wolfTec.InputData = function() {};
stjs.extend(wolfTec.InputData, null, [], function(constructor, prototype) {
    /**
     *  The type of the input command
     */
    prototype.key = null;
    /**
     *  First parameter of the input command.
     */
    prototype.d1 = 0;
    /**
     *  Second parameter of the input command.
     */
    prototype.d2 = 0;
    /**
     *  Resets the object data to a fresh state (no saved information).
     */
    prototype.reset = function() {
        this.key = null;
        this.d1 = wolfTec.Globals.INACTIVE_ID;
        this.d2 = wolfTec.Globals.INACTIVE_ID;
    };
}, {key: {name: "Enum", arguments: ["wolfTec.InputTypeKey"]}}, {});
stjs.ns("wolfTec");
wolfTec.TouchInputBean = function() {};
stjs.extend(wolfTec.TouchInputBean, null, [wolfTec.InputBackend], function(constructor, prototype) {
    constructor.EVENT_TOUCH_START = "touchstart";
    constructor.EVENT_TOUCH_MOVE = "touchmove";
    constructor.EVENT_TOUCH_END = "touchend";
    prototype.log = null;
    prototype.input = null;
    prototype.finger1_startX = 0;
    prototype.finger1_startY = 0;
    prototype.finger1_endX = 0;
    prototype.finger1_endY = 0;
    prototype.finger2_startX = 0;
    prototype.finger2_startY = 0;
    prototype.finger2_endX = 0;
    prototype.finger2_endY = 0;
    prototype.drag_inDrag = 0;
    prototype.drag_timeDifference = 0;
    prototype.pinchDistance_start = 0;
    prototype.pinchDistance_end = 0;
    prototype.timestamp = 0;
    prototype.touchStartHandler = null;
    prototype.touchMoveHandler = null;
    prototype.touchEndHandler = null;
    prototype.init = function() {
        this.touchStartHandler = stjs.bind(this, function(event) {
            event.preventDefault();
            this.finger1_startX = event.touches[0].clientX;
            this.finger1_startY = event.touches[0].clientY;
            this.finger1_endX = this.finger1_startX;
            this.finger1_endY = this.finger1_startY;
            this.drag_inDrag = 0;
            if (event.touches.length === 2) {
                this.finger2_startX = event.touches[1].clientX;
                this.finger2_startY = event.touches[1].clientY;
                this.finger2_endX = this.finger2_startX;
                this.finger2_endY = this.finger2_startY;
                var dx = stjs.trunc(Math.abs((this.finger1_startX - this.finger2_startX)));
                var dy = stjs.trunc(Math.abs((this.finger1_startY - this.finger2_startY)));
                this.pinchDistance_start = stjs.trunc(Math.sqrt((dx * dx + dy * dy)));
            } else {
                this.finger2_startX = -1;
            }
            this.timestamp = event.timeStamp;
        });
        this.touchMoveHandler = stjs.bind(this, function(event) {
            event.preventDefault();
            this.finger1_endX = event.touches[0].clientX;
            this.finger1_endY = event.touches[0].clientY;
            if (event.touches.length == 2) {
                this.finger2_endX = event.touches[1].clientX;
                this.finger2_endY = event.touches[1].clientY;
                var dx = stjs.trunc(Math.abs(this.finger1_startX - this.finger2_startX));
                var dy = stjs.trunc(Math.abs(this.finger1_startY - this.finger2_startY));
                this.pinchDistance_end = stjs.trunc(Math.sqrt(dx * dx + dy * dy));
            } else {
                this.finger2_startX = -1;
            }
            var dx = stjs.trunc(Math.abs(this.finger1_startX - this.finger1_endX));
            var dy = stjs.trunc(Math.abs(this.finger1_startY - this.finger1_endY));
            var distance = stjs.trunc(Math.sqrt(dx * dx + dy * dy));
            var timeDiff = stjs.trunc(event.timeStamp) - this.timestamp;
            if (distance > 16) {
                if (timeDiff > 300) {
                    this.drag_inDrag = 1;
                    if (this.drag_timeDifference > 75) {
                        if (dx > dy) {} else {}
                        this.drag_timeDifference = 0;
                        this.finger1_startX = this.finger1_endX;
                        this.finger1_startY = this.finger1_endY;
                    } else {
                        this.drag_timeDifference = this.drag_timeDifference + timeDiff;
                    }
                }
            }
        });
        this.touchEndHandler = stjs.bind(this, function(event) {
            event.preventDefault();
            var dx = stjs.trunc(Math.abs(this.finger1_startX - this.finger1_endX));
            var dy = stjs.trunc(Math.abs(this.finger1_startY - this.finger1_endY));
            var distance = stjs.trunc(Math.sqrt(dx * dx + dy * dy));
            var timeDiff = stjs.trunc(event.timeStamp) - this.timestamp;
            if (this.finger2_startX != -1) {
                if (Math.abs(this.pinchDistance_end - this.pinchDistance_start) <= 32) {} else {}
            } else {
                if (distance <= 16) {
                    if (timeDiff <= 500) {}
                } else if (timeDiff <= 300) {
                    if (dx > dy) {} else {}
                }
            }
        });
    };
    prototype.enable = function() {
        this.log.info("disable touch input");
        document.addEventListener(EVENT_TOUCH_START, this.touchStartHandler, false);
        document.addEventListener(EVENT_TOUCH_MOVE, this.touchMoveHandler, false);
        document.addEventListener(EVENT_TOUCH_END, this.touchEndHandler, false);
    };
    prototype.disable = function() {
        this.log.info("enable touch input");
        document.removeEventListener(EVENT_TOUCH_START, this.touchStartHandler, false);
        document.removeEventListener(EVENT_TOUCH_MOVE, this.touchMoveHandler, false);
        document.removeEventListener(EVENT_TOUCH_END, this.touchEndHandler, false);
    };
}, {log: "wolfTec.Logger", input: "wolfTec.InputBean", touchStartHandler: {name: "Callback1", arguments: ["Object"]}, touchMoveHandler: {name: "Callback1", arguments: ["Object"]}, touchEndHandler: {name: "Callback1", arguments: ["Object"]}}, {});
stjs.ns("wolfTec");
wolfTec.GamePadInputBean = function() {};
stjs.extend(wolfTec.GamePadInputBean, null, [wolfTec.InputBackend, wolfTec.InputMappable], function(constructor, prototype) {
    prototype.vendorAPI = false;
    prototype.log = null;
    prototype.input = null;
    prototype.mapping = null;
    prototype.enabled = false;
    prototype.prevTimestamps = null;
    prototype.init = function(engine) {
        this.mapping = {};
        this.mapping[wolfTec.InputTypeKey.A.name()] = 0;
        this.mapping[wolfTec.InputTypeKey.B.name()] = 1;
        this.vendorAPI = (navigator.getGamepads === undefined);
    };
    prototype.getInputMapping = function() {
        return this.mapping;
    };
    prototype.getInputMappingName = function() {
        return "gamepad";
    };
    prototype.setInputMapping = function(map) {
        this.mapping = map;
    };
    prototype.update = function(delta) {
        if (this.enabled) {
            var gamePads = vendorAPI ? navigator.webkitGetGamepads() : navigator.getGamepads();
            for (var i = 0, e = 4; i < e; i++) {
                var gamePad = gamePads[i];
                if (gamePad != null) {
                    var sameSlot = prevTimestamps[i] == gamePad.timestamp;
                    if (!sameSlot) {
                        this.prevTimestamps[i] = gamePad.timestamp;
                        if (this.input.genericInput) {
                            this.handleGenericInput(gamePad);
                        } else {
                            this.handleInput(gamePad);
                        }
                    }
                }
            }
        }
    };
    prototype.handleGenericInput = function(gamePad) {
        var elements = gamePad.elements;
        for (var i = 0; i < 13; i++) {
            if (elements[i] == 1) {
                this.input.pushAction(wolfTec.InputTypeKey.GENERIC_INPUT, i, wolfTec.Globals.INACTIVE_ID);
                return;
            }
        }
    };
    prototype.handleInput = function(gamePad) {
        var key = null;
        var buttons = gamePad.buttons;
        var axes = gamePad.axes;
        if (buttons[this.mapping["A"]] == 1) {
            key = wolfTec.InputTypeKey.A;
        } else if (buttons[this.mapping["B"]] == 1) {
            key = wolfTec.InputTypeKey.B;
        } else if (axes[1] < -0.5) {
            key = wolfTec.InputTypeKey.UP;
        } else if (axes[1] > +0.5) {
            key = wolfTec.InputTypeKey.DOWN;
        } else if (axes[0] < -0.5) {
            key = wolfTec.InputTypeKey.LEFT;
        } else if (axes[0] > +0.5) {
            key = wolfTec.InputTypeKey.RIGHT;
        }
        if (key != null) {
            this.input.pushAction(key, wolfTec.Globals.INACTIVE_ID, wolfTec.Globals.INACTIVE_ID);
        }
    };
    prototype.enable = function() {
        this.log.info("enable gamepad input");
        this.enabled = true;
    };
    prototype.disable = function() {
        this.log.info("disable gamepad input");
        this.enabled = false;
    };
    prototype.saveConfig = function(callback) {};
    prototype.loadConfig = function(callback) {};
}, {log: "wolfTec.Logger", input: "wolfTec.InputBean", mapping: {name: "Map", arguments: [null, null]}, prevTimestamps: {name: "Array", arguments: [null]}}, {});
stjs.ns("wolfTec");
wolfTec.MouseInputBean = function() {};
stjs.extend(wolfTec.MouseInputBean, null, [wolfTec.InputBackend], function(constructor, prototype) {
    prototype.log = null;
    prototype.input = null;
    prototype.mouseUpEvent = null;
    prototype.mouseMoveEvent = null;
    prototype.init = function() {
        this.mouseUpEvent = stjs.bind(this, function(event) {
            if (event == null) {
                event = window.event;
            }
            var key = null;
            switch (event.which) {
                case 1:
                    key = wolfTec.InputTypeKey.A;
                    break;
                case 3:
                    key = wolfTec.InputTypeKey.B;
                    break;
            }
            if (key != null) {
                this.input.pushAction(key, wolfTec.Globals.INACTIVE_ID, wolfTec.Globals.INACTIVE_ID);
                return true;
            } else 
                return false;
        });
        this.mouseMoveEvent = function(event) {
            if (event == null) {
                event = window.event;
            }
            var x, y;
            if (event.offsetX === 'number') {
                x = event.offsetX;
                y = event.offsetY;
            } else {
                x = event.layerX;
                y = event.layerY;
            }
            return true;
        };
    };
    prototype.enable = function() {
        this.log.info("disable mouse input");
        targetElement.onmousemove = this.mouseMoveEvent;
        targetElement.onmouseup = this.mouseUpEvent;
    };
    prototype.disable = function() {
        this.log.info("disable mouse input");
        targetElement.onmousemove = null;
        targetElement.onmouseup = null;
    };
}, {log: "wolfTec.Logger", input: "wolfTec.InputBean", mouseUpEvent: {name: "Function1", arguments: ["DOMEvent", null]}, mouseMoveEvent: {name: "Function1", arguments: ["DOMEvent", null]}}, {});
stjs.ns("wolfTec");
wolfTec.ButtonGroup = function() {
    this.elements = [];
    this.selectedElement = wolfTec.Globals.INACTIVE_ID;
};
stjs.extend(wolfTec.ButtonGroup, null, [], function(constructor, prototype) {
    prototype.elements = null;
    prototype.selectedElement = 0;
    prototype.addElement = function(el) {
        this.elements.push(el);
        if (this.selectedElement == wolfTec.Globals.INACTIVE_ID && el.action != null) {
            this.elements[this.elements.length - 1].inFocus = true;
            this.selectedElement = this.elements.length - 1;
        }
    };
    prototype.activeButton = function() {
        return this.elements[this.selectedElement];
    };
    prototype.getButtonByKey = function(key) {
        for (var i = 0, e = this.elements.length; i < e; i++) {
            if (this.elements[i].key == key) {
                return this.elements[i];
            }
        }
        return null;
    };
    prototype.getButtonsByReg = function(reg) {
        var arr = [];
        for (var i = 0, e = this.elements.length; i < e; i++) {
            if (reg.test(this.elements[i].key)) {
                arr.push(this.elements[i]);
            }
        }
        return arr;
    };
    prototype.updateIndex = function(x, y) {
        for (var i = 0, e = this.elements.length; i < e; i++) {
            if (this.elements[i].action == null || this.elements[i].inactive) {
                continue;
            }
            if (this.elements[i].isPositionInElement(x, y)) {
                if (i == this.selectedElement) {
                    return false;
                }
                this.elements[this.selectedElement].inFocus = false;
                this.selectedElement = i;
                this.elements[this.selectedElement].inFocus = true;
                return true;
            }
        }
        return false;
    };
    prototype.setIndex = function(index) {
        if (index < 0 && index >= this.elements.length) {
            stjs.exception("");
        }
        this.elements[this.selectedElement].inFocus = false;
        this.selectedElement = index;
        this.elements[this.selectedElement].inFocus = true;
    };
    prototype.isInactive = function() {
        return false;
    };
    prototype.handleInput = function(inputData) {
        var res = true;
        this.elements[this.selectedElement].inFocus = false;
        switch (inputData.key) {
            case wolfTec.InputTypeKey.UP:
            case wolfTec.InputTypeKey.LEFT:
                do {
                    this.selectedElement--;
                    if (this.selectedElement < 0) {
                        this.selectedElement = this.elements.length - 1;
                    }
                } while (this.elements[this.selectedElement].action == null || this.elements[this.selectedElement].isInactive());
                break;
            case wolfTec.InputTypeKey.RIGHT:
            case wolfTec.InputTypeKey.DOWN:
                do {
                    this.selectedElement++;
                    if (this.selectedElement >= this.elements.length) {
                        this.selectedElement = 0;
                    }
                } while (this.elements[this.selectedElement].action == null || this.elements[this.selectedElement].isInactive());
                break;
            default:
                res = false;
        }
        this.elements[this.selectedElement].inFocus = true;
        return res;
    };
    prototype.draw = function(ctx) {
        for (var i = 0, e = this.elements.length; i < e; i++) {
            var el = this.elements[i];
            if (!el.isInactive()) {
                el.draw(ctx);
            }
        }
    };
}, {elements: {name: "Array", arguments: ["wolfTec.UiField"]}}, {});
stjs.ns("wolfTec");
wolfTec.State = function() {};
stjs.extend(wolfTec.State, null, [], function(constructor, prototype) {
    constructor.statemachine = null;
    constructor.jsUtil = null;
    constructor.log = null;
    prototype.isAnimationState = function() {
        return false;
    };
    prototype.changeState = function(clazz) {
        wolfTec.State.statemachine.changeState(wolfTec.State.jsUtil.getBeanName(clazz));
    };
    prototype.changeStateById = function(stateId) {
        wolfTec.State.statemachine.changeState(stateId);
    };
    prototype.genericInput = function(backendType, code) {};
    prototype.exit = function() {};
    prototype.enter = function() {};
    prototype.update = function(delta, input) {
        this.evalInput(input);
    };
    prototype.evalInput = function(input) {
        if (input != null) {
            switch (input.key) {
                case wolfTec.InputTypeKey.LEFT:
                    this.keyLeft();
                    break;
                case wolfTec.InputTypeKey.RIGHT:
                    this.keyRight();
                    break;
                case wolfTec.InputTypeKey.UP:
                    this.keyUp();
                    break;
                case wolfTec.InputTypeKey.DOWN:
                    this.keyDown();
                    break;
                case wolfTec.InputTypeKey.A:
                    this.keyAction();
                    break;
                case wolfTec.InputTypeKey.B:
                    this.keyCancel();
                    break;
                default:
                    break;
            }
        }
    };
    prototype.render = function(delta) {};
    prototype.keyUp = function() {};
    prototype.keyDown = function() {};
    prototype.keyLeft = function() {};
    prototype.keyRight = function() {};
    prototype.keyAction = function() {};
    prototype.keyCancel = function() {};
}, {statemachine: "wolfTec.StateMachineBean", jsUtil: "wolfTec.JsUtil", log: "wolfTec.Logger"}, {});
stjs.ns("wolfTec");
wolfTec.CheckboxField = function(x, y, w, h, text, fsize, style) {
    wolfTec.UiField.call(this, x, y, w, h, text, fsize, style, null);
    var that = this;
    this.action = function() {
        that.checked = !that.checked;
    };
    this.text = "";
    this.checked = false;
};
stjs.extend(wolfTec.CheckboxField, wolfTec.UiField, [], function(constructor, prototype) {
    prototype.checked = false;
    prototype.draw = function(ctx) {
        wolfTec.UiField.prototype.draw.call(this, ctx);
        ctx.fillStyle = "black";
        ctx.fillRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);
        ctx.fillStyle = (this.checked) ? "rgb(60,60,60)" : "white";
        ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
    };
}, {action: "Callback0"}, {});
stjs.ns("wolfTec");
wolfTec.CustomizableField = function(x, y, w, h, key, drawFn) {
    wolfTec.UiField.call(this, x, y, w, h, key, 0, wolfTec.UiField.STYLE_NORMAL, null);
    this.text = "";
    this.drawFn = drawFn;
};
stjs.extend(wolfTec.CustomizableField, wolfTec.UiField, [], function(constructor, prototype) {
    prototype.drawFn = null;
    prototype.draw = function(ctx) {
        this.drawFn(ctx);
    };
}, {drawFn: {name: "Callback1", arguments: ["CanvasRenderingContext2D"]}, action: "Callback0"}, {});
stjs.ns("wolfTec");
wolfTec.DefaultFactory = function() {};
stjs.extend(wolfTec.DefaultFactory, null, [wolfTec.FactoryBean], function(constructor, prototype) {
    prototype.options = null;
    prototype.jsUtil = null;
    prototype.create = function(propertyName, propertyClass) {
        if (propertyClass == wolfTec.Logger) {
            var isDebug = this.options.debug;
            return this.jsUtil.evalJs("LogJS.get({name: beanName, enabled: isDebug})");
        } else if (propertyClass == Array) {
            return this.jsUtil.evalJs("[]");
        } else if (propertyClass == Map) {
            return this.jsUtil.evalJs("{}");
        }
        return null;
    };
}, {options: "wolfTec.EngineOptions", jsUtil: "wolfTec.JsUtil"}, {});
stjs.ns("wolfTec");
wolfTec.KeyboardInputBean = function() {};
stjs.extend(wolfTec.KeyboardInputBean, null, [wolfTec.InputBackend, wolfTec.InputMappable], function(constructor, prototype) {
    prototype.CONSOLE_TOGGLE_KEY = 192;
    prototype.log = null;
    prototype.input = null;
    prototype.stm = null;
    prototype.mapping = null;
    prototype.keyboardHandler = null;
    prototype.init = function(engine) {
        this.mapping = {};
        this.mapping[wolfTec.InputTypeKey.UP.name()] = 38;
        this.mapping[wolfTec.InputTypeKey.DOWN.name()] = 40;
        this.mapping[wolfTec.InputTypeKey.LEFT.name()] = 37;
        this.mapping[wolfTec.InputTypeKey.RIGHT.name()] = 39;
        this.mapping[wolfTec.InputTypeKey.A.name()] = 13;
        this.mapping[wolfTec.InputTypeKey.B.name()] = 8;
        this.keyboardHandler = stjs.bind(this, function(event) {
            var keyCode = event.keyCode;
            if (this.input.genericInput) {
                this.stm.getActiveState().genericInput(wolfTec.InputBackendType.KEYBOARD, keyCode);
            } else {
                if (keyCode == this.CONSOLE_TOGGLE_KEY) {
                    this.log.error("NotImplementedYet");
                } else {
                    for (var type in wolfTec.InputTypeKey.values()) {
                        if (this.mapping[type.name()] == keyCode) {
                            this.input.pushAction(type, -1, -1);
                            return true;
                        }
                    }
                }
            }
            return false;
        });
    };
    prototype.getInputMapping = function() {
        return this.mapping;
    };
    prototype.getInputMappingName = function() {
        return "keyboard";
    };
    prototype.setInputMapping = function(map) {
        this.mapping = map;
    };
    prototype.enable = function() {
        this.log.info("disable keyboard input");
        targetElement.onkeydown = this.keyboardHandler;
    };
    prototype.disable = function() {
        this.log.info("disable keyboard input");
        targetElement.onkeydown = null;
    };
}, {log: "wolfTec.Logger", input: "wolfTec.InputBean", stm: "wolfTec.StateMachineBean", mapping: {name: "Map", arguments: [null, null]}, keyboardHandler: {name: "Function1", arguments: ["DOMEvent", null]}}, {});
stjs.ns("wolfTec");
wolfTec.AssetLoadingManagerBean = function() {};
stjs.extend(wolfTec.AssetLoadingManagerBean, null, [], function(constructor, prototype) {
    prototype.log = null;
    prototype.loaderListeners = null;
    prototype.browser = null;
    prototype.storage = null;
    prototype.completed = false;
    prototype.loadModification = null;
    prototype.init = function() {
        this.loadModification = function(cb) {};
    };
    /**
     *  Starts the loading process. Loads all game data and assets into the browser
     *  storage. The game data will be cached after the first start of the game.
     *  This method only invokes the broadcast process of the game data from the
     *  modification file. Beans have to implement the {@link AssetLoader}
     *  interface to load and cache data from the game data definition.
     *  
     *  @param completeCb
     *           called after the loading process is completed
     */
    prototype.load = function(completeCb) {
        this.log.info("Start loading game content");
        var callback = stjs.bind(this, function() {
            this.log.info("Completed loading game content");
            completeCb();
        });
        this.storage.get(wolfTec.Globals.STORAGE_PARAMETER_CACHED_CONTENT, stjs.bind(this, function(entry) {
            if (entry.value != null) {
                this.grabAndCacheContent(stjs.bind(this, function() {
                    this.loadContent(callback);
                }));
            } else {
                this.loadContent(callback);
            }
        }));
    };
    prototype.grabAndCacheContent = function(callback) {};
    prototype.loadContent = function(callback) {
        var fns = [];
        fns.push(stjs.bind(this, function(next) {
            return this.publishLoadEvent(new wolfTec.AssetItem("", null, wolfTec.AssetType.MODIFICATION), next);
        }));
    };
    prototype.publishGrabAndCacheEvent = function(item, callback) {};
    prototype.publishLoadEvent = function(item, callback) {};
    prototype.publishEventTo = function(queue, loader, item, callback) {};
    prototype.isComplete = function() {
        return this.completed;
    };
}, {log: "wolfTec.Logger", loaderListeners: {name: "Array", arguments: ["wolfTec.AssetLoader"]}, browser: "wolfTec.BrowserHelperBean", storage: "wolfTec.StorageBean", loadModification: {name: "Callback1", arguments: ["Callback"]}}, {});
stjs.ns("wolfTec");
wolfTec.VolumeManagerBean = function() {};
stjs.extend(wolfTec.VolumeManagerBean, null, [], function(constructor, prototype) {
    prototype.log = null;
    prototype.storage = null;
    prototype.audio = null;
    prototype.saveConfig = function(callback) {
        var data = {};
        data["bg"] = this.audio.getVolume(wolfTec.AudioChannel.CHANNEL_BG);
        data["sfx"] = this.audio.getVolume(wolfTec.AudioChannel.CHANNEL_SFX);
        this.storage.set(wolfTec.Globals.STORAGE_PARAMETER_AUDIO_VOLUME, data, stjs.bind(this, function(savedData, err) {
            if (err != null) {
                this.log.error("SavingVolumeConfigException");
            } else 
                callback();
        }));
    };
    prototype.loadConfig = function(callback) {
        this.storage.get("", stjs.bind(this, function(entry) {
            if (entry.value != null) {
                this.audio.setVolume(wolfTec.AudioChannel.CHANNEL_BG, entry.value.bg);
                this.audio.setVolume(wolfTec.AudioChannel.CHANNEL_SFX, entry.value.sfx);
            }
            callback();
        }));
    };
}, {log: "wolfTec.Logger", storage: "wolfTec.StorageBean", audio: "wolfTec.AudioBean"}, {});
stjs.ns("wolfTec");
wolfTec.AudioBean = function() {};
stjs.extend(wolfTec.AudioBean, null, [wolfTec.AssetLoader], function(constructor, prototype) {
    constructor.MUSIC_KEY = "MUSIC_";
    constructor.DEFAULT_SFX_VOL = 1;
    constructor.DEFAULT_MUSIC_VOL = 0.5;
    prototype.log = null;
    prototype.storage = null;
    prototype.browser = null;
    prototype.apiStatus = 0;
    /**
     *  SFX audio node.
     */
    prototype.sfxNode = null;
    /**
     *  Music audio node.
     */
    prototype.musicNode = null;
    /**
     *  WebAudio context object.
     */
    prototype.context = null;
    /**
     *  Cache for audio buffers.
     */
    prototype.buffer = null;
    prototype.musicInLoadProcess = false;
    prototype.musicConnector = null;
    prototype.musicID = null;
    prototype.musicPlayCallback = null;
    prototype.musicLoadCallback = null;
    prototype.init = function() {
        this.decodeAssetErrorCb = stjs.bind(this, function(e) {
            return this.log.error(e);
        });
        this.musicPlayCallback = stjs.bind(this, function(entry) {
            this.musicConnector = this.playSoundOnGainNode(this.musicNode, this.buffer, true);
            this.musicInLoadProcess = false;
        });
        this.musicLoadCallback = function(entry) {
            var buffer = this.context.decodeAudioData(data, this.musicPlayCallback, this.decodeAssetErrorCb);
        };
        try {
            this.log.info("Initialize..");
            if ((window).hasOwnProperty("AudioContext")) {
                this.context = window.AudioContext;;
            } else if ((window).hasOwnProperty("webkitAudioContext")) {
                this.context = window.webkitAudioContext;;
            } else {
                stjs.exception("noWebKitFound");
            }
            this.sfxNode = this.createSoundNode(wolfTec.AudioBean.DEFAULT_SFX_VOL);
            this.musicNode = this.createSoundNode(wolfTec.AudioBean.DEFAULT_MUSIC_VOL);
            this.buffer = {};
            this.log.info("..done");
        }catch (e) {
            this.log.error("..failed due => " + e);
        }
    };
    /**
     *  Plays an empty sound. Useful to enable the audio output on mobile devices
     *  with strict requirements to enable audio (like iOS devices).
     */
    prototype.playNullSound = function() {
        if (this.context == null) {
            return;
        }
        this.playSoundOnGainNode(this.sfxNode, context.createBuffer(1, 1, 22050), false);
    };
    prototype.playSFX = function(key) {
        if (this.context == null) {
            return;
        }
        this.playSoundOnGainNode(this.sfxNode, this.buffer[key], false);
    };
    /**
     *  Plays a audio as music object (looped). The audio will stop playing after
     *  stopMusic is triggered or a new music audio will be started.
     *  
     *  @param id
     */
    prototype.playBG = function(key) {
        if (this.context == null || this.musicInLoadProcess) {
            return false;
        }
        if (this.musicID == key) {
            return false;
        }
        if (this.musicConnector != null) {
            this.stopBG();
        }
        this.musicInLoadProcess = true;
        this.musicID = key;
        this.storage.get(wolfTec.AudioBean.MUSIC_KEY + key, this.musicLoadCallback);
        return true;
    };
    /**
     *  Stops the currently played music.
     */
    prototype.stopBG = function() {
        if (this.context == null || this.musicInLoadProcess) {
            return false;
        }
        if (this.musicConnector != null) {
            if (this.apiStatus == 1) {
                musicConnector.stop(0);
            } else {
                musicConnector.noteOff(0);
            }
            musicConnector.disconnect(0);
        }
        this.musicID = null;
        this.musicConnector = null;
        this.musicInLoadProcess = false;
        return true;
    };
    /**
     *  
     *  @param id
     *  @return
     */
    prototype.isBuffered = function(id) {
        return (this.buffer).hasOwnProperty(id);
    };
    prototype.setVolume = function(channel, volume) {
        if (this.context == null) {
            return;
        }
        var node = channel == wolfTec.AudioChannel.CHANNEL_BG ? this.musicNode : this.sfxNode;
        if (volume < 0) {
            volume = 0;
        } else if (volume > 1) {
            volume = 1;
        }
        node.gain.value = volume;
    };
    prototype.getVolume = function(channel) {
        if (this.context == null) 
            return -1;
        if (channel == wolfTec.AudioChannel.CHANNEL_BG) {
            return this.musicNode.gain.value;
        } else if (channel == wolfTec.AudioChannel.CHANNEL_SFX) {
            return this.sfxNode.gain.value;
        } else {
            return -1;
        }
    };
    prototype.isMusicSupported = function() {
        return this.context != null;
    };
    prototype.isSfxSupported = function() {
        return this.context != null;
    };
    /**
     *  
     *  @param volume
     *  @return Sound node
     */
    prototype.createSoundNode = function(volume) {
        var node;
        if ((this.context).hasOwnProperty("createGain")) {
            node = this.context.createGain();
        } else {
            node = this.context.createGainNode();
        }
        node.gain.value = volume;
        node.connect(this.context.destination);
        return node;
    };
    /**
     *  
     *  @param gainNode
     *  @param buffer
     *  @param loop
     *  @return
     */
    prototype.playSoundOnGainNode = function(gainNode, buffer, loop) {
        var source = this.context.createBufferSource();
        source.loop = loop;
        source.buffer = buffer;
        source.connect(gainNode);
        if (this.apiStatus == 0) {
            this.apiStatus = (source).hasOwnProperty("start") ? 1 : 2;
        }
        if (this.apiStatus == 1) {
            source.start(0);
        } else {
            source.noteOn(0);
        }
        return source;
    };
    prototype.decodeAssetErrorCb = null;
    prototype.loadAsset = function(storage, item, callback) {
        if (item.type != wolfTec.AssetType.MUSIC) {
            var loadCb = stjs.bind(this, function(data) {
                this.buffer[item.name] = data;
                callback();
            });
            storage.get(item.path, function(entry) {
                this.context.decodeAudioData(entry.value, loadCb, this.decodeAssetErrorCb);
            });
        }
    };
    prototype.grabAsset = function(storage, item, callback) {
        var options = {};
        options.path = item.path;
        options.type = "arraybuffer";
        options.success = function(response) {};
        options.error = stjs.bind(this, function(err) {
            this.log.error("CannotLoadAssetException");
        });
        this.browser.doHttpRequest(options);
    };
}, {log: "wolfTec.Logger", storage: "wolfTec.StorageBean", browser: "wolfTec.BrowserHelperBean", sfxNode: "Object", musicNode: "Object", context: "Object", buffer: {name: "Map", arguments: [null, "Object"]}, musicConnector: "Object", musicPlayCallback: {name: "Callback1", arguments: ["Object"]}, musicLoadCallback: {name: "Callback1", arguments: [{name: "wolfTec.StorageEntry", arguments: ["Object"]}]}, decodeAssetErrorCb: {name: "Callback1", arguments: [null]}}, {});
stjs.ns("wolfTec");
wolfTec.LocalizationBean = function() {
    this.languages = {};
    this.selected = null;
};
stjs.extend(wolfTec.LocalizationBean, null, [wolfTec.AssetLoader], function(constructor, prototype) {
    /**
     *  Holds all available languages.
     */
    prototype.languages = null;
    /**
     *  The current active language.
     */
    prototype.selected = null;
    prototype.loadAsset = function(storage, item, callback) {
        if (item.type == wolfTec.AssetType.LANGUAGE) {}
    };
    prototype.grabAsset = function(storage, item, callback) {
        if (item.type == wolfTec.AssetType.LANGUAGE) {}
    };
    /**
     *  Registers a language object. The properties of the object will be the keys
     *  and its values the localized string for the key.
     */
    prototype.registerLanguage = function(key, obj) {
        if (key == null || obj == null) {
            stjs.exception("IllegalArgumentException");
        }
        if ((this.languages).hasOwnProperty(key)) {
            stjs.exception("LanguageAlreadyRegisteredException");
        }
        var newLang = {};
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            newLang[keys[i]] = obj[keys[i]];
        }
        this.languages[key] = newLang;
    };
    /**
     *  Selects a language by it's key.
     */
    prototype.selectLanguage = function(language) {
        if (!(this.languages).hasOwnProperty(language)) {
            stjs.exception("unknown language");
        }
        this.selected = this.languages[language];
    };
    /**
     *  Returns the localized string of a given identifier.
     */
    prototype.solveKey = function(key) {
        if (this.selected == null) 
            return key;
        var str = this.selected[key];
        return str != null ? str : key;
    };
}, {languages: {name: "Map", arguments: [null, {name: "Map", arguments: [null, null]}]}, selected: {name: "Map", arguments: [null, null]}}, {});
stjs.ns("wolfTec");
wolfTec.SpriteManagerBean = function() {};
stjs.extend(wolfTec.SpriteManagerBean, null, [wolfTec.AssetLoader], function(constructor, prototype) {
    prototype.browserUtil = null;
    /**
     * 
     */
    prototype.sprites = null;
    /**
     * 
     */
    prototype.overlayTiles = null;
    /**
     * 
     */
    prototype.longAnimatedTiles = null;
    /**
     * 
     */
    prototype.minimapIndex = null;
    prototype.init = function() {
        this.sprites = {};
        this.overlayTiles = {};
        this.longAnimatedTiles = {};
        this.minimapIndex = {};
    };
    prototype.loadAsset = function(storage, item, callback) {
        if (item.type == wolfTec.AssetType.IMAGES) {}
    };
    prototype.grabAsset = function(storage, item, callback) {
        if (item.type == wolfTec.AssetType.IMAGES) {}
    };
    /**
     *  
     *  @param spriteKey
     *           key of the sprite
     *  @return Sprite for the given key
     */
    prototype.getSprite = function(spriteKey) {
        return this.sprites[spriteKey];
    };
    /**
     *  
     *  @param spriteKey
     *           key of the sprite
     *  @return true when the sprite overlaps one tile, else false
     */
    prototype.isLongAnimatedSprite = function(spriteKey) {
        return (this.longAnimatedTiles).hasOwnProperty(spriteKey);
    };
    /**
     *  @param {behaviorTree.Sprite} sprite
     *  @returns {string}
     */
    prototype.toJSON = function(sprite) {
        var data = [];
        for (var i = 0, e = sprite.getNumberOfImages(); i < e; i++) {
            data[i] = this.browserUtil.convertCanvasToBase64(sprite.getImage(i));
        }
        return JSON.stringify(data);
    };
    /**
     *  Loads a sprite from the cache.
     * 
     *  @param {string} spriteData
     *  @returns {behaviorTree.Sprite}
     */
    prototype.fromJSON = function(spriteData) {
        var spriteDataArray = JSON.parse(spriteData);
        var sprite = new wolfTec.Sprite(spriteData.length);
        for (var i = 0, e = spriteData.length; i < e; i++) {
            sprite.setImage(i, this.browserUtil.convertBase64ToImage(spriteDataArray[i]));
        }
        return sprite;
    };
}, {browserUtil: "wolfTec.BrowserHelperBean", sprites: {name: "Map", arguments: [null, "wolfTec.Sprite"]}, overlayTiles: {name: "Map", arguments: [null, null]}, longAnimatedTiles: {name: "Map", arguments: [null, null]}, minimapIndex: {name: "Map", arguments: [null, null]}}, {});
stjs.ns("wolfTec");
wolfTec.PositionableGroup = function() {
    wolfTec.ButtonGroup.call(this);
    this.x = 0;
    this.y = 0;
};
stjs.extend(wolfTec.PositionableGroup, wolfTec.ButtonGroup, [], function(constructor, prototype) {
    prototype.x = 0;
    prototype.y = 0;
    prototype.setMenuPosition = function(x, y) {
        var diffX = x - this.x;
        var diffY = y - this.y;
        for (var i = 0, e = this.elements.length; i < e; i++) {
            var element = this.elements[i];
            element.x += diffX;
            element.y += diffY;
        }
        this.x = x;
        this.y = y;
    };
}, {elements: {name: "Array", arguments: ["wolfTec.UiField"]}}, {});
stjs.ns("wolfTec");
wolfTec.MenuState = function() {};
stjs.extend(wolfTec.MenuState, null, [wolfTec.State], null, {statemachine: "wolfTec.StateMachineBean", jsUtil: "wolfTec.JsUtil", log: "wolfTec.Logger"}, {});
/**
 *  An inGame state is a state which is considered to be used in an active game
 *  round. As result this state contains cursor handling, rendering logic and
 *  transfers the calls to the implemented state if necessary.
 *  
 */
stjs.ns("wolfTec");
wolfTec.InGameState = function() {};
stjs.extend(wolfTec.InGameState, null, [wolfTec.State], function(constructor, prototype) {
    constructor.cursorHandler = null;
    constructor.animation = null;
    prototype.keyLeft = function() {
        wolfTec.InGameState.cursorHandler.moveCursor(wolfTec.Direction.LEFT, 1);
    };
    prototype.keyRight = function() {
        wolfTec.InGameState.cursorHandler.moveCursor(wolfTec.Direction.RIGHT, 1);
    };
    prototype.keyUp = function() {
        wolfTec.InGameState.cursorHandler.moveCursor(wolfTec.Direction.UP, 1);
    };
    prototype.keyDown = function() {
        wolfTec.InGameState.cursorHandler.moveCursor(wolfTec.Direction.DOWN, 1);
    };
    prototype.render = function(delta) {
        wolfTec.InGameState.animation.update(delta);
    };
}, {cursorHandler: "wolfTec.CursorHandler", animation: "wolfTec.AnimationManagerBean", statemachine: "wolfTec.StateMachineBean", jsUtil: "wolfTec.JsUtil", log: "wolfTec.Logger"}, {});
stjs.ns("wolfTec");
wolfTec.AnimationState = function() {};
stjs.extend(wolfTec.AnimationState, null, [wolfTec.State], function(constructor, prototype) {
    prototype.isAnimationState = function() {
        return true;
    };
}, {statemachine: "wolfTec.StateMachineBean", jsUtil: "wolfTec.JsUtil", log: "wolfTec.Logger"}, {});
/**
 *  A screen layout is a group out of ui elements. This elements can be
 *  interactive or non-interactive. It should be used to create and define a
 *  screen layout. Furthermore the screen layout offers API to interact with the
 *  components.
 */
stjs.ns("wolfTec");
wolfTec.UiScreenLayout = function(slotsX, slotsY, startX, startY) {
    wolfTec.ButtonGroup.call(this);
    this.left = startX;
    this.curX = startX;
    this.curY = startY;
    this.curH = 0;
    this.breakLine();
};
stjs.extend(wolfTec.UiScreenLayout, wolfTec.ButtonGroup, [], function(constructor, prototype) {
    prototype.TILE_BASE = 32;
    prototype.left = 0;
    prototype.curX = 0;
    prototype.curY = 0;
    prototype.curH = 0;
    prototype.repeat = function(n, f) {
        for (var i = 0; i < n; i++) {
            f(this, i);
        }
        return this;
    };
    prototype.addRowGap = function(tiles) {
        this.curY += this.TILE_BASE * tiles;
        return this;
    };
    prototype.addColGap = function(tiles) {
        this.curX += this.TILE_BASE * tiles;
        return this;
    };
    /**
     *  Breaks the current line
     */
    prototype.breakLine = function() {
        this.curX = this.left;
        this.curY += this.curH * this.TILE_BASE;
        this.curH = 1;
        return this;
    };
    prototype.addButton = function(tilesX, tilesY, offsetY, key, style, fSize, action) {
        if (this.curH < tilesY) {
            this.curH = tilesY;
        }
        var btn = new wolfTec.UiField(this.curX, this.curY + (offsetY * this.TILE_BASE), tilesX * this.TILE_BASE, tilesY * this.TILE_BASE, key, fSize, style, action);
        this.curX += tilesX * this.TILE_BASE;
        this.addElement(btn);
        return this;
    };
    prototype.addCustomField = function(tilesX, tilesY, offsetY, key, draw, ignoreHeight) {
        if (!ignoreHeight && this.curH < tilesY) {
            this.curH = tilesY;
        }
        var btn = new wolfTec.CustomizableField(this.curX, this.curY + (offsetY * this.TILE_BASE), tilesX * this.TILE_BASE, tilesY * this.TILE_BASE, key, draw);
        this.curX += tilesX * this.TILE_BASE;
        this.addElement(btn);
        return this;
    };
    prototype.addCheckbox = function(tilesX, tilesY, offsetY, key, style, fSize) {
        if (this.curH < tilesY) {
            this.curH = tilesY;
        }
        var btn = new wolfTec.CheckboxField(this.curX, this.curY + (offsetY * this.TILE_BASE), tilesX * this.TILE_BASE, tilesY * this.TILE_BASE, key, fSize, style);
        this.curX += tilesX * this.TILE_BASE;
        this.addElement(btn);
        return this;
    };
}, {elements: {name: "Array", arguments: ["wolfTec.UiField"]}}, {});
