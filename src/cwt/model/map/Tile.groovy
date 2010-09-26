@Typed
package cwt.model.map

import groovy.lang.Delegate;
import cwt.model.Unit;

class Tile extends MapObject
{
	short identicalPos
	
	protected void setIdenticalPos( short identicalPos )
	{
		this.identicalPos = identicalPos
	}
}
