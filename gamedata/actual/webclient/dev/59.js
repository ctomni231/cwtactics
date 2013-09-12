controller.mapAction({
	
	key:"transferMoney",
	hasSubMenu: true,
	
	condition: function( data ){
    if( data.target.x === -1 ) return;
    
		return model.canTransferMoneyToTile(
			model.turnOwner,
			data.target.x,
			data.target.y
		);
	},
	
	prepareMenu: function( data ){
		model.addGoldTransferEntries( model.turnOwner, data.menu );
	},
	
	invoke: function( data ){
		controller.sharedInvokement("transferMoneyByTile",[ 
			model.turnOwner, 
			data.target.x,
			data.target.y,
			data.action.selectedSubEntry 
		]);
	}
	
});