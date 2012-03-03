/**
 * Tag service that holds all tag containers of the game.
 *
 * @namespace
 */
cwt.tagService = {

  /** @type {Array<nekoScript.TagContainer>} */
  _objs: [],

  /**
   * Identical number of the global tag container.
   *
   * @constant
   */
  modTagsId: MAX_PLAYER,

  /**
   * Identical number of the map tag container.
   *
   * @constant
   */
  mapTagsId: MAX_PLAYER+1,

  /**
   * Initializes the script system.
   */
  _init: function(){
    // register container for every player
    if( DEBUG ) nekoLog.info('creating tag containers for the players');
    for( var i=0,e=MAX_PLAYER; i<e; i++ ) cwt.tagService._objs[i] = nekoScript.Factory.TagContainer();

    // register global container (effects for all players)
    if( DEBUG ) nekoLog.info('creating mod and map tag containers');
    cwt.tagService._objs[cwt.tagService.modTagsId] = nekoScript.Factory.TagContainer();
    cwt.tagService._objs[cwt.tagService.mapTagsId] = nekoScript.Factory.TagContainer();
  },

  /**
   * Resets all player tag containers.
   */
  resetPlayerContainers: function(){
    if( DEBUG ) nekoLog.info('reseting player tag containers');

    for( var i=0,e=MAX_PLAYER; i<e; i++ ) cwt.tagService.containerOf(i).clear();
  },

  /**
   * Resets the map tag container.
   */
  resetMapContainer: function(){
    if( DEBUG ) nekoLog.info('reseting map tag container');

    cwt.tagService.containerOf(cwt.tagService.mapTagsId).clear();
  },

  /**
   * Returns the container of a given identical number.
   *
   * @param {number} id
   * @return {nekoScript.TagContainer}
   */
  containerOf: function( id ){
    return cwt.tagService._objs[id];
  }
};

/**
 * Cache for CO and map tags to prevent unnecessary recompiling.
 */
cwt.tagTemplateCache = {};

cwt.tagCompiler = nekoScript.Factory.Compiler([

  // EVERY Nth DAY
  {
    name:'nthDay',
    when:nekoScript.Compiler.times.CONDITION,
    schema:{
      type:'number',
      format:'unsignedInt'
    },
    compiler:function(content){
      return 'day%'+content+' === 0';
    }
  }

]);

// initialize event model
cwt.tagService._init();