@Typed
package cwt_repo_tapsi.data

class UnitType implements TypeSheet
{
	byte weight
	short maxHealth
	byte movePoints
	byte maxAmmo
	byte canLoad
	byte captures
	byte moveLevel
	boolean canHide
	ArmorType armor
	short armorPercentage
	private List<ArmorType> canLoad
	
	boolean isTransport()
	{
		return (canLoad > 0)? true : false
	}
}
