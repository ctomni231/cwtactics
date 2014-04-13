cwt.Graphics = {

  COLOR_MAP: [
    "BuildingBaseColors.png",
    "UnitBaseColors.png"
  ],

  UNITS: {
    WRTK: "cwt_anim/units/CWT_WRTK.png",
    TNTK: "cwt_anim/units/CWT_TANK.png",
    TCTR: "cwt_anim/units/CWT_TCTR.png",
    SUBM: "cwt_anim/units/CWT_SUBM.png",
    RCKT: "cwt_anim/units/CWT_RCKT.png",
    RECN: "cwt_anim/units/CWT_RECN.png",
    STLH: "cwt_anim/units/CWT_STLH.png",
    INFT: "cwt_anim/units/CWT_INFT.png",
    LNDR: "cwt_anim/units/CWT_LNDR.png",
    MDTK: "cwt_anim/units/CWT_MDTK.png",
    MECH: "cwt_anim/units/CWT_MECH.png",
    MISS: "cwt_anim/units/CWT_MISS.png",
    NTNK: "cwt_anim/units/CWT_NTNK.png",
    FGTR: "cwt_anim/units/CWT_FGTR.png",
    CRUS: "cwt_anim/units/CWT_CRUS.png",
    BSHP: "cwt_anim/units/CWT_BSHP.png",
    BMBR: "cwt_anim/units/CWT_BMBR.png",
    BKBT: "cwt_anim/units/CWT_BKBT.png",
    BKBM: "cwt_anim/units/CWT_BKBM.png",
    BCTR: "cwt_anim/units/CWT_BCTR.png",
    ARTY: "cwt_anim/units/CWT_ARTY.png",
    ACAR: "cwt_anim/units/CWT_ACAR.png"
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
        "cwt_anim/terrain/CWT_SEAS(S).png",
        "cwt_anim/terrain/CWT_SEAS(S)$~~~~~~~~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$~~SS~~~~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SS~~~~~~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$~~~S~~~~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$~~S~~~~~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$~S~~~~~~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$~S~S~~~S.png",
        "cwt_anim/terrain/CWT_SEAS(S)$~SS~~~S~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$~SSS~~SS.png",
        "cwt_anim/terrain/CWT_SEAS(S)$RSSS~~SS.png",
        "cwt_anim/terrain/CWT_SEAS(S)$S~~~~~~~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$S~~S~S~~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$S~S~S~~~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$S~SSSS~~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SRSSSS~~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SS~S~S~S.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSRS~S~S.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSS~S~S~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSSRS~S~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSSS~~~~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSSS~~~S.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSSS~~S~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSSS~~SS.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSSS~S~~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSSS~S~S.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSSS~SS~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSSS~SSS.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSSSS~~~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSSSS~~S.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSSSS~S~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSSSS~SS.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSSSSS~~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSSSSSS~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSSSSS~S.png",
        "cwt_anim/terrain/CWT_SEAS(S)$~SSS~~SS.png",
        "cwt_anim/terrain/CWT_SEAS(S)$~SSS~~S~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSSSS~SS.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSSSSSS~.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSSSSS~S.png",
        "cwt_anim/terrain/CWT_SEAS(S)$SSSS~SSS.png",

        "cwt_anim/terrain/CWT_SEAS(S).png"
      ],
      true,
      false
    ],

    SHOAL: [ "cwt_anim/terrain/CWT_SHOA(BS)$BB~S~S~S.png", true, false ],
    FRST: [ "cwt_anim/terrain/CWT_FRST.png", false, true ],
    MNTN: [ "cwt_anim/terrain/CWT_MNTN.png", false, true ],
    PLIN: [ "cwt_anim/terrain/CWT_PLIN.png", false, false ],
    REEF: [ "cwt_anim/terrain/CWT_REEF(S).png" , true, false ],

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
        "cwt_anim/terrain/CWT_ROAD(O)$OOOO~~~~.png",
        "cwt_anim/terrain/CWT_ROAD(O)$~OOO~~~~.png",
        "cwt_anim/terrain/CWT_ROAD(O)$O~OO~~~~.png",
        "cwt_anim/terrain/CWT_ROAD(O)$OO~O~~~~.png",
        "cwt_anim/terrain/CWT_ROAD(O)$OOO~~~~~.png",
        "cwt_anim/terrain/CWT_ROAD(O)$~~OO~~~~.png",
        "cwt_anim/terrain/CWT_ROAD(O)$~O~O~~~~.png",
        "cwt_anim/terrain/CWT_ROAD(O)$~OO~~~~~.png",
        "cwt_anim/terrain/CWT_ROAD(O)$O~~O~~~~.png",
        "cwt_anim/terrain/CWT_ROAD(O)$O~O~~~~~.png",
        "cwt_anim/terrain/CWT_ROAD(O)$OO~~~~~~.png",
        "cwt_anim/terrain/CWT_ROAD(O)$~~OO~~~~.png"
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

        "cwt_anim/terrain/CWT_BRDG(OSRB)$OOOO~~~~.png",
        "cwt_anim/terrain/CWT_BRDG(OSRB)$~OOO~~~~.png",
        "cwt_anim/terrain/CWT_BRDG(OSRB)$O~OO~~~~.png",
        "cwt_anim/terrain/CWT_BRDG(OSRB)$OO~O~~~~.png",
        "cwt_anim/terrain/CWT_BRDG(OSRB)$OOO~~~~~.png",
        "cwt_anim/terrain/CWT_BRDG(OSRB)$~OO~~~~~.png",
        "cwt_anim/terrain/CWT_BRDG(OSRB)$O~O~~~~~.png",
        "cwt_anim/terrain/CWT_BRDG(OSRB)$O~~O~~~~.png",
        "cwt_anim/terrain/CWT_BRDG(OSRB)$~O~O~~~~.png",
        "cwt_anim/terrain/CWT_BRDG(OSB)$OOSS~~~~.png",
        "cwt_anim/terrain/CWT_BRDG(OSB)$SSOO~~~~.png",
        "cwt_anim/terrain/CWT_BRDG(ORB)$OO~~~~~~.png",
        "cwt_anim/terrain/CWT_BRDG(ORB)$~~OO~~~~.png"
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
        "cwt_anim/terrain/CWT_RIVR(R)$RRRR~~~~.png",
        "cwt_anim/terrain/CWT_RIVR(R)$~RRR~~~~.png",
        "cwt_anim/terrain/CWT_RIVR(R)$R~RR~~~~.png",
        "cwt_anim/terrain/CWT_RIVR(R)$RR~R~~~~.png",
        "cwt_anim/terrain/CWT_RIVR(R)$RRR~~~~~.png",
        "cwt_anim/terrain/CWT_RIVR(R)$~~RR~~~~.png",
        "cwt_anim/terrain/CWT_RIVR(R)$~R~R~~~~.png",
        "cwt_anim/terrain/CWT_RIVR(R)$~RR~~~~~.png",
        "cwt_anim/terrain/CWT_RIVR(R)$R~~R~~~~.png",
        "cwt_anim/terrain/CWT_RIVR(R)$R~R~~~~~.png",
        "cwt_anim/terrain/CWT_RIVR(R)$RR~~~~~~.png",
        "cwt_anim/terrain/CWT_RIVR(R)$~~RR~~~~.png"
      ],
      true,
      false
    ]
  },

  PROPERTIES: {
    BASE: "cwt_anim/properties/CWT_BASE.png",
    CITY: "cwt_anim/properties/CWT_CITY.png",
    PORT: "cwt_anim/properties/CWT_PORT(SBR).png",
    RADAR: "cwt_anim/properties/CWT_RADR.png",
    RUIB: "cwt_anim/inventions/CWT_BRBL-S.png",
    RUIS: "cwt_anim/inventions/CWT_SRBL.png",
    SILO: "cwt_anim/properties/CWT_SILO.png",
    SILO_EMPTY: "cwt_anim/properties/CWT_PLTF.png",
    HQTR: "cwt_anim/properties/CWT_HQTR.png"
  },

  ARROW: "arrow.png",

  DUST: "UnitDust.png",

  ROCKET_FLY: "missileup.png",

  OTHERS: {

    BACKGROUNDS: [
      "mobile/background/RedStar.jpg",
      "mobile/background/YellowComet.jpg",
      "mobile/background/GreenEarth.jpg",
      "mobile/background/BlueMoon.jpg"
    ],

    HP: [
      "symbol/0.png",
      "symbol/1.png",
      "symbol/2.png",
      "symbol/3.png",
      "symbol/4.png",
      "symbol/5.png",
      "symbol/6.png",
      "symbol/7.png",
      "symbol/8.png",
      "symbol/9.png"
    ],

    SYMBOLS: [
      "symbol/hp.png",
      "symbol/ammo.png",
      "symbol/fuel.png",
      "symbol/load.png",
      "symbol/capture.png",
      "symbol/attack.png",
      "symbol/vision.png",
      "symbol/goldboot.png",
      "symbol/unknown.png",
      "symbol/detect.png",
      "symbol/yellowstar.png",
      "symbol/guard.png",
      "symbol/elite.png",
      "symbol/veteran.png"
    ],

    SELECTION: [
      "cwt_anim/wall/CWT_SILO$W~WW~~~~.png",      // N
      "cwt_anim/wall/CWT_SILO$~WWW~~~~.png",      // S
      "cwt_anim/wall/CWT_SILO$WWW~~~~~.png",      // W
      "cwt_anim/wall/CWT_SILO$WW~W~~~~.png",      // E
      "cwt_anim/wall/CWT_SILO$~WW~~~~~.png",      // SW
      "cwt_anim/wall/CWT_SILO$~W~W~~~~.png",      // SE
      "cwt_anim/wall/CWT_SILO$W~W~~~~~.png",      // NW
      "cwt_anim/wall/CWT_SILO$W~~W~~~~.png",      // NE
      "cwt_anim/wall/CWT_SILO$WWWW~~~~.png"       // ALL
    ],

    FOCUS: [
      "unitmove.png",
      "unitatk.png"
    ],

    EXPLOSIONS: [
      "object_explode/UNIT_LAND.png",
      "object_explode/UNIT_AIR.png",
      "object_explode/UNIT_DUST.png",
      "object_explode/UNIT_SEA.png"
    ],

    SMOKE: "smoked.png",

    TRAPPED: "icons/trapsign.png"
  }
};