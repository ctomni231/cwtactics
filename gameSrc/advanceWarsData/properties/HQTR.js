cwt.PropertySheet.registerSheet({
  "ID": "HQTR",
  "vision": 0,
  "defense": 4,
  "capturePoints": 20,
  "funds": 1000,
  "looseAfterCaptured": true,
  "changeAfterCaptured": "CITY",
  "notTransferable":true,
  "supply": [
    "INFT",
    "MECH",
    "TIRE_A",
    "TIRE_B",
    "TANK"
  ],
  "repairs": {
    "INFT":2,
    "MECH":2,
    "TIRE_A":2,
    "TIRE_B":2,
    "TANK":2
  },
  "assets":{
    "gfx":"cwt_anim/properties/CWT_HQTR.png",
    "factionSprites":{
      "ORST":"cwt_anim/properties/CWT_HQTR_OS.png",
      "BLMN":"cwt_anim/properties/CWT_HQTR_BM.png",
      "GRET":"cwt_anim/properties/CWT_HQTR_GE.png",
      "YLCM":"cwt_anim/properties/CWT_HQTR_YC.png"
    }
  }
});