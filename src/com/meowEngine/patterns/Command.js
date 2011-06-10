(function(){
	
	var commandStack = meow.Class( /** @lends meow.CommandStack# */ {

		constructor : function(){
			this._commands = [];
			this._pointer = 0;
		},

		/**
		 * Commits a command to the command stack and executes it, if wanted by
		 * the executor of this function. If the command stack is not at the
		 * head state, this function will first goto the head revision and
		 * execute all commands, before it processes the command. If you want
		 * to drop all changes between the current revision and the head
		 * revision, then use markHead() first.
		 *
		 * @param {Command} cmd command instance, that will be added to the
		 *					stack
		 * @param {Boolean} execute if true, the command will executed, all
		 *					otherwise ( like undefined ) it won't be executed
		 */
		commit : function( cmd , execute )
		{

			// commits will always done after the active head state
			if( this._pointer < this._commands.length-1 ){
				this._goToRevision( this._commands.length-1 );
			}

			if( cmd instanceof command ){

				// execute command, if necessary
				if( execute )
					cmd.execute();
				
				this._commands.push(cmd);
				this._pointer = this._commands.length -1;
			}
			else throw "Command is not a instance of Command";
		},

		/**
		 * Brings the state to a given revision. If the target revision is
		 * before the active revision, all revisions between same will be
		 * undone. If the target revision is after the active revision, all
		 * revisions between them will be executed.
		 *
		 * @param {Number} stateNum revision number
		 */
		gotoRev : function( stateNum ){

			var cmdList = this._commands;
			if( stateNum >= 0 && stateNum < this._commands.length ){

				if( stateNum < this._pointer ){
					// undo commands
					while( this._pointer > stateNum ){
						cmdList[ this._pointer ].undo();
						this._pointer--;
					}
				}
				else{
					// redo commands
					while( this._pointer < stateNum ){
						this._pointer++;
						cmdList[ this._pointer ].execute();
					}
				}
			}
			else{

			}
			
			cmdList = null;
		},

		/**
		 * Goes strictly to the active head revision. All revisions between the
		 * active revision and the head revision will be executed.
		 */
		gotoHead : function(){
			if( this._pointer < this._commands.length-1 ){
				this.goToRevision( this._commands.length-1 );
			}
		},

		/**
		 * @return {Number} active revision
		 */
		rev : function(){ 
			return this._pointer;
		},

		/**
		 * @return {Number} head revision
		 */
		headRev : function(){ 
			return this._commands.length-1;
		},

		/**
		 * Marks the current active revision as the head revision and drops
		 * all revisions after the new head revision from the timeline.
		 */
		markHead : function(){
			this._commands.splice( this._pointer+1,
								   this._commands.length -this._pointer -1 );
		}
	});

	var command = meow.Class( /** @lends meow.Command# */ {

		/**
		 * Executes the command.
		 */
		execute : function(){
			
		},

		/**
		 * Undoes the command.
		 */
		undo : function(){

		}
	});

	/**
	 * Command stack is a class for holding commands. It allows a revision based
	 * handling of the commands including moving between single revisions etc.
	 *
	 * @class
	 */
	meow.CommandStack = commandStack;

	/**
	 * Commands represents the command pattern. Allows to define a redoable
	 * action that provides a do and undo function.
	 *
	 * @class
	 */
	meow.Command = command;
})();