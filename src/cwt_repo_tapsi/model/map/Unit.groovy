@Typed
package cwt_repo_tapsi.model.map

import cwt_repo_tapsi.data.UnitType;

/**
 * Unit class.
 * 
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 01.10.2010
 */
class Unit extends MapObject
{
	final static short MAX_HEALTH = 99
	
	@Delegate UnitType type
	int health
	int ammo
	int exp
	int fuel
	boolean canAct
	
	@Override
	protected void setType( UnitType type )
	{
		assert type 
		
		this.type = type
	}
	
	@Override
	void setFuel( int fuel )
	{
		assert fuel >= 0
		
		this.fuel = fuel
	}
	
	@Override
	void setExp( int exp )
	{
		assert exp >= 0
		
		this.exp = exp
	}
	
	@Override
	void setHealth( int health )
	{
		assert health in (0..MAX_HEALTH)
		
		this.health = health
	}
	
	@Override
	void setAmmo( int ammo )
	{
		assert ammo >= 0
		
		this.ammo = ammo
	}
	
	@Override
	String toString()
	{
		"ID:"+id+" HP:"+health+" FUEL:"+fuel+" AMMO:"+ammo+" CAN_ACT:"+canAct
	}
}
