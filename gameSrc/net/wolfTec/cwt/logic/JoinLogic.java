package net.wolfTec.cwt.logic;

import org.stjs.javascript.annotation.Namespace;

import net.wolfTec.cwt.model.Unit;

@Namespace("cwt") public interface JoinLogic extends TransportLogic {

	/**
	 * Returns **true** if two units can join each other, else **false**. In
	 * general both **source** and **target** has to be units of the same type and
	 * the target must have 9 or less health points. Transporters cannot join each
	 * other when they contain loaded units.
	 *
	 * @param source
	 * @param target
	 * @returns {boolean}
	 */
	default boolean canJoin(Unit source, Unit target) {
		if (source.getType() != target.getType()) {
			return false;
		}

		// don't increase HP to more then 10
		if (target.getHp() >= 90) {
			return false;
		}

		// do they have loads?
		if (hasLoads(source) || hasLoads(target)) {
			return false;
		}

		return true;
	}

}
