package net.wolfTec.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;

import net.wolfTec.Constants;

/**
 * Holds all data which is needed to invoke an model changing game action in
 * CW:T.
 */
public class ActionData {

	/**
	 * Key of the action object that will be invoked.
	 */
	public int	  key;

	/**
	 * 1st. int parameter.
	 */
	public int	  p1;

	/**
	 * 2nd. int parameter.
	 */
	public int	  p2;

	/**
	 * 3rd. int parameter.
	 */
	public int	  p3;

	/**
	 * 4th. int parameter.
	 */
	public int	  p4;

	/**
	 * 5th. int parameter.
	 */
	public int	  p5;

	/**
	 * 1st. string parameter.
	 */
	public String	pStr;

	/**
	 * Resets the data of the action data.
	 */
	public void reset() {
		p1 = Constants.INACTIVE_ID;
		p2 = Constants.INACTIVE_ID;
		p3 = Constants.INACTIVE_ID;
		p4 = Constants.INACTIVE_ID;
		p5 = Constants.INACTIVE_ID;
		pStr = null;
		key = Constants.INACTIVE_ID;
	}

	/**
	 * @param json
	 * @return
	 */
	public static ActionData fromJSON(String json, ActionData data) {
		Array<?> action = (Array<?>) Global.JSON.parse(json);
		if (data == null)
			data = new ActionData();

		// copy data
		data.reset();
		data.key = (Integer) action.$get(0);
		data.p1 = (Integer) action.$get(1);
		data.p2 = (Integer) action.$get(2);
		data.p3 = (Integer) action.$get(3);
		data.p4 = (Integer) action.$get(4);
		data.p5 = (Integer) action.$get(5);
		data.pStr = (String) action.$get(6);

		return data;
	}

	/**
	 * @param data
	 * @return
	 */
	public static String toJSON(ActionData data) {
		Array<Object> toBeSerialized = JSCollections.$array(data.key, data.p1, data.p2, data.p3, data.p4, data.p5, data.pStr);
		return Global.JSON.stringify(toBeSerialized);
	}
}
