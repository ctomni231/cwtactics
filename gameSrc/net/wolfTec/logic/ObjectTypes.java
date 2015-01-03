package net.wolfTec.logic;

import net.wolfTec.model.ArmyType;
import net.wolfTec.model.CoType;
import net.wolfTec.model.MoveType;
import net.wolfTec.model.ObjectType;
import net.wolfTec.model.ObjectTypeDatabase;
import net.wolfTec.model.PropertyType;
import net.wolfTec.model.TileType;
import net.wolfTec.model.UnitType;
import net.wolfTec.model.WeatherType;
import net.wolfTec.system.Logger;

import org.stjs.javascript.annotation.Namespace;

@Namespace("cwt") public class ObjectTypes {

	public static boolean						$BEAN	= true;
	public Logger										$LOG;

	private ObjectTypeDatabase<ArmyType>			armyTypes;
	private ObjectTypeDatabase<MoveType>			moveTypes;
	private ObjectTypeDatabase<UnitType>			unitTypes;
	private ObjectTypeDatabase<TileType>			tileTypes;
	private ObjectTypeDatabase<WeatherType>		weatherTypes;
	private ObjectTypeDatabase<PropertyType>	propertyTypes;
	private ObjectTypeDatabase<CoType>				commanderTypes;

	public void registerSheet(String id, ObjectType sheet) {
		$LOG.error("not implemented yet");
	}

	public ArmyType getArmyType(String id) {
		$LOG.error("not implemented yet");
		return null;
	}

	public MoveType getMoveType(String id) {
		$LOG.error("not implemented yet");
		return null;
	}

	public UnitType getUnitType(String id) {
		$LOG.error("not implemented yet");
		return null;
	}

	public TileType getArmy(String id) {
		$LOG.error("not implemented yet");
		return null;
	}

	public WeatherType getWeather(String id) {
		$LOG.error("not implemented yet");
		return null;
	}

	public PropertyType getPropertyType(String id) {
		$LOG.error("not implemented yet");
		return null;
	}

	public CoType getCommanderType(String id) {
		$LOG.error("not implemented yet");
		return null;
	}
}
