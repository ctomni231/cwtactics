require('../../sheets').units.registerSheet({
  "ID": "APCR",
  "cost": 5000,
  "range": 6,
  "movetype": "TANK",
  "vision": 1,
  "fuel": 70,
  "ammo": 0,
  "maxloads": 1,
  "canload": [
      "MV_INFT",
      "MV_MECH"
    ],
  "supply": [
      "*"
    ],
  "assets": {
    "gfx": "cwt_anim/units/CWT_APCR.png"
  }
});