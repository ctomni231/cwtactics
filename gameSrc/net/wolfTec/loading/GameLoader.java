package net.wolfTec.loading;

import org.stjs.javascript.annotation.Namespace;

import net.wolfTec.system.Logger;
import net.wolfTec.utility.Assert;

@Namespace("cwt") public class GameLoader {

	public static boolean	$BEAN	= true;
	public Logger					$LOG;

	private boolean				loaded;

	public GameLoader() {
		loaded = false;
	}

	/*
	 * 
	 * 1. Check base features 2. Check assets 2.1. Download assets into cache 3.
	 * Load assets from cache 4. Prepare stuff 5. DONE
	 */
	public void loadGame() {
		Assert.isNot(loaded, true);
		
		$LOG.info("Loading game data");

		loaded = true;
	}
}
