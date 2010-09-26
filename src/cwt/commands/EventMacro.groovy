@Typed
package cwt.commands

import exotec.toolkit.commandList.Command;

/**
 * Macro command, used to combine more commands into a single one.
 * 
 * @author Radom, Alexander
 * @license Look into "LICENSE" file for further information
 * @version 25.09.2010
 * @todo <UL>
 *       <LI>nothing at the moment</LI>
 *       </UL>
 */
abstract class EventMacro implements Command
{

	List<Command> commands
	
	@Override
	public void doCommand()
	{
		assert commands
		
		commands.each{ it.doCommand() }
	}

	@Override
	public void undoCommand()
	{
		assert commands
		
		commands.reverse().each{ it.doCommand() }
	}

}
