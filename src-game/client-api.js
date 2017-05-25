const gameClientInterface = (() => {

  const noop = () => undefined
  const notImplemented = () => console.error("niy")

  return {

    /**
      Pushes an information into the debug channel
     */
    debug: noop,

    /**
      Restarts the whole game.
    */
    restart: notImplemented,

    /**
      @todo client has to overwrite this
      @return Promise(void, error-message)
    */
    init: notImplemented,

    audio: {

      /**
        @parameter volume {integer} new volume of the channel (values: 0..100)
        @return {integer} new sfx channel volume
      */
      setSfxVolume: notImplemented,

      /**
        @return {integer} sfx channel volume
      */
      getSfxVolume: notImplemented,

      /**
        @parameter volume {integer} new volume of the channel (values: 0..100)
        @return {integer} new music channel volume
      */
      setMusicVolume: notImplemented,

      /**
        @return {integer} music channel volume
      */
      getMusicVolume: notImplemented

    },

    /**
      @return {object{x: integer, y: integer}}
     */
    getCursor: notImplemented,

    /**
      @todo client has to overwrite this
      @param key
      @param translated key or ???key??? if key cannot be
             translated into a human readable language
    */
    translated: notImplemented,

    jobs: {

      /**
        Calls the given job after the given time in
        milliseconds over and over again until jobs.remove is called.

        @todo client has to overwrite this
        @param key
        @param time {integer} in ms
        @param job {function}
      */
      add: notImplemented,

      /**
        Removes the given job from the job queue.

        @todo client has to overwrite this
        @param key
      */
      remove: notImplemented
    },

    /**
      Shows a notification message to the user. This may not
      requests any interaction from the user and fades out after
      time.

      @todo client has to overwrite this
      @param time {int} in milliseconds
      @param msg {string}
    */
    showNotification: notImplemented,

    events: {

      /**
        Will be called when a screen will be opened.

        @todo client has to overwrite this
        @param key {string} key of the screen
        @param layout {???} layout data of the screen
      */
      onScreenOpened: noop,

      /**
        @param weather {string}
       */
      onWeatherChanged: noop,

      /**
        @param type {string}
        @param x {integer}
        @param y {integer}
       */
      onUnitCreated: noop
    },

    /**
      network package contains the network access
    */
    net: {

      /**
        @todo client has to overwrite this
        @param key {string}
        @param data {?}
      */
      shareCommand: notImplemented,

      /**
        @todo client has to overwrite this
        @return {boolean} true if the game round is a network
                game instance, false otherwise
       */
      isActive: notImplemented,

      /**
        @todo client has to overwrite this
        @return {boolean} true when the game client is the host
                instance in a game instance, false otherwise
       */
      isHost: notImplemented
    },

    /**
      storage object holds functions to store and load persistent data
    */
    storage: {

      /**
        @todo client has to overwrite this
        @param key {string} key of the entry
        @return Promise(T, error-message)
      */
      load: notImplemented,

      /**
        save:: (string, A) -> Promise(A, string)

        takes a key and a value. saves the value with the unique identifier
        key and returns a promise which resolves with the saved value, or
        rejects with an error message.
      */
      save: notImplemented,

      /**
        @todo client has to overwrite this
        @return Promise(void, error-message)
      */
      clean: notImplemented
    }
  }
})()
