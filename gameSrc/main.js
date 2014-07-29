// This is the main entry point of CustomWars:Tactics. Everything necessary for the game will be loaded
// from this place.
//

require("./languages/german");
require("./languages/english");

require("./loading/0_checkSystem");
require("./loading/1_language");
require("./loading/2_startParameters");
/*
require("./loading/3_inputInit");
require("./loading/4_audioInit");
require("./loading/5_audioLoad");
require("./loading/6_imageLoad");
require("./loading/7_portraitCheck");
require("./loading/8_loadMaps");

require("./input/gamepad");
require("./input/mouse");
require("./input/keyboard");
require("./input/touch");
 */

// units
require("./data/units/AAIR");
require("./data/units/ARTY");
require("./data/units/BKBT");
require("./data/units/CRUS");
require("./data/units/LNDR");
require("./data/units/MISS");
require("./data/units/RCKT");
require("./data/units/SUBM");
require("./data/units/WRTK");
require("./data/units/ACAR");
require("./data/units/BCTR");
require("./data/units/BMBR");
require("./data/units/FGTR");
require("./data/units/MDTK");
require("./data/units/NTNK");
require("./data/units/RECN");
require("./data/units/TCTR");
require("./data/units/APCR");
require("./data/units/BKBM");
require("./data/units/BSHP");
require("./data/units/INFT");
require("./data/units/MECH");
require("./data/units/OOZM");
require("./data/units/STLH");
require("./data/units/TNTK");