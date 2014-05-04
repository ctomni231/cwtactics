cwt.Graphics = {

  COLOR_MAP: [
    "image/BuildingBaseColors.png",
    "image/UnitBaseColors.png"
  ],

  UNITS: {
    WRTK: "image/cwt_anim/units/CWT_WRTK.png",
    TNTK: "image/cwt_anim/units/CWT_TANK.png",
    TCTR: "image/cwt_anim/units/CWT_TCTR.png",
    SUBM: "image/cwt_anim/units/CWT_SUBM.png",
    RCKT: "image/cwt_anim/units/CWT_RCKT.png",
    RECN: "image/cwt_anim/units/CWT_RECN.png",
    STLH: "image/cwt_anim/units/CWT_STLH.png",
    INFT: "image/cwt_anim/units/CWT_INFT.png",
    LNDR: "image/cwt_anim/units/CWT_LNDR.png",
    MDTK: "image/cwt_anim/units/CWT_MDTK.png",
    MECH: "image/cwt_anim/units/CWT_MECH.png",
    MISS: "image/cwt_anim/units/CWT_MISS.png",
    NTNK: "image/cwt_anim/units/CWT_NTNK.png",
    FGTR: "image/cwt_anim/units/CWT_FGTR.png",
    CRUS: "image/cwt_anim/units/CWT_CRUS.png",
    BSHP: "image/cwt_anim/units/CWT_BSHP.png",
    BMBR: "image/cwt_anim/units/CWT_BMBR.png",
    BKBT: "image/cwt_anim/units/CWT_BKBT.png",
    BKBM: "image/cwt_anim/units/CWT_BKBM.png",
    BCTR: "image/cwt_anim/units/CWT_BCTR.png",
    ARTY: "image/cwt_anim/units/CWT_ARTY.png",
    ACAR: "image/cwt_anim/units/CWT_ACAR.png"
  },

  TILES: {

    WATER: [
      {
        "ROAD": "L",
        "PLIN": "L",
        "FRST": "L",
        "MNTN": "L",
        "BRDG": "S",
        "REEF": "S",
        "WATER": "S",
        "RIVER": "RV",
        "DEFAULT": ""
      },
      [
        [ 0, "S", "S", "S", "S", "S", "S", "S", "S" ],
        [ 1, "L", "L", "L", "L", "L", "L", "L", "L" ],
        [ 2, "L", "", "S", "", "L", "", "S", "" ],
        [ 3, "S", "", "L", "", "S", "", "L", "" ],
        [ 4, "L", "", "S", "", "L", "", "L", "" ],
        [ 5, "L", "", "L", "", "L", "", "S", "" ],
        [ 6, "L", "", "L", "", "S", "", "L", "" ],
        [ 6, "S", "", "L", "", "L", "", "L", "" ],
        [ 7, "L", "L", "S", "S", "S", "L", "L", "L" ],
        [ 7, "L", "", "S", "S", "S", "", "L", "" ],
        [ 8, "L", "L", "L", "L", "S", "S", "S", "L" ],
        [ 8, "L", "", "L", "", "S", "S", "S", "" ],
        [ 9, "L", "L", "S", "S", "S", "S", "S", "L" ],
        [ 10, "RV", "L", "S", "S", "S", "S", "S", "L" ],
        [ 11, "S", "L", "L", "L", "L", "L", "L", "L" ],
        [ 12, "S", "S", "S", "L", "L", "L", "L", "L" ],
        [ 13, "S", "", "L", "", "L", "", "S", "S" ],
        [ 14, "S", "", "S", "", "L", "", "S", "" ],
        [ 15, "S", "S", "S", "L", "RV", "L", "S", "S" ],
        [ 16, "S", "", "S", "", "S", "", "L", "" ],
        [ 17, "S" , "S", "S", "S", "S", "L", "RV", "L" ],
        [ 18, "S", "", "L", "", "S", "", "", "" ],
        [ 19, "S", "L", "RV", "L", "S", "S", "S", "S" ],
        [ 20, "S", "L", "S", "L", "S", "L", "S", "L" ],
        [ 21, "S", "L", "S", "S", "S", "L", "S", "L" ],
        [ 22, "S", "L", "S", "L", "S", "S", "S", "L" ],
        [ 23, "S", "L", "S", "S", "S", "S", "S", "L" ],
        [ 24, "S", "S", "S", "L", "S", "L", "S", "L" ],
        [ 25, "S", "S", "S", "S", "S", "L", "S", "L" ],
        [ 26, "S", "S", "S", "L", "S", "S", "S", "L" ],
        [ 27, "S", "S", "S", "S", "S", "S", "S", "L" ],
        [ 28, "S", "L", "S", "L", "S", "L", "S", "S" ],
        [ 29, "S", "L", "S", "S", "S", "L", "S", "S" ],
        [ 30, "S", "L", "S", "L", "S", "S", "S", "S" ],
        [ 31, "S", "L", "S", "S", "S", "S", "S", "S" ],
        [ 32, "S", "S", "S", "L", "S", "L", "S", "S" ],
        [ 33, "S", "S", "S", "L", "S", "S", "S", "S" ],
        [ 34, "S", "S", "S", "S", "S", "L", "S", "S" ],
        [ 35, "L", "L", "S", "S", "S", "S", "S", "S" ],
        [ 35, "L", "S", "S", "S", "S", "S", "S", "L" ],
        [ 35, "L", "S", "S", "S", "S", "S", "S", "S" ],
        [ 36, "L", "L", "S", "L", "S", "", "S", "L" ],
        [ 37, "S", "L", "S", "", "", "", "", "" ],
        [ 38, "", "", "S", "L", "S", "", "", "" ],
        [ 39, "", "", "", "", "S", "L", "S", "" ],
        [ 40, "S", "", "", "", "", "", "S", "L" ],
        [ 41, "", "", "", "", "", "", "", "" ]
      ],
      [
        "image/cwt_anim/terrain/CWT_SEAS(S).png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$~~~~~~~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$~~SS~~~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SS~~~~~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$~~~S~~~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$~~S~~~~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$~S~~~~~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$~S~S~~~S.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$~SS~~~S~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$~SSS~~SS.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$RSSS~~SS.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$S~~~~~~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$S~~S~S~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$S~S~S~~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$S~SSSS~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SRSSSS~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SS~S~S~S.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSRS~S~S.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSS~S~S~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSRS~S~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSS~~~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSS~~~S.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSS~~S~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSS~~SS.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSS~S~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSS~S~S.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSS~SS~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSS~SSS.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSSS~~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSSS~~S.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSSS~S~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSSS~SS.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSSSS~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSSSSS~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSSSS~S.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$~SSS~~SS.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$~SSS~~S~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSSS~SS.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSSSSS~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSSSS~S.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSS~SSS.png",

        "image/cwt_anim/terrain/CWT_SEAS(S).png"
      ],
      true,
      false
    ],

    SHOAL: [ "image/cwt_anim/terrain/CWT_SHOA(BS)$BB~S~S~S.png", true, false ],
    FRST: [ "image/cwt_anim/terrain/CWT_FRST.png", false, true ],
    MNTN: [ "image/cwt_anim/terrain/CWT_MNTN.png", false, true ],
    PLIN: [ "image/cwt_anim/terrain/CWT_PLIN.png", false, false ],
    REEF: [ "image/cwt_anim/terrain/CWT_REEF(S).png" , true, false ],

    ROAD: [
      {
        "ROAD": "R",
        "WATER": "S",
        "RIVER": "RV",
        "PLIN": "L",
        "FRST": "L",
        "MNTN": "L",
        "REEF": "S"
      },
      [
        [0, "R", "R", "R", "R" ],
        [1, "", "R", "R", "R" ],
        [2, "R", "R", "", "R" ],
        [3, "R", "R", "R", "" ],
        [4, "R", "", "R", "R" ],
        [5, "", "R", "", "R" ],
        [6, "", "R", "R", "" ],
        [7, "", "", "R", "R" ],
        [8, "R", "R", "", "" ],
        [9, "R", "", "", "R" ],
        [10, "R", "", "R", "" ],
        [10, "", "", "R", "" ],
        [10, "R", "", "", "" ],
        //["", "", "", "R" ],
        //["", "R", "", "" ],
        [11, "", "", "", "" ]
      ],
      [
        "image/cwt_anim/terrain/CWT_ROAD(O)$OOOO~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$~OOO~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$O~OO~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$OO~O~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$OOO~~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$~~OO~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$~O~O~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$~OO~~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$O~~O~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$O~O~~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$OO~~~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$~~OO~~~~.png"
      ],
      false,
      false
    ],

    BRDG: [
      {
        "ROAD": "R",
        "BRDG": "R",
        "SEAS": "S"
      },
      [

        [0, "R", "R", "R", "R" ],
        [1, "", "R", "R", "R" ],
        [2, "R", "R", "", "R" ],
        [3, "R", "R", "R", "" ],
        [4, "R", "", "R", "R" ],
        [5, "", "", "R", "R" ],
        [6, "R", "", "", "R" ],
        [7, "R", "R", "", "" ],
        [8, "", "R", "R", "" ],
        [9, "R", "S", "R", "S"],
        [10, "S", "R", "S", "R"],
        [11, "R", "", "R", ""],
        [11, "", "", "R", ""],
        [11, "R", "", "", ""],
        //[12,"", "R", "", "R"],
        //[12,"", "", "", "R"],
        //[12,"", "R", "", ""],
        [12, "", "", "", "" ]
      ],
      [

        "image/cwt_anim/terrain/CWT_BRDG(OSRB)$OOOO~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(OSRB)$~OOO~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(OSRB)$O~OO~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(OSRB)$OO~O~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(OSRB)$OOO~~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(OSRB)$~OO~~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(OSRB)$O~O~~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(OSRB)$O~~O~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(OSRB)$~O~O~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(OSB)$OOSS~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(OSB)$SSOO~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(ORB)$OO~~~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(ORB)$~~OO~~~~.png"
      ],
      false,
      false
    ],

    RIVER: [
      {
        "RIVER": "R"
      },
      [
        [0, "R", "R", "R", "R" ],
        [1, "", "R", "R", "R" ],
        [2, "R", "R", "", "R" ],
        [3, "R", "R", "R", "" ],
        [4, "R", "", "R", "R" ],
        [5, "", "R", "", "R" ],
        [6, "", "R", "R", "" ],
        [7, "", "", "R", "R" ],
        [8, "R", "R", "", "" ],
        [9, "R", "", "", "R" ],
        [10, "R", "", "R", "" ],
        [11, "", "", "", "" ]
      ],
      [
        "image/cwt_anim/terrain/CWT_RIVR(R)$RRRR~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$~RRR~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$R~RR~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$RR~R~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$RRR~~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$~~RR~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$~R~R~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$~RR~~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$R~~R~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$R~R~~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$RR~~~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$~~RR~~~~.png"
      ],
      true,
      false
    ]
  },

  PROPERTIES: {
    BASE: "image/cwt_anim/properties/CWT_BASE.png",
    CITY: "image/cwt_anim/properties/CWT_CITY.png",
    PORT: "image/cwt_anim/properties/CWT_PORT(SBR).png",
    RADAR: "image/cwt_anim/properties/CWT_RADR.png",
    RUIB: "image/cwt_anim/inventions/CWT_BRBL-S.png",
    RUIS: "image/cwt_anim/inventions/CWT_SRBL.png",
    SILO: "image/cwt_anim/properties/CWT_SILO.png",
    SILO_EMPTY: "image/cwt_anim/properties/CWT_PLTF.png",
    HQTR: "image/cwt_anim/properties/CWT_HQTR.png"
  },

  ARROW: "image/arrow.png",

  DUST: "image/UnitDust.png",

  ROCKET_FLY: "image/missileup.png",

  OTHERS: {

    MINIMAP: [
      "image/map/AWDS(C)-2x2.png",
      "image/map/AWDS(C)-4x4.png"
    ],

    BACKGROUNDS: [
      "image/mobile/background/RedStar.jpg",
      "image/mobile/background/YellowComet.jpg",
      "image/mobile/background/GreenEarth.jpg",
      "image/mobile/background/BlueMoon.jpg"
    ],

    HP: [
      "image/symbol/0.png",
      "image/symbol/1.png",
      "image/symbol/2.png",
      "image/symbol/3.png",
      "image/symbol/4.png",
      "image/symbol/5.png",
      "image/symbol/6.png",
      "image/symbol/7.png",
      "image/symbol/8.png",
      "image/symbol/9.png"
    ],

    SYMBOLS: [
      "image/symbol/hp.png",
      "image/symbol/ammo.png",
      "image/symbol/fuel.png",
      "image/symbol/load.png",
      "image/symbol/capture.png",
      "image/symbol/attack.png",
      "image/symbol/vision.png",
      "image/symbol/goldboot.png",
      "image/symbol/unknown.png",
      "image/symbol/detect.png",
      "image/symbol/yellowstar.png",
      "image/symbol/guard.png",
      "image/symbol/elite.png",
      "image/symbol/veteran.png"
    ],

    SELECTION: [
      "image/cwt_anim/wall/CWT_SILO$W~WW~~~~.png",      // N
      "image/cwt_anim/wall/CWT_SILO$~WWW~~~~.png",      // S
      "image/cwt_anim/wall/CWT_SILO$WWW~~~~~.png",      // W
      "image/cwt_anim/wall/CWT_SILO$WW~W~~~~.png",      // E
      "image/cwt_anim/wall/CWT_SILO$~WW~~~~~.png",      // SW
      "image/cwt_anim/wall/CWT_SILO$~W~W~~~~.png",      // SE
      "image/cwt_anim/wall/CWT_SILO$W~W~~~~~.png",      // NW
      "image/cwt_anim/wall/CWT_SILO$W~~W~~~~.png",      // NE
      "image/cwt_anim/wall/CWT_SILO$WWWW~~~~.png"       // ALL
    ],

    FOCUS: [
      "image/unitmove.png",
      "image/unitatk.png"
    ],

    EXPLOSIONS: [
      "image/object_explode/UNIT_LAND.png",
      "image/object_explode/UNIT_AIR.png",
      "image/object_explode/UNIT_DUST.png",
      "image/object_explode/UNIT_SEA.png"
    ],

    SMOKE: "image/smoked.png",

    TRAPPED: "image/icons/trapsign.png"
  }
};