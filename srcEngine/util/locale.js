util.i18n_data = { en:{} };
util.i18n_lang = util.i18n_data.en;

/**
 * Returns a localized string for a given key or if not exist the key itself.
 *
 * @param key
 */
util.i18n_localized = function( key ){
  var result = this.i18n_lang[key];
  return ( result === undefined )? key: result;
};

/**
 * Sets the active language.
 *
 * @param langKey
 */
util.i18n_setLanguage = function( langKey ){
  if( !util.i18n_data.hasOwnProperty( langKey ) ){
    throw Error("unknown language");
  }
  else{
    util.i18n_lang = util.i18n_data[langKey];
  }
};

/**
 * Appends data to a given language.
 *
 * @param langKey
 * @param data
 */
util.i18n_appendToLanguage = function( langKey, data ){

  // CREATE LANG NAMESPACE IF NOT EXISTS
  if( !util.i18n_data.hasOwnProperty( langKey ) ){
    util.i18n_data[ langKey ] = {};
  }

  // APPEND NEW KEYS
  var langNs = util.i18n_data[ langKey ];
  var keys = Object.keys( data );
  for( var i=0,e=keys.length; i<e; i++ ){
    langNs[ keys[i] ] = data[ keys[i] ];
  }
};