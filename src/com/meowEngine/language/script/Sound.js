const SOUND_DYNAMIC = 0;
const SOUND_CACHED = 1;

meow.sound =
{

	initialize : function( sfxMode , musicMode )
	{
		
	},

	sfx :
	{
		//load : function( file, key ){},
		play : function( key ){},
		volume : function( value ){}
	},

	music :
	{
		//load : function( file, key ){},
		//unload : function( )
		play : function( key ){},
		volume : function( value ){}
	}
}