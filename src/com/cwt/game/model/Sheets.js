meow.sys.reqModule("MeowClass")

/**
 * CWT data stack, holds all sheets for the data types
 */
cwt.data =
{
	UnitSheet : Class.$extend({
		HP				: 0,
		fuel			: 0,
		ammo			: 0,
		movePoints		: 0,
		transport		: null
	}),

	TileSheet : Class.$extend({
		
	}),

	WeatherSheet :  Class.$extend({
		chance : 0
	}),

	WeaponSheet :  Class.$extend({
		
	})
}