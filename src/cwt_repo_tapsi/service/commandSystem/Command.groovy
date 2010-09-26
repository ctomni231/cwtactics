@Typed
package cwt_repo_tapsi.service.commandSystem

interface Command
{
	/**
	 * Does the actions of this command.
	 */
	void doCommand()
	
	/**
	 * Undoes the actions of this command.
	 */
	void undoCommand()
}
