/**
 * A filter that uses amandaJs to validate incoming messages. This filter is key based and reacts in dependency of a
 * given key in the incoming message.
 *
 * @since 21.04.2012
 * @author BlackCat (blackcat.myako@gmail.com)
 */
jsMessage.filter.amandaKeyBasedValidator = function( key, alterable ){

  var _errorFn_ = function( error ){
    if( error ) console.log("validation failed due "+error);
  };

  var nodes = {};

  // public API
  var API = {

    isBinded: function( key ){
      return typeof nodes[key] !== 'undefined';
    },

    bind: function( key, schema ){
      if( typeof nodes[key] !== 'undefined' ) throw Error('key \''+key+'\' is already registered');

      nodes[key] = schema;
    },

    filter: function( msg ){
      var mKey = msg[key];
      if( typeof mKey !== 'undefined' ){

        // validate with correct schema
        if( nodes[mKey] ){
          amanda.validate( msg, nodes[mKey], _errorFn_ );
        }
      }
    }
  };

  // are schemas remove able?
  if( alterable === true ){
    API.unbind = function( key ){
      return delete nodes[key];
    };
  }

  return API;
};