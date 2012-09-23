cwtwc.plugins = {

  /**
   * @type Object<enable,disable>
   */
  _data: {},

  register: function( desc ){
    desc.enabled = false;
    cwtwc.plugins._data[ desc.id ] = desc;
  },

  enable: function( key ){
    var plugin = cwtwc.plugins._data[key];

    plugin.enable();
    plugin.enabled = true;

    if( cwt.DEBUG ) cwt.info("enabled {0} plugin", key);
  },

  disable: function( key ){
    var plugin = cwtwc.plugins._data[key];

    if( plugin.toggleable === false ) throw Error("plugin cannot be disabled!");

    plugin.disable();
    plugin.enabled = false;

    if( cwt.DEBUG ) cwt.info("disabled {0} plugin", key);
  },

  startAll: function(){
    var plugin;
    var keys = Object.keys( cwtwc.plugins._data );
    for( var i=0,e=keys.length; i<e; i++ ){
      plugin = cwtwc.plugins._data[ keys[i] ];
      if( plugin.enabled === false ){
        this.enable( keys[i] );
      }
    }
  }
};