@Typed
package cwt.model.map

import java.util.HashMap;
import cwt.model.Unit;
import cwt.model.Team;
import cwt.utilies.MapUtils;

@Mixin( MapUtils )
class Map
{
	
	HashMap<Short,Unit> unitMap
	List<Team> teams
	Tile[][] mapTiles
	private int height
	private int width	
	
	@Override
	protected void setTeams( List<Team> teams )
	{
		assert teams
		
		this.teams = teams
	}
	
	@Override
	protected void setUnitMap( HashMap<Short, Unit> unitMap )
	{
		assert unitMap
		
		this.unitMap = unitMap
	}
	
	@Override
	protected void setTileMap( Tile[][] mapTiles )
	{
		assert mapTiles
		
		this.mapTiles = mapTiles
	}
	
	int getHeight()
	{
		return height
	}
	
	int getWidth()
	{
		return width
	}
}
