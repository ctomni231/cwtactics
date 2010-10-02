@Typed
package cwt_repo_tapsi.model.map

import java.util.HashMap;
import cwt_repo_tapsi.utilies.MapUtils;

@Mixin( MapUtils )
class Map
{
	
	HashMap unitMap
	Tile[][] mapTiles
	private int height
	private int width	
	
	Map()
	{
		
		setUnitMap [:]
	}
		
	@Override
	protected void setUnitMap( HashMap unitMap )
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
