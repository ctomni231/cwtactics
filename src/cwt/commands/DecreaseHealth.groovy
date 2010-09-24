@Typed
package cwt.commands

import cwt.model.Unit;
import exotec.toolkit.commandList.Command;

class DecreaseHealth extends ChangeHealth
{
	
	@Override 
	void setHealth( short health )
	{
		this.health = -health
	}
}
