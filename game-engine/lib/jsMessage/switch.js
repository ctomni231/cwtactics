/**
 * @since 21.04.2012
 * @author BlackCat (blackcat.myako@gmail.com)
 * @param key name of the key that will be used as switching value
 *
 * @example
 * // key is set to logicCmd
 * switcher.bind( 'X', callbackA );
 *
 * // send messages through a jsMessage context
 * jsMessage.message({ logicCmd:'X' }); // will call callbackA
 * jsMessage.message({ logicCmd:'Y' }); // will not call callbackA
 */
jsMessage.filter.switchFilter = function( key, errorIfNoKey ){

  var nodes = {};

  // return public API
  var API = {

    isBind: function( key ){
      return typeof nodes[key] !== 'undefined';
    },

    bind: function( key, callback ){
      if( API.isBind(key) ) throw Error('key \''+key+'\' is already connected to the filter');

      nodes[key] = callback;
    },

    filter: function( args ){
      // check message props
      if( typeof args[key] === 'undefined' ){
        if( errorIfNoKey === true ) throw Error('no handler registered for key \''+key+'\'');
        return;
      }

      var fn = nodes[ args[key] ];
      if( fn ) fn( args );
    }
  };

  return API;
};