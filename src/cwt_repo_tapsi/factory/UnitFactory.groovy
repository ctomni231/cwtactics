@Typed
package cwt_repo_tapsi.factory

import cwt_repo_tapsi.model.map.Unit;

/**
 * Unit factory class, provides service of unit creation.
 * 
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 02.10.2010
 */
class UnitFactory extends ObjectPool<Unit>
{
	@Override
	final protected Unit create()
	{
		def unit = new Unit()
		
		return unit
	}
	
	@Override
	final protected void recycle( Unit t )
	{
		t.exp = 0
		t.health = 0
		t.ammo = 0
		t.fuel = 0
		t.canAct = false
		t.type = null
		t.variation = 0
	}
	
	
}
