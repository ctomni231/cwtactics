@Typed
package cwt_repo_tapsi.commands

import cwt_repo_tapsi.factory.UnitFactory;
import cwt_repo_tapsi.model.map.Unit;
import cwt_repo_tapsi.service.commandSystem.Command;

class ChangeHealth implements Command
{

	short health
	Unit unit
	
	// checks the ranges of the health
	final normalizeHealth = { Unit unit -> if( unit.health < 0 ) unit.health = 0 else if( unit.health > UnitFactory.MAX_HEALTH ) unit.health = UnitFactory.MAX_HEALTH }
	
	@Override
	public void doCommand()
	{
		assert unit
		
		unit.health += health
	}

	@Override
	public void undoCommand()
	{
		assert unit
		
		unit.health -= health
	}
}
