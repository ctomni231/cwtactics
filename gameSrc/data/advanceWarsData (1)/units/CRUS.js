cwt.UnitSheet.registerSheet({
  "ID": "CRUS",
  "cost": 18000,
  "range": 6,
  "movetype": "SHIP",
  "vision": 3,
  "fuel": 99,
  "ammo": 9,
  "dailyFuelDrain": 1,
  "attack": {
    "main_wp": {
      "CRUS": 25,
      "SUBM": 90,
      "BSHP": 5,
      "ACAR": 5,
      "LNDR": 25,
      "BLBT": 25
    },
    "sec_wp": {
      "FGTR": 85,
      "BMBR": 100,
      "STLH": 100,
      "BCTR": 105,
      "TCTR": 105,
      "BKBM": 120
    }
  },
  "maxloads": 2,
  "canload": [
      "AIR"
    ],
  "assets": {
    "gfx": "cwt_anim/units/CWT_CRUS.png",
    "pri_att_sound": "mg.wav",
    "sec_att_sound": "mg.wav"
  }
});