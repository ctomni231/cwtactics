@Typed
package cwt.data

class UnitType implements TypeSheet
{
	byte weight
	short health
	byte movePoints
	byte ammo
	byte canLoad
	byte captures
	byte level
	boolean canHide
	ArmorType armor
	short armorPercentage
	
	boolean isTransport()
	{
		return (canLoad > 0)? true : false
	}
}
