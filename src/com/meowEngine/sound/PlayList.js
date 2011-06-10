(function(){

	var playList = meow.Class({

		STATICS : {
			MODE_NORMAL   : -1,
			MODE_LOOPLIST : -2,
			MODE_LOOPSONG : -3
		},

		constructor : function(){
			this._list = [];
			this._pointer = 0;
		},

		next : function(){
			
			this._pointer++;

			if( this._pointer == this._list.length )
				this._pointer = 0;
		},

		addSong : function( song )
		{
			this._list.push( song );
		},

		remSong : function( song )
		{
			var index = this._list.indexOf(song);
			this._list.slice( index,1 );

			if( this._pointer >= this._list.length )
				this._pointer = 0;
		},

		clearList : function()
		{
			this._list.slice( 0 , this._list.length );
			this._pointer = 0;
		}
	});

	var playMap = meow.Class({

		constructor : function(){
			this._map = {};
		},

		songFor : function( obj ){
			return this._map[ obj ];
		},

		putSongFor : function( obj , song )
		{
			this._map[ obj ] = song;
		},

		remSongFor : function( obj )
		{
			delete this._map[ obj ];
		},

		clearMap : function()
		{
			var i;
			var array = [];

			for( i in this._data )
				if( i !== '_map' ) array.push( i );

			for( i = 0 ; i < array.length ; i++ )
				delete this._data[ array[i] ];

			array = null;
		}

	});

	meow.PlayList = playList;
	meow.PlayListMap = playMap;
})();