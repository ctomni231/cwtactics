@Typed
package cwt_repo_tapsi.model

import cwt_repo_tapsi.model.map.Property;
import cwt_repo_tapsi.utilies.TeamUtils;

/**
 * Player instance of a game round.
 * 
 * @author Radom, Alexander
 * @license Look into "LICENSE" file for further information
 * @version 1
 * @changelog <UL>
 *            <LI>v1
 *            <UL>
 *            <LI>initial version</LI>
 *            </UL>
 *            </LI>
 *       	  </UL>
 */
class Player
{
	private List<Unit> units
	private List<Property> properties
	Team team
	
	Player( Team team )
	{
		assert team
		
		units = []
		properties = []
	}
	
	Unit[] getUnits()
	{
		return units.toArray()
	}
	
	int getNumberOfUnit()
	{
		return units.size()
	}
	
	void addUnit( Unit unit )
	{
		assert unit
		assert !units.any{ it == unit }
		
		units + unit
	}
	
	void removeUnit( Unit unit )
	{
		assert unit
		assert units.any{ it == unit }
		
		units - unit 
	}
	
	Property[] getProperties()
	{
		return properties.toArray()
	}
	
	int getNumberOfProperties()
	{
		return properties.size()
	}
	
	void addProperty( Property property )
	{
		assert properties
		assert !properties.any{ it == property }
		
		properties + property
	}
	
	void removeProperty( Property property )
	{
		assert properties
		assert properties.any{ it == property }
		
		properties - property
	}
}
