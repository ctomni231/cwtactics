neko.define( "objectPool" , function(){

    /**
     * @class
     */
    var ObjectPool = neko.Class( /** @lends meowEngine.ObjectPool# */ {


        /**
         *
         * @param classObj class object, that will be used in this object pool.
         * @param size Determines the size of the cache pool, if -1, the pool
         *               won't have a maximum size.
         * @param cleanMethod the clean method, that will be called on acquire.
         *                      If this function is null, no cleaning step will
         *                      be done.
         */
        constructor : function( classObj, size, cleanMethod )
        {
            if( classObj == null || typeof size !== 'number' ){
                throw "ObjectPool, illegal argument";
            }

            if( size < -1 ){
                throw "Illegal size argument";
            }

            this._clazz = classObj;
            this._pool = [];
            this._size = size;
            this._clean = ( typeof cleanMethod === 'function')?
            cleanMethod : null;
        },

        /**
         * Acquires a new object from the pool. If no object is cached, a new
         * one will be created. Remember, that the constructor is called with
         * no arguments. The cached class should use a empty constructor and
         * a cleaning method, if possible.
         *
         * @augments arguments are used as arguments for the cleaning method
         */
        acquire : function()
        {
            var obj;

            if( this._pool.length > 0 ){
                // use chached instance
                obj = this._pool.pop();
            }
            else{
                // create new instance
                obj = new this._clazz();
            }

            // call cleaning method if necessary
            if( this._clean != null ){
                this._clean.apply( obj , arguments );
            }

            return obj;
        },

        /**
         * Releases an object back to the pool. If the pool has a maximum size
         * and the pool have the length of that maximum size, then the object
         * will not be cached.
         *
         * @param obj object that will be pushed into the pool
         */
        release : function( obj )
        {
            if( !(obj instanceof this._clazz ) ){
                throw "ObjectPool, releasing failed, illegal argument";
            }

            this._pool.push( obj );
        },

        /**
         * @return true if the pool is full, else false.
         */
        isFull : function()
        {
            return ( this._size == -1 )?
            false : this._pool.length == this._size;
        }
    });

    // module API
    return {

        VERSION : 1.0,
        
        ObjectPool : ObjectPool
    }
});