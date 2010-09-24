@Typed
package cwt.model

import groovy.lang.Delegate;
import cwt.model.map.CustomizeAbleGraphic;

class Unit extends CustomizeAbleGraphic
{
	
	short health
	
	Unit()
	{
		shape = new CustomizeAbleGraphic()
	}
}
