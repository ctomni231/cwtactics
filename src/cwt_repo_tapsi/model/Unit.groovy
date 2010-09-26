@Typed
package cwt_repo_tapsi.model

import cwt_repo_tapsi.data.UnitType;
import cwt_repo_tapsi.model.map.MapObject;

/**
 * Class description.
 * 
 * @author Radom, Alexander
 * @license Look into "LICENSE" file for further information
 * @version 26.09.2010
 * @todo <UL>
 *       <LI>nothing at the moment</LI>
 *       </UL>
 */
class Unit extends MapObject
{
	final static short MAX_HEALTH = 99
	
	@Delegate UnitType type
	short health
	short ammo
	short exp
	short fuel
	boolean canAct
	LoadContainer loads
	
	@Override
	protected void setType( UnitType type )
	{
		assert type 
		
		this.type = type
	}
	
	@Override
	void setFuel( short fuel )
	{
		assert fuel >= 0
		
		this.fuel = fuel
	}
	
	@Override
	void setExp( short exp )
	{
		assert exp >= 0
		
		this.exp = exp
	}
	
	@Override
	void setHealth( short health )
	{
		assert health in (0..MAX_HEALTH)
		
		this.health = health
	}
	
	@Override
	void setAmmo( short ammo )
	{
		assert ammo >= 0
		
		this.ammo = ammo
	}
	
	boolean isTransport()
	{
		assert type
		
		return type.isTransport()
	}
}
