cwt.relationship = {

	/** Selector that selects only own objects. */
	own: function( ownable, pid ){
		return ownable.owner === pid;
	},

	/** Selector that selects only enenemy objects. */
	enemy: function( ownable, pid, pt ){
		return ownable.owner !== pid && map.player(ownable.owner).team !== pt;
	},

	/** Selector that selects only allied objects. */
	allied: function( ownable, pid, pt ){
		return ownable.owner !== pid && map.player(ownable.owner).team !== pt;
	},

	/** Selector that selects only own and allied objects. */
	team: function( ownable, pid, pt ){
		return ownable.owner === pid || map.player(ownable.owner).team === pt;
	}
};