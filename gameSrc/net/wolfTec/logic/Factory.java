package net.wolfTec.logic;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.annotation.Namespace;

import net.wolfTec.Constants;
import net.wolfTec.model.Property;

@Namespace("cwt") public class Factory {

	public static boolean	$BEAN	= true;
	private Capture				$capture;
	private GameConfig		$gameconfig;

	/**
	 * Returns **true** when the given **property** is a factory, else **false**.
	 *
	 * @return
	 */
	public boolean isFactory(Property prop) {
		return (prop.type.builds != JSGlobal.undefined);
	}

	/**
	 * Returns **true** when the given **property** is a factory and can produce
	 * something technically, else **false**.
	 * 
	 * @return
	 */
	public boolean canProduce(Property prop) {
		if ($capture.isNeutral(prop)) return false;

		if (!isFactory(prop)) {
			return false;
		}

		// check left manpower
		if (prop.owner.manpower == 0) {
			return false;
		}

		// check unit limit and left slots
		int unitLimit = $gameconfig.getConfigValue("unitLimit");
		if (prop.owner.numberOfUnits >= unitLimit || prop.owner.numberOfUnits >= Constants.MAX_UNITS) {
			return false;
		}

		return true;
	}

}
