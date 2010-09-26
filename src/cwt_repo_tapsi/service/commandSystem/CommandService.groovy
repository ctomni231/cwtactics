@Typed
package cwt_repo_tapsi.service.commandSystem

import cwt_repo_tapsi.structures.ConcurrentModificationList;
import cwt_repo_tapsi.structures.ConcurrentModificationList.Strategy;

/**
 * Simple command service class, that provides the services
 * to add commands and retrieve them later. This class is thread
 * safe and designed for games.
 * 
 * @author Radom, Alexander
 * @license Look into "LICENSE" file for further information
 * @version 1
 * @changelog <UL>
 *            <LI>v1
 *            <UL>
 *            <LI>initial version</LI>
 *            </UL>
 *            </LI>
 *            </UL>
 */
class CommandService
{
	
	private ConcurrentModificationList<Command> commandStack
	
	// static class
	CommandService()
	{
		commandStack = new ConcurrentModificationList<Command>()
	}
	
	
	/**
	 * Adds a command to the command stack.
	 * 
	 * @param strategy list strategy
	 */
	synchronized void insertCommand( Command command , Strategy strategy )
	{
		commandStack.insert command, strategy
	}

	/**
	 * Returns the next command in a given strategy.
	 * 
	 * @param strategy list strategy 
	 */
	synchronized Command nextCommand( Strategy strategy )
	{
		return commandStack.pop(strategy)
	}
}
