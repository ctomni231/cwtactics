package net.wolfTec.logic;

import org.stjs.javascript.annotation.Namespace;

import net.wolfTec.Constants;
import net.wolfTec.model.$GameRound;
import net.wolfTec.model.Unit;

@Namespace("cwt") public class $Transport {

	private $GameRound			$gameround;

	/**
	 * @return true if the unit with id tid is a transporter, else false.
	 */
	public boolean isTransportUnit(Unit unit) {
		return (unit.getType().maxloads > 0);
	}

	/**
	 * Has a transporter unit with id tid loaded units?
	 * 
	 * @return {boolean} true if yes, else false.
	 */
	public boolean hasLoads(Unit unit) {
		for (int i = 0, e = Constants.MAX_UNITS; i < e; i++) {
			if (unit == $gameround.getUnit(i).getLoadedIn()) return true;
		}
		return false;
	}

}
