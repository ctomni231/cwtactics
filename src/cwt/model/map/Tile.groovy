@Typed
package cwt.model.map

import groovy.lang.Delegate;
import cwt.model.Unit;

class Tile extends CustomizeAbleGraphic
{
	@Delegate CustomizeAbleGraphic shape
	Unit unit
	
	Tile()
	{
		shape = new CustomizeAbleGraphic()
	}
}
