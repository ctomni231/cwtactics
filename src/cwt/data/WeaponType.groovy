@Typed
package cwt.data

import java.util.HashMap;

class WeaponType implements TypeSheet
{
	
	byte minRange
	byte maxRange
	byte usesAmmo
	boolean direct
	boolean canFireAfterMove
	HashMap<ArmorType,Integer> attackable
	
	boolean canAttack( UnitType type )
	{
		assert type
		
		return ( attackable.get(type.armor) )? true : false 
	}
	
	int getDamage( UnitType type )
	{
		assert type
		assert attackable.containsKey(type.armor)
		
		return attackable.get(type.armor)
	}
}
