$: MeowConsole.info("Core.js, initializing out and system object")

/* MeowSystem */
sys =
{
	/**
	 * Sends the current thread for a given time into sleep.
	 *
	 * @param time unsigned integer in milliseconds, that will be sleeped
	 */
	sleep : MeowSystem.sleep
}

/* MeowConsole */
out =
{
	log : MeowConsole.info,

	info : MeowConsole.info,

	warn : MeowConsole.warn,

	critical : MeowConsole.critical
}

$: out.info("Core.js, out and system initialized")
