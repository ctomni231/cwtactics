/**
 * Sound module that provides basic functions to control music and sfx of the
 * application
 *
 * @since 26.05.2011
 * @author Tapsi
 * @namespace
 */
meow.sound =
/** @lends meow.sound# */
{
	/** @constant */
	PLAYMODE_NORMAL : -1,

	/** @constant */
	PLAYMODE_LOOPSONG : -2,

	/** @constant */
	PLAYMODE_LOOPLIST : -3,

	/**
	 * Sound module object, can be either a javascript module or a javaToJS
	 * hybrid object.
	 * <br><br>
	 * The module must provide the following functions to work correct:
	 *
	 * @example
	 * void playMusic( String key )
	 * void playSFX( String key )
	 * void setSFXVolume( float val )
	 * void setMusicVolume( float val )
	 * void stopMusic( )
	 */
	soundModule : null,

	/**
	 * Sound effects API.
	 *
	 * @namespace
	 * @name sfx
	 * @memberOf meow.sound
	 */
	sfx :
	/** @lends meow.sound.sfx# */
	{
		/**
		 * Sets the volume of the sfx channel.
		 *
		 * @param {Number} val volume
		 */
		volume : function( val )
		{
			if( val >= 0 && val <= 1 )
				meow.sound.soundModule.setSFXVolume( key )
		},

		/**
		 * Plays a sfx sound.
		 *
		 * @param {String} identical key for the sfx sound
		 */
		play : function( key )
		{
			meow.sound.soundModule.playSFX( key )
		}
	},

	/**
	 * Sound music API.
	 *
	 * @namespace
	 * @name music
	 * @memberOf meow.sound
	 */
	music :
	/** @lends meow.sound.music# */
	{
		/**
		 * Song list.
		 *
		 * @private
		 */
		playList : new Array(),

		/** @private */
		playListPt : 0,

		/**
		 * Play mode.
		 *
		 * @example
		 * // plays the music list once
		 * meow.sound.music.playMode = PLAYMODE_NORMAL
		 *
		 * // plays a song in a unendless loop
		 * meow.sound.music.playMode = PLAYMODE_LOOPSONG
		 *
		 * // plays the music list unendless
		 * meow.sound.music.playMode = PLAYMODE_LOOPLIST
		 */
		playMode : PLAYMODE_LOOPLIST,

		/**
		 * Sets the volume of the music channel.
		 *
		 * @param {Number} val volume
		 */
		volume : function( val )
		{
			if( val >= 0 && val <= 1 )
				meow.sound.soundModule.setMusicVolume( key )
		},
		
		/**
		 * Increases the list pointer and returns true, if the playlist is
		 * completely parsed, the function sets the pointer to zero and returns
		 * true, else false.
		 */
		tickList : function()
		{
			this.playListPt++
			if( this.playListPt == this.playList.length )
			{
				this.playListPt = 0
				return true
			}
			else return false
		},

		/**
		 * Plays a song.
		 *
		 * @param {String} key identical key of the song, that will be played,
		 *					   if null, next song from the song list will be
		 *					   played.
		 */
		play : function( key )
		{
			if( typeof key !== 'undefined' )
				meow.sound.soundModule.playMusic( key )
			else
				meow.sound.soundModule.playMusic(
						this.playList[ this.playListPt ] )
		},

		/**
		 * Stops music playback.
		 */
		stop : function()
		{
			meow.sound.soundModule.stopMusic( )
		},

		/**
		 * Clears the music playlist.
		 */
		clearList : function()
		{
			this.playList.removeRange( 0 , this.playList.length - 1 )
		},

		/**
		 * Pushes a song to the music playlist.
		 */
		pushToPlaylist : function( key )
		{
			this.playList.push( key )
		}
	}
}

if( !MEOW_NOCONFLICT )
{
	sfx = meow.sound.sfx
	music = meow.sound.music
}

// initialize listener for music player to make sure, that the play list does
// not stops after a track is done
sys.getGlobal()["onMusicTrackFinish"] = function()
{ 
	var mode = meow.sound.music.playMode
	
	if( mode == PLAYMODE_LOOOPSONG )
	{
		meow.sound.music.play()
		return
	}
	
	var r = meow.sound.music.tickList()
	
	if(r && mode == PLAYMODE_NORMAL )
		return
	
	meow.sound.music.play()
}