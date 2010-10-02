@Typed
package cwt_repo_tapsi.model.map


import cwt_repo_tapsi.cards.ResourceCard;
import cwt_repo_tapsi.utilies.TeamUtils;

/**
 * Player instance class.
 * 
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 02.10.2010
 */
@Mixin( TeamUtils )
class Player
{
	private Unit[] units
	ResourceCard resource
	int team
	String name
	
	Player( int team )
	{		
		units = new Unit[50]
		
		this.team = team
	}
	
	@Override
	void setName( String name )
	{
		assert name
		
		this.name = name	
	}
	
	@Override
	void setTeam( int team )
	{	
		assert team >= 0
		
		this.team = team
	}
		
	@Override
	protected void setResource( ResourceCard resource )
	{
		assert resource
		
		this.resource = resource
	}
	
	@Override
	protected void setUnits( Unit[] units )
	{
		assert units
		
		this.units = units
	}
	
	int getNumberOfUnit()
	{
		return units.length
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
}
