(function(){

	var flow = meow.Class( /** @lends meow.WorkFlow# */{

		STATIC:
		{
			PARAMETER_TAKE_INIT_PARAMETER	: -1,
			PARAMETER_TAKE_RETURN_PARAMETER : -2
		},

		constructor : function(){
			this._works = [];
			this._worksThis = [];
		},

		push : function( func, targetWork, thisObj ){

			var res = false;
			if( typeof thisObj === 'undefined' ) thisObj = null;

			if( typeof targetWork !== 'undefined' && targetWork != null ){

				var indexT = this._works.indexOf(targetWork);

				if( indexT+1 == this._works.length ){

					this._works.push( func );
					this._worksThis.push( thisObj );
				}
				else if( indexT+1 > 0 && indexT+1 < this._works.length ){

					this._works.splice( indexT+1, 0, func );
					this._worksThis.splice( indexT+1, 0, thisObj );
				}
			}
			else{

				this._works.push( func );
				this._worksThis.push( thisObj );
			}

			return res;
		},

		before : function( func, targetWork, thisObj ){

			var res = false;
			if( typeof thisObj === 'undefined' ) thisObj = null;
			
			if( typeof targetWork !== 'undefined' && targetWork != null ){
				
				var indexT = this._works.indexOf(targetWork);
				
				if( indexT == 0 ){
					
					this._works.unshift( func );
					this._worksThis.unshift( thisObj );
				}
				else if( indexT > 0 && indexT < this._works.length ){

					this._works.splice( indexT, 0, func );
					this._worksThis.splice( indexT, 0, thisObj );
				}
			}
			else{
				
				this._works.unshift( func );
				this._worksThis.unshift( thisObj );
			}

			return res;
		},

		removeWork : function( func ){
			
			var index = this._works.indexOf( func );
			
			this._works.slice( index , 1 );
			this._worksThis.slice( index , 1 );
		},

		start : function( parameterFlow , args ){

			var e = this._works.length;
			var i;
			var cW = this._works;
			var cT = this._worksThis;
			var res;
			var takeRes = ( parameterFlow ==
							workflow.PARAMETER_TAKE_RETURN_PARAMETER )

			for( i = 0; i < e; i++ ){
				
				res = cW[i].apply( (( cT[i] != null )? cT[i]: this), args );
			}
		}
	});

	/**
	 * WorkFlow represents a work flow pattern. This means you can combine many
	 * functions together into a chain as a single flow.
	 *
	 * @class
	 */
	meow.WorkFlow = flow;
})();