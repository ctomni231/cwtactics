neko.define("commandSystem",["nekoJSON"],function( JSON ){

    /**
     * Command stack is a class for holding commands. It allows a revision based
     * handling of the commands including moving between single revisions etc.
     *
     * @class
     */
    var CommandStack = neko.Class( /** @lends CommandStack# */ {

        constructor : function(){
            this._commands = [];
            this._pointer = 0;
        },

        /**
         * Commits a command to the command stack and executes it, if wanted
         * by the executor of this function. If the command stack is not at
         * the head state, this function will first goto the head revision and
         * execute all commands, before it processes the command. If you want
         * to drop all changes between the current revision and the head
         * revision, then use markHead() first.
         *
         * @param {Command} cmd command instance, that will be added to the
         *                    stack
         * @param {Boolean} execute if true, the command will executed, all
         *                    otherwise ( like undefined ) it won't be executed
         */
        commit : function( cmd , execute )
        {

            // commits will always done after the active head state
            if( this._pointer < this._commands.length-1 ){
                this._goToRevision( this._commands.length-1 );
            }

            if( cmd instanceof Command ){

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

    /**
     * Commands represents the command pattern. Allows to define a redoable
     * action that provides a do and undo function.
     *
     * @class
     */
    var Command = neko.Class( /** @lends Command# */ {

        /**
         * Executes the command.
         */
        execute : meowEngine.EMPTY_FUNCTION,

        /**
         * Undoes the command.
         */
        undo : meowEngine.EMPTY_FUNCTION
    });

    /**
     *
     * @example
     * // construct interpreter like this
     * // the array as argument is optinal
     * var ipt = new meow.Interpreter([
     *        "c1",function(ctx){},
     *        "c2",function(ctx){ console.log( ctx.x ); },
     *        "c3",function(ctx){}
     * ]);
     *
     * // later you can modify the contexts
     * ipt.putKey( "c4" , function(ctx){} );
     * ipt.removeKey( "c4");
     *
     * // interprete
     * ipt.interprete( meow.toJSON({ _iCode = "c2" , x:10, y:20 , z:30 }) );
     *
     * @class
     */
    var Interpreter = neko.Class( /** @lends Interpreter# */ {

        /**
         *
         */
        constructor : function( contexts ){

            var map = {};

            if( contexts ){

                if( !(contexts instanceof Array) ){
                    throw new Error("contexts has to be an array");
                }

                var e = contexts.length;
                for( var i = 0 ; i < e ; i+=2 ){
                    this.putKey( contexts[i], contexts[i+1] );
                }
            }

            this._ctxMap = map;
        },

        /**
         * Puts an inte2rpreter function into the interpreter.
         *
         * @param {String} key key of the interpreter function
         * @param {Function} f interpreter function
         */
        putKey : function( key , f ){

            if( typeof key !== 'string' || typeof f !== 'function' ||
                typeof this._ctxMap[key] !== 'undefined' ){

                throw "Key:"+key+" already exists";
            }

            this._ctxMap[ key ] = f;
        },

        /**
         * Removes an interpreter function from interpreter.
         *
         * @param {String} key key, that will be removed from interpreter
         */
        removeKey : function( key ){

            if( typeof key !== 'string' ||
                typeof this._ctxMap[key] === 'undefined' ){

                throw "Key:"+key+" does not exists";
            }

            delete this._ctxMap[key];
        },

        /**
         * Interpretes a message.
         *
         * @param {String||Object} ctx context, that will be interpreted
         * @param {Boolean} parseIt if true, the context will be parsed by the
         *                  JSON interpreter, else the object will be used
         *                  directly as argument for the interpreter function
         * @return result of the interpreter function
         */
        interprete : function( ctx , parseIt ){

            ctx = ( parseIt === true )? JSON.parse( ctx ) : ctx;
            var code = ctx._iCode;

            if( typeof this._ctxMap[code] === 'undefined' ){
                throw "No correct interpreter for code:"+code+" exists";
            }

            return this._ctxMap[ code ]( ctx );
        }
    });


    // module API
    return{

        VERSION : 1.0,

        Command      : Command,
        CommandStack : CommandStack,
        Interpreter  : Interpreter
    }
});