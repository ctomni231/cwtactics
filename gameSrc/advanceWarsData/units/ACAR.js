new cwt.UnitSheet({
  "ID": "ACAR",
  "cost": 30000,
  "range": 5,
  "movetype": "SHIP",
  "vision": 4,
  "fuel": 99,
  "dailyFuelDrain": 1,
  "ammo": 9,
  "maxloads": 2,
  "suppliesloads": true,
  "canload": [
      "AIR"
    ],
  "attack": {
    "main_wp": {
      "FGTR": 100,
      "BMBR": 100,
      "STLH": 100,
      "BCTR": 115,
      "TCTR": 115,
      "BKBM": 120
    },
    "minrange": 3,
    "maxrange": 8
  },
  "assets": {
    "gfx": "cwt_anim/units/CWT_ACAR.png",
    "pri_att_sound": "mg.wav"
  }
});