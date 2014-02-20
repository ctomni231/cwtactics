/**
 * @class
 */
cwt.Hook = my.Class(null, cwt.IdHolder, /** @lends cwt.Hook.prototype */ {

  STATIC: /** @lends cwt.Hook */ {

    /**
     *
     */
    buffer: util.createRingBuffer(50),

    /**
     * Contains all registered animation hacks.
     */
    hooks: {},

    /**
     *
     * @param impl
     */
    registerHook: function (impl) {
      var key = impl.key;

      if (cwt.Hook.hooks.hasOwnProperty(key)) {
        assert(false, "animation algorithm for", key, "is already registered");
      }

      cwt.Hook.hooks[ key ] = impl;

      // REGISTER LISTENER
      model.event_on(key, function () {
        var data = [];

        for (var i = 0, e = arguments.length; i < e; i++) data[i] = arguments[i];
        data[data.length] = key;

        cwt.Hook.buffer.push(data);
      });

      impl.isEnabled = true;
    }
  },

  constructor: function (id) {
    cwt.Hook.registerType(id, this);
  }

})
;