package net.wolfTec.logic;

import net.wolfTec.cwt.Constants;
import net.wolfTec.model.Config;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.annotation.Namespace;

@Namespace("cwt") public class GameConfigBean {

	public static boolean														$BEAN	= true;
	public static Object														$LOG;

	private org.stjs.javascript.Map<String, Config>	configs;
	private Array<String>														configNames;

	public void init() {
		configs = JSCollections.$map();
		configNames = JSCollections.$array();

		// game logic
		createConfig("fogEnabled", new Config(0, 1, 1, 1), true);
		createConfig("daysOfPeace", new Config(0, 50, 0, 1), true);
		createConfig("weatherMinDays", new Config(1, 5, 1, 1), true);
		createConfig("weatherRandomDays", new Config(0, 5, 4, 1), true);
		createConfig("round_dayLimit", new Config(0, 999, 0, 1), true);
		createConfig("noUnitsLeftLoose", new Config(0, 1, 0, 1), true);
		createConfig("autoSupplyAtTurnStart", new Config(0, 1, 1, 1), true);
		createConfig("unitLimit", new Config(0, Constants.MAX_UNITS, 0, 5), true);
		createConfig("captureLimit", new Config(0, Constants.MAX_PROPERTIES, 0, 1), true);
		createConfig("timer_turnTimeLimit", new Config(0, 60, 0, 1), true);
		createConfig("timer_gameTimeLimit", new Config(0, 99999, 0, 5), true);
		createConfig("co_getStarCost", new Config(100, 50000, 9000, 100), true);
		createConfig("co_getStarCostIncrease", new Config(0, 50000, 1800, 100), true);
		createConfig("co_getStarCostIncreaseSteps", new Config(0, 50, 10, 1), true);
		createConfig("co_enabledCoPower", new Config(0, 1, 1, 1), true);

		// app config
		createConfig("fastClickMode", new Config(0, 1, 0, 1), false);
		createConfig("forceTouch", new Config(0, 1, 0, 1), false);
		createConfig("animatedTiles", new Config(0, 1, 1, 1), false);
	}

	private void createConfig(String name, Config cfg, boolean gameConfig) {
		configs.$put(name, cfg);
		if (gameConfig) configNames.push(name);
	}

	public Array<String> getConfigNames() {
		return configNames;
	}

	public Config getConfig(String key) {
		return configs.$get(key);
	}

	public Integer getConfigValue(String key) {
		return configs.$get(key).getValue();
	}

	/**
	 * Resets all config values, except the application config values, back to
	 * their default value.
	 */
	public void resetConfig() {
		for (int i = 0; i < configNames.$length(); i++) {
			getConfig(configNames.$get(i)).resetValue();
		}
	}
}
