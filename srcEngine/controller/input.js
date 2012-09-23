/**
 * The input controller handles all incoming input data from the user
 * and alters the internal data. A game client should use this to 
 * communicate with the engine rather than calling the service functions
 * on its own.
 */
cwt.input = StateMachine.create({

  initial: 'Off',

  error: function( eventName, from, to, args, errorCode, errorMessage, e ){
                   
    if( cwt.DEBUG ){ 
      cwt.error(
        "error in input controller code:{0} message:{1} e:{4} from:{2} to:{3}",
        errorCode, errorMessage, from, to, e.message
      );
    }

    return "";
  },

  events: [

    { name: 'init', from: 'Off', to: 'NoSelection' },

    // UNIT SELECTION
    { name: 'unitSelected',  from: 'NoSelection',
                             to: 'UnitSelection' },
    { name: 'showMoveMap',   from: ['UnitSelection','UnitMoveMap'],
                             to: 'UnitMoveMap'   },
    { name: 'showActionMap', from: ['UnitSelection','UnitMoveMap'],
                             to: 'UnitActions'   },
    
    // FACTORY SELECTIONS
    { name: 'factorySelected', from: 'NoSelection', to: 'FactoryActions' },
    
    // MAP (NO SELECTION)
    { name: 'mapSelected',     from: 'NoSelection', to: 'MapActions'     },
    
    // GLOBAL ACTIONS
    { name: 'doAction', from: ['MapActions','UnitActions','FactoryActions'],
                        to: 'NoSelection' },
    { name: 'back',     from: '*', to: 'NoSelection' }
  ],

  /*
   * Callback events to react if special state changes occur.
   */
  callbacks: {

    onchangestate: function( ev, f, t ){
      if( f !== 'none' && f !== 'Off' ){
        this.emitStateChange( t,f,ev );
      }
    },

    onbeforeinit: function(){
      cwt.util.observable( this, 'StateChange' );
      this.movemap = null;
    },
    
    onbeforeunitSelected: function( ev, f, t, uid ){
      if( cwt.DEBUG ){
        cwt.info("selecting unit {0}", uid);
      }
      
      this.selected = uid;
    },
    
    onbeforefactorySelected: function( ev, f, t, fid ){
      if( cwt.DEBUG ){
        cwt.info("selecting property {0}", fid);
      }
      
      this.selected = fid;
    },
    
    onbeforedoAction: function( ev, f, t, actionIndex ){
      var actions = this.actions;
      
      if( actionIndex < 0 || actionIndex >= actions.length ){
        cwt.error('invalid action index {0}',actionIndex);
      }
      
      // move way if possible
      if( this.movemap !== null && this.movemap.way.length > 0 ){
        cwt.moveUnit( this.movemap );
      }
      
      // do action 
      cwt.doAction( actions[ actionIndex ] );
    },

    /*
     * ...
     */
    onshowActionMap: function( ev, f, t, x, y, way ){
    
      // save path if possible  
      if( way !== undefined ){ 
        this.movemap.way = way; 
      }
    },
    
    /*
     * Enter no selection state, all tempoary data needs to 
     * be cleaned for next selection.
     */
    onenterNoSelection: function(){
      this.movemap = null;   // current active move map
      this.actions = null;   // current actions of the selected object
      this.selected = -1;    // holds the id of the current selected object
    },

    /*
     * Enter move way selection state, the move map needs to 
     * be generated for the selected unit.
     */
    onenterUnitMoveMap: function( ev, f, t ){
      this.movemap = cwt.createMoveCard( this.selected );
    },
    
    /*
     * Factory action menu.
     */
    onenterFactoryActions: function( ev, f, t, x, y ){
      if( this.selected === -1 ){
        cwt.error('no factory is selected');
      }

      cwt.error('factory actions are not implemented yet');
    },
    
    /*
     * Unit action menu.
     */
    onenterMapActions: function( ev, f, t, x, y ){
      this.actions = cwt.mapActions( x, y );
    },
    
    /*
     * Unit action menu.
     */
    onenterUnitActions: function( ev, f, t, x, y ){
      if( this.selected === -1 ){
        cwt.error('no unit is selected');
      }

      if( this.movemap.moveMap[x][y] > 0 ){
        this.actions = cwt.unitActions( this.selected, x, y );
      }
      else cwt.error("cannot move onto tile {0},{1}",x,y);
    }
  }

});

cwt.onInit("input controller", function(){ cwt.input.init(); });