/** @private */
locale._data = {};

/**
 * The selected language code.
 *
 * @example
 * de --> German
 * en --> English
 */
locale.language = "en";

/**
 * Returns a localized version of the given key or the key itself if no
 * localized string exists for the given key argument.
 *
 * @param key
 */
locale.localizedString = function( key ){
  var result = locale._data[ locale.language ][key];
  if( result === undefined ) return key;
  return result;
};

/**
 *
 * @param langCode
 * @param lang
 */
locale.appendToLanguage = function( langCode, lang ) {

  // CREATE LANG NAMESPACE IF NOT EXISTS
  if( !locale._data.hasOwnProperty( langCode ) ){
    locale._data[ langCode ] = {};
  }

  // APPEND NEW KEYS
  var langNs = locale._data[ langCode ];
  var keys = Object.keys( lang );
  for( var i=0,e=keys.length; i<e; i++ ){
    langNs[ keys[i] ] = lang[ keys[i] ];
  }
};