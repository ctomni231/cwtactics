@Typed
package cwt.trigger

import exotec.toolkit.commandList.Command;

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
