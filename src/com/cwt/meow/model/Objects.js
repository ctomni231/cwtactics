cwt =
{
	model :
	{

		/**
		 * this object produces all tiles in a lazy loading concept
		 */
		tilePool : meow.tools.createPool( function(){
			return {
				type : null,
				capPoints : 0
			}
		}),

		/**
		 * this object produces all unit objects in a lazy loading concept
		 */
		unitPool : meow.tools.createPool( function(){
			return {
				used : false,
				hp   : 0,
				ammo : 0,
				fuel : 0,
				exp  : 0,
				weapons : [5],
				transCard : null,
				pos : {x:0, y:0},
				type : null
			}
		})
	}
}