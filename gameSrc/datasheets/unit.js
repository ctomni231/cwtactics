/**
 * Unit sheet holds the static data of an unit type.
 *
 * @class
 */
cwt.UnitSheet = my.Class(cwt.SheetDatabase, {

  /**
   * Accepts key,value pairs where the key is a unit sheet id or movetype id or *.
   * The value has to be a positive integer greater than 0.
   *
   * @param key
   * @param value
   * @private
   */
  attackTargetCheck_: function (key, value) {
    if (key === "*") return;
    assert(cwt.UnitSheet.sheets.hasOwnProperty(key));
    assert(value > 0);
  },

  /**
   * Accepts key objects that are unit sheet ids or *.
   *
   * @param key
   * @private
   */
  typeTargetCheck_: function (key) {
    if (key === "*") return;
    assert(cwt.UnitSheet.sheets.hasOwnProperty(key));
  },

  /**
   * Accepts key objects that are unit sheet ids or movetype ids or *.
   *
   * @param key
   * @private
   */
  typeOrMovetypeTargetCheck_: function (key) {
    if (key === "*") return;
    assert(cwt.UnitSheet.sheets.hasOwnProperty(key) ||
      cwt.MovetypeSheet.sheets.hasOwnProperty(key));
  },

  check: function ( sheet ) {

    // check base data
    assert(sheet.cost >= -1);
    assert(sheet.range >= 0 && sheet.range <= MAX_SELECTION_RANGE);
    assert(cwt.MovetypeSheet.sheets.hasOwnProperty(sheet.movetype));
    assert(sheet.vision >= 1 && sheet.vision <= MAX_SELECTION_RANGE);
    assert(sheet.fuel >= 0 && sheet.fuel < 100);

    // check capturing
    assert(sheet.captures === undefined || sheet.captures >= 1);

    // check drain fuel
    assert(sheet.dailyFuelDrain === undefined || (
      sheet.dailyFuelDrain >= 1 && sheet.dailyFuelDrain < 100));
    assert(sheet.dailyFuelDrainHidden === undefined || (
      sheet.dailyFuelDrainHidden >= 2 && sheet.dailyFuelDrainHidden < 100 ));

    // check stealth
    assert(sheet.stealth === void 0 || sheet.stealth === true || sheet.stealth === false);

    // check suicide
    if (sheet.suicide) {
      assert(sheet.suicide.damage >= 1 && sheet.suicide.damage <= 10);
      assert(sheet.suicide.range >= 1 && sheet.suicide.range <= MAX_SELECTION_RANGE);
      if (sheet.suicide.nodamage) {
        cwt.doListCheck(sheet.suicide.nodamage, sheet.typeTargetCheck_);
      }
    }

    // check transport
    if (sheet.maxloads !== undefined || sheet.canload !== undefined) {
      assert(sheet.maxloads >= 1);
      cwt.doListCheck(sheet.canload, sheet.typeOrMovetypeTargetCheck_);
    }

    // check supply
    if (sheet.supply !== undefined) {
      cwt.doListCheck(sheet.supply, sheet.typeOrMovetypeTargetCheck_);
    }

    // check attack
    assert(sheet.ammo === void 0 || (sheet.ammo >= 0 && sheet.ammo < 100));
    if (sheet.attack) {
      assert(sheet.attack.minrange === undefined || sheet.attack.minrange >= 1);
      assert(sheet.attack.maxrange === undefined || (
        sheet.attack.maxrange >= 2 && sheet.attack.maxrange > sheet.attack.minrange ));

      assert(sheet.attack.main_wp || sheet.attack.sec_wp);
      if (sheet.attack.main_wp) cwt.doObjectCheck(sheet.attack.main_wp, sheet.attackTargetCheck_);
      if (sheet.attack.sec_wp) cwt.doObjectCheck(sheet.attack.sec_wp, sheet.attackTargetCheck_);
    }
  }
});