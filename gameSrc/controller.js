"use strict";

/**
 *
 * @class
 */
cwt.ActionData = my.Class({

  STATIC: {

    /**
     * Converts an action data object to JSON.
     *
     * @param {cwt.ActionData} data
     * @return {string}
     */
    toJSON: function (data) {
      return JSON.stringify([data.id, data.p1, data.p2, data.p3, data.p4, data.p5]);
    },

    /**
     * Converts a JSON string to an action data object.
     *
     * @param {cwt.ActionData} data
     */
    fromJSON: function (data) {
      if (typeof  data === "string") {
        data = JSON.stringify(data)
      }

      this.id = data[0];
      this.p1 = data[1];
      this.p2 = data[2];
      this.p3 = data[3];
      this.p4 = data[4];
      this.p5 = data[5];
    }
  },

  constructor: function () {
    this.reset();
  },

  /**
   *
   */
  reset: function () {
    this.id = -1;
    this.p1 = -1;
    this.p2 = -1;
    this.p3 = -1;
    this.p4 = -1;
    this.p5 = -1;
  },

  toString: function () {
    return "ActionData::[id:" + this.id + " (" +
      (cwt.Action.classNames_[this.id]) +
      ") p1:" + this.p1 + " p2:" + this.p2 + " p3:" + this.p3 + " p4:" + this.p4 + " p5:" + this.p5 + "]";
  }
});

/**
 * Action stack of Custom Wars: Tactics.
 *
 * @namespace
 */
cwt.ActionStack = {

  /**
   * Pool for holding {cwt.ActionData} objects when they aren't in the buffer.
   *
   * @type {cwt.CircularBuffer.<cwt.ActionData>}
   */
  actionDataPool: new cwt.CircularBuffer(200),

  /**
   * Buffer object.
   *
   * @type {cwt.CircularBuffer.<cwt.ActionData>}
   */
  buffer: new cwt.CircularBuffer(200),

  $afterLoad: function () {
    while (!this.actionDataPool.isFull()) {
      this.actionDataPool.push(new cwt.ActionData());
    }
  },

  /**
   * Resets the buffer object.
   */
  resetData: function () {
    while (this.hasData()) {
      this.actionDataPool.push(this.buffer.pop());
    }
  },

  /**
   * Returns true when the buffer has elements else false.
   */
  hasData: function () {
    return !this.buffer.isEmpty();
  },

  /**
   *
   */
  invokeNext: function () {
    var data = this.buffer.popFirst();

    if (cwt.DEBUG) cwt.assert(data);
    if (cwt.DEBUG) console.log(data);

    var action = cwt.Action.getInstanceById(data.id);
    action.parseDataBlock(data);

    // pool used object
    data.reset();
    this.actionDataPool.push(data);
  },

  acquireCommand: function () {
    return this.actionDataPool.popFirst();
  },

  /**
   * Adds a command to the command pool. Every parameter of the call will be submitted beginning from index 1 of the
   * arguments. The maximum amount of parameters are controlled by the controller.commandStack_MAX_PARAMETERS property.
   * Anyway every parameter should be an integer to support intelligent JIT compiling. The function throws a warning if
   * a parameter type does not match, but it will be accepted anyway ** ( for now! ) **.
   *
   * @param {boolean} local will the command only invoked locally
   * @param {cwt.ActionData} data
   */ 
  pushCommand: function (local, data) {

    // send command over network
    if (!local && cwt.Network.isActive()) {
      cwt.Network.sendMessage(cwt.ActionData.toJSON(data));
    }

    this.buffer.push(data);
  }
};

cwt.Audio = {

  /**
   * Storage parameter for sfx volume.
   *
   * @constant
   */
  SFX_VOLUME_KEY: "cfg_sfx_volume",

  /**
   * Storage parameter for music volume.
   *
   * @constant
   */
  MUSIC_VOLUME_KEY: "cfg_music_volume",

  /**
   * @constant
   */
  SFX_KEY: "SFX_",

  /**
   * @constant
   */
  MUSIC_KEY: "MUSIC_",

  /**
   * WebAudio context object.
   *
   * @private
   */
  context_: null,

  /**
   * Music audio node.
   *
   * @private
   */
  gainNode_music_: null,

  /**
   * SFX audio node.
   *
   * @private
   */
  gainNode_sfx_: null,

  /**
   * Cache for audio buffers.
   *
   * @private
   */
  buffer_: {},

  /**
   * Current played music object.
   *
   * @private
   */
  currentMusic_: {
    inLoadProcess: false,
    connector: null,
    id: null
  },

  /**
   * Initializes the audio context.
   */
  initialize: function () {

    // if audio sfx and music is deactivated then do not initialize the audio context
    if (cwt.ClientFeatures.audioSFX || cwt.ClientFeatures.audioMusic) {

      // construct new context
      if (window.AudioContext) {
        this.context_ = new window.AudioContext();
      } else if (window.webkitAudioContext) {
        this.context_ = new window.webkitAudioContext();
      }

      // construct audio nodes
      if (this.context_) {
        this.gainNode_sfx_ = this.context_.createGainNode();
        this.gainNode_sfx_.gain.value = 1;
        this.gainNode_sfx_.connect(this.context_.destination);
        this.gainNode_music_ = this.context_.createGainNode();
        this.gainNode_music_.gain.value = 0.5;
        this.gainNode_music_.connect(this.context_.destination);
      }

      // remove initializer
      cwt.Audio.initialize = null;
    }
  },

  /**
   * Returns a web audio context. If no context is initialized then it will be created first.
   */
  grabContext: function () {
    return this.context_;
  },

  /**
   * Returns the value of the sfx audio node.
   */
  getSfxVolume: function () {
    if (!this.context_) return;

    return this.gainNode_sfx_.gain.value;
  },

  /**
   * Returns the value of the music audio node.
   */
  getMusicVolume: function () {
    if (!this.context_) {
      return;
    }

    return this.gainNode_music_.gain.value;
  },

  /**
   * Sets the value of the sfx audio node.
   */
  setSfxVolume: function (vol) {
    if (!this.context_) return;

    if (vol < 0) {
      vol = 0;
    } else if (vol > 1) {
      vol = 1;
    }

    this.gainNode_sfx_.gain.value = vol;
  },

  /**
   * Sets the value of the music audio node.
   */
  setMusicVolume: function (vol) {
    if (!this.context_) return;

    if (vol < 0) {
      vol = 0;
    } else if (vol > 1) {
      vol = 1;
    }

    this.gainNode_music_.gain.value = vol;
  },

  /**
   * Saves the configurations for the audio volume in the user storage.
   *
   * @param {Function=} callback Callback function
   */
  saveConfigs: function (callback) {
    if (!this.context_) {
      if (callback) {
        callback();
      }
      return;
    }

    // sfx volume
    cwt.Storage.generalStorage.set(
      cwt.Audio.SFX_VOLUME_KEY,
      cwt.Audio.gainNode_sfx_.gain.value,

      // music volume
      function () {
        cwt.Storage.generalStorage.set(
          cwt.Audio.MUSIC_VOLUME_KEY,
          cwt.Audio.gainNode_music_.gain.value,

          // callback
          function () {
            if (callback) {
              callback();
            }
          }
        );
      }
    );
  },

  /**
   * Loads the volume configuration from the user storage.
   *
   * @param {Function=} callback Callback function
   */
  loadConfigs: function (callback) {
    if (!this.context_) {
      if (callback) {
        callback();
      }
      return;
    }

    // sfx config
    cwt.Storage.generalStorage.get(cwt.Audio.SFX_VOLUME_KEY, function (obj) {
      if (obj) {
        cwt.Audio.gainNode_sfx_.gain.value = obj.value;
      }

      // music config
      cwt.Storage.generalStorage.get(cwt.Audio.MUSIC_VOLUME_KEY, function (obj) {
        if (obj) {
          cwt.Audio.gainNode_music_.gain.value = obj.value;
        }

        // callback if given
        if (callback) {
          callback();
        }
      });
    });
  },

  /**
   * Registers an audio buffer object.
   *
   * @param id
   * @param buff
   */
  registerAudioBuffer: function (id, buff) {
    if (cwt.DEBUG) cwt.assert(!this.isBuffered(id));

    this.buffer_[id] = buff;
  },

  /**
   * Removes a buffer from the cache.
   */
  unloadBuffer: function (id) {
    if (cwt.DEBUG) cwt.assert(this.isBuffered(id));

    delete this.buffer_[id];
  },

  /**
   *
   * @param id
   * @return {boolean}
   */
  isBuffered: function (id) {
    return this.buffer_.hasOwnProperty(id);
  },

  /**
   * Plays an empty sound buffer. Useful to
   * initialize the audio system.
   */
  playNullSound: function () {
    if (!this.context_) return;

    var buffer = this.context_.createBuffer(1, 1, 22050);
    var source = this.context_.createBufferSource();

    source.buffer = buffer;
    source.connect(this.context_.destination);
    source.noteOn(0);
  },

  playSoundOnNode_: function (gainNode, buffer, loop) {
    var source = this.context_.createBufferSource();

    // is loop enabled ?
    if (loop) {
      source.loop = true;
    }

    source.buffer = buffer;
    source.connect(gainNode);
    source.noteOn(0);

    return source;
  },

  /**
   * Plays a sound.
   *
   * @param {string} id id of the sound that will be played
   * @param {boolean=} loop (default:false)
   * @return {*}
   */
  playSound: function (id, loop) {
    if (!this.context_) return null;
    if (cwt.DEBUG) cwt.assert(this.buffer_[id]);

    return this.playSoundOnNode_(this.gainNode_sfx_, this.buffer_[id], loop);
  },

  /**
   *
   * @param obj
   * @private
   */
  musicLoaderCallback_: function (obj) {
    if (cwt.DEBUG) cwt.assert(obj.value);

    this.currentMusic_.connector = this.playSoundOnNode_(
      this.gainNode_music_,
      Base64Helper.decodeBuffer(obj.value),
      true
    );

    // release loading lock
    this.currentMusic_.inLoadProcess = false;
  },

  /**
   * Plays a background music.
   *
   * @param id id of the music object
   */
  playMusic: function (id) {
    if (!this.context_ || this.currentMusic_.inLoadProcess) return false;

    // already playing this music ?
    if (this.currentMusic_.id === id) {
      return;
    }

    // stop old music
    if (this.currentMusic_.connector) {
      this.stopMusic();
    }

    // set meta data
    this.currentMusic_.inLoadProcess = true;
    this.currentMusic_.id = id;
    cwt.Storage.generalStorage.get(this.MUSIC_KEY + id, this.musicLoaderCallback_);

    return true;
  },

  /**
   * Stop existing background music.
   */
  stopMusic: function () {
    if (!this.context_ || this.currentMusic_.inLoadProcess) return false;

    // disable current music
    if (this.currentMusic_) {
      this.currentMusic_.connector.noteOff(0);
      this.currentMusic_.connector.disconnect(0);
    }

    // remove meta data
    this.currentMusic_.connector = null;
    this.currentMusic_.id = null;
    this.currentMusic_.inLoadProcess = false;

    return true;
  },

  /**
   *
   * @private
   */
  removeGrabbers_: function () {
    delete cwt.Audio.removeGrabbers_;
    delete cwt.Audio.grabFromCache;
    delete cwt.Audio.grabFromRemote;
  },

  /**
   *
   * @param {Function} callback
   */
  grabFromCache: function (callback) {
    this.removeGrabbers_(); // remove initializer functions
    if (!this.context_) { // don't load audio when disabled
      if (callback) {
        callback();
      }
      return;
    }

    var stuff = [];

    function loadKey(key) {
      stuff.push(function (next) {
        cwt.Storage.assetsStorage.get(key, function (obj) {
          if (cwt.DEBUG) {
            console.log("grab audio "+key+" from cache");
          }

          if (cwt.DEBUG) cwt.assert(obj.value);

          var realKey = obj.key.slice(cwt.Audio.SFX_KEY.length);
          var arrayBuffer = Base64Helper.decodeBuffer(obj.value);
          cwt.Audio.context_.decodeAudioData( arrayBuffer,

            // success handling
            function(buffer) {
              cwt.Audio.registerAudioBuffer(realKey,buffer);
              if( next ) next(true);
            },

            // error handling
            function( e ){
              if( next ) next(false);
            }
          );
        });
      });
    }

    // load all possible audio (except music) keys from the storage into the RAM
    cwt.Storage.assetsStorage.keys(function (keys) {
      for (var i = 0, e = keys.length; i < e; i++) {
        var key = keys[i];
        if (key.indexOf(cwt.Audio.SFX_KEY) === 0) {
          loadKey(key);
        }
      }

      callAsSequence(stuff, function (){
        delete cwt.Sounds;
        delete cwt.Musics;
        callback();
      });
    });
  },

  /**
   *
   * @param {Function} callback
   */
  grabFromRemote: function (callback) {
    this.removeGrabbers_(); // remove initializer functions
    if (!this.context_) {// don't load audio when disabled
      if (callback) {
        callback();
      }
      return;
    }

    var stuff = [];

    /**
     *
     * @inner
     * @param id
     * @param audioData
     * @param callback
     */
    var loadBuffer = function (id, audioData, callback) {
      cwt.Audio.context_.decodeAudioData(

        // buffer data
        audioData,

        // success handling
        function (buffer) {
          cwt.Audio.registerAudioBuffer(id, buffer);
          if (callback) {
            callback();
          }
        },

        // error handling
        function (e) {
          cwt.Error(e, "ERR_AUDIO_BUFFER_LOAD");
        }
      );
    };

    /**
     *
     * @inner
     * @param key
     * @param path
     * @param saveKey
     * @param loadIt
     * @param callback
     */
    var loadFile = function (key, path, saveKey, loadIt, callback) {
      if (cwt.DEBUG) {
        console.log("going to load "+path+" for key "+key);
      }

      var request = new XMLHttpRequest();

      request.open("GET", cwt.MOD_PATH+path, true);
      request.responseType = "arraybuffer";

      request.onload = function () {
        cwt.assert(this.status !== 404);

        if (cwt.DEBUG) {
          console.log("load "+path+" for key "+key+" sucessfully");
        }

        cwt.Storage.assetsStorage.set(saveKey,
          Base64Helper.encodeBuffer(request.response),
          function () {
            if (loadIt) {
              loadBuffer(key, request.response, callback);
            } else {
              callback();
            }
          }
        );
      };

      request.send();
    };

    // only load music when supported
    if (cwt.ClientFeatures.audioMusic) {
      Object.keys(cwt.Musics).forEach(function (key) {
        stuff.push(function (next) {
          loadFile(key, cwt.Musics[key], cwt.Audio.MUSIC_KEY + key, false, next);
        })
      });
    }

    // only load sfx audio when supported
    if (cwt.ClientFeatures.audioSFX) {
      Object.keys(cwt.Sounds).forEach(function (key) {
        stuff.push(function (next) {
          loadFile(key, cwt.Sounds[key], cwt.Audio.SFX_KEY + key, true, next);
        })
      });
    }

    callAsSequence(stuff, function (){
      delete cwt.Sounds;
      delete cwt.Musics;
      callback();
    });
  }
};

/**
 *
 * @namespace
 */
cwt.Cursor = {

  /**
   * X coordinate of the cursor.
   */
  x: 0,

  /**
   * Y coordinate of the cursor.
   */
  y: 0,

  /**
   *
   */
  reset: function () {
    this.x = 0;
    this.y = 0;
  },

  /**
   * Moves the cursor into a given direction.
   *
   * @param {number} dir
   */
  move: function (dir) {
    var len = 1;
    var x = this.x;
    var y = this.y;

    switch (dir) {

      case cwt.Move.MOVE_CODES_UP :
        y -= len;
        break;

      case cwt.Move.MOVE_CODES_RIGHT :
        x += len;
        break;

      case cwt.Move.MOVE_CODES_DOWN  :
        y += len;
        break;

      case cwt.Move.MOVE_CODES_LEFT  :
        x -= len;
        break;
    }

    this.setPosition(x, y);
  },

  /**
   * Moves the cursor to a given position. The view will be moved as well with
   * this function to make sure that the cursor is on the visible view.
   */
  setPosition: function (x, y, relativeToScreen) {
    if (relativeToScreen) {
      x = x + cwt.Screen.offsetX;
      y = y + cwt.Screen.offsetY;
    }

    // change illegal positions to prevent out of bounds
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x >= cwt.Map.width) x = cwt.Map.width - 1;
    if (y >= cwt.Map.height) y = cwt.Map.height - 1;

    if (x === this.x && y === this.y) {
      return;
    }

    cwt.MapRenderer.eraseCursor();

    this.x = x;
    this.y = y;

    // convert to screen relative pos
    x = x - cwt.Screen.offsetX;
    y = y - cwt.Screen.offsetY;

    // do possible screen shift
    var moveCode = cwt.INACTIVE;
    if (x <= 3) {
      moveCode = cwt.Move.MOVE_CODES_RIGHT;
      if (cwt.Screen.shiftScreen(moveCode)) {
        cwt.MapRenderer.shiftMap(moveCode,cwt.Gameflow.globalData.selection);
      }

    }

    // do possible screen shift
    if (x >= cwt.SCREEN_WIDTH - 3) {
      moveCode = cwt.Move.MOVE_CODES_LEFT;
      if (cwt.Screen.shiftScreen(moveCode)) {
        cwt.MapRenderer.shiftMap(moveCode,cwt.Gameflow.globalData.selection);
      }
    }

    // do possible screen shift
    if (y <= 3) {
      moveCode = cwt.Move.MOVE_CODES_DOWN;
      if (cwt.Screen.shiftScreen(moveCode)) {
        cwt.MapRenderer.shiftMap(moveCode,cwt.Gameflow.globalData.selection);
      }

    }

    // do possible screen shift
    if (y >= cwt.SCREEN_HEIGHT - 3) {
      moveCode = cwt.Move.MOVE_CODES_UP;
      if (cwt.Screen.shiftScreen(moveCode)) {
        cwt.MapRenderer.shiftMap(moveCode,cwt.Gameflow.globalData.selection);
      }
    }

    cwt.MapRenderer.renderCursor();
  },

  showNativeCursor: function () {
    cwt.Screen.layerUI.getLayer().style.cursor = "";
  },

  hideNativeCursor: function () {
    cwt.Screen.layerUI.getLayer().style.cursor = "none";
  }

};

cwt.Error = function (message,where) {

  // set state
  cwt.Gameflow.changeState("ERROR_SCREEN");

  // set meta data
  var state = cwt.Gameflow.activeState;
  state.data.message = message;
  state.data.where = where;
};

/**
 *
 * @namespace
 */
cwt.ClientEvents = {

  animCmd_: function (state) {
    var cmd = cwt.ActionStack.acquireCommand();
    cmd.key = cwt.Action.getInstanceId(cwt.Action.getInstanceKey("startAnimation"));
    cmd.p1 = state;

    cwt.ActionStack.pushCommand(false, cmd);
  },

  /**
   */
  turnChange: function () {
    var x = cwt.Screen.offsetX;
    var y = cwt.Screen.offsetY;
    var w = (cwt.Map.width < cwt.SCREEN_WIDTH) ? cwt.Map.width : cwt.SCREEN_WIDTH;
    var h = (cwt.Map.height < cwt.SCREEN_HEIGHT) ? cwt.Map.height : cwt.SCREEN_HEIGHT;

    cwt.Screen.layerUnit.clearAll();

    cwt.MapRenderer.renderUnits(x, y, w, h);
    cwt.MapRenderer.renderFogRect(x, y, w, h);

    cwt.Screen.layerUnit.renderLayer(cwt.MapRenderer.indexUnitAnimation);

    this.animCmd_(0);
  },

  /**
   *
   * @param {number} sx
   * @param {number} sy
   * @param {number} tx
   * @param {number} ty
   * @param {cwt.Array} way
   * @param {boolean} trapped
   */
  unitMoves: function (sx, sy, tx, ty, way, trapped) {

  },

  unitWaits: function () {

  },

  goldChange: function (player, money) {
    // Play a money down animation
  },

  unitCreated: function (x, y, unit) {

  },

  unitDestroyed: function (x, y, unit) {

  },

  unitCaptures: function (property, capturer) {

  },

  propertyCaptured: function (property, capturer) {

  },

  propertyTypeChanged: function (property, typeOld, typeNew) {

  }

};

/**
 * Contains all features of the web client.
 * If the value of a feature is `true`, then it will
 * be supported by the current active environment.
 * If the value is `false`, then it isn't supported.
 *
 * @type {Object}
 */
cwt.ClientFeatures = {

  /**
   * Controls the availability of audio effects.
   */
  audioSFX: ((Browser.chrome || Browser.safari || (Browser.ios && Browser.version >= 6)) === true),

  /**
   * Controls the availability of music.
   */
  audioMusic: ((Browser.chrome || Browser.safari) === true),

  /**
   * Controls the availability of game-pad input.
   */
  gamePad: ((Browser.chrome && !!navigator.webkitGetGamepads) === true),

  /**
   * Controls the availability of computer keyboard input.
   */
  keyboard:	((!Browser.mobile) === true),

  /**
   * Controls the availability of mouse input.
   */
  mouse: ((!Browser.mobile) === true),

  /**
   * Controls the availability of touch input.
   */
  touch: ((Browser.mobile) === true),

  /**
   * Signals a official supported environment. If false then it doesn't mean the
   * environment cannot run the game, but the status is not official tested. As
   * result the game could run fine or breaks.
   */
  supported: ((Browser.chrome || Browser.safari || Browser.ios || Browser.android) === true),

  // scaledImg:  false,

  /**
   * Controls the usage of the workaround for the iOS7 WebSQL DB bug.
   */
  iosWebSQLFix: ((Browser.ios && Browser.version >= 7) === true)
};

/**
 *
 * @type {{}}
 */
cwt.FlowData = {

  /**
   * Holds some information about the current action menu.
   *
   * @namespace
   */
  menu: {

    /**
     * Adds unload targets for a transporter at a given position to the menu.
     *
     * @param uid
     * @param x
     * @param y
     * @param menu
     */
    addUnloadTargetsToMenu: function (uid, x, y, menu) {
      var loader = model.unit_data[uid];
      var pid = loader.owner;
      var i = model.unit_firstUnitId(pid);
      var e = model.unit_lastUnitId(pid);
      var unit;

      for (; i <= e; i++) {
        unit = model.unit_data[i];

        if (unit.owner !== cwt.INACTIVE && unit.loadedIn === uid) {
          var movetp = model.data_movetypeSheets[ unit.type.movetype ];

          if (model.move_canTypeMoveTo(movetp, x - 1, y) ||
            model.move_canTypeMoveTo(movetp, x + 1, y) ||
            model.move_canTypeMoveTo(movetp, x, y - 1) ||
            model.move_canTypeMoveTo(movetp, x, y + 1)) menu.addEntry(i, true);
        }
      }
    }
  },

  selection: (function () {
            /*
    var sMap = new cwt.SelectionMap(cwt.MAX_MOVE_LENGTH * 4 + 1);

    // Extension to the selection map. This one prepares the selection
    // for the current aw2 model.
    //
    sMap.prepare = function () {
      var target = controller.stateMachine.data.target;
      var x = target.x;
      var y = target.y;

      this.setCenter(x, y, -1);

      var actObj = controller.stateMachine.data.action.object;
      actObj.prepareTargets(controller.stateMachine.data);

      // decide which selection mode will be used based on the given action object
      return (actObj.targetSelectionType === "A") ? "ACTION_SELECT_TARGET_A" :
        "ACTION_SELECT_TARGET_B";
    };

    //
    //
    sMap.rerenderNonInactive = function () {
      var e = this.data.length;
      var cx = this.centerX;
      var cy = this.centerY;

      // rerender aw2
      for (var x = 0; x < e; x++) {
        for (var y = 0; y < e; y++) {
          if (this.data[x + cx][y + cy] > cwt.INACTIVE) view.redraw_markPos(x + cx, y + cy);
        }
      }
    };

    return sMap;
    */
  })(),

  addUnloadTargetsToSelection: function (uid, x, y, loadId, selection) {
    var loader = model.unit_data[uid];
    var movetp = model.data_movetypeSheets[ model.unit_data[ loadId ].type.movetype ];

    if (model.move_canTypeMoveTo(movetp, x - 1, y)) selection.setValueAt(x - 1, y, 1);
    if (model.move_canTypeMoveTo(movetp, x + 1, y)) selection.setValueAt(x + 1, y, 1);
    if (model.move_canTypeMoveTo(movetp, x, y - 1)) selection.setValueAt(x, y - 1, 1);
    if (model.move_canTypeMoveTo(movetp, x, y + 1)) selection.setValueAt(x, y + 1, 1);
  },

  selectionRange: cwt.INACTIVE

};

/**
 * @namespace
 */
cwt.GameData = {

  /**
   *
   */
  saveGame: (function () {
    var caller = cwt.createModuleCaller("$onSaveGame");
    return function (name, callback) {
      var dom = {};
      caller(dom);

      // save object model
      cwt.Storage.mapStorage.set(name, JSON.stringify(dom), callback);
    };
  })(),

  /**
   * Sets the game model to a state that represents the given save game object.
   *
   * @param name
   * @param isSave
   * @param callback
   */
  loadGame: (function () {
    var caller = cwt.createModuleCaller("$onLoadGame");
    return function (name, isSave, callback) {
      if (typeof name === "string") {
        cwt.Storage.mapStorage.get(name, function (obj) {
          cwt.assert(obj.value);
          caller(JSON.parse(obj.value), isSave);
          callback();
        });
      } else {
        caller(name, isSave);
        callback();
      }
    };
  })()

};

/**
 *
 * @namespace
 */
cwt.Gameflow = {

  /**
   * @type {String}
   */
  activeStateId: null,

  /**
   * @type {cwt.GameState}
   */
  activeState: null,

  /**
   * @type {Array.<cwt.GameState>}
   * @private
   */
  states_: {},

  /**
   * State-Machine data object to share data between
   * states.
   */
  globalData: {},

  /**
   *
   * @param desc
   */
  addState: function (desc) {
    if (cwt.DEBUG) cwt.assert(!this.states_.hasOwnProperty(desc.id));

    var state = new cwt.GameState(
      desc.enter ? desc.enter : cwt.emptyFunction,
      desc.exit ? desc.exit : cwt.emptyFunction,
      desc.update ? desc.update : cwt.emptyFunction,
      desc.render ? desc.render : cwt.emptyFunction,
      {
        globalData: this.globalData
      }
    );

    if (desc.init) {
      desc.init.call(state.data, state.data.globalData);
    }

    this.states_[desc.id] = state;
  },

  /**
   *
   * @param desc
   */
  addInGameState: function (desc) {
    cwt.Gameflow.addState({

      id: desc.id,

      init: function () {
        this.inputMove = function (x, y) {
          if (desc.inputMove) {
            desc.inputMove.call(this, this.globalData, x, y);
          } else {
            cwt.Cursor.setPosition(
              cwt.Screen.convertToTilePos(x),
              cwt.Screen.convertToTilePos(y),
              true
            );
          }
        };

        if (desc.init) {
          desc.init.call(this, this.globalData);
        }
      },

      enter: function () {
        if (desc.enter) {
          desc.enter.call(this, this.globalData);
        }
      },

      exit: function () {
        if (desc.exit) {
          desc.exit.call(this, this.globalData);
        }
      },

      update: function (delta, input) {

        // check stack for buffered commands
        if (cwt.ActionStack.hasData()) {
          cwt.ActionStack.invokeNext();
          return;
        }

        cwt.Gameround.gameTimeElapsed += delta;
        cwt.Gameround.turnTimeElapsed += delta;

        // check_ turn time
        if (cwt.Gameround.turnTimeLimit > 0 && cwt.Gameround.turnTimeElapsed >= cwt.Gameround.turnTimeLimit) {
          var dataBlock = cwt.ActionStack.acquireCommand();
          var actionObject = cwt.Action.getActionObject("wait");

          dataBlock.id = cwt.Action.getInstanceId(actionObject);
          actionObject.toDataBlock(null, dataBlock);
        }

        // check_ game time
        if (cwt.Gameround.gameTimeLimit > 0 && cwt.Gameround.gameTimeElapsed >= cwt.Gameround.gameTimeLimit) {
          // TODO: controller.update_endGameRound();
        }

        if (input) {
          switch (input.key) {

            case cwt.Input.TYPE_LEFT:
              if (desc.LEFT) {
                desc.LEFT.call(this, this.globalData, delta);
              } else {
                cwt.Cursor.move(cwt.Move.MOVE_CODES_LEFT);
              }
              break;

            case cwt.Input.TYPE_UP:
              if (desc.UP) {
                desc.UP.call(this, this.globalData, delta);
              } else {
                cwt.Cursor.move(cwt.Move.MOVE_CODES_UP);
              }
              break;

            case cwt.Input.TYPE_RIGHT:
              if (desc.RIGHT) {
                desc.RIGHT.call(this, this.globalData, delta);
              } else {
                cwt.Cursor.move(cwt.Move.MOVE_CODES_RIGHT);
              }
              break;

            case cwt.Input.TYPE_DOWN:
              if (desc.DOWN) {
                desc.DOWN.call(this, this.globalData, delta);
              } else {
                cwt.Cursor.move(cwt.Move.MOVE_CODES_DOWN);
              }
              break;

            case cwt.Input.TYPE_ACTION:
              if (desc.ACTION) {
                desc.ACTION.call(this, this.globalData, delta);
              }
              break;

            case cwt.Input.TYPE_CANCEL:
              if (desc.CANCEL) {
                desc.CANCEL.call(this, this.globalData, delta);
              }
              break;
          }
        }
      },

      render: function (delta) {
        cwt.MapRenderer.evaluateCycle(delta, this.globalData.focusActive);

        if (desc.render) {
          desc.render.call(this, this.globalData, delta);
        }
      }

    });
  },

  /**
   *
   * @param desc
   */
  addMenuState: function (desc) {
    cwt.Gameflow.addState({
      id: desc.id,

      init: function () {
        this.layout = new cwt.UIScreenLayout();
        this.rendered = false;

        this.inputMove = function (x, y) {
          if (this.layout.updateIndex(x, y)) {
            this.rendered = false;
          }
        };

        if (desc.init) {
          desc.init.call(this, this.layout);
        }

        if (desc.doLayout) {
          desc.doLayout.call(this, this.layout);
        }

        if (desc.genericInput) {
          this.genericInput = desc.genericInput;
        }
      },

      enter: function () {
        cwt.Screen.layerUI.clear();
        this.rendered = false;

        if (desc.enter) {
          desc.enter.call(this);
        }
      },

      update: function (delta, lastInput) {
        if (lastInput) {
          switch (lastInput.key) {

            case cwt.Input.TYPE_LEFT:
            case cwt.Input.TYPE_RIGHT:
            case cwt.Input.TYPE_UP:
            case cwt.Input.TYPE_DOWN:
              if (this.layout.handleInput(lastInput)) {
                this.rendered = false;
                cwt.Audio.playSound("MENU_TICK");
              }
              break;

            case cwt.Input.TYPE_ACTION:
              var button = this.layout.activeButton();
              button.action.call(this, button, this);
              this.rendered = false;
              cwt.Audio.playSound("ACTION");
              break;

            case cwt.Input.TYPE_CANCEL:
              if (desc.last) {
                cwt.Gameflow.changeState(desc.last);
                cwt.Audio.playSound("CANCEL");
              }
              break;
          }
        }
      },

      render: function (delta) {
        if (!this.rendered) {
          var ctx = cwt.Screen.layerUI.getContext();
          this.layout.draw(ctx);
          this.rendered = true;
        }
      }
    });
  },

  /**
   * Initializes the game state machine.
   */
  initialize: function () {
    if (cwt.DEBUG) {
      console.log("starting game state machine");
    }

    var oldTime = new Date().getTime();

    function gameLoop() {

      // acquire next frame
      requestAnimationFrame(gameLoop);

      // calculate delta
      var now = new Date().getTime();
      var delta = now - oldTime;
      oldTime = now;

      // update machine
      cwt.Gameflow.update(delta);
    }

    // set start state
    this.setState("NONE", false);

    // enter the loop
    requestAnimationFrame(gameLoop);
  },

  /**
   *
   * @param stateId
   */
  changeState: function (stateId) {
    if (this.activeState) {

      // exit old state
      if (this.activeState.exit) {
        this.activeState.exit.call(this.activeState.data);
      }
    }

    // enter new state
    this.setState(stateId, true);
  },

  /**
   *
   * @param stateId
   */
  setState: function (stateId, fireEvent) {
    if (cwt.DEBUG) cwt.assert(this.states_.hasOwnProperty(stateId));

    if (cwt.DEBUG) {
      console.log("set active state to " + stateId + ((fireEvent) ? " with firing enter event" : ""));
    }

    this.activeState = this.states_[stateId];
    this.activeStateId = stateId;

    if (fireEvent !== false) {
      this.activeState.enter.call(this.activeState.data);
    }
  },

  /**
   *
   * @param delta
   */
  update: function (delta) {

    // update game-pad controls
    if (cwt.ClientFeatures.gamePad && cwt.Input.types.gamePad.update) {
      cwt.Input.types.gamePad.update();
    }

    // state update
    var inp = cwt.Input.popAction();
    this.activeState.update.call(this.activeState.data, delta, inp);
    this.activeState.render.call(this.activeState.data, delta);

    // release input data object
    if (inp) {
      cwt.Input.pool.push(inp);
    }
  }
};

/**
 * @namespace
 */
cwt.Image = {

  /**
   * @constant
   */
  IMAGE_KEY: "GFX_",

  /**
   * @constant
   */
  TYPE_UNIT: 0,

  /**
   * @constant
   */
  TYPE_PROPERTY: 1,

  /**
   * @constant
   */
  TYPE_TILE: 2,

  /**
   * @constant
   */
  TYPE_ANIMATED_TILE: 3,

  /**
   * @constant
   */
  TYPE_ANIMATED_TILE_WITH_VARIANTS: 4,

  /**
   * @constant
   */
  TYPE_MISC: 10,

  /**
   * @constant
   */
  TYPE_IMAGE: 99,

  /**
   * Color schema for a unit sprite.
   *
   * @constant
   */
  UNIT_INDEXES: {
    RED: 0,
    BLUE: 3,
    GREEN: 4,
    YELLOW: 5,
    colors: 6
  },

  /**
   * Color schema for a property sprite.
   *
   * @constant
   */
  PROPERTY_INDEXES: {
    RED: 0,
    GRAY: 1,
    BLUE: 3,
    GREEN: 4,
    YELLOW: 5,
    colors: 4
  },

  /**
   * @type {object.<cwt.Sprite>}
   */
  sprites: {},

  overlayTiles: {},

  longAnimatedTiles: {},

  /**
   *
   * @param type
   * @param sprite
   * @param callback
   */
  saveSpriteToCache: function (type, sprite, callback) {
    if (cwt.DEBUG) cwt.assert(sprite instanceof cwt.ArmySprite || sprite instanceof cwt.Sprite);

    // extract data
    var data = (sprite instanceof cwt.ArmySprite) ? cwt.ArmySprite.toJSON(sprite) : cwt.Sprite.toJSON(sprite);

    // save it
    cwt.Storage.assetsStorage.set(type, data, callback);
  },

  /**
   *
   * @param type
   * @param path
   * @param callback
   */
  loadSprite: function (type, path, imgType, callback) {
    cwt.Storage.assetsStorage.get(type, function (obj) {
      if (obj.value) {
        // is in the cache
        this.sprites[type] = this.jSONtoColoredSprite_(obj.value);
        callback();

      } else {
        // not in the cache
        var img = new Image();
        img.src = path;

        img.onload = function () {
          var sprite;

          switch (imgType) {
            case cwt.Image.TYPE_UNIT:
              sprite = cwt.Image.createUnitSprites();
              break;

            case cwt.Image.TYPE_PROPERTY:
              sprite = cwt.Image.createPropertySprites();
              break;

            case cwt.Image.TYPE_TILE:
              sprite = cwt.Image.createTileSprites();
              break;
          }

          // save image in the cache
          cwt.Image.saveSpriteToCache(type, sprite, callback);
        };

        // failed to load the image data
        img.onerror = function () {
          throw Error("could not load image for " + type + " at location " + path);
        };
      }
    });
  },

  createUnitSprites: function () {
    // crop idle, left, up, down

    // flip idle and left

    // colorize all
  },

  createPropertySprites: function () {

    // colorize it
  },

  createTileSprites: function () {
    // crop all tiles
  },

  /**
   *
   * @private
   */
  removeGrabbers_: function () {
    cwt.Image.removeGrabbers_ = null;
    cwt.Image.grabFromRemote = null;
    cwt.Image.grabFromCache = null;
  },

  /**
   *
   * @param {Function} callback
   */
  grabFromRemote: function (callback) {
    this.removeGrabbers_(); // remove initializer functions

    function getImageDataArray(image) {
      var canvas = document.createElement("canvas");
      var canvasContext = canvas.getContext("2d");

      var imgW = image.width;
      var imgH = image.height;
      canvas.width = imgW;
      canvas.height = imgH;
      canvasContext.drawImage(image, 0, 0);
      return canvasContext.getImageData(0, 0, imgW, imgH).data;
    }

    /**
     * Changes colors in an assets object by given replacement color maps and returns a new assets
     * object (html5 canvas).
     *
     * @inner
     * @param image
     * @param colorData
     * @param numColors
     * @param oriIndex
     * @param replaceIndex
     * @return {HTMLCanvasElement}
     */
    function replaceColors(image, colorData, numColors, oriIndex, replaceIndex) {
      var canvas = document.createElement("canvas");
      var canvasContext = canvas.getContext("2d");

      // create target canvas
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

          var oR = imgPixels.data[xi  ];
          var oG = imgPixels.data[xi + 1];
          var oB = imgPixels.data[xi + 2];
          for (var n = 0, ne = (numColors * 4); n < ne; n += 4) {

            var sR = colorData[oriStart + n  ];
            var sG = colorData[oriStart + n + 1];
            var sB = colorData[oriStart + n + 2];

            if (sR === oR && sG === oG && sB === oB) {

              var r = replStart + n;
              var rR = colorData[r  ];
              var rG = colorData[r + 1];
              var rB = colorData[r + 2];
              imgPixels.data[xi  ] = rR;
              imgPixels.data[xi + 1] = rG;
              imgPixels.data[xi + 2] = rB;
            }
          }
        }
      }

      // write changes back
      canvasContext.putImageData(imgPixels, 0, 0);

      return canvas;
    }

    /**
     *
     * @inner
     * @param {HTMLImageElement|HTMLCanvasElement} image
     * @return {HTMLCanvasElement}
     */
    function createBlackMask(image) {
      var canvas = document.createElement("canvas");
      var canvasContext = canvas.getContext("2d");

      // create target canvas
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

          // if pixel is not transparent, then fill it with black
          if (oA > 0) {
            imgPixels.data[xi  ] = 0;
            imgPixels.data[xi + 1] = 0;
            imgPixels.data[xi + 2] = 0;
          }
        }
      }

      // write changes back
      canvasContext.putImageData(imgPixels, 0, 0);

      return canvas;
    }

    /**
     * Draws a part of an image to a new canvas.
     *
     * @inner
     * @param {HTMLImageElement|HTMLCanvasElement} image image object
     * @param {number} sx source x coordinate
     * @param {number} sy source y coordinate
     * @param {number} w width
     * @param {number} h height
     * @return {HTMLCanvasElement}
     */
    function cropImage(image, sx, sy, w, h) {
      var nCanvas = document.createElement('canvas');
      var nContext = nCanvas.getContext('2d');

      nCanvas.width = w;
      nCanvas.height = h;

      nContext.drawImage(image, sx, sy, w, h, 0, 0, w, h);

      return /** @type {HTMLCanvasElement} */ nCanvas;
    }

    /**
     * Flips an image.
     *
     * BASED ON http://jsfiddle.net/pankajparashar/KwDhX/
     *
     * @inner
     * @param {Image|HTMLCanvasElement} image
     * @param {boolean} flipH
     * @param {boolean} flipV
     * @return {HTMLCanvasElement}
     */
    function flipImage(image, flipH, flipV) {
      var scaleH = flipH ? -1 : 1;
      var scaleV = flipV ? -1 : 1;
      var posX = flipH ? image.width * -1 : 0;
      var posY = flipV ? image.height * -1 : 0;

      // target canvas
      var nCanvas = document.createElement('canvas');
      var nContext = nCanvas.getContext('2d');

      nCanvas.height = image.height;
      nCanvas.width = image.width;

      // transform it
      nContext.save();
      nContext.scale(scaleH, scaleV);
      nContext.drawImage(image, posX, posY, image.width, image.height);
      nContext.restore();

      return /** @type {HTMLCanvasElement} */ nCanvas;
    }

    /**
     * Doubles the size of an assets by using the scale2x algorithm.
     *
     * @inner
     * @param image
     * @return {HTMLElement}
     */
    function scale2x(image) {
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

      // create target canvas
      var canvasS = document.createElement("canvas");
      var canvasSContext = canvasS.getContext("2d");
      canvasS.width = imgW;
      canvasS.height = imgH;
      canvasSContext.drawImage(image, 0, 0);
      var imgPixelsS = canvasSContext.getImageData(0, 0, imgW, imgH);

      // create target canvas
      var canvasT = document.createElement("canvas");
      var canvasTContext = canvasT.getContext("2d");
      canvasT.width = imgW * 2;
      canvasT.height = imgH * 2;
      var imgPixelsT = canvasTContext.getImageData(0, 0, imgW * 2, imgH * 2);

      // scale it
      for (var y = 0; y < imgPixelsS.height; y++) {
        for (var x = 0; x < imgPixelsS.width; x++) {

          // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
          // grab source pixels
          //

          // grab center
          xi = (y * 4) * imgPixelsS.width + x * 4;
          oR = imgPixelsS.data[xi ];
          oG = imgPixelsS.data[xi + 1];
          oB = imgPixelsS.data[xi + 2];

          // grab left
          if (x > 0) {
            xi = (y * 4) * imgPixelsS.width + (x - 1) * 4;
            lR = imgPixelsS.data[xi ];
            lG = imgPixelsS.data[xi + 1];
            lB = imgPixelsS.data[xi + 2];
          }
          else {
            lR = oR;
            lG = oG;
            lB = oB;
          }

          // grab up
          if (y > 0) {
            xi = ((y - 1) * 4) * imgPixelsS.width + (x) * 4;
            uR = imgPixelsS.data[xi ];
            uG = imgPixelsS.data[xi + 1];
            uB = imgPixelsS.data[xi + 2];
          }
          else {
            uR = oR;
            uG = oG;
            uB = oB;
          }

          // grab down
          if (x < imgPixelsS.height - 1) {
            xi = ((y + 1) * 4) * imgPixelsS.width + (x) * 4;
            dR = imgPixelsS.data[xi ];
            dG = imgPixelsS.data[xi + 1];
            dB = imgPixelsS.data[xi + 2];
          }
          else {
            dR = oR;
            dG = oG;
            dB = oB;
          }

          // grab right
          if (x < imgPixelsS.width - 1) {
            xi = (y * 4) * imgPixelsS.width + (x + 1) * 4;
            rR = imgPixelsS.data[xi ];
            rG = imgPixelsS.data[xi + 1];
            rB = imgPixelsS.data[xi + 2];
          }
          else {
            rR = oR;
            rG = oG;
            rB = oB;
          }

          // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
          // calculates target pixels
          //

          // E0 = E; E1 = E; E2 = E; E3 = E;
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

          // if (B != H && D != F)
          if (( uR !== dR || uG !== dG || uB !== dB ) && ( lR !== rR || lG !== rG || lB !== rB )) {

            // E0 = D == B ? D : E;
            if (uR === lR && uG === lG && uB === lB) {
              t0R = lR;
              t0G = lG;
              t0B = lB;
            }

            // E1 = B == F ? F : E;
            if (uR === rR && uG === rG && uB === rB) {
              t1R = rR;
              t1G = rG;
              t1B = rB;
            }

            // E2 = D == H ? D : E;
            if (lR === dR && lG === dG && lB === dB) {
              t2R = lR;
              t2G = lG;
              t2B = lB;
            }

            // E3 = H == F ? F : E;
            if (dR === rR && dG === rG && dB === rB) {
              t3R = rR;
              t3G = rG;
              t3B = rB;
            }
          }

          // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
          // write pixels to target canvas
          //

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

      // write changes back to the canvas
      canvasTContext.putImageData(imgPixelsT, 0, 0);

      canvasS = null;
      return canvasT;
    }

    /**
     *
     * @inner
     * @param sprite
     * @param state
     * @param rImg
     * @param bImg
     * @param gImg
     * @param yImg
     * @param startX
     */
    function cropUnitState(sprite, state, rImg, bImg, gImg, yImg, startX) {
      sprite.setImage(cwt.Sprite.UNIT_RED + state, cropImage(rImg, startX, 0, 96, 32));
      sprite.setImage(cwt.Sprite.UNIT_BLUE + state, cropImage(bImg, startX, 0, 96, 32));
      sprite.setImage(cwt.Sprite.UNIT_GREEN + state, cropImage(gImg, startX, 0, 96, 32));
      sprite.setImage(cwt.Sprite.UNIT_YELLOW + state, cropImage(yImg, startX, 0, 96, 32));
      sprite.setImage(cwt.Sprite.UNIT_SHADOW_MASK + state,
        createBlackMask(sprite.getImage(cwt.Sprite.UNIT_RED + state)));
    }

    /**
     *
     * @inner
     * @param sprite
     * @param state
     * @param rImg
     * @param bImg
     * @param gImg
     * @param yImg
     * @param startX
     */
    function cropUnitStateInverted(sprite, state, rImg, bImg, gImg, yImg, startX) {
      // TODO: bug flips whole image, but it would be correct to flip every state
      sprite.setImage(cwt.Sprite.UNIT_RED + state, flipImage(cropImage(rImg, startX, 0, 96, 32), true, false));
      sprite.setImage(cwt.Sprite.UNIT_BLUE + state, flipImage(cropImage(bImg, startX, 0, 96, 32), true, false));
      sprite.setImage(cwt.Sprite.UNIT_GREEN + state, flipImage(cropImage(gImg, startX, 0, 96, 32), true, false));
      sprite.setImage(cwt.Sprite.UNIT_YELLOW + state, flipImage(cropImage(yImg, startX, 0, 96, 32), true, false));
      sprite.setImage(cwt.Sprite.UNIT_SHADOW_MASK + state,
        createBlackMask(sprite.getImage(cwt.Sprite.UNIT_RED + state)));
    }

    function cropAndRotate(image, sx, sy, w, rotation) {
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      var hw = w / 2;
      if (cwt.DEBUG) cwt.assert(hw % 1 === 0);

      canvas.height = w;
      canvas.width = w;

      // transform
      context.save();
      context.translate(hw, hw);
      context.rotate(rotation * Math.PI / 180);
      context.translate(-hw, -hw);

      // draw
      context.drawImage(image, sx, sy, w, w, 0, 0, w, w);

      context.restore();

      return canvas;
    }

    function grabImage(path, key, callback) {
      if (cwt.DEBUG) {
        console.log("going to load image " + path + " for key " + key);
      }

      var image = new Image();

      if (cwt.DEBUG) {
        image.onload = function () {
          console.log("successfully loaded image " + path + " for key " + key);
          callback.apply(this, arguments);
        };
      } else {
        image.onload = callback;
      }

      image.src = cwt.MOD_PATH + path;
      image.key = key;
    }

    // ------------------------------------------------------------------------

    var unitColorData;
    var propertyColorData;
    var unitColStat = cwt.Image.UNIT_INDEXES;
    var propColStat = cwt.Image.PROPERTY_INDEXES;

    var stuff = [];

    function addToPushLoop(path, key, callback) {
      stuff.push(function (next) {
        grabImage(path, key, function () {
          callback(this, next);
        });
      })
    }

    // grab color map images
    stuff.push(
      function (next) {
        grabImage(cwt.Graphics.COLOR_MAP[0], null, function () {
          propertyColorData = getImageDataArray(this);
          next();
        });
      },
      function (next) {
        grabImage(cwt.Graphics.COLOR_MAP[1], null, function () {
          unitColorData = getImageDataArray(this);
          next();
        });
      }
    );

    // grab unit images
    Object.keys(cwt.Graphics.UNITS).forEach(function (key) {
      stuff.push(function (next) {
        var path = cwt.Graphics.UNITS[key];
        grabImage(path, key, function () {
          var sprite = new cwt.Sprite(cwt.Sprite.UNIT_STATES);

          var red = /** @type {HTMLImageElement} */ this;
          var blue;
          var green;
          var yellow;

          // create colored sprite maps
          blue = replaceColors(red, unitColorData, unitColStat.colors, unitColStat.RED, unitColStat.BLUE);
          green = replaceColors(red, unitColorData, unitColStat.colors, unitColStat.RED, unitColStat.GREEN);
          yellow = replaceColors(red, unitColorData, unitColStat.colors, unitColStat.RED, unitColStat.YELLOW);

          // crop out target states as single images
          cropUnitState(sprite, cwt.Sprite.UNIT_STATE_IDLE, red, blue, green, yellow, 0);
          cropUnitState(sprite, cwt.Sprite.UNIT_STATE_UP, red, blue, green, yellow, 96);
          cropUnitState(sprite, cwt.Sprite.UNIT_STATE_DOWN, red, blue, green, yellow, 192);
          cropUnitState(sprite, cwt.Sprite.UNIT_STATE_LEFT, red, blue, green, yellow, 288);
          cropUnitStateInverted(sprite, cwt.Sprite.UNIT_STATE_IDLE_INVERTED, red, blue, green, yellow, 0);
          cropUnitStateInverted(sprite, cwt.Sprite.UNIT_STATE_RIGHT, red, blue, green, yellow, 288);

          // register sprite
          cwt.Image.sprites[this.key] = sprite;
          next();
        });
      });
    });

    // grab tile images
    Object.keys(cwt.Graphics.TILES).forEach(function (key) {
      var value = cwt.Graphics.TILES[key];
      var sprite;

      // special graphic data for tiles
      if (value[value.length - 2] === true) {
        cwt.Image.longAnimatedTiles[key] = true;
      }
      if (value[value.length - 1] === true) {
        cwt.Image.overlayTiles[key] = true;
      }

      if (value.length === 3) { // single variant tile
        sprite = new cwt.Sprite(cwt.Sprite.TILE_STATES);
        stuff.push(function (next) {
          grabImage(value[0], key, function () {
            sprite.setImage(0, /** @type {HTMLImageElement}*/ this);
            sprite.setImage(1,createBlackMask(this));
            next();
          });
        });

      } else {                  // multi variant tile
        sprite = new cwt.Sprite(value[2].length*cwt.Sprite.TILE_STATES);

        cwt.TileVariants.registerVariantInfo(key, value[0], value[1]);

        for (var i = 0, e = value[2].length; i < e; i++) {
          addToPushLoop(value[2][i], i*2, function (img, next) {
            sprite.setImage(img.key, img);
            sprite.setImage(img.key+1,createBlackMask(img));
            next();
          });
        }
      }

      cwt.Image.sprites[key] = sprite;
    });

    // grab property images
    Object.keys(cwt.Graphics.PROPERTIES).forEach(function (key) {
      stuff.push(function (next) {
        var path = cwt.Graphics.PROPERTIES[key];
        grabImage(path, key, function () {
          var sprite = new cwt.Sprite(cwt.Sprite.PROPERTY_STATES);

          var red = /** @type {HTMLImageElement} */ this;
          var blue;
          var green;
          var yellow;
          var neutral;
          var shadow;

          blue = replaceColors(red, propertyColorData, propColStat.colors, propColStat.RED, propColStat.BLUE);
          green = replaceColors(red, propertyColorData, propColStat.colors, propColStat.RED, propColStat.GREEN);
          yellow = replaceColors(red, propertyColorData, propColStat.colors, propColStat.RED, propColStat.YELLOW);
          neutral = replaceColors(red, propertyColorData, propColStat.colors, propColStat.RED, propColStat.GRAY);
          shadow = createBlackMask(red);

          sprite.setImage(cwt.Sprite.PROPERTY_RED, red);
          sprite.setImage(cwt.Sprite.PROPERTY_BLUE, blue);
          sprite.setImage(cwt.Sprite.PROPERTY_GREEN, green);
          sprite.setImage(cwt.Sprite.PROPERTY_YELLOW, yellow);
          sprite.setImage(cwt.Sprite.PROPERTY_NEUTRAL, neutral);
          sprite.setImage(cwt.Sprite.PROPERTY_SHADOW_MASK, shadow);

          // register sprite
          cwt.Image.sprites[this.key] = sprite;
          next();
        });
      });
    });

    // grab arrow images
    stuff.push(function (next) {
      var path = cwt.Graphics.ARROW;
      grabImage(path, "ARROW", function () {
        var sprite = new cwt.Sprite(10);

        var arrowMap = /** @type {HTMLImageElement} */ this;

        sprite.setImage(cwt.Sprite.DIRECTION_N, cropImage(arrowMap, 0, 0, 16, 16));
        sprite.setImage(cwt.Sprite.DIRECTION_S, cropAndRotate(arrowMap, 0, 0, 16, 180));
        sprite.setImage(cwt.Sprite.DIRECTION_W, cropAndRotate(arrowMap, 0, 0, 16, 270));
        sprite.setImage(cwt.Sprite.DIRECTION_E, cropAndRotate(arrowMap, 0, 0, 16, 90));
        sprite.setImage(cwt.Sprite.DIRECTION_SW, cropAndRotate(arrowMap, 32, 0, 16, 90));
        sprite.setImage(cwt.Sprite.DIRECTION_SE, cropImage(arrowMap, 32, 0, 16, 16));
        sprite.setImage(cwt.Sprite.DIRECTION_NW, cropAndRotate(arrowMap, 32, 0, 16, 180));
        sprite.setImage(cwt.Sprite.DIRECTION_NE, cropAndRotate(arrowMap, 32, 0, 16, 270));
        sprite.setImage(cwt.Sprite.DIRECTION_NS, cropImage(arrowMap, 16, 0, 16, 16));
        sprite.setImage(cwt.Sprite.DIRECTION_WE, cropAndRotate(arrowMap, 16, 0, 16, 90));

        // register sprite
        cwt.Image.sprites[this.key] = sprite;
        next();
      });
    });

    // grab dust images
    stuff.push(function (next) {
      var path = cwt.Graphics.DUST;
      grabImage(path, "DUST", function () {
        var sprite = new cwt.Sprite(4);

        var imgMap = /** @type {HTMLImageElement} */ this;

        sprite.setImage(cwt.Sprite.DIRECTION_LEFT, cropImage(imgMap, 0, 0, 96, 32));
        sprite.setImage(cwt.Sprite.DIRECTION_UP, cropImage(imgMap, 96, 0, 96, 32));
        sprite.setImage(cwt.Sprite.DIRECTION_DOWN, cropImage(imgMap, 192, 0, 96, 32));
        sprite.setImage(cwt.Sprite.DIRECTION_RIGHT, cropImage(imgMap, 288, 0, 96, 32));

        // register sprite
        cwt.Image.sprites[this.key] = sprite;
        next();
      });
    });

    // grab rocket fly images
    stuff.push(function (next) {
      var path = cwt.Graphics.ROCKET_FLY;
      grabImage(path, "ROCKET_FLY", function () {
        var sprite = new cwt.Sprite(2);

        sprite.setImage(cwt.Sprite.DIRECTION_UP, /** @type {HTMLImageElement} */ this);
        sprite.setImage(cwt.Sprite.DIRECTION_DOWN, cropAndRotate(this, 0, 0, 24, 180));

        // register sprite
        cwt.Image.sprites[this.key] = sprite;
        next();
      });
    });

    // grab other images
    Object.keys(cwt.Graphics.OTHERS).forEach(function (key) {
      var value = cwt.Graphics.OTHERS[key];
      var sprite;

      if (typeof value === "string") {
        sprite = new cwt.Sprite(1);

        stuff.push(function (next) {      // single image sprite
          grabImage(value, key, function () {
            sprite.setImage(0, this);
            cwt.Image.sprites[this.key] = sprite;
            next();
          });
        });
      } else {                            // multi image sprite
        sprite = new cwt.Sprite(value.length);

        for (var i = 0, e = value.length; i < e; i++) {
          addToPushLoop(value[i], i, function (img, next) {
            sprite.setImage(img.key, img);
            next();
          });
        }
      }

      cwt.Image.sprites[key] = sprite;
    });

    callAsSequence(stuff, function () {
      delete cwt.Graphics;
      callback();
    });
  },

  /**
   *
   * @param callback
   */
  persistImages: function (callback) {
    if (cwt.DEBUG) {
      console.log("persist all images in the cache");
    }

    var stuff = [];

    Object.keys(cwt.Image.sprites).forEach(function (key) {
      var sprite = cwt.Image.sprites[key];
      stuff.push(function (next) {
        cwt.Storage.assetsStorage.set(
          cwt.Image.IMAGE_KEY+key,
          cwt.Sprite.toJSON(cwt.Image.sprites[key]),
          function () {
            next();
          }
        )
      });
    });

    callAsSequence(stuff, function () {
      if (cwt.DEBUG) {
        console.log("completed image persist process");
      }

      callback();
    });
  },


  /**
   *
   * @param {Function} callback
   */
  grabFromCache: function (callback) {
    this.removeGrabbers_(); // remove initializer functions

    var stuff = [];

    /**
     * @inner
     * @param key
     */
    function loadKey(key) {
      var realKey = key.slice(cwt.Image.IMAGE_KEY.length);
      stuff.push(function (next) {
        if (cwt.DEBUG) {
          console.log("grab sprite "+key+" from cache");
        }

        cwt.Storage.assetsStorage.get(key, function (obj) {
          if (cwt.DEBUG) cwt.assert(obj.value);

          cwt.Image.sprites[realKey] = cwt.Sprite.fromJSON(obj.value);

          next();
        });
      })
    }

    // load all possible audio (except music) keys from the storage into the RAM
    cwt.Storage.assetsStorage.keys(function (keys) {
      for (var i = 0, e = keys.length; i < e; i++) {
        var key = keys[i];
        if (key.indexOf(cwt.Image.IMAGE_KEY) === 0) {
          loadKey(key);
        }
      }

      // grab tile variant information
      Object.keys(cwt.Graphics.TILES).forEach(function (key) {
        var value = cwt.Graphics.TILES[key];

        // special graphic data for tiles
        if (value[value.length - 2] === true) {
          cwt.Image.longAnimatedTiles[key] = true;
        }
        if (value[value.length - 1] === true) {
          cwt.Image.overlayTiles[key] = true;
        }

        if (value.length !== 3) { // multi variant tile
          cwt.TileVariants.registerVariantInfo(key, value[0], value[1]);
        }
      });

      callAsSequence(stuff, function () {
        callback();
      });
    });
  }

};

/**
 * The data loading process.
 *
 * @namespace
 */
cwt.Loading = {

  /**
   * @private
   */
  loaders_: [],

  hasCachedData: false,

  /**
   * Adds a loading function in the loading process.
   *
   * @param {Function} loader
   */
  create: function (loader) {
    this.loaders_.push(loader);
  },

  /**
   * Starts the loading process. After the loading process the loading stuff will be removed. The Loading namespace
   * will remain with a property with value true as marker. This property will be named deInitialized.
   *
   * @param {Function} callback
   */
  startProcess: function (loadingBar, callback) {
    if (cwt.DEBUG) {
      console.log("start loading process");
    }

    function setProgress(bar,i) {
      return function (next) {
        bar.setPercentage(i);
        next();
      }
    }

    cwt.Loading.hasCachedData = localStorage.getItem("cwt_hasCache");

    var loaders = [];
    var step = parseInt(100/this.loaders_.length);
    for (var i = 0, e=this.loaders_.length; i<e; i++ ){
      loaders.push(this.loaders_[i]);
      loaders.push(setProgress(loadingBar,(i+1)*step));
    }

    callAsSequence(loaders, function () {

      // remove functions that never be called again
      delete cwt.Loading.loaders_;
      delete cwt.Loading.create;
      delete cwt.Loading.startProcess;

      // place marker
      cwt.Loading.initialized = true;

      // invoke callback if given
      if (callback) {
        localStorage.setItem("cwt_hasCache",true);

        callback();
      }
    });
  }
};

/**
 * Localization module to grab localized strings
 * from a given key. The language can be registered
 * by registerLang.
 *
 * @namespace
 */
cwt.Localization = {

  /**
   * @private
   */
  lang_ : null,

  /**
   * Registers a language object. The properties of the object will be the keys and its values the localized
   * string for the key.
   *
   * @param obj
   */
  registerLang: function (obj) {
    if (cwt.DEBUG) cwt.assert(!this.lang_);

    this.lang_ = obj;
  },

  /**
   * Returns the localized string of a given identifier.
   *
   * @param {String} key identifier
   * @return {String}
   */
  forKey: function (key) {
    if (cwt.DEBUG) cwt.assert(this.lang_ !== null);

    var str = this.lang_[key];
    return (str) ? str : key;
  }
};

/**
 *
 * @namespace
 */
cwt.Maps = {

  /**
   * @type {Array}
   */
  maps: null,

  updateMapList: function (callback) {
    cwt.Storage.mapStorage.keys(function (keys) {
      cwt.Maps.maps = keys;
      if (callback) {
        callback();
      }
    })
  },

  grabFromLive: function (callback) {
    var stuff = [];

    Object.keys(cwt.mapList).forEach(function (key) {
      stuff.push(function (next) {
        grabRemoteFile({
          path: cwt.MOD_PATH + cwt.mapList[key],
          json: true,

          error: function (msg) {
            throw Error("could not load map");
          },

          success: function (resp) {
            cwt.Storage.mapStorage.set(key, resp, function () {
              next();
            });
          }
        });
      });
    });

    callAsSequence(stuff, function () {
      cwt.Maps.grabFromLive = null;
      callback();
    });
  },

  loadMap: function (path, callback) {
    cwt.Storage.mapStorage.get(path, function (obj) {
      callback(path, obj.value);
    });
  }

};

/**
 *
 * @namespace
 */
cwt.Network = {

  /**
   * Id of the game in the connected network session.
   */
  gameId: null,

  /**
   * Id of the client in the connected network session.
   */
  clientId: cwt.INACTIVE,

  /**
   * The target URL of the network server.
   */
  targetURL: null,

  /**
   *
   * @return {Boolean}
   */
  isActive: function () {
    return this.gameId !== null;
  },

  /**
   *
   * @return {Boolean}
   */
  isHost: function () {
    return this.gameId === null || this.clientId !== cwt.INACTIVE;
  },

  /**
   * @private
   */
  urlBuilder_:[null,"?cmd=",null,"&gameId=",null,"&userId=",null],

  /**
   *
   * @private
   */
  parser_: function () {
    if (this.readyState == 4) {
      var res = this.responseText;
      if (res !== "") {
        var data = res.split("_&_");
        for (var i = 0, e = data.length; i < e; i++) {

          if (data[i] !== undefined && data[i].length > 0) network._incomingMessage(data[i]);
        }
      }
    }
  },

  /**
   *
   */
  parseMessage: function () {
    /*
    var xmlHttp = new XMLHttpRequest();

    this.urlBuilder_[0] = this.targetURL;
    this.urlBuilder_[2] = "GRABCMD";
    this.urlBuilder_[4] = this.gameId;
    this.urlBuilder_[6] = this.clientId;

    xmlHttp.open('GET',this.urlBuilder_.join(""),true);
    xmlHttp.onreadystatechange = this.parser_;
    xmlHttp.send(null);
    */
  },

  /**
   *
   * @param obj
   */
  sendMessage: function (obj) {

  }
};

/**
 * @namespace
 */
cwt.Options = {

  /**
   * @constant
   */
  PARAM_WIPEOUT: "cwt_resetData",

  /**
   * @constant
   */
  PARAM_FORCE_TOUCH: "cwt_forceTouch",

  /**
   * @constant
   */
  PARAM_ANIMATED_TILES: "cwt_animatedTiles",

  /**
   * @type {boolean}
   */
  fastClickMode: false,

  /**
   * @type {boolean}
   */
  forceTouch: false,

  /**
   * @type {boolean}
   */
  animatedTiles: true,

  /**
   *
   * @param cb
   */
  saveOptions: function (cb) {
    cwt.Storage.generalStorage.set(cwt.Options.PARAM_ANIMATED_TILES, cwt.Options.animatedTiles, function () {
      cwt.Storage.generalStorage.set(cwt.Options.PARAM_FORCE_TOUCH, cwt.Options.forceTouch, function () {
        if (cb) {
          cb();
        }
      });
    });
  },

  /**
   *
   * @param cb
   */
  loadOptions: function (cb) {
    cwt.Storage.generalStorage.get(cwt.Options.PARAM_ANIMATED_TILES, function (obj) {
      if (obj) {
        cwt.Options.animatedTiles = obj.value;
      }

      cwt.Storage.generalStorage.get(cwt.Options.PARAM_FORCE_TOUCH, function (obj) {
        if (obj) {
          cwt.Options.forceTouch = obj.value;
        }

        if (cb) {
          cb();
        }
      });
    });
  }
};

cwt.GameSelectionDTO = {

  /**
   * @constant
   */
  CHANGE_TYPE: {
    CO_MAIN: 0,
    CO_SIDE: 1,
    GAME_TYPE: 2,
    PLAYER_TYPE: 3,
    TEAM: 4
  },

  map: null,

  /**
   * Data holder to remember selected co's.
   */
  co: null,

  /**
   *
   */
  type: null,

  /**
   *
   */
  team: null,

  /**
   * Changes a configuration parameter.
   *
   * @param pid player id
   * @param type change type
   * @param prev is it a set to previous value step (else next value)
   */
  changeParameter: function (pid, type, prev) {
    if (cwt.DEBUG) cwt.assert(type >= this.CHANGE_TYPE.CO_MAIN && type <= this.CHANGE_TYPE.TEAM);

    if (this.type[pid] === cwt.DESELECT_ID) {
      return;
    }

    switch (type) {

      case this.CHANGE_TYPE.CO_MAIN:
        var cSelect = this.co[pid];

        if (prev) {
          cSelect--;
          if (cSelect < 0) cSelect = cwt.CoSheet.types.length - 1;
        }
        else {
          cSelect++;
          if (cSelect >= cwt.CoSheet.types.length) cSelect = 0;
        }

        this.co[pid] = cSelect;
        break;

      // ---------------------------------------------------------

      case this.CHANGE_TYPE.CO_SIDE:
        cwt.assert(false, "not supported yet");
        break;

      // ---------------------------------------------------------

      case this.CHANGE_TYPE.GAME_TYPE:
        if (prev) {
          if (cwt.Gameround.gameMode === cwt.Gameround.GAME_MODE_AW1) {
            cwt.Gameround.gameMode = cwt.Gameround.GAME_MODE_AW2;
          } else if (cwt.Gameround.gameMode === cwt.Gameround.GAME_MODE_AW2) {
            cwt.Gameround.gameMode = cwt.Gameround.GAME_MODE_AW1;
          }
        } else {
          if (cwt.Gameround.gameMode === cwt.Gameround.GAME_MODE_AW1) {
            cwt.Gameround.gameMode = cwt.Gameround.GAME_MODE_AW2;
          } else if (cwt.Gameround.gameMode === cwt.Gameround.GAME_MODE_AW2) {
            cwt.Gameround.gameMode = cwt.Gameround.GAME_MODE_AW1;
          }
        }
        break;

      // ---------------------------------------------------------

      case this.CHANGE_TYPE.PLAYER_TYPE:
        var cSelect = this.type[pid];
        if (cSelect === cwt.DESELECT_ID) break;

        if (prev) {
          cSelect--;
          if (cSelect < cwt.INACTIVE) cSelect = 1;
        }
        else {
          cSelect++;
          if (cSelect >= 2) cSelect = cwt.INACTIVE;
        }

        this.type[pid] = cSelect;
        break;

      // ---------------------------------------------------------

      case this.CHANGE_TYPE.TEAM:
        var cSelect = this.team[pid];

        while (true) {
          if (prev) {
            cSelect--;
            if (cSelect < 0) cSelect = 3;
          }
          else {
            cSelect++;
            if (cSelect >= 4) cSelect = 0;
          }

          var s = false;
          for (var i = 0, e = cwt.Player.MULTITON_INSTANCES; i < e; i++) {
            if (i === pid) continue;

            if (this.type[i] >= 0 && this.team[i] !== cSelect) {
              s = true;
            }
          }

          if (s) break;
        }

        this.team[pid] = cSelect;
        break;
    }
  },

  /**
   * Does some preparations for the configuration screen.
   */
  preProcess: function () {

    // lazy init config data
    if (!this.co) {
      this.co = [];
      this.team = [];
      this.type = [];
    }

    // reset config data
    for (var n = 0; n < cwt.Player.MULTITON_INSTANCES; n++) {
      this.co[n] = 0;
      this.team[n] = cwt.INACTIVE;
      this.type[n] = 0;
    }

    for (var i = 0, e = cwt.Player.MULTITON_INSTANCES; i < e; i++) {
      if (i < this.map.player) {

        if (i === 0) {
          this.type[i] = 0;
        } else this.type[i] = 1;

        this.team[i] = i;

      } else {
        this.type[i] = cwt.DESELECT_ID;
      }
    }
  },

  /**
   * Does some preparations for the game round initialization.
   */
  postProcess: function () {
    var tmp;

    cwt.Player.activeClientPlayer = null;

    // TODO: player one is deactivated

    // deregister old players
    // controller.ai_reset();
    // model.events.client_deregisterPlayers();

    var onlyAI = true;
    for (var i = 0, e = cwt.Player.MULTITON_INSTANCES; i < e; i++) {
      if (this.type[i] === 0) {
        onlyAI = false;
        break;
      }
    }

    // update model
    for (var i = 0, e = cwt.Player.MULTITON_INSTANCES; i < e; i++) {
      var player = cwt.Player.getInstance(i);

      if (this.type[i] >= 0) {

        player.gold = 0;
        player.team = this.team[i];

        var cientContrld = false;

        if (this.type[i] === 1) {
          // controller.ai_register(i);
          if (onlyAI) {
            cientContrld = true;
          }
        } else {
          player.clientVisible = true;
          cientContrld = true;
        }

        if (cientContrld) {
          if (!cwt.Player.activeClientPlayer) {
            cwt.Player.activeClientPlayer = player;
          }
          player.clientControlled = true;
        }

        tmp = ( this.co[i] !== cwt.INACTIVE) ?
          cwt.CoSheet.types[this.co[i]] : null;

        cwt.CO.setMainCo(player, tmp);

      } else {
        // Why another disable here ?
        // There is the possibility that a map has units for a player that will be deactivated in the
        // config screen.. so deactivate them all

        cwt.Unit.destroyPlayerUnits(player);
        cwt.Property.releasePlayerProperties(player);

        // deactivate player
        player.team = cwt.INACTIVE;
      }
    }
  }
};(function () {

  var canvasW = cwt.TILE_BASE * cwt.SCREEN_WIDTH;
  var canvasH = cwt.TILE_BASE * cwt.SCREEN_HEIGHT;

  /**
   * Screen model.
   *
   * @namespace
   */
  cwt.Screen = {

    width: canvasW,

    height: canvasH,

    offsetX: 0,

    offsetY: 0,

    convertToTilePos: function (p) {
      return parseInt(p/cwt.TILE_BASE,10);
    },

    /**
     *
     * @param moveCode
     */
    shiftScreen: function (moveCode) {
      var changed = false;

      switch (moveCode) {
        case cwt.Move.MOVE_CODES_UP:
          if (this.offsetY < cwt.Map.height - cwt.SCREEN_HEIGHT - 1) {
            this.offsetY++;
            changed = true;
          }
          break;

        case cwt.Move.MOVE_CODES_RIGHT:
          if (this.offsetX > 0) {
            this.offsetX--;
            changed = true;
          }
          break;

        case cwt.Move.MOVE_CODES_DOWN:
          if (this.offsetY > 0) {
            this.offsetY--;
            changed = true;
          }
          break;

        case cwt.Move.MOVE_CODES_LEFT:
          if (this.offsetX < cwt.Map.width - cwt.SCREEN_WIDTH - 1) {
            this.offsetX++;
            changed = true;
          }
          break;
      }

      return changed;
    },

    /**
     * @type {cwt.LayeredCanvas}
     */
    layerBG: new cwt.LayeredCanvas("canvas_layer1", 1, canvasW, canvasH),

    /**
     * @type {cwt.LayeredCanvas}
     */
    layerMap: new cwt.LayeredCanvas("canvas_layer2", 8, canvasW, canvasH),

    /**
     * @type {cwt.LayeredCanvas}
     */
    layerFog: new cwt.LayeredCanvas("canvas_layer3", 1, canvasW, canvasH),

    /**
     * @type {cwt.LayeredCanvas}
     */
    layerFocus: new cwt.LayeredCanvas("canvas_layer4", 7, canvasW, canvasH),

    /**
     * @type {cwt.LayeredCanvas}
     */
    layerUnit: new cwt.LayeredCanvas("canvas_layer5", 3, canvasW, canvasH),

    /**
     * @type {cwt.LayeredCanvas}
     */
    layerEffects: new cwt.LayeredCanvas("canvas_layer6", 1, canvasW, canvasH),

    /**
     * @type {cwt.LayeredCanvas}
     */
    layerUI: new cwt.LayeredCanvas("canvas_layer7", 1, canvasW, canvasH)
  };
})();

/**
 * @class
 */
cwt.Storage = my.Class(/** @lends cwt.Storage.prototype */ {

  STATIC: /** @lends cwt.Storage */ {

    /**
     * @constant
     */
    IOS7_WEBSQL_BUGFIX_SIZE: 4,

    /**
     * @constant
     */
    STORAGE_MAPS: "MAPS",

    /**
     * @constant
     */
    STORAGE_ASSETS: "ASSETS",

    /**
     * @constant
     */
    STORAGE_GENERAL: "GENERAL",

    /**
     * @constant
     */
    STORAGE_MAPS_SIZE: 10,

    /**
     * @constant
     */
    STORAGE_ASSETS_SIZE: 40,

    /**
     * @constant
     */
    STORAGE_GENERAL_SIZE: 5,

    /**
     * Storage for general aw2 like settings.
     *
     * @type {cwt.Storage}
     */
    generalStorage: null,

    /**
     * Storage for maps.
     *
     * @type {cwt.Storage}
     */
    mapStorage: null,

    /**
     * Storage for assets aw2 like images and sounds.
     *
     * @type {cwt.Storage}
     */
    assetsStorage: null,

    /**
     * Initializes the storage system.
     *
     * @param {Function} callback
     */
    initialize: function (callback) {
      var storage_type = (cwt.ClientFeatures.touch) ? 'webkit-sqlite' : 'indexed-db';
      var createInstance = function (name, sizeMb, storage_type, cb) {
        var store = new Lawnchair({
            adaptor: storage_type,
            maxSize: (cwt.ClientFeatures.iosWebSQLFix ?
              cwt.Storage.IOS7_WEBSQL_BUGFIX_SIZE : sizeMb ) * 1024 * 1024,
            name: name
          },
          cb
        );
      };

      // creates the creator function
      function createStorage(name, size, prop) {
        return function (next) {
          createInstance(name, size, storage_type, function (adapter) {
            cwt.Storage[prop] = new cwt.Storage(adapter);
            next();
          });
        }
      }

      // create all storage object
      callAsSequence([
          createStorage(cwt.Storage.STORAGE_MAPS, cwt.Storage.STORAGE_MAPS_SIZE, "mapStorage"),
          createStorage(cwt.Storage.STORAGE_ASSETS, cwt.Storage.STORAGE_ASSETS_SIZE, "assetsStorage"),
          createStorage(cwt.Storage.STORAGE_GENERAL, cwt.Storage.STORAGE_GENERAL_SIZE, "generalStorage")
        ], function () {
          if (callback) {
            callback();
          }
        }
      );

      // remove initializer function (never called again)
      delete cwt.Storage.initialize;
    },

    /**
     * Nukes the storage objects.
     *
     * @param {Function} callback
     */
    wipeOutAll: function (callback) {
      function wipeOutStorage(storage) {
        return function (next) {
          storage.clear(next);
        };
      };

      callAsSequence([
        wipeOutStorage(cwt.Storage.generalStorage),
        wipeOutStorage(cwt.Storage.assetsStorage),
        wipeOutStorage(cwt.Storage.mapStorage)
      ], callback );
    }
  },

  constructor: function (store) {
    this.store = store;
  },

  /**
   *
   * @param key
   * @param cb
   */
  get: function (key, cb) {
    this.store.get(key, cb);
  },

  /**
   *
   * @param key
   * @param cb
   */
  has: function (key, cb) {
    this.store.exists(key, cb);
  },

  /**
   *
   * @param key
   * @param cb
   */
  exists: function (key, cb) {
    this.store.exists(key, cb);
  },

  /**
   *
   * @param cb
   */
  each: function (cb) {
    this.store.each(cb);
  },

  /**
   * Saves a value with a given key. If the key exists, then the old value
   * will be overwritten. After the save process, the callback cb will be
   * invoked.
   *
   * @param {String} key
   * @param {*} value
   * @param {Function} cb
   */
  set: function (key, value, cb) {
    this.store.save({ key: key, value: value }, cb, /* error function */ function () {

      // try a second time when fail at the first time because
      // on ios the question for more storage invokes an error
      //  => we don't want to need to reload then
      this.store.save({ key: key, value: value }, cb);
    });
  },

  /**
   *
   * @param cb
   */
  keys: function (cb) {
    this.store.keys(cb);
  },

  /**
   *
   * @param cb
   */
  clear: function (cb) {
    this.store.nuke(cb);
  },

  /**
   *
   * @param key
   * @param cb
   */
  remove: function (key, cb) {
    this.store.remove(key, cb);
  }
});

cwt.TileVariants = {

  /**
   *
   */
  types: {},

  /**
   *
   * @param type
   * @param desc
   * @param connection
   */
  registerVariantInfo: function (type, desc, connection) {
    if (cwt.DEBUG) cwt.assert(!this.types.hasOwnProperty(type));

    this.types[type] = new cwt.TileVariantInfo(desc, connection);
  },

  /**
   *
   */
  updateTileSprites: function () {
    var x;
    var y;
    var xe = cwt.Map.width;
    var ye = cwt.Map.height;
    var mapData = cwt.Map.data;

    for (x = 0; x < xe; x++) {
      for (y = 0; y < ye; y++) {

        var tile = mapData[x][y];

        // tile has variants
        if (this.types[tile.type.ID]) {
          tile.variant = this.types[tile.type.ID].getVariant(

            // N
            (y > 0) ? mapData[x][y - 1].type.ID : "",

            // E
            (x < cwt.Map.width - 1) ? mapData[x + 1][y].type.ID : "",

            // S
            (y < cwt.Map.height - 1) ? mapData[x][y + 1].type.ID : "",

            // W
            (x > 0) ? mapData[x - 1][y].type.ID : "",

            // NE
            (y > 0 && x < cwt.Map.width - 1) ? mapData[x + 1][y - 1].type.ID : "",

            // SE
            (y < cwt.Map.height - 1 && x < cwt.Map.width - 1) ? mapData[x + 1][y + 1].type.ID : "",

            // SW
            (y < cwt.Map.height - 1 && x > 0) ? mapData[x - 1][y + 1].type.ID : "",

            // NW
            (y > 0 && x > 0) ? mapData[x - 1][y - 1].type.ID : ""
          );
        } else {
          tile.variant = 0;
        }
      }
    }
  }
};