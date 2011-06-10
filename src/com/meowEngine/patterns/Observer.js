(function(){

	var observerAble = meow.Class({

		constructor : function(){
			this._observers = [];
		},

		addObserver : function( obsFunction )
		{
			this._observers.push( obsFunction );
		},

		remObserver : function( obsFunction )
		{
			this._observers.slice( this._observers.indexOf( obsFunction ), 1);
		},

		notifyObservers : function( argObj )
		{
			for( var i = 0 ; this._observers.length ; i++ )
			{
				this._observers[i]( this , argObj );
			}
		}
	});

	meow.Observerable = observerAble;
})();