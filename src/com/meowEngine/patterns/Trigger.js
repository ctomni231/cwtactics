(function(){

	var trigger = meow.Class({
		
		constructor : function(){
			this._listeners = [];
		},

		addListener : function( lisFunction )
		{
			this._listeners.push( lisFunction );
		},

		remListener : function( lisFunction )
		{
			this._listeners.slice( this._listeners.indexOf( lisFunction ), 1);
		},

		invokeTrigger : function(){
			for( var i = 0 ; this._listeners.length ; i++ )
			{
				this._listeners[i]();
			}
		}
	});

	meow.Trigger = trigger;
})();