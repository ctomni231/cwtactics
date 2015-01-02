package net.wolfTec.model;

import net.wolfTec.types.PropertyType;

import org.stjs.javascript.annotation.Namespace;

/**
 * A property is an capturable object on the game map which can be owned by a
 * player.
 */
@Namespace("cwt") public class Property implements PlayerObject {

	public int					points;
	public Player				owner;
	public PropertyType	type;

	@Override public Player getOwner() {
		return owner;
	}

}
