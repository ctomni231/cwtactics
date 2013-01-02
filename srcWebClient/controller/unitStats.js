/**
 *
 * @param unit
 */
controller.updateUnitStats = function( unit ){

  // FUEL
  var cFuel = unit.fuel;
  var mFuel = model.sheets.unitSheets[ unit.type ].maxFuel;
  if( cFuel < parseInt(mFuel*0.25, 10) ) unit._clientData_.lowFuel = true;
  else                                   unit._clientData_.lowFuel = false;


  // AMMO
  var cAmmo = unit.ammo;
  var mAmmo = model.sheets.unitSheets[ unit.type ].maxAmmo;
  if( cAmmo <= parseInt(mAmmo*0.25, 10) ) unit._clientData_.lowAmmo = true;
  else                                    unit._clientData_.lowAmmo = false;
  if( mAmmo === 0 )                       unit._clientData_.lowAmmo = false;

  // HP

  var pic = null;
  if( unit.hp <= 90 ){
    if( unit.hp > 80 )      pic = view.getInfoImageForType("HP_9");
    else if( unit.hp > 70 ) pic = view.getInfoImageForType("HP_8");
    else if( unit.hp > 60 ) pic = view.getInfoImageForType("HP_7");
    else if( unit.hp > 50 ) pic = view.getInfoImageForType("HP_6");
    else if( unit.hp > 40 ) pic = view.getInfoImageForType("HP_5");
    else if( unit.hp > 30 ) pic = view.getInfoImageForType("HP_4");
    else if( unit.hp > 20 ) pic = view.getInfoImageForType("HP_3");
    else if( unit.hp > 10 ) pic = view.getInfoImageForType("HP_2");
    else                    pic = view.getInfoImageForType("HP_1");
  }
  unit._clientData_.hpPic = pic;
}