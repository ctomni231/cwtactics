controller.action_mapAction({
	
	key:"transferMoney",
	hasSubMenu: true,
	
	condition: function( data ){
    if( data.target.x === -1 ) return;
    
		return model.team_canTransferMoneyToTile(
			model.round_turnOwner,
			data.target.x,
			data.target.y
		);
	},
	
	prepareMenu: function( data ){
		model.team_addGoldTransferEntries( model.round_turnOwner, data.menu );
	},
	
	invoke: function( data ){
		controller.action_sharedInvoke("team_transferMoneyByTile",[ 
			model.round_turnOwner, 
			data.target.x,
			data.target.y,
			data.action.selectedSubEntry 
		]);
	}
	
});