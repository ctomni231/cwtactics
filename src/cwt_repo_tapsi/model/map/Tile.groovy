@Typed
package cwt_repo_tapsi.model.map

import cwt_repo_tapsi.data.TileType;

/**
 * Tile class.
 * 
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 01.10.2010
 */
class Tile extends MapObject
{
	int identicalPos
	@Delegate TileType type
	
	@Override
	protected void setIdenticalPos( int identicalPos )
	{
		assert identicalPos >= 0
		
		this.identicalPos = identicalPos
	}
}
