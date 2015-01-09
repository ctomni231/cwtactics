package net.wolfTec.logic;

import org.stjs.javascript.annotation.Namespace;

import net.wolfTec.model.Property;
import net.wolfTec.model.Unit;

@Namespace("cwt") public class CaptureBean {

	public static boolean	$BEAN	= true;

	/**
	 * Returns true, when the given property is neutral, else false.
	 *
	 * @return
	 */
	public boolean isNeutral(Property prop) {
		return prop.owner != null;
	}

	public void makeNeutral(Property prop) {
		prop.owner = null;
	}

	/**
	 * Returns **true** when a **property** can be captured, else **false**.
	 *
	 * @returns {boolean}
	 */
	public boolean canBeCaptured(Property prop) {
		return prop.type.capturePoints > 0;
	}

	/**
	 * Returns **true** when a **unit** can capture a properties, else **false**.
	 *
	 * @return
	 */
	public boolean canCapture(Unit source) {
		return source.getType().captures > 0;
	}

	/**
	 * @returns {boolean}
	 */
	public boolean isCapturing(Unit unit) {
		if (unit.getLoadedIn() != null) {
			return false;
		}

		return false;
		/*
		 * if( unit.x >= 0 ){ var property = model.property_posMap[ unit.x ][ unit.y
		 * ]; if( property !== null && property.capturePoints < 20 ){
		 * unitStatus.CAPTURES = true; } else unitStatus.CAPTURES = false; }
		 */
	}

}
