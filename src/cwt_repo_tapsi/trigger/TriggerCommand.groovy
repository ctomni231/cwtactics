@Typed
package cwt_repo_tapsi.trigger

import cwt_repo_tapsi.service.commandSystem.Command;

class TriggerCommand implements Command
{
	Condition condition
	Command action
	
	@Override
	void doCommand()
	{
	}
	
	@Override
	public void undoCommand()
	{
	}
}
